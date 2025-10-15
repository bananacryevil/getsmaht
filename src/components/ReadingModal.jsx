import React from 'react';
import NativePDFViewer from './NativePDFViewer';
import MarkdownNotesEditor from './MarkdownNotesEditor';

export default function ReadingModal({
  isOpen,
  onClose,
  reading,
  notesProps = null,
  onPopOutNotes
}) {
  if (!isOpen || !reading) return null;

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

          {/* PDF Reader */}
          <div className="flex-1 flex flex-col lg:flex-row" style={{ minHeight: 0 }}>
            <div className="flex-[2] min-h-0 border-b lg:border-b-0 lg:border-r border-slate-200">
              <NativePDFViewer
                pdfFile={reading.pdfPath}
                reference={reading.reference}
                outlineHints={reading.outlineHints || []}
                initialPageLabel={reading.startLabel || null}
                className="h-full"
              />
            </div>

            {notesProps && (
              <div className="flex-[1] min-h-[320px] max-h-full overflow-y-auto p-4 bg-slate-50">
                <MarkdownNotesEditor
                  {...notesProps}
                  height={notesProps?.height ?? 520}
                  className="h-full"
                  bodyClassName="bg-white"
                  description="Draft insights while you read. Updates save automatically."
                  actionArea={
                    onPopOutNotes ? (
                      <button
                        type="button"
                        onClick={() => onPopOutNotes(notesProps.activeDay)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                        disabled={notesProps.activeDay == null}
                      >
                        Pop Out
                      </button>
                    ) : null
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}