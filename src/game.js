/* ══════════════════════════════════════════════
   HERMES WEBKIT — 8-Bit Game Client
   Scenes: Boot → Wizard → Hub
   ══════════════════════════════════════════════ */

const COLORS = {
  bg:     0x0a0a1a,
  panel:  0x0f0f2a,
  border: 0x2a2a4a,
  amber:  0xf0a030,
  green:  0x00ff88,
  cyan:   0x00ccff,
  red:    0xff4444,
  white:  0xe0e0e0,
  dim:    0x606080,
};

const FONT = { fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#e0e0e0' };

// ── Helper: pixel-bordered rectangle ──
function drawPixelBox(scene, x, y, w, h, borderColor = COLORS.amber, fillColor = COLORS.panel) {
  const g = scene.add.graphics();
  g.fillStyle(fillColor, 1);
  g.fillRect(x, y, w, h);
  g.lineStyle(2, borderColor, 1);
  g.strokeRect(x, y, w, h);
  return g;
}

// ── Helper: make a clickable pixel button ──
function makeButton(scene, x, y, w, h, label, onClick) {
  const bg = drawPixelBox(scene, x, y, w, h, COLORS.amber, 0x141430);
  const txt = scene.add.text(x + w / 2, y + h / 2, label, {
    ...FONT, fontSize: '12px', color: '#f0a030',
  }).setOrigin(0.5);

  // Make interactive zone
  const zone = scene.add.zone(x + w / 2, y + h / 2, w, h).setInteractive({ useHandCursor: true });
  zone.on('pointerover', () => txt.setColor('#ffcc00'));
  zone.on('pointerout',  () => txt.setColor('#f0a030'));
  zone.on('pointerdown', onClick);

  return { bg, txt, zone };
}

/* ══════════════════════════════════════════════
   BOOT SCENE — CRT startup + title screen
   ══════════════════════════════════════════════ */
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this.advancing = false;
    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;

    this.cameras.main.setBackgroundColor(0x000000);

    const lines = [
      'PROMETHEUS7 BIOS v0.1',
      '========================',
      'CPU: VESSEL-CORE A1',
      'MEM: 4096K OK',
      'DISK: HERMES-WEBKIT',
      '',
      'LOADING BRIDGE...',
      'HECATE ROUTING... OK',
      'VESSEL IDENTITY... OK',
      '',
    ];

    const textObj = this.add.text(40, 30, '', {
      ...FONT, fontSize: '13px', color: '#00ff88', lineSpacing: 6,
    });

    // Allow clicking to skip boot sequence
    const skipHint = this.add.text(cx, cy + 220, 'CLICK TO SKIP', {
      ...FONT, fontSize: '12px', color: '#404060',
    }).setOrigin(0.5);

    let current = 0;
    let skipped = false;
    const timer = this.time.addEvent({
      delay: 120,
      repeat: lines.length - 1,
      callback: () => {
        if (skipped) return;
        current++;
        textObj.setText(lines.slice(0, current).join('\n'));
        if (current >= lines.length) {
          this.time.delayedCall(400, () => {
            if (!skipped) this.showTitle(cx, cy);
          });
        }
      }
    });

    // Click/key to skip boot sequence entirely
    const skipToTitle = () => {
      if (skipped) return;
      skipped = true;
      timer.remove();
      textObj.destroy();
      skipHint.destroy();
      this.showTitle(cx, cy);
    };
    this.input.once('pointerdown', skipToTitle);
    this.input.keyboard.once('keydown', skipToTitle);
  }

  showTitle(cx, cy) {
    this.cameras.main.setBackgroundColor(0x0a0610);

    // Clear anything left
    this.children.removeAll();

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Casino-style background — deep burgundy with gold accents
    const bg = this.add.graphics();
    // Carpet background
    bg.fillStyle(0x2a0a0a, 1);
    bg.fillRect(0, 0, W, H);
    // Diamond pattern overlay
    bg.lineStyle(1, 0xd4a030, 0.08);
    for (let dx = -H; dx < W + H; dx += 30) {
      bg.lineBetween(dx, 0, dx + H, H);
      bg.lineBetween(dx + H, 0, dx, H);
    }
    // Gold border frame
    bg.lineStyle(3, 0xd4a030, 0.8);
    bg.strokeRect(20, 20, W - 40, H - 40);
    bg.lineStyle(1, 0xd4a030, 0.4);
    bg.strokeRect(26, 26, W - 52, H - 52);
    // Corner ornaments
    const corners = [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]];
    for (const [cornX, cornY] of corners) {
      bg.fillStyle(0xd4a030, 0.6);
      bg.fillRect(cornX - 4, cornY - 4, 8, 8);
      bg.fillStyle(0xffd700, 0.3);
      bg.fillRect(cornX - 2, cornY - 2, 4, 4);
    }

    // ♦ THE GRAND ♦
    this.add.text(cx, cy - 110, '♦  T H E  G R A N D  ♦', {
      ...FONT, fontSize: '14px', color: '#d4a030',
    }).setOrigin(0.5);

    // INTERNET HOTEL — big marquee text
    this.add.text(cx, cy - 70, 'INTERNET', {
      ...FONT, fontSize: '36px', color: '#ffd700',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 30, 'H O T E L', {
      ...FONT, fontSize: '24px', color: '#f0a030',
    }).setOrigin(0.5);

    // Gold separator line
    bg.lineStyle(2, 0xd4a030, 0.6);
    bg.lineBetween(cx - 120, cy, cx - 20, cy);
    bg.lineBetween(cx + 20, cy, cx + 120, cy);
    bg.fillStyle(0xffd700, 0.8);
    bg.fillRect(cx - 4, cy - 4, 8, 8);  // center diamond

    this.add.text(cx, cy + 20, 'HERMES WEBKIT', {
      ...FONT, fontSize: '11px', color: '#8a7040',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 40, 'YOUR SERVER. YOUR MODEL.', {
      ...FONT, fontSize: '10px', color: '#605040',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 55, 'YOUR PRESENCE.', {
      ...FONT, fontSize: '10px', color: '#605040',
    }).setOrigin(0.5);

    // Blinking prompt — casino style
    const press = this.add.text(cx, cy + 90, '♦ CLICK TO ENTER ♦', {
      ...FONT, fontSize: '14px', color: '#ffd700',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: press,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Stepped',
      easeParams: [1],
    });

    // Powered by
    this.add.text(cx, cy + 180, 'PROMETHEUS7', {
      ...FONT, fontSize: '10px', color: '#403020',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 200, 'v1.0.0', {
      ...FONT, fontSize: '10px', color: '#302010',
    }).setOrigin(0.5);

    // Any click or key to proceed
    this.input.once('pointerdown', () => this.advance());
    this.input.keyboard.once('keydown', () => this.advance());
  }

  async advance() {
    if (this.advancing) return;
    this.advancing = true;
    // Check if any provider is configured (apiKey for Anthropic/OpenAI, or llmProvider for Ollama)
    const hasApi = await window.hermes.configHas('apiKey');
    const hasProvider = await window.hermes.configHas('llmProvider');
    this.scene.start((hasApi || hasProvider) ? 'Hub' : 'Wizard');
  }
}

/* ══════════════════════════════════════════════
   WIZARD SCENE — Setup as character creation
   ══════════════════════════════════════════════ */
class WizardScene extends Phaser.Scene {
  constructor() { super('Wizard'); }

  init(data) {
    this.customVessel = (data && data.customVessel) || false;
    this.returnScene = (data && data.returnScene) || 'Hub';
    this.vesselPreset = (data && data.preset) || null;
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Header bar
    drawPixelBox(this, 0, 0, W, 36, COLORS.amber, 0x06060f);
    this.add.text(12, 10, 'VESSEL CREATION', { ...FONT, fontSize: '14px', color: '#f0a030' });

    // Steps with helper descriptions
    if (this.customVessel && this.vesselPreset === 'EXISTING') {
      // Connect an existing vessel already running on the server
      this.config.vesselMode = 'EXISTING';
      this.steps = [
        {
          key: 'domain', label: 'DOMAIN',
          prompt: 'Enter the domain of the existing vessel:',
          help: 'Example: shop.mysite.com\nThe vessel must already be running\non your server.',
          afterSubmit: 'fetchBuildToken',
        },
        {
          key: 'siteName', label: 'VESSEL NAME',
          prompt: 'What should this vessel be called?',
          help: 'A short display name.\nExample: "My Shop" or "Blog"\nThis appears on Floor 2.',
        },
      ];
    } else if (this.customVessel) {
      // New custom vessel — forge on server, reuse existing SSH creds
      this.config.vesselMode = 'NEW';
      this.steps = [
        {
          key: 'domain', label: 'DOMAIN',
          prompt: 'Enter the domain for this vessel:',
          help: 'Example: shop.mysite.com\nThis is the address where the\nvessel will be hosted.',
          afterSubmit: 'fetchBuildToken',
        },
        {
          key: 'siteName', label: 'VESSEL NAME',
          prompt: 'What should this vessel be called?',
          help: 'A short name for your vessel.\nExample: "My Shop" or "Blog"\nThis appears on Floor 2.',
        },
        {
          key: 'siteDesc', label: 'DESCRIPTION',
          prompt: 'Describe this vessel:',
          help: this.vesselPreset === 'DEMETER'
            ? 'This is a DEMETER store vessel.\nExample: "Online merch shop"\nPre-configured for commerce.'
            : 'A brief description of what this\nvessel will do.\nExample: "Photography portfolio"',
        },
      ];
    } else {
      this.steps = [
        {
          key: 'llmProvider', label: 'LLM PROVIDER',
          prompt: 'Choose your AI provider:',
          help: '1 — ANTHROPIC (recommended, best)\n'
            + '2 — OPENAI (GPT-4.1)\n'
            + '3 — OLLAMA (free, self-hosted)\n\n'
            + 'Type ANTHROPIC, OPENAI, or OLLAMA',
          validate: function(v) {
            var up = v.toUpperCase().trim();
            return up === 'ANTHROPIC' || up === 'OPENAI' || up === 'OLLAMA';
          },
          transform: function(v) { return v.toUpperCase().trim(); },
        },
        {
          key: 'apiKey', label: 'API KEY', secret: true,
          prompt: 'Enter your API key:',
          help: 'Anthropic: starts with "sk-ant-"\n  console.anthropic.com\n\nOpenAI: starts with "sk-"\n  platform.openai.com',
          skipIf: function(cfg) { return cfg.llmProvider === 'OLLAMA'; },
        },
        {
          key: 'domain', label: 'DOMAIN',
          prompt: 'Enter your domain name:',
          help: 'Example: mysite.com\nThis is the web address where your\nvessel will live.',
        },
        {
          key: 'vpsIp', label: 'SERVER IP',
          prompt: 'Enter your server IP address:',
          help: 'The IP of your VPS (virtual server).\nExample: 123.45.67.89\nGet this from your hosting provider.',
        },
        {
          key: 'sshKeyPath', label: 'SSH KEY',
          prompt: 'Path to your SSH private key:',
          help: 'Usually: C:\\Users\\you\\.ssh\\id_rsa\nor ~/.ssh/id_rsa on Mac/Linux.\nThis lets the app connect to your server.',
          afterSubmit: 'fetchBuildToken',
        },
        {
          key: 'siteName', label: 'VESSEL NAME',
          prompt: 'What should your vessel be called?',
          help: 'A short name for your site.\nExample: "My Workshop" or "Luna"\nThis will appear in the game hub.',
        },
        {
          key: 'siteDesc', label: 'DESCRIPTION',
          prompt: 'Describe your site:',
          help: 'A brief description of what your\nvessel is about.\nExample: "Digital art portfolio"',
        },
      ];
    }

    this.currentStep = 0;
    this.config = {};

    // Main panel
    this.panel = drawPixelBox(this, 30, 46, W - 60, H - 80, COLORS.amber);

    // Step counter
    this.stepLabel = this.add.text(50, 58, '', { ...FONT, fontSize: '12px', color: '#606080' });

    // Prompt
    this.promptText = this.add.text(50, 82, '', {
      ...FONT, fontSize: '14px', color: '#e0e0e0',
      wordWrap: { width: W - 120 },
    });

    // Helper text
    this.helpText = this.add.text(50, 110, '', {
      ...FONT, fontSize: '12px', color: '#606080',
      lineSpacing: 6,
      wordWrap: { width: W - 120 },
    });

    // Input area — expandable for multi-line (e.g. descriptions)
    this.inputBoxY = 200;
    this.inputBoxH = 36;
    this.inputBox = drawPixelBox(this, 50, this.inputBoxY, W - 100, this.inputBoxH, COLORS.amber, 0x0a0a1a);
    this.inputText = this.add.text(60, 210, '', {
      ...FONT, fontSize: '14px', color: '#00ff88',
      wordWrap: { width: W - 180 },
    });
    this.cursor = this.add.text(60, 210, '_', { ...FONT, fontSize: '14px', color: '#00ff88' });
    this.tweens.add({
      targets: this.cursor, alpha: 0, duration: 400,
      yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [1],
    });

    this.inputBuffer = '';

    // Feedback text (shows briefly after entering)
    this.feedbackText = this.add.text(50, 245, '', {
      ...FONT, fontSize: '12px', color: '#00ff88',
    });

    // Progress dots — bigger
    this.dots = [];
    for (let i = 0; i < this.steps.length; i++) {
      const dot = this.add.rectangle(50 + i * 22, H - 24, 12, 12, COLORS.border);
      dot.setStrokeStyle(1, COLORS.dim);
      this.dots.push(dot);
    }

    // Instructions — clearer
    this.add.text(50, H - 50, 'ENTER = SUBMIT  |  SHIFT+ENTER = NEW LINE  |  ESC = BACK', {
      ...FONT, fontSize: '10px', color: '#606080',
    });

    // Also add a visible NEXT button for mouse users
    this.nextBtn = makeButton(this, W - 180, 200, 120, 36, '> NEXT', () => this.submitStep());

    // Keyboard
    this.input.keyboard.on('keydown', (e) => this.handleKey(e));

    this.showStep();
  }

  showStep() {
    const step = this.steps[this.currentStep];
    this.stepLabel.setText(`STEP ${this.currentStep + 1} OF ${this.steps.length}  ──  ${step.label}`);
    this.promptText.setText(step.prompt);
    this.helpText.setText(step.help);
    this.feedbackText.setText('');
    this.inputBuffer = '';
    this.updateInput();

    // Update dots
    this.dots.forEach((d, i) => {
      if (i < this.currentStep) d.setFillStyle(COLORS.green);
      else if (i === this.currentStep) d.setFillStyle(COLORS.amber);
      else d.setFillStyle(COLORS.border);
    });
  }

  updateInput() {
    const step = this.steps[this.currentStep];
    const display = step.secret ? '*'.repeat(this.inputBuffer.length) : this.inputBuffer;
    const W = this.cameras.main.width;

    this.inputText.setText(display);

    // Expand box height to fit wrapped text
    const textH = this.inputText.height;
    const newBoxH = Math.max(36, textH + 16);
    if (newBoxH !== this.inputBoxH) {
      this.inputBoxH = newBoxH;
      this.inputBox.destroy();
      this.inputBox = drawPixelBox(this, 50, this.inputBoxY, W - 100, newBoxH, COLORS.amber, 0x0a0a1a);
      // Reposition feedback text below the box
      if (this.feedbackText) this.feedbackText.setY(this.inputBoxY + newBoxH + 10);
      // Reposition NEXT button
      if (this.nextBtn) {
        this.nextBtn.bg.destroy();
        this.nextBtn.txt.destroy();
        this.nextBtn.zone.destroy();
        this.nextBtn = makeButton(this, W - 180, this.inputBoxY, 120, newBoxH, '> NEXT', () => this.submitStep());
      }
    }

    // Position cursor at end of last line of text
    const lastLineW = this.inputText.width;
    const lines = this.inputText.text.split('\n');
    if (lines.length > 1) {
      // Multi-line: cursor goes after last line
      const lastLine = lines[lines.length - 1];
      const tmpMetrics = this.inputText;
      this.cursor.setX(60 + (lastLine.length / display.length) * lastLineW);
      this.cursor.setY(210 + (lines.length - 1) * (this.inputText.height / lines.length));
    } else {
      this.cursor.setX(60 + this.inputText.width);
      this.cursor.setY(210);
    }
  }

  handleKey(e) {
    // Paste support
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      navigator.clipboard.readText().then(text => {
        if (text) {
          this.inputBuffer += text.trim();
          this.updateInput();
        }
      }).catch(() => {});
      return;
    }

    if (e.key === 'Enter' && e.shiftKey) {
      // Shift+Enter adds newline for multi-line fields like description
      this.inputBuffer += '\n';
      this.updateInput();
      return;
    } else if (e.key === 'Enter') {
      this.submitStep();
    } else if (e.key === 'Escape') {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.showStep();
      } else {
        // On first step, go back to previous scene
        this.scene.start(this.returnScene || 'Hub');
      }
    } else if (e.key === 'Backspace') {
      this.inputBuffer = this.inputBuffer.slice(0, -1);
      this.updateInput();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && this.inputBuffer.length < 500) {
      this.inputBuffer += e.key;
      this.updateInput();
    }
  }

  submitStep() {
    if (this.inputBuffer.length === 0) {
      this.feedbackText.setText('Please enter a value.').setColor('#ff4444');
      return;
    }

    const step = this.steps[this.currentStep];

    // Validate if step has a validator
    if (step.validate && !step.validate(this.inputBuffer)) {
      this.feedbackText.setText('Invalid input. Check the options above.').setColor('#ff4444');
      return;
    }

    // Transform value if step has a transformer
    this.config[step.key] = step.transform ? step.transform(this.inputBuffer) : this.inputBuffer;

    // If this step has an afterSubmit hook, run it
    if (step.afterSubmit === 'fetchBuildToken') {
      this.feedbackText.setText('CONNECTING TO SERVER...').setColor('#ffcc00');
      this.fetchBuildToken();
      return;
    }

    this.feedbackText.setText('GOT IT!').setColor('#00ff88');

    this.time.delayedCall(400, () => { this._advanceToNextStep(); });
  }

  _advanceToNextStep() {
    // Advance to next step, skipping any with skipIf that returns true
    this.currentStep++;
    while (this.currentStep < this.steps.length) {
      var nextStep = this.steps[this.currentStep];
      if (nextStep.skipIf && nextStep.skipIf(this.config)) {
        this.currentStep++;
      } else {
        break;
      }
    }
    if (this.currentStep < this.steps.length) {
      this.showStep();
    } else {
      this.showSummary();
    }
  }

  async fetchBuildToken() {
    // For custom vessels, pull SSH creds from main saved config
    const savedConfig = await window.hermes.configAll();
    const ip = this.config.vpsIp || savedConfig.vpsIp;
    const keyPath = this.config.sshKeyPath || savedConfig.sshKeyPath;
    const domain = this.config.domain;

    try {
      // SSH into server and find the build token for this domain
      // First try to find vessel by matching domain in nginx config
      const cmd = `grep -rl "server_name.*${domain}" /etc/nginx/sites-enabled/ 2>/dev/null | head -1 | xargs basename 2>/dev/null`;
      const result = await window.hermes.sshExec(ip, 'root', keyPath, cmd);

      let vesselName = (result.stdout || '').trim();
      if (!vesselName) {
        // Fallback: try subdomain as vessel name
        vesselName = domain.split('.')[0];
      }

      // Read BUILD_TOKEN from the vessel's .env
      const tokenCmd = `grep BUILD_TOKEN /root/hermes/vessels/${vesselName}/.env 2>/dev/null | cut -d= -f2`;
      const tokenResult = await window.hermes.sshExec(ip, 'root', keyPath, tokenCmd);
      const token = (tokenResult.stdout || '').trim();

      if (token) {
        this.config.buildToken = token;
        this.feedbackText.setText('TOKEN ACQUIRED!').setColor('#00ff88');
      } else {
        // No token found — generate one and write it
        const genCmd = `TOKEN=$(openssl rand -hex 32) && echo "BUILD_TOKEN=$TOKEN" >> /root/hermes/vessels/${vesselName}/.env 2>/dev/null && echo $TOKEN`;
        const genResult = await window.hermes.sshExec(ip, 'root', keyPath, genCmd);
        const newToken = (genResult.stdout || '').trim();
        if (newToken) {
          this.config.buildToken = newToken;
          this.feedbackText.setText('TOKEN GENERATED!').setColor('#00ff88');
        } else {
          this.config.buildToken = '';
          this.feedbackText.setText('CONNECTED! (no token found)').setColor('#ffcc00');
        }
      }
    } catch (e) {
      this.config.buildToken = '';
      this.feedbackText.setText('SSH FAILED — continuing...').setColor('#ff4444');
    }

    // Advance to next step
    this.time.delayedCall(600, () => {
      this._advanceToNextStep();
    });
  }

  showSummary() {
    // Clear the scene and show a summary before proceeding
    this.children.removeAll();
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    drawPixelBox(this, 0, 0, W, 36, COLORS.amber, 0x06060f);
    this.add.text(12, 10, 'SETUP COMPLETE', { ...FONT, fontSize: '14px', color: '#00ff88' });

    drawPixelBox(this, 30, 50, W - 60, H - 110, COLORS.green, COLORS.panel);

    // Show summary of entered values
    let y = 70;
    for (const step of this.steps) {
      const val = this.config[step.key] || '';
      if (!val) continue; // skip steps that were skipped
      const display = step.secret ? '*'.repeat(Math.min(val.length, 20)) : val;
      this.add.text(50, y, step.label + ':', { ...FONT, fontSize: '12px', color: '#a0a0b0' });
      this.add.text(250, y, display, { ...FONT, fontSize: '12px', color: '#e0e0e0' });
      y += 24;
    }

    // Show build token status
    const tokenStatus = this.config.buildToken ? 'ACQUIRED' : 'MISSING';
    const tokenColor = this.config.buildToken ? '#00ff88' : '#ff4444';
    this.add.text(50, y, 'BUILD TOKEN:', { ...FONT, fontSize: '12px', color: '#a0a0b0' });
    this.add.text(250, y, tokenStatus, { ...FONT, fontSize: '12px', color: tokenColor });
    y += 24;

    this.add.text(50, y + 10, 'Everything look right?', { ...FONT, fontSize: '13px', color: '#e0e0e0' });

    // Buttons
    makeButton(this, 50, y + 40, 200, 36, '> FORGE VESSEL', () => this.startForging());
    makeButton(this, 280, y + 40, 200, 36, '< START OVER', () => {
      this.currentStep = 0;
      this.config = {};
      this.scene.restart();
    });
  }

  async startForging() {
    // For custom vessels, load existing global config (API key, server, SSH key)
    if (this.customVessel) {
      const saved = await window.hermes.configAll();
      this.config.apiKey = saved.apiKey || '';
      this.config.vpsIp = saved.vpsIp || '';
      this.config.sshKeyPath = saved.sshKeyPath || '';
      this.config.buildToken = saved.buildToken || '';
      this.config.llmProvider = saved.llmProvider || 'ANTHROPIC';

      // EXISTING mode — just connect, no forge needed
      if (this.config.vesselMode === 'EXISTING') {
        const vessels = saved.customVessels || [];
        const domain = this.config.domain || '';
        const vesselName = domain.split('.')[0] || 'vessel-' + Date.now();
        // Fetch build token from server
        let token = '';
        try {
          const vesselDir = `/root/hermes/vessels/${vesselName}`;
          const tokenResult = await window.hermes.sshExec(
            this.config.vpsIp, 'root', this.config.sshKeyPath,
            `grep BUILD_TOKEN ${vesselDir}/.env 2>/dev/null | cut -d= -f2`
          );
          token = (tokenResult.stdout || '').trim();
        } catch (e) { /* token optional */ }
        vessels.push({
          key: vesselName,
          name: this.config.siteName || vesselName,
          domain: domain,
          buildToken: token,
          preset: null,
          createdAt: new Date().toISOString(),
        });
        await window.hermes.configSet('customVessels', vessels);

        // Create vault node for existing vessel
        try {
          const hermesCfg = this.config;
          const hermesDomain = hermesCfg.domain?.includes('.') ? null : hermesCfg.domain;
          const savedAll = await window.hermes.configAll();
          const hCfg = savedAll.vessels?.HERMES || {};
          if (hCfg.domain && hCfg.buildToken) {
            const today = new Date().toISOString().split('T')[0];
            const noteContent = `---\ntags: [vessel, existing]\ntype: vessel\ncreated: ${today}\ndomain: ${domain}\n---\n\n# ${vesselName}\n\nExisting vessel connected from ${domain}.\n\n## Connections\n- [[INDEX]]\n- [[vessels/HERMES]]\n`;
            await window.hermes.bridgeFetch(`https://${hCfg.domain}/api/vault/write`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Build-Token': hCfg.buildToken },
              body: { path: `vessels/${vesselName}.md`, content: noteContent },
            });
          }
        } catch (e) { /* vault optional */ }

        this.scene.start(this.returnScene || 'Floor2');
        return;
      }
    }

    // Save config
    for (const [key, val] of Object.entries(this.config)) {
      await window.hermes.configSet(key, val);
    }

    // Remove wizard keyboard listener before switching to forging UI
    this.input.keyboard.removeAllListeners('keydown');

    // Show forging screen
    this.children.removeAll();
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const cx = W / 2;

    this.cameras.main.setBackgroundColor(0x000000);

    drawPixelBox(this, 0, 0, W, 36, COLORS.amber, 0x06060f);
    this.add.text(12, 10, 'FORGING VESSEL...', { ...FONT, fontSize: '14px', color: '#f0a030' });

    // Forge animation area
    const forgeTitle = this.add.text(cx, 80, '⚒ FORGING ⚒', {
      ...FONT, fontSize: '18px', color: '#f0a030',
    }).setOrigin(0.5);
    this.tweens.add({
      targets: forgeTitle, alpha: 0.3, duration: 500,
      yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [1],
    });

    // Progress log
    this.forgeLog = this.add.text(50, 120, '', {
      ...FONT, fontSize: '12px', color: '#606080',
      lineSpacing: 8, wordWrap: { width: W - 100 },
    });
    this.forgeLines = [];

    // Progress bar
    this.forgeBarBg = drawPixelBox(this, 50, H - 70, W - 100, 20, COLORS.amber, 0x0a0a1a);
    this.forgeBarFill = this.add.rectangle(52, H - 68, 0, 16, COLORS.green).setOrigin(0, 0);
    this.forgePercent = this.add.text(cx, H - 44, '0%', {
      ...FONT, fontSize: '12px', color: '#606080',
    }).setOrigin(0.5);

    // Run the build
    await this.runForge();
  }

  addForgeLine(text, color = '#00ff88') {
    this.forgeLines.push(text);
    if (this.forgeLines.length > 12) this.forgeLines.shift();
    this.forgeLog.setText(this.forgeLines.join('\n'));
    this.forgeLog.setColor(color);
  }

  setForgeProgress(pct) {
    const W = this.cameras.main.width;
    const maxWidth = W - 104;
    this.forgeBarFill.width = maxWidth * (pct / 100);
    this.forgePercent.setText(`${Math.round(pct)}%`);
    if (pct >= 100) this.forgePercent.setColor('#00ff88');
  }

  async sshRun(cmd) {
    const ip = this.config.vpsIp;
    const keyPath = this.config.sshKeyPath;
    return await window.hermes.sshExec(ip, 'root', keyPath, cmd);
  }

  async runForge() {
    const domain = this.config.domain;
    let token = this.config.buildToken;
    const name = this.config.siteName || 'My Vessel';
    const desc = this.config.siteDesc || 'A personal website';
    const apiKey = this.config.apiKey;
    const vesselName = domain.split('.')[0];
    const vesselDir = `/root/hermes/vessels/${vesselName}`;

    this.addForgeLine('Connecting to server...', '#606080');
    this.setForgeProgress(3);

    // ── Step 0: Check if vessel already exists ──
    const checkResult = await this.sshRun(`test -d ${vesselDir} && echo EXISTS || echo NEW`);
    const isNew = (checkResult.stdout || '').trim() !== 'EXISTS';

    if (isNew) {
      // ══ FULL VESSEL PROVISIONING ══
      this.addForgeLine('New vessel — provisioning server...', '#f0a030');
      this.setForgeProgress(5);

      // Find next available port
      const portResult = await this.sshRun(
        `grep -h HERMES_PORT /root/hermes/vessels/*/.env 2>/dev/null | cut -d= -f2 | sort -n | tail -1`
      );
      const lastPort = parseInt((portResult.stdout || '8014').trim()) || 8014;
      const port = lastPort + 1;
      this.addForgeLine(`Assigned port ${port}`, '#606080');

      // Generate build token
      token = '';
      const tokenResult = await this.sshRun(`openssl rand -hex 32`);
      token = (tokenResult.stdout || '').trim();
      if (token) {
        this.config.buildToken = token;
        await window.hermes.configSet('buildToken', token);
      }
      this.setForgeProgress(8);

      // Create directory structure
      this.addForgeLine('Creating vessel directory...', '#606080');
      await this.sshRun(`mkdir -p ${vesselDir}/vessel ${vesselDir}/static ${vesselDir}/vessel/products ${vesselDir}/vessel/orders`);
      this.setForgeProgress(10);

      // Create VESSEL.md — the vessel's personality/description
      this.addForgeLine('Writing vessel identity...', '#606080');
      const vesselMd = `# ${name}\n\n${desc}\n\nYou are ${name}, a vessel running on the HERMES WEBKIT platform at the Grand Internet Hotel.\nYou help visitors learn about this site and assist the operator with building and managing their web presence.\nYou are knowledgeable, helpful, and speak with personality.\n\nYour site uses an 8-bit retro pixel art aesthetic: dark background (#0a0a1a), amber (#f0a030) and green (#00ff88) accents, "Press Start 2P" font for headings, subtle CRT scanline effects.\nWhen building pages, create FULL, complete sites — not just banners. Include hero section, main content, footer, and visitor chat input.\n`;
      await this.sshRun(`cat > ${vesselDir}/vessel/VESSEL.md << 'VESSELEOF'\n${vesselMd}\nVESSELEOF`);
      // Create tree directory with MALKUTH output instructions
      await this.sshRun(`mkdir -p ${vesselDir}/vessel/tree`);
      const malkuthMd = '# MALKUTH — output\n\nRender the final HTML response.\n\nRules:\n- Return complete, valid HTML. Dark background (#0a0a1a), amber (#f0a030) and green (#00ff88) accents.\n- Use Google Fonts "Press Start 2P" for headings. 8-bit retro pixel art style.\n- Mobile responsive. Include subtle CSS scanline overlay.\n- Build FULL pages: hero section, main content area, footer, and visitor input.\n- End every page with: <div class="ask-section"><input id="hermes-input" type="text" placeholder="ask something..." /><button id="hermes-send">send</button></div>\n- Do not include chat/cart JavaScript — it is injected automatically.\n- For store pages: use data-slug, data-price, data-name attributes on Add to Cart buttons.\n';
      await this.sshRun(`cat > ${vesselDir}/vessel/tree/MALKUTH.md << 'MALKEOF'\n${malkuthMd}\nMALKEOF`);
      this.setForgeProgress(11);

      // Write .env file with provider-specific config
      this.addForgeLine('Writing configuration...', '#606080');
      const provider = (this.config.llmProvider || 'ANTHROPIC').toUpperCase();
      const envLines = [
        `LLM_PROVIDER=${provider.toLowerCase()}`,
        `VESSEL_DIR=${vesselDir}/vessel`,
        `STATIC_DIR=${vesselDir}/static`,
        `BUILD_TOKEN=${token}`,
        `HERMES_PORT=${port}`,
        `HERMES_MAX_TOKENS=16384`,
      ];
      if (provider === 'ANTHROPIC') {
        envLines.push(`ANTHROPIC_API_KEY=${apiKey}`);
        envLines.push(`HERMES_MODEL=claude-sonnet-4-6`);
        envLines.push(`HERMES_MODEL_HECATE=claude-haiku-4-5-20251001`);
      } else if (provider === 'OPENAI') {
        envLines.push(`OPENAI_API_KEY=${apiKey}`);
        envLines.push(`HERMES_MODEL=gpt-4.1`);
        envLines.push(`HERMES_MODEL_HECATE=gpt-4.1-mini`);
      } else if (provider === 'OLLAMA') {
        envLines.push(`OLLAMA_HOST=http://localhost:11434`);
        envLines.push(`HERMES_MODEL=qwen2.5-coder:7b`);
        envLines.push(`HERMES_MODEL_HECATE=qwen2.5:1.5b`);
      }
      const envContent = envLines.join('\n');
      await this.sshRun(`cat > ${vesselDir}/.env << 'ENVEOF'\n${envContent}\nENVEOF`);
      this.setForgeProgress(13);

      // Install Ollama + pull models if provider is ollama
      if (provider === 'OLLAMA') {
        this.addForgeLine('Installing Ollama...', '#606080');
        await this.sshRun('which ollama > /dev/null 2>&1 || curl -fsSL https://ollama.com/install.sh | sh');
        this.setForgeProgress(15);
        this.addForgeLine('Pulling AI models (this may take a while)...', '#f0a030');
        await this.sshRun('ollama pull qwen2.5-coder:7b');
        this.setForgeProgress(16);
        await this.sshRun('ollama pull qwen2.5:1.5b');
        this.addForgeLine('Models ready! ✓', '#00ff88');
        this.setForgeProgress(17);
      }

      // Install OpenAI SDK if needed for non-Anthropic providers
      if (provider === 'OPENAI' || provider === 'OLLAMA') {
        await this.sshRun('pip3 install openai -q 2>/dev/null');
      }

      // Copy bridge.py from an existing vessel
      this.addForgeLine('Installing bridge engine...', '#606080');
      const copyResult = await this.sshRun(
        `DONOR=$(find /root/hermes/vessels -maxdepth 2 -name bridge.py -type f 2>/dev/null | head -1); ` +
        `if [ -n "$DONOR" ]; then cp "$DONOR" ${vesselDir}/bridge.py && echo OK; else echo FAIL; fi`
      );
      if ((copyResult.stdout || '').trim() !== 'OK') {
        this.addForgeLine('Could not copy bridge.py!', '#ff4444');
        this.addForgeLine('Check server has existing vessels.', '#ffcc00');
        return;
      }
      this.setForgeProgress(18);

      // Write placeholder index.html
      await this.sshRun(`echo '<html><body style="background:#0a0a1a;color:#f0a030;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh"><h1>FORGING...</h1></body></html>' > ${vesselDir}/static/index.html`);

      // Create nginx config
      this.addForgeLine('Configuring web server...', '#606080');
      const nginxConf = [
        `server {`,
        `    server_name ${domain};`,
        `    server_tokens off;`,
        `    root ${vesselDir}/static;`,
        `    index index.html;`,
        `    add_header X-Content-Type-Options "nosniff" always;`,
        `    add_header Referrer-Policy "strict-origin-when-cross-origin" always;`,
        `    add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;`,
        `    location ~* \\.(json|env|py|log|md|sh|txt)$ { return 404; }`,
        `    location ~ ^/(chat|chat/confirm|chat/clear) {`,
        `        proxy_pass         http://127.0.0.1:${port};`,
        `        proxy_set_header   Host $host;`,
        `        proxy_set_header   X-Real-IP $remote_addr;`,
        `        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;`,
        `        proxy_read_timeout 120s;`,
        `        proxy_hide_header  X-Powered-By;`,
        `    }`,
        `    location /ask {`,
        `        limit_req zone=ask burst=5 nodelay;`,
        `        limit_req_status 429;`,
        `        proxy_pass         http://127.0.0.1:${port};`,
        `        proxy_set_header   Host $host;`,
        `        proxy_set_header   X-Real-IP $remote_addr;`,
        `        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;`,
        `        proxy_read_timeout 30s;`,
        `        proxy_hide_header  X-Powered-By;`,
        `    }`,
        `    location /build {`,
        `        limit_req zone=build burst=2 nodelay;`,
        `        limit_req_status 429;`,
        `        proxy_pass         http://127.0.0.1:${port};`,
        `        proxy_set_header   Host $host;`,
        `        proxy_set_header   X-Real-IP $remote_addr;`,
        `        proxy_read_timeout 120s;`,
        `        proxy_hide_header  X-Powered-By;`,
        `    }`,
        `    location ~ ^/(health|setup|agent|agents|analytics|api|webhook) {`,
        `        proxy_pass         http://127.0.0.1:${port};`,
        `        proxy_set_header   Host $host;`,
        `        proxy_set_header   X-Real-IP $remote_addr;`,
        `        proxy_read_timeout 120s;`,
        `        proxy_hide_header  X-Powered-By;`,
        `    }`,
        `    location / {`,
        `        try_files $uri $uri/index.html =404;`,
        `    }`,
        `    listen 80;`,
        `    listen [::]:80;`,
        `}`,
      ].join('\n');
      await this.sshRun(`cat > /etc/nginx/sites-enabled/${vesselName} << 'NGINXEOF'\n${nginxConf}\nNGINXEOF`);
      await this.sshRun(`nginx -t 2>&1 && nginx -s reload`);
      this.setForgeProgress(25);

      // SSL certificate
      this.addForgeLine('Securing with SSL certificate...', '#606080');
      const certResult = await this.sshRun(
        `certbot --nginx -d ${domain} --non-interactive --agree-tos --email admin@example.com 2>&1 | tail -3`
      );
      if ((certResult.stderr || '').includes('error') && !(certResult.stdout || '').includes('Successfully')) {
        this.addForgeLine('SSL warning — may need manual setup', '#ffcc00');
      } else {
        this.addForgeLine('SSL certificate installed! ✓', '#00ff88');
      }
      this.setForgeProgress(35);

      // Create systemd service
      this.addForgeLine('Starting vessel service...', '#606080');
      const serviceConf = `[Unit]
Description=HERMES vessel — ${vesselName}
After=network.target

[Service]
Type=simple
WorkingDirectory=${vesselDir}
EnvironmentFile=${vesselDir}/.env
ExecStart=/usr/bin/python3 ${vesselDir}/bridge.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target`;
      await this.sshRun(`cat > /etc/systemd/system/hermes-${vesselName}.service << 'SVCEOF'\n${serviceConf}\nSVCEOF`);
      await this.sshRun(`systemctl daemon-reload && systemctl enable hermes-${vesselName} && systemctl start hermes-${vesselName}`);
      this.setForgeProgress(40);

      // Wait for bridge to come up
      this.addForgeLine('Waiting for vessel to come online...', '#606080');
      let online = false;
      for (let i = 0; i < 10; i++) {
        const hc = await this.sshRun(`curl -s http://127.0.0.1:${port}/health 2>/dev/null`);
        if ((hc.stdout || '').includes('ok') || (hc.stdout || '').includes('status')) {
          online = true;
          break;
        }
        await new Promise(r => setTimeout(r, 2000));
      }
      if (online) {
        this.addForgeLine('Vessel online! ✓', '#00ff88');
      } else {
        this.addForgeLine('Vessel slow to start — continuing...', '#ffcc00');
      }
      this.setForgeProgress(45);

    } else {
      // ══ EXISTING VESSEL — just get token if missing ══
      this.addForgeLine('Existing vessel found', '#00ff88');
      this.setForgeProgress(10);

      if (!token) {
        this.addForgeLine('Fetching build token...', '#606080');
        const readResult = await this.sshRun(
          `grep BUILD_TOKEN ${vesselDir}/.env 2>/dev/null | cut -d= -f2`
        );
        token = (readResult.stdout || '').trim();
        if (!token) {
          const genResult = await this.sshRun(
            `TOKEN=$(openssl rand -hex 32) && echo "BUILD_TOKEN=$TOKEN" >> ${vesselDir}/.env && echo $TOKEN`
          );
          token = (genResult.stdout || '').trim();
        }
        if (token) {
          this.config.buildToken = token;
          await window.hermes.configSet('buildToken', token);
          this.addForgeLine('Build token acquired! ✓', '#00ff88');
        }
      }

      // Health check
      try {
        const health = await window.hermes.bridgeFetch(`https://${domain}/health`, { method: 'GET' });
        if (health.ok) {
          this.addForgeLine('Vessel online! ✓', '#00ff88');
        } else {
          this.addForgeLine('Vessel offline — building anyway...', '#ffcc00');
        }
      } catch (e) {
        this.addForgeLine('Could not reach vessel — trying build...', '#ffcc00');
      }
      this.setForgeProgress(20);
    }

    // ── TRIGGER BUILD ──
    this.addForgeLine('Sending build instructions...', '#606080');
    this.setForgeProgress(50);

    const buildPrompt = `Build an 8-bit retro gaming style website for "${name}". ` +
      `Description: ${desc}. ` +
      `Style requirements: Full 8-bit pixel aesthetic with dark background (#0a0a1a), ` +
      `amber (#f0a030) and green (#00ff88) accent colors. Use Google Fonts "Press Start 2P" ` +
      `for all text. Add subtle scanline CSS overlay effect. ` +
      `The site should feel like a retro game interface or arcade cabinet screen. ` +
      `Include: A hero section with the site name in large pixel text, ` +
      `a description section, and navigation styled as game menu items. ` +
      `Make it a single page, fully self-contained with inline CSS. ` +
      `Dark, atmospheric, pixel-perfect.`;

    this.addForgeLine('Building your 8-bit website...', '#f0a030');
    this.setForgeProgress(55);

    try {
      const result = await window.hermes.bridgeFetch(`https://${domain}/build`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Build-Token': token,
        },
        body: { prompt: buildPrompt },
        timeout: 300000,
      });

      if (result.ok) {
        this.addForgeLine('Site built successfully! ✓', '#00ff88');
        this.setForgeProgress(90);
      } else {
        const err = result.data?.error || 'build failed';
        this.addForgeLine(`Build issue: ${err}`, '#ffcc00');
        this.addForgeLine('You can rebuild later from HERMES TOWER.', '#606080');
        this.setForgeProgress(85);
      }
    } catch (e) {
      this.addForgeLine(`Build error: ${e.message}`, '#ff4444');
      this.addForgeLine('You can rebuild later from HERMES TOWER.', '#606080');
      this.setForgeProgress(85);
    }

    // Complete
    this.setForgeProgress(100);
    this.addForgeLine('', '#00ff88');
    this.addForgeLine('═══════════════════════════════', '#f0a030');
    this.addForgeLine('  YOUR VESSEL IS ONLINE!', '#00ff88');
    this.addForgeLine('═══════════════════════════════', '#f0a030');

    // Save vessel config so the hub knows it's online
    try {
      const saved = await window.hermes.configAll();

      if (this.customVessel) {
        // Save custom vessel to customVessels array
        const customList = saved.customVessels || [];
        customList.push({
          key: (this.config.domain || '').split('.')[0] || 'vessel-' + Date.now(),
          name: this.config.siteName || 'Custom Vessel',
          domain: this.config.domain || '',
          preset: this.vesselPreset || null,
          buildToken: this.config.buildToken || '',
          port: this.config.port || null,
          internalOnly: this.config.internalOnly || false,
          createdAt: new Date().toISOString(),
        });
        await window.hermes.configSet('customVessels', customList);

        // Create vault node for this custom vessel
        try {
          const hermesCfg = saved.vessels?.HERMES || {};
          const hermesDomain = hermesCfg.domain;
          const hermesToken = hermesCfg.buildToken || saved.buildToken;
          if (hermesDomain && hermesToken) {
            const vesselName = this.config.siteName || this.config.domain?.split('.')[0] || 'Custom';
            const today = new Date().toISOString().split('T')[0];
            const content = [
              '---',
              `tags: [vessel, custom, ${vesselName.toLowerCase().replace(/\s+/g, '-')}]`,
              'type: vessel',
              `created: ${today}`,
              `domain: ${this.config.domain || 'internal'}`,
              '---',
              '',
              `# ${vesselName}`,
              '',
              `Custom vessel — ${this.config.domain || 'internal service'}.`,
              '',
              '## Status',
              `- Added: ${today}`,
              this.config.domain ? `- Domain: ${this.config.domain}` : '- Internal only',
              '',
              '## Connections',
              '- [[INDEX]]',
              '- [[vessels/HERMES]]',
              '',
              '## Notes',
              '*(conversation summaries will appear here)*',
              '',
            ].join('\n');
            await window.hermes.bridgeFetch(`https://${hermesDomain}/api/vault/write`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Build-Token': hermesToken },
              body: { path: `vessels/${vesselName.replace(/\s+/g, '_')}.md`, content },
            });
          }
        } catch (e) { console.log('Vault node skipped:', e.message); }
      } else {
        // Save main vessel as HERMES in the vessels config object
        const vesselsCfg = saved.vessels || {};
        vesselsCfg['HERMES'] = {
          active: true,
          domain: this.config.domain || '',
          buildToken: this.config.buildToken || '',
        };
        await window.hermes.configSet('vessels', vesselsCfg);

        // Auto-activate 4 default god vessels on closed ports
        this.addForgeLine('', '#606080');
        this.addForgeLine('Setting up your pantheon...', '#f0a030');
        const defaultGods = ['ATHENA', 'APOLLO', 'DEMETER', 'ARES'];
        for (const godName of defaultGods) {
          try {
            this.addForgeLine(`  Activating ${godName}...`, '#a0a0b0');
            const port = await this._createGodVessel(godName, vesselsCfg);
            if (port) {
              this.addForgeLine(`  ${godName} online (port ${port})`, '#00ff88');
            }
          } catch (ge) {
            this.addForgeLine(`  ${godName} failed: ${ge.message}`, '#ff4444');
          }
        }
        await window.hermes.configSet('vessels', vesselsCfg);
        this.addForgeLine('Pantheon ready!', '#00ff88');
      }
    } catch (e) { console.error('Failed to save vessel config:', e); }

    // Show enter button
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const btnLabel = this.customVessel ? '> GO TO FLOOR 2' : '> ENTER THE HUB';
    makeButton(this, W / 2 - 120, H - 100, 240, 36, btnLabel, () => {
      this.scene.start(this.returnScene || 'Hub');
    });
  }

  async _createGodVessel(godName, vesselsCfg) {
    const ip = this.config.vpsIp;
    const keyPath = this.config.sshKeyPath;
    const vesselName = godName.toLowerCase();
    const vesselDir = `/root/hermes/vessels/${vesselName}`;

    const GOD_DESC = {
      ATHENA: 'You are Athena, goddess of wisdom. You are a knowledge assistant — analytical and thorough. Help with research, information, and problem-solving.',
      APOLLO: 'You are Apollo, god of arts and light. You are a creative assistant — imaginative and inspiring. Help with writing, design, and content creation.',
      DEMETER: 'You are Demeter, goddess of the harvest. You are a commerce assistant — practical and growth-focused. Help with shop management and business.',
      ARES: 'You are Ares, god of war. You are a security assistant — direct and vigilant. Help with server security, monitoring, and system administration.',
      ARTEMIS: 'You are Artemis, goddess of the hunt. You are a tracking assistant — focused and precise. Help with goals, habits, and organization.',
      DIONYSUS: 'You are Dionysus, god of celebration. You are an events assistant — energetic and social. Help with events, community, and engagement.',
      HEPHAESTUS: 'You are Hephaestus, god of the forge. You are an engineering assistant — methodical and inventive. Help with tools, code, and deployment.',
      HESTIA: 'You are Hestia, goddess of the hearth. You are a personal assistant — warm and organized. Help with blogging, personal site, and daily life.',
      IRIS: 'You are Iris, messenger of the gods. You are a communication assistant — swift and clear. Help with messages, webhooks, and connecting services.',
      PERSEPHONE: 'You are Persephone, queen of transitions. You are a migration assistant — adaptable and patient. Help with importing, exporting, and converting content.',
      THEMIS: 'You are Themis, goddess of justice. You are a governance assistant — fair and precise. Help with policies, compliance, and ethical considerations.',
    };

    // Check if already exists
    const existsResult = await window.hermes.sshExec(ip, 'root', keyPath,
      `test -f ${vesselDir}/bridge.py && echo EXISTS`
    );
    if ((existsResult.stdout || '').includes('EXISTS')) {
      const envResult = await window.hermes.sshExec(ip, 'root', keyPath,
        `grep -E 'HERMES_PORT|BUILD_TOKEN' ${vesselDir}/.env 2>/dev/null`
      );
      let p = 0, t = '';
      for (const line of (envResult.stdout || '').split('\n')) {
        if (line.startsWith('HERMES_PORT=')) p = parseInt(line.split('=')[1]) || 0;
        if (line.startsWith('BUILD_TOKEN=')) t = line.split('=')[1] || '';
      }
      if (p) {
        vesselsCfg[godName] = { port: p, internalOnly: true, active: true, buildToken: t };
        return p;
      }
    }

    // Find next port
    const portResult = await window.hermes.sshExec(ip, 'root', keyPath,
      `grep -rh HERMES_PORT /root/hermes/vessels/*/.env 2>/dev/null | sed 's/HERMES_PORT=//' | sort -n | tail -1`
    );
    const lastPort = parseInt((portResult.stdout || '').trim()) || 8013;
    const port = lastPort + 1;

    const tokenResult = await window.hermes.sshExec(ip, 'root', keyPath, `openssl rand -hex 32`);
    const token = (tokenResult.stdout || '').trim();

    const apiKeyVar = this.config.llmProvider === 'OPENAI' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY';
    const personality = GOD_DESC[godName] || 'You are an AI assistant.';

    const cmds = [
      `mkdir -p ${vesselDir}/vessel/tree ${vesselDir}/static`,
      `DONOR=$(find /root/hermes/vessels -maxdepth 2 -name bridge.py -type f 2>/dev/null | head -1) && cp "$DONOR" ${vesselDir}/bridge.py`,
      `cat > ${vesselDir}/VESSEL.md << 'VESSELEOF'\n# ${godName}\n\n${personality}\n\nYou are an AI vessel in The Grand Internet Hotel. Be helpful and stay in character.\nVESSELEOF`,
      `cat > ${vesselDir}/vessel/tree/MALKUTH.md << 'TREEEOF'\nRespond helpfully as ${godName}. Be conversational and stay in character.\nTREEEOF`,
      `cat > ${vesselDir}/.env << ENVEOF\nLLM_PROVIDER=${this.config.llmProvider || 'ANTHROPIC'}\n${apiKeyVar}=${this.config.apiKey}\nVESSEL_DIR=${vesselDir}/vessel\nSTATIC_DIR=${vesselDir}/static\nBUILD_TOKEN=${token}\nHERMES_PORT=${port}\nHERMES_MAX_TOKENS=4096\nHERMES_MODEL=${this.config.llmProvider === 'OPENAI' ? 'gpt-4o' : 'claude-sonnet-4-20250514'}\nENVEOF`,
    ].join(' && ');

    await window.hermes.sshExec(ip, 'root', keyPath, cmds);

    // Create and start systemd service
    const svcCmds = [
      `printf '[Unit]\\nDescription=HERMES vessel — ${vesselName}\\nAfter=network.target\\n\\n[Service]\\nType=simple\\nWorkingDirectory=${vesselDir}\\nEnvironmentFile=${vesselDir}/.env\\nExecStart=/usr/bin/python3 ${vesselDir}/bridge.py\\nRestart=always\\nRestartSec=5\\n\\n[Install]\\nWantedBy=multi-user.target\\n' > /etc/systemd/system/hermes-${vesselName}.service`,
      `systemctl daemon-reload`,
      `systemctl enable hermes-${vesselName}`,
      `systemctl start hermes-${vesselName}`,
    ].join(' && ');

    await window.hermes.sshExec(ip, 'root', keyPath, svcCmds);

    // Brief wait for startup
    await new Promise(r => setTimeout(r, 3000));

    vesselsCfg[godName] = { port, internalOnly: true, active: true, buildToken: token };
    return port;
  }
}

