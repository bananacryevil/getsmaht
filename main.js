// main.js
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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
    win.removeMenu();
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
