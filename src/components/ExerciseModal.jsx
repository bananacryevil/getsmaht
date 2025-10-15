import React from 'react';

export default function ExerciseModal({ isOpen, onClose, dayNumber, title, exercises }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium opacity-90">Day {dayNumber}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {exercises.map((exercise, idx) => {
              // Parse exercise title and content
              const lines = exercise.split('\n');
              const firstLine = lines[0];
              const restOfContent = lines.slice(1).join('\n');
              
              // Check if first line looks like a title (e.g., "EXERCISE 1: Title")
              const titleMatch = firstLine.match(/^(EXERCISE|PROJECT|PART)\s+(\d+|[A-Z]+):\s*(.+)$/i);
              const exerciseTitle = titleMatch ? titleMatch[0] : `Exercise ${idx + 1}`;
              const exerciseContent = titleMatch ? restOfContent : exercise;

              return (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    {titleMatch ? titleMatch[3] : exerciseTitle}
                  </h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed bg-white p-4 rounded border border-gray-300 overflow-x-auto">
{exerciseContent.trim()}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} • Press ESC to close
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