/* ══════════════════════════════════════════════
   HUB SCENE — Walkable game hub with buildings + terminal
   ══════════════════════════════════════════════ */
class HubScene extends Phaser.Scene {
  constructor() { super('Hub'); }

  create() {
    // Load config then build scene — config load is async but scene build is sync
    window.hermes.configAll().then(cfg => {
      this.config = cfg || {};
      this._buildScene();
    }).catch(e => {
      console.error('HubScene config load error:', e);
      this.config = {};
      this._buildScene();
    });
  }

  _buildScene() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    this.cameras.main.setBackgroundColor(COLORS.bg);

    // Generate sprites
    if (typeof generateSprites === 'function') {
      generateSprites(this);
    }

    // ── Movement constants ──
    this.SPEED = 120;               // pixels per second
    this.INTERACT_RADIUS = 60;      // pixels to trigger "PRESS E"
    this.PLAY_AREA = { top: 50, bottom: H - 60, left: Math.floor(W * 0.12), right: Math.floor(W * 0.88) };
    this.nearestBuilding = null;     // currently closest building
    this.roomChoiceOpen = false;
    this.roomChoiceElements = [];

    // ── Hotel Hallway Background ──
    const hallway = this.add.graphics();
    const wallL = Math.floor(W * 0.25);
    const wallR = Math.floor(W * 0.75);
    const carpetW = wallR - wallL;
    // Left wall strip — khaki sandstone
    hallway.fillStyle(0xc2a366, 1.0);
    hallway.fillRect(0, 0, wallL, H);
    // Right wall strip — khaki sandstone
    hallway.fillStyle(0xc2a366, 1.0);
    hallway.fillRect(wallR, 0, W - wallR, H);
    // Center carpet strip — deep burgundy/red
    hallway.fillStyle(0x6b1a1a, 1.0);
    hallway.fillRect(wallL, 0, carpetW, H);
    // Inner gold trim lines (double border)
    hallway.lineStyle(2, 0xd4a030, 0.9);
    hallway.lineBetween(wallL, 0, wallL, H);
    hallway.lineBetween(wallR, 0, wallR, H);
    hallway.lineStyle(1, 0xffd700, 0.4);
    hallway.lineBetween(wallL + 6, 30, wallL + 6, H);
    hallway.lineBetween(wallR - 6, 30, wallR - 6, H);
    // Carpet center runner — slightly lighter strip
    const runnerL = Math.floor(W * 0.38);
    const runnerR = Math.floor(W * 0.62);
    hallway.fillStyle(0x7a2020, 0.6);
    hallway.fillRect(runnerL, 30, runnerR - runnerL, H - 30);
    hallway.lineStyle(1, 0xd4a030, 0.3);
    hallway.lineBetween(runnerL, 30, runnerL, H);
    hallway.lineBetween(runnerR, 30, runnerR, H);
    // Gold diamond pattern on runner
    hallway.lineStyle(1, 0xd4a030, 0.12);
    for (let dy = 40; dy < H; dy += 50) {
      hallway.lineBetween(runnerL, dy, W / 2, dy + 25);
      hallway.lineBetween(W / 2, dy + 25, runnerR, dy);
      hallway.lineBetween(runnerL, dy + 50, W / 2, dy + 25);
      hallway.lineBetween(W / 2, dy + 25, runnerR, dy + 50);
    }
    // Hotel name on carpet — subtle gold text near top
    this.add.text(W / 2, 55, '♦ GRAND INTERNET HOTEL ♦', {
      ...FONT, fontSize: '8px', color: '#d4a030',
    }).setOrigin(0.5).setAlpha(0.25);
    // Wainscoting — darker horizontal line across each wall
    hallway.lineStyle(2, 0x8a7040, 1.0);
    hallway.lineBetween(0, Math.floor(H * 0.5), wallL, Math.floor(H * 0.5));
    hallway.lineBetween(wallR, Math.floor(H * 0.5), W, Math.floor(H * 0.5));
    // Wallpaper accents — subtle horizontal lines every 40px on walls
    hallway.lineStyle(1, 0xb89f6a, 0.3);
    for (let wy = 0; wy < H; wy += 40) {
      hallway.lineBetween(0, wy, wallL, wy);
      hallway.lineBetween(wallR, wy, W, wy);
    }

