import React, { useState, useEffect } from 'react';

// Convert PDF outline items to a usable format
const parseOutlineItems = (items, level = 0) => {
  if (!items) return [];
  
  return items.map((item, index) => {
    const parsedItem = {
      id: `${level}-${index}`,
      title: item.title,
      dest: item.dest,
      level: level,
      items: item.items ? parseOutlineItems(item.items, level + 1) : []
    };
    return parsedItem;
  });
};

// Get page number from destination
const getPageFromDest = async (pdfDocument, dest) => {
  if (!pdfDocument || !dest) return 1;
  
  try {
    let pageRef;
    if (typeof dest === 'string') {
      pageRef = await pdfDocument.getDestination(dest);
    } else {
      pageRef = dest;
    }
    
    if (pageRef && pageRef[0]) {
      const pageIndex = await pdfDocument.getPageIndex(pageRef[0]);
      return pageIndex + 1; // Convert 0-based to 1-based
    }
  } catch (err) {
    console.warn('Could not get page from destination:', err);
  }
  
  return 1;
};

export default function PDFTableOfContents({ outline, pdfDocument, onChapterClick, currentPage, isOpen, onToggle }) {
  const [parsedOutline, setParsedOutline] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    if (outline) {
      const parsed = parseOutlineItems(outline);
      setParsedOutline(parsed);
      
      // Auto-expand first level items
      const firstLevelIds = parsed.map(item => item.id);
      setExpandedItems(new Set(firstLevelIds));
    }
  }, [outline]);

  const handleItemClick = async (item) => {
    const pageNum = await getPageFromDest(pdfDocument, item.dest);
    onChapterClick(pageNum);
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderOutlineItem = (item) => {
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} className="mb-1">
        <div
          className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 ${
            item.level > 0 ? `ml-${item.level * 4}` : ''
          }`}
          style={{ marginLeft: `${item.level * 16}px` }}
          onClick={() => handleItemClick(item)}
        >
          <div className="flex-1">
            <div className={`${item.level === 0 ? 'font-semibold' : 'font-medium'} text-sm`}>
              {item.title}
            </div>
          </div>
          
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
              className="ml-2 p-1 hover:bg-gray-200 rounded text-xs"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-200 ml-2">
            {item.items.map(renderOutlineItem)}
          </div>
        )}
      </div>
    );
  };

  if (!outline || parsedOutline.length === 0) {
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

        {isOpen && (
          <div
            className="fixed left-0 top-0 h-full bg-white border-r shadow-lg transition-transform duration-300 z-40"
            style={{ width: '320px' }}
          >
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-lg">Table of Contents</h3>
            </div>
            <div className="p-4 text-center text-gray-500">
              No table of contents available for this PDF
            </div>
          </div>
        )}
      </>
    );
  }

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
      {isOpen && (
        <div
          className="fixed left-0 top-0 h-full bg-white border-r shadow-lg transition-transform duration-300 z-40"
          style={{ width: '320px' }}
        >
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-lg">Table of Contents</h3>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            <div className="p-2">
              {parsedOutline.map(renderOutlineItem)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}