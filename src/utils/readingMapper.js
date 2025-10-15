// Reading mapping utility to connect curriculum readings with PDF files
const solveItPdf = new URL('../assets/solveit.pdf', import.meta.url).href;
const thinkPythonPdf = new URL('../assets/thinkpython.pdf', import.meta.url).href;
const grokkingPdf = new URL('../assets/grokking.pdf', import.meta.url).href;

// Book metadata and chapter mappings
export const BOOKS = {
  'how-to-solve-it': {
    title: 'How to Solve It',
    author: 'George Pólya',
    pdfPath: solveItPdf,
    chapters: {
      'preface': { startPage: 5, endPage: 8, title: 'Preface' },
      'introduction': { startPage: 9, endPage: 14, title: 'Introduction' },
      'part1': { startPage: 15, endPage: 50, title: 'Part I: In the Classroom' },
      'understanding': { startPage: 15, endPage: 25, title: 'Understanding the Problem' },
      'plan': { startPage: 26, endPage: 35, title: 'Devising a Plan' },
      'execution': { startPage: 36, endPage: 45, title: 'Carrying Out the Plan' },
      'review': { startPage: 46, endPage: 50, title: 'Looking Back' },
      'part2': { startPage: 51, endPage: 150, title: 'Part II: How to Solve It' },
      'pp.1-34': { startPage: 9, endPage: 42, title: 'Introduction to Problem Solving' },
    }
  },
  'think-python': {
    title: 'Think Python',
    author: 'Allen B. Downey',
    pdfPath: thinkPythonPdf,
    chapters: {
      'preface': { startPage: 7, endPage: 10, title: 'Preface' },
      'ch.1': { startPage: 11, endPage: 18, title: 'Chapter 1: The Way of the Program' },
      'ch.2': { startPage: 19, endPage: 30, title: 'Chapter 2: Variables, Expressions and Statements' },
      'ch.3': { startPage: 31, endPage: 42, title: 'Chapter 3: Functions' },
      'ch.4': { startPage: 43, endPage: 54, title: 'Chapter 4: Case Study: Interface Design' },
      'ch.5': { startPage: 55, endPage: 68, title: 'Chapter 5: Conditionals and Recursion' },
      'ch.6': { startPage: 69, endPage: 82, title: 'Chapter 6: Fruitful Functions' },
      'ch.7': { startPage: 83, endPage: 96, title: 'Chapter 7: Iteration' },
      'ch.8': { startPage: 97, endPage: 112, title: 'Chapter 8: Strings' },
      'ch.9': { startPage: 113, endPage: 128, title: 'Chapter 9: Case Study: Word Play' },
      'ch.10': { startPage: 129, endPage: 144, title: 'Chapter 10: Lists' },
      'ch.11': { startPage: 145, endPage: 160, title: 'Chapter 11: Dictionaries' },
      'ch.12': { startPage: 161, endPage: 176, title: 'Chapter 12: Tuples' },
    }
  },
  'grokking-algorithms': {
    title: 'Grokking Algorithms',
    author: 'Aditya Bhargava',
    pdfPath: grokkingPdf,
    chapters: {
      'preface': { startPage: 7, endPage: 12, title: 'Preface' },
      'introduction': { startPage: 13, endPage: 18, title: 'Introduction' },
      'ch.1': { startPage: 19, endPage: 36, title: 'Chapter 1: Introduction to Algorithms' },
      'ch.2': { startPage: 37, endPage: 56, title: 'Chapter 2: Selection Sort' },
      'ch.3': { startPage: 57, endPage: 78, title: 'Chapter 3: Recursion' },
      'ch.4': { startPage: 79, endPage: 100, title: 'Chapter 4: Quicksort' },
      'ch.5': { startPage: 101, endPage: 122, title: 'Chapter 5: Hash Tables' },
      'ch.6': { startPage: 123, endPage: 142, title: 'Chapter 6: Breadth-First Search' },
      'ch.7': { startPage: 143, endPage: 162, title: "Chapter 7: Dijkstra's Algorithm" },
      'ch.8': { startPage: 163, endPage: 182, title: 'Chapter 8: Greedy Algorithms' },
      'ch.9': { startPage: 183, endPage: 202, title: 'Chapter 9: Dynamic Programming' },
      'ch.10': { startPage: 203, endPage: 222, title: 'Chapter 10: K-nearest Neighbors' },
    }
  }
};