    // ── Top status bar ──
    drawPixelBox(this, 0, 0, W, 28, COLORS.border, 0x06060f);
    this.statusBar = this.add.graphics();
    this.statusBar.setDepth(30);

    this.add.text(10, 7, '♦ GRAND INTERNET HOTEL ♦ FLOOR 1', { ...FONT, fontSize: '10px', color: '#f0a030' }).setDepth(30);

    // Status indicator
    this.statusDot = this.add.rectangle(W - 30, 14, 8, 8, COLORS.dim).setDepth(30);
    this.statusLabel = this.add.text(W - 100, 7, 'CHECKING...', { ...FONT, fontSize: '12px', color: '#606080' }).setDepth(30);

    // Settings button
    const settingsBtn = this.add.text(W - 160, 7, '[SETUP]', {
      ...FONT, fontSize: '12px', color: '#404060',
    }).setInteractive({ useHandCursor: true }).setDepth(30);
    settingsBtn.on('pointerover', () => settingsBtn.setColor('#f0a030'));
    settingsBtn.on('pointerout',  () => settingsBtn.setColor('#404060'));
    settingsBtn.on('pointerdown', () => this.scene.start('Wizard'));

    // ── Doors — along left and right walls of hotel hallway ──
    this.buildings = [];
    const vessels = this.config.vessels || {};
    // Only HERMES is active by default — others need explicit activation
    const buildingDefs = ALL_VESSELS.map(v => ({
      key: v.key.toLowerCase(),
      label: v.key,
      desc: v.desc,
      active: v.key === 'HERMES' ? true : !!(vessels[v.key]?.active),
      accent: BUILDING_DATA[v.key]?.accent || 0xa0a0b0,
    }));

    const DOOR_LEFT_X = Math.floor(W * 0.18);
    const DOOR_RIGHT_X = Math.floor(W * 0.82);
    const FIRST_DOOR_Y = 110;
    const DOOR_SPACING = 58;

    for (let i = 0; i < buildingDefs.length; i++) {
      const def = buildingDefs[i];
      const bx = (i % 2 === 0) ? DOOR_LEFT_X : DOOR_RIGHT_X;
      const by = FIRST_DOOR_Y + Math.floor(i / 2) * DOOR_SPACING;

      let sprite;
      const doorKey = 'door-' + def.key.toLowerCase();
      if (this.textures.exists(doorKey)) {
        sprite = this.add.image(bx, by, doorKey).setScale(1.2);
      } else if (this.textures.exists('door-default')) {
        sprite = this.add.image(bx, by, 'door-default').setScale(1.2);
      } else {
        sprite = this.add.rectangle(bx, by, 40, 48, def.accent, def.active ? 0.5 : 0.15);
      }

      // Ghost inactive doors
      if (!def.active) {
        sprite.setAlpha(0.3);
      }
      sprite.setInteractive({ useHandCursor: true });

      // Room number above door
      const roomNum = 101 + i;
      this.add.text(bx, by - 32, '' + roomNum, {
        ...FONT, fontSize: '7px', color: def.active ? '#d4bb7e' : '#444',
      }).setOrigin(0.5);

      // Label
      const labelColor = def.active ? '#a0a0b0' : '#404050';
      const label = this.add.text(bx, by + 40, def.label, {
        ...FONT, fontSize: '10px', color: labelColor,
      }).setOrigin(0.5);

      // Hover tooltip
      const tooltipText = def.active ? def.desc : 'Not active yet';
      const tooltip = this.add.text(bx, by - 40, tooltipText, {
        ...FONT, fontSize: '10px', color: def.active ? '#ffcc00' : '#606080',
        backgroundColor: '#0a0a1a',
        padding: { x: 4, y: 3 },
      }).setOrigin(0.5).setVisible(false);

      // "PRESS E" prompt
      const ePrompt = this.add.text(bx, by + 56, '[ E ]', {
        ...FONT, fontSize: '10px', color: '#f0a030',
      }).setOrigin(0.5).setVisible(false);
      this.tweens.add({
        targets: ePrompt, alpha: 0.3, duration: 500,
        yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [1],
      });

      sprite.on('pointerover', () => {
        sprite.setTint(0xffffff);
        label.setColor('#f0a030');
        tooltip.setVisible(true);
      });
      sprite.on('pointerout', () => {
        sprite.clearTint();
        label.setColor(labelColor);
        if (this.nearestBuilding !== def) tooltip.setVisible(false);
      });
      sprite.on('pointerdown', () => {
        if (def.active) {
          this.visitBuilding(def.label);
        } else {
          this.appendOutput(`${def.label} is not active. Type NEW VESSEL to set it up.`, '#606080');
        }
      });

      this.buildings.push({ sprite, label, tooltip, ePrompt, def, x: bx, y: by, active: def.active });
    }

    // ── Wall Sconces — between door pairs on both walls ──
    for (let s = 0; s < 6; s++) {
      const sy = FIRST_DOOR_Y + s * DOOR_SPACING + DOOR_SPACING / 2;
      if (this.textures.exists('wall-sconce')) {
        this.add.image(DOOR_LEFT_X - 30, sy, 'wall-sconce').setScale(2).setAlpha(0.7);
        this.add.image(DOOR_RIGHT_X + 30, sy, 'wall-sconce').setScale(2).setAlpha(0.7);
      }
    }

