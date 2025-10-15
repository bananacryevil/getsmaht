const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: async (fileUrl) => ipcRenderer.invoke('pdf:read-file', fileUrl),
});
