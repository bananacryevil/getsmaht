import React, { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

// Predefined zoom levels for consistent stepping
const ZOOM_LEVELS = [0.6, 0.75, 0.85, 1, 1.15, 1.3, 1.5, 1.75, 2];
const DEFAULT_ZOOM = 1;

export default function MarkdownNotesEditor({
  dayOptions,
  activeDay,
  onSelectDay,
  noteValue,
  onChangeNote,
  onJumpToDay,
  height = 320,
  title = "Markdown Notes",
  description = "Live editor with preview. Notes stay linked to the selected day.",
  actionArea = null,
  className = "",
  bodyClassName = "",
  selectLabel = "Linked Day"
}) {
  const [initialContent, setInitialContent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const editorContainerRef = useRef(null);
  
  const displayDay = useMemo(
    () => dayOptions.find((entry) => entry.day === activeDay) || null,
    [dayOptions, activeDay]
  );

  const editorDisabled = activeDay == null;

  // Parse noteValue into BlockNote format
  useEffect(() => {
    try {
      if (noteValue) {
        const parsed = JSON.parse(noteValue);
        setInitialContent(parsed);
      } else {
        setInitialContent([
          {
            type: "paragraph",
            content: "",
          },
        ]);
      }
    } catch {
      // If it's not JSON, treat as plain text
      setInitialContent([
        {
          type: "paragraph",
          content: noteValue || "",
        },
      ]);
    }
  }, [noteValue, activeDay]);

  const editor = useCreateBlockNote({
    initialContent: initialContent || undefined,
  });

  const handleChange = () => {
    if (editorDisabled || !editor) return;
    const blocks = editor.document;
    onChangeNote(JSON.stringify(blocks));
  };

  // Zoom adjustment function - finds the nearest zoom level and steps through predefined levels
  const adjustZoom = useCallback((direction) => {
    const currentIndex = ZOOM_LEVELS.findIndex((level) => Math.abs(level - zoomLevel) < 0.01);
    const fallbackIndex = currentIndex === -1 
      ? ZOOM_LEVELS.findIndex((level) => level >= zoomLevel) 
      : currentIndex;
    const index = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, fallbackIndex + direction));
    setZoomLevel(ZOOM_LEVELS[index]);
  }, [zoomLevel]);

  const zoomIn = useCallback(() => adjustZoom(1), [adjustZoom]);
  const zoomOut = useCallback(() => adjustZoom(-1), [adjustZoom]);
  const resetZoom = useCallback(() => setZoomLevel(DEFAULT_ZOOM), []);

  // Keyboard shortcuts: Ctrl+Plus/Minus for zoom
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl (or Cmd on Mac) modifier
      if (!(event.ctrlKey || event.metaKey)) return;
      
      // Prevent browser's default zoom
      if (event.key === '+' || event.key === '=' || event.key === '-' || event.key === '0') {
        event.preventDefault();
      }

      if (event.key === '+' || event.key === '=') {
        zoomIn();
      } else if (event.key === '-') {
        zoomOut();
      } else if (event.key === '0') {
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetZoom]);

  // Mouse wheel zoom: Ctrl+Wheel
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    const handleWheel = (event) => {
      // Only handle wheel events when Ctrl/Cmd is pressed
      if (!(event.ctrlKey || event.metaKey)) return;
      
      event.preventDefault();
      
      // Wheel deltaY is negative when scrolling up (zoom in), positive when scrolling down (zoom out)
      if (event.deltaY < 0) {
        zoomIn();
      } else if (event.deltaY > 0) {
        zoomOut();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoomIn, zoomOut]);

  // Format zoom level as percentage for display
  const zoomLabel = useMemo(() => `${Math.round(zoomLevel * 100)}%`, [zoomLevel]);

  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()} data-color-mode="light">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span role="img" aria-label="notes">
                📝
              </span>
              {title}
            </h2>
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onJumpToDay && displayDay && (
              <button
                type="button"
                onClick={() => onJumpToDay(displayDay.day)}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              >
                Jump to Day {displayDay.day}
              </button>
            )}
            {actionArea}
          </div>
        </div>

        <label className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {selectLabel}
          </span>
          <select
            id="markdown-note-day-select"
            value={activeDay ?? ""}
            onChange={(event) => {
              const nextDay = Number(event.target.value);
              if (Number.isNaN(nextDay)) return;
              onSelectDay(nextDay);
            }}
            className="sm:flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          >
            {dayOptions.length === 0 && (
              <option value="" disabled>
                No days available
              </option>
            )}
            {dayOptions.length > 0 && activeDay == null && (
              <option value="" disabled>
                Select a day
              </option>
            )}
            {dayOptions.map((entry) => (
              <option key={entry.day} value={entry.day}>
                Day {entry.day} - {entry.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={`relative border border-slate-200/70 rounded-xl overflow-hidden bg-white flex flex-col ${bodyClassName}`.trim()} style={{ height: `${height}px` }}>
        {/* Zoom controls bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={zoomOut}
              className="rounded-md border border-slate-300 px-2 py-0.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={zoomLevel <= ZOOM_LEVELS[0]}
              title="Zoom out (Ctrl + -)"
            >
              −
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="w-14 text-center text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Reset zoom (Ctrl + 0)"
            >
              {zoomLabel}
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="rounded-md border border-slate-300 px-2 py-0.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={zoomLevel >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
              title="Zoom in (Ctrl + +)"
            >
              +
            </button>
          </div>
          <div className="text-xs text-slate-500">
            Ctrl + Scroll to zoom
          </div>
        </div>

        {/* Editor container with zoom and scroll */}
        <div 
          ref={editorContainerRef}
          className="flex-1 overflow-auto p-[10px]" 
          style={{ 
            fontSize: `${zoomLevel}rem`,
            lineHeight: '1.6'
          }}
        >
          {editor && (
            <BlockNoteView 
              editor={editor}
              onChange={handleChange}
              theme="light"
              editable={!editorDisabled}
            />
          )}
        </div>

        {editorDisabled && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center text-sm font-semibold text-slate-500">
            Select a day to start writing notes
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Type <code>/</code> for commands • Drag blocks to reorder • Ctrl+Scroll or Ctrl+/-/0 to zoom
      </p>
    </div>
  );
}
