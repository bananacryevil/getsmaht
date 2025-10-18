// Notes utilities: normalize various note formats (plain text or BlockNote JSON)

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function extractText(node) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('\n');
  if (isObject(node)) {
    // Prefer common text-bearing fields
    if (typeof node.content === 'string') return node.content;
    if (Array.isArray(node.content)) return node.content.map(extractText).join('\n');
    if (typeof node.text === 'string') return node.text;
    if (Array.isArray(node.children)) return node.children.map(extractText).join('\n');
    // Fallback: concatenate all string values on the object
    const parts = [];
    for (const key of Object.keys(node)) {
      const val = node[key];
      if (typeof val === 'string') parts.push(val);
      else if (Array.isArray(val)) parts.push(val.map(extractText).join('\n'));
      else if (isObject(val)) parts.push(extractText(val));
    }
    return parts.join('\n');
  }
  return '';
}

export function noteToPlainText(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    // Try to parse as JSON first; if fails, treat as plain text
    try {
      const parsed = JSON.parse(value);
      return extractText(parsed) || '';
    } catch {
      return value;
    }
  }
  // If already parsed JSON (array/object), extract text
  try {
    return extractText(value) || '';
  } catch {
    return '';
  }
}

export function isEmptyNote(value) {
  return noteToPlainText(value).trim().length === 0;
}

export function noteWordCount(value) {
  const text = noteToPlainText(value).trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}
