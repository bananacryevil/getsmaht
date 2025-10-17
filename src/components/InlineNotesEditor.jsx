import React, { useState, useRef, useEffect } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

// Helper function to render a simple text preview from BlockNote JSON
function renderSimplePreview(jsonString) {
  try {
    const blocks = JSON.parse(jsonString);
    return blocks
      .map(block => {
        const content = block.content || "";
        if (typeof content === "string") return content;
        if (Array.isArray(content)) {
          return content.map(item => {
            if (typeof item === "string") return item;
            if (item.text) return item.text;
            return "";
          }).join("");
        }
        return "";
      })
      .filter(text => text.trim())
      .join("\n\n");
  } catch {
    return jsonString;
  }
}

export default function InlineNotesEditor({
  day,
  title,
  value,
  onChange,
  onPopOut
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [initialContent, setInitialContent] = useState(null);
  const editorRef = useRef(null);

  // Parse value into BlockNote format
  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
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
          content: value || "",
        },
      ]);
    }
  }, [value]);

  const editor = useCreateBlockNote({
    initialContent: initialContent || undefined,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        if (isEditing && editor) {
          setIsEditing(false);
          // Save on blur
          const blocks = editor.document;
          onChange(JSON.stringify(blocks));
        }
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isEditing, editor, onChange]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = () => {
    // Auto-save on change
    if (!editor) return;
    const blocks = editor.document;
    onChange(JSON.stringify(blocks));
  };

  const handlePopOut = () => {
    if (window.electronAPI?.notes?.openWindow) {
      window.electronAPI.notes.openWindow(day, title);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            📝 Your Notes
          </h4>
          <p className="text-xs text-slate-500">
            {isEditing 
              ? "Click outside to save and preview" 
              : "Click to edit notes, or pop out for side-by-side view"
            }
          </p>
        </div>
        {onPopOut && (
          <button
            onClick={handlePopOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Open notes in separate window"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Pop Out
          </button>
        )}
      </div>

      <div ref={editorRef}>
        {isEditing ? (
          <div className="border border-slate-300 rounded-lg overflow-hidden bg-white flex flex-col" data-color-mode="light" style={{ height: '300px' }}>
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
        ) : (
          <div
            onClick={handleEditClick}
            className="min-h-[120px] cursor-text bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
          >
            {value ? (
              <div className="prose prose-sm max-w-none text-slate-700">
                {/* Render a simple preview instead of a non-editable BlockNoteView */}
                <div className="whitespace-pre-wrap">{renderSimplePreview(value)}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[120px] text-slate-400">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-sm font-medium">Click to add notes</p>
                <p className="text-xs">Capture key takeaways and ideas</p>
              </div>
            )}
          </div>
        )}
      </div>

      {!isEditing && value && (
        <p className="text-xs text-slate-500 mt-2">
          Click anywhere in the note area to edit
        </p>
      )}
    </div>
  );
}
