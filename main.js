const { app, BrowserWindow, ipcMain, net, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

const store = new Store({ encryptionKey: 'hermes-vessel-key' });

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 540,
    minWidth: 960,
    minHeight: 540,
    frame: false,
    resizable: true,
    backgroundColor: '#0a0a1a',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Grand Internet Hotel',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.loadFile('src/index.html');

  if (process.argv.includes('--dev')) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

// ── IPC Handlers ──

// Window controls
ipcMain.on('win-minimize', () => win?.minimize());
ipcMain.on('win-maximize', () => {
  if (win?.isMaximized()) win.unmaximize();
  else win?.maximize();
});
ipcMain.on('win-close', () => win?.close());

// Config store
ipcMain.handle('config-get', (_, key) => store.get(key));
ipcMain.handle('config-set', (_, key, val) => store.set(key, val));
ipcMain.handle('config-has', (_, key) => store.has(key));
ipcMain.handle('config-all', () => store.store);
ipcMain.handle('config-delete', (_, key) => store.delete(key));

// Bridge API proxy (avoids CORS from renderer)
ipcMain.handle('bridge-fetch', async (_, url, opts) => {
  const timeout = opts.timeout || 300000; // 5 min default (builds can take a while)

  // Try HTTPS first, fall back to HTTP if SSL fails
  const urls = [url];
  if (url.startsWith('https://')) {
    urls.push(url.replace('https://', 'http://'));
  }

  for (const tryUrl of urls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const resp = await net.fetch(tryUrl, {
        method: opts.method || 'GET',
        headers: opts.headers || {},
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);
      const text = await resp.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: `Non-JSON response (${resp.status}): ${text.slice(0, 200)}` };
      }
      return { ok: resp.ok, status: resp.status, data };
    } catch (e) {
      // If this was HTTPS and it failed, try HTTP fallback
      if (tryUrl.startsWith('https://') && urls.length > 1) continue;
      return { ok: false, status: 0, data: { error: e.message } };
    }
  }
  return { ok: false, status: 0, data: { error: 'All connection attempts failed' } };
});

// Open external URL in default browser
ipcMain.handle('open-external', async (_, url) => {
  const { shell } = require('electron');
  await shell.openExternal(url);
  return true;
});

// SSH for initial setup
ipcMain.handle('ssh-exec', async (_, host, user, keyPath, command) => {
  const { NodeSSH } = require('node-ssh');
  const ssh = new NodeSSH();
  try {
    await ssh.connect({ host, username: user, privateKeyPath: keyPath });
    const result = await ssh.execCommand(command);
    ssh.dispose();
    return { stdout: result.stdout, stderr: result.stderr, code: result.code };
  } catch (e) {
    return { stdout: '', stderr: e.message, code: -1 };
  }
});

// SSH-tunneled fetch for internal (closed-port) vessels
ipcMain.handle('ssh-fetch', async (_, host, user, keyPath, port, method, urlPath, body, token) => {
  const { NodeSSH } = require('node-ssh');
  const ssh = new NodeSSH();
  try {
    await ssh.connect({ host, username: user, privateKeyPath: keyPath });
    let cmd = `curl -s -m 120 -X ${method || 'GET'}`;
    cmd += ` -H 'Content-Type: application/json'`;
    if (token) cmd += ` -H 'X-Build-Token: ${token}'`;
    if (body) {
      const escaped = JSON.stringify(JSON.stringify(body));
      cmd += ` -d ${escaped}`;
    }
    cmd += ` http://127.0.0.1:${port}/${urlPath.replace(/^\//, '')}`;
    const result = await ssh.execCommand(cmd, { execOptions: { timeout: 180000 } });
    ssh.dispose();
    let data;
    try { data = JSON.parse(result.stdout); } catch { data = { raw: result.stdout, error: result.stderr }; }
    return { ok: !result.code && !data.error, status: result.code === 0 ? 200 : 500, data };
  } catch (e) {
    return { ok: false, status: 0, data: { error: e.message } };
  }
});

// Self-update: download latest exe from doorman site and launch installer
ipcMain.handle('self-update', async (_, downloadUrl) => {
  const os = require('os');
  const { execFile } = require('child_process');
  const tmpDir = os.tmpdir();
  const outPath = path.join(tmpDir, 'GIH-Update.exe');

  try {
    // Download the installer
    const resp = await net.fetch(downloadUrl);
    if (!resp.ok) return { ok: false, error: `Download failed: ${resp.status}` };
    const buffer = Buffer.from(await resp.arrayBuffer());
    fs.writeFileSync(outPath, buffer);

    // Launch the installer and quit
    execFile(outPath, { detached: true, stdio: 'ignore' }).unref();
    setTimeout(() => app.quit(), 500);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

// File picker dialog
ipcMain.handle('file-dialog', async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] },
      { name: 'Documents', extensions: ['pdf', 'txt', 'md', 'html', 'css', 'js'] },
    ],
  });
  if (result.canceled) return [];
  return result.filePaths;
});

// Upload file to vessel via multipart POST
ipcMain.handle('upload-file', async (_, uploadUrl, filePath, token) => {
  try {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const boundary = '----HermesUpload' + Date.now();

    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
    body += 'Content-Type: application/octet-stream\r\n\r\n';

    const prefix = Buffer.from(body, 'utf8');
    const suffix = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    const fullBody = Buffer.concat([prefix, fileBuffer, suffix]);

    const resp = await net.fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'X-Build-Token': token || '',
      },
      body: fullBody,
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return { ok: resp.ok, status: resp.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { error: e.message } };
  }
});

// ── Vault sync & Obsidian ──────────────────────────────────────────────────
ipcMain.handle('vault-sync', async (_, host, user, keyPath) => {
  const os = require('os');
  const localVault = path.join(os.homedir(), 'HermesVault');

  try {
    if (!fs.existsSync(localVault)) fs.mkdirSync(localVault, { recursive: true });

    // Create .obsidian config so Obsidian recognizes this as a vault
    const obsidianDir = path.join(localVault, '.obsidian');
    if (!fs.existsSync(obsidianDir)) {
      fs.mkdirSync(obsidianDir, { recursive: true });
      // Write minimal app.json config
      fs.writeFileSync(path.join(obsidianDir, 'app.json'), JSON.stringify({
        "showLineNumber": true,
        "defaultViewMode": "preview",
        "livePreview": true
      }, null, 2));
      // Write appearance config for dark theme
      fs.writeFileSync(path.join(obsidianDir, 'appearance.json'), JSON.stringify({
        "baseFontSize": 16,
        "theme": "obsidian"
      }, null, 2));
    }

    const { NodeSSH } = require('node-ssh');
    const ssh = new NodeSSH();
    await ssh.connect({ host, username: user, privateKeyPath: keyPath });

    const result = await ssh.execCommand('find /root/hermes/vessel/vault -name "*.md" -type f 2>/dev/null');
    const files = (result.stdout || '').split('\n').filter(f => f.trim());

    for (const remotePath of files) {
      const rel = remotePath.replace('/root/hermes/vessel/vault/', '');
      const localPath = path.join(localVault, rel);
      const localDir = path.dirname(localPath);
      if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
      await ssh.getFile(localPath, remotePath);
    }

    ssh.dispose();
    return { ok: true, path: localVault, count: files.length };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('open-obsidian', async (_, vaultPath) => {
  const { shell } = require('electron');
  try {
    // Just open the folder — user picks "Open folder as vault" in Obsidian
    await shell.openPath(vaultPath);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
