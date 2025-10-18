import React from "react";

/**
 * NotesPrompt - Minimal notes indicator for main curriculum view
 * 
 * Design Philosophy:
 * - Information hierarchy: Main view is for navigation and progress tracking
 * - Progressive disclosure: Notes editing happens in dedicated context (pop-out)
 * - Reduce cognitive overhead: One clear call-to-action instead of inline editing
 * - Maintain discoverability: Users can still see they have notes capability
 */
export default function NotesPrompt({ day, title, value, onPopOut }) {
  const handlePopOut = () => {
    if (window.electronAPI?.notes?.openWindow) {
      window.electronAPI.notes.openWindow(day, title);
    }
  };

  const hasNotes = value && value.trim().length > 0;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <svg 
            className={`w-4 h-4 flex-shrink-0 ${hasNotes ? 'text-blue-600' : 'text-slate-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
            />
          </svg>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Your Notes
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {hasNotes ? "Notes saved" : "Add notes for this day"}
            </p>
          </div>
        </div>
        
        {onPopOut && (
          <button
            onClick={handlePopOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-lg transition-all flex-shrink-0 shadow-sm hover:shadow"
            title="Open notes in separate window"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
              />
            </svg>
            <span>Open Notes</span>
          </button>
        )}
      </div>
      
      {hasNotes && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
          <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="font-medium">You have notes for this day</span>
        </div>
      )}

      {!hasNotes && (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
          <button
            type="button"
            onClick={() => {
              // Emit a custom event that App listens to (optional). If not handled, fall back to notes window.
              const ev = new CustomEvent('open-notes-manager');
              window.dispatchEvent(ev);
              if (!window.__handledOpenNotesManager && window.electronAPI?.notes?.openWindow) {
                window.electronAPI.notes.openWindow(day, title);
              }
            }}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            title="Open Notes Manager"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-6 1h4m-4 4h4M9 9h6"/></svg>
            <span>Manage all notes</span>
          </button>
        </div>
      )}
    </div>
  );
}
