import * as PIXI from 'pixi.js';

function hexToNumber(hex) {
  if (typeof hex === 'number') return hex;
  if (!hex || typeof hex !== 'string') return 0xffffff;
  const clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    const r = clean[0] + clean[0];
    const g = clean[1] + clean[1];
    const b = clean[2] + clean[2];
    return parseInt(r + g + b, 16);
  }
  const parsed = parseInt(clean.slice(0, 6), 16);
  return Number.isNaN(parsed) ? 0xffffff : parsed;
}

export class PixiBoardRenderer {
  constructor(canvas, logicalSize = 440, sorok = 10, oszlopok = 10) {
    this.canvas = canvas;
    this.logicalSize = logicalSize;
    this.sorok = sorok;
    this.oszlopok = oszlopok;
    this.negyzetMeret = logicalSize / oszlopok;

    this.app = null;
    this.usePixiWebGL = false;
    this.ctx2d = null;

    this.gradientCache = new Map();
    this.matrixPool = new PIXI.Matrix();
    this.labelPool = [];
    this.floatingTextPool = [];
    this.lastBgStateKey = '';

    this.init();
  }

  init() {
    try {
      PIXI.settings.ROUND_PIXELS = true;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.app = new PIXI.Application({
        view: this.canvas,
        width: this.logicalSize,
        height: this.logicalSize,
        resolution: dpr,
        autoDensity: false,
        antialias: true,
        backgroundColor: 0x0d1017,
        powerPreference: 'high-performance',
      });

      if (this.app.ticker) {
        this.app.ticker.stop();
      }

      // Tartjuk meg a reszponzív CSS méretezést mobilon és asztali gépen egyaránt
      this.canvas.style.width = '';
      this.canvas.style.height = '';

      this.world = new PIXI.Container();
      this.bgGraphics = new PIXI.Graphics();
      this.blocksGraphics = new PIXI.Graphics();
      this.labelsContainer = new PIXI.Container();
      this.fxGraphics = new PIXI.Graphics();
      this.hoverContainer = new PIXI.Container();
      this.hoverContainer.roundPixels = true;
      this.hoverBg = new PIXI.Graphics();
      this.hoverText = new PIXI.Text('', {
        fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif',
        fontSize: 12,
        fontWeight: '700',
        fill: '#ffffff',
        align: 'center',
      });
      this.hoverText.resolution = Math.max(3, (window.devicePixelRatio || 1) * 2.5);
      this.hoverText.roundPixels = true;
      this.hoverText.anchor.set(0.5, 0.5);
      this.hoverContainer.addChild(this.hoverBg, this.hoverText);
      this.hoverContainer.visible = false;

      this.floatingTextsContainer = new PIXI.Container();

      this.world.addChild(
        this.bgGraphics,
        this.blocksGraphics,
        this.labelsContainer,
        this.fxGraphics,
        this.hoverContainer,
        this.floatingTextsContainer
      );
      this.app.stage.addChild(this.world);

      this.usePixiWebGL = true;
      window.__CRASHDOWN_RENDERER__ = 'PixiJS v' + PIXI.VERSION + ' (WebGL)';
    } catch (err) {
      console.warn('PixiJS WebGL inicializálás nem elérhető, Canvas2D fallback használata:', err);
      this.usePixiWebGL = false;
      this.ctx2d = this.canvas.getContext('2d');
      this.resize2D();
      window.__CRASHDOWN_RENDERER__ = 'Canvas2D Fallback';
    }
  }

