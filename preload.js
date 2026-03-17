const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hermes', {
  // Window controls
  minimize: () => ipcRenderer.send('win-minimize'),
  maximize: () => ipcRenderer.send('win-maximize'),
  close:    () => ipcRenderer.send('win-close'),

  // Config
  configGet:    (key)      => ipcRenderer.invoke('config-get', key),
  configSet:    (key, val) => ipcRenderer.invoke('config-set', key, val),
  configHas:    (key)      => ipcRenderer.invoke('config-has', key),
  configAll:    ()         => ipcRenderer.invoke('config-all'),
  configDelete: (key)      => ipcRenderer.invoke('config-delete', key),

  // Bridge API
  bridgeFetch: (url, opts) => ipcRenderer.invoke('bridge-fetch', url, opts),

  // SSH
  sshExec: (host, user, keyPath, command) =>
    ipcRenderer.invoke('ssh-exec', host, user, keyPath, command),

  // SSH-tunneled fetch for internal vessels
  sshFetch: (host, user, keyPath, port, method, urlPath, body, token) =>
    ipcRenderer.invoke('ssh-fetch', host, user, keyPath, port, method, urlPath, body, token),

  // Self-update
  selfUpdate: (url) => ipcRenderer.invoke('self-update', url),

  // Shell
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // File upload
  fileDialog: () => ipcRenderer.invoke('file-dialog'),
  uploadFile: (url, filePath, token) => ipcRenderer.invoke('upload-file', url, filePath, token),

  // Vault / Obsidian
  vaultSync: (host, user, keyPath) => ipcRenderer.invoke('vault-sync', host, user, keyPath),
  openObsidian: (vaultPath) => ipcRenderer.invoke('open-obsidian', vaultPath),
});
