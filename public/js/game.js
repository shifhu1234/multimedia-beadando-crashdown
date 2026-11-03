/* ================================================================
   CRASHDOWN ARCADE - GAME ENGINE, CANVAS & CORE MECHANICS
   ================================================================ */

const canvas = document.getElementById('crashdownCanvas');
const ctx = canvas.getContext('2d');

let grid = [];
let pontSzam = 0;
let displayedScore = 0;
let szinek = [];
let kattOffset = false;
let jatekFut = false;
let vegeAJateknak = false;
let remainingTime = 60;
let MAX_TIME = 60;
let timerInterval = null;
let pendingRowTimeout = null;

// Pontduplázó (5 mp Frenzy) állapot
let isDoublePointsActive = false;
let doublePointsRemainingTime = 0;
let doublePointsInterval = null;
const FRENZY_MAX_TIME = 5;

// Időfagyasztó (4 mp) állapot
let isFrozen = false;
let freezeRemainingTime = 0;
let freezeInterval = null;

// Kombó-szorzó állapot
let comboStreak = 0;
let comboMultiplier = 1;
let comboResetTimeout = null;

// Vizuális effektek tárolói
let particles = [];
let floatingTexts = [];
let shockwaves = [];
let hoverCell = null;
let hoverHighlightSet = new Set();
let hoverPreviewText = '';
let screenShake = 0;
let lastFrameTime = performance.now();

// Pálya újrakeverés állapotok
let isShufflingBoard = false;
const SHUFFLE_COOLDOWN_SEC = 10;
let shuffleCooldownRemaining = 0;
let shuffleCooldownInterval = null;
let palyaUjratoltesFolyamatban = false;

// HiDPI éles vászon inicializálás
function setupHiDPICanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = LOGICAL_SIZE * dpr;
    canvas.height = LOGICAL_SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
setupHiDPICanvas();
window.addEventListener('resize', setupHiDPICanvas);

function createCell(color, offsetY = 0) {
    return {
        color,
        marked: false,
        offsetY,
        velY: 0,
        scale: 1
    };
}

function getSzinek(mennyit) {
    const count = Math.max(2, Math.min(negyzetSzinek.length, parseInt(mennyit, 10) || 3));
    szinek = negyzetSzinek.slice(0, count);
}

// ==================== POWER-UP AKTIVÁLÓK ====================
function aktivaldPontduplazot(seconds = 5) {
    isDoublePointsActive = true;
    doublePointsRemainingTime = seconds;
    regisztraljPowerupHasznalatot();

    const banner = document.getElementById('doublePointsBanner');
    const badge = document.getElementById('frenzyTimerBadge');
    const wrapper = document.getElementById('canvasWrapper');

    if (banner) banner.classList.remove('hidden');
    if (wrapper) wrapper.classList.add('frenzy-active');
    if (badge) badge.textContent = `${doublePointsRemainingTime.toFixed(1)}s`;

    playSound(doublerKatt);
    triggerHaptic('heavy');
    checkAchievement('frenzy_master');

    if (doublePointsInterval) clearInterval(doublePointsInterval);
    doublePointsInterval = setInterval(() => {
        doublePointsRemainingTime = Math.max(0, doublePointsRemainingTime - 0.1);
        if (badge) badge.textContent = `${doublePointsRemainingTime.toFixed(1)}s`;

        if (doublePointsRemainingTime <= 0 || !jatekFut || vegeAJateknak) {
            deaktivaldPontduplazot();
        }
    }, 100);
}

function deaktivaldPontduplazot() {
    isDoublePointsActive = false;
    doublePointsRemainingTime = 0;
    if (doublePointsInterval) {
        clearInterval(doublePointsInterval);
        doublePointsInterval = null;
    }
    const banner = document.getElementById('doublePointsBanner');
    const wrapper = document.getElementById('canvasWrapper');
    if (banner) banner.classList.add('hidden');
    if (wrapper) wrapper.classList.remove('frenzy-active');
}

function aktivaldFagyasztast(seconds = 4) {
    isFrozen = true;
    freezeRemainingTime = seconds;
    regisztraljPowerupHasznalatot();

    const overlay = document.getElementById('freezeOverlay');
    const badge = document.getElementById('freezeTimerBadge');
    const wrapper = document.getElementById('canvasWrapper');

    if (overlay) overlay.classList.remove('hidden');
    if (wrapper) wrapper.classList.add('freeze-active');
    if (badge) badge.textContent = `${freezeRemainingTime.toFixed(1)}s`;

    playSound(timeEffekt);
    triggerHaptic('heavy');
    checkAchievement('freeze_time');

    if (freezeInterval) clearInterval(freezeInterval);
    freezeInterval = setInterval(() => {
        freezeRemainingTime = Math.max(0, freezeRemainingTime - 0.1);
        if (badge) badge.textContent = `${freezeRemainingTime.toFixed(1)}s`;

        if (freezeRemainingTime <= 0 || !jatekFut || vegeAJateknak) {
            deaktivaldFagyasztast();
        }
    }, 100);
}

function deaktivaldFagyasztast() {
    isFrozen = false;
    freezeRemainingTime = 0;
    if (freezeInterval) {
        clearInterval(freezeInterval);
        freezeInterval = null;
    }
    const overlay = document.getElementById('freezeOverlay');
    const wrapper = document.getElementById('canvasWrapper');
    if (overlay) overlay.classList.add('hidden');
    if (wrapper) wrapper.classList.remove('freeze-active');
}

function pluszIdoPowerUp() {
    regisztraljPowerupHasznalatot();
    remainingTime += 5;
    refreshTimerText();
}

function magnesPowerUp() {
    regisztraljPowerupHasznalatot();
    playSound(doublerKatt);
    triggerHaptic('heavy');
    screenShake = 5;

    const colorCounts = {};
    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            const c = grid[i]?.[j]?.color;
            if (c && c !== 'white' && negyzetSzinek.includes(c)) {
                colorCounts[c] = (colorCounts[c] || 0) + 1;
            }
        }
    }

    let maxColor = null;
    let maxCount = 0;
    for (const [c, cnt] of Object.entries(colorCounts)) {
        if (cnt > maxCount) {
            maxCount = cnt;
            maxColor = c;
        }
    }

    if (!maxColor) return;

    const nonTargetBlocks = [];
    let targetCount = 0;

    for (let j = 0; j < oszlopok; j++) {
        for (let i = 0; i < sorok; i++) {
            const cell = grid[i]?.[j];
            if (!cell || cell.color === 'white') continue;
            if (cell.color === maxColor) {
                targetCount++;
                spawnCellParticles(j, i, maxColor, 3);
            } else {
                nonTargetBlocks.push(cell.color);
            }
        }
    }

    let placedTarget = 0;
    for (let i = sorok - 1; i >= 0; i--) {
        for (let j = 0; j < oszlopok; j++) {
            if (placedTarget < targetCount) {
                grid[i][j].color = maxColor;
                grid[i][j].scale = 1.25;
                placedTarget++;
            } else if (nonTargetBlocks.length > 0) {
                grid[i][j].color = nonTargetBlocks.pop();
            } else {
                grid[i][j].color = 'white';
            }
        }
    }

    gridUjraRendezes();
    checkAchievement('magnet_pull');

    shockwaves.push({
        x: LOGICAL_SIZE / 2,
        y: LOGICAL_SIZE / 2,
        radius: 15,
        maxRadius: LOGICAL_SIZE * 0.8,
        color: '#ef4444',
        alpha: 1
    });

    spawnFloatingText(LOGICAL_SIZE / 2, LOGICAL_SIZE / 2, '🧲 MÁGNES VONZÁS!', '#f87171');
    setComboStatus(`🧲 Szuper Mágnes: ${targetCount} db blokk egy tömbbe rántva!`, true);
}

