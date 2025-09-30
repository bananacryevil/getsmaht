// Reading mapping utility to connect curriculum readings with PDF files
// Note: PDF files will be loaded dynamically from the assets folder

// Book metadata and chapter mappings
export const BOOKS = {
  'how-to-solve-it': {
    title: 'How to Solve It',
    author: 'George Pólya',
    pdfPath: '/src/assets/solveit.pdf',
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
    pdfPath: '/src/assets/thinkpython.pdf',
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
    pdfPath: '/src/assets/grokking.pdf',
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

// Parse reading string to extract book and chapter/page info
export function parseReading(readingText) {
  if (!readingText || typeof readingText !== 'string') return null;

  const text = readingText.toLowerCase().trim();

  // Handle "How to Solve It" references
  if (text.includes('how to solve it')) {
    const book = BOOKS['how-to-solve-it'];
    
    // Look for page ranges like "pp.1-34"
    const pageMatch = text.match(/pp\.(\d+)-(\d+)/);
    if (pageMatch) {
      // Map the reference pages to actual PDF pages
      const refStart = parseInt(pageMatch[1]);
      const refEnd = parseInt(pageMatch[2]);
      
      // For "pp.1-34", map to introduction through understanding the problem
      if (refStart === 1 && refEnd === 34) {
        return {
          bookId: 'how-to-solve-it',
          title: book.title,
          pdfPath: book.pdfPath,
          startPage: 9,  // Start at introduction
          endPage: 42,   // Through understanding section
          reference: readingText
        };
      }
      
      // For other page ranges, use a more direct mapping
      return {
        bookId: 'how-to-solve-it',
        title: book.title,
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
    
    // Look for chapter references like "ch.2", "ch.3", etc.
    const chapterMatch = text.match(/ch\.?(\d+)/);
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1]);
      
      return {
        bookId: 'think-python',
        title: `${book.title} - Chapter ${chapterNum}`,
        pdfPath: book.pdfPath,
        startPage: 1, // Will be determined by PDF outline
        endPage: 1,
        reference: readingText
      };
    }

    // Default to beginning
    return {
      bookId: 'think-python',
      title: book.title,
      pdfPath: book.pdfPath,
      startPage: 1,
      endPage: 1,
      reference: readingText
    };
  }

  // Handle "Grokking Algorithms" references
  if (text.includes('grokking')) {
    const book = BOOKS['grokking-algorithms'];
    
    // Look for chapter references
    const chapterMatch = text.match(/ch\.?(\d+)/);
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1]);
      
      return {
        bookId: 'grokking-algorithms',
        title: `${book.title} - Chapter ${chapterNum}`,
        pdfPath: book.pdfPath,
        startPage: 1, // Will be determined by PDF outline
        endPage: 1,
        reference: readingText
      };
    }

    // Default to beginning
    return {
      bookId: 'grokking-algorithms',
      title: book.title,
      pdfPath: book.pdfPath,
      startPage: 1,
      endPage: 1,
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