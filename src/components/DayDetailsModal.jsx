import React from 'react';
import { parseReading } from '../utils/readingMapper';
import NotesPrompt from './NotesPrompt';

/**
 * DayDetailsModal
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - dayItem: { day, title, theory, objective, readings, exercises, deliverable, notes, completedAt }
 * - onOpenReading: (readingText: string, day: number, readingIndex: number) => void
 * - onOpenExercises: (day: number, title: string, exercises: string[]) => void
 */
export default function DayDetailsModal({ isOpen, onClose, dayItem, onOpenReading, onOpenExercises }) {
  if (!isOpen || !dayItem) return null;

  const week = Math.ceil(dayItem.day / 7);
  const weekColors = {
    1: 'from-blue-500 to-cyan-500',
    2: 'from-purple-500 to-pink-500',
    3: 'from-orange-500 to-red-500',
    4: 'from-emerald-500 to-teal-500',
    5: 'from-indigo-500 to-purple-500'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${weekColors[week]} px-6 py-5 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">Day {dayItem.day}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">Week {week}</span>
              </div>
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">{dayItem.title}</h2>
              <p className="text-white/80 text-sm mt-0.5">Detailed overview, readings, and exercises</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
              aria-label="Close"
              title="Close (Esc)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-gradient-to-b from-slate-50 to-white space-y-4">
          {/* Theory */}
          {dayItem.theory && (
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/60 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l7 4-7 4-7-4 7-4zm0 8l7-4v6l-7 4-7-4v-6l7 4z" />
                </svg>
                <div className="flex-1">
                  <div className="text-xs font-bold text-indigo-900 mb-1">THEORY</div>
                  <div className="text-sm text-indigo-900/90 whitespace-pre-line leading-relaxed">{dayItem.theory}</div>
                </div>
              </div>
            </div>
          )}

          {/* Learning Objective */}
          {dayItem.objective && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div>
                  <div className="text-xs font-bold text-amber-900 mb-1">LEARNING OBJECTIVE</div>
                  <div className="text-sm text-amber-800 leading-relaxed">{dayItem.objective}</div>
                </div>
              </div>
            </div>
          )}

          {/* Readings */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">📖 Readings</h4>
            <div className="space-y-2">
              {dayItem.readings.map((reading, idx) => {
                const parsedReading = parseReading(reading);
                const isSupplemental = !parsedReading;

                if (isSupplemental) {
                  return (
                    <div
                      key={idx}
                      className="w-full text-left px-4 py-2.5 border rounded-xl bg-amber-50 border-amber-200"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 bg-amber-100 text-amber-700">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium block text-amber-900 whitespace-pre-wrap">
                            {reading}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={idx}
                    onClick={() => onOpenReading(reading, dayItem.day, idx)}
                    className="w-full text-left px-4 py-2.5 border rounded-xl transition-all bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 bg-blue-100 text-blue-600">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <span className="text-sm font-medium block text-slate-700">
                          {reading}
                        </span>
                      </div>
                      <svg className="w-4 h-4 flex-shrink-0 mt-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exercises Button */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">💡 Exercises</h4>
            <button
              onClick={() => onOpenExercises(dayItem.day, dayItem.title, dayItem.exercises)}
              className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>View {dayItem.exercises.length} {dayItem.exercises.length === 1 ? 'Exercise' : 'Exercises'}</span>
              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Deliverable */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/60 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs font-bold text-purple-900 mb-1">DELIVERABLE</div>
                <div className="text-sm text-purple-800">{dayItem.deliverable || '—'}</div>
              </div>
            </div>
          </div>

          {/* Notes Prompt */}
          <NotesPrompt
            day={dayItem.day}
            title={dayItem.title}
            value={dayItem.notes || ''}
            onPopOut={true}
          />

          {/* Completion Timestamp */}
          {dayItem.completedAt && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Completed {new Date(dayItem.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
