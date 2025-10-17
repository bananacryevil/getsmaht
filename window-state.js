// window-state.js
// Persists and restores window bounds (x, y, width, height) per window key.
// Backward compatible with the previous single-shared state format.

import { app, screen } from 'electron';
import path from 'path';
import fs from 'fs/promises';

const stateFilePath = () => path.join(app.getPath('userData'), 'window-state.json');

// Read the state file and return an object mapping keys to bounds.
// Supports legacy format where the file directly contained a single bounds object.
async function readAllStates() {
  try {
    const content = await fs.readFile(stateFilePath(), 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object') return {};

    // Legacy format: a single bounds object at top-level
    if (isBounds(parsed)) {
      return { default: parsed };
    }

    // New format: mapping of keys -> bounds
    const out = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (isBounds(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

async function writeAllStates(map) {
  try {
    const dir = app.getPath('userData');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(stateFilePath(), JSON.stringify(map, null, 2), 'utf-8');
  } catch (e) {
    // Non-fatal: failure to write shouldn't crash the app
    console.error('Failed to save window state:', e);
  }
}

function isBounds(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const { x, y, width, height } = obj;
  return (
    Number.isFinite(x) && Number.isFinite(y) &&
    Number.isFinite(width) && Number.isFinite(height)
  );
}

function clampToMin(bounds, minWidth, minHeight) {
  const width = Math.max(bounds.width, minWidth || 0);
  const height = Math.max(bounds.height, minHeight || 0);
  return { ...bounds, width, height };
}

function ensureVisibleOnSomeDisplay(bounds) {
  const displays = screen.getAllDisplays();
  if (!displays || displays.length === 0) return bounds;

  const B = bounds;
  const intersects = (a, b) =>
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

  const hasIntersection = displays.some(d =>
    intersects(
      { x: B.x, y: B.y, width: Math.max(B.width, 50), height: Math.max(B.height, 50) },
      d.workArea
    )
  );

  if (hasIntersection) return bounds;

  // Fallback: center on primary display work area
  const primary = screen.getPrimaryDisplay();
  const wa = primary?.workArea || { x: 0, y: 0, width: 1280, height: 800 };
  const width = Math.min(B.width, wa.width);
  const height = Math.min(B.height, wa.height);
  const x = Math.floor(wa.x + (wa.width - width) / 2);
  const y = Math.floor(wa.y + (wa.height - height) / 2);
  return { x, y, width, height };
}

export async function getInitialBounds(options = {}) {
  const {
    defaultWidth = 1600,
    defaultHeight = 900,
    minWidth = 0,
    minHeight = 0,
    key = 'default',
  } = options;

  const all = await readAllStates();
  const saved = all[key] ?? all.default;
  let base = saved ?? (() => {
    // Center a default-size window on the primary display
    const primary = screen.getPrimaryDisplay();
    const wa = primary?.workArea || { x: 0, y: 0, width: defaultWidth, height: defaultHeight };
    const width = Math.min(defaultWidth, wa.width);
    const height = Math.min(defaultHeight, wa.height);
    const x = Math.floor(wa.x + (wa.width - width) / 2);
    const y = Math.floor(wa.y + (wa.height - height) / 2);
    return { x, y, width, height };
  })();

  base = clampToMin(base, minWidth, minHeight);
  base = ensureVisibleOnSomeDisplay(base);
  return base;
}

export function watchWindowState(win, key = 'default') {
  if (!win) return;

  let saveTimer = null;
  const scheduleSave = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        const b = win.getBounds();
        // Merge with existing states to avoid clobbering other windows
        const all = await readAllStates();
        all[key] = { x: b.x, y: b.y, width: b.width, height: b.height };
        await writeAllStates(all);
      } catch (e) {
        console.error('Failed to persist window bounds:', e);
      }
    }, 300);
  };

  win.on('resize', scheduleSave);
  win.on('move', scheduleSave);
  win.on('close', async () => {
    if (saveTimer) clearTimeout(saveTimer);
    try {
      const b = win.getBounds();
      const all = await readAllStates();
      all[key] = { x: b.x, y: b.y, width: b.width, height: b.height };
      await writeAllStates(all);
    } catch (e) {
      console.error('Failed to persist window bounds on close:', e);
    }
  });
}
