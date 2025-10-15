import React, { useEffect } from "react";
import MarkdownNotesEditor from "./MarkdownNotesEditor";

export default function MarkdownNotesModal({
  isOpen,
  onClose,
  editorProps = {}
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b bg-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Markdown Notes</h2>
            {editorProps?.activeDay != null && (
              <p className="text-sm text-slate-500">Day {editorProps.activeDay} notes</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-xl font-bold"
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="p-5 bg-slate-50 max-h-[80vh] overflow-y-auto">
          <MarkdownNotesEditor
            {...editorProps}
            height={editorProps?.height ?? 520}
            description="Use this focused view to capture detailed takeaways."
            className="h-full"
            bodyClassName="bg-white"
          />
        </div>
      </div>
    </div>
  );
}