    // ── Doorman NPC — top center-left of carpet ──
    var doormanX = Math.floor(W / 2) - 50;
    var doormanY = 68;
    var doormanSprite = this.add.image(doormanX, doormanY, 'doorman').setScale(1.4);
    var doormanLabel = this.add.text(doormanX, doormanY + 42, 'CONCIERGE', {
      fontFamily: FONT.fontFamily, fontSize: '8px', color: '#d4bb7e',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5);
    var doormanTooltip = this.add.text(doormanX, doormanY - 38, 'Hotel information & tips', {
      fontFamily: FONT.fontFamily, fontSize: '8px', color: '#ffcc00',
      backgroundColor: '#0a0a1a', padding: { x: 4, y: 3 },
    }).setOrigin(0.5).setVisible(false);
    var doormanE = this.add.text(doormanX, doormanY + 56, '[ E ]', {
      fontFamily: FONT.fontFamily, fontSize: '10px', color: '#f0a030',
    }).setOrigin(0.5).setVisible(false);
    this.tweens.add({ targets: doormanE, alpha: 0.3, duration: 500, yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [1] });
    this.buildings.push({
      sprite: doormanSprite, label: doormanLabel, tooltip: doormanTooltip,
      ePrompt: doormanE, def: { label: 'DOORMAN', active: true }, x: doormanX, y: doormanY, active: true, type: 'doorman'
    });

    // ── Elevator — top center-right of carpet (symmetrical with doorman) ──
    var elevatorX = Math.floor(W / 2) + 50;
    var elevatorY = 68;
    var elevatorSprite = this.add.image(elevatorX, elevatorY, 'elevator').setScale(1.4);
    var elevatorLabel = this.add.text(elevatorX, elevatorY + 42, 'ELEVATOR ▲', {
      fontFamily: FONT.fontFamily, fontSize: '8px', color: '#d4bb7e',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5);
    var elevatorTooltip = this.add.text(elevatorX, elevatorY - 38, 'Go to Floor 2', {
      fontFamily: FONT.fontFamily, fontSize: '8px', color: '#ffcc00',
      backgroundColor: '#0a0a1a', padding: { x: 4, y: 3 },
    }).setOrigin(0.5).setVisible(false);
    var elevatorE = this.add.text(elevatorX, elevatorY + 56, '[ E ]', {
      fontFamily: FONT.fontFamily, fontSize: '10px', color: '#f0a030',
    }).setOrigin(0.5).setVisible(false);
    this.tweens.add({ targets: elevatorE, alpha: 0.3, duration: 500, yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [1] });
    this.buildings.push({
      sprite: elevatorSprite, label: elevatorLabel, tooltip: elevatorTooltip,
      ePrompt: elevatorE, def: { label: 'ELEVATOR', active: true }, x: elevatorX, y: elevatorY, active: true, type: 'elevator'
    });

    // ── Decorative NPCs with random dialogue ──
    const NPC_DEFS = [
      {
        key: 'hotel-cat', x: Math.floor(W * 0.30), y: Math.floor(H * 0.45), scale: 1.0,
        label: 'LOBBY CAT',
        lines: ['*purrs contentedly*', '*stretches lazily*', 'Meow.', '*bats at a gold thread*'],
      },
      {
        key: 'luggage-cart', x: Math.floor(W * 0.70), y: Math.floor(H * 0.75), scale: 1.0,
        label: '',
        lines: ['*wheels creak softly*', '*luggage shifts*', '*brass handle gleams*'],
      },
      {
        key: 'potted-palm', x: Math.floor(W * 0.28), y: Math.floor(H * 0.82), scale: 1.2,
        label: '',
        lines: ['*leaves rustle gently*', '*tropical vibes*', '*a leaf falls*'],
      },
      {
        key: 'grand-clock', x: Math.floor(W * 0.72), y: Math.floor(H * 0.35), scale: 1.2,
        label: '',
        lines: ['*tick... tock...*', '*chimes softly*', '*pendulum swings*', '*the hour strikes*'],
      },
    ];
    this.npcBubbles = [];
    for (const npc of NPC_DEFS) {
      if (this.textures.exists(npc.key)) {
        const sp = this.add.image(npc.x, npc.y, npc.key).setScale(npc.scale);
        if (npc.label) {
          this.add.text(npc.x, npc.y + 30, npc.label, {
            ...FONT, fontSize: '6px', color: '#605040',
          }).setOrigin(0.5);
        }
        // Speech bubble — appears periodically
        const bubble = this.add.text(npc.x, npc.y - 30, '', {
          ...FONT, fontSize: '7px', color: '#d4bb7e',
          backgroundColor: '#0a0a1a', padding: { x: 3, y: 2 },
        }).setOrigin(0.5).setAlpha(0).setDepth(8);
        this.npcBubbles.push({ bubble, lines: npc.lines });
      }
    }
    // Random NPC dialogue timer
    this.time.addEvent({
      delay: 6000, loop: true,
      callback: () => {
        if (this.npcBubbles.length === 0) return;
        const pick = this.npcBubbles[Math.floor(Math.random() * this.npcBubbles.length)];
        const line = pick.lines[Math.floor(Math.random() * pick.lines.length)];
        pick.bubble.setText(line).setAlpha(1);
        this.time.delayedCall(3000, () => { pick.bubble.setAlpha(0); });
      },
    });

    // ── Player sprite ──
    const playerStartX = W / 2;
    const playerStartY = Math.floor(H * 0.6);
    if (this.textures.exists('player')) {
      this.player = this.add.image(playerStartX, playerStartY, 'player').setScale(2);
    } else {
      this.player = this.add.rectangle(playerStartX, playerStartY, 16, 16, COLORS.green);
    }
    this.player.setDepth(5);

    // Player shadow
    this.playerShadow = this.add.ellipse(playerStartX, playerStartY + 10, 20, 6, 0x000000, 0.3).setDepth(4);

    // Player direction indicator (small arrow above head)
    this.playerArrow = this.add.text(playerStartX, playerStartY - 20, '', {
      ...FONT, fontSize: '12px', color: '#00ff88',
    }).setOrigin(0.5).setDepth(6).setAlpha(0.6);

    // Walk bob state
    this.walkBob = 0;
    this.isMoving = false;

    // ── Input: Cursor keys + WASD ──
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      E: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    };

    // ── Terminal toggle button (always visible at bottom) ──
    this.terminalOpen = false;
    this.terminalBaseY = H;

    this.termToggleBg = drawPixelBox(this, W / 2 - 100, H - 32, 200, 28, COLORS.amber, 0x06060f);
    this.termToggleBg.setDepth(20);
    this.termToggleText = this.add.text(W / 2, H - 18, '> OPEN TERMINAL', {
      ...FONT, fontSize: '12px', color: '#f0a030',
    }).setOrigin(0.5).setDepth(20);

    const termToggleZone = this.add.zone(W / 2, H - 18, 200, 28)
      .setInteractive({ useHandCursor: true }).setDepth(20);
    termToggleZone.on('pointerdown', () => {
      this.toggleTerminal();
      this.termToggleText.setText(this.terminalOpen ? '> CLOSE TERMINAL' : '> OPEN TERMINAL');
    });

    // ── Terminal panel (starts offscreen below) ──
    this.termElements = [];
    const TY = H;

    const tp = drawPixelBox(this, 0, TY, W, 200, COLORS.amber, 0x06060f);
    tp.setDepth(10);
    this.termElements.push(tp);

    const th = this.add.text(10, TY + 6, '> TERMINAL  (type a message to your vessel)', {
      ...FONT, fontSize: '12px', color: '#f0a030',
    }).setDepth(11);
    this.termElements.push(th);

    // Scrollable terminal output using container + mask (like building chat)
    this.termContainer = this.add.container(0, 0).setDepth(11);
    // Use make.graphics (not add.graphics) so mask shape isn't rendered on screen
    this.termMaskGfx = this.make.graphics();
    this.termMaskGfx.fillStyle(0xffffff);
    this.termMaskGfx.fillRect(10, TY + 22, W - 20, 138);
    this.termContainer.setMask(this.termMaskGfx.createGeometryMask());
    this.termLines = [];
    this.termNextY = TY + 26;
    this.termPanelY = TY + 22;
    this.termPanelH = 138;
    this.termScrollOffset = 0;
    this.termElements.push(this.termContainer);
    // Add welcome line
    this.appendOutput('Type HELP for commands.', '#606080');

    const tib = drawPixelBox(this, 10, TY + 165, W - 80, 28, COLORS.amber, 0x0a0a1a);
    tib.setDepth(11);
    this.termElements.push(tib);

    this.termInputText = this.add.text(18, TY + 172, '> ', {
      ...FONT, fontSize: '12px', color: '#00ff88',
    }).setDepth(11);
    this.termElements.push(this.termInputText);

    const sendBox = drawPixelBox(this, W - 65, TY + 165, 55, 28, COLORS.green, 0x141430);
    sendBox.setDepth(11);
    this.termElements.push(sendBox);

    const sendText = this.add.text(W - 37, TY + 179, 'SEND', {
      ...FONT, fontSize: '12px', color: '#00ff88',
    }).setOrigin(0.5).setDepth(11);
    this.termElements.push(sendText);

    const sendZone = this.add.zone(W - 37, TY + 179, 55, 28)
      .setInteractive({ useHandCursor: true }).setDepth(12);
    sendZone.on('pointerdown', () => {
      if (this.termBuffer.length > 0) {
        this.sendCommand(this.termBuffer);
        this.termBuffer = '';
        this.termInputText.setText('> ');
      }
    });
    this.termElements.push(sendZone);

    this.termBuffer = '';

    // ── Keyboard (for terminal typing) ──
    this.input.keyboard.on('keydown', (e) => this.handleKey(e));

    // ── Mouse wheel scroll for terminal ──
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (!this.terminalOpen) return;
      this.scrollTerminal(deltaY > 0 ? 30 : -30);
    });

    // Clean up keyboard on scene shutdown
    this.events.once('shutdown', () => {
      this.input.keyboard.removeAllListeners('keydown');
      this.input.removeAllListeners('wheel');
    });

    // ── Help hint ──
    this.helpHint = this.add.text(W / 2, H - 50, 'WASD / ARROWS TO MOVE  |  E TO INTERACT  |  TAB FOR TERMINAL', {
      ...FONT, fontSize: '12px', color: '#404060',
    }).setOrigin(0.5);

    // ── HUD buttons (top-right, inside status bar) ──
    this.hudOverlay = null;
    const hudBtns = [
      { label: '?',  key: 'help',         tip: 'HELP' },
      { label: 'M',  key: 'missions',     tip: 'MISSIONS' },
      { label: '*',  key: 'achievements', tip: 'ACHIEVEMENTS' },
      { label: 'i',  key: 'info',         tip: 'INFO' },
    ];
    const hudBtnSize = 20;
    const hudBtnGap = 4;
    const hudStartX = W - 230;
    hudBtns.forEach((btn, i) => {
      const bx = hudStartX - i * (hudBtnSize + hudBtnGap);
      const bg = this.add.graphics().setDepth(31);
      bg.fillStyle(0x141430, 1);
      bg.fillRect(bx, 4, hudBtnSize, hudBtnSize);
      bg.lineStyle(1, COLORS.amber, 0.4);
      bg.strokeRect(bx, 4, hudBtnSize, hudBtnSize);

      const txt = this.add.text(bx + hudBtnSize / 2, 4 + hudBtnSize / 2, btn.label, {
        ...FONT, fontSize: '10px', color: '#606080',
      }).setOrigin(0.5).setDepth(31);

      const zone = this.add.zone(bx + hudBtnSize / 2, 4 + hudBtnSize / 2, hudBtnSize, hudBtnSize)
        .setInteractive({ useHandCursor: true }).setDepth(32);
      zone.on('pointerover', () => { txt.setColor('#f0a030'); });
      zone.on('pointerout',  () => { txt.setColor('#606080'); });
      zone.on('pointerdown', () => { this.showHudOverlay(btn.key); });
    });

    // Check vessel health
    this.checkHealth();
  }

  // ── UPDATE LOOP — runs every frame ──
  update(time, delta) {
    if (!this.player) return;

    const dt = delta / 1000; // seconds
    let dx = 0, dy = 0;

    // Don't move player when terminal is open (keys go to terminal input)
    if (!this.terminalOpen) {
      // WASD + Arrow keys
      if (this.cursors.left.isDown  || this.wasd.A.isDown) dx = -1;
      if (this.cursors.right.isDown || this.wasd.D.isDown) dx = 1;
      if (this.cursors.up.isDown    || this.wasd.W.isDown) dy = -1;
      if (this.cursors.down.isDown  || this.wasd.S.isDown) dy = 1;

      // Normalize diagonal movement
      if (dx !== 0 && dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;
      }
    }

    // Apply movement
    this.isMoving = (dx !== 0 || dy !== 0);
    if (this.isMoving) {
      const newX = this.player.x + dx * this.SPEED * dt;
      const newY = this.player.y + dy * this.SPEED * dt;

      // Clamp to play area
      this.player.x = Phaser.Math.Clamp(newX, this.PLAY_AREA.left, this.PLAY_AREA.right);
      this.player.y = Phaser.Math.Clamp(newY, this.PLAY_AREA.top, this.PLAY_AREA.bottom);

      // Track steps for milestones
      this.stepAccum = (this.stepAccum || 0) + Math.abs(dx * dt) + Math.abs(dy * dt);
      if (this.stepAccum >= 1) {
        this.stepAccum -= 1;
        this.stepCount = (this.stepCount || 0) + 1;
        // Save every 10 steps to avoid constant writes
        if (this.stepCount % 10 === 0) {
          const stats = this.config?.stats || { steps: 0, chats: 0, builds: 0, uploads: 0 };
          stats.steps = (stats.steps || 0) + 10;
          window.hermes.configSet('stats', stats);
        }
      }

      // Direction arrow
      if (dy < 0) this.playerArrow.setText('^');
      else if (dy > 0) this.playerArrow.setText('v');
      else if (dx < 0) this.playerArrow.setText('<');
      else if (dx > 0) this.playerArrow.setText('>');
    }

    // Walk bob animation (bounce the player slightly)
    if (this.isMoving) {
      this.walkBob += dt * 12;
      const bob = Math.sin(this.walkBob) * 2;
      this.player.setScale(this.textures.exists('player') ? 2 : 1);
      // Apply vertical bob via small offset
      this.playerShadow.setPosition(this.player.x, this.player.y + 10);
      this.playerArrow.setPosition(this.player.x, this.player.y - 20);
      // Scale shadow based on bob (simulates height)
      this.playerShadow.setScale(1 - Math.abs(bob) * 0.05, 1);
      // Tilt player sprite slightly based on movement
      if (this.player.setAngle) {
        this.player.setAngle(Math.sin(this.walkBob) * 3);
      }
    } else {
      // Reset when standing still
      if (this.player.setAngle) this.player.setAngle(0);
      this.playerShadow.setPosition(this.player.x, this.player.y + 10);
      this.playerArrow.setPosition(this.player.x, this.player.y - 20);
      this.playerArrow.setText('');
      this.walkBob = 0;
    }

    // ── Proximity detection ──
    let closestDist = Infinity;
    let closest = null;

    for (const b of this.buildings) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);

      if (dist < this.INTERACT_RADIUS && dist < closestDist) {
        closestDist = dist;
        closest = b;
      }
    }

    // Update proximity UI
    if (closest !== this.nearestBuilding) {
      // Clear old
      if (this.nearestBuilding) {
        this.nearestBuilding.ePrompt.setVisible(false);
        this.nearestBuilding.tooltip.setVisible(false);
        this.nearestBuilding.sprite.clearTint();
        this.nearestBuilding.label.setColor(this.nearestBuilding.active ? '#a0a0b0' : '#404050');
      }
      // Show new
      if (closest) {
        closest.ePrompt.setVisible(true);
        closest.tooltip.setVisible(true);
        closest.sprite.setTint(0xffffff);
        closest.label.setColor('#f0a030');
      }
      this.nearestBuilding = closest;
    }

    // ── E key to interact ──
    if (Phaser.Input.Keyboard.JustDown(this.wasd.E) && this.nearestBuilding && !this.terminalOpen && !this.roomChoiceOpen) {
      if (this.nearestBuilding.type === 'doorman') {
        this.showHudOverlay('doorman');
      } else if (this.nearestBuilding.type === 'elevator') {
        this.scene.start('Floor2');
      } else if (this.nearestBuilding.active) {
        this.visitBuilding(this.nearestBuilding.def.label);
      } else {
        this.showRoomChoice('Hub');
      }
    }

  }

  handleKey(e) {
    // ESC to close room choice popup
    if (e.key === 'Escape' && this.roomChoiceOpen) {
      this.closeRoomChoice();
      return;
    }

    // ESC to close HUD overlay if open
    if (e.key === 'Escape' && this.hudOverlay) {
      this.closeHudOverlay();
      return;
    }

    // TAB to toggle terminal
    if (e.key === 'Tab') {
      e.preventDefault();
      this.toggleTerminal();
      this.termToggleText.setText(this.terminalOpen ? '> CLOSE TERMINAL' : '> OPEN TERMINAL');
      return;
    }

    // If terminal is closed, movement keys are handled in update(), don't process here
    if (!this.terminalOpen) return;

    // PageUp / PageDown to scroll terminal
    if (e.key === 'PageUp') { this.scrollTerminal(-80); return; }
    if (e.key === 'PageDown') { this.scrollTerminal(80); return; }

    // Paste support
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      navigator.clipboard.readText().then(text => {
        if (text) {
          this.termBuffer += text.trim();
          this.termInputText.setText('> ' + this.termBuffer);
        }
      }).catch(() => {});
      return;
    }

    // ESC to close terminal
    if (e.key === 'Escape') {
      this.toggleTerminal();
      this.termToggleText.setText('> OPEN TERMINAL');
      return;
    }

    if (e.key === 'Enter' && this.termBuffer.length > 0) {
      this.sendCommand(this.termBuffer);
      this.termBuffer = '';
      this.termInputText.setText('> ');
    } else if (e.key === 'Backspace') {
      this.termBuffer = this.termBuffer.slice(0, -1);
      this.termInputText.setText('> ' + this.termBuffer);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && this.termBuffer.length < 200) {
      this.termBuffer += e.key;
      this.termInputText.setText('> ' + this.termBuffer);
    }
  }

  toggleTerminal() {
    const H = this.cameras.main.height;
    const W = this.cameras.main.width;
    this.terminalOpen = !this.terminalOpen;

    const offset = this.terminalOpen ? -200 : 0;

    this.termElements.forEach(obj => {
      this.tweens.killTweensOf(obj);
      if (obj._origY === undefined) obj._origY = obj.y;

      // For the container, account for current scroll offset
      let targetY = obj._origY + offset;
      if (obj === this.termContainer) {
        targetY -= (this.termScrollOffset || 0);
      }

      this.tweens.add({
        targets: obj,
        y: targetY,
        duration: 200,
        ease: 'Stepped',
        easeParams: [4],
      });
    });

    // Redraw mask at new position (make.graphics isn't in the display list / termElements)
    const TY = H;
    this.termMaskGfx.clear();
    this.termMaskGfx.fillStyle(0xffffff);
    this.termMaskGfx.fillRect(10, TY + 22 + offset, W - 20, 138);

    // Shrink play area when terminal is open
    if (this.terminalOpen) {
      this.PLAY_AREA.bottom = H - 260;
      // Push player up if they're below the new boundary
      if (this.player.y > this.PLAY_AREA.bottom) {
        this.player.y = this.PLAY_AREA.bottom;
      }
    } else {
      this.PLAY_AREA.bottom = H - 60;
    }
  }

  processHubCommand(msg) {
    const cmd = msg.trim().toUpperCase();
    switch (cmd) {
      case 'HELP':
        this.appendOutput('═══ HUB COMMANDS ═══', '#f0a030');
        this.appendOutput('  HELP       — show this list', '#a0a0b0');
        this.appendOutput('  VESSELS    — list all vessels & status', '#a0a0b0');
        this.appendOutput('  MISSIONS   — view tasks & milestones', '#a0a0b0');
        this.appendOutput('  STATUS     — check all vessel health', '#a0a0b0');
        this.appendOutput('  NEW VESSEL — create a new vessel', '#a0a0b0');
        this.appendOutput('  UPDATE     — download & install latest version', '#a0a0b0');
        this.appendOutput('  VAULT      — browse the knowledge vault', '#a0a0b0');
        this.appendOutput('  OBSIDIAN   — sync vault & open in Obsidian', '#a0a0b0');
        this.appendOutput('  SETTINGS   — open settings', '#a0a0b0');
        this.appendOutput('  RESET      — factory reset (fresh start)', '#a0a0b0');
        this.appendOutput('Enter a building to manage that vessel.', '#606080');
        return true;
      case 'VESSELS': {
        this.appendOutput('═══ VESSELS ═══', '#f0a030');
        const vessels = this.config?.vessels || {};
        const allDefs = ALL_VESSELS;
        for (const v of allDefs) {
          const vc = vessels[v.key] || {};
          const status = vc.active ? '[ONLINE]' : '[--]';
          const color = vc.active ? '#00ff88' : '#606080';
          this.appendOutput(`  ${status} ${v.label} — ${v.desc}`, color);
        }
        return true;
      }
      case 'MISSIONS':
        this.showMissions();
        return true;
      case 'STATUS':
        this.appendOutput('Checking all vessels...', '#ffcc00');
        this.checkAllVesselHealth();
        return true;
      case 'NEW VESSEL':
        this.appendOutput('Starting vessel creation wizard...', '#f0a030');
        var _scene = this;
        setTimeout(function() { _scene.scene.start('Wizard', { customVessel: true, returnScene: 'Floor2' }); }, 500);
        return true;
      case 'NEW STORE':
        this.appendOutput('Setting up a new Demeter commerce vessel...', '#f0a030');
        var _scene2 = this;
        setTimeout(function() { _scene2.scene.start('Wizard', { customVessel: true, returnScene: 'Floor2', preset: 'DEMETER' }); }, 500);
        return true;
      case 'UPDATE': {
        this.appendOutput('═══ UPDATE ═══', '#f0a030');
        this.appendOutput('Downloading latest version...', '#ffcc00');
        const updateUrl = 'https://thegrandinternethotel.com/uploads/GrandInternetHotel-1.0.0-Setup.exe';
        window.hermes.selfUpdate(updateUrl).then(r => {
          if (r.ok) {
            this.appendOutput('Download complete! Launching installer...', '#00ff88');
            this.appendOutput('The app will close. Reinstall to update.', '#a0a0b0');
          } else {
            this.appendOutput(`Update failed: ${r.error}`, '#ff4444');
          }
        });
        return true;
      }
      case 'VAULT': {
        this.appendOutput('═══ KNOWLEDGE VAULT ═══', '#f0a030');
        this.appendOutput('Loading vault...', '#606080');
        const hermesCfg = this.config?.vessels?.HERMES || {};
        const hDomain = hermesCfg.domain;
        const hToken = hermesCfg.buildToken || this.config?.buildToken;
        if (!hDomain) { this.appendOutput('No HERMES domain configured.', '#ff4444'); return true; }
        window.hermes.bridgeFetch(`https://${hDomain}/api/vault/list`, {
          method: 'GET', headers: { 'X-Build-Token': hToken || '' },
        }).then(r => {
          if (!r.ok || !r.data?.notes?.length) {
            this.appendOutput('Vault is empty or unavailable.', '#a0a0b0');
            return;
          }
          const notes = r.data.notes;
          const folders = {};
          for (const n of notes) {
            const parts = n.path.split('/');
            const folder = parts.length > 1 ? parts[0] : '(root)';
            if (!folders[folder]) folders[folder] = [];
            folders[folder].push(n);
          }
          this.appendOutput(`  ${notes.length} notes in vault`, '#a0a0b0');
          for (const [folder, items] of Object.entries(folders)) {
            this.appendOutput(`  ◈ ${folder}/`, '#f0a030');
            for (const n of items) {
              const name = n.path.split('/').pop().replace('.md', '');
              const links = n.links?.length ? ` [${n.links.length} links]` : '';
              this.appendOutput(`    ${name}${links}`, '#c0c0d0');
            }
          }
          this.appendOutput('Type OBSIDIAN to open in Obsidian app.', '#606080');
        }).catch(e => this.appendOutput(`Error: ${e.message}`, '#ff4444'));
        return true;
      }
      case 'OBSIDIAN': {
        // Sync vault to local via SSH and open folder
        this.appendOutput('═══ OBSIDIAN ═══', '#f0a030');
        const cfg2 = this.config || {};
        const vpsIp2 = cfg2.vpsIp;
        const sshKey2 = cfg2.sshKeyPath;
        if (!vpsIp2 || !sshKey2) {
          this.appendOutput('No server configured.', '#ff4444');
          return true;
        }
        this.appendOutput('Syncing vault from server...', '#ffcc00');
        window.hermes.vaultSync(vpsIp2, 'root', sshKey2).then(r => {
          if (r.ok) {
            this.appendOutput(`Synced ${r.count} notes.`, '#00ff88');
            this.appendOutput('', '#000000');
            this.appendOutput('FIRST TIME SETUP:', '#f0a030');
            this.appendOutput('  1. Open Obsidian app', '#c0c0d0');
            this.appendOutput('  2. Click "Open folder as vault"', '#c0c0d0');
            this.appendOutput('  3. Paste this path in the file bar:', '#c0c0d0');
            this.appendOutput('', '#000000');
            this.appendOutput(`  ${r.path}`, '#ffcc00');
            this.appendOutput('', '#000000');
            this.appendOutput('  (path copied to clipboard)', '#606080');
            this.appendOutput('', '#000000');
            this.appendOutput('After first setup, OBSIDIAN opens it automatically.', '#a0a0b0');
            // Copy path to clipboard
            try { navigator.clipboard.writeText(r.path); } catch(e) {}
            // Open the folder so they can see it
            window.hermes.openObsidian(r.path);
          } else {
            this.appendOutput(`Sync failed: ${r.error}`, '#ff4444');
          }
        });
        return true;
      }
      case 'SETTINGS':
        this.appendOutput('Settings panel coming soon.', '#ffcc00');
        return true;
      case 'RESET':
        this.appendOutput('', '#606080');
        this.appendOutput('═══ FACTORY RESET ═══', '#ff4444');
        this.appendOutput('This will clear ALL local config:', '#ffcc00');
        this.appendOutput('  - API keys & server connection', '#a0a0b0');
        this.appendOutput('  - All Floor 2 room connections', '#a0a0b0');
        this.appendOutput('  - Milestones & stats', '#a0a0b0');
        this.appendOutput('', '#606080');
        this.appendOutput('Your WEBSITES on the server are', '#e0e0e0');
        this.appendOutput('NOT affected — only local config.', '#e0e0e0');
        this.appendOutput('You will need to re-enter all', '#e0e0e0');
        this.appendOutput('connection info (like a fresh install).', '#e0e0e0');
        this.appendOutput('', '#606080');
        this.appendOutput('Type RESET CONFIRM to proceed.', '#ff4444');
        return true;
      case 'RESET CONFIRM': {
        this.appendOutput('Clearing all config...', '#ff4444');
        const self = this;
        window.hermes.configAll().then(function(cfg) {
          const keys = Object.keys(cfg || {});
          const chain = keys.reduce(function(p, k) {
            return p.then(function() { return window.hermes.configDelete(k); });
          }, Promise.resolve());
          chain.then(function() {
            self.appendOutput('Config cleared. Restarting...', '#00ff88');
            setTimeout(function() { self.scene.start('Boot'); }, 1000);
          });
        });
        return true;
      }
      default:
        return false;
    }
  }

  showMissions() {
    const stats = this.config?.stats || { steps: 0, chats: 0, builds: 0, uploads: 0 };
    const milestones = this.config?.milestones || {};
    const tasks = this.config?.tasks || {};

    this.appendOutput('═══ MILESTONES ═══', '#f0a030');
    const ms = [
      { id: 'first_vessel',  label: 'First Vessel Online', check: () => !!this.config?.domain },
      { id: 'first_build',   label: 'First Build',         check: () => (stats.builds || 0) >= 1 },
      { id: 'first_chat',    label: 'First Conversation',  check: () => (stats.chats || 0) >= 1 },
      { id: 'first_upload',  label: 'First Upload',        check: () => (stats.uploads || 0) >= 1 },
      { id: 'steps_100',     label: '100 Steps',           check: () => (stats.steps || 0) >= 100, progress: `${Math.min(stats.steps||0,100)}/100` },
      { id: 'steps_1000',    label: '1000 Steps',          check: () => (stats.steps || 0) >= 1000, progress: `${Math.min(stats.steps||0,1000)}/1000` },
      { id: 'five_sites',    label: '5 Sites Running',     check: () => Object.values(this.config?.vessels||{}).filter(v=>v.active).length >= 5 },
      { id: 'full_pantheon', label: 'Full Pantheon',       check: () => Object.values(this.config?.vessels||{}).filter(v=>v.active).length >= 12 },
    ];
    for (const m of ms) {
      const done = milestones[m.id] || m.check();
      const mark = done ? '[*]' : '[ ]';
      const extra = (!done && m.progress) ? ` (${m.progress})` : '';
      this.appendOutput(`  ${mark} ${m.label}${extra}`, done ? '#00ff88' : '#a0a0b0');
    }

    this.appendOutput('═══ TASKS ═══', '#f0a030');
    const tk = [
      { id: 'demeter_shop',    vessel: 'DEMETER',     label: 'Open a Shop' },
      { id: 'ares_security',   vessel: 'ARES',        label: 'Security Basics' },
      { id: 'apollo_gallery',  vessel: 'APOLLO',      label: 'Launch a Gallery' },
      { id: 'athena_wiki',     vessel: 'ATHENA',      label: 'Knowledge Base' },
      { id: 'hestia_home',     vessel: 'HESTIA',      label: 'Personal Site' },
      { id: 'iris_connect',    vessel: 'IRIS',        label: 'Connect Services' },
      { id: 'themis_legal',    vessel: 'THEMIS',      label: 'Terms & Privacy' },
      { id: 'heph_tool',       vessel: 'HEPHAESTUS',  label: 'Build a Tool' },
      { id: 'dion_event',      vessel: 'DIONYSUS',    label: 'Event Page' },
      { id: 'perse_migrate',   vessel: 'PERSEPHONE',  label: 'Import Content' },
      { id: 'artemis_tracker', vessel: 'ARTEMIS',     label: 'Wellness Tracker' },
    ];
    for (const t of tk) {
      const st = tasks[t.id] || 'pending';
      const mark = st === 'completed' ? '[*]' : st === 'in_progress' ? '[>]' : '[ ]';
      const color = st === 'completed' ? '#00ff88' : st === 'in_progress' ? '#ffcc00' : '#a0a0b0';
      this.appendOutput(`  ${mark} ${t.vessel}: ${t.label}`, color);
    }
  }

  async checkAllVesselHealth() {
    const vessels = this.config?.vessels || {};
    for (const [name, vc] of Object.entries(vessels)) {
      if (!vc.active || !vc.domain) continue;
      try {
        const r = await window.hermes.bridgeFetch(`https://${vc.domain}/health`, { method: 'GET', timeout: 10000 });
        this.appendOutput(`  ${name}: ${r.ok ? 'ONLINE' : 'OFFLINE'}`, r.ok ? '#00ff88' : '#ff4444');
      } catch (e) {
        this.appendOutput(`  ${name}: OFFLINE`, '#ff4444');
      }
    }
  }

  async sendCommand(msg) {
    // Check for hub commands first
    if (this.processHubCommand(msg)) return;

    this.appendOutput(`> ${msg}`, '#e0e0e0');

    const config = await window.hermes.configAll() || {};
    if (!config.domain) {
      this.appendOutput('No vessel configured yet! Click [SETUP] above.', '#ff4444');
      return;
    }

    const url = `https://${config.domain}/chat`;
    this.appendOutput('thinking...', '#606080');

    try {
      const result = await window.hermes.bridgeFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Build-Token': config.buildToken || '',
        },
        body: { message: msg, session_id: 'game-client' },
        timeout: 120000,
      });

      // Remove "thinking..."
      this.removeLastTermLine();

      if (result.ok && result.data?.reply) {
        this.appendOutput(result.data.reply, '#00ff88');
      } else if (result.data?.pending) {
        // Auto-confirm pending tool actions
        const desc = result.data.pending.map(p => p.description || p.name).join(', ');
        this.appendOutput(`[EXECUTING] ${desc}`, '#ffcc00');
        try {
          const confirmResult = await window.hermes.bridgeFetch(
            `https://${config.domain}/chat/confirm`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Build-Token': config.buildToken || '',
              },
              body: { session_id: 'game-client', confirmed: true },
              timeout: 120000,
            }
          );
          if (confirmResult.ok && confirmResult.data?.reply) {
            this.appendOutput(confirmResult.data.reply, '#00ff88');
          } else if (confirmResult.data?.pending) {
            // Confirm again if nested
            await window.hermes.bridgeFetch(
              `https://${config.domain}/chat/confirm`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Build-Token': config.buildToken || '',
                },
                body: { session_id: 'game-client', confirmed: true },
                timeout: 120000,
              }
            );
            this.appendOutput('Action completed.', '#00ff88');
          } else {
            this.appendOutput('Action completed.', '#00ff88');
          }
        } catch (ce) {
          this.appendOutput(`Confirm error: ${ce.message}`, '#ff4444');
        }
      } else {
        const err = result.data?.error || 'unknown error';
        this.appendOutput(`Error: ${err}`, '#ff4444');
      }
    } catch (e) {
      this.removeLastTermLine();
      this.appendOutput(`Connection error: ${e.message}`, '#ff4444');
    }
  }

  removeLastTermLine() {
    if (this.termLines.length > 0) {
      const last = this.termLines.pop();
      this.termNextY -= last.height;
      last.text.destroy();
    }
  }

  appendOutput(text, color = '#00ff88') {
    const W = this.cameras.main.width;
    const t = this.add.text(10, this.termNextY, text, {
      ...FONT, fontSize: '11px', color: color,
      wordWrap: { width: W - 40 },
    });
    this.termContainer.add(t);
    const lineH = Math.max(t.height + 4, 16);
    this.termLines.push({ text: t, height: lineH });
    this.termNextY += lineH;

    // Auto-scroll to bottom
    const totalH = this.termNextY - (this.termPanelY + 4);
    if (totalH > this.termPanelH) {
      const scrollAmt = totalH - this.termPanelH;
      // Must add the terminal slide offset so scroll doesn't override the slide position
      const slideOffset = this.terminalOpen ? -200 : 0;
      this.termContainer.y = slideOffset - scrollAmt;
      this.termScrollOffset = scrollAmt;
    }
  }

  scrollTerminal(delta) {
    const totalH = this.termNextY - (this.termPanelY + 4);
    if (totalH <= this.termPanelH) return; // nothing to scroll

    const maxScroll = totalH - this.termPanelH;
    this.termScrollOffset = Phaser.Math.Clamp(this.termScrollOffset + delta, 0, maxScroll);

    const slideOffset = this.terminalOpen ? -200 : 0;
    this.termContainer.y = slideOffset - this.termScrollOffset;
  }

  showRoomChoice(returnScene) {
    if (this.roomChoiceOpen) return;
    this.roomChoiceOpen = true;
    this.roomChoiceElements = [];

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const cx = W / 2;
    const cy = H / 2 - 20;

    // Dim overlay
    const dim = this.add.rectangle(cx, H / 2, W, H, 0x000000, 0.7).setDepth(50);
    this.roomChoiceElements.push(dim);

    // Popup box
    const box = drawPixelBox(this, cx - 160, cy - 70, 320, 180, COLORS.amber, 0x0a0a1a);
    box.setDepth(51);
    this.roomChoiceElements.push(box);

    const title = this.add.text(cx, cy - 50, 'ROOM SETUP', {
      ...FONT, fontSize: '14px', color: '#f0a030',
    }).setOrigin(0.5).setDepth(52);
    this.roomChoiceElements.push(title);

    const desc = this.add.text(cx, cy - 25, 'What would you like to do\nwith this room?', {
      ...FONT, fontSize: '10px', color: '#a0a0b0', align: 'center', lineSpacing: 4,
    }).setOrigin(0.5).setDepth(52);
    this.roomChoiceElements.push(desc);

    // Button 1: Add as Vessel
    const btn1 = makeButton(this, cx - 140, cy + 10, 280, 30, 'ADD AS VESSEL (NEW PORT)', () => {
      this.closeRoomChoice();
      this.scene.start('Wizard', { customVessel: true, returnScene: returnScene });
    });
    btn1.bg.setDepth(52); btn1.txt.setDepth(53); btn1.zone.setDepth(54);
    this.roomChoiceElements.push(btn1.bg, btn1.txt, btn1.zone);

    // Button 2: Activate as internal vessel (closed port)
    const btn2 = makeButton(this, cx - 140, cy + 50, 280, 30, 'ACTIVATE ROOM', () => {
      const building = this.nearestBuilding; // save ref before closing popup
      this.closeRoomChoice();
      this._activateGodRoom(building);
    });
    btn2.bg.setDepth(52); btn2.txt.setDepth(53); btn2.zone.setDepth(54);
    this.roomChoiceElements.push(btn2.bg, btn2.txt, btn2.zone);

    // ESC hint
    const esc = this.add.text(cx, cy + 95, 'ESC TO CANCEL', {
      ...FONT, fontSize: '9px', color: '#404060',
    }).setOrigin(0.5).setDepth(52);
    this.roomChoiceElements.push(esc);
  }

  closeRoomChoice() {
    if (!this.roomChoiceOpen) return;
    this.roomChoiceOpen = false;
    if (this.roomChoiceElements) {
      this.roomChoiceElements.forEach(el => el.destroy());
      this.roomChoiceElements = [];
    }
  }

  async _activateGodRoom(building) {
    if (!building) building = this.nearestBuilding;
    const godName = building?.def?.label;
    if (!godName) return;

    const config = await window.hermes.configAll();
    const ip = config.vpsIp;
    const keyPath = config.sshKeyPath;
    if (!ip || !keyPath) {
      if (this.statusLabel) this.statusLabel.setText('NO SERVER');
      return;
    }

    const GOD_PERSONALITIES = {
      ATHENA: 'You are Athena, goddess of wisdom and strategy. You are a knowledge assistant — thoughtful, analytical, and thorough. Help the user research topics, organize information, and think through problems. Speak with calm authority.',
      APOLLO: 'You are Apollo, god of arts and light. You are a creative assistant — imaginative, eloquent, and inspiring. Help the user with writing, design ideas, content creation, and artistic expression. Speak with warmth and flair.',
      DEMETER: 'You are Demeter, goddess of the harvest. You are a commerce assistant — practical, nurturing, and growth-focused. Help the user with shop management, product ideas, pricing strategy, and business growth. Speak with grounded wisdom.',
      ARES: 'You are Ares, god of war. You are a security and systems assistant — direct, vigilant, and tactical. Help the user with server security, monitoring, troubleshooting, and system administration. Speak with blunt efficiency.',
      ARTEMIS: 'You are Artemis, goddess of the hunt. You are a wellness and tracking assistant — focused, independent, and precise. Help the user track habits, set goals, maintain balance, and stay organized. Speak with clarity and purpose.',
      DIONYSUS: 'You are Dionysus, god of celebration. You are an events and community assistant — energetic, social, and creative. Help the user plan events, engage audiences, and build community. Speak with enthusiasm and charm.',
      HEPHAESTUS: 'You are Hephaestus, god of the forge. You are a tools and engineering assistant — methodical, inventive, and hands-on. Help the user build custom tools, debug code, and deploy projects. Speak with craftsmanlike precision.',
      HESTIA: 'You are Hestia, goddess of the hearth. You are a personal and home assistant — warm, caring, and organized. Help the user manage their personal site, blog, and daily life. Speak with gentle encouragement.',
      IRIS: 'You are Iris, messenger of the gods. You are a communication assistant — swift, clear, and connected. Help the user manage messages, set up webhooks, and connect services. Speak with bright efficiency.',
      PERSEPHONE: 'You are Persephone, queen of transitions. You are a migration and transformation assistant — adaptable, patient, and thorough. Help the user import, export, and convert content between platforms. Speak with quiet confidence.',
      THEMIS: 'You are Themis, goddess of justice. You are a governance and policy assistant — fair, precise, and principled. Help the user with site policies, compliance, terms of service, and ethical considerations. Speak with measured authority.',
    };

    const personality = GOD_PERSONALITIES[godName];
    if (!personality) return;

    // Show progress
    if (building) {
      building.label.setText('ACTIVATING...');
      building.label.setColor('#ffcc00');
    }

    try {
      const vesselName = godName.toLowerCase();
      const vesselDir = `/root/hermes/vessels/${vesselName}`;

      // Find next available port
      const portResult = await window.hermes.sshExec(ip, 'root', keyPath,
        `grep -rh HERMES_PORT /root/hermes/vessels/*/.env 2>/dev/null | sed 's/HERMES_PORT=//' | sort -n | tail -1`
      );
      const lastPort = parseInt((portResult.stdout || '').trim()) || 8013;
      const port = lastPort + 1;

      // Generate build token
      const tokenResult = await window.hermes.sshExec(ip, 'root', keyPath,
        `openssl rand -hex 32`
      );
      const token = (tokenResult.stdout || '').trim();

      // Check if vessel already exists
      const existsResult = await window.hermes.sshExec(ip, 'root', keyPath,
        `test -f ${vesselDir}/bridge.py && echo EXISTS`
      );

      if ((existsResult.stdout || '').includes('EXISTS')) {
        // Vessel already exists — just read its port and token
        const envResult = await window.hermes.sshExec(ip, 'root', keyPath,
          `grep -E 'HERMES_PORT|BUILD_TOKEN' ${vesselDir}/.env 2>/dev/null`
        );
        const envLines = (envResult.stdout || '').split('\n');
        let existingPort = port, existingToken = token;
        for (const line of envLines) {
          if (line.startsWith('HERMES_PORT=')) existingPort = parseInt(line.split('=')[1]) || port;
          if (line.startsWith('BUILD_TOKEN=')) existingToken = line.split('=')[1] || token;
        }

        // Save to config
        const vessels = config.vessels || {};
        vessels[godName] = { port: existingPort, internalOnly: true, active: true, buildToken: existingToken };
        await window.hermes.configSet('vessels', vessels);

        // Create vault node
        this._createVaultNode(config, godName, GOD_PERSONALITIES[godName], existingPort);

        if (building) {
          building.active = true;
          building.label.setText(godName);
          building.label.setColor(BUILDING_DATA[godName]?.accentHex || '#00ff88');
          building.sprite.setAlpha(1);
        }
        return;
      }

      // Create vessel directory + files
      const apiKeyVar = config.llmProvider === 'OPENAI' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY';
      const setupCmds = [
        `mkdir -p ${vesselDir}/vessel ${vesselDir}/static ${vesselDir}/vessel/tree`,
        `DONOR=$(find /root/hermes/vessels -maxdepth 2 -name bridge.py -type f 2>/dev/null | head -1)`,
        `cp "$DONOR" ${vesselDir}/bridge.py`,
        `cat > ${vesselDir}/VESSEL.md << 'VESSELEOF'`,
        `# ${godName}`,
        ``,
        `${personality}`,
        ``,
        `You are an AI vessel running inside The Grand Internet Hotel. You serve the hotel guest who activated your room. Be helpful, stay in character, and assist with tasks related to your domain.`,
        `VESSELEOF`,
        `cat > ${vesselDir}/vessel/tree/MALKUTH.md << 'TREEEOF'`,
        `Output your responses as helpful text. Be conversational and stay in character as ${godName}. Format responses clearly.`,
        `TREEEOF`,
        `cat > ${vesselDir}/.env << ENVEOF`,
        `LLM_PROVIDER=${config.llmProvider || 'ANTHROPIC'}`,
        `${apiKeyVar}=${config.apiKey}`,
        `VESSEL_DIR=${vesselDir}/vessel`,
        `STATIC_DIR=${vesselDir}/static`,
        `BUILD_TOKEN=${token}`,
        `HERMES_PORT=${port}`,
        `HERMES_MAX_TOKENS=4096`,
        `HERMES_MODEL=${config.llmProvider === 'OPENAI' ? 'gpt-4o' : 'claude-sonnet-4-20250514'}`,
        `ENVEOF`,
      ].join(' && ');

      await window.hermes.sshExec(ip, 'root', keyPath, setupCmds);

      // Create systemd service (bound to 127.0.0.1 — closed port)
      const serviceName = `hermes-${vesselName}`;
      const serviceContent = [
        '[Unit]',
        `Description=HERMES vessel — ${vesselName}`,
        'After=network.target',
        '',
        '[Service]',
        'Type=simple',
        `WorkingDirectory=${vesselDir}`,
        `EnvironmentFile=${vesselDir}/.env`,
        `ExecStart=/usr/bin/python3 ${vesselDir}/bridge.py`,
        'Restart=always',
        'RestartSec=5',
        '',
        '[Install]',
        'WantedBy=multi-user.target',
      ].join('\\n');

      await window.hermes.sshExec(ip, 'root', keyPath,
        `printf '${serviceContent}' > /etc/systemd/system/${serviceName}.service && systemctl daemon-reload && systemctl enable ${serviceName} && systemctl start ${serviceName}`
      );

      // Wait for it to come online
      let online = false;
      for (let i = 0; i < 8; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const health = await window.hermes.sshExec(ip, 'root', keyPath,
          `curl -s -m 5 http://127.0.0.1:${port}/health 2>/dev/null`
        );
        if ((health.stdout || '').includes('ok') || (health.stdout || '').includes('status')) {
          online = true;
          break;
        }
      }

      // Save to config
      const vessels = config.vessels || {};
      vessels[godName] = { port, internalOnly: true, active: true, buildToken: token };
      await window.hermes.configSet('vessels', vessels);

      // Create vault node for this vessel
      this._createVaultNode(config, godName, GOD_PERSONALITIES[godName], port);

      // Update room visually
      if (building) {
        building.active = true;
        building.label.setText(godName);
        building.label.setColor(BUILDING_DATA[godName]?.accentHex || '#00ff88');
        building.sprite.setAlpha(1);
      }

    } catch (e) {
      console.error('Activate god room error:', e);
      if (building) {
        building.label.setText('FAILED');
        building.label.setColor('#ff4444');
      }
    }
  }

  async _createVaultNode(config, vesselName, personality, port) {
    // Write a vault note for this vessel via the HERMES bridge vault API
    try {
      const hermesCfg = config.vessels?.HERMES || {};
      const hermesDomain = hermesCfg.domain;
      const hermesToken = hermesCfg.buildToken || config.buildToken;
      if (!hermesDomain || !hermesToken) return;

      const today = new Date().toISOString().split('T')[0];
      const content = [
        '---',
        `tags: [vessel, room, ${vesselName.toLowerCase()}]`,
        'type: vessel',
        `created: ${today}`,
        `port: ${port || 'public'}`,
        '---',
        '',
        `# ${vesselName}`,
        '',
        personality ? personality.split('.')[0] + '.' : `Vessel room — ${vesselName}`,
        '',
        '## Status',
        `- Activated: ${today}`,
        port ? `- Internal port: ${port}` : '- Public vessel',
        '',
        '## Connections',
        '- [[INDEX]]',
        '- [[vessels/HERMES]]',
        '',
        '## Notes',
        '*(conversation summaries will appear here)*',
        '',
      ].join('\n');

      await window.hermes.bridgeFetch(`https://${hermesDomain}/api/vault/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Build-Token': hermesToken },
        body: { path: `vessels/${vesselName}.md`, content },
      });
    } catch (e) {
      console.log('Vault node creation skipped:', e.message);
    }
  }

  visitBuilding(name) {
    // Launch building interior scene
    this.scene.start('Building', { building: name });
  }

  async checkHealth() {
    const config = this.config || {};
    if (!config.domain) {
      this.statusLabel.setText('NO SERVER').setColor('#ff4444');
      this.statusDot.setFillStyle(COLORS.red);
      return;
    }

    try {
      const result = await window.hermes.bridgeFetch(`https://${config.domain}/health`, { method: 'GET' });
      if (result.ok) {
        this.statusDot.setFillStyle(COLORS.green);
        this.statusLabel.setText('ONLINE').setColor('#00ff88');
      } else {
        this.statusDot.setFillStyle(COLORS.red);
        this.statusLabel.setText('OFFLINE').setColor('#ff4444');
      }
    } catch (e) {
      this.statusDot.setFillStyle(COLORS.red);
      this.statusLabel.setText('OFFLINE').setColor('#ff4444');
    }
  }

  // ── HUD Overlay Panel System ──
  showHudOverlay(key) {
    // Close if already open
    if (this.hudOverlay) {
      this.closeHudOverlay();
      if (this.hudOverlayKey === key) return; // toggle off
    }
    this.hudOverlayKey = key;

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const pw = Math.min(W - 40, 700);
    const ph = Math.min(H - 80, 380);
    const px = (W - pw) / 2;
    const py = (H - ph) / 2 - 10;

    const els = [];

    // Dim background
    const dimBg = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6)
      .setDepth(50).setInteractive();
    dimBg.on('pointerdown', () => this.closeHudOverlay());
    els.push(dimBg);

    // Panel background
    const panelBg = this.add.graphics().setDepth(51);
    panelBg.fillStyle(0x0a0a1a, 1);
    panelBg.fillRect(px, py, pw, ph);
    panelBg.lineStyle(2, COLORS.amber, 1);
    panelBg.strokeRect(px, py, pw, ph);
    els.push(panelBg);

    // Close button
    const closeBtn = this.add.text(px + pw - 24, py + 6, 'X', {
      ...FONT, fontSize: '12px', color: '#ff4444',
    }).setDepth(52).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.closeHudOverlay());
    els.push(closeBtn);

    // Content — scrollable container with mask
    const contentMask = this.make.graphics();
    contentMask.fillStyle(0xffffff);
    contentMask.fillRect(px + 10, py + 30, pw - 20, ph - 40);
    const contentContainer = this.add.container(0, 0).setDepth(52);
    contentContainer.setMask(contentMask.createGeometryMask());
    els.push(contentContainer);

    let cy = py + 36; // content y cursor
    const maxW = pw - 40;
    const addLine = (text, color = '#e0e0e0', size = '11px') => {
      const t = this.add.text(px + 16, cy, text, {
        ...FONT, fontSize: size, color, wordWrap: { width: maxW },
      });
      contentContainer.add(t);
      cy += t.height + 4;
      return t;
    };

    // Build content based on key
    if (key === 'help') {
      addLine('HERMES COMMANDS', '#f0a030', '13px');
      cy += 6;
      addLine('HUB CONTROLS', '#ffcc00');
      addLine('  WASD / ARROWS  — move around', '#a0a0b0');
      addLine('  E              — interact with building', '#a0a0b0');
      addLine('  TAB            — open/close terminal', '#a0a0b0');
      addLine('  ESC            — close terminal', '#a0a0b0');
      cy += 6;
      addLine('TERMINAL COMMANDS (in hub)', '#ffcc00');
      addLine('  HELP       — show command list', '#a0a0b0');
      addLine('  VESSELS    — list all vessels', '#a0a0b0');
      addLine('  MISSIONS   — view tasks & milestones', '#a0a0b0');
      addLine('  STATUS     — check all vessel health', '#a0a0b0');
      addLine('  NEW VESSEL — create a new vessel', '#a0a0b0');
      cy += 6;
      addLine('BUILDING COMMANDS (inside a vessel)', '#ffcc00');
      addLine('  HELP     — vessel-specific commands', '#a0a0b0');
      addLine('  BUILD    — full site rebuild', '#a0a0b0');
      addLine('  UPLOAD   — upload files to vessel', '#a0a0b0');
      addLine('  STATUS   — check vessel health', '#a0a0b0');
      addLine('  VIEW     — open site in browser', '#a0a0b0');
      addLine('  BACK     — return to hub', '#a0a0b0');
      addLine('  (or type anything to chat)', '#606080');

    } else if (key === 'missions') {
      addLine('MISSIONS', '#f0a030', '13px');
      cy += 6;
      const tasks = this.config?.tasks || {};
      const tk = TASKS;
      for (const t of tk) {
        const st = tasks[t.id] || 'pending';
        const mark = st === 'completed' ? '[*]' : st === 'in_progress' ? '[>]' : '[ ]';
        const color = st === 'completed' ? '#00ff88' : st === 'in_progress' ? '#ffcc00' : '#a0a0b0';
        addLine(`${mark} ${t.vessel}: ${t.label}`, color);
        addLine(`    ${t.desc}`, '#606080', '10px');
      }

    } else if (key === 'achievements') {
      addLine('ACHIEVEMENTS', '#f0a030', '13px');
      cy += 6;
      const stats = this.config?.stats || { steps: 0, chats: 0, builds: 0, uploads: 0 };
      const milestones = this.config?.milestones || {};
      const ms = [
        { id: 'first_vessel',  label: 'First Vessel Online', desc: 'Set up your server',          check: () => !!this.config?.domain },
        { id: 'first_build',   label: 'First Build',         desc: 'Rebuild a site',              check: () => (stats.builds || 0) >= 1 },
        { id: 'first_chat',    label: 'First Conversation',  desc: 'Chat with a vessel',          check: () => (stats.chats || 0) >= 1 },
        { id: 'first_upload',  label: 'First Upload',        desc: 'Upload a file',               check: () => (stats.uploads || 0) >= 1 },
        { id: 'steps_100',     label: '100 Steps',           desc: 'Walk 100 steps in the hub',   check: () => (stats.steps || 0) >= 100, progress: `${Math.min(stats.steps||0,100)}/100` },
        { id: 'steps_1000',    label: '1000 Steps',          desc: 'Walk 1000 steps in the hub',  check: () => (stats.steps || 0) >= 1000, progress: `${Math.min(stats.steps||0,1000)}/1000` },
        { id: 'five_sites',    label: '5 Sites Running',     desc: 'Deploy 5 vessels',            check: () => Object.values(this.config?.vessels||{}).filter(v=>v.active).length >= 5 },
        { id: 'full_pantheon', label: 'Full Pantheon',       desc: 'All 12 vessels active',       check: () => Object.values(this.config?.vessels||{}).filter(v=>v.active).length >= 12 },
      ];
      for (const m of ms) {
        const done = milestones[m.id] || m.check();
        const mark = done ? '[*]' : '[ ]';
        const extra = (!done && m.progress) ? ` (${m.progress})` : '';
        const color = done ? '#00ff88' : '#a0a0b0';
        addLine(`${mark} ${m.label}${extra}`, color);
        addLine(`    ${m.desc}`, '#606080', '10px');
      }
      cy += 8;
      addLine('STATS', '#ffcc00');
      addLine(`  Steps: ${stats.steps || 0}   Chats: ${stats.chats || 0}   Builds: ${stats.builds || 0}   Uploads: ${stats.uploads || 0}`, '#a0a0b0');

    } else if (key === 'doorman') {
      addLine('♦ WELCOME TO THE GRAND INTERNET HOTEL ♦', '#f0a030', '12px');
      cy += 6;
      addLine('I am your concierge. Let me show you around.', '#e0e0e0');
      cy += 10;
      addLine('─── ABOUT THE HOTEL ───', '#ffcc00');
      addLine('Each room houses a vessel — an AI-powered', '#a0a0b0');
      addLine('site builder with its own tools and domain.', '#a0a0b0');
      addLine('Walk up to any door and press E to enter.', '#a0a0b0');
      cy += 10;
      addLine('─── GETTING STARTED ───', '#ffcc00');
      addLine('1. Enter HERMES (Room 101) — your main site', '#a0a0b0');
      addLine('2. Chat to build and customize your website', '#a0a0b0');
      addLine('3. Use tools: BUILD, UPLOAD, VIEW, STATUS', '#a0a0b0');
      addLine('4. Open the terminal (TAB) for commands', '#a0a0b0');
      cy += 10;
      addLine('─── FLOOR GUIDE ───', '#ffcc00');
      addLine('Floor 1 — The Pantheon (12 god vessels)', '#a0a0b0');
      addLine('Floor 2 — Custom vessels (create your own)', '#a0a0b0');
      addLine('Use the elevator to go between floors.', '#a0a0b0');
      cy += 10;
      addLine('─── THE 12 GODS ───', '#ffcc00');
      addLine('HERMES — Your main site & command center', '#a0a0b0');
      addLine('ATHENA — Knowledge, wikis, documentation', '#a0a0b0');
      addLine('APOLLO — Creative, portfolios, galleries', '#a0a0b0');
      addLine('DEMETER — Commerce, shops, products', '#a0a0b0');
      addLine('ARES — Security, firewalls, hardening', '#a0a0b0');
      addLine('ARTEMIS — Wellness, health, tracking', '#a0a0b0');
      addLine('DIONYSUS — Events, entertainment, social', '#a0a0b0');
      addLine('HEPHAESTUS — Workshop, tools, scripts', '#a0a0b0');
      addLine('HESTIA — Home, blog, personal pages', '#a0a0b0');
      addLine('IRIS — Comms, webhooks, notifications', '#a0a0b0');
      addLine('PERSEPHONE — Migration, import/export', '#a0a0b0');
      addLine('THEMIS — Governance, legal, compliance', '#a0a0b0');
      cy += 10;
      addLine('─── TIPS ───', '#ffcc00');
      addLine('WASD or arrows to walk, E to interact', '#a0a0b0');
      addLine('TAB opens the hub terminal', '#a0a0b0');
      addLine('Type HELP in terminal for commands', '#a0a0b0');
      addLine('Type NEW VESSEL to create a custom vessel', '#a0a0b0');

    } else if (key === 'info') {
      addLine('♦ GRAND INTERNET HOTEL ♦ FLOOR 1', '#f0a030', '13px');
      cy += 6;
      addLine('Your personal server command center.', '#e0e0e0');
      addLine('Each building is a vessel — an AI-powered', '#a0a0b0');
      addLine('site builder with its own personality.', '#a0a0b0');
      cy += 6;
      addLine('HOW IT WORKS', '#ffcc00');
      addLine('Walk up to a building and press E to enter.', '#a0a0b0');
      addLine('Chat with the vessel to build and manage', '#a0a0b0');
      addLine('your websites. Upload files, trigger builds,', '#a0a0b0');
      addLine('and customize everything through conversation.', '#a0a0b0');
      cy += 6;
      addLine('THE PANTHEON', '#ffcc00');
      addLine('12 vessels, each with a unique role:', '#a0a0b0');
      for (const v of ALL_VESSELS) {
        addLine(`  ${v.key} — ${v.desc}`, '#a0a0b0');
      }
      cy += 6;
      const config = this.config || {};
      if (config.domain) {
        addLine(`Server: ${config.domain}`, '#606080', '10px');
      }
      addLine('v1.0.0', '#404050', '10px');
    }

    // Enable scrolling in the overlay
    const contentH = cy - (py + 36);
    const viewH = ph - 40;
    let scrollY = 0;
    if (contentH > viewH) {
      dimBg.on('wheel', (p, dx, dy) => {
        scrollY = Phaser.Math.Clamp(scrollY + dy * 0.5, 0, contentH - viewH);
        contentContainer.y = -scrollY;
      });
      // Also scroll on panel area
      const scrollZone = this.add.zone(px + pw / 2, py + ph / 2, pw, ph)
        .setInteractive().setDepth(53);
      scrollZone.on('wheel', (p, dx, dy) => {
        scrollY = Phaser.Math.Clamp(scrollY + dy * 0.5, 0, contentH - viewH);
        contentContainer.y = -scrollY;
      });
      els.push(scrollZone);
    }

    this.hudOverlay = { elements: els, contentMask };
  }

  closeHudOverlay() {
    if (!this.hudOverlay) return;
    for (const el of this.hudOverlay.elements) {
      el.destroy();
    }
    if (this.hudOverlay.contentMask) this.hudOverlay.contentMask.destroy();
    this.hudOverlay = null;
    this.hudOverlayKey = null;
  }
}


