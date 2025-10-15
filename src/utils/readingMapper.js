// Reading mapping utility to connect curriculum readings with PDF files
import { extractPageMarkers } from './pageResolver';

const solveItPdf = new URL('../assets/solveit.pdf', import.meta.url).href;
const thinkPythonPdf = new URL('../assets/thinkpython.pdf', import.meta.url).href;
const grokkingPdf = new URL('../assets/grokking.pdf', import.meta.url).href;

// Book metadata and chapter mappings
export const BOOKS = {
  'how-to-solve-it': {
    title: 'How to Solve It',
    author: 'George Pólya',
    pdfPath: solveItPdf
  },
  'think-python': {
    title: 'Think Python',
    author: 'Allen B. Downey',
    pdfPath: thinkPythonPdf
  },
  'grokking-algorithms': {
    title: 'Grokking Algorithms',
    author: 'Aditya Bhargava',
    pdfPath: grokkingPdf
  }
};

function withPageMetadata(result, readingText) {
  const markers = extractPageMarkers(readingText);
  const enriched = { ...result };

  if (markers?.startLabel) {
    enriched.startLabel = markers.startLabel;
  } else if (enriched.startLabel == null && typeof enriched.startPage === 'number') {
    enriched.startLabel = String(enriched.startPage);
  }

  if (markers?.endLabel) {
    enriched.endLabel = markers.endLabel;
  } else if (enriched.endLabel == null && typeof enriched.endPage === 'number') {
    enriched.endLabel = String(enriched.endPage);
  }

  return enriched;
}

// Parse reading string to extract book and chapter/page info or handle web links
export function parseReading(readingText) {
  if (!readingText || typeof readingText !== 'string') return null;

  const text = readingText.toLowerCase().trim();
  
  // Handle web URLs - return them as external links
  if (readingText.startsWith('http://') || readingText.startsWith('https://')) {
    return withPageMetadata({
      isExternalLink: true,
      url: readingText,
      title: 'External Resource',
      reference: readingText
    }, readingText);
  }

  // Handle "How to Solve It" references
  if (text.includes('how to solve it')) {
    const book = BOOKS['how-to-solve-it'];

    const createResult = ({ title = book.title, keywordHints = [] } = {}) => (
      withPageMetadata({
        bookId: 'how-to-solve-it',
        title,
        pdfPath: book.pdfPath,
        reference: readingText,
        keywordHints
      }, readingText)
    );
    
    // Look for specific sections
    if (text.includes('introduction') && text.includes('understanding')) {
      return createResult({
        title: `${book.title} - Introduction & Understanding the Problem`,
        keywordHints: ['Introduction', 'Understanding the Problem', 'Part I']
      });
    }
    
    if (text.includes('devising') && text.includes('plan')) {
      return createResult({
        title: `${book.title} - Devising a Plan`,
        keywordHints: ['Devising a Plan']
      });
    }
    
    if (text.includes('carrying out') && text.includes('plan')) {
      return createResult({
        title: `${book.title} - Carrying Out the Plan`,
        keywordHints: ['Carrying Out the Plan']
      });
    }
    
    if (text.includes('looking back')) {
      return createResult({
        title: `${book.title} - Looking Back`,
        keywordHints: ['Looking Back']
      });
    }
    
    // Look for page ranges like "pp.1-34" or "pp. 9-25"
  const pageMatch = text.match(/pp\.?\s*([ivxlcdm\d]+)-([ivxlcdm\d]+)/);
    if (pageMatch) {
      return createResult({
        title: `${book.title} - Pages ${pageMatch[1]}-${pageMatch[2]}`
      });
    }

    // Default to introduction
    return createResult({
      keywordHints: ['Introduction']
    });
  }

  // Handle "Think Python" references
  if (text.includes('think python')) {
    const book = BOOKS['think-python'];
    const chapterTitles = {
      1: 'The Way of the Program',
      2: 'Variables, Expressions and Statements',
      3: 'Functions',
      4: 'Case Study: Interface Design',
      5: 'Conditionals and Recursion',
      6: 'Fruitful Functions',
      7: 'Iteration',
      8: 'Strings',
      9: 'Case Study: Word Play',
      10: 'Lists',
      11: 'Dictionaries',
      12: 'Tuples'
    };

    const createResult = ({ title = `${book.title}`, keywordHints = [] } = {}) => (
      withPageMetadata({
        bookId: 'think-python',
        title,
        pdfPath: book.pdfPath,
        reference: readingText,
        keywordHints
      }, readingText)
    );
    
    // Look for chapter references like "ch. 2", "chapter 3", etc.
    const chapterMatch = text.match(/ch\.?\s*(\d+)|chapter\s+(\d+)/);
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1] || chapterMatch[2]);
      const chapterTitle = chapterTitles[chapterNum];

      return createResult({
        title: chapterTitle
          ? `${book.title} - Chapter ${chapterNum}: ${chapterTitle}`
          : `${book.title} - Chapter ${chapterNum}`,
        keywordHints: chapterTitle
          ? [`Chapter ${chapterNum}`, chapterTitle]
          : [`Chapter ${chapterNum}`]
      });
    }

    // Default to chapter 1
    return createResult({
      title: `${book.title} - Chapter 1`,
      keywordHints: ['Chapter 1', 'The Way of the Program']
    });
  }

  // Handle "Grokking Algorithms" references
  if (text.includes('grokking')) {
    const book = BOOKS['grokking-algorithms'];
    const chapterTopics = {
      1: ['Introduction to Algorithms', 'Chapter 1'],
      2: ['Selection Sort', 'Chapter 2'],
      3: ['Recursion', 'Chapter 3'],
      4: ['Quicksort', 'Chapter 4'],
      5: ['Hash Tables', 'Chapter 5'],
      6: ['Breadth-First Search', 'Chapter 6'],
      7: ["Dijkstra's Algorithm", 'Chapter 7'],
      8: ['Greedy Algorithms', 'Chapter 8'],
      9: ['Dynamic Programming', 'Chapter 9'],
      10: ['K-nearest Neighbors', 'Chapter 10']
    };

    const createResult = ({ title = `${book.title}`, keywordHints = [] } = {}) => (
      withPageMetadata({
        bookId: 'grokking-algorithms',
        title,
        pdfPath: book.pdfPath,
        reference: readingText,
        keywordHints
      }, readingText)
    );
    
    // Look for chapter references
    const chapterMatch = text.match(/ch\.?\s*(\d+)|chapter\s+(\d+)/);
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1] || chapterMatch[2]);
      const topicHints = chapterTopics[chapterNum] || [`Chapter ${chapterNum}`];

      return createResult({
        title: `${book.title} - Chapter ${chapterNum}`,
        keywordHints: topicHints
      });
    }

    // Default to chapter 1
    return createResult({
      title: `${book.title} - Chapter 1`,
      keywordHints: ['Chapter 1', 'Introduction to Algorithms']
    });
  }

  return null;
}

// Get all available books for UI
export function getAllBooks() {
  return Object.entries(BOOKS).map(([id, book]) => ({
    id,
    ...book
  }));
}