// Parse reading string to extract book and chapter/page info or handle web links
export function parseReading(readingText) {
  if (!readingText || typeof readingText !== 'string') return null;

  const text = readingText.toLowerCase().trim();
  
  // Handle web URLs - return them as external links
  if (readingText.startsWith('http://') || readingText.startsWith('https://')) {
    return {
      isExternalLink: true,
      url: readingText,
      title: 'External Resource',
      reference: readingText
    };
  }

  // Handle "How to Solve It" references
  if (text.includes('how to solve it')) {
    const book = BOOKS['how-to-solve-it'];
    
    // Look for specific sections
    if (text.includes('introduction') && text.includes('understanding')) {
      return {
        bookId: 'how-to-solve-it',
        title: `${book.title} - Introduction & Understanding the Problem`,
        pdfPath: book.pdfPath,
        startPage: 9,  // Start at introduction
        endPage: 25,   // Through understanding section
        reference: readingText
      };
    }
    
    if (text.includes('devising') && text.includes('plan')) {
      return {
        bookId: 'how-to-solve-it',
        title: `${book.title} - Devising a Plan`,
        pdfPath: book.pdfPath,
        startPage: 26,
        endPage: 35,
        reference: readingText
      };
    }
    
    if (text.includes('carrying out') && text.includes('plan')) {
      return {
        bookId: 'how-to-solve-it',
        title: `${book.title} - Carrying Out the Plan`,
        pdfPath: book.pdfPath,
        startPage: 36,
        endPage: 45,
        reference: readingText
      };
    }
    
    if (text.includes('looking back')) {
      return {
        bookId: 'how-to-solve-it',
        title: `${book.title} - Looking Back`,
        pdfPath: book.pdfPath,
        startPage: 46,
        endPage: 50,
        reference: readingText
      };
    }
    
    // Look for page ranges like "pp.1-34" or "pp. 9-25"
    const pageMatch = text.match(/pp\.?\s*(\d+)-(\d+)/);
    if (pageMatch) {
      const refStart = parseInt(pageMatch[1]);
      const refEnd = parseInt(pageMatch[2]);
      
      return {
        bookId: 'how-to-solve-it',
        title: `${book.title} - Pages ${refStart}-${refEnd}`,
        pdfPath: book.pdfPath,
        startPage: refStart + 8,  // Adjust for PDF offset
        endPage: refEnd + 8,
        reference: readingText
      };
    }

    // Default to introduction
    return {
      bookId: 'how-to-solve-it',
      title: book.title,
      pdfPath: book.pdfPath,
      startPage: 9,
      endPage: 14,
      reference: readingText
    };
  }

  // Handle "Think Python" references
  if (text.includes('think python')) {
    const book = BOOKS['think-python'];
    
    // Look for chapter references like "ch. 2", "chapter 3", etc.
    const chapterMatch = text.match(/ch\.?\s*(\d+)|chapter\s+(\d+)/);
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1] || chapterMatch[2]);
      
      // Map chapters to approximate page ranges (these will be refined by PDF outline)
      const chapterPages = {
        1: { start: 11, end: 18 },
        2: { start: 19, end: 30 },
        3: { start: 31, end: 42 },
        4: { start: 43, end: 54 },
        5: { start: 55, end: 68 },
        6: { start: 69, end: 82 },
        7: { start: 83, end: 96 },
        8: { start: 97, end: 112 },
        9: { start: 113, end: 128 },
        10: { start: 129, end: 144 },
        11: { start: 145, end: 160 },
        12: { start: 161, end: 176 }
      };
      
      const pages = chapterPages[chapterNum] || { start: 1, end: 1 };
      
      return {
        bookId: 'think-python',
        title: `${book.title} - Chapter ${chapterNum}`,
        pdfPath: book.pdfPath,
        startPage: pages.start,
        endPage: pages.end,
        reference: readingText
      };
    }

    // Default to chapter 1
    return {
      bookId: 'think-python',
      title: `${book.title} - Chapter 1`,
      pdfPath: book.pdfPath,
      startPage: 11,
      endPage: 18,
      reference: readingText
    };
  }

  // Handle "Grokking Algorithms" references
  if (text.includes('grokking')) {
    const book = BOOKS['grokking-algorithms'];
    
    // Look for chapter references
    const chapterMatch = text.match(/ch\.?\s*(\d+)|chapter\s+(\d+)/);
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1] || chapterMatch[2]);
      
      // Map chapters to approximate page ranges
      const chapterPages = {
        1: { start: 19, end: 36 },
        2: { start: 37, end: 56 },
        3: { start: 57, end: 78 },
        4: { start: 79, end: 100 },
        5: { start: 101, end: 122 },
        6: { start: 123, end: 142 },
        7: { start: 143, end: 162 },
        8: { start: 163, end: 182 },
        9: { start: 183, end: 202 },
        10: { start: 203, end: 222 }
      };
      
      const pages = chapterPages[chapterNum] || { start: 1, end: 1 };
      
      return {
        bookId: 'grokking-algorithms',
        title: `${book.title} - Chapter ${chapterNum}`,
        pdfPath: book.pdfPath,
        startPage: pages.start,
        endPage: pages.end,
        reference: readingText
      };
    }

    // Default to chapter 1
    return {
      bookId: 'grokking-algorithms',
      title: `${book.title} - Chapter 1`,
      pdfPath: book.pdfPath,
      startPage: 19,
      endPage: 36,
      reference: readingText
    };
  }

  return null;
}

// Get all available books for UI
export function getAllBooks() {
  return Object.entries(BOOKS).map(([id, book]) => ({
    id,
    ...book,
    chapters: Object.entries(book.chapters).map(([key, chapter]) => ({
      key,
      ...chapter
    }))
  }));
}