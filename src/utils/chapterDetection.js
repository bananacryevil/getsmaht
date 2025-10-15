// Smart chapter detection utilities
export const findBestMatchingChapter = async (pdfDocument, outline, readingReference, keywordHints = []) => {
  if (!outline) return 1;

  const reference = (readingReference || '').toLowerCase().trim();
  const normalizedHints = Array.isArray(keywordHints)
    ? keywordHints
        .map((hint) => (hint ? String(hint).toLowerCase().trim() : null))
        .filter((hint) => hint && hint.length > 0)
    : [];
  
  // Helper function to get page from destination
  const getPageFromDest = async (dest) => {
    if (!dest) return 1;
    
    try {
      let pageRef;
      if (typeof dest === 'string') {
        pageRef = await pdfDocument.getDestination(dest);
      } else {
        pageRef = dest;
      }
      
      if (pageRef && pageRef[0]) {
        const pageIndex = await pdfDocument.getPageIndex(pageRef[0]);
        return pageIndex + 1;
      }
    } catch (err) {
      console.warn('Could not get page from destination:', err);
    }
    
    return 1;
  };

  // Helper function to recursively search outline items
  const searchOutlineItems = async (items, searchTerms) => {
    const matches = [];
    
    for (const item of items) {
      const title = item.title.toLowerCase();
      let score = 0;
      
      // Check for exact matches first
      for (const term of searchTerms) {
        if (title.includes(term)) {
          score += term.length * 2; // Higher score for longer matches
        }
      }
      
      if (score > 0) {
        const page = await getPageFromDest(item.dest);
        matches.push({ item, score, page, title: item.title });
      }
      
      // Recursively search sub-items
      if (item.items && item.items.length > 0) {
        const subMatches = await searchOutlineItems(item.items, searchTerms);
        matches.push(...subMatches);
      }
    }
    
    return matches;
  };

  // Extract search terms from reference
  let searchTerms = [];
  
  // Handle specific patterns
  if (reference.includes('think python')) {
    // Look for chapter numbers
    const chapterMatch = reference.match(/ch\.?(\d+)/);
    if (chapterMatch) {
      const chapterNum = chapterMatch[1];
      searchTerms = [`chapter ${chapterNum}`, `ch ${chapterNum}`, chapterNum];
    } else {
      searchTerms = ['chapter 1', 'introduction', 'getting started'];
    }
  } else if (reference.includes('how to solve it')) {
    // Look for page ranges or specific topics
    if (reference.includes('pp.1-34')) {
      searchTerms = ['introduction', 'understanding', 'problem', 'part i'];
    } else {
      searchTerms = ['introduction', 'preface'];
    }
  } else if (reference.includes('grokking')) {
    // Look for chapter numbers
    const chapterMatch = reference.match(/ch\.?(\d+)/);
    if (chapterMatch) {
      const chapterNum = chapterMatch[1];
      searchTerms = [`chapter ${chapterNum}`, chapterNum];
      
      // Add specific chapter topics
      const chapterTopics = {
        '1': ['introduction', 'algorithms'],
        '2': ['selection sort', 'sorting'],
        '3': ['recursion', 'recursive'],
        '4': ['quicksort', 'quick sort'],
        '5': ['hash tables', 'hash', 'dictionaries'],
        '6': ['breadth-first search', 'bfs', 'graph'],
        '7': ['dijkstra', 'shortest path'],
        '8': ['greedy', 'algorithm'],
        '9': ['dynamic programming', 'dp'],
        '10': ['k-nearest neighbors', 'knn', 'machine learning']
      };
      
      if (chapterTopics[chapterNum]) {
        searchTerms.push(...chapterTopics[chapterNum]);
      }
    } else {
      searchTerms = ['chapter 1', 'introduction'];
    }
  }

  // If no specific terms found, extract general terms
  if (searchTerms.length === 0) {
    searchTerms = reference.split(/\s+/).filter(term => 
      term.length > 2 && !['the', 'and', 'for', 'with'].includes(term)
    );
  }

  if (normalizedHints.length > 0) {
    searchTerms.push(...normalizedHints);
  }

  // Remove duplicates while preserving order
  const seen = new Set();
  searchTerms = searchTerms.filter((term) => {
    if (seen.has(term)) return false;
    seen.add(term);
    return true;
  });

  try {
    const matches = await searchOutlineItems(outline, searchTerms);
    
    if (matches.length > 0) {
      // Sort by score (highest first)
      matches.sort((a, b) => b.score - a.score);
      
      console.log('Chapter matches found:', matches.map(m => ({
        title: m.title,
        score: m.score,
        page: m.page
      })));
      
      return matches[0].page;
    }
  } catch (err) {
    console.warn('Error searching outline:', err);
  }

  return 1; // Default to first page if no matches found
};

// Alternative approach: keyword-based chapter detection
export const getChapterKeywords = (readingReference) => {
  const reference = readingReference.toLowerCase();
  
  const keywords = {
    // Think Python chapters
    'variables': ['variables', 'expressions', 'statements'],
    'functions': ['functions', 'function'],
    'conditionals': ['conditionals', 'recursion', 'if', 'else'],
    'strings': ['strings', 'string'],
    'lists': ['lists', 'list'],
    'dictionaries': ['dictionaries', 'dictionary', 'dict'],
    'tuples': ['tuples', 'tuple'],
    
    // How to Solve It sections
    'understanding': ['understanding', 'problem'],
    'plan': ['plan', 'devising', 'strategy'],
    'execution': ['carrying out', 'execution', 'implementation'],
    'review': ['looking back', 'review', 'checking'],
    
    // Grokking Algorithms topics
    'sorting': ['sort', 'sorting', 'selection'],
    'recursion': ['recursion', 'recursive'],
    'search': ['search', 'binary'],
    'hash': ['hash', 'tables', 'dictionary'],
    'graphs': ['graph', 'breadth', 'dijkstra'],
    'algorithms': ['algorithm', 'greedy', 'dynamic']
  };
  
  for (const [topic, terms] of Object.entries(keywords)) {
    if (terms.some(term => reference.includes(term))) {
      return topic;
    }
  }
  
  return null;
};