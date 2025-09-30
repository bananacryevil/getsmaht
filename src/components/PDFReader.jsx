import React, { useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from '../utils/pdfWorker';
import PDFTableOfContents from './PDFTableOfContents';
import './PDFReader.css';

// Import CSS for proper rendering (v7.7.3 compatible)
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

export default function PDFReader({ pdfFile, initialPage = 1, onClose, className = "", book = null }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [pdfOutline, setPdfOutline] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);

  const onDocumentLoadSuccess = useCallback(async (pdf) => {
    setNumPages(pdf.numPages);
    setPdfDocument(pdf);
    
    try {
      // Get the PDF outline (bookmarks/table of contents)
      const outline = await pdf.getOutline();
      if (outline) {
        setPdfOutline(outline);
      }
    } catch (err) {
      console.warn('Could not load PDF outline:', err);
    }
    
    setLoading(false);
    setError(null);
  }, []);

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

  const zoomIn = () => {
    setScale(prev => Math.min(3.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const handleChapterClick = (page) => {
    setPageNumber(page);
  };

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen);
  };

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
      <div className={`flex items-center justify-between p-4 border-b bg-gray-50 transition-all duration-300 ${
        isTocOpen ? 'ml-80' : 'ml-0'
      }`}>
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
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
                className="w-16 px-2 py-1 border rounded text-center"
              />
              <span className="text-sm text-gray-600">
                / {numPages || '?'}
              </span>
            </div>
            
            <button 
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              →
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={zoomOut}
              className="px-2 py-1 border rounded hover:bg-gray-100"
              title="Zoom out"
            >
              −
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={zoomIn}
              className="px-2 py-1 border rounded hover:bg-gray-100"
              title="Zoom in"
            >
              +
            </button>
            <button 
              onClick={resetZoom}
              className="px-2 py-1 border rounded hover:bg-gray-100 text-xs"
              title="Reset zoom"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>

      {/* PDF content */}
      <div className={`flex-1 overflow-auto bg-gray-100 transition-all duration-300 ${
        isTocOpen ? 'ml-80' : 'ml-0'
      }`}>
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Loading PDF...</div>
          </div>
        )}
        
        <div 
          className="flex justify-center p-4"
          onWheel={(e) => {
            // Allow wheel events to bubble normally for scrolling and zooming
            e.stopPropagation();
          }}
        >
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}