function regisztraljKomboLepest() {
    comboStreak++;
    comboMultiplier = Math.min(5, 1 + Math.floor(comboStreak / 2));

    if (comboMultiplier >= 2) checkAchievement('combo_x2');
    if (comboMultiplier >= 3) checkAchievement('combo_x3');
    if (comboMultiplier >= 4) checkAchievement('combo_x4');
    if (comboMultiplier >= 5) checkAchievement('combo_x5');

    if (comboResetTimeout) clearTimeout(comboResetTimeout);
    comboResetTimeout = setTimeout(() => {
        comboStreak = 0;
        comboMultiplier = 1;
        updateComboUI();
    }, 2800);

    updateComboUI();
    return comboMultiplier;
}

function updateComboUI() {
    const pill = document.getElementById('comboIndicator');
    if (!pill) return;

    pill.classList.remove('combo-x2', 'combo-x3', 'combo-x4', 'combo-x5');

    if (comboMultiplier > 1) {
        pill.classList.add(`combo-x${comboMultiplier}`);
        pill.textContent = `🔥 KOMBÓ ×${comboMultiplier}!`;
    }
}

function szamolMaradtBlokk() {
    let count = 0;
    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            if (grid[i]?.[j] && grid[i][j].color !== 'white') {
                count++;
            }
        }
    }
    return count;
}

function vanMegLepes() {
    if (!jatekFut || vegeAJateknak) return false;

    const powerUpColors = new Set(['cyan', 'pink', '#f97316', 'darkgreen', '#14b8a6', '#6366f1', '#581845', '#0284c7', '#e11d48']);
    let blockCount = 0;

    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            const cell = grid[i]?.[j];
            if (!cell || cell.color === 'white') continue;
            blockCount++;
            if (powerUpColors.has(cell.color)) {
                return true;
            }
        }
    }

    if (blockCount < 3) return false;

    const visited = new Set();
    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            const key = `${j}:${i}`;
            if (visited.has(key)) continue;

            const col = grid[i]?.[j]?.color;
            if (!col || col === 'white') continue;

            const group = getTorlendoNegyzetek(j, i, col);
            for (let g = 0; g < group.length; g++) {
                visited.add(`${group[g].x}:${group[g].y}`);
            }

            if (group.length >= 3) {
                return true;
            }
        }
    }

    return false;
}

function valasszVeletlenPowerUpok(db = 4) {
    const modeSelect = document.getElementById('modeSelect');
    const mode = modeSelect ? modeSelect.value : 'normal';

    // 1. Nyers mód: egyetlen power-up sem jelenik meg
    if (mode === 'no_powerups') {
        return [];
    }

    // 2. Káosz mód: 8-10 db power-up a táblán (freeze és +5s csak picivel gyakoribb)
    if (mode === 'chaos') {
        const chaosPows = ['cyan', 'pink', '#f97316', 'darkgreen', '#14b8a6', '#6366f1', '#e11d48', '#f97316', 'darkgreen', 'cyan'];
        if (Math.random() < 0.4) chaosPows.push('#0284c7'); // Időfagyasztó picivel gyakoribb
        if (Math.random() < 0.4) chaosPows.push('#581845'); // +5 mp időbónusz picivel gyakoribb
        const shuffled = [...chaosPows].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 9);
    }

    // 3. Időhajsza mód: +5s extra idő és 2× Duplázó fókusz
    if (mode === 'time_rush') {
        const timePows = ['#581845', '#581845', 'cyan', 'cyan', '#0284c7', '#6366f1', '#f97316'];
        return timePows.sort(() => 0.5 - Math.random()).slice(0, 6);
    }

    // 4. Robbanás Mánia: TNT, Színbomba és Szuper Mágnes túlsúly
    if (mode === 'bomb_frenzy') {
        const bombPows = ['darkgreen', 'darkgreen', 'darkgreen', '#14b8a6', '#14b8a6', '#e11d48', '#e11d48', '#f97316'];
        return bombPows.sort(() => 0.5 - Math.random()).slice(0, 8);
    }

    // 5. Normál mód (Klasszikus kiegyensúlyozott)
    const basePows = ['cyan', 'pink', '#f97316', 'darkgreen', '#14b8a6', '#6366f1', '#0284c7', '#e11d48'];
    const shuffled = [...basePows].sort(() => 0.5 - Math.random());
    if (Math.random() < 0.3) {
        shuffled[Math.floor(Math.random() * shuffled.length)] = '#581845';
    }
    return shuffled.slice(0, db);
}

function ujPalyaLedobas() {
    if (!jatekFut || vegeAJateknak) return;
    const szinSelect = document.getElementById('colorSelect');
    getSzinek(szinSelect ? szinSelect.value : '3');

    for (let i = 0; i < sorok; i++) {
        grid[i] = [];
        for (let j = 0; j < oszlopok; j++) {
            const rc = szinek[Math.floor(Math.random() * szinek.length)];
            grid[i][j] = createCell(rc, -(sorok - i) * 16 - (j % 2) * 8);
        }
    }

    const usedPositions = new Set();
    function placePowerUp(colorKey) {
        let px, py;
        do {
            px = Math.floor(Math.random() * oszlopok);
            py = Math.floor(Math.random() * sorok);
        } while (usedPositions.has(`${px}:${py}`));
        usedPositions.add(`${px}:${py}`);
        grid[py][px].color = colorKey;
    }

    const shuffledPows = valasszVeletlenPowerUpok(4);
    shuffledPows.forEach(pow => placePowerUp(pow));

    updateHoverPreview();
}