// ═══════════════════════════════════════════════
//  FLOOR 2 SCENE — Custom Vessels
// ═══════════════════════════════════════════════
class Floor2Scene extends Phaser.Scene {
  constructor() { super('Floor2'); }

  create() {
    window.hermes.configAll().then(cfg => {
      this.config = cfg || {};
      this._buildScene();
    }).catch(() => {
      this.config = {};
      this._buildScene();
    });
  }

  _buildScene() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    this.cameras.main.setBackgroundColor(0x06060f);

    if (typeof generateSprites === 'function') {
      generateSprites(this);
    }

    this.SPEED = 120;
    this.INTERACT_RADIUS = 60;
    this.PLAY_AREA = { top: 50, bottom: H - 60, left: Math.floor(W * 0.12), right: Math.floor(W * 0.88) };
    this.nearestBuilding = null;
    this.roomChoiceOpen = false;
    this.roomChoiceElements = [];
    this.buildings = [];

    // ── Hallway Background (same as Floor 1) ──
    const hallway = this.add.graphics();
    hallway.fillStyle(0xc2a366, 1.0);
    hallway.fillRect(0, 0, Math.floor(W * 0.25), H);
    hallway.fillStyle(0xc2a366, 1.0);
    hallway.fillRect(Math.floor(W * 0.75), 0, W - Math.floor(W * 0.75), H);
    hallway.fillStyle(0x6b1a1a, 1.0);
    hallway.fillRect(Math.floor(W * 0.25), 0, Math.floor(W * 0.75) - Math.floor(W * 0.25), H);
    hallway.lineStyle(2, 0xd4a030, 1.0);
    hallway.lineBetween(Math.floor(W * 0.25), 0, Math.floor(W * 0.25), H);
    hallway.lineBetween(Math.floor(W * 0.75), 0, Math.floor(W * 0.75), H);
    hallway.lineStyle(2, 0x8a7040, 1.0);
    hallway.lineBetween(0, Math.floor(H * 0.5), Math.floor(W * 0.25), Math.floor(H * 0.5));
    hallway.lineBetween(Math.floor(W * 0.75), Math.floor(H * 0.5), W, Math.floor(H * 0.5));
    hallway.lineStyle(1, 0xb89f6a, 0.3);
    for (var wy = 40; wy < H; wy += 40) {
      hallway.lineBetween(0, wy, Math.floor(W * 0.25), wy);
      hallway.lineBetween(Math.floor(W * 0.75), wy, W, wy);
    }

