// main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (process.env.ELECTRON_START_URL) {
    // Dev mode: Vite dev server
    win.loadURL(process.env.ELECTRON_START_URL);
    win.webContents.openDevTools(); // optional: DevTools for debugging
  } else {
    // Production: load built React app from dist with relative paths
    const indexHtml = path.join(__dirname, "dist", "index.html");
    win.loadFile(indexHtml);
    // win.removeMenu();
  }
}

app.whenReady().then(createWindow);

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