function ellenorizdPalyaAllapot() {
    if (!jatekFut || vegeAJateknak || palyaUjratoltesFolyamatban) return;

    const maradt = szamolMaradtBlokk();

    if (maradt === 0) {
        palyaUjratoltesFolyamatban = true;
        pontSzam += 500;
        updateScoreUI();
        playSound(doublerKatt);
        triggerHaptic('success');
        checkAchievement('perfect_clear');

        shockwaves.push({
            x: LOGICAL_SIZE / 2,
            y: LOGICAL_SIZE / 2,
            radius: 10,
            maxRadius: LOGICAL_SIZE * 0.8,
            color: '#10b981',
            alpha: 1
        });
        spawnFloatingText(LOGICAL_SIZE / 2, LOGICAL_SIZE / 2, 'PÁLYA KITISZTÍTVA! +500', '#10b981');
        setComboStatus('🌟 TÖKÉLETES! Teljes pálya letakarítva! (+500p)', true);

        setTimeout(() => {
            ujPalyaLedobas();
            palyaUjratoltesFolyamatban = false;
        }, 500);
        return;
    }

    if (!vanMegLepes()) {
        palyaUjratoltesFolyamatban = true;
        let bonusz = 50;
        let bonuszSzoveg = '';

        if (maradt <= 3) {
            bonusz = 350;
            bonuszSzoveg = `✨ Szinte tiszta pálya (${maradt} blokk)! +${bonusz}p`;
        } else if (maradt <= 8) {
            bonusz = 200;
            bonuszSzoveg = `🧹 Takarítási bónusz (${maradt} blokk)! +${bonusz}p`;
        } else {
            bonusz = 50;
            bonuszSzoveg = `🔄 Nincs több lépés (${maradt} blokk)! +${bonusz}p`;
        }

        pontSzam += bonusz;
        updateScoreUI();
        playSound(doublerKatt);

        shockwaves.push({
            x: LOGICAL_SIZE / 2,
            y: LOGICAL_SIZE / 2,
            radius: 10,
            maxRadius: LOGICAL_SIZE * 0.7,
            color: '#6366f1',
            alpha: 1
        });

        spawnFloatingText(LOGICAL_SIZE / 2, LOGICAL_SIZE / 2, `+${bonusz} BÓNUSZ!`, '#818cf8');
        setComboStatus(bonuszSzoveg, true);

        for (let i = 0; i < sorok; i++) {
            for (let j = 0; j < oszlopok; j++) {
                if (grid[i]?.[j] && grid[i][j].color !== 'white') {
                    spawnCellParticles(j, i, grid[i][j].color, 5);
                    grid[i][j].color = 'white';
                    grid[i][j].marked = true;
                }
            }
        }

        setTimeout(() => {
            ujPalyaLedobas();
            palyaUjratoltesFolyamatban = false;
        }, 600);
    }
}

function spawnCellParticles(col, row, color, count = 7) {
    const cx = col * negyzetMeret + negyzetMeret / 2;
    const cy = row * negyzetMeret + negyzetMeret / 2;
    const style = COLOR_STYLES[color];
    const baseColor = style ? style.top : (color === 'white' ? '#94a3b8' : color);

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 190;
        particles.push({
            x: cx + (Math.random() - 0.5) * 16,
            y: cy + (Math.random() - 0.5) * 16,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 50,
            size: 4 + Math.random() * 5,
            color: baseColor,
            alpha: 1,
            life: 0.45 + Math.random() * 0.25
        });
    }
}

function spawnFloatingText(col, row, text, color = '#ffffff') {
    const x = Math.min(LOGICAL_SIZE - 55, Math.max(55, col * negyzetMeret + negyzetMeret / 2));
    const y = Math.max(30, row * negyzetMeret + negyzetMeret / 2);
    floatingTexts.push({
        x,
        y,
        text,
        color,
        alpha: 1,
        vy: -55,
        life: 0.85
    });
}

