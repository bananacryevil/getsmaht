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
const MIN_SCALE = 0.25;
const MAX_SCALE = 5;
const WHEEL_ZOOM_STEP = 1.06; // per wheel tick when ctrl is pressed
const KEY_ZOOM_STEP = 1.15; // per key press zoom factor
const SAVE_DEBOUNCE_MS = 150; // debounce for persisting prefs

function isEditableElement(target) {
  if (!target) return false;
  const tag = (target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  const isContentEditable = !!target.isContentEditable;
  return isContentEditable;
}

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
  const [restoredState, setRestoredState] = useState(false);

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

  const storageKeyInfo = useMemo(() => {
    if (!pdfFile) return null;

    const makeStableId = (input) => {
      try {
        const base = typeof window !== 'undefined' ? window.location.href : 'file:///';
        const u = new URL(input, base);
        let p = decodeURIComponent(u.pathname || '');
        p = p.replace(/^\/(?=[A-Za-z]:\\)/, '');
        p = p.replace(/\\/g, '/');
        p = p.replace(/\/+/g, '/');
        p = p.replace(/^([A-Za-z]):\//, (m, d) => `${d.toLowerCase()}:\/`);
        return p || String(input);
      } catch (_) {
        try {
          let s = String(input);
          s = s.replace(/\\/g, '/');
          s = s.replace(/\/+/g, '/');
          s = s.replace(/^\.\//, '');
          s = s.replace(/^([A-Za-z]):\//, (m, d) => `${d.toLowerCase()}:\/`);
          return s;
        } catch {
          return String(input);
        }
      }
    };

    let resolved = null;
    try { resolved = resolvePdfSource(pdfFile) || pdfFile; } catch { resolved = pdfFile; }
    const stableId = makeStableId(resolved);
    const newKey = `nativePdfViewer:v2:${stableId}`;

    const legacyKeys = [];
    try { legacyKeys.push(`nativePdfViewer:${resolvePdfSource(pdfFile)}`); } catch {}
    legacyKeys.push(`nativePdfViewer:${String(pdfFile)}`);

    return { newKey, legacyKeys };
  }, [pdfFile]);

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
      // Restore saved zoom as soon as pages initialize (page restore handled elsewhere)
      try {
        if (storageKeyInfo) {
          const { newKey, legacyKeys } = storageKeyInfo;
          let raw = localStorage.getItem(newKey);
          if (!raw) {
            for (const k of legacyKeys) {
              raw = localStorage.getItem(k);
              if (raw) break;
            }
          }
          if (raw) {
            const data = JSON.parse(raw);
            if (typeof data?.scale === 'number') {
              const clamped = Math.min(Math.max(data.scale, MIN_SCALE), MAX_SCALE);
              pdfViewerRef.current.currentScale = clamped;
              setCurrentScale(pdfViewerRef.current.currentScale);
            }
          }
        }
      } catch {}
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
  setRestoredState(false);

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

  const resetSavedPrefs = () => {
    // Clear saved state for this PDF and reset zoom to 100%
    try {
      if (storageKeyInfo) {
        const { newKey, legacyKeys } = storageKeyInfo;
        try { if (newKey) localStorage.removeItem(newKey); } catch {}
        for (const k of legacyKeys || []) {
          try { localStorage.removeItem(k); } catch {}
        }
      }
    } catch {}
    actualSize();
  };

  // Smooth, continuous zoom helpers
  const setZoom = (targetScale, anchor) => {
    if (!pdfViewerRef.current || !containerRef.current || !viewerRef.current) return;
    const clamped = Math.min(Math.max(targetScale, MIN_SCALE), MAX_SCALE);
    const container = containerRef.current;
    const viewer = viewerRef.current;
    const prevScale = pdfViewerRef.current.currentScale || 1;

    // Compute anchor defaults: center of container
    const containerRect = container.getBoundingClientRect();
    const viewerRect = viewer.getBoundingClientRect();
    const anchorX = (anchor?.clientX ?? (containerRect.left + containerRect.width / 2));
    const anchorY = (anchor?.clientY ?? (containerRect.top + containerRect.height / 2));

    // Position within container
    const dx = anchorX - containerRect.left;
    const dy = anchorY - containerRect.top;

    // Position within scroll content
    const preContentX = container.scrollLeft + dx;
    const preContentY = container.scrollTop + dy;

    // Apply scale
    pdfViewerRef.current.currentScale = clamped;
    setCurrentScale(clamped);

    // After layout, adjust scroll to keep anchor point stable
    // Use rAF to ensure measurements are updated
    requestAnimationFrame(() => {
      const scaleRatio = (clamped / prevScale) || 1;
      const postContentX = preContentX * scaleRatio;
      const postContentY = preContentY * scaleRatio;
      container.scrollLeft = Math.max(0, postContentX - dx);
      container.scrollTop = Math.max(0, postContentY - dy);
    });
  };

  const animatedZoomTo = (targetScale, anchor) => {
    if (!pdfViewerRef.current) return;
    const start = pdfViewerRef.current.currentScale || 1;
    const end = Math.min(Math.max(targetScale, MIN_SCALE), MAX_SCALE);
    const duration = 140;
    const startTime = performance.now();

    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easeInOut(t);
      const scale = start + (end - start) * eased;
      setZoom(scale, anchor);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Keyboard shortcuts and wheel zoom handlers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const handleWheel = (e) => {
      if (!e.ctrlKey) return; // only hijack when Ctrl is pressed
      e.preventDefault();
      const current = pdfViewerRef.current?.currentScale || 1;
      const delta = e.deltaY;
      // Normalize: negative delta -> zoom in; positive -> out
      const factor = delta < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
      const target = current * factor;
      setZoom(target, { clientX: e.clientX, clientY: e.clientY });
    };

    const handleKeyDown = (e) => {
      // Avoid interfering with typing in inputs
      if (isEditableElement(e.target)) return;

      // Zoom controls
      if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        // Ctrl + 0: reset to 100%
        if (e.key === '0') {
          e.preventDefault();
          animatedZoomTo(1);
          return;
        }
        // Ctrl + '+' or '=' (US keyboards use '=' with shift for '+')
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          const current = pdfViewerRef.current?.currentScale || 1;
          animatedZoomTo(current * KEY_ZOOM_STEP);
          return;
        }
        // Ctrl + '-'
        if (e.key === '-') {
          e.preventDefault();
          const current = pdfViewerRef.current?.currentScale || 1;
          animatedZoomTo(current / KEY_ZOOM_STEP);
          return;
        }
      }

      // Page navigation with arrows
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPage((currentPage || 1) - 1);
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToPage((currentPage || 1) + 1);
          return;
        }
        if (e.key === 'Home') {
          e.preventDefault();
          goToPage(1);
          return;
        }
        if (e.key === 'End') {
          e.preventDefault();
          if (numPages) goToPage(numPages);
          return;
        }
        if (e.key === ' ') {
          // Space to scroll one viewport down, Shift+Space up
          e.preventDefault();
          const block = e.shiftKey ? -1 : 1;
          container.scrollBy({ top: block * container.clientHeight * 0.9, behavior: 'smooth' });
          return;
        }
        if (e.key === 'PageDown') {
          e.preventDefault();
          container.scrollBy({ top: container.clientHeight * 0.9, behavior: 'smooth' });
          return;
        }
        if (e.key === 'PageUp') {
          e.preventDefault();
          container.scrollBy({ top: -container.clientHeight * 0.9, behavior: 'smooth' });
          return;
        }
        // Fit toggles
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          fitWidth();
          return;
        }
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          fitPage();
          return;
        }
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          setTocOpen((open) => !open);
          return;
        }
      }
    };

    const handleDoubleClick = (e) => {
      // Double-click to zoom in; Shift + double-click to zoom out
      if (isEditableElement(e.target)) return;
      e.preventDefault();
      const current = pdfViewerRef.current?.currentScale || 1;
      const target = e.shiftKey ? current / KEY_ZOOM_STEP : current * KEY_ZOOM_STEP;
      animatedZoomTo(target, { clientX: e.clientX, clientY: e.clientY });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    container.addEventListener('dblclick', handleDoubleClick, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      container.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [currentPage, numPages]);

  // Persist last page and zoom for this document (debounced)
  useEffect(() => {
    if (!storageKeyInfo || !pdfDocument) return;
    const { newKey } = storageKeyInfo;
    const data = { page: currentPage, scale: currentScale };
    const id = setTimeout(() => {
      try { localStorage.setItem(newKey, JSON.stringify(data)); } catch {}
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [storageKeyInfo, pdfDocument, currentPage, currentScale]);

  // Restore last page/scale using stable key with legacy migration
  useEffect(() => {
    if (!storageKeyInfo) return;
    if (!pdfDocument || !pdfViewerRef.current) return;
    if (restoredState) return;
    if (!autoNavigationFinished) return;

    try {
      const { newKey, legacyKeys } = storageKeyInfo;
      let raw = localStorage.getItem(newKey);
      let fromLegacyKey = null;
      if (!raw) {
        for (const k of legacyKeys) {
          raw = localStorage.getItem(k);
          if (raw) { fromLegacyKey = k; break; }
        }
      }
      if (!raw) {
        setRestoredState(true);
        return;
      }
      const data = JSON.parse(raw);
      if (!reference && !initialPageLabel && typeof data?.page === 'number') {
        goToPage(data.page);
      }
      if (typeof data?.scale === 'number') {
        pdfViewerRef.current.currentScale = Math.min(Math.max(data.scale, MIN_SCALE), MAX_SCALE);
        setCurrentScale(pdfViewerRef.current.currentScale);
      }
      if (fromLegacyKey) {
        try {
          localStorage.setItem(newKey, raw);
          localStorage.removeItem(fromLegacyKey);
        } catch {}
      }
    } catch {
      // ignore restore errors
    } finally {
      setRestoredState(true);
    }
  }, [storageKeyInfo, pdfDocument, autoNavigationFinished, reference, initialPageLabel, restoredState]);

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
              title="Toggle table of contents (T)"
            >
              {tocOpen ? 'Hide TOC' : 'Show TOC'}
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                title="Previous page (Left Arrow)"
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
                  title="Go to page (Enter number)"
                />
                <span className="text-xs text-gray-500">/ {numPages || '—'}</span>
              </div>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={numPages ? currentPage >= numPages : false}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                title="Next page (Right Arrow)"
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
                title="Zoom out (Ctrl -)"
              >
                −
              </button>
              <span className="w-16 text-center text-sm text-gray-700">{scaleLabel}</span>
              <button
                type="button"
                onClick={zoomIn}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                title="Zoom in (Ctrl +)"
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <button
                type="button"
                onClick={fitWidth}
                className="rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-100"
                title="Fit width (F)"
              >
                Fit Width
              </button>
              <button
                type="button"
                onClick={fitPage}
                className="rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-100"
                title="Fit page (P)"
              >
                Fit Page
              </button>
              <button
                type="button"
                onClick={actualSize}
                className="rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-100"
                title="Actual size 100% (Ctrl 0)"
              >
                100%
              </button>
              <button
                type="button"
                onClick={resetSavedPrefs}
                className="rounded-md border border-red-300 px-2 py-1 text-red-700 hover:bg-red-50"
                title="Clear saved page & zoom preference for this PDF and reset to 100%"
              >
                Reset Pref
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
