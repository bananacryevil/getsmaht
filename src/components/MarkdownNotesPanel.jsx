import React from "react";
import MarkdownNotesEditor from "./MarkdownNotesEditor";

export default function MarkdownNotesPanel({
  onPopOut,
  ...editorProps
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
      <MarkdownNotesEditor
        {...editorProps}
        height={editorProps.height ?? 320}
        actionArea={
          onPopOut ? (
            <button
              type="button"
              onClick={() => onPopOut(editorProps.activeDay)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              disabled={editorProps.activeDay == null}
            >
              Pop Out
            </button>
          ) : null
        }
      />
    </div>
  );
}