function handleClick(event) {
    if (!jatekFut || vegeAJateknak || kattOffset) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = LOGICAL_SIZE / rect.width;
    const scaleY = LOGICAL_SIZE / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX / negyzetMeret);
    const y = Math.floor((event.clientY - rect.top) * scaleY / negyzetMeret);

    if (x < 0 || x >= oszlopok || y < 0 || y >= sorok) return;

    const targetColor = grid[y][x].color;
    if (targetColor === 'white') return;

    if (hatterZene.paused && !toggledVOlume && masterVolume > 0) {
        const p = hatterZene.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    }

    if (targetColor === 'cyan') {
        spawnCellParticles(x, y, 'cyan', 16);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        gridUjraRendezes();
        aktivaldPontduplazot(5);
        spawnFloatingText(x, y, '2× FRENZY (5 mp)!', '#38bdf8');
        setComboStatus('⚡ 2× Pontduplázó: következő 5 mp-ben minden pontod duplázódik!', true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === 'pink') {
        regisztraljPowerupHasznalatot();
        playSound(sorEffekt);
        for (let j = 0; j < oszlopok; j++) {
            if (grid[y][j].color !== 'white') {
                spawnCellParticles(j, y, grid[y][j].color, 5);
            }
            grid[y][j].color = 'white';
            grid[y][j].marked = true;
        }
        shockwaves.push({
            x: LOGICAL_SIZE / 2,
            y: y * negyzetMeret + negyzetMeret / 2,
            radius: 10,
            maxRadius: LOGICAL_SIZE * 0.7,
            color: '#f472b6',
            alpha: 0.9
        });
        const gained = 100 * (isDoublePointsActive ? 2 : 1);
        pontSzam += gained;
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, isDoublePointsActive ? `⇄ CUNAMI +${gained} (2×)` : `⇄ CUNAMI +${gained}`, '#f472b6');
        setComboStatus(`⇄ Teljes sor eltakarítva! (+${gained}p)`, true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#f97316') {
        regisztraljPowerupHasznalatot();
        playSound(sorEffekt);
        for (let i = 0; i < sorok; i++) {
            if (grid[i][x].color !== 'white') {
                spawnCellParticles(x, i, grid[i][x].color, 5);
            }
            grid[i][x].color = 'white';
            grid[i][x].marked = true;
        }
        shockwaves.push({
            x: x * negyzetMeret + negyzetMeret / 2,
            y: LOGICAL_SIZE / 2,
            radius: 10,
            maxRadius: LOGICAL_SIZE * 0.7,
            color: '#f97316',
            alpha: 0.95
        });
        const gained = 100 * (isDoublePointsActive ? 2 : 1);
        pontSzam += gained;
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, isDoublePointsActive ? `⇅ OSZLOP +${gained} (2×)` : `⇅ OSZLOP +${gained}`, '#f97316');
        setComboStatus(`⇅ Teljes oszlop kilőve! (+${gained}p)`, true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === 'darkgreen') {
        regisztraljPowerupHasznalatot();
        playSound(tntKatt);
        triggerHaptic('heavy');
        checkAchievement('tnt_boom');
        robbantasPowerUp(x, y);
        screenShake = 8;
        shockwaves.push({
            x: x * negyzetMeret + negyzetMeret / 2,
            y: y * negyzetMeret + negyzetMeret / 2,
            radius: 8,
            maxRadius: negyzetMeret * 2.5,
            color: '#4ade80',
            alpha: 0.95
        });
        const gained = 90 * (isDoublePointsActive ? 2 : 1);
        pontSzam += gained;
        updateScoreUI();
        spawnFloatingText(x, y, isDoublePointsActive ? `TNT BUMM +${gained} (2×)` : `TNT BUMM +${gained}`, '#4ade80');
        setComboStatus(`💥 3×3-as TNT robbanás! (+${gained}p)`, true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#14b8a6') {
        regisztraljPowerupHasznalatot();
        playSound(tntKatt);
        triggerHaptic('medium');
        const activeColors = [];
        for (let i = 0; i < sorok; i++) {
            for (let j = 0; j < oszlopok; j++) {
                const col = grid[i][j].color;
                if (col !== 'white' && negyzetSzinek.includes(col)) {
                    activeColors.push(col);
                }
            }
        }
        const wipedColor = activeColors.length > 0 ? activeColors[Math.floor(Math.random() * activeColors.length)] : null;
        let wipedCount = 0;
        if (wipedColor) {
            for (let i = 0; i < sorok; i++) {
                for (let j = 0; j < oszlopok; j++) {
                    if (grid[i][j].color === wipedColor) {
                        spawnCellParticles(j, i, wipedColor, 6);
                        grid[i][j].color = 'white';
                        grid[i][j].marked = true;
                        wipedCount++;
                    }
                }
            }
        }
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        screenShake = 6;
        shockwaves.push({
            x: x * negyzetMeret + negyzetMeret / 2,
            y: y * negyzetMeret + negyzetMeret / 2,
            radius: 12,
            maxRadius: LOGICAL_SIZE * 0.6,
            color: '#14b8a6',
            alpha: 0.95
        });
        const baseEarned = Math.max(50, wipedCount * 15);
        const earned = baseEarned * (isDoublePointsActive ? 2 : 1);
        pontSzam += earned;
        checkAchievement('color_bomb');
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, isDoublePointsActive ? `✦ BOMB +${earned} (2×)` : `✦ BOMB +${earned}`, '#14b8a6');
        setComboStatus(`✦ Szín-bomba: ${wipedCount} blokk megsemmisítve! (+${earned}p)`, true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#6366f1') {
        regisztraljPowerupHasznalatot();
        playSound(doublerKatt);
        triggerHaptic('medium');
        const positions = [];
        const colors = [];
        for (let i = 0; i < sorok; i++) {
            for (let j = 0; j < oszlopok; j++) {
                const col = grid[i][j].color;
                if (col !== 'white' && negyzetSzinek.includes(col)) {
                    positions.push({ x: j, y: i });
                    colors.push(col);
                }
            }
        }
        for (let k = colors.length - 1; k > 0; k--) {
            const r = Math.floor(Math.random() * (k + 1));
            [colors[k], colors[r]] = [colors[r], colors[k]];
        }
        positions.forEach((pos, idx) => {
            grid[pos.y][pos.x].color = colors[idx];
            spawnCellParticles(pos.x, pos.y, colors[idx], 2);
        });
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        shockwaves.push({
            x: x * negyzetMeret + negyzetMeret / 2,
            y: y * negyzetMeret + negyzetMeret / 2,
            radius: 10,
            maxRadius: LOGICAL_SIZE * 0.5,
            color: '#818cf8',
            alpha: 0.9
        });
        const gained = 50 * (isDoublePointsActive ? 2 : 1);
        pontSzam += gained;
        checkAchievement('shuffle_master');
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, isDoublePointsActive ? `⟳ KEVERÉS +${gained} (2×)` : `⟳ KEVERÉS +${gained}`, '#818cf8');
        setComboStatus(`⟳ Pálya újrakeverve! (+${gained}p)`, true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#581845') {
        spawnCellParticles(x, y, '#581845', 14);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        playSound(timeEffekt);
        triggerHaptic('medium');
        gridUjraRendezes();
        pluszIdoPowerUp();
        checkAchievement('time_bonus');
        spawnFloatingText(x, y, '+5 MP!', '#c084fc');
        setComboStatus('⌛ +5 másodperc extra idő!', true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#0284c7') {
        spawnCellParticles(x, y, '#0284c7', 16);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        gridUjraRendezes();
        aktivaldFagyasztast(4);
        spawnFloatingText(x, y, '❄ IDŐ MEGÁLLÍTVA!', '#7dd3fc');
        setComboStatus('❄ Időfagyasztó: 4 másodpercig nem telik az idő!', true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#e11d48') {
        spawnCellParticles(x, y, '#e11d48', 16);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        magnesPowerUp();
        ellenorizdPalyaAllapot();
    } else {
        const torlendoNegyzetek = getTorlendoNegyzetek(x, y, targetColor);
        if (torlendoNegyzetek.length >= 3) {
            playSound(sikeresKatt);
            triggerHaptic('light');
            checkAchievement('first_match');
            if (torlendoNegyzetek.length >= 8) checkAchievement('mega_clear');
            if (torlendoNegyzetek.length >= 12) checkAchievement('hyper_clear');

            recentSuccessfulClicks.push(Date.now());
            recentSuccessfulClicks = recentSuccessfulClicks.filter(t => Date.now() - t <= 10000);
            if (recentSuccessfulClicks.length >= 8) checkAchievement('speed_demon');
            const mult = regisztraljKomboLepest();

            for (let i = 0; i < torlendoNegyzetek.length; i++) {
                const cellPos = torlendoNegyzetek[i];
                spawnCellParticles(cellPos.x, cellPos.y, targetColor, 5);
                grid[cellPos.y][cellPos.x].marked = true;
            }

            const frenzyMultiplier = isDoublePointsActive ? 2 : 1;
            const baseGained = torlendoNegyzetek.length * 10;
            const gained = baseGained * frenzyMultiplier * mult;
            pontSzam += gained;
            updateScoreUI();
            gridUjraRendezes();

            const style = COLOR_STYLES[targetColor];
            const textCol = isDoublePointsActive ? '#38bdf8' : (style ? style.top : '#fff');
            let comboSuffix = '';
            if (frenzyMultiplier > 1 && mult > 1) {
                comboSuffix = ` (2× • ×${mult})`;
            } else if (frenzyMultiplier > 1) {
                comboSuffix = ' (2×)';
            } else if (mult > 1) {
                comboSuffix = ` (×${mult})`;
            }

            spawnFloatingText(x, y, `+${gained}${comboSuffix}`, textCol);
            if (torlendoNegyzetek.length >= 7) {
                setComboStatus(`🔥 Óriási kombó! ${torlendoNegyzetek.length} blokk (+${gained}p)`, true);
            } else {
                setComboStatus(`${torlendoNegyzetek.length} blokk törölve (+${gained}p)`, false);
            }
            ellenorizdPalyaAllapot();
        } else {
            grid[y][x].scale = 0.86;
            setComboStatus('Legalább 3 azonos színű blokk kell!', false);
        }
    }

    updateHoverPreview();
}

function robbantasPowerUp(x, y) {
    const startX = Math.max(0, x - 1);
    const endX = Math.min(oszlopok - 1, x + 1);
    const startY = Math.max(0, y - 1);
    const endY = Math.min(sorok - 1, y + 1);

    for (let i = startY; i <= endY; i++) {
        for (let j = startX; j <= endX; j++) {
            if (grid[i][j].color !== 'white') {
                spawnCellParticles(j, i, grid[i][j].color, 6);
            }
            grid[i][j].color = 'white';
            grid[i][j].marked = true;
        }
    }
    gridUjraRendezes();
}

function getTorlendoNegyzetek(x, y, color) {
    const talaltNegyzetekTomb = [];
    const talaltNegyzetek = new Set();
    const sor = [{ x, y }];

    while (sor.length > 0) {
        const curr = sor.shift();
        const cx = curr.x;
        const cy = curr.y;

        if (
            cx < 0 || cx >= oszlopok ||
            cy < 0 || cy >= sorok ||
            grid[cy][cx].color !== color ||
            talaltNegyzetek.has(`${cx}:${cy}`)
        ) {
            continue;
        }

        talaltNegyzetek.add(`${cx}:${cy}`);
        talaltNegyzetekTomb.push({ x: cx, y: cy });

        sor.push({ x: cx - 1, y: cy });
        sor.push({ x: cx + 1, y: cy });
        sor.push({ x: cx, y: cy - 1 });
        sor.push({ x: cx, y: cy + 1 });
    }
    return talaltNegyzetekTomb;
}

function gridUjraRendezes() {
    for (let j = 0; j < oszlopok; j++) {
        for (let i = sorok - 1; i >= 0; i--) {
            if (grid[i][j].marked) {
                grid[i][j].color = 'white';
                grid[i][j].marked = false;
                grid[i][j].offsetY = 0;
                grid[i][j].velY = 0;
            }
        }

        let writeRow = sorok - 1;
        for (let readRow = sorok - 1; readRow >= 0; readRow--) {
            if (grid[readRow][j].color !== 'white') {
                if (writeRow !== readRow) {
                    const fallDistancePx = (writeRow - readRow) * negyzetMeret;
                    const prevOffset = grid[readRow][j].offsetY || 0;
                    grid[writeRow][j] = {
                        color: grid[readRow][j].color,
                        marked: false,
                        offsetY: prevOffset - fallDistancePx,
                        velY: grid[readRow][j].velY || 0,
                        scale: 1
                    };
                    grid[readRow][j] = createCell('white', 0);
                }
                writeRow--;
            }
        }
    }
}

function updateHoverPreview() {
    hoverHighlightSet.clear();
    hoverPreviewText = '';

    if (!jatekFut || vegeAJateknak || !hoverCell) return;
    const { x, y } = hoverCell;
    if (x < 0 || x >= oszlopok || y < 0 || y >= sorok || !grid[y] || !grid[y][x]) return;

    const c = grid[y][x].color;
    if (c === 'white') return;

    if (c === 'cyan') {
        hoverHighlightSet.add(`${x}:${y}`);
        hoverPreviewText = '2× Duplázó';
    } else if (c === 'pink') {
        for (let j = 0; j < oszlopok; j++) hoverHighlightSet.add(`${j}:${y}`);
        hoverPreviewText = 'Sor törlés (+100)';
    } else if (c === '#f97316') {
        for (let i = 0; i < sorok; i++) hoverHighlightSet.add(`${x}:${i}`);
        hoverPreviewText = 'Oszlop törlés (+100)';
    } else if (c === 'darkgreen') {
        for (let i = Math.max(0, y - 1); i <= Math.min(sorok - 1, y + 1); i++) {
            for (let j = Math.max(0, x - 1); j <= Math.min(oszlopok - 1, x + 1); j++) {
                hoverHighlightSet.add(`${j}:${i}`);
            }
        }
        hoverPreviewText = 'TNT robbanás (+90)';
    } else if (c === '#14b8a6') {
        hoverHighlightSet.add(`${x}:${y}`);
        hoverPreviewText = 'Szín-bomba (teljes szín)';
    } else if (c === '#6366f1') {
        hoverHighlightSet.add(`${x}:${y}`);
        hoverPreviewText = 'Pálya keverés (+50)';
    } else if (c === '#581845') {
        hoverHighlightSet.add(`${x}:${y}`);
        hoverPreviewText = '+5 mp extra idő';
    } else if (c === '#0284c7') {
        hoverHighlightSet.add(`${x}:${y}`);
        hoverPreviewText = 'Időfagyasztó (4 mp)';
    } else if (c === '#e11d48') {
        hoverHighlightSet.add(`${x}:${y}`);
        hoverPreviewText = 'Szuper Mágnes (szín vonzás)';
    } else {
        const group = getTorlendoNegyzetek(x, y, c);
        if (group.length >= 3) {
            group.forEach(pos => hoverHighlightSet.add(`${pos.x}:${pos.y}`));
            hoverPreviewText = `+${group.length * 10} pont`;
        }
    }
}

function drawRoundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function drawGrid() {
    ctx.save();

    if (screenShake > 0.2) {
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
    }

    let bgFill = '#0d1017';
    let slotFill = '#151a24';
    if (isDoublePointsActive) {
        bgFill = '#071d2e';
        slotFill = '#0c3554';
    } else if (isFrozen) {
        bgFill = '#062033';
        slotFill = '#0c3d5c';
    }

    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);

    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            const gx = j * negyzetMeret + 3;
            const gy = i * negyzetMeret + 3;
            const gw = negyzetMeret - 6;
            ctx.fillStyle = slotFill;
            drawRoundedRect(gx, gy, gw, gw, 6);
            ctx.fill();
        }
    }

    for (let i = 0; i < sorok; i++) {
        if (!grid[i]) continue;
        for (let j = 0; j < oszlopok; j++) {
            const elem = grid[i][j];
            if (!elem || elem.color === 'white') continue;

            const isHighlighted = hoverHighlightSet.has(`${j}:${i}`);
            const pad = isHighlighted ? 2 : 3.5;
            const size = (negyzetMeret - pad * 2) * (elem.scale || 1);
            const x = j * negyzetMeret + (negyzetMeret - size) / 2;
            const y = i * negyzetMeret + (negyzetMeret - size) / 2 + (elem.offsetY || 0);

            const style = COLOR_STYLES[elem.color] || {
                top: elem.color,
                bottom: elem.color,
                border: '#ffffff'
            };

            ctx.save();

            const grad = ctx.createLinearGradient(x, y, x, y + size);
            grad.addColorStop(0, style.top);
            grad.addColorStop(1, style.bottom);

            ctx.fillStyle = grad;
            drawRoundedRect(x, y, size, size, 7);
            ctx.fill();

            // 3D élfény
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x + 5, y + size - 3);
            ctx.lineTo(x + 5, y + 4);
            ctx.quadraticCurveTo(x + 4, y + 2, x + 7, y + 2);
            ctx.lineTo(x + size - 5, y + 2);
            ctx.stroke();

            // Árnyék
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x + size - 2, y + 5);
            ctx.lineTo(x + size - 2, y + size - 5);
            ctx.quadraticCurveTo(x + size - 2, y + size - 2, x + size - 5, y + size - 2);
            ctx.lineTo(x + 5, y + size - 2);
            ctx.stroke();

            if (isHighlighted) {
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = '#ffffff';
                drawRoundedRect(x, y, size, size, 7);
                ctx.stroke();
            } else {
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                drawRoundedRect(x, y, size, size, 7);
                ctx.stroke();
            }

            if (style.label) {
                ctx.save();
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetY = 1;

                if (style.label === '2×') {
                    ctx.font = '800 16px "JetBrains Mono", monospace';
                    ctx.fillText('2×', x + size / 2, y + size / 2 + 1);
                } else if (style.label === '⇄') {
                    ctx.font = '800 20px system-ui, sans-serif';
                    ctx.fillText('⇄', x + size / 2, y + size / 2);
                } else if (style.label === '⇅') {
                    ctx.font = '800 20px system-ui, sans-serif';
                    ctx.fillText('⇅', x + size / 2, y + size / 2);
                } else if (style.label === 'TNT') {
                    ctx.font = '900 13px "JetBrains Mono", monospace';
                    ctx.fillText('TNT', x + size / 2, y + size / 2 + 1);
                } else if (style.label === '✦') {
                    ctx.font = '800 19px system-ui, sans-serif';
                    ctx.fillText('✦', x + size / 2, y + size / 2);
                } else if (style.label === '⟳') {
                    ctx.font = '800 20px system-ui, sans-serif';
                    ctx.fillText('⟳', x + size / 2, y + size / 2);
                } else if (style.label === '+5s') {
                    ctx.font = '800 12px "JetBrains Mono", monospace';
                    ctx.fillText('+5s', x + size / 2, y + size / 2 + 1);
                } else if (style.label === '❄') {
                    ctx.font = '800 20px system-ui, sans-serif';
                    ctx.fillText('❄', x + size / 2, y + size / 2);
                } else if (style.label === '🧲') {
                    ctx.font = '800 18px system-ui, sans-serif';
                    ctx.fillText('🧲', x + size / 2, y + size / 2);
                }
                ctx.restore();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < shockwaves.length; i++) {
        const sw = shockwaves[i];
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
    }

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    if (hoverCell && hoverPreviewText && hoverHighlightSet.size > 0) {
        const hx = Math.min(LOGICAL_SIZE - 42, Math.max(42, hoverCell.x * negyzetMeret + negyzetMeret / 2));
        const hy = Math.max(22, hoverCell.y * negyzetMeret - 6);
        ctx.save();
        ctx.font = '700 11px "Outfit", system-ui, sans-serif';
        const textWidth = ctx.measureText(hoverPreviewText).width + 16;
        ctx.fillStyle = '#181d2a';
        drawRoundedRect(hx - textWidth / 2, hy - 11, textWidth, 22, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hoverPreviewText, hx, hy);
        ctx.restore();
    }

    for (let i = 0; i < floatingTexts.length; i++) {
        const ft = floatingTexts[i];
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = '800 16px "Outfit", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
    }

    ctx.restore();
}

