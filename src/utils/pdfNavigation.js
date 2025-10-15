import { extractPageMarkers, findPageByLabel } from './pageResolver';

const STOP_WORDS = new Set([
  'the','and','for','with','into','from','that','this','your','you','are','was','were',
  'have','has','had','of','to','a','in','on','by','at','an','be','as','or','is','it'
]);

const DASH_REGEX = /[–—−]/g;
const NON_WORD_REGEX = /[^a-z0-9]+/g;

const normalizeTerm = (input) => {
  if (!input) return '';
  return String(input)
    .toLowerCase()
    .replace(DASH_REGEX, '-')
    .replace(/\s+/g, ' ')
    .trim();
};

const tokenize = (input) => {
  const normalized = normalizeTerm(input);
  if (!normalized) return [];
  return normalized
    .replace(/-/g, ' ') // ensure hyphenated tokens are split as well
    .split(/\s+/)
    .map((token) => token.replace(NON_WORD_REGEX, ''))
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token));
};

const pushTerm = (collector, value) => {
  const term = normalizeTerm(value);
  if (!term || collector.seen.has(term)) return;
  collector.seen.add(term);
  collector.terms.push(term);
};

const pushTokens = (collector, value) => {
  const normalized = normalizeTerm(value);
  if (!normalized) return;
  pushTerm(collector, normalized);
  tokenize(normalized).forEach((token) => {
    if (token.length <= 2) return;
    pushTerm(collector, token);
  });
};

export function buildSearchTerms(reference, outlineHints = []) {
  const collector = { terms: [], seen: new Set() };

  // If we have outline hints, use ONLY those for better precision
  if (outlineHints && outlineHints.length > 0) {
    outlineHints.forEach((hint) => pushTokens(collector, hint));
    return collector.terms;
  }

  // Otherwise, fall back to parsing the reference text
  if (reference) {
    pushTokens(collector, reference);

    const chapterMatch = reference.match(/chapter\s+(\d+)/i);
    if (chapterMatch) {
      const chapterNumber = chapterMatch[1];
      pushTerm(collector, `chapter ${chapterNumber}`);
      pushTerm(collector, chapterNumber);
    }

    const sectionMatch = reference.match(/section\s+([\d\.]+)/i);
    if (sectionMatch) {
      const sectionValue = sectionMatch[1];
      pushTerm(collector, `section ${sectionValue}`);
      pushTerm(collector, sectionValue);
    }
  }

  return collector.terms;
}

export async function resolveDestToPage(pdfDocument, dest) {
  if (!pdfDocument || !dest) return null;

  try {
    let resolvedDest = dest;
    if (typeof dest === 'string') {
      resolvedDest = await pdfDocument.getDestination(dest);
    }

    if (Array.isArray(resolvedDest) && resolvedDest[0]) {
      const pageIndex = await pdfDocument.getPageIndex(resolvedDest[0]);
      return pageIndex + 1;
    }
  } catch (error) {
    console.warn('Failed to resolve PDF destination to page:', error);
  }

  return null;
}

async function mapOutlineItems(pdfDocument, items, depth = 0, path = [], normalizedPathParts = []) {
  if (!Array.isArray(items) || items.length === 0) return [];

  const results = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const id = [...path, index].join('-');
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const normalizedTitle = normalizeTerm(title);
    const pathParts = normalizedTitle ? [...normalizedPathParts, normalizedTitle] : [...normalizedPathParts];
    const pageNumber = await resolveDestToPage(pdfDocument, item.dest);

    const node = {
      id,
      title,
      normalizedTitle,
      pageNumber,
      dest: item.dest,
      depth,
      items: [],
      words: new Set(tokenize(normalizedTitle)),
      pathNormalized: pathParts.join(' ').trim()
    };

    node.items = await mapOutlineItems(pdfDocument, item.items, depth + 1, [...path, index], pathParts);
    results.push(node);
  }

  return results;
}

export async function buildOutlineTree(pdfDocument, outline) {
  if (!pdfDocument || !Array.isArray(outline)) return [];
  return mapOutlineItems(pdfDocument, outline, 0, [], []);
}

export function flattenOutline(tree) {
  const flat = [];
  const visit = (nodes) => {
    nodes.forEach((node) => {
      flat.push(node);
      if (node.items && node.items.length) {
        visit(node.items);
      }
    });
  };
  visit(tree);
  return flat;
}

function scoreOutlineNode(node, searchTerms) {
  if (!node) return 0;
  const { normalizedTitle, pathNormalized, words } = node;
  if (!searchTerms || searchTerms.length === 0) return 0;

  let score = 0;

  searchTerms.forEach((term) => {
    if (!term) return;
    const directMatch = normalizedTitle === term;
    const includesMatch = normalizedTitle.includes(term);
    const pathMatch = pathNormalized.includes(term);
    const tokenMatch = words.has(term);

    if (directMatch) score += 20;
    else if (includesMatch) score += 12;
    else if (pathMatch) score += 6;

    if (tokenMatch) score += 5;

    if (term.length >= 5 && includesMatch) score += 3;
  });

  return score;
}

export function findBestOutlineMatch(outlineTree, searchTerms) {
  if (!outlineTree || outlineTree.length === 0 || !searchTerms || searchTerms.length === 0) {
    return null;
  }

  console.log('[findBestOutlineMatch] Search terms:', searchTerms);

  const flatNodes = flattenOutline(outlineTree).filter((node) => typeof node.pageNumber === 'number');
  if (flatNodes.length === 0) return null;

  const scored = flatNodes
    .map((node) => ({ node, score: scoreOutlineNode(node, searchTerms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.node.depth !== b.node.depth) return a.node.depth - b.node.depth;
      return (a.node.pageNumber ?? Number.MAX_SAFE_INTEGER) - (b.node.pageNumber ?? Number.MAX_SAFE_INTEGER);
    });

  console.log('[findBestOutlineMatch] Top 5 matches:', scored.slice(0, 5).map(s => ({
    title: s.node.title,
    page: s.node.pageNumber,
    score: s.score
  })));

  return scored.length > 0 ? scored[0].node : null;
}

export function resolvePageFromLabels(pageLabels, reference, explicitLabel) {
  if (!Array.isArray(pageLabels) || pageLabels.length === 0) return null;

  const markers = reference ? extractPageMarkers(reference) : null;
  const targetLabel = explicitLabel || markers?.startLabel;
  if (!targetLabel) return null;

  return findPageByLabel(pageLabels, targetLabel);
}
