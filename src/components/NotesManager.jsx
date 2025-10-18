import React, { useEffect, useMemo, useState } from 'react';
import { noteToPlainText, isEmptyNote, noteWordCount } from '../utils/notes';

const STORAGE_KEY = 'curriculum_tracker_v1';

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (e) {
    console.error('Failed to load items for Notes Manager:', e);
    return [];
  }
}

function saveItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Notify other windows about potential changes
    window.dispatchEvent(new CustomEvent('notes-bulk-updated'));
  } catch (e) {
    console.error('Failed to save items from Notes Manager:', e);
  }
}

export default function NotesManager({ onClose, onNavigateToDay }) {
  const [items, setItems] = useState(loadItems());
  const [query, setQuery] = useState('');
  const [showEmpty, setShowEmpty] = useState(false);
  const [onlyWithNotes, setOnlyWithNotes] = useState(true);

  useEffect(() => {
    const reload = () => setItems(loadItems());
    window.addEventListener('storage', reload);
    window.addEventListener('notes-updated', reload);
    window.addEventListener('notes-bulk-updated', reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener('notes-updated', reload);
      window.removeEventListener('notes-bulk-updated', reload);
    };
  }, []);

  // Close on Escape and lock body scroll while modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Lock body scroll to mirror other modals
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const enriched = useMemo(() => items.map(it => {
    const text = noteToPlainText(it.notes || '');
    return {
      ...it,
      notesText: text,
      notesWords: noteWordCount(it.notes || ''),
      hasNotes: !!text.trim()
    };
  }), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter(it => {
      if (!showEmpty && !it.hasNotes) return false;
      if (onlyWithNotes && !it.hasNotes) return false;
      if (!q) return true;
      return (
        String(it.day).includes(q) ||
        it.title.toLowerCase().includes(q) ||
        it.notesText.toLowerCase().includes(q)
      );
    });
  }, [enriched, query, showEmpty, onlyWithNotes]);

  const clearNote = (day) => {
    if (!confirm('Clear notes for this day?')) return;
    setItems(prev => {
      const next = prev.map(it => it.day === day ? { ...it, notes: '' } : it);
      saveItems(next);
      return next;
    });
  };

  const exportNotes = () => {
    const payload = enriched
      .filter(n => n.hasNotes)
      .map(n => ({ day: n.day, title: n.title, notes: n.notes }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'getsmaht-notes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error('Invalid notes file');
        setItems(prev => {
          const map = new Map(prev.map(it => [it.day, { ...it }]));
          for (const entry of data) {
            if (!entry || typeof entry.day !== 'number') continue;
            const current = map.get(entry.day);
            if (current) {
              current.notes = entry.notes ?? current.notes;
              map.set(entry.day, current);
            }
          }
          const next = Array.from(map.values()).sort((a, b) => a.day - b.day);
          saveItems(next);
          return next;
        });
      } catch (e) {
        alert('Failed to import notes: ' + e.message);
      }
    };
    reader.readAsText(file);
  };

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex"
      role="dialog"
      aria-modal="true"
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="m-auto w-[min(1100px,95vw)] h-[min(85vh,900px)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </div>
            <div>
              <div className="text-lg font-bold">Notes Manager</div>
              <div className="text-xs text-white/80">Search, review, and manage all notes in one place</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportNotes} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm font-semibold">Export</button>
            <label className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm font-semibold cursor-pointer">
              Import
              <input type="file" accept="application/json" className="hidden" onChange={e => e.target.files && importNotes(e.target.files[0])} />
            </label>
            <button onClick={onClose} className="px-3 py-1.5 bg-white rounded-md text-slate-800 text-sm font-bold">Close</button>
          </div>
        </div>

        <div className="p-4 border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by day, title, or note text..."
                className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={onlyWithNotes} onChange={e => setOnlyWithNotes(e.target.checked)} />
              Only with notes
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={showEmpty} onChange={e => setShowEmpty(e.target.checked)} />
              Include empty
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center text-slate-500 py-10">No notes found.</div>
          ) : (
            <ul className="space-y-3">
              {filtered.map(it => (
                <li key={it.day} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold flex-shrink-0">{it.day}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold text-slate-900 truncate">{it.title}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${it.hasNotes ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{it.hasNotes ? 'Has notes' : 'Empty'}</span>
                        {it.hasNotes && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">{it.notesWords} words</span>
                        )}
                        {it.completed && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-200">Completed</span>
                        )}
                      </div>
                      {it.hasNotes && (
                        <div className="mt-1 text-sm text-slate-700 line-clamp-2 whitespace-pre-wrap">{it.notesText}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-md hover:bg-slate-800"
                        onClick={() => onNavigateToDay ? onNavigateToDay(it.day) : window.scrollTo?.(0, 0)}
                        title="Jump to day"
                      >Jump</button>
                      <button
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => window.electronAPI?.notes?.openWindow && window.electronAPI.notes.openWindow(it.day, it.title)}
                        title="Open in notes editor"
                      >Open</button>
                      <button
                        className="px-3 py-1.5 text-sm bg-rose-50 text-rose-700 rounded-md border border-rose-200 hover:bg-rose-100"
                        onClick={() => clearNote(it.day)}
                        title="Clear notes"
                      >Clear</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
