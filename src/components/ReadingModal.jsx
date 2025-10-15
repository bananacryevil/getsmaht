import React from 'react';
import NativePDFViewer from './NativePDFViewer';

export default function ReadingModal({ isOpen, onClose, reading }) {
  if (!isOpen || !reading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full h-full max-w-6xl max-h-[95vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="h-full flex flex-col" style={{ minHeight: 0 }}>
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold">{reading.title}</h2>
              <p className="text-sm text-gray-600">{reading.reference}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              title="Close (Esc)"
            >
              ×
            </button>
          </div>

          {/* PDF Reader */}
          <div className="flex-1" style={{ minHeight: 0 }}>
            <NativePDFViewer
              pdfFile={reading.pdfPath}
              reference={reading.reference}
              outlineHints={reading.outlineHints || []}
              initialPageLabel={reading.startLabel || null}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}