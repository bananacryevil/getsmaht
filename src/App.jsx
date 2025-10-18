import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import ReadingModal from './components/ReadingModal';
import ExerciseModal from './components/ExerciseModal';
import NotesPrompt from './components/NotesPrompt';
import NotesManager from './components/NotesManager';
import { parseReading } from './utils/readingMapper';
import { calcStreak, lastCompletionInfo, estimateDayMinutes, estimateRemainingMinutes, upcomingDeliverables } from './utils/metrics';
import { initialCurriculum } from './data/curriculumData';

// 30-Day Curriculum Tracker
// Single-file React component (default export). Tailwind classes used for styling.
// Features:
// - Shows 30-day curriculum with day titles, readings, exercises, deliverables
// - Mark days complete, add notes, date completed
// - Progress bar, filter by week, search
// - Persisted in localStorage; import/export JSON
// - Built-in PDF reader for readings
// Usage:
// - Create a new React + Vite project, install Tailwind, then replace src/App.jsx
// - Or paste this into an environment that supports Tailwind + React

const STORAGE_KEY = "curriculum_tracker_v1";
const WEEK_FILTER_KEY = "curriculum_week_filter_v1";

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to load from storage", e);
    }
    return initialCurriculum();
  });
  const [filterWeek, setFilterWeek] = useState(() => {
    try {
      const raw = localStorage.getItem(WEEK_FILTER_KEY);
      const allowed = new Set(["all", "1", "2", "3", "4", "5"]);
      if (raw && allowed.has(raw)) return raw;
    } catch (e) {
      console.error("Failed to load week filter from storage", e);
    }
    return "all";
  });
  const [search, setSearch] = useState("");
  const [currentReading, setCurrentReading] = useState(null);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [expandedReadings, setExpandedReadings] = useState(new Set());
  const [collapsedDays, setCollapsedDays] = useState(new Set());
  const collapsedInitRef = useRef(false);
  const [isNotesManagerOpen, setIsNotesManagerOpen] = useState(false);

  const initialScrollDoneRef = useRef(false);
  const [pendingScroll, setPendingScroll] = useState(false);
  const highlightRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const mainContentRef = useRef(null);
  const [listHeightPx, setListHeightPx] = useState(0);

  const nextIncomplete = useMemo(() => items.find(i => !i.completed), [items]);

  // Scroll the curriculum list so the requested day sits just below the sticky header.
  const scrollToDay = useCallback((day, { behavior = 'smooth' } = {}) => {
    if (!day) return;

    const element = document.getElementById(`day-${day}`);
    const container = scrollContainerRef.current;

    if (!element || !container) return;

    const prefersReducedMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const effectiveBehavior = prefersReducedMotion ? 'auto' : behavior;

    // Calculate the scroll position within the container
    const elementTop = element.offsetTop;
    const containerScrollTop = container.scrollTop;
    const containerOffsetTop = container.offsetTop;

    // Calculate target scroll position to bring element to the top of the container
    const targetScrollTop = elementTop - containerOffsetTop;

    // Scroll the container, not the entire page
    container.scrollTo({
      top: targetScrollTop,
      behavior: effectiveBehavior
    });

    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }

    if (highlightRef.current) {
      highlightRef.current.classList.remove('scroll-target-flash');
      highlightRef.current = null;
    }

    requestAnimationFrame(() => {
      element.classList.add('scroll-target-flash');
      highlightRef.current = element;
      highlightTimeoutRef.current = window.setTimeout(() => {
        if (highlightRef.current) {
          highlightRef.current.classList.remove('scroll-target-flash');
          highlightRef.current = null;
        }
      }, 1200);
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save storage", e);
    }
  }, [items]);

  // Persist the selected week filter
  useEffect(() => {
    try {
      localStorage.setItem(WEEK_FILTER_KEY, filterWeek);
    } catch (e) {
      console.error("Failed to save week filter", e);
    }
  }, [filterWeek]);

  useEffect(() => () => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
  }, []);

  // Dynamically size the scroll container so it reaches near the bottom of the window
  useEffect(() => {
    const BOTTOM_GAP_PX = 48; // ~0.5 inch on standard CSS px (96dpi)

    const computeHeight = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
      const available = Math.max(0, Math.floor(viewportH - rect.top - BOTTOM_GAP_PX));
      // Only update if changed to avoid reflows
      setListHeightPx(prev => (prev !== available ? available : prev));
    };

    // Initial calculations after paint to ensure correct measurements
    const rafId = requestAnimationFrame(computeHeight);
    const toId = setTimeout(computeHeight, 0);

    window.addEventListener('resize', computeHeight);

    // Recompute if the main content area reflows (e.g., header size changes)
    let ro;
    if ('ResizeObserver' in window && mainContentRef.current) {
      ro = new ResizeObserver(() => computeHeight());
      ro.observe(mainContentRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(toId);
      window.removeEventListener('resize', computeHeight);
      if (ro) ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!initialScrollDoneRef.current && nextIncomplete) {
      initialScrollDoneRef.current = true;
      scrollToDay(nextIncomplete.day, { behavior: 'auto' });
    }
  }, [nextIncomplete, scrollToDay]);

  // Initialize: collapse all days except the next incomplete (run once)
  useEffect(() => {
    if (!collapsedInitRef.current && items.length > 0 && nextIncomplete) {
      const allButNext = new Set(items.map(i => i.day).filter(d => d !== nextIncomplete.day));
      setCollapsedDays(allButNext);
      collapsedInitRef.current = true;
    }
  }, [items, nextIncomplete]);

  useEffect(() => {
    if (pendingScroll && nextIncomplete) {
      // Delay to allow the DOM to update and make the scroll feel more intentional
      const timeoutId = setTimeout(() => {
        // Ensure the next incomplete day is expanded when we navigate to it
        setCollapsedDays(prev => {
          const next = new Set(prev);
          next.delete(nextIncomplete.day);
          return next;
        });
        scrollToDay(nextIncomplete.day, { behavior: 'smooth' });
        setPendingScroll(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [pendingScroll, nextIncomplete, scrollToDay]);

  // Listen for notes updates from pop-out windows
  useEffect(() => {
    const handleNotesUpdate = (event) => {
      const { day, notes } = event.detail;
      setItems(prev => prev.map(it => it.day === day ? { ...it, notes } : it));
    };

    window.addEventListener('notes-updated', handleNotesUpdate);
    const handleOpenNotesManager = () => {
      window.__handledOpenNotesManager = true;
      setIsNotesManagerOpen(true);
      setTimeout(() => { window.__handledOpenNotesManager = false; }, 0);
    };
    window.addEventListener('open-notes-manager', handleOpenNotesManager);
    return () => window.removeEventListener('notes-updated', handleNotesUpdate);
  }, []);

  const toggleComplete = (day) => {
    const target = items.find(it => it.day === day);
    const willComplete = target ? !target.completed : false;

    setItems(prev => prev.map(it => {
      if (it.day !== day) return it;
      const completed = !it.completed;
      return {
        ...it,
        completed,
        completedAt: completed ? new Date().toISOString() : null
      };
    }));

    if (willComplete) {
      setPendingScroll(true);
    }
  };

  const updateNotes = (day, notes) => {
    setItems(prev => prev.map(it => it.day === day ? { ...it, notes } : it));
  };

  const resetAll = () => {
    if (!confirm("Reset all progress? This will clear completion and notes.")) return;
    setItems(initialCurriculum());
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculum-tracker.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openNotesManager = () => setIsNotesManagerOpen(true);
  const closeNotesManager = () => setIsNotesManagerOpen(false);

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        // Minimal validation: array with day numbers
        if (!Array.isArray(parsed) || !parsed.every(p => typeof p.day === "number")) throw new Error("Invalid format");
        setItems(parsed.map(p => ({ ...p })));
      } catch (e) {
        alert("Failed to import: " + e.message);
      }
    };
    reader.readAsText(file);
  };

  const filtered = items.filter(it => {
    if (filterWeek !== "all") {
      const week = Math.ceil(it.day / 7);
      if (String(week) !== filterWeek) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle = it.title.toLowerCase().includes(q);
      const inExercises = it.exercises.join(" ").toLowerCase().includes(q);
      const inReadings = it.readings.join(" ").toLowerCase().includes(q);
      return inTitle || inExercises || inReadings;
    }
    return true;
  });

  const completedCount = items.filter(i => i.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);

  // Derived metrics for sidebar (Learning Coach)
  const streak = useMemo(() => calcStreak(items), [items]);
  const lastDone = useMemo(() => lastCompletionInfo(items), [items]);
  const nextEstMin = useMemo(() => (nextIncomplete ? estimateDayMinutes(nextIncomplete) : 0), [nextIncomplete]);
  const remainingMin = useMemo(() => estimateRemainingMinutes(items), [items]);
  const deliverables = useMemo(() => upcomingDeliverables(items), [items]);

  const openReading = (readingText, day, readingIndex) => {
    const parsedReading = parseReading(readingText);
    if (parsedReading) {
      if (parsedReading.isExternalLink) {
        // Open external links in a new window/tab
        window.open(parsedReading.url, '_blank', 'noopener,noreferrer');
      } else {
        // Open PDF in modal
        setCurrentReading({ ...parsedReading, dayNumber: day, readingIndex });
        setIsReadingModalOpen(true);
      }
    } else {
      // This is a supplemental reading or other text - toggle expansion
      const readingKey = `${day}-${readingIndex}`;
      setExpandedReadings(prev => {
        const newSet = new Set(prev);
        if (newSet.has(readingKey)) {
          newSet.delete(readingKey);
        } else {
          newSet.add(readingKey);
        }
        return newSet;
      });
    }
  };

  const closeReadingModal = () => {
    setIsReadingModalOpen(false);
    setCurrentReading(null);
  };

  const openExerciseModal = (day, title, exercises) => {
    setCurrentExercise({ day, title, exercises });
    setIsExerciseModalOpen(true);
  };

  const closeExerciseModal = () => {
    setIsExerciseModalOpen(false);
    setCurrentExercise(null);
  };

  const toggleDayCollapsed = (day) => {
    setCollapsedDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day); else next.add(day);
      return next;
    });
  };

  const expandAll = () => {
    setCollapsedDays(new Set());
  };

  const collapseAll = () => {
    setCollapsedDays(new Set(items.map(i => i.day)));
  };

  // Handle keyboard shortcuts and body scroll lock
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        if (isReadingModalOpen) {
          closeReadingModal();
        }
        if (isExerciseModalOpen) {
          closeExerciseModal();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Lock body scroll when modal is open
    if (isReadingModalOpen || isExerciseModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isReadingModalOpen, isExerciseModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-2.5 shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  GetSmaht
                </h1>
                <p className="text-xs text-slate-500 font-medium">30-Day Problem-Solving Mastery</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-full border border-emerald-200/60">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-emerald-700">{completedCount}/{items.length} Complete</span>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={openNotesManager} className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors" title="Manage Notes">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" strokeWidth={2} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                <button onClick={exportJSON} className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors" title="Export Progress">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <label className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Import Progress">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <input type="file" accept="application/json" onChange={e => e.target.files && importJSON(e.target.files[0])} className="hidden" />
                </label>
                <button onClick={resetAll} className="p-2.5 hover:bg-red-50 rounded-lg transition-colors" title="Reset Progress">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Overall Progress</span>
              <span className="text-xs font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="relative w-full bg-slate-200/60 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/50"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={mainContentRef} className="max-w-7xl mx-auto px-6 py-4 pb-3">
        {/* Filters, Global Collapse Controls & Search */}
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <select
            value={filterWeek}
            onChange={e => setFilterWeek(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium text-slate-700"
          >
            <option value="all">📚 All Weeks</option>
            <option value="1">Week 1 - Foundations</option>
            <option value="2">Week 2 - Recursion & Data</option>
            <option value="3">Week 3 - Algorithms</option>
            <option value="4">Week 4 - Mastery</option>
            <option value="5">Week 5 - Advanced Topics</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 text-sm font-medium transition-colors"
              title="Expand all days"
            >
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 hover:bg-amber-50/50 text-slate-700 text-sm font-medium transition-colors"
              title="Collapse all days"
            >
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
              Collapse All
            </button>
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search curriculum..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-3">
          {/* Main Content - Days List with Independent Scroll */}
          <div
            ref={scrollContainerRef}
            className="lg:col-span-2 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent py-2 px-1 pb-4"
            style={listHeightPx ? { maxHeight: listHeightPx + 'px', height: listHeightPx + 'px' } : undefined}
          >
            {filtered.map(it => {
              const week = Math.ceil(it.day / 7);
              const weekColors = {
                1: 'from-blue-500 to-cyan-500',
                2: 'from-purple-500 to-pink-500',
                3: 'from-orange-500 to-red-500',
                4: 'from-emerald-500 to-teal-500',
                5: 'from-indigo-500 to-purple-500'
              };
              const isCollapsed = collapsedDays.has(it.day);
              const readingsCount = it.readings?.length || 0;
              const exercisesCount = it.exercises?.length || 0;
              const highLevelTheory = (it.theory || '').split('\n').find(l => l.trim().length > 0) || '';
              const objectivePreview = it.objective || '';
              const summaryLine = objectivePreview || highLevelTheory;

              return (
                <div key={it.day} id={`day-${it.day}`} className="curriculum-day group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200/60">
                  {/* Day Header */}
                  <div className={`bg-gradient-to-r ${weekColors[week]} p-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all"></div>
                    <div className="relative flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                            Day {it.day}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                            Week {week}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white drop-shadow-sm">{it.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2.5 cursor-pointer group/checkbox">
                          <input
                            type="checkbox"
                            checked={it.completed}
                            onChange={() => toggleComplete(it.day)}
                            className="completion-checkbox"
                          />
                          <span className="text-sm font-semibold text-white/95 group-hover/checkbox:text-white transition-colors drop-shadow-sm">
                            {it.completed ? 'Done' : 'Mark Done'}
                          </span>
                        </label>
                        {/* TODO 1 */}
                        <button
                          type="button"
                          onClick={() => toggleDayCollapsed(it.day)}
                          aria-expanded={!isCollapsed}
                          aria-controls={`day-content-${it.day}`}
                          className="ml-1 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 text-white shadow-sm backdrop-blur-sm transition-colors"
                          title={isCollapsed ? 'Expand details' : 'Collapse details'}
                        >
                          <svg className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Collapsed Summary (High-level) */}
                  {isCollapsed ? (
                    <div className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-white/60">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>
                          {readingsCount} {readingsCount === 1 ? 'Reading' : 'Readings'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-white/60">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586l5.707 5.707V19a2 2 0 01-2 2z" /></svg>
                          {exercisesCount} {exercisesCount === 1 ? 'Exercise' : 'Exercises'}
                        </span>
                        {it.deliverable && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-white/60">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                            Deliverable
                          </span>
                        )}
                      </div>
                      {summaryLine && (
                        <div className="mt-3 text-sm text-slate-600 truncate">
                          {summaryLine}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Day Content */}
                  {!isCollapsed && (
                    <div id={`day-content-${it.day}`} className="p-5 space-y-4">
                      {/* Theory */}
                      {it.theory && (
                        <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/60 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l7 4-7 4-7-4 7-4zm0 8l7-4v6l-7 4-7-4v-6l7 4z" />
                            </svg>
                            <div className="flex-1">
                              <div className="text-xs font-bold text-indigo-900 mb-1">THEORY</div>
                              <div className="text-sm text-indigo-900/90 whitespace-pre-line leading-relaxed">{it.theory}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Learning Objective - Premium Badge */}
                      {it.objective && (
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 rounded-xl p-3">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div>
                              <div className="text-xs font-bold text-amber-900 mb-1">LEARNING OBJECTIVE</div>
                              <div className="text-sm text-amber-800 leading-relaxed">{it.objective}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Readings */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">📖 Readings</h4>
                        <div className="space-y-2">
                          {it.readings.map((reading, idx) => {
                            const readingKey = `${it.day}-${idx}`;
                            const isExpanded = expandedReadings.has(readingKey);
                            const parsedReading = parseReading(reading);
                            const isSupplemental = !parsedReading;
                            // Only truncate supplemental readings, not PDF readings
                            const shouldTruncate = isSupplemental && !isExpanded && reading.length > 60;

                            return (
                              <button
                                key={idx}
                                onClick={() => openReading(reading, it.day, idx)}
                                className={`w-full text-left px-4 py-2.5 border rounded-xl transition-all group/reading ${isSupplemental
                                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-300'
                                    : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300'
                                  }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isSupplemental
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {idx + 1}
                                  </span>
                                  <div className="flex-1">
                                    <span className={`text-sm font-medium block ${isSupplemental
                                        ? 'text-amber-900 group-hover/reading:text-amber-950'
                                        : 'text-slate-700 group-hover/reading:text-blue-700'
                                      }`}>
                                      {shouldTruncate ? `${reading.substring(0, 60)}...` : reading}
                                    </span>
                                    {isSupplemental && (
                                      <span className="text-xs text-amber-600 mt-1 block">
                                        {isExpanded ? 'Click to collapse' : 'Click to expand'}
                                      </span>
                                    )}
                                  </div>
                                  <svg className={`w-4 h-4 flex-shrink-0 mt-1 transition-all ${isSupplemental
                                      ? 'text-amber-500 group-hover/reading:text-amber-600'
                                      : 'text-slate-400 group-hover/reading:text-blue-500'
                                    } ${isExpanded && isSupplemental ? 'rotate-90' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isSupplemental ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    )}
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
                          onClick={() => openExerciseModal(it.day, it.title, it.exercises)}
                          className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>View {it.exercises.length} {it.exercises.length === 1 ? 'Exercise' : 'Exercises'}</span>
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
                            <div className="text-sm text-purple-800">{it.deliverable || '—'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Notes - Simplified Prompt */}
                      <NotesPrompt
                        day={it.day}
                        title={it.title}
                        value={it.notes || ""}
                        onPopOut={true}
                      />

                      {/* Completion Timestamp */}
                      {it.completedAt && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold">Completed {new Date(it.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar - Learning Coach */}
          <aside className="space-y-4">
            {/* Today's Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Today’s Plan
                </h2>
              </div>
              <div className="p-5 space-y-3">
                {nextIncomplete ? (
                  <>
                    <div className="text-sm text-slate-500 font-medium">Day {nextIncomplete.day}</div>
                    <div className="text-base font-bold text-slate-900">{nextIncomplete.title}</div>
                    <div className="text-xs text-slate-600">Approx {nextEstMin} min · {nextIncomplete.readings?.length || 0} readings · {nextIncomplete.exercises?.length || 0} exercises</div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {(nextIncomplete.readings?.length || 0) > 0 && (
                        <button
                          onClick={() => openReading(nextIncomplete.readings[0], nextIncomplete.day, 0)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                        >
                          Open First Reading
                        </button>
                      )}
                      {(nextIncomplete.exercises?.length || 0) > 0 && (
                        <button
                          onClick={() => openExerciseModal(nextIncomplete.day, nextIncomplete.title, nextIncomplete.exercises)}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                        >
                          View Exercises
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => scrollToDay(nextIncomplete.day)}
                      className="block mx-auto w-auto px-4 py-2 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
                    >
                      Open Day →
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">🎉</div>
                    <div className="font-bold text-slate-900">All Done!</div>
                    <div className="text-sm text-slate-600 mt-1">You’ve completed the curriculum</div>
                  </div>
                )}
              </div>
            </div>

            {/* Pace & Consistency */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Pace & Consistency
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/60 text-center">
                  <div className="text-xs font-medium text-emerald-900">Streak</div>
                  <div className="text-xl font-bold text-emerald-700">{streak}d</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200/60 text-center">
                  <div className="text-xs font-medium text-blue-900">Total</div>
                  <div className="text-xl font-bold text-blue-700">{completedCount}</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/60 text-center">
                  <div className="text-xs font-medium text-amber-900">Remain min</div>
                  <div className="text-xl font-bold text-amber-700">{remainingMin}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-600">
                {lastDone.daysAgo === null ? 'No completions yet.' :
                  lastDone.daysAgo === 0 ? 'Last completed: today' :
                    `Last completed: ${lastDone.daysAgo} day${lastDone.daysAgo > 1 ? 's' : ''} ago (Day ${lastDone.day})`}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Reading Modal */}
      <ReadingModal
        isOpen={isReadingModalOpen}
        onClose={closeReadingModal}
        reading={currentReading}
        notes={currentReading?.dayNumber ? items.find(it => it.day === currentReading.dayNumber)?.notes || "" : ""}
        onNotesChange={(notes) => {
          if (currentReading?.dayNumber) {
            updateNotes(currentReading.dayNumber, notes);
          }
        }}
      />

      {/* Exercise Modal */}
      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={closeExerciseModal}
        dayNumber={currentExercise?.day}
        title={currentExercise?.title}
        exercises={currentExercise?.exercises || []}
      />

      {isNotesManagerOpen && (
        <NotesManager
          onClose={closeNotesManager}
          onNavigateToDay={(day) => {
            closeNotesManager();
            setCollapsedDays(prev => {
              const next = new Set(prev);
              next.delete(day);
              return next;
            });
            setTimeout(() => scrollToDay(day), 50);
          }}
        />
      )}
    </div>
  );
}
