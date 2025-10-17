import React, { useState, useEffect } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

export default function ReadingNotesEditor({
  day,
  title,
  value,
  onChange,
  onPopOut
}) {
  const [initialContent, setInitialContent] = useState(null);

  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
        setInitialContent(parsed);
      } else {
        setInitialContent([
          {
            type: "heading",
            content: "Reading notes",
            props: { level: 2 },
          },
          {
            type: "heading",
            content: "Key concepts",
            props: { level: 3 },
          },
          {
            type: "bulletListItem",
            content: "",
          },
          {
            type: "heading",
            content: "Questions",
            props: { level: 3 },
          },
          {
            type: "bulletListItem",
            content: "",
          },
          {
            type: "heading",
            content: "Takeaways",
            props: { level: 3 },
          },
          {
            type: "bulletListItem",
            content: "",
          },
        ]);
      }
    } catch {
      // If it's not JSON, treat as plain text
      setInitialContent([
        {
          type: "paragraph",
          content: value || "",
        },
      ]);
    }
  }, [value]);

  const editor = useCreateBlockNote({
    initialContent: initialContent || undefined,
  });

  const handleChange = () => {
    if (!editor) return;
    const blocks = editor.document;
    onChange(JSON.stringify(blocks));
  };

  const handlePopOut = () => {
    if (window.electronAPI?.notes?.openWindow) {
      window.electronAPI.notes.openWindow(day, title);
    }
    // Notify parent to collapse the notes panel
    if (onPopOut) {
      onPopOut();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50" data-color-mode="light">
      <div className="px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Day {day} Notes
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePopOut}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Open in separate window"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Pop Out
            </button>
            {onPopOut && (
              <button
                onClick={onPopOut}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Collapse notes panel"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Take notes while you read. Auto-saves as you type.
        </p>
      </div>

      <div className="flex-1 overflow-hidden bg-white flex flex-col">
        <div className="flex-1 overflow-hidden p-[10px]">
          {editor && (
            <BlockNoteView 
              editor={editor}
              onChange={handleChange}
              theme="light"
            />
          )}
        </div>
      </div>
    </div>
  );
}