  resize() {
    if (this.usePixiWebGL && this.app && this.app.renderer) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.app.renderer.resolution = dpr;
      this.app.renderer.resize(this.logicalSize, this.logicalSize);
      this.canvas.style.width = '';
      this.canvas.style.height = '';
      this.lastBgStateKey = '';
    } else if (this.ctx2d) {
      this.resize2D();
    }
  }

  resize2D() {
    if (!this.ctx2d) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.logicalSize * dpr;
    this.canvas.height = this.logicalSize * dpr;
    this.ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  getGradientTexture(topColor, bottomColor) {
    const key = `${topColor}|${bottomColor}`;
    if (this.gradientCache.has(key)) {
      return this.gradientCache.get(key);
    }
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 32;
    offCanvas.height = 64;
    const c = offCanvas.getContext('2d');
    const grad = c.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, bottomColor);
    c.fillStyle = grad;
    c.fillRect(0, 0, 32, 64);

    const tex = PIXI.Texture.from(offCanvas);
    this.gradientCache.set(key, tex);
    return tex;
  }

  getLabelText(index, labelStr) {
    while (this.labelPool.length <= index) {
      const t = new PIXI.Text('', {
        fontFamily: 'JetBrains Mono, system-ui, sans-serif',
        fontSize: 16,
        fontWeight: '800',
        fill: '#ffffff',
        align: 'center',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowDistance: 1,
        dropShadowAlpha: 0.65,
      });
      t.resolution = Math.max(3, (window.devicePixelRatio || 1) * 2);
      t.roundPixels = true;
      t.anchor.set(0.5, 0.5);
      t.visible = false;
      this.labelsContainer.addChild(t);
      this.labelPool.push(t);
    }
    const item = this.labelPool[index];
    if ( item._lastLabel !== labelStr ) {
      item._lastLabel = labelStr;
      item.text = labelStr;
      if (labelStr === '2×') {
        item.style.fontFamily = '"JetBrains Mono", monospace';
        item.style.fontSize = 16;
        item.style.fontWeight = '800';
      } else if (labelStr === 'TNT') {
        item.style.fontFamily = '"JetBrains Mono", monospace';
        item.style.fontSize = 13;
        item.style.fontWeight = '900';
      } else if (labelStr === '+5s') {
        item.style.fontFamily = '"JetBrains Mono", monospace';
        item.style.fontSize = 12;
        item.style.fontWeight = '800';
      } else if (labelStr === '🧲') {
        item.style.fontFamily = 'system-ui, sans-serif';
        item.style.fontSize = 18;
        item.style.fontWeight = '800';
      } else if (labelStr === '✦') {
        item.style.fontFamily = 'system-ui, sans-serif';
        item.style.fontSize = 19;
        item.style.fontWeight = '800';
      } else {
        item.style.fontFamily = 'system-ui, sans-serif';
        item.style.fontSize = 20;
        item.style.fontWeight = '800';
      }
    }
    item.visible = true;
    return item;
  }

  getFloatingTextObj(index, textStr, colorStr) {
    while (this.floatingTextPool.length <= index) {
      const ft = new PIXI.Text('', {
        fontFamily: 'Outfit, system-ui, sans-serif',
        fontSize: 16,
        fontWeight: '800',
        fill: '#ffffff',
        align: 'center',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowDistance: 1,
        dropShadowAlpha: 0.8,
      });
      ft.resolution = Math.max(3, (window.devicePixelRatio || 1) * 2);
      ft.roundPixels = true;
      ft.anchor.set(0.5, 0.5);
      ft.visible = false;
      this.floatingTextsContainer.addChild(ft);
      this.floatingTextPool.push(ft);
    }
    const item = this.floatingTextPool[index];
    if (item.text !== textStr) {
      item.text = textStr;
    }
    if (item._lastColor !== colorStr) {
      item._lastColor = colorStr;
      item.style.fill = colorStr || '#ffffff';
    }
    item.visible = true;
    return item;
  }

  computeBackgroundColors(isDoublePointsActive, isFrozen, comboMultiplier) {
    let bgFill = '#0d1017';
    let slotFill = '#151a24';

    const has2x = isDoublePointsActive;
    const hasFreeze = isFrozen;
    const cMult = Math.min(6, Math.max(1, comboMultiplier || 1));

    if (hasFreeze && has2x) {
      if (cMult <= 1) {
        bgFill = '#071f38';
        slotFill = '#0e3e68';
      } else if (cMult <= 3) {
        bgFill = '#0a1d3c';
        slotFill = '#14386e';
      } else if (cMult <= 5) {
        bgFill = '#141843';
        slotFill = '#262875';
      } else {
        bgFill = '#1d1248';
        slotFill = '#371c82';
      }
    } else if (hasFreeze) {
      if (cMult <= 1) {
        bgFill = '#062033';
        slotFill = '#0c3d5c';
      } else if (cMult === 2) {
        bgFill = '#081e35';
        slotFill = '#0e3a60';
      } else if (cMult === 3) {
        bgFill = '#0b1d38';
        slotFill = '#143864';
      } else if (cMult === 4) {
        bgFill = '#111b3d';
        slotFill = '#1f3069';
      } else if (cMult === 5) {
        bgFill = '#17163f';
        slotFill = '#29256d';
      } else {
        bgFill = '#1a1244';
        slotFill = '#311f75';
      }
    } else if (has2x) {
      if (cMult <= 1) {
        bgFill = '#071d2e';
        slotFill = '#0c3554';
      } else if (cMult === 2) {
        bgFill = '#091b32';
        slotFill = '#103359';
      } else if (cMult === 3) {
        bgFill = '#0c1a36';
        slotFill = '#173060';
      } else if (cMult === 4) {
        bgFill = '#121739';
        slotFill = '#222864';
      } else if (cMult === 5) {
        bgFill = '#18143d';
        slotFill = '#2c1e69';
      } else {
        bgFill = '#1d1042';
        slotFill = '#351873';
      }
    } else if (cMult > 1) {
      if (cMult === 2) {
        bgFill = '#141216';
        slotFill = '#201a24';
      } else if (cMult === 3) {
        bgFill = '#171114';
        slotFill = '#27171d';
      } else if (cMult === 4) {
        bgFill = '#1c0e12';
        slotFill = '#30131b';
      } else if (cMult === 5) {
        bgFill = '#200b1a';
        slotFill = '#38112e';
      } else {
        bgFill = '#1a0928';
        slotFill = '#301048';
      }
    }

    return { bgFill, slotFill };
  }

  render(state) {
    if (!this.usePixiWebGL) {
      return false;
    }

    const {
      grid,
      screenShake,
      isDoublePointsActive,
      isFrozen,
      comboMultiplier,
      hoverHighlightSet,
      colorStyles,
      shockwaves,
      particles,
      hoverCell,
      hoverPreviewText,
      floatingTexts,
    } = state;

    // 1. Képernyőrázkódás (screenShake)
    if (screenShake > 0.2) {
      const dx = (Math.random() - 0.5) * screenShake;
      const dy = (Math.random() - 0.5) * screenShake;
      this.world.position.set(dx, dy);
    } else {
      this.world.position.set(0, 0);
    }

    // 2. Dinamikus háttér és 10x10 slot rács (dirty-check optimalizációval)
    const { bgFill, slotFill } = this.computeBackgroundColors(
      isDoublePointsActive,
      isFrozen,
      comboMultiplier
    );
    const bgStateKey = `${bgFill}|${slotFill}`;
    if (this.lastBgStateKey !== bgStateKey) {
      this.lastBgStateKey = bgStateKey;
      const bgNum = hexToNumber(bgFill);
      const slotNum = hexToNumber(slotFill);

      this.bgGraphics.clear();
      this.bgGraphics.beginFill(bgNum, 1);
      this.bgGraphics.drawRect(0, 0, this.logicalSize, this.logicalSize);
      this.bgGraphics.endFill();

      this.bgGraphics.beginFill(slotNum, 1);
      const gw = this.negyzetMeret - 6;
      for (let i = 0; i < this.sorok; i++) {
        for (let j = 0; j < this.oszlopok; j++) {
          const gx = j * this.negyzetMeret + 3;
          const gy = i * this.negyzetMeret + 3;
          this.bgGraphics.drawRoundedRect(gx, gy, gw, gw, 6);
        }
      }
      this.bgGraphics.endFill();
    }

    // 3. Blokkok és Power-up ikonok kirajzolása
    this.blocksGraphics.clear();
    let activeLabelCount = 0;

    for (let i = 0; i < this.sorok; i++) {
      const row = grid[i];
      if (!row) continue;
      for (let j = 0; j < this.oszlopok; j++) {
        const elem = row[j];
        if (!elem || elem.color === 'white') continue;

        const isHighlighted = hoverHighlightSet.has(`${j}:${i}`);
        const pad = isHighlighted ? 2 : 3.5;
        const size = (this.negyzetMeret - pad * 2) * (elem.scale || 1);
        const x = j * this.negyzetMeret + (this.negyzetMeret - size) / 2;
        const y =
          i * this.negyzetMeret +
          (this.negyzetMeret - size) / 2 +
          (elem.offsetY || 0);

        const style = colorStyles[elem.color] || {
          top: elem.color,
          bottom: elem.color,
          border: '#ffffff',
        };

        const gradTex = this.getGradientTexture(style.top, style.bottom);
        this.matrixPool.identity();
        this.matrixPool.scale(size / 32, size / 64);
        this.matrixPool.translate(x, y);

        this.blocksGraphics.lineStyle(0);
        this.blocksGraphics.beginTextureFill({
          texture: gradTex,
          matrix: this.matrixPool,
        });
        this.blocksGraphics.drawRoundedRect(x, y, size, size, 7);
        this.blocksGraphics.endFill();

        // 3D élfény (bal-felső)
        this.blocksGraphics.lineStyle(1.5, 0xffffff, 0.28);
        this.blocksGraphics.moveTo(x + 5, y + size - 3);
        this.blocksGraphics.lineTo(x + 5, y + 4);
        this.blocksGraphics.quadraticCurveTo(x + 4, y + 2, x + 7, y + 2);
        this.blocksGraphics.lineTo(x + size - 5, y + 2);

        // 3D árnyék (jobb-alsó)
        this.blocksGraphics.lineStyle(1.5, 0x000000, 0.25);
        this.blocksGraphics.moveTo(x + size - 2, y + 5);
        this.blocksGraphics.lineTo(x + size - 2, y + size - 5);
        this.blocksGraphics.quadraticCurveTo(
          x + size - 2,
          y + size - 2,
          x + size - 5,
          y + size - 2
        );
        this.blocksGraphics.lineTo(x + 5, y + size - 2);

        // Keret / kijelölés
        if (isHighlighted) {
          this.blocksGraphics.lineStyle(2.5, 0xffffff, 1);
          this.blocksGraphics.drawRoundedRect(x, y, size, size, 7);
        } else {
          this.blocksGraphics.lineStyle(1, 0x000000, 0.2);
          this.blocksGraphics.drawRoundedRect(x, y, size, size, 7);
        }

        if (style.label) {
          const lblObj = this.getLabelText(activeLabelCount++, style.label);
          const yOffset =
            style.label === '2×' ||
            style.label === 'TNT' ||
            style.label === '+5s'
              ? 1
              : 0;
          lblObj.position.set(x + size / 2, y + size / 2 + yOffset);
          lblObj.scale.set(elem.scale || 1);
        }
      }
    }

    for (let k = activeLabelCount; k < this.labelPool.length; k++) {
      this.labelPool[k].visible = false;
    }

    // 4. Lökéshullámok (shockwaves) és Részecskék (particles)
    this.fxGraphics.clear();

    for (let i = 0; i < shockwaves.length; i++) {
      const sw = shockwaves[i];
      const alpha = Math.max(0, Math.min(1, sw.alpha));
      if (alpha <= 0) continue;
      this.fxGraphics.lineStyle(4, hexToNumber(sw.color), alpha);
      this.fxGraphics.drawCircle(sw.x, sw.y, sw.radius);
    }

    this.fxGraphics.lineStyle(0);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const alpha = Math.max(0, Math.min(1, p.alpha));
      if (alpha <= 0) continue;
      this.fxGraphics.beginFill(hexToNumber(p.color), alpha);
      this.fxGraphics.drawCircle(p.x, p.y, p.size);
      this.fxGraphics.endFill();
    }

    // 5. Lebegő Hover Preview kapszula (tűéles, kontrasztos, pixel-pontos)
    if (hoverCell && hoverPreviewText && hoverHighlightSet.size > 0) {
      this.hoverContainer.visible = true;
      const hx = Math.round(
        Math.min(
          this.logicalSize - 44,
          Math.max(44, hoverCell.x * this.negyzetMeret + this.negyzetMeret / 2)
        )
      );
      const hy = Math.round(Math.max(22, hoverCell.y * this.negyzetMeret - 7));

      if (this.hoverText.text !== hoverPreviewText) {
        this.hoverText.text = hoverPreviewText;
      }
      this.hoverText.position.set(hx, hy);
      const textWidth = Math.ceil(this.hoverText.width + 18);
      const boxX = Math.round(hx - textWidth / 2);
      const boxY = Math.round(hy - 11);

      this.hoverBg.clear();
      // Kontrasztos árnyék a kapszula mögött, hogy a színes blokkok felett is kristálytisztán kiugorjon
      this.hoverBg.beginFill(0x000000, 0.45);
      this.hoverBg.drawRoundedRect(boxX, boxY + 1.5, textWidth, 23, 6);
      this.hoverBg.endFill();

      // Kapszula háttere és finom világos kerete
      this.hoverBg.lineStyle(1.5, 0xffffff, 0.28);
      this.hoverBg.beginFill(0x131722, 0.98);
      this.hoverBg.drawRoundedRect(boxX, boxY, textWidth, 23, 6);
      this.hoverBg.endFill();
    } else {
      this.hoverContainer.visible = false;
    }

    // 6. Lebegő pontszám / power-up feliratok (floatingTexts)
    let activeFtCount = 0;
    for (let i = 0; i < floatingTexts.length; i++) {
      const ft = floatingTexts[i];
      const alpha = Math.max(0, Math.min(1, ft.alpha));
      if (alpha <= 0) continue;
      const ftObj = this.getFloatingTextObj(activeFtCount++, ft.text, ft.color);
      ftObj.position.set(ft.x, ft.y);
      ftObj.alpha = alpha;
    }
    for (let k = activeFtCount; k < this.floatingTextPool.length; k++) {
      this.floatingTextPool[k].visible = false;
    }

    this.app.renderer.render(this.app.stage);
    return true;
  }
}
