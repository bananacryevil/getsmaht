import React from 'react';

export default function ExerciseModal({ isOpen, onClose, dayNumber, title, exercises }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm mb-2">
                Day {dayNumber}
              </div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">{title}</h2>
              <p className="text-blue-100 text-sm mt-1 font-medium">Hands-on exercises to master the concepts</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-3 transition-all hover:rotate-90 duration-300"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Exercise Count Badge */}
        <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white rounded-lg px-3 py-1.5 font-bold text-sm shadow-lg shadow-blue-500/30">
                {exercises.length} {exercises.length === 1 ? 'Exercise' : 'Exercises'}
              </div>
              <span className="text-sm text-slate-600">Complete all to master this topic</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">Press ESC to close</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="space-y-6 max-w-4xl">
            {exercises.map((exercise, idx) => {
              // Parse exercise title and content
              const lines = exercise.split('\n');
              const firstLine = lines[0];
              const restOfContent = lines.slice(1).join('\n');
              
              // Check if first line looks like a title (e.g., "EXERCISE 1: Title")
              const titleMatch = firstLine.match(/^(EXERCISE|PROJECT|PART)\s+(\d+|[A-Z]+):\s*(.+)$/i);
              const exerciseTitle = titleMatch ? titleMatch[3] : `Exercise ${idx + 1}`;
              const exerciseContent = titleMatch ? restOfContent : exercise;
              
              const colors = [
                { bg: 'from-blue-500 to-cyan-500', badge: 'bg-blue-600', border: 'border-blue-200', shadow: 'shadow-blue-500/20' },
                { bg: 'from-purple-500 to-pink-500', badge: 'bg-purple-600', border: 'border-purple-200', shadow: 'shadow-purple-500/20' },
                { bg: 'from-orange-500 to-red-500', badge: 'bg-orange-600', border: 'border-orange-200', shadow: 'shadow-orange-500/20' },
                { bg: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-600', border: 'border-emerald-200', shadow: 'shadow-emerald-500/20' },
              ];
              const colorSet = colors[idx % colors.length];

              return (
                <div 
                  key={idx} 
                  className={`group bg-white rounded-xl border-2 ${colorSet.border} hover:shadow-xl ${colorSet.shadow} transition-all duration-300 overflow-hidden`}
                >
                  {/* Exercise Header */}
                  <div className={`bg-gradient-to-r ${colorSet.bg} px-5 py-4 flex items-center gap-3`}>
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white drop-shadow-sm">
                        {exerciseTitle}
                      </h3>
                    </div>
                    <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>

                  {/* Exercise Content */}
                  <div className="p-6">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 leading-relaxed bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-lg border border-slate-200 overflow-x-auto shadow-inner">
{exerciseContent.trim()}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Footer */}
        <div className="bg-white px-8 py-5 border-t border-slate-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Take your time and work through each exercise</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-2"
          >
            <span>Close Exercises</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
