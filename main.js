// main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { getInitialBounds, watchWindowState } from "./window-state.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
const notesWindows = new Map();

async function createWindow() {
  const initialBounds = await getInitialBounds({ defaultWidth: 1600, defaultHeight: 900, key: 'main' });
  const win = new BrowserWindow({
    ...initialBounds,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  mainWindow = win;
  watchWindowState(win, 'main');

  if (process.env.ELECTRON_START_URL) {
    // Dev mode: Vite dev server
    win.loadURL(process.env.ELECTRON_START_URL);
    win.webContents.openDevTools(); // optional: DevTools for debugging
  } else {
    // Production: load built React app from dist with relative paths
    const indexHtml = path.join(__dirname, "dist", "index.html");
    win.loadFile(indexHtml);
    win.removeMenu();
  }
}

async function createNotesWindow(day, title) {
  // Check if window for this day already exists
  if (notesWindows.has(day)) {
    const existingWindow = notesWindows.get(day);
    if (!existingWindow.isDestroyed()) {
      existingWindow.focus();
      return;
    }
  }

  const initialBounds = await getInitialBounds({ defaultWidth: 800, defaultHeight: 600, minWidth: 400, minHeight: 300, key: `notes` });
  const notesWin = new BrowserWindow({
    ...initialBounds,
    minWidth: 400,
    minHeight: 300,
    title: `Notes - Day ${day}: ${title}`,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  notesWindows.set(day, notesWin);
  // Use a shared key for all notes windows so they restore consistently
  watchWindowState(notesWin, 'notes');

  // Clean up when window is closed
  notesWin.on('closed', () => {
    notesWindows.delete(day);
  });

  if (process.env.ELECTRON_START_URL) {
    // Dev mode: Vite dev server
    notesWin.loadURL(`${process.env.ELECTRON_START_URL}/notes.html?day=${day}`);
  } else {
    // Production: load notes page from dist
    const notesHtml = path.join(__dirname, "dist", "notes.html");
    notesWin.loadFile(notesHtml, { query: { day: String(day) } });
    notesWin.removeMenu();
  }
}

app.whenReady().then(createWindow);

ipcMain.handle('notes:open-window', async (_event, { day, title }) => {
  createNotesWindow(day, title);
  return { success: true };
});

ipcMain.handle('notes:get-data', async (_event, day) => {
  // Request notes data from main window
  if (mainWindow && !mainWindow.isDestroyed()) {
    const notes = await mainWindow.webContents.executeJavaScript(
      `(function() {
        const stored = localStorage.getItem('curriculum_tracker_v1');
        if (!stored) return '';
        const data = JSON.parse(stored);
        const item = data.find(i => i.day === ${day});
        return item ? (item.notes || '') : '';
      })()`
    );
    return notes;
  }
  return '';
});

ipcMain.handle('notes:save-data', async (_event, { day, notes }) => {
  // Update notes in main window's localStorage
  if (mainWindow && !mainWindow.isDestroyed()) {
    await mainWindow.webContents.executeJavaScript(
      `(function() {
        const stored = localStorage.getItem('curriculum_tracker_v1');
        if (!stored) return;
        const data = JSON.parse(stored);
        const idx = data.findIndex(i => i.day === ${day});
        if (idx !== -1) {
          data[idx].notes = ${JSON.stringify(notes)};
          localStorage.setItem('curriculum_tracker_v1', JSON.stringify(data));
          window.dispatchEvent(new CustomEvent('notes-updated', { detail: { day: ${day}, notes: ${JSON.stringify(notes)} } }));
        }
      })()`
    );
  }
  return { success: true };
});

ipcMain.handle('pdf:read-file', async (_event, fileUrl) => {
  try {
    if (!fileUrl || typeof fileUrl !== 'string') {
      throw new Error('Invalid file url');
    }

    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      throw new Error('Remote URLs should be fetched directly from the renderer process.');
    }

    let filePath;

    if (fileUrl.startsWith('file://')) {
      filePath = fileURLToPath(fileUrl);
    } else {
      const distDir = path.join(__dirname, 'dist');
      let relativePath = fileUrl;

      if (relativePath.startsWith('./')) {
        relativePath = relativePath.slice(2);
      }

      relativePath = relativePath.replace(/^[/\\]+/, '');

      const candidatePath = path.resolve(distDir, relativePath);

      if (!candidatePath.startsWith(distDir)) {
        throw new Error('Attempted to access a file outside the application directory.');
      }

      filePath = candidatePath;
    }

    const data = await fs.readFile(filePath);
    return new Uint8Array(data);
  } catch (error) {
    console.error('Failed to read PDF file:', error);
    throw error;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