function animationLoop(now) {
    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    const isAnyModalOpen = !!document.querySelector('.modal-backdrop:not(.hidden)');
    const isOverlayVisible = !document.getElementById('canvasOverlay')?.classList.contains('hidden');
    const hasActiveFx = (particles && particles.length > 0) || (floatingTexts && floatingTexts.length > 0) || (shockwaves && shockwaves.length > 0) || screenShake > 0.1 || isShufflingBoard;

    if ((isAnyModalOpen || (isOverlayVisible && !jatekFut)) && !hasActiveFx) {
        requestAnimationFrame(animationLoop);
        return;
    }

    if (displayedScore !== pontSzam) {
        const diff = pontSzam - displayedScore;
        const step = Math.ceil(Math.abs(diff) * 0.25);
        displayedScore += Math.sign(diff) * step;
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = displayedScore;
    }

    if (screenShake > 0) {
        screenShake = Math.max(0, screenShake - 35 * dt);
    }

    for (let i = 0; i < sorok; i++) {
        if (!grid[i]) continue;
        for (let j = 0; j < oszlopok; j++) {
            const cell = grid[i][j];
            if (!cell) continue;

            if (cell.offsetY < 0) {
                cell.velY += 3200 * dt;
                cell.offsetY += cell.velY * dt;
                if (cell.offsetY >= 0) {
                    cell.offsetY = 0;
                    cell.velY = 0;
                    cell.scale = 0.93;
                }
            } else if (cell.offsetY > 0) {
                const speed = Math.max(220, cell.offsetY * 14);
                cell.offsetY = Math.max(0, cell.offsetY - speed * dt);
            }

            if (cell.scale !== 1) {
                cell.scale += (1 - cell.scale) * Math.min(1, 16 * dt);
                if (Math.abs(1 - cell.scale) < 0.005) cell.scale = 1;
            }
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 480 * dt;
        p.life -= dt;
        p.alpha = Math.max(0, p.life / 0.5);
        if (p.life <= 0) particles.splice(i, 1);
    }

    for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 10 * dt + 120 * dt;
        sw.alpha -= 2.4 * dt;
        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
            shockwaves.splice(i, 1);
        }
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.life -= dt;
        ft.alpha = Math.min(1, ft.life / 0.45);
        if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

    drawGrid();
    requestAnimationFrame(animationLoop);
}

