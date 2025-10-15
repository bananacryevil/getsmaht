const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: async (fileUrl) => ipcRenderer.invoke('pdf:read-file', fileUrl),
  notes: {
    openWindow: async (day, title) => ipcRenderer.invoke('notes:open-window', { day, title }),
    getData: async (day) => ipcRenderer.invoke('notes:get-data', day),
    saveData: async (day, notes) => ipcRenderer.invoke('notes:save-data', { day, notes }),
  },
});