    // ── Status bar ──
    const bar = this.add.graphics();
    bar.fillStyle(0x06060f, 1);
    bar.fillRect(0, 0, W, 28);
    bar.lineStyle(2, 0x2a2a3a, 1);
    bar.lineBetween(0, 28, W, 28);
    bar.setDepth(30);
    this.add.text(10, 7, '♦ FLOOR 2 ◆ CUSTOM VESSELS ♦', {
      ...FONT, fontSize: '12px', color: '#f0a030',
    }).setDepth(30);

    // ── Elevator back to Floor 1 — top left ──
    const DOOR_LEFT_X = Math.floor(W * 0.18);
    const DOOR_RIGHT_X = Math.floor(W * 0.82);
    var elevX = DOOR_LEFT_X;
    var elevY = 65;
    var elevSprite = this.add.image(elevX, elevY, 'elevator').setScale(1.4);
    var elevLabel = this.add.text(elevX, elevY + 42, 'ELEVATOR ▼', {
      ...FONT, fontSize: '8px', color: '#d4bb7e', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5);
    var elevTooltip = this.add.text(elevX, elevY - 38, 'Back to Floor 1', {
      ...FONT, fontSize: '8px', color: '#ffcc00', backgroundColor: '#0a0a1a', padding: { x: 4, y: 3 },
    }).setOrigin(0.5).setVisible(false);
    var elevE = this.add.text(elevX, elevY + 56, '[ E ]', {
      ...FONT, fontSize: '10px', color: '#f0a030',
    }).setOrigin(0.5).setVisible(false);
    this.tweens.add({ targets: elevE, alpha: 0.3, duration: 500, yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [1] });
    this.buildings.push({
      sprite: elevSprite, label: elevLabel, tooltip: elevTooltip,
      ePrompt: elevE, def: { label: 'ELEVATOR', active: true }, x: elevX, y: elevY, active: true, type: 'elevator-down'
    });

    // ── Custom vessel door slots ──
    const customVessels = this.config.customVessels || [];
    const MAX_SLOTS = 12;
    const FIRST_DOOR_Y = 110;
    const DOOR_SPACING = 58;

    for (var i = 0; i < MAX_SLOTS; i++) {
      var bx = (i % 2 === 0) ? DOOR_LEFT_X : DOOR_RIGHT_X;
      var by = FIRST_DOOR_Y + Math.floor(i / 2) * DOOR_SPACING;
      var cv = customVessels[i];
      var roomNum = 201 + i;

      this.add.text(bx, by - 32, '' + roomNum, {
        ...FONT, fontSize: '7px', color: cv ? '#d4bb7e' : '#333344',
      }).setOrigin(0.5);

      if (cv) {
        var dSprite = this.add.image(bx, by, 'door-default').setScale(1.2);
        var dLabel = this.add.text(bx, by + 34, cv.name.toUpperCase().substring(0, 14), {
          ...FONT, fontSize: '8px', color: '#d4bb7e', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5);
        var dTooltip = this.add.text(bx, by - 42, cv.domain || cv.name, {
          ...FONT, fontSize: '8px', color: '#ffcc00', backgroundColor: '#0a0a1a', padding: { x: 4, y: 3 },
        }).setOrigin(0.5).setVisible(false);
        var dE = this.add.text(bx, by + 50, '[ E ]', {
          ...FONT, fontSize: '10px', color: '#f0a030',
        }).setOrigin(0.5).setVisible(false);
        this.tweens.add({ targets: dE, alpha: 0.3, duration: 500, yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [1] });
        this.buildings.push({
          sprite: dSprite, label: dLabel, tooltip: dTooltip,
          ePrompt: dE, def: { label: cv.key, active: true }, x: bx, y: by, active: true, type: 'custom-vessel'
        });
      } else {
        var gSprite = this.add.image(bx, by, 'door-default').setScale(1.2).setAlpha(0.15);
        var gLabel = this.add.text(bx, by + 34, 'NEW VESSEL', {
          ...FONT, fontSize: '7px', color: '#404050', stroke: '#000', strokeThickness: 1,
        }).setOrigin(0.5);
        var gTooltip = this.add.text(bx, by - 42, 'Create a new vessel here', {
          ...FONT, fontSize: '8px', color: '#ffcc00', backgroundColor: '#0a0a1a', padding: { x: 4, y: 3 },
        }).setOrigin(0.5).setVisible(false);
        var gE = this.add.text(bx, by + 50, '[ E ]', {
          ...FONT, fontSize: '10px', color: '#f0a030',
        }).setOrigin(0.5).setVisible(false);
        this.tweens.add({ targets: gE, alpha: 0.3, duration: 500, yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [1] });
        this.buildings.push({
          sprite: gSprite, label: gLabel, tooltip: gTooltip,
          ePrompt: gE, def: { label: 'EMPTY_SLOT', active: true }, x: bx, y: by, active: true, type: 'empty-slot'
        });
      }
    }

    // ── Wall sconces ──
    for (var si = 0; si < Math.floor(MAX_SLOTS / 2); si += 2) {
      var sy = FIRST_DOOR_Y + si * DOOR_SPACING + DOOR_SPACING / 2;
      if (this.textures.exists('wall-sconce')) {
        this.add.image(DOOR_LEFT_X - 30, sy, 'wall-sconce').setScale(2).setAlpha(0.7);
        this.add.image(DOOR_RIGHT_X + 30, sy, 'wall-sconce').setScale(2).setAlpha(0.7);
      }
    }

    // ── Player ──
    this.player = this.add.image(W / 2, H * 0.6, 'player').setScale(3);
    this.playerShadow = this.add.ellipse(W / 2, H * 0.6 + 20, 20, 6, 0x000000, 0.3);
    this.dirArrow = this.add.text(W / 2, H * 0.6 - 24, '▼', {
      ...FONT, fontSize: '10px', color: '#f0a030',
    }).setOrigin(0.5).setAlpha(0.6);

    // ── Controls ──
    this.wasd = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.walkTime = 0;
  }

  update(time, delta) {
    if (!this.player || !this.wasd) return;
    const dt = delta / 1000;
    var dx = 0, dy = 0;
    if (this.wasd.A.isDown || this.wasd.LEFT.isDown) dx = -1;
    if (this.wasd.D.isDown || this.wasd.RIGHT.isDown) dx = 1;
    if (this.wasd.W.isDown || this.wasd.UP.isDown) dy = -1;
    if (this.wasd.S.isDown || this.wasd.DOWN.isDown) dy = 1;

    if (dx !== 0 || dy !== 0) {
      var mag = Math.sqrt(dx * dx + dy * dy);
      dx /= mag; dy /= mag;
      this.player.x += dx * this.SPEED * dt;
      this.player.y += dy * this.SPEED * dt;
      this.player.x = Phaser.Math.Clamp(this.player.x, this.PLAY_AREA.left, this.PLAY_AREA.right);
      this.player.y = Phaser.Math.Clamp(this.player.y, this.PLAY_AREA.top, this.PLAY_AREA.bottom);
      this.playerShadow.x = this.player.x;
      this.playerShadow.y = this.player.y + 20;
      this.dirArrow.x = this.player.x;
      this.dirArrow.y = this.player.y - 24;
      this.walkTime += dt * 12;
      this.player.y += Math.sin(this.walkTime) * 0.5;
      if (dy < 0) this.dirArrow.setText('▲');
      else if (dy > 0) this.dirArrow.setText('▼');
      else if (dx < 0) this.dirArrow.setText('◄');
      else if (dx > 0) this.dirArrow.setText('►');
    }

    // Proximity detection
    var closest = null, closestDist = Infinity;
    for (var i = 0; i < this.buildings.length; i++) {
      var b = this.buildings[i];
      var dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);
      if (dist < this.INTERACT_RADIUS && dist < closestDist) {
        closest = b;
        closestDist = dist;
      }
    }

    if (this.nearestBuilding && this.nearestBuilding !== closest) {
      this.nearestBuilding.ePrompt.setVisible(false);
      this.nearestBuilding.tooltip.setVisible(false);
    }
    this.nearestBuilding = closest;
    if (closest) {
      closest.ePrompt.setVisible(true);
      closest.tooltip.setVisible(true);
    }

    // E key interaction
    if (Phaser.Input.Keyboard.JustDown(this.wasd.E) && this.nearestBuilding && !this.roomChoiceOpen) {
      if (this.nearestBuilding.type === 'elevator-down') {
        this.scene.start('Hub');
      } else if (this.nearestBuilding.type === 'custom-vessel') {
        this.scene.start('Building', { building: this.nearestBuilding.def.label, returnScene: 'Floor2' });
      } else if (this.nearestBuilding.type === 'empty-slot') {
        this.showRoomChoice('Floor2');
      }
    }

    // ESC to close room choice popup
    if (this.roomChoiceOpen && Phaser.Input.Keyboard.JustDown(this.wasd.ESC)) {
      this.closeRoomChoice();
      return;
    }

    // ESC to go back to Floor 1 (only if popup not open)
    if (!this.roomChoiceOpen && Phaser.Input.Keyboard.JustDown(this.wasd.ESC)) {
      this.scene.start('Hub');
    }
  }

  showRoomChoice(returnScene) {
    if (this.roomChoiceOpen) return;
    this.roomChoiceOpen = true;
    this.roomChoiceElements = [];

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const cx = W / 2;
    const cy = H / 2 - 20;

    const dim = this.add.rectangle(cx, H / 2, W, H, 0x000000, 0.7).setDepth(50);
    this.roomChoiceElements.push(dim);

    const box = drawPixelBox(this, cx - 160, cy - 70, 320, 180, COLORS.amber, 0x0a0a1a);
    box.setDepth(51);
    this.roomChoiceElements.push(box);

    const title = this.add.text(cx, cy - 50, 'VESSEL SETUP', {
      ...FONT, fontSize: '14px', color: '#f0a030',
    }).setOrigin(0.5).setDepth(52);
    this.roomChoiceElements.push(title);

    const desc = this.add.text(cx, cy - 25, 'Set up a new vessel for\nthis room:', {
      ...FONT, fontSize: '10px', color: '#a0a0b0', align: 'center', lineSpacing: 4,
    }).setOrigin(0.5).setDepth(52);
    this.roomChoiceElements.push(desc);

    // Button 1: Forge new vessel
    const btn1 = makeButton(this, cx - 140, cy + 10, 280, 30, 'NEW VESSEL (FORGE)', () => {
      this.closeRoomChoice();
      this.scene.start('Wizard', { customVessel: true, returnScene: returnScene });
    });
    btn1.bg.setDepth(52); btn1.txt.setDepth(53); btn1.zone.setDepth(54);
    this.roomChoiceElements.push(btn1.bg, btn1.txt, btn1.zone);

    // Button 2: Connect existing vessel
    const btn2 = makeButton(this, cx - 140, cy + 50, 280, 30, 'CONNECT EXISTING VESSEL', () => {
      this.closeRoomChoice();
      this.scene.start('Wizard', { customVessel: true, returnScene: returnScene, preset: 'EXISTING' });
    });
    btn2.bg.setDepth(52); btn2.txt.setDepth(53); btn2.zone.setDepth(54);
    this.roomChoiceElements.push(btn2.bg, btn2.txt, btn2.zone);

    const esc = this.add.text(cx, cy + 95, 'ESC TO CANCEL', {
      ...FONT, fontSize: '9px', color: '#404060',
    }).setOrigin(0.5).setDepth(52);
    this.roomChoiceElements.push(esc);
  }