// ==================== JÁTÉK ÉLETCIKLUS & INDÍTÁS ====================
function initPreviewBoard() {
    getSzinek(document.getElementById('colorSelect')?.value || '3');
    grid = [];
    for (let i = 0; i < sorok; i++) {
        grid[i] = [];
        for (let j = 0; j < oszlopok; j++) {
            const c = szinek[Math.floor(Math.random() * szinek.length)];
            grid[i][j] = createCell(c, 0);
        }
    }
    drawGrid();
}

function jatekInditasa() {
    kattOffset = false;
    jatekFut = true;
    vegeAJateknak = false;
    grid = [];
    pontSzam = 0;
    particles = [];
    floatingTexts = [];
    shockwaves = [];
    updateScoreUI(true);
    setComboStatus('Keresd a 3+ azonos színű blokkot!', false);

    getSzinek(document.getElementById('colorSelect')?.value || '3');

    for (let i = 0; i < sorok; i++) {
        grid[i] = [];
        for (let j = 0; j < oszlopok; j++) {
            const randomColor = szinek[Math.floor(Math.random() * szinek.length)];
            grid[i][j] = createCell(randomColor, -(sorok - i) * 18);
        }
    }

    const usedPositions = new Set();
    function placePowerUp(colorKey) {
        let px, py;
        do {
            px = Math.floor(Math.random() * oszlopok);
            py = Math.floor(Math.random() * sorok);
        } while (usedPositions.has(`${px}:${py}`));
        usedPositions.add(`${px}:${py}`);
        grid[py][px].color = colorKey;
    }

    const shuffledPows = valasszVeletlenPowerUpok(5);
    shuffledPows.forEach(pow => placePowerUp(pow));

    deaktivaldPontduplazot();
    deaktivaldFagyasztast();
    canvas.style.cursor = 'pointer';

    if (shuffleCooldownInterval) {
        clearInterval(shuffleCooldownInterval);
        shuffleCooldownInterval = null;
    }
    shuffleCooldownRemaining = 0;
    updateShuffleButtonUI();

    if (!toggledVOlume && masterVolume > 0) {
        const p = hatterZene.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    }

    drawGrid();
}

