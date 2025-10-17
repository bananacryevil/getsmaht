import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteSchema, createCodeBlockSpec } from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "./index.css";

// Predefined zoom levels for consistent stepping
const ZOOM_LEVELS = [0.5, 0.6, 0.65, 0.75, 0.85, 1, 1.15, 1.3, 1.5, 1.75, 2];
const DEFAULT_ZOOM = 0.65;
const ZOOM_STORAGE_KEY = "notesWindowZoomLevel";

function NotesWindow() {
  const [day, setDay] = useState(null);
  const [initialContent, setInitialContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_ZOOM;
    }

    try {
      const stored = window.localStorage?.getItem(ZOOM_STORAGE_KEY);
      if (!stored) {
        return DEFAULT_ZOOM;
      }

      const parsed = Number.parseFloat(stored);
      if (!Number.isFinite(parsed)) {
        return DEFAULT_ZOOM;
      }

      const min = ZOOM_LEVELS[0];
      const max = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
      const clamped = Math.min(Math.max(parsed, min), max);
      return ZOOM_LEVELS.reduce((closest, level) => (
        Math.abs(level - clamped) < Math.abs(closest - clamped) ? level : closest
      ), DEFAULT_ZOOM);
    } catch (error) {
      console.warn("Failed to restore zoom level:", error);
      return DEFAULT_ZOOM;
    }
  });
  const editorContainerRef = useRef(null);

  useEffect(() => {
    // Get day from query params
    const params = new URLSearchParams(window.location.search);
    const dayParam = params.get("day");
    
    if (dayParam) {
      const dayNum = parseInt(dayParam, 10);
      setDay(dayNum);
      loadNotes(dayNum);
    }
  }, []);

  const loadNotes = async (dayNum) => {
    setIsLoading(true);
    try {
      if (window.electronAPI?.notes?.getData) {
        const data = await window.electronAPI.notes.getData(dayNum);
        
        // Parse stored content if it exists
        if (data) {
          try {
            const parsed = JSON.parse(data);
            setInitialContent(parsed);
          } catch {
            // If it's markdown/plain text, convert to BlockNote format
            setInitialContent([
              {
                type: "paragraph",
                content: data,
              },
            ]);
          }
        } else {
          // Default placeholder content
          setInitialContent([
            {
              type: "heading",
              content: "Daily Notes",
              props: { level: 2 },
            },
            {
              type: "heading",
              content: "Key Ideas",
              props: { level: 3 },
            },
            {
              type: "bulletListItem",
              content: "",
            },
            {
              type: "heading",
              content: "Wins",
              props: { level: 3 },
            },
            {
              type: "bulletListItem",
              content: "",
            },
            {
              type: "heading",
              content: "Follow-ups",
              props: { level: 3 },
            },
            {
              type: "bulletListItem",
              content: "",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
      setInitialContent([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create BlockNote editor instance with dependency on initialContent
  const editor = useCreateBlockNote({
    schema: BlockNoteSchema.create().extend({
      blockSpecs: {
        // Use pre-configured code block with syntax highlighting
        codeBlock: createCodeBlockSpec(codeBlockOptions),
      },
    }),
    initialContent,
  }, [initialContent]);

  // Auto-save handler with debouncing
  const handleChange = async () => {
    if (!day || !editor || !window.electronAPI?.notes?.saveData) return;
    
    try {
      const blocks = editor.document;
      const jsonContent = JSON.stringify(blocks);
      await window.electronAPI.notes.saveData(day, jsonContent);
      console.log('Notes saved for day', day);
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  // Zoom adjustment function - finds the nearest zoom level and steps through predefined levels
  const adjustZoom = useCallback((direction) => {
    setZoomLevel((current) => {
      const currentIndex = ZOOM_LEVELS.findIndex((level) => Math.abs(level - current) < 0.01);
      const fallbackIndex = currentIndex === -1
        ? ZOOM_LEVELS.findIndex((level) => level >= current)
        : currentIndex;
      const baseIndex = fallbackIndex === -1 ? 0 : fallbackIndex;
      const index = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, baseIndex + direction));
      return ZOOM_LEVELS[index];
    });
  }, []);

  const zoomIn = useCallback(() => adjustZoom(1), [adjustZoom]);
  const zoomOut = useCallback(() => adjustZoom(-1), [adjustZoom]);
  const resetZoom = useCallback(() => setZoomLevel(DEFAULT_ZOOM), []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage?.setItem(ZOOM_STORAGE_KEY, zoomLevel.toString());
    } catch (error) {
      console.warn("Failed to persist zoom level:", error);
    }
  }, [zoomLevel]);

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
    const handleWheel = (event) => {
      if (!editorContainerRef.current) return;
      if (!(event.ctrlKey || event.metaKey)) return;
      if (!editorContainerRef.current.contains(event.target)) return;

      event.preventDefault();
      if (event.deltaY < 0) {
        zoomIn();
      } else if (event.deltaY > 0) {
        zoomOut();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel, { passive: false });
  }, [zoomIn, zoomOut]);

  // Format zoom level as percentage for display
  const zoomLabel = useMemo(() => `${Math.round(zoomLevel * 100)}%`, [zoomLevel]);

  const zoomContentStyle = useMemo(() => {
    const scale = zoomLevel;
    const widthPercent = `${(100 / scale).toFixed(2)}%`;
    return {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      lineHeight: "1.5",
      width: widthPercent,
      minWidth: widthPercent,
    };
  }, [zoomLevel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50" data-color-mode="light">
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-2 shadow-lg shadow-blue-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Day {day} Notes
            </h1>
            <p className="text-sm text-slate-500">
              Auto-saves as you type
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
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
            className="flex-1 overflow-y-auto overflow-x-hidden p-[10px]"
          >
            <div style={zoomContentStyle} className="bn-editor-shell">
              <div className="bn-editor-surface">
                <BlockNoteView 
                  editor={editor} 
                  onChange={handleChange}
                  theme="light"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-6 py-3">
        <p className="text-xs text-slate-500 text-center">
          Type <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-700">/</code> for commands • 
          Drag blocks to reorder • Ctrl+Scroll or Ctrl+/-/0 to zoom
        </p>
      </div>
    </div>
  );
}

// Mount the app
const container = document.getElementById("notes-root");
const root = createRoot(container);
root.render(<NotesWindow />);