  closeRoomChoice() {
    if (!this.roomChoiceOpen) return;
    this.roomChoiceOpen = false;
    if (this.roomChoiceElements) {
      this.roomChoiceElements.forEach(el => el.destroy());
      this.roomChoiceElements = [];
    }
  }
}

/* ══════════════════════════════════════════════
   BUILDING SCENE — Interior view for each building
   ══════════════════════════════════════════════ */

// Building definitions with colors, tools, and descriptions
// All 12 pantheon vessels — used by hub for building layout + vessel listing
const ALL_VESSELS = [
  { key: 'HERMES',     label: 'HERMES',     desc: 'Your main vessel' },
  { key: 'ATHENA',     label: 'ATHENA',     desc: 'Knowledge & research' },
  { key: 'APOLLO',     label: 'APOLLO',     desc: 'Creative workshop' },
  { key: 'DEMETER',    label: 'DEMETER',    desc: 'Commerce & shop' },
  { key: 'ARES',       label: 'ARES',       desc: 'Security & systems' },
  { key: 'ARTEMIS',    label: 'ARTEMIS',    desc: 'Health & wellness' },
  { key: 'DIONYSUS',   label: 'DIONYSUS',   desc: 'Events & experience' },
  { key: 'HEPHAESTUS', label: 'HEPHAESTUS', desc: 'Fabrication & tools' },
  { key: 'HESTIA',     label: 'HESTIA',     desc: 'Home & personal' },
  { key: 'IRIS',       label: 'IRIS',       desc: 'Communication' },
  { key: 'PERSEPHONE', label: 'PERSEPHONE', desc: 'Migration & import' },
  { key: 'THEMIS',     label: 'THEMIS',     desc: 'Governance & legal' },
];

// Milestones & tasks definitions
const MILESTONES = [
  { id: 'first_vessel',  label: 'First Vessel Online',  desc: 'Set up your server',     icon: '*' },
  { id: 'first_build',   label: 'First Build',          desc: 'Rebuild a site',          icon: '*' },
  { id: 'first_upload',  label: 'First Upload',         desc: 'Upload a file',           icon: '*' },
  { id: 'first_chat',    label: 'First Conversation',   desc: 'Chat with a vessel',      icon: '*' },
  { id: 'five_sites',    label: '5 Sites Running',      desc: 'Deploy 5 vessels',        icon: '*' },
  { id: 'full_pantheon', label: 'Full Pantheon',        desc: 'All 12 vessels active',   icon: '*' },
  { id: 'steps_100',     label: '100 Steps',            desc: 'Walk 100 steps in hub',   icon: '*' },
  { id: 'steps_1000',    label: '1000 Steps',           desc: 'Walk 1000 steps in hub',  icon: '*' },
];

const TASKS = [
  { id: 'demeter_shop',    vessel: 'DEMETER',     label: 'Open a Shop',        desc: 'Set up your first product with Demeter' },
  { id: 'ares_security',   vessel: 'ARES',        label: 'Security Basics',    desc: 'Learn about server hardening with Ares' },
  { id: 'apollo_gallery',  vessel: 'APOLLO',      label: 'Launch a Gallery',   desc: 'Upload photos and build a gallery' },
  { id: 'athena_wiki',     vessel: 'ATHENA',      label: 'Knowledge Base',     desc: 'Build a FAQ or wiki page' },
  { id: 'hestia_home',     vessel: 'HESTIA',      label: 'Personal Site',      desc: 'Set up your personal homepage' },
  { id: 'iris_connect',    vessel: 'IRIS',        label: 'Connect Services',   desc: 'Set up webhooks or notifications' },
  { id: 'themis_legal',    vessel: 'THEMIS',      label: 'Terms & Privacy',    desc: 'Generate legal pages' },
  { id: 'heph_tool',       vessel: 'HEPHAESTUS',  label: 'Build a Tool',       desc: 'Create a custom script or utility' },
  { id: 'dion_event',      vessel: 'DIONYSUS',    label: 'Event Page',         desc: 'Create an event or landing page' },
  { id: 'perse_migrate',   vessel: 'PERSEPHONE',  label: 'Import Content',     desc: 'Migrate content from another platform' },
  { id: 'artemis_tracker', vessel: 'ARTEMIS',     label: 'Wellness Tracker',   desc: 'Build a health or habit dashboard' },
];

