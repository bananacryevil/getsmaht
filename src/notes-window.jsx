import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./index.css";

function NotesWindow() {
  const [day, setDay] = useState(null);
  const [notes, setNotes] = useState("");
  const [dayTitle, setDayTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        setNotes(data || "");
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (value) => {
    const newValue = value || "";
    setNotes(newValue);
    
    // Auto-save to main window
    if (day && window.electronAPI?.notes?.saveData) {
      try {
        await window.electronAPI.notes.saveData(day, newValue);
      } catch (error) {
        console.error("Failed to save notes:", error);
      }
    }
  };

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

      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <MDEditor
            value={notes}
            onChange={handleChange}
            height="100%"
            preview="live"
            visibleDragbar
            textareaProps={{
              placeholder: "## Daily notes\n\n### Key ideas\n- \n\n### Wins\n- \n\n### Follow-ups\n- ",
            }}
            previewOptions={{ remarkPlugins: [remarkGfm] }}
          />
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-6 py-3">
        <p className="text-xs text-slate-500 text-center">
          Use <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-700"># Heading</code>, 
          <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-700 ml-1">**bold**</code>, 
          <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-700 ml-1">`code`</code>, 
          lists, and task checkboxes
        </p>
      </div>
    </div>
  );
}

// Mount the app
const container = document.getElementById("notes-root");
const root = createRoot(container);
root.render(<NotesWindow />);
