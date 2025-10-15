// Utility helpers for mapping reading references to concrete PDF page numbers

const ROMAN_MAP = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 };

function computeMedian(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

export function romanToInt(input) {
  if (!input) return null;
  const value = String(input).trim().toLowerCase();
  if (!value || !/^m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i.test(value)) {
    return null;
  }

  let total = 0;
  let prev = 0;
  for (let i = value.length - 1; i >= 0; i -= 1) {
    const char = value[i];
    const current = ROMAN_MAP[char] || 0;
    if (current < prev) {
      total -= current;
    } else {
      total += current;
      prev = current;
    }
  }
  return total;
}

export function normalizePageLabel(label) {
  if (label == null) return null;
  const raw = String(label).trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (/^([ivxlcdm]+|\d+)$/.test(lower)) {
    return lower;
  }
  const match = lower.match(/([ivxlcdm]+|\d+)/);
  if (match) {
    return match[1];
  }
  return lower;
}

export function extractPageMarkers(reference) {
  if (!reference || typeof reference !== 'string') return null;
  const rangeRegex = /p{1,2}\.?\s*([ivxlcdm\d]+)\s*[-–—]\s*([ivxlcdm\d]+)/i;
  const singleRegex = /p{1,2}\.?\s*([ivxlcdm\d]+)/i;

  const rangeMatch = reference.match(rangeRegex);
  if (rangeMatch) {
    return {
      startLabel: normalizePageLabel(rangeMatch[1]),
      endLabel: normalizePageLabel(rangeMatch[2])
    };
  }

  const singleMatch = reference.match(singleRegex);
  if (singleMatch) {
    return {
      startLabel: normalizePageLabel(singleMatch[1])
    };
  }

  return null;
}

export function findPageByLabel(pageLabels, targetLabel) {
  if (!pageLabels || !pageLabels.length || !targetLabel) return null;
  const normalizedTarget = normalizePageLabel(targetLabel);
  if (!normalizedTarget) return null;

  const normalizedLabels = pageLabels.map((label) => normalizePageLabel(label));
  const directIndex = normalizedLabels.findIndex((label) => label === normalizedTarget);
  if (directIndex !== -1) {
    return directIndex + 1;
  }

  const numericTarget = Number.parseInt(normalizedTarget, 10);
  if (!Number.isNaN(numericTarget)) {
    const numericOffsets = normalizedLabels
      .map((label, index) => {
        const value = Number.parseInt(label, 10);
        if (Number.isNaN(value)) return null;
        return (index + 1) - value;
      })
      .filter((value) => value != null);

    const offset = computeMedian(numericOffsets);
    if (offset != null) {
      const candidate = numericTarget + offset;
      if (candidate >= 1 && candidate <= pageLabels.length) {
        return candidate;
      }
    }
  }

  const romanTarget = romanToInt(normalizedTarget);
  if (romanTarget != null) {
    const romanOffsets = normalizedLabels
      .map((label, index) => {
        const value = romanToInt(label);
        if (value == null) return null;
        return (index + 1) - value;
      })
      .filter((value) => value != null);

    const offset = computeMedian(romanOffsets);
    if (offset != null) {
      const candidate = romanTarget + offset;
      if (candidate >= 1 && candidate <= pageLabels.length) {
        return candidate;
      }
    }
  }

  return null;
}