function refreshTimerText() {
    const idozito = document.getElementById('timerDisplay');
    const progressBar = document.getElementById('timerProgressBar');
    if (!idozito) return;

    const safeTime = Math.max(0, remainingTime);
    const min = Math.floor(safeTime / 60);
    const sec = safeTime % 60;
    idozito.textContent = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;

    idozito.classList.remove('timer-warning', 'timer-danger');
    if (safeTime <= 10) {
        idozito.classList.add('timer-danger');
    } else if (safeTime <= 20) {
        idozito.classList.add('timer-warning');
    }

    if (progressBar) {
        const pct = Math.max(0, Math.min(100, (safeTime / MAX_TIME) * 100));
        progressBar.style.width = `${pct}%`;
        if (safeTime <= 10) {
            progressBar.style.background = 'linear-gradient(90deg, #e11d48, #fb7185)';
        } else if (safeTime <= 20) {
            progressBar.style.background = 'linear-gradient(90deg, #d97706, #fbbf24)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        }
    }
}

function timer() {
    const lejartAzIdo = document.getElementById('timeUpMessage');
    const szinValaszto = document.getElementById('colorSelect');
    const timeSelectEl = document.getElementById('timeSelect');

    if (szinValaszto) szinValaszto.disabled = true;
    if (timeSelectEl) {
        timeSelectEl.disabled = true;
        MAX_TIME = parseInt(timeSelectEl.value, 10) || 60;
    }
    remainingTime = MAX_TIME;
    refreshTimerText();

    timerInterval = setInterval(function () {
        if (isFrozen) return;

        remainingTime--;
        refreshTimerText();

        if (remainingTime < 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            jatekFut = false;
            vegeAJateknak = true;
            deaktivaldPontduplazot();
            deaktivaldFagyasztast();
            if (shuffleCooldownInterval) {
                clearInterval(shuffleCooldownInterval);
                shuffleCooldownInterval = null;
            }
            updateShuffleButtonUI();
            hoverHighlightSet.clear();
            hoverPreviewText = '';

            canvas.style.cursor = 'not-allowed';
            if (lejartAzIdo) lejartAzIdo.style.display = 'block';

            const currentUser = window.authService?.getCurrentUser();
            const overlay = document.getElementById('canvasOverlay');
            const overlayTitle = document.getElementById('overlayTitle');
            const overlaySubtitle = document.getElementById('overlaySubtitle');
            const overlayBtn = document.getElementById('overlayStartBtn');

            if (overlay) {
                overlay.classList.remove('hidden');
                if (overlayTitle) overlayTitle.textContent = `Végső pontszám: ${pontSzam} p`;

                const overlaySaveBtn = document.getElementById('overlaySaveScoreBtn');
                const modeSelectEl = document.getElementById('modeSelect');
                const modVal = modeSelectEl ? modeSelectEl.value : 'normal';

                if (currentUser) {
                    if (overlaySaveBtn) overlaySaveBtn.style.display = 'none';
                    const colorVal = szinValaszto ? szinValaszto.value : '3';
                    updatePlayerStatsRecord(currentUser.displayName, pontSzam, colorVal, MAX_TIME);

                    toplistaHozzaadas({
                        name: currentUser.displayName,
                        score: pontSzam,
                        color: colorVal,
                        modifier: modVal,
                        duration: MAX_TIME,
                        timestamp: new Date().toISOString()
                    }).then(res => {
                        toplistaMegjelenites();
                        if (res && res.isRecord) {
                            if (overlaySubtitle) {
                                overlaySubtitle.textContent = `Gratulálunk, ${currentUser.displayName}! Új egyéni rekordot értél el ebben a módban (${colorVal} szín, ${GAME_MODIFIERS[modVal]?.name || modVal})!`;
                            }
                            showToast(`🏆 Új személyes rekord rögzítve: ${pontSzam} pont!`, 'success');
                            playSound(sikeresKatt);
                            triggerHaptic('success');
                        } else {
                            if (overlaySubtitle) {
                                overlaySubtitle.textContent = `Szép menet, ${currentUser.displayName}! A jelenlegi rekordod ebben a kategóriában: ${res?.previousBest || 'magasabb'} pont.`;
                            }
                            showToast(`Játék vége! Pontszám: ${pontSzam} p`, 'info');
                        }
                    }).catch(() => {
                        toplistaMegjelenites();
                    });
                } else {
                    const colorVal = szinValaszto ? szinValaszto.value : '3';
                    pendingScore = {
                        score: pontSzam,
                        color: colorVal,
                        modifier: modVal,
                        duration: MAX_TIME,
                        timestamp: new Date().toISOString()
                    };
                    if (overlaySaveBtn) overlaySaveBtn.style.display = 'inline-flex';
                    if (overlaySubtitle) {
                        overlaySubtitle.textContent = `Elért pontszám: ${pontSzam} pont (${GAME_MODIFIERS[modVal]?.name || modVal}). Jelentkezz be vagy regisztrálj az eredmény elmentéséhez!`;
                    }
                    showToast(`Játék vége! Pontszám: ${pontSzam} p`, 'info');
                }

                if (overlayBtn) {
                    overlayBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg><span>Új játék kezdése</span>';
                }
            }

            if (szinValaszto) szinValaszto.disabled = false;
            if (timeSelectEl) timeSelectEl.disabled = false;
            const modeSelectEl = document.getElementById('modeSelect');
            if (modeSelectEl) modeSelectEl.disabled = false;
            const startBtn = document.getElementById('startGameButton');
            if (startBtn) startBtn.disabled = false;

            updateScoreUI(true);
            setComboStatus('Lejárt az idő!', false);
        }
    }, 1000);
}

function startMatch() {
    switchToMobileTab('stagePanel', true);
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (pendingRowTimeout) {
        clearTimeout(pendingRowTimeout);
        pendingRowTimeout = null;
    }

    jatekInditasa();
    timer();

    const startBtn = document.getElementById('startGameButton');
    if (startBtn) startBtn.disabled = true;
    const modeSelectEl = document.getElementById('modeSelect');
    if (modeSelectEl) modeSelectEl.disabled = true;

    const overlay = document.getElementById('canvasOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function ujJatekInditasaFunc() {
    switchToMobileTab('stagePanel', true);
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (pendingRowTimeout) {
        clearTimeout(pendingRowTimeout);
        pendingRowTimeout = null;
    }

    jatekFut = false;
    vegeAJateknak = false;
    kattOffset = false;
    hoverHighlightSet.clear();
    hoverPreviewText = '';
    particles = [];
    floatingTexts = [];
    shockwaves = [];

    pontSzam = 0;
    updateScoreUI(true);

    remainingTime = MAX_TIME;
    refreshTimerText();

    const szinValaszto = document.getElementById('colorSelect');
    if (szinValaszto) szinValaszto.disabled = false;
    const timeSelectEl = document.getElementById('timeSelect');
    if (timeSelectEl) timeSelectEl.disabled = false;
    const modeSelectEl2 = document.getElementById('modeSelect');
    if (modeSelectEl2) modeSelectEl2.disabled = false;
    const startBtn = document.getElementById('startGameButton');
    if (startBtn) startBtn.disabled = false;

    deaktivaldPontduplazot();
    deaktivaldFagyasztast();
    if (shuffleCooldownInterval) {
        clearInterval(shuffleCooldownInterval);
        shuffleCooldownInterval = null;
    }
    shuffleCooldownRemaining = 0;
    updateShuffleButtonUI();

    initPreviewBoard();

    const overlay = document.getElementById('canvasOverlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlaySubtitle = document.getElementById('overlaySubtitle');
    const overlayBtn = document.getElementById('overlayStartBtn');
    const overlaySaveBtn = document.getElementById('overlaySaveScoreBtn');
    const timeUpMsg = document.getElementById('timeUpMessage');

    // Kezdő nézetben az overlay rejtve marad, a pálya azonnal látható és használható!
    if (overlay) overlay.classList.add('hidden');
    if (overlayTitle) overlayTitle.textContent = 'Crashdown';
    if (overlaySubtitle) overlaySubtitle.textContent = 'Kattints vagy érints legalább 3 azonos színű szomszédos blokkot a törléshez!';
    if (overlaySaveBtn) overlaySaveBtn.style.display = 'none';
    if (timeUpMsg) timeUpMsg.style.display = 'none';
    if (overlayBtn) {
        overlayBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg><span>Játék indítása</span>';
    }

    setComboStatus('Készen állsz?', false);
    showToast('Alaphelyzet: válassz nehézséget, módot és játékidőt, majd indítsd a játékot!', 'info');
}

// ==================== PÁLYA ÚJRAKEVERÉS (SHUFFLE) ====================
function updateShuffleButtonUI() {
    const btn = document.getElementById('shuffleButton');
    const badge = document.getElementById('shuffleCooldownBadge');
    if (!btn || !badge) return;

    if (!jatekFut || vegeAJateknak) {
        btn.disabled = true;
        badge.textContent = 'Kész';
        return;
    }

    if (shuffleCooldownRemaining > 0) {
        btn.disabled = true;
        badge.textContent = `${shuffleCooldownRemaining}s`;
    } else {
        btn.disabled = false;
        badge.textContent = 'Kész';
    }
}

function startShuffleCooldown() {
    shuffleCooldownRemaining = SHUFFLE_COOLDOWN_SEC;
    updateShuffleButtonUI();
    if (shuffleCooldownInterval) clearInterval(shuffleCooldownInterval);
    shuffleCooldownInterval = setInterval(() => {
        shuffleCooldownRemaining--;
        if (shuffleCooldownRemaining <= 0) {
            clearInterval(shuffleCooldownInterval);
            shuffleCooldownInterval = null;
            shuffleCooldownRemaining = 0;
        }
        updateShuffleButtonUI();
    }, 1000);
}

function executeBoardShuffle() {
    if (!jatekFut || vegeAJateknak || isShufflingBoard || shuffleCooldownRemaining > 0) return;

    startShuffleCooldown();
    regisztraljPowerupHasznalatot();

    const btn = document.getElementById('shuffleButton');
    if (btn) {
        btn.classList.add('is-spinning');
        setTimeout(() => btn.classList.remove('is-spinning'), 700);
    }

    isShufflingBoard = true;
    playSound(doublerKatt);
    screenShake = 3;

    shockwaves.push({
        x: LOGICAL_SIZE / 2,
        y: LOGICAL_SIZE / 2,
        radius: 12,
        maxRadius: LOGICAL_SIZE * 0.72,
        color: '#818cf8',
        alpha: 1
    });

    const positions = [];
    const colors = [];
    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            const col = grid[i]?.[j]?.color;
            if (col && col !== 'white') {
                positions.push({ x: j, y: i });
                colors.push(col);
            }
        }
    }

    for (let k = colors.length - 1; k > 0; k--) {
        const r = Math.floor(Math.random() * (k + 1));
        [colors[k], colors[r]] = [colors[r], colors[k]];
    }

    const centerX = (oszlopok - 1) / 2;
    const centerY = (sorok - 1) / 2;

    positions.forEach((pos, idx) => {
        const cell = grid[pos.y][pos.x];
        const dist = Math.hypot(pos.x - centerX, pos.y - centerY);
        const delay = dist * 26;

        setTimeout(() => {
            cell.scale = 0.2;
            setTimeout(() => {
                cell.color = colors[idx];
                cell.scale = 1.25;
                spawnCellParticles(pos.x, pos.y, colors[idx], 3);
            }, 100);
        }, delay);
    });

    spawnFloatingText(LOGICAL_SIZE / 2, LOGICAL_SIZE / 2, '⟳ PÁLYA ÚJRAKEVERVE!', '#818cf8');
    setComboStatus('⟳ Pálya újrakeverve! Keresd az új kombinációkat!', true);
    checkAchievement('shuffle_master');

    setTimeout(() => {
        isShufflingBoard = false;
        updateHoverPreview();
        ellenorizdPalyaAllapot();
    }, 450);
}

// Canvas egér és kattintás események
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = LOGICAL_SIZE / rect.width;
    const scaleY = LOGICAL_SIZE / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX / negyzetMeret);
    const y = Math.floor((e.clientY - rect.top) * scaleY / negyzetMeret);

    if (!hoverCell || hoverCell.x !== x || hoverCell.y !== y) {
        hoverCell = { x, y };
        updateHoverPreview();
    }
});

canvas.addEventListener('mouseleave', function () {
    hoverCell = null;
    hoverHighlightSet.clear();
    hoverPreviewText = '';
});

canvas.addEventListener('click', handleClick);
