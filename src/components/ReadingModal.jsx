import React from 'react';
import NativePDFViewer from './NativePDFViewer';

export default function ReadingModal({
  isOpen,
  onClose,
  reading,
  notes,
  onNotesChange
}) {
  if (!isOpen || !reading) return null;

  const handleOpenNotes = () => {
    if (window.electronAPI?.notes?.openWindow) {
      window.electronAPI.notes.openWindow(reading.dayNumber, reading.title);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full h-full max-w-7xl max-h-[95vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="h-full flex flex-col" style={{ minHeight: 0 }}>
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-slate-900">{reading.title}</h2>
                {typeof reading.dayNumber === 'number' && (
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
                    Day {reading.dayNumber}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{reading.reference}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              title="Close (Esc)"
            >
              ×
            </button>
          </div>

          {/* PDF Reader - Full Width */}
          <div className="flex-1 flex" style={{ minHeight: 0 }}>
            <div className="flex-1 min-h-0">
              <NativePDFViewer
                pdfFile={reading.pdfPath}
                reference={reading.reference}
                outlineHints={reading.outlineHints || []}
                initialPageLabel={reading.startLabel || null}
                className="h-full"
              />
            </div>
            <button
              onClick={handleOpenNotes}
              className="fixed right-4 top-24 z-50 px-3 py-2 bg-blue-600 text-white rounded-l-md shadow-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
              title="Open notes in separate window"
            >
              Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}