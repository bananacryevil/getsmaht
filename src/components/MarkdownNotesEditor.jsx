import React, { useMemo } from "react";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

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
  const displayDay = useMemo(
    () => dayOptions.find((entry) => entry.day === activeDay) || null,
    [dayOptions, activeDay]
  );

  const safeValue = noteValue ?? "";
  const editorDisabled = activeDay == null;
  const textareaProps = useMemo(
    () => ({
      placeholder: "## Daily notes\n- Key ideas\n- Wins\n- Follow-ups",
      readOnly: editorDisabled
    }),
    [editorDisabled]
  );

  const handleChange = (value) => {
    if (editorDisabled) return;
    onChangeNote(value ?? "");
  };

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

      <div className={`relative border border-slate-200/70 rounded-xl overflow-hidden bg-slate-50 ${bodyClassName}`.trim()}>
        <MDEditor
          value={safeValue}
          onChange={handleChange}
          height={height}
          preview="edit"
          visibleDragbar
          textareaProps={textareaProps}
          previewOptions={{ remarkPlugins: [remarkGfm] }}
        />
        {editorDisabled && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center text-sm font-semibold text-slate-500">
            Select a day to start writing notes
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Markdown tips: use <code># Heading</code>, <code>**bold**</code>, <code>`code`</code>, lists, and task
        checkboxes.
      </p>
    </div>
  );
}
