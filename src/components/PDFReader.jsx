import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from '../utils/pdfWorker';
import PDFTableOfContents from './PDFTableOfContents';
import { findBestMatchingChapter } from '../utils/chapterDetection';
import './PDFReader.css';

// Import CSS for proper rendering (v7.7.3 compatible)
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

export default function PDFReader({ pdfFile, initialPage = 1, onClose, className = "", book = null, readingReference = "" }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [pdfOutline, setPdfOutline] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [smartPageDetected, setSmartPageDetected] = useState(false);
  const [fitMode, setFitMode] = useState('width'); // 'width', 'height', 'page', 'custom'
  const [pageWidth, setPageWidth] = useState(null);
  const [pageHeight, setPageHeight] = useState(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  const containerRef = useRef(null);
  const pageRef = useRef(null);

  const onDocumentLoadSuccess = useCallback(async (pdf) => {
    setNumPages(pdf.numPages);
    setPdfDocument(pdf);
    
    try {
      // Get the PDF outline (bookmarks/table of contents)
      const outline = await pdf.getOutline();
      if (outline) {
        setPdfOutline(outline);
        
        // Try to find the best matching chapter if we have a reading reference
        if (readingReference && !smartPageDetected) {
          setTimeout(async () => {
            try {
              const smartPage = await findBestMatchingChapter(pdf, outline, readingReference);
              if (smartPage && smartPage > 1) {
                console.log(`Smart navigation: Found chapter at page ${smartPage} for "${readingReference}"`);
                setPageNumber(smartPage);
                setSmartPageDetected(true);
              }
            } catch (err) {
              console.warn('Smart chapter detection failed:', err);
            }
          }, 500);
        }
      }
    } catch (err) {
      console.warn('Could not load PDF outline:', err);
    }
    
    setLoading(false);
    setError(null);
  }, [readingReference, initialPage, smartPageDetected]);

  const onDocumentLoadError = useCallback((error) => {
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
  }, []);

  const goToPreviousPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages || prev, prev + 1));
  };

  const goToPage = (page) => {
    const pageNum = parseInt(page, 10);
    if (pageNum >= 1 && pageNum <= (numPages || 1)) {
      setPageNumber(pageNum);
    }
  };

  // Modern zoom controls
  const zoomPresets = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0];
  
  const setZoomLevel = (newScale) => {
    setScale(newScale);
    setFitMode('custom');
  };

  const zoomIn = () => {
    const currentIndex = zoomPresets.findIndex(preset => preset >= scale);
    const nextIndex = Math.min(zoomPresets.length - 1, currentIndex + 1);
    setZoomLevel(zoomPresets[nextIndex]);
  };

  const zoomOut = () => {
    const currentIndex = zoomPresets.findIndex(preset => preset >= scale);
    const prevIndex = Math.max(0, currentIndex - 1);
    setZoomLevel(zoomPresets[prevIndex]);
  };

  const fitToWidth = () => {
    if (pageWidth && containerSize.width > 0) {
      const newScale = (containerSize.width - 40) / pageWidth; // 40px padding
      setScale(newScale);
      setFitMode('width');
    }
  };

  const fitToHeight = () => {
    if (pageHeight && containerSize.height > 0) {
      const newScale = (containerSize.height - 120) / pageHeight; // 120px for controls
      setScale(newScale);
      setFitMode('height');
    }
  };

  const fitToPage = () => {
    if (pageWidth && pageHeight && containerSize.width > 0 && containerSize.height > 0) {
      const scaleX = (containerSize.width - 40) / pageWidth;
      const scaleY = (containerSize.height - 120) / pageHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
      setFitMode('page');
    }
  };

  const resetZoom = () => {
    setZoomLevel(1.0);
  };

  const handleChapterClick = (page) => {
    setPageNumber(page);
  };

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen);
  };

  // Track container size for fit modes
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [isTocOpen]);

  // Auto-fit when container or page size changes
  useEffect(() => {
    if (pageWidth && pageHeight && containerSize.width > 0) {
      if (fitMode === 'width') fitToWidth();
      else if (fitMode === 'height') fitToHeight();
      else if (fitMode === 'page') fitToPage();
    }
  }, [pageWidth, pageHeight, containerSize, fitMode]);

  // Page size callback
  const onPageLoadSuccess = useCallback((page) => {
    const { width, height } = page.getViewport({ scale: 1.0 });
    setPageWidth(width);
    setPageHeight(height);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return; // Don't interfere with input fields
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextPage();
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Scroll up in the PDF container
          if (containerRef.current) {
            containerRef.current.scrollBy({ top: -50, behavior: 'smooth' });
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          // Scroll down in the PDF container
          if (containerRef.current) {
            containerRef.current.scrollBy({ top: 50, behavior: 'smooth' });
          }
          break;
        case ' ':
          e.preventDefault();
          goToNextPage();
          break;
        case 'Home':
          e.preventDefault();
          goToPage(1);
          break;
        case 'End':
          e.preventDefault();
          goToPage(numPages);
          break;
        case '=':
        case '+':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
      }

      // Ctrl+shortcuts (keep Ctrl+0 for reset zoom)
      if (e.ctrlKey) {
        switch (e.key) {
          case '0':
            e.preventDefault();
            resetZoom();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  }, []);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="text-red-500 text-center">
          <div className="text-lg font-semibold mb-2">Error Loading PDF</div>
          <div className="text-sm">{error}</div>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className} relative`}>
      {/* Table of Contents Sidebar */}
      <PDFTableOfContents
        outline={pdfOutline}
        pdfDocument={pdfDocument}
        onChapterClick={handleChapterClick}
        currentPage={pageNumber}
        isOpen={isTocOpen}
        onToggle={toggleToc}
      />

      {/* Header with controls */}
      <div className={`flex items-center justify-between p-3 border-b bg-gray-50 transition-all duration-300 ${
        isTocOpen ? 'ml-80' : 'ml-0'
      }`}>
        <div className="flex items-center gap-6">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Previous page (←)"
            >
              ←
            </button>
            
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(e) => goToPage(e.target.value)}
                className="w-16 px-2 py-1 border rounded text-center text-sm"
              />
              <span className="text-sm text-gray-600">
                / {numPages || '?'}
              </span>
            </div>
            
            <button 
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Next page (→)"
            >
              →
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={zoomOut}
              className="p-2 border rounded hover:bg-gray-100"
              title="Zoom out (-)"
            >
              −
            </button>
            
            <select 
              value={Math.round(scale * 100)}
              onChange={(e) => setZoomLevel(parseInt(e.target.value) / 100)}
              className="px-2 py-1 border rounded text-sm min-w-[70px]"
            >
              <option value={25}>25%</option>
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
              <option value={200}>200%</option>
              <option value={300}>300%</option>
              <option value={400}>400%</option>
            </select>
            
            <button 
              onClick={zoomIn}
              className="p-2 border rounded hover:bg-gray-100"
              title="Zoom in (+)"
            >
              +
            </button>
          </div>

          {/* Fit controls */}
          <div className="flex items-center gap-1">
            <button 
              onClick={fitToWidth}
              className={`px-3 py-1 border rounded text-sm hover:bg-gray-100 ${
                fitMode === 'width' ? 'bg-blue-100 border-blue-300' : ''
              }`}
              title="Fit to width"
            >
              Fit Width
            </button>
            <button 
              onClick={fitToHeight}  
              className={`px-3 py-1 border rounded text-sm hover:bg-gray-100 ${
                fitMode === 'height' ? 'bg-blue-100 border-blue-300' : ''
              }`}
              title="Fit to height"
            >
              Fit Height
            </button>
            <button 
              onClick={fitToPage}
              className={`px-3 py-1 border rounded text-sm hover:bg-gray-100 ${
                fitMode === 'page' ? 'bg-blue-100 border-blue-300' : ''
              }`}
              title="Fit to page"
            >
              Fit Page
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-gray-500 mr-2">
            <div>← → Space: Navigate pages</div>
            <div>↑ ↓: Scroll vertically</div>
            <div>+/-: Zoom</div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>

      {/* PDF content */}
      <div 
        ref={containerRef}
        className={`flex-1 bg-gray-100 transition-all duration-300 pdf-container ${
          isTocOpen ? 'ml-80' : 'ml-0'
        }`}
        style={{ 
          overflow: 'auto',
          position: 'relative',
          minHeight: 0, // Important: allows flex child to shrink
          maxHeight: '100%' // Ensure it doesn't exceed parent bounds
        }}
        onWheel={handleWheel}
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Loading PDF...</div>
          </div>
        )}
        
        <div 
          className="p-4"
          style={{
            minHeight: fitMode === 'height' ? '100%' : 'auto',
            minWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: fitMode === 'height' ? 'center' : 'flex-start',
            paddingTop: '20px',
            paddingBottom: '20px'
          }}
        >
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
          >
            <div 
              ref={pageRef}
              style={{ 
                display: 'inline-block',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                backgroundColor: 'white',
                border: '1px solid #ddd'
              }}
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                onLoadSuccess={onPageLoadSuccess}
              />
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
}