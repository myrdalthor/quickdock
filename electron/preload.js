const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFilePicker: (options) => ipcRenderer.invoke('open-file-picker', options),
  setStartup: (enable) => ipcRenderer.invoke('set-startup', enable),
});