const BUILDING_DATA = {
  HERMES: {
    title: 'HERMES SUITE',
    subtitle: 'Vessel Command Center',
    accent: 0xf0a030,
    accentHex: '#f0a030',
    tools: [
      { label: 'VIEW SITE',    icon: '⌂', action: 'viewSite',    desc: 'Open your website in browser' },
      { label: 'REBUILD',      icon: '⟳', action: 'rebuild',     desc: 'Trigger a full site rebuild' },
      { label: 'VAULT',        icon: '◈', action: 'vault',       desc: 'Browse the knowledge vault' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  ATHENA: {
    title: 'ATHENA LIBRARY',
    subtitle: 'Knowledge & Research',
    accent: 0x00ccff,
    accentHex: '#00ccff',
    tools: [
      { label: 'ASK',          icon: '?', action: 'ask',         desc: 'Ask your vessel a question' },
      { label: 'SEARCH LOGS',  icon: '⊞', action: 'searchLogs', desc: 'Search conversation history' },
      { label: 'SITE MAP',     icon: '⊟', action: 'siteMap',    desc: 'View your site structure' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  APOLLO: {
    title: 'APOLLO LOUNGE',
    subtitle: 'Creative Workshop',
    accent: 0xff66aa,
    accentHex: '#ff66aa',
    tools: [
      { label: 'EDIT STYLE',   icon: '✎', action: 'editStyle',  desc: 'Customize site appearance' },
      { label: 'WRITE POST',   icon: '📝', action: 'writePost',  desc: 'Create new content' },
      { label: 'PREVIEW',      icon: '⊡', action: 'preview',    desc: 'Preview site changes' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  DEMETER: {
    title: 'DEMETER MARKET',
    subtitle: 'Commerce & Shop',
    accent: 0x66cc44,
    accentHex: '#66cc44',
    tools: [
      { label: 'PRODUCTS',     icon: '⊞', action: 'products',   desc: 'Manage shop products' },
      { label: 'ORDERS',       icon: '☰', action: 'orders',     desc: 'View recent orders' },
      { label: 'ANALYTICS',    icon: '▤', action: 'analytics',  desc: 'Sales & traffic stats' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  ARES: {
    title: 'ARES VAULT',
    subtitle: 'Security & Systems',
    accent: 0xff4444,
    accentHex: '#ff4444',
    tools: [
      { label: 'SSH TERMINAL', icon: '⊞', action: 'ssh',        desc: 'Open secure shell to server' },
      { label: 'FIREWALL',     icon: '⛨', action: 'firewall',   desc: 'View blocked IPs & rules' },
      { label: 'LOGS',         icon: '☰', action: 'serverLogs', desc: 'View server access logs' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  ARTEMIS: {
    title: 'ARTEMIS SPA',
    subtitle: 'Health & Wellness',
    accent: 0x44ccaa,
    accentHex: '#44ccaa',
    tools: [
      { label: 'DASHBOARD',    icon: '♥', action: 'dashboard',  desc: 'Wellness dashboard' },
      { label: 'TRACKER',      icon: '▤', action: 'tracker',    desc: 'Habit & health tracker' },
      { label: 'JOURNAL',      icon: '✎', action: 'journal',    desc: 'Daily journal entries' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  DIONYSUS: {
    title: 'DIONYSUS BAR',
    subtitle: 'Events & Experience',
    accent: 0xcc66ff,
    accentHex: '#cc66ff',
    tools: [
      { label: 'EVENTS',       icon: '☆', action: 'events',     desc: 'Manage events & pages' },
      { label: 'GALLERY',      icon: '⊡', action: 'gallery',    desc: 'Photo & media gallery' },
      { label: 'INVITE',       icon: '✉', action: 'invite',     desc: 'Create invitations' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  HEPHAESTUS: {
    title: 'HEPHAESTUS WORKSHOP',
    subtitle: 'Fabrication & Tools',
    accent: 0xff8833,
    accentHex: '#ff8833',
    tools: [
      { label: 'WORKSHOP',     icon: '⚒', action: 'workshop',   desc: 'Build custom tools' },
      { label: 'BLUEPRINTS',   icon: '⊟', action: 'blueprints', desc: 'View project plans' },
      { label: 'DEPLOY',       icon: '⟳', action: 'deploy',     desc: 'Deploy a build' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  HESTIA: {
    title: 'HESTIA PARLOR',
    subtitle: 'Home & Personal',
    accent: 0xffaa66,
    accentHex: '#ffaa66',
    tools: [
      { label: 'HOME PAGE',    icon: '⌂', action: 'homepage',   desc: 'Edit your personal site' },
      { label: 'BLOG',         icon: '✎', action: 'blog',       desc: 'Write blog posts' },
      { label: 'SETTINGS',     icon: '☰', action: 'settings',   desc: 'Site settings' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  IRIS: {
    title: 'IRIS SWITCHBOARD',
    subtitle: 'Communication Hub',
    accent: 0x66aaff,
    accentHex: '#66aaff',
    tools: [
      { label: 'MESSAGES',     icon: '✉', action: 'messages',   desc: 'View messages & alerts' },
      { label: 'WEBHOOKS',     icon: '⊞', action: 'webhooks',   desc: 'Manage webhooks' },
      { label: 'CONNECT',      icon: '⟳', action: 'connect',    desc: 'Link external services' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  PERSEPHONE: {
    title: 'PERSEPHONE PASSAGE',
    subtitle: 'Migration & Import',
    accent: 0xaa77cc,
    accentHex: '#aa77cc',
    tools: [
      { label: 'IMPORT',       icon: '↓', action: 'import',     desc: 'Import from another platform' },
      { label: 'EXPORT',       icon: '↑', action: 'export',     desc: 'Export your content' },
      { label: 'TRANSFORM',    icon: '⟳', action: 'transform',  desc: 'Convert between formats' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
  THEMIS: {
    title: 'THEMIS OFFICE',
    subtitle: 'Governance & Legal',
    accent: 0xccccaa,
    accentHex: '#ccccaa',
    tools: [
      { label: 'POLICIES',     icon: '⊟', action: 'policies',   desc: 'Manage site policies' },
      { label: 'TERMS',        icon: '☰', action: 'terms',      desc: 'Terms & conditions' },
      { label: 'COMPLIANCE',   icon: '⛨', action: 'compliance', desc: 'Privacy & compliance' },
      { label: 'CHAT',         icon: '>', action: 'chat',        desc: 'Talk to your vessel AI' },
    ],
  },
};

class BuildingScene extends Phaser.Scene {
  constructor() { super('Building'); }

  init(data) {
    this.buildingName = data.building || 'HERMES';
    this.returnScene = data.returnScene || 'Hub';
    this.bdata = BUILDING_DATA[this.buildingName] || BUILDING_DATA.HERMES;
  }

  create() {
    // Load config then build — config is async but scene build is sync
    window.hermes.configAll().then(cfg => {
      this.config = cfg || {};
      const vesselKey = this.buildingName;
      // Check pantheon vessels first, then custom vessels array
      const vc = this.config.vessels?.[vesselKey] || {};
      let cv = null;
      if (vc.domain) {
        this.vesselDomain = vc.domain;
      } else {
        // Look up in customVessels array
        cv = (this.config.customVessels || []).find(c => c.key === vesselKey);
        this.vesselDomain = cv?.domain || this.config.domain;
        // Use custom vessel data for identity if not a pantheon vessel
        if (cv && !BUILDING_DATA[this.buildingName]) {
          this.bdata = {
            title: (cv.name || vesselKey).toUpperCase() + ' SUITE',
            accent: 0xf0a030, accentHex: '#f0a030',
            tools: BUILDING_DATA.HERMES.tools,
          };
        }
      }
      this.vesselToken = vc.buildToken || (cv && cv.buildToken) || this.config.buildToken || '';
      this.vesselPort = vc.port || (cv && cv.port) || null;
      this.internalOnly = vc.internalOnly || (cv && cv.internalOnly) || false;
      this._buildScene();
    }).catch(e => {
      console.error('BuildingScene config error:', e);
      this.config = {};
      this.vesselDomain = '';
      this.vesselToken = '';
      this._buildScene();
    });
  }

  _buildScene() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    this.cameras.main.setBackgroundColor(COLORS.bg);

    const bd = this.bdata;

    // Generate sprites if needed
    if (typeof generateSprites === 'function') {
      generateSprites(this);
    }

    // ── Interior background — hotel room walls ──
    const g = this.add.graphics();
    // Wall base
    g.fillStyle(0xc2a366, 0.15);
    g.fillRect(0, 36, W, H - 36);
    // Wainscoting (lower portion darker)
    g.fillStyle(0x3d2b1f, 0.12);
    g.fillRect(0, H * 0.6, W, H * 0.4);
    // Horizontal trim lines
    g.lineStyle(1, bd.accent, 0.15);
    for (var wy = 60; wy < H; wy += 40) g.lineBetween(0, wy, W, wy);
    // Wainscoting divider line
    g.lineStyle(2, 0x8a7040, 0.3);
    g.lineBetween(0, Math.floor(H * 0.6), W, Math.floor(H * 0.6));
    // Floor
    g.fillStyle(0x2a1f16, 0.2);
    g.fillRect(0, H - 54, W, 54);

    // ── Header bar ──
    drawPixelBox(this, 0, 0, W, 36, bd.accent, 0x06060f);

    // Back button
    const backBtn = this.add.text(10, 10, '< BACK', {
      ...FONT, fontSize: '12px', color: bd.accentHex,
    });
    const backZone = this.add.zone(45, 18, 90, 36).setInteractive({ useHandCursor: true });
    backZone.setDepth(100);
    backZone.on('pointerover', () => backBtn.setColor('#ffffff'));
    backZone.on('pointerout',  () => backBtn.setColor(bd.accentHex));
    backZone.on('pointerdown', () => this.scene.start(this.returnScene));

    // Title — hotel room number + vessel name
    const ROOM_NUMBERS = { HERMES: 101, ATHENA: 102, APOLLO: 103, DEMETER: 104, ARES: 105, ARTEMIS: 106, DIONYSUS: 107, HEPHAESTUS: 108, HESTIA: 109, IRIS: 110, PERSEPHONE: 111, THEMIS: 112 };
    const roomNum = ROOM_NUMBERS[this.buildingName] || '???';
    this.add.text(W / 2, 10, 'RM ' + roomNum + ' — ' + bd.title, {
      ...FONT, fontSize: '14px', color: bd.accentHex,
    }).setOrigin(0.5, 0);

    // ESC hint
    this.add.text(W - 10, 10, 'ESC', {
      ...FONT, fontSize: '12px', color: '#404060',
    }).setOrigin(1, 0);

    // ── Building sprite (door, centered top) ──
    const spriteKey = 'door-' + this.buildingName.toLowerCase();
    if (this.textures.exists(spriteKey)) {
      this.add.image(W / 2, 80, spriteKey).setScale(2.5);
    }

    // Subtitle
    this.add.text(W / 2, 120, bd.subtitle, {
      ...FONT, fontSize: '12px', color: '#a0a0b0',
    }).setOrigin(0.5);

    // ── Tool bar — horizontal row under subtitle ──
    const toolY = 140;
    const toolBtnW = Math.floor((W - 40 - (bd.tools.length - 1) * 6) / bd.tools.length);

    for (let i = 0; i < bd.tools.length; i++) {
      const tool = bd.tools[i];
      const bx = 20 + i * (toolBtnW + 6);

      const btnBg = drawPixelBox(this, bx, toolY, toolBtnW, 28, bd.accent, 0x0a0a1a);
      const labelText = this.add.text(bx + toolBtnW / 2, toolY + 14, `${tool.icon} ${tool.label}`, {
        ...FONT, fontSize: '11px', color: bd.accentHex,
      }).setOrigin(0.5);

      const zone = this.add.zone(bx + toolBtnW / 2, toolY + 14, toolBtnW, 28)
        .setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => labelText.setColor('#ffffff'));
      zone.on('pointerout',  () => labelText.setColor(bd.accentHex));
      zone.on('pointerdown', () => this.runAction(tool));
    }

    // ── Chat terminal — full width, fills most of the screen ──
    const chatTop = toolY + 36;
    const chatBottom = H - 54;
    const chatH = chatBottom - chatTop;
    this.chatPanelY = chatTop;
    this.chatPanelH = chatH;

    drawPixelBox(this, 10, chatTop, W - 20, chatH, bd.accent, 0x06060f);

    // Scrollable chat output using a container with mask
    this.chatContainer = this.add.container(0, 0);

    // Create mask shape matching the chat panel
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(18, chatTop + 4, W - 36, chatH - 8);
    const mask = maskShape.createGeometryMask();
    this.chatContainer.setMask(mask);

    this.chatLines = [];  // array of { text: Phaser.Text, height: number }
    this.chatNextY = chatTop + 8;

    this.addChatLine(`Welcome to ${bd.title}. Type HELP for commands.`, '#606080');

    // ── Input bar at bottom ──
    const inputBoxW = W - 80;
    drawPixelBox(this, 10, H - 50, inputBoxW, 40, bd.accent, 0x0a0a1a);
    this.inputText = this.add.text(18, H - 46, '> ', {
      ...FONT, fontSize: '12px', color: bd.accentHex,
      wordWrap: { width: inputBoxW - 20, useAdvancedWrap: true },
    });

    // Send button
    drawPixelBox(this, W - 65, H - 50, 55, 40, bd.accent, 0x141430);
    this.add.text(W - 37, H - 30, 'SEND', {
      ...FONT, fontSize: '12px', color: bd.accentHex,
    }).setOrigin(0.5);
    const sendZone = this.add.zone(W - 37, H - 30, 55, 40)
      .setInteractive({ useHandCursor: true });
    sendZone.on('pointerdown', () => {
      if (this.inputBuffer.length > 0) {
        this.runChat(this.inputBuffer);
        this.inputBuffer = '';
        this.inputText.setText('> ');
      }
    });

    // Scroll with mouse wheel
    this.input.on('wheel', (pointer, gameObjects, dx, dy) => {
      this.scrollChat(dy > 0 ? 40 : -40);
    });

    this.inputBuffer = '';
    this.scrollOffset = 0;

    // ── Keyboard ──
    this.input.keyboard.on('keydown', (e) => this.handleKey(e));

    // Drag & drop handler — uploads to this vessel
    window._hermesDropHandler = (paths) => this.handleFileDrop(paths);

    // Clean up keyboard + drop handler on scene shutdown
    this.events.once('shutdown', () => {
      this.input.keyboard.removeAllListeners('keydown');
      window._hermesDropHandler = null;
      // Commit conversation to vault on room exit
      if (this.chatSessionId) {
        this.vesselFetch('vault/commit', {
          method: 'POST',
          body: { session_id: this.chatSessionId, vessel_name: this.buildingName },
        }).catch(() => {});
      }
    });

  }

  handleKey(e) {
    // PageUp/PageDown to scroll chat
    if (e.key === 'PageUp') { this.scrollChat(-80); return; }
    if (e.key === 'PageDown') { this.scrollChat(80); return; }

    // ESC to go back
    if (e.key === 'Escape') {
      this.scene.start(this.returnScene);
      return;
    }

    // Paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      navigator.clipboard.readText().then(text => {
        if (text) {
          this.inputBuffer += text.trim();
          this.inputText.setText('> ' + this.inputBuffer);
        }
      }).catch(() => {});
      return;
    }

    if (e.key === 'Enter' && this.inputBuffer.length > 0) {
      this.runChat(this.inputBuffer);
      this.inputBuffer = '';
      this.inputText.setText('> ');
    } else if (e.key === 'Backspace') {
      this.inputBuffer = this.inputBuffer.slice(0, -1);
      this.inputText.setText('> ' + this.inputBuffer);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && this.inputBuffer.length < 500) {
      this.inputBuffer += e.key;
      this.inputText.setText('> ' + this.inputBuffer);
    }
  }

  addChatLine(text, color = '#e0e0e0') {
    const W = this.cameras.main.width;
    const t = this.add.text(18, this.chatNextY, text, {
      ...FONT, fontSize: '12px', color,
      wordWrap: { width: W - 56 },
      lineSpacing: 4,
    });
    this.chatContainer.add(t);
    this.chatLines.push({ obj: t, h: t.height });
    this.chatNextY += t.height + 6;

    // Auto-scroll to bottom
    const overflow = this.chatNextY - (this.chatPanelY + this.chatPanelH - 8);
    if (overflow > 0) {
      this.scrollOffset = overflow;
      this.chatContainer.y = -this.scrollOffset;
    }
    return t;
  }

  removeChatLine(textObj) {
    const idx = this.chatLines.findIndex(l => l.obj === textObj);
    if (idx >= 0) {
      const h = this.chatLines[idx].h + 6;
      textObj.destroy();
      this.chatLines.splice(idx, 1);
      this.chatNextY -= h;
      // Reposition everything after removed line
      let y = this.chatPanelY + 8;
      for (const line of this.chatLines) {
        line.obj.setY(y);
        y += line.h + 6;
      }
      this.chatNextY = y;
    }
  }

  scrollChat(dy) {
    const maxScroll = Math.max(0, this.chatNextY - (this.chatPanelY + this.chatPanelH - 8));
    this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset + dy, 0, maxScroll);
    this.chatContainer.y = -this.scrollOffset;
  }

  appendOutput(text, color = '#e0e0e0') {
    return this.addChatLine(text, color);
  }

  async vesselFetch(urlPath, opts = {}) {
    if (this.internalOnly && this.vesselPort) {
      // Route through SSH tunnel for closed-port vessels
      const cfg = this.config || {};
      return window.hermes.sshFetch(
        cfg.vpsIp, 'root', cfg.sshKeyPath,
        this.vesselPort,
        opts.method || 'GET',
        urlPath,
        opts.body || null,
        this.vesselToken
      );
    }
    // Public vessel — use normal bridgeFetch
    const domain = this.vesselDomain;
    const url = `https://${domain}/${urlPath.replace(/^\//, '')}`;
    return window.hermes.bridgeFetch(url, {
      method: opts.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Build-Token': this.vesselToken || '',
        ...(opts.headers || {}),
      },
      body: opts.body,
      timeout: opts.timeout || 300000,
    });
  }

  async runAction(tool) {
    const domain = this.vesselDomain;
    const token = this.vesselToken;

    switch (tool.action) {
      case 'viewSite':
        if (domain) {
          this.addChatLine(`Opening https://${domain}...`, this.bdata.accentHex);
          window.hermes.openExternal(`https://${domain}`);
        } else {
          this.addChatLine('No domain configured. Run setup first.', '#ff4444');
        }
        break;

      case 'rebuild':
        if (!domain && !this.internalOnly) { this.addChatLine('No domain configured.', '#ff4444'); return; }
        this.addChatLine('Triggering rebuild...', '#ffcc00');
        try {
          const r = await this.vesselFetch('build', {
            method: 'POST',
            body: { prompt: 'Rebuild the site with current configuration' },
            timeout: 300000,
          });
          if (r.ok) this.addChatLine('Site rebuilt!', '#00ff88');
          else this.addChatLine(`Rebuild failed: ${r.data?.error || 'unknown'}`, '#ff4444');
        } catch (e) { this.addChatLine(`Error: ${e.message}`, '#ff4444'); }
        break;

      case 'healthCheck':
        if (!domain && !this.internalOnly) { this.addChatLine('No domain configured.', '#ff4444'); return; }
        this.addChatLine('Checking vessel health...', '#606080');
        try {
          const r = await this.vesselFetch('health', { method: 'GET' });
          if (r.ok) {
            const d = r.data;
            this.addChatLine('Status: ONLINE', '#00ff88');
            if (d.uptime) this.addChatLine(`Uptime: ${d.uptime}`, '#a0a0b0');
            if (d.version) this.addChatLine(`Version: ${d.version}`, '#a0a0b0');
          } else {
            this.addChatLine('Status: OFFLINE', '#ff4444');
          }
        } catch (e) { this.addChatLine(`Connection failed: ${e.message}`, '#ff4444'); }
        break;

      case 'vault':
        this.showVault();
        break;

      case 'chat':
      case 'ask':
        this.addChatLine('Type your message below and press ENTER.', this.bdata.accentHex);
        break;

      default:
        // All other actions — send as chat so the vessel handles it
        this.addChatLine(`${tool.label || tool.action}...`, this.bdata.accentHex);
        this.runChat(tool.action);
        break;
    }
  }

  // ── Vessel-specific extra commands for HELP ──
  getExtraCommands() {
    const name = this.buildingName;
    const extras = [];
    if (name === 'DEMETER')    { extras.push('PRODUCTS  — list shop products', 'ORDERS    — view recent orders'); }
    if (name === 'ARES')       { extras.push('LOGS      — view server logs', 'FIREWALL  — check security rules'); }
    if (name === 'APOLLO')     { extras.push('GALLERY   — view uploaded media'); }
    if (name === 'ATHENA')     { extras.push('SEARCH    — search conversation history'); }
    if (name === 'HESTIA')     { extras.push('BLOG      — write a new post'); }
    if (name === 'IRIS')       { extras.push('WEBHOOKS  — manage webhooks'); }
    if (name === 'DIONYSUS')   { extras.push('EVENTS    — manage event pages'); }
    if (name === 'HEPHAESTUS') { extras.push('WORKSHOP  — open the tool builder'); }
    if (name === 'PERSEPHONE') { extras.push('IMPORT    — import from another platform'); }
    if (name === 'THEMIS')     { extras.push('POLICIES  — manage site policies'); }
    if (name === 'ARTEMIS')    { extras.push('TRACKER   — health & habit tracker'); }
    return extras;
  }

  showHelp() {
    const c = this.bdata.accentHex;
    this.addChatLine('═══ COMMANDS ═══', c);
    this.addChatLine('  HELP     — show this list', '#a0a0b0');
    this.addChatLine('  BUILD    — full site rebuild', '#a0a0b0');
    this.addChatLine('  STORE    — convert into a storefront', '#a0a0b0');
    this.addChatLine('  STRIPE   — add Stripe payment keys', '#a0a0b0');
    this.addChatLine('  PRINTIFY — add Printify API keys', '#a0a0b0');
    this.addChatLine('  UPLOAD   — upload files to vessel', '#a0a0b0');
    this.addChatLine('  STATUS   — check vessel health', '#a0a0b0');
    this.addChatLine('  VIEW     — open site in browser', '#a0a0b0');
    this.addChatLine('  VAULT    — browse knowledge vault', '#a0a0b0');
    this.addChatLine('  BACK     — return to hub', '#a0a0b0');
    const extras = this.getExtraCommands();
    if (extras.length) {
      this.addChatLine(`═══ ${this.buildingName} ═══`, c);
      for (const ex of extras) this.addChatLine(`  ${ex}`, '#a0a0b0');
    }
    this.addChatLine('Or type anything to chat with your vessel.', '#606080');
  }

  // ── Obsidian Vault Viewer ──
  async showVault() {
    this.addChatLine('═══ KNOWLEDGE VAULT ═══', this.bdata.accentHex);
    this.addChatLine('Loading vault...', '#606080');

    try {
      const r = await this.vesselFetch('api/vault/list', { method: 'GET' });
      if (!r.ok || !r.data?.notes) {
        this.addChatLine('Vault is empty or unavailable.', '#ff4444');
        return;
      }

      const notes = r.data.notes;
      if (notes.length === 0) {
        this.addChatLine('Vault is empty. Chat with your vessel to grow it.', '#a0a0b0');
        return;
      }

      // Group by folder
      const folders = {};
      for (const n of notes) {
        const parts = n.path.split('/');
        const folder = parts.length > 1 ? parts[0] : '(root)';
        if (!folders[folder]) folders[folder] = [];
        folders[folder].push(n);
      }

      this.addChatLine(`  ${notes.length} notes across ${Object.keys(folders).length} folders`, '#a0a0b0');
      this.addChatLine('', '#000');

      for (const [folder, items] of Object.entries(folders)) {
        this.addChatLine(`  ◈ ${folder}/`, this.bdata.accentHex);
        for (const n of items) {
          const name = n.path.split('/').pop().replace('.md', '');
          const linkCount = n.links?.length || 0;
          const linkStr = linkCount > 0 ? ` [${linkCount} links]` : '';
          const tags = n.tags?.length ? ` #${n.tags.join(' #')}` : '';
          this.addChatLine(`    ${name}${linkStr}${tags}`, '#c0c0d0');
        }
      }

      this.addChatLine('', '#000');
      this.addChatLine('Type VAULT READ <name> to read a note.', '#606080');
    } catch (e) {
      this.addChatLine(`Vault error: ${e.message}`, '#ff4444');
    }
  }

  async showVaultNote(notePath) {
    this.addChatLine(`Reading ${notePath}...`, '#606080');
    try {
      // Try to find the note — search if no extension given
      let path = notePath;
      if (!path.endsWith('.md')) path += '.md';
      // Try direct path first, then search in subfolders
      let r = await this.vesselFetch(`api/vault/read?path=${encodeURIComponent(path)}`, { method: 'GET' });
      if (!r.ok && !path.includes('/')) {
        // Try common subfolders
        for (const folder of ['vessels', 'sessions', 'knowledge', 'ideas']) {
          r = await this.vesselFetch(`api/vault/read?path=${encodeURIComponent(folder + '/' + path)}`, { method: 'GET' });
          if (r.ok) break;
        }
      }
      if (!r.ok) {
        this.addChatLine(`Note not found: ${notePath}`, '#ff4444');
        return;
      }
      const content = r.data.content || '';
      const lines = content.split('\n');
      this.addChatLine(`═══ ${r.data.path} ═══`, this.bdata.accentHex);
      for (const line of lines.slice(0, 40)) {
        // Highlight wikilinks
        const colored = line.replace(/\[\[([^\]]+)\]\]/g, '«$1»');
        const isHeader = line.startsWith('#');
        this.addChatLine(`  ${colored}`, isHeader ? this.bdata.accentHex : '#c0c0d0');
      }
      if (lines.length > 40) {
        this.addChatLine(`  ... (${lines.length - 40} more lines)`, '#606080');
      }
    } catch (e) {
      this.addChatLine(`Error: ${e.message}`, '#ff4444');
    }
  }

  processCommand(msg) {
    const cmd = msg.trim().toUpperCase();
    // VAULT READ <name> — read a vault note
    if (cmd.startsWith('VAULT READ ')) {
      const notePath = msg.trim().substring(11).trim();
      if (notePath) this.showVaultNote(notePath);
      else this.addChatLine('Usage: VAULT READ <note-name>', '#ff4444');
      return true;
    }
    switch (cmd) {
      case 'HELP':
        this.showHelp();
        return true;
      case 'BUILD':
        this.runAction({ action: 'rebuild', label: 'REBUILD' });
        return true;
      case 'STRIPE':
      case 'ADD STRIPE':
        this.startKeyFlow('stripe');
        return true;
      case 'PRINTIFY':
      case 'ADD PRINTIFY':
        this.startKeyFlow('printify');
        return true;
      case 'STORE':
      case 'MAKE STORE':
        this.addChatLine('Converting to storefront...', '#f0a030');
        this.runChat('Rebuild this site as an online store / shop. Add a product catalog section, a featured products area, an about section, and a contact/order section. Keep the existing 8-bit retro pixel art style. Make it look like a real e-commerce storefront with pricing, product images placeholders, and an inviting shopping experience.');
        return true;
      case 'UPLOAD':
        this.triggerUpload();
        return true;
      case 'STATUS':
        this.runAction({ action: 'healthCheck', label: 'HEALTH CHECK' });
        return true;
      case 'VIEW':
        this.runAction({ action: 'viewSite', label: 'VIEW SITE' });
        return true;
      case 'VAULT':
        this.showVault();
        return true;
      case 'BACK':
        this.scene.start('Hub');
        return true;
      // Vessel-specific shortcuts
      case 'PRODUCTS':
      case 'ORDERS':
      case 'ANALYTICS':
      case 'LOGS':
      case 'FIREWALL':
      case 'GALLERY':
      case 'SEARCH':
      case 'BLOG':
      case 'WEBHOOKS':
      case 'EVENTS':
      case 'WORKSHOP':
      case 'BLUEPRINTS':
      case 'IMPORT':
      case 'EXPORT':
      case 'POLICIES':
      case 'TERMS':
      case 'TRACKER':
      case 'JOURNAL':
      case 'DASHBOARD':
      case 'MESSAGES':
        this.runAction({ action: cmd.toLowerCase(), label: cmd });
        return true;
      default:
        return false;
    }
  }

  startKeyFlow(type) {
    this.keyFlowType = type;
    this.keyFlowStep = 0;
    this.keyFlowData = {};

    if (type === 'stripe') {
      this.addChatLine('═══ STRIPE SETUP ═══', '#f0a030');
      this.addChatLine('Step 1: Paste your Stripe Secret Key', '#a0a0b0');
      this.addChatLine('(starts with sk_live_ or sk_test_)', '#606080');
    } else if (type === 'printify') {
      this.addChatLine('═══ PRINTIFY SETUP ═══', '#f0a030');
      this.addChatLine('Step 1: Paste your Printify API Token', '#a0a0b0');
      this.addChatLine('(from Printify → Settings → API)', '#606080');
    }
  }

  async handleKeyFlowInput(input) {
    const config = await window.hermes.configAll();
    const ip = config.vpsIp;
    const keyPath = config.sshKeyPath;
    const domain = this.vesselDomain;
    const vesselName = domain ? domain.split('.')[0] : '';

    if (this.keyFlowType === 'stripe') {
      if (this.keyFlowStep === 0) {
        // Got secret key
        this.keyFlowData.secretKey = input.trim();
        this.addChatLine('Got it. ✓', '#00ff88');
        this.keyFlowStep = 1;
        this.addChatLine('Step 2: Paste your Webhook Secret', '#a0a0b0');
        this.addChatLine('(starts with whsec_)', '#606080');
        return true;
      } else if (this.keyFlowStep === 1) {
        // Got webhook secret — write both to server
        this.keyFlowData.webhookSecret = input.trim();
        this.addChatLine('Writing keys to vessel...', '#ffcc00');
        try {
          const cmd = `grep -q STRIPE_SECRET_KEY /root/hermes/vessels/${vesselName}/.env && sed -i '/^STRIPE_/d' /root/hermes/vessels/${vesselName}/.env; echo 'STRIPE_SECRET_KEY=${this.keyFlowData.secretKey}' >> /root/hermes/vessels/${vesselName}/.env && echo 'STRIPE_WEBHOOK_SECRET=${this.keyFlowData.webhookSecret}' >> /root/hermes/vessels/${vesselName}/.env && systemctl restart hermes-${vesselName} 2>/dev/null; echo OK`;
          const r = await window.hermes.sshExec(ip, 'root', keyPath, cmd);
          if ((r.stdout || '').includes('OK')) {
            this.addChatLine('Stripe keys saved & vessel restarted! ✓', '#00ff88');
            this.addChatLine('Payments are now live on this vessel.', '#a0a0b0');
          } else {
            this.addChatLine('Error writing keys: ' + (r.stderr || 'unknown'), '#ff4444');
          }
        } catch (e) {
          this.addChatLine('SSH error: ' + e.message, '#ff4444');
        }
        this.keyFlowType = null;
        return true;
      }
    } else if (this.keyFlowType === 'printify') {
      if (this.keyFlowStep === 0) {
        // Got API token
        this.keyFlowData.apiToken = input.trim();
        this.addChatLine('Got it. ✓', '#00ff88');
        this.keyFlowStep = 1;
        this.addChatLine('Step 2: Enter your Printify Shop ID', '#a0a0b0');
        this.addChatLine('(found in your dashboard URL)', '#606080');
        return true;
      } else if (this.keyFlowStep === 1) {
        // Got shop ID — write both to server
        this.keyFlowData.shopId = input.trim();
        this.addChatLine('Writing keys to vessel...', '#ffcc00');
        try {
          const cmd = `grep -q PRINTIFY_API_TOKEN /root/hermes/vessels/${vesselName}/.env && sed -i '/^PRINTIFY_/d' /root/hermes/vessels/${vesselName}/.env; echo 'PRINTIFY_API_TOKEN=${this.keyFlowData.apiToken}' >> /root/hermes/vessels/${vesselName}/.env && echo 'PRINTIFY_SHOP_ID=${this.keyFlowData.shopId}' >> /root/hermes/vessels/${vesselName}/.env && systemctl restart hermes-${vesselName} 2>/dev/null; echo OK`;
          const r = await window.hermes.sshExec(ip, 'root', keyPath, cmd);
          if ((r.stdout || '').includes('OK')) {
            this.addChatLine('Printify keys saved & vessel restarted! ✓', '#00ff88');
            this.addChatLine('Product sync is now available.', '#a0a0b0');
          } else {
            this.addChatLine('Error writing keys: ' + (r.stderr || 'unknown'), '#ff4444');
          }
        } catch (e) {
          this.addChatLine('SSH error: ' + e.message, '#ff4444');
        }
        this.keyFlowType = null;
        return true;
      }
    }
    return false;
  }

  async triggerUpload() {
    const domain = this.vesselDomain;
    const token = this.vesselToken;
    if (!domain) {
      this.addChatLine('No vessel configured.', '#ff4444');
      return;
    }

    this.addChatLine('Opening file picker...', '#606080');
    const files = await window.hermes.fileDialog();
    if (!files || files.length === 0) {
      this.addChatLine('No files selected.', '#606080');
      return;
    }

    this.addChatLine(`Uploading ${files.length} file(s)...`, '#ffcc00');
    let success = 0;
    for (const fp of files) {
      const name = fp.split(/[/\\]/).pop();
      try {
        const r = await window.hermes.uploadFile(`https://${domain}/upload`, fp, token);
        if (r.ok) {
          this.addChatLine(`  Uploaded: ${name}`, '#00ff88');
          success++;
        } else {
          this.addChatLine(`  Failed: ${name} — ${r.data?.error || 'unknown'}`, '#ff4444');
        }
      } catch (e) {
        this.addChatLine(`  Failed: ${name} — ${e.message}`, '#ff4444');
      }
    }
    this.addChatLine(`Done. ${success}/${files.length} uploaded.`, success > 0 ? '#00ff88' : '#ff4444');

    // Track upload stat
    if (success > 0) {
      const stats = this.config.stats || { steps: 0, chats: 0, builds: 0, uploads: 0 };
      stats.uploads = (stats.uploads || 0) + success;
      window.hermes.configSet('stats', stats);
    }
  }

  async handleFileDrop(paths) {
    const domain = this.vesselDomain;
    const token = this.vesselToken;
    if (!domain) {
      this.addChatLine('No vessel configured — cannot upload.', '#ff4444');
      return;
    }
    this.addChatLine(`Dropped ${paths.length} file(s). Uploading...`, '#ffcc00');
    let success = 0;
    for (const fp of paths) {
      const name = fp.split(/[/\\]/).pop();
      try {
        const r = await window.hermes.uploadFile(`https://${domain}/upload`, fp, token);
        if (r.ok) {
          this.addChatLine(`  Uploaded: ${name}`, '#00ff88');
          success++;
        } else {
          this.addChatLine(`  Failed: ${name}`, '#ff4444');
        }
      } catch (e) {
        this.addChatLine(`  Failed: ${name} — ${e.message}`, '#ff4444');
      }
    }
    this.addChatLine(`Done. ${success}/${paths.length} uploaded.`, success > 0 ? '#00ff88' : '#ff4444');
  }

  async runChat(msg) {
    // Check for local commands first
    if (this.processCommand(msg)) return;

    // If a key flow is active, route input there
    if (this.keyFlowType) {
      if (await this.handleKeyFlowInput(msg)) return;
    }

    this.addChatLine(`> ${msg}`, '#e0e0e0');

    const domain = this.vesselDomain;
    if (!domain && !this.internalOnly) {
      this.addChatLine('No vessel configured. Go back and run setup.', '#ff4444');
      return;
    }

    // Track chat stat
    const stats = this.config.stats || { steps: 0, chats: 0, builds: 0, uploads: 0 };
    stats.chats = (stats.chats || 0) + 1;
    window.hermes.configSet('stats', stats);

    // Detect build/reskin requests — route directly to /build endpoint
    const buildWords = /\b(reskin|redesign|rebuild|restyle|change the (look|design|style|theme|layout)|update the (site|page|html|css)|make it look|new design|new look|redo the|overhaul)\b/i;
    if (buildWords.test(msg)) {
      this.addChatLine('Building...', '#ffcc00');
      try {
        const r = await this.vesselFetch('build', {
          method: 'POST',
          body: { prompt: msg },
          timeout: 300000,
        });
        if (r.ok) {
          this.addChatLine('Site rebuilt successfully!', '#00ff88');
        } else {
          this.addChatLine(`Build error: ${r.data?.error || 'unknown'}`, '#ff4444');
        }
      } catch (e) {
        this.addChatLine(`Build error: ${e.message}`, '#ff4444');
      }
      return;
    }

    // Regular chat — with tools so vessel can edit files, run commands
    const thinkingLine = this.addChatLine('thinking...', '#606080');
    if (!this.chatSessionId) {
      this.chatSessionId = `game-${this.buildingName.toLowerCase()}-${Date.now()}`;
    }
    const sessionId = this.chatSessionId;

    try {
      let response = await this.vesselFetch('chat', {
        method: 'POST',
        body: { message: msg, session_id: sessionId, vessel_role: this.buildingName },
        timeout: 300000,
      });

      // Auto-retry once on bad response (no reply, no pending, parse error)
      if (!response.ok || (!response.data?.reply && !response.data?.pending)) {
        response = await this.vesselFetch('chat', {
          method: 'POST',
          body: { message: msg, session_id: sessionId, vessel_role: this.buildingName },
          timeout: 300000,
        });
      }

      this.removeChatLine(thinkingLine);

      if (response.ok && response.data?.reply) {
        this.addChatLine(response.data.reply, '#00ff88');
      } else if (response.ok && response.data?.pending) {
        const desc = response.data.pending.map(p => p.description || p.name).join(', ');
        this.addChatLine(`[EXECUTING] ${desc}`, '#ffcc00');

        let done = false;
        for (let round = 0; round < 10 && !done; round++) {
          try {
            const cr = await this.vesselFetch('chat/confirm', {
              method: 'POST',
              body: { session_id: sessionId, confirmed: true },
              timeout: 300000,
            });
            if (cr.ok && cr.data?.reply) {
              this.addChatLine(cr.data.reply, '#00ff88');
              done = true;
            } else if (cr.ok && cr.data?.pending) {
              const d2 = cr.data.pending.map(p => p.description || p.name).join(', ');
              this.addChatLine(`[EXECUTING] ${d2}`, '#ffcc00');
            } else {
              this.addChatLine('Done.', '#00ff88');
              done = true;
            }
          } catch (ce) {
            // Retry confirm once before giving up
            try {
              const cr2 = await this.vesselFetch('chat/confirm', {
                method: 'POST',
                body: { session_id: sessionId, confirmed: true },
                timeout: 300000,
              });
              if (cr2.ok && cr2.data?.reply) {
                this.addChatLine(cr2.data.reply, '#00ff88');
              } else {
                this.addChatLine('Done.', '#00ff88');
              }
            } catch (_) {
              this.addChatLine(`Error: ${ce.message}`, '#ff4444');
            }
            done = true;
          }
        }
      } else {
        const err = response.data?.error || 'unknown error';
        this.addChatLine(`Error: ${err}`, '#ff4444');
      }
    } catch (e) {
      // Auto-retry once on connection error
      try {
        const retry = await this.vesselFetch('chat', {
          method: 'POST',
          body: { message: msg, session_id: sessionId, vessel_role: this.buildingName },
          timeout: 300000,
        });
        this.removeChatLine(thinkingLine);
        if (retry.ok && retry.data?.reply) {
          this.addChatLine(retry.data.reply, '#00ff88');
        } else {
          this.addChatLine(`Error: ${retry.data?.error || e.message}`, '#ff4444');
        }
      } catch (_) {
        this.removeChatLine(thinkingLine);
        this.addChatLine(`Connection error: ${e.message}`, '#ff4444');
      }
    }
  }
}

/* ══════════════════════════════════════════════
   PHASER CONFIG
   ══════════════════════════════════════════════ */
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 508,
  pixelArt: true,
  backgroundColor: '#0a0a1a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, WizardScene, HubScene, Floor2Scene, BuildingScene],
});
