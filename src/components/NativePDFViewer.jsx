import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { EventBus, PDFLinkService, PDFViewer as PDFJSViewer } from 'pdfjs-dist/web/pdf_viewer';
import { getDocument } from '../utils/pdfjs';
import {
  buildOutlineTree,
  buildSearchTerms,
  findBestOutlineMatch,
  flattenOutline,
  resolvePageFromLabels
} from '../utils/pdfNavigation';
import 'pdfjs-dist/web/pdf_viewer.css';
import './NativePDFViewer.css';

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

function OutlineTree({ outline, activeId, onNavigate }) {
  if (!outline.length) {
    return (
      <div className="px-3 py-4 text-sm text-gray-500">
        No table of contents was found for this PDF.
      </div>
    );
  }

  const renderNode = (node) => {
    const isActive = node.id === activeId;
    return (
      <div key={node.id} className="mb-1">
        <button
          type="button"
          onClick={() => node.pageNumber && onNavigate(node.pageNumber, node.id)}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
            isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <span className="flex-1 truncate pr-2">{node.title || 'Untitled section'}</span>
          {typeof node.pageNumber === 'number' && (
            <span className="text-xs text-gray-500">p. {node.pageNumber}</span>
          )}
        </button>
        {node.items && node.items.length > 0 && (
          <div className="ml-3 border-l border-gray-200 pl-3">
            {node.items.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="native-pdf-viewer__toc-scroll">
      {outline.map(renderNode)}
    </div>
  );
}

export default function NativePDFViewer({
  pdfFile,
  reference,
  outlineHints = [],
  initialPageLabel = null,
  className = ''
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const eventBusRef = useRef(null);
  const linkServiceRef = useRef(null);
  const pdfViewerRef = useRef(null);
  const loadingTaskRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [outlineTree, setOutlineTree] = useState([]);
  const [pageLabels, setPageLabels] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentScale, setCurrentScale] = useState(1);
  const [tocOpen, setTocOpen] = useState(false);
  const [autoNavigationFinished, setAutoNavigationFinished] = useState(false);
  const [activeOutlineId, setActiveOutlineId] = useState(null);
  const [outlineLoaded, setOutlineLoaded] = useState(false);
  const [pageLabelsLoaded, setPageLabelsLoaded] = useState(false);

  const resolvePdfSource = (input) => {
    if (!input) return null;

    if (/^https?:/i.test(input) || /^file:/i.test(input)) {
      return input;
    }

    const base = (import.meta.env && import.meta.env.BASE_URL) || './';

    let normalized = input;

    if (normalized.startsWith('/')) {
      normalized = `${base}${normalized.replace(/^[/\\]+/, '')}`;
    } else if (!normalized.startsWith('.')) {
      normalized = `${base}${normalized}`;
    }

    if (typeof window !== 'undefined' && window.location.protocol !== 'file:') {
      try {
        return new URL(normalized, window.location.href).toString();
      } catch (err) {
        console.warn('Failed to resolve absolute PDF URL:', err);
      }
    }

    return normalized;
  };

  useEffect(() => {
    let cancelled = false;
    let pdfInstance = null;

    const container = containerRef.current;
    const viewer = viewerRef.current;
    
    if (!container || !viewer) return undefined;

    const eventBus = new EventBus();
    eventBusRef.current = eventBus;

    const handlePageChange = ({ pageNumber }) => setCurrentPage(pageNumber);
    const handlePagesInit = () => {
      if (!pdfViewerRef.current) return;
      pdfViewerRef.current.currentScaleValue = 'page-actual';
      setCurrentScale(pdfViewerRef.current.currentScale);
    };
    const handleScaleChange = ({ scale }) => setCurrentScale(scale);

    eventBus.on('pagechanging', handlePageChange);
    eventBus.on('pagesinit', handlePagesInit);
    eventBus.on('scalechanging', handleScaleChange);

    const linkService = new PDFLinkService({ eventBus });
    linkServiceRef.current = linkService;

    const pdfViewer = new PDFJSViewer({
      container,
      viewer,
      eventBus,
      linkService,
      textLayerMode: 0, // Disable text layer for now to avoid complexity
      annotationMode: pdfjsLib.AnnotationMode.ENABLE, // Use proper enum
      annotationEditorMode: pdfjsLib.AnnotationEditorType.NONE, // Add this to prevent undefined error
      maxCanvasPixels: 0, // Use this instead of deprecated useOnlyCssZoom
      l10n: null
    });

    pdfViewerRef.current = pdfViewer;
    linkService.setViewer(pdfViewer);

    setLoading(true);
    setError(null);
    setPdfDocument(null);
    setOutlineTree([]);
    setPageLabels(null);
    setNumPages(null);
    setAutoNavigationFinished(false);
    setActiveOutlineId(null);
    setOutlineLoaded(false);
    setPageLabelsLoaded(false);

    const loadPdf = async () => {
      try {
        const resolvedSource = resolvePdfSource(pdfFile);
        
        if (!resolvedSource) {
          throw new Error('Missing PDF source.');
        }

        let loadingTask;
        if (/^https?:/i.test(resolvedSource)) {
          loadingTask = getDocument({ url: resolvedSource });
        } else {
          let fileData = null;

          if (window.electronAPI?.readFile) {
            fileData = await window.electronAPI.readFile(resolvedSource);
          } else {
            const response = await fetch(resolvedSource);
            
            if (!response.ok) {
              throw new Error(`Unexpected response (${response.status}) while loading PDF.`);
            }
            const buffer = await response.arrayBuffer();
            fileData = new Uint8Array(buffer);
          }

          if (!fileData) {
            throw new Error('Unable to read PDF file data.');
          }

          if (!(fileData instanceof Uint8Array)) {
            if (ArrayBuffer.isView(fileData)) {
              fileData = new Uint8Array(fileData.buffer);
            } else if (fileData instanceof ArrayBuffer) {
              fileData = new Uint8Array(fileData);
            } else if (fileData?.data) {
              fileData = new Uint8Array(fileData.data);
            } else {
              fileData = new Uint8Array(fileData);
            }
          }

          loadingTask = getDocument({ data: fileData });
        }

        loadingTaskRef.current = loadingTask;
        const pdf = await loadingTask.promise;

        if (cancelled) {
          await pdf.destroy();
          loadingTaskRef.current = null;
          return;
        }

        pdfInstance = pdf;
        loadingTaskRef.current = null;
        setPdfDocument(pdf);
        setNumPages(pdf.numPages);

        pdfViewer.setDocument(pdf);
        linkService.setDocument(pdf, null);
        setLoading(false);

        try {
          const outline = await pdf.getOutline();
          if (!cancelled) {
            const tree = await buildOutlineTree(pdf, outline || []);
            setOutlineTree(tree);
          }
        } catch (outlineError) {
          console.warn('Failed to read PDF outline:', outlineError);
        } finally {
          if (!cancelled) setOutlineLoaded(true);
        }

        try {
          const labels = await pdf.getPageLabels();
          if (!cancelled) {
            setPageLabels(Array.isArray(labels) ? labels : null);
          }
        } catch (labelError) {
          console.warn('Failed to read PDF page labels:', labelError);
        } finally {
          if (!cancelled) setPageLabelsLoaded(true);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load PDF:', err);
        setError(err?.message || 'Failed to load PDF document.');
        setLoading(false);
        loadingTaskRef.current = null;
        setOutlineLoaded(true);
        setPageLabelsLoaded(true);
      }
    };

    loadPdf();

    return () => {
      cancelled = true;

      eventBus.off('pagechanging', handlePageChange);
      eventBus.off('pagesinit', handlePagesInit);
      eventBus.off('scalechanging', handleScaleChange);

      if (pdfViewerRef.current) {
        try {
          pdfViewerRef.current.cleanup?.();
        } catch (e) {
          // Silently ignore cleanup errors
        }
        try {
          pdfViewerRef.current.setDocument(null);
        } catch (e) {
          // Silently ignore setDocument errors
        }
        pdfViewerRef.current = null;
      }

      if (linkServiceRef.current) {
        try {
          linkServiceRef.current.setDocument(null, null);
        } catch (e) {
          // Silently ignore linkService cleanup errors
        }
        linkServiceRef.current = null;
      }

      eventBusRef.current = null;

      if (pdfInstance) {
        pdfInstance.destroy().catch(() => {});
      } else if (loadingTaskRef.current) {
        loadingTaskRef.current.destroy?.();
      }

      loadingTaskRef.current = null;
    };
  }, [pdfFile]);

  const flatOutline = useMemo(() => flattenOutline(outlineTree), [outlineTree]);

  useEffect(() => {
    if (!flatOutline.length) {
      setActiveOutlineId(null);
      return;
    }

    const best = flatOutline
      .filter((node) => typeof node.pageNumber === 'number')
      .reduce((acc, node) => {
        if (node.pageNumber == null) return acc;
        if (node.pageNumber > currentPage) return acc;
        if (!acc) return node;
        if (node.pageNumber >= acc.pageNumber) return node;
        return acc;
      }, null);

    setActiveOutlineId(best ? best.id : null);
  }, [flatOutline, currentPage]);

  useEffect(() => {
    if (!pdfDocument || !pdfViewerRef.current || autoNavigationFinished) return;
    if (!outlineLoaded || !pageLabelsLoaded) return;

    const attemptNavigation = () => {
      // Try outline matching first if we have outline hints - this is more accurate
      const searchTerms = buildSearchTerms(reference, outlineHints);
      if (outlineTree.length && searchTerms.length && outlineHints?.length > 0) {
        const match = findBestOutlineMatch(outlineTree, searchTerms);
        if (match?.pageNumber) {
          pdfViewerRef.current.currentPageNumber = match.pageNumber;
          setCurrentPage(match.pageNumber);
          setActiveOutlineId(match.id);
          setAutoNavigationFinished(true);
          return;
        }
      }

      // Fall back to page label resolution if no outline match found
      const pageFromLabels = resolvePageFromLabels(pageLabels, reference, initialPageLabel);
      if (pageFromLabels) {
        pdfViewerRef.current.currentPageNumber = pageFromLabels;
        setCurrentPage(pageFromLabels);
        setAutoNavigationFinished(true);
        return;
      }

      // Last resort: try outline matching without outline hints requirement
      if (outlineTree.length && searchTerms.length) {
        const match = findBestOutlineMatch(outlineTree, searchTerms);
        if (match?.pageNumber) {
          pdfViewerRef.current.currentPageNumber = match.pageNumber;
          setCurrentPage(match.pageNumber);
          setActiveOutlineId(match.id);
          setAutoNavigationFinished(true);
          return;
        }
      }

      setAutoNavigationFinished(true);
    };

    attemptNavigation();
  }, [
    pdfDocument,
    outlineTree,
    pageLabels,
    reference,
    outlineHints,
    initialPageLabel,
    autoNavigationFinished,
    outlineLoaded,
    pageLabelsLoaded
  ]);

  const goToPage = (page) => {
    if (!pdfViewerRef.current || typeof page !== 'number') return;
    const clamped = Math.min(Math.max(page, 1), numPages || page);
    pdfViewerRef.current.currentPageNumber = clamped;
    setCurrentPage(clamped);
  };

  const handleOutlineNavigate = (page, outlineId) => {
    goToPage(page);
    setActiveOutlineId(outlineId);
  };

  const adjustZoom = (direction) => {
    if (!pdfViewerRef.current) return;
    const current = pdfViewerRef.current.currentScale;
    const currentIndex = ZOOM_LEVELS.findIndex((value) => current <= value + 0.001);
    const fallbackIndex = currentIndex === -1 ? ZOOM_LEVELS.findIndex((value) => value >= current) : currentIndex;
    const index = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, fallbackIndex + direction));
    const next = ZOOM_LEVELS[index];
    pdfViewerRef.current.currentScale = next;
    setCurrentScale(next);
  };

  const zoomIn = () => adjustZoom(1);
  const zoomOut = () => adjustZoom(-1);

  const fitWidth = () => {
    if (!pdfViewerRef.current) return;
    pdfViewerRef.current.currentScaleValue = 'page-width';
    setCurrentScale(pdfViewerRef.current.currentScale);
  };

  const fitPage = () => {
    if (!pdfViewerRef.current) return;
    pdfViewerRef.current.currentScaleValue = 'page-fit';
    setCurrentScale(pdfViewerRef.current.currentScale);
  };

  const actualSize = () => {
    if (!pdfViewerRef.current) return;
    pdfViewerRef.current.currentScaleValue = 'page-actual';
    setCurrentScale(pdfViewerRef.current.currentScale);
  };

  const onPageInputChange = (event) => {
    const { value } = event.target;
    const numeric = Number.parseInt(value, 10);
    if (!Number.isNaN(numeric)) {
      goToPage(numeric);
    }
  };

  const scaleLabel = useMemo(() => `${Math.round((currentScale || 1) * 100)}%`, [currentScale]);

  return (
    <div className={`native-pdf-viewer ${className}`}>
      <aside className={`native-pdf-viewer__toc ${tocOpen ? 'open' : ''}`}>
        <div className="native-pdf-viewer__toc-header">
          <div className="font-semibold text-sm text-gray-700">Table of Contents</div>
          <button
            type="button"
            onClick={() => setTocOpen(false)}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Hide table of contents"
          >
            ×
          </button>
        </div>
        <OutlineTree outline={outlineTree} activeId={activeOutlineId} onNavigate={handleOutlineNavigate} />
      </aside>

      <div className="native-pdf-viewer__content">
        <div className="native-pdf-viewer__toolbar">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTocOpen((open) => !open)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {tocOpen ? 'Hide TOC' : 'Show TOC'}
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ←
              </button>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <input
                  type="number"
                  min={1}
                  max={numPages || 1}
                  value={currentPage}
                  onChange={onPageInputChange}
                  className="h-8 w-16 rounded-md border border-gray-300 px-2 text-center text-sm"
                />
                <span className="text-xs text-gray-500">/ {numPages || '—'}</span>
              </div>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={numPages ? currentPage >= numPages : false}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={zoomOut}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-16 text-center text-sm text-gray-700">{scaleLabel}</span>
              <button
                type="button"
                onClick={zoomIn}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <button
                type="button"
                onClick={fitWidth}
                className="rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-100"
              >
                Fit Width
              </button>
              <button
                type="button"
                onClick={fitPage}
                className="rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-100"
              >
                Fit Page
              </button>
              <button
                type="button"
                onClick={actualSize}
                className="rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-100"
              >
                100%
              </button>
            </div>
          </div>
        </div>

        <div className="native-pdf-viewer__stage">
          {loading && (
            <div className="native-pdf-viewer__status">Loading PDF…</div>
          )}

          {error && (
            <div className="native-pdf-viewer__status native-pdf-viewer__status--error">
              <div className="font-semibold">{error}</div>
              <div className="text-sm text-gray-600">Please verify the PDF path and try again.</div>
            </div>
          )}

          <div 
            ref={containerRef} 
            className="native-pdf-viewer__container"
            style={{ display: (loading || error) ? 'none' : 'block' }}
          >
            <div ref={viewerRef} className="pdfViewer" />
          </div>
        </div>
      </div>
    </div>
  );
}
