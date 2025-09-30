import React, { useState } from 'react';

export default function TableOfContents({ book, onChapterClick, currentPage, isOpen, onToggle }) {
  const [expandedSections, setExpandedSections] = useState(new Set());

  if (!book || !book.chapters) return null;

  const toggleSection = (sectionKey) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const handleChapterClick = (chapter) => {
    onChapterClick(chapter.startPage);
  };

  const isCurrentChapter = (chapter) => {
    return currentPage >= chapter.startPage && currentPage <= chapter.endPage;
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={`fixed top-20 z-50 p-2 bg-blue-600 text-white rounded-r-md shadow-lg transition-all duration-300 ${
          isOpen ? 'left-80' : 'left-0'
        }`}
        title={isOpen ? 'Close Table of Contents' : 'Open Table of Contents'}
      >
        {isOpen ? '←' : '→'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r shadow-lg transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '320px' }}
      >
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-lg">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-2">
            {Object.entries(book.chapters).map(([key, chapter]) => {
              const isCurrent = isCurrentChapter(chapter);
              const hasSubsections = chapter.subsections && chapter.subsections.length > 0;
              const isExpanded = expandedSections.has(key);

              return (
                <div key={key} className="mb-1">
                  <div
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      isCurrent ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleChapterClick(chapter)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{chapter.title}</div>
                      <div className="text-xs text-gray-500">
                        Pages {chapter.startPage}-{chapter.endPage}
                      </div>
                    </div>
                    
                    {hasSubsections && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(key);
                        }}
                        className="ml-2 p-1 hover:bg-gray-200 rounded"
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    )}
                  </div>

                  {/* Subsections */}
                  {hasSubsections && isExpanded && (
                    <div className="ml-4 border-l-2 border-gray-200">
                      {chapter.subsections.map((subsection, idx) => (
                        <div
                          key={idx}
                          className="pl-3 py-1 cursor-pointer hover:bg-gray-50 text-sm"
                          onClick={() => onChapterClick(subsection.startPage)}
                        >
                          <div className="font-medium">{subsection.title}</div>
                          <div className="text-xs text-gray-500">
                            Page {subsection.startPage}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* No overlay - let content show through */}
    </>
  );
}