/*############################## AUDIO & CONFIG REGION ##############################*/

const hatterZene = new Audio('hopes_and_dreams.mp3');
hatterZene.loop = true;
hatterZene.load();

const tntKatt = new Audio('minecraft_tnt_effect.mp3');
tntKatt.load();

const sorEffekt = new Audio('minecraft_anvil_effect.mp3');
sorEffekt.load();

const timeEffekt = new Audio('minecraft_brewing_effect.mp3');
timeEffekt.load();

const doublerKatt = new Audio('minecraft_xp_effect.mp3');
doublerKatt.load();

const sikeresKatt = new Audio('minecraft_item_pickup_effect.mp3');
sikeresKatt.load();

const BASE_VOLUMES = {
    music: 0.14,
    tnt: 0.22,
    row: 0.22,
    time: 0.25,
    doubler: 0.28,
    pop: 0.35
};

let toggledVOlume = localStorage.getItem('crashdownMuted') === 'true';
let masterVolume = parseFloat(localStorage.getItem('crashdownVolume') ?? '0.35');

function applyAudioSettings() {
    const effective = toggledVOlume ? 0 : masterVolume;
    hatterZene.volume = Math.min(1, BASE_VOLUMES.music * effective * 2);
    tntKatt.volume = Math.min(1, BASE_VOLUMES.tnt * effective * 2);
    sorEffekt.volume = Math.min(1, BASE_VOLUMES.row * effective * 2);
    timeEffekt.volume = Math.min(1, BASE_VOLUMES.time * effective * 2);
    doublerKatt.volume = Math.min(1, BASE_VOLUMES.doubler * effective * 2);
    sikeresKatt.volume = Math.min(1, BASE_VOLUMES.pop * effective * 2);

    const volIcon = document.getElementById('toggleVol');
    if (volIcon) {
        volIcon.setAttribute('src', (toggledVOlume || masterVolume === 0) ? 'volume_off_icon.png' : 'volume_on_icon.png');
    }
    const slider = document.getElementById('volumeSlider');
    const label = document.getElementById('volumeValue');
    if (slider) slider.value = Math.round((toggledVOlume ? 0 : masterVolume) * 100);
    if (label) label.textContent = `${Math.round((toggledVOlume ? 0 : masterVolume) * 100)}%`;
}

function playSound(audioObj) {
    if (toggledVOlume || masterVolume <= 0) return;
    try {
        audioObj.pause();
        audioObj.currentTime = 0;
        const p = audioObj.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
}

function toggleVolume() {
    toggledVOlume = !toggledVOlume;
    if (!toggledVOlume && masterVolume === 0) {
        masterVolume = 0.35;
        localStorage.setItem('crashdownVolume', String(masterVolume));
    }
    localStorage.setItem('crashdownMuted', String(toggledVOlume));
    applyAudioSettings();
}

const toggleVolBtn = document.getElementById('toggleVolBtn') || document.getElementById('toggleVol');
if (toggleVolBtn) {
    toggleVolBtn.addEventListener('click', toggleVolume);
}

const volumeSlider = document.getElementById('volumeSlider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
        masterVolume = parseInt(this.value, 10) / 100;
        toggledVOlume = masterVolume === 0;
        localStorage.setItem('crashdownVolume', String(masterVolume));
        localStorage.setItem('crashdownMuted', String(toggledVOlume));
        applyAudioSettings();
    });
}

/*############################## JATEK ALLAPOT & CANVAS ##############################*/

const canvas = document.getElementById('crashdownCanvas');
const ctx = canvas.getContext('2d');
const LOGICAL_SIZE = 440;
const sorok = 10;
const oszlopok = 10;
const negyzetMeret = LOGICAL_SIZE / oszlopok; // 44px

// Modern, élénk és jól megkülönböztethető színpaletta
const negyzetSzinek = ['#FF2E4C', '#22C55E', '#FACC15', '#3B82F6', '#D946EF'];

const COLOR_STYLES = {
    '#FF2E4C': { top: '#f87171', bottom: '#dc2626', border: '#fca5a5' },
    '#22C55E': { top: '#34d399', bottom: '#059669', border: '#86efac' },
    '#FACC15': { top: '#fbbf24', bottom: '#d97706', border: '#fde68a' },
    '#3B82F6': { top: '#60a5fa', bottom: '#2563eb', border: '#bfdbfe' },
    '#D946EF': { top: '#c084fc', bottom: '#7c3aed', border: '#e9d5ff' },
    // Power-up színek és címkék
    'cyan':      { top: '#38bdf8', bottom: '#0284c7', border: '#bae6fd', label: '2×' },
    'pink':      { top: '#f472b6', bottom: '#db2777', border: '#fbcfe8', label: '⇄' },
    '#f97316':   { top: '#fb923c', bottom: '#ea580c', border: '#fed7aa', label: '⇅' },
    'darkgreen': { top: '#4ade80', bottom: '#15803d', border: '#bbf7d0', label: 'TNT' },
    '#14b8a6':   { top: '#2dd4bf', bottom: '#0f766e', border: '#99f6e4', label: '✦' },
    '#6366f1':   { top: '#818cf8', bottom: '#4338ca', border: '#c7d2fe', label: '⟳' },
    '#581845':   { top: '#c084fc', bottom: '#6b21a8', border: '#e9d5ff', label: '+15s' }
};

let grid = [];
let pontSzam = 0;
let displayedScore = 0;
let szinek = [];
let kattOffset = false;
let jatekFut = false;
let vegeAJateknak = false;
let remainingTime = 120;
let MAX_TIME = 120;
let timerInterval = null;
let pendingRowTimeout = null;
let currentLeaderboardFilter = 'all';

// Vizuális effektek tárolói
let particles = [];
let floatingTexts = [];
let shockwaves = [];
let hoverCell = null;
let hoverHighlightSet = new Set();
let hoverPreviewText = '';
let screenShake = 0;
let lastFrameTime = performance.now();

function setupHiDPICanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = LOGICAL_SIZE * dpr;
    canvas.height = LOGICAL_SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
setupHiDPICanvas();
window.addEventListener('resize', setupHiDPICanvas);

/*############################## TOAST & UI SEGEDEK ##############################*/

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}

function setComboStatus(text, highlight = false) {
    const pill = document.getElementById('comboIndicator');
    if (!pill) return;
    pill.textContent = text;
    if (highlight) {
        pill.style.background = 'rgba(16, 185, 129, 0.25)';
        pill.style.borderColor = 'rgba(16, 185, 129, 0.55)';
        pill.style.color = '#6ee7b7';
    } else {
        pill.style.background = 'rgba(59, 130, 246, 0.2)';
        pill.style.borderColor = 'rgba(59, 130, 246, 0.4)';
        pill.style.color = '#93c5fd';
    }
}

function updateScoreUI(instant = false) {
    const scoreEl = document.getElementById('score');
    if (instant) {
        displayedScore = pontSzam;
        if (scoreEl) scoreEl.textContent = pontSzam;
    }
    const reqScore = document.getElementById('reqScore');
    if (reqScore) {
        reqScore.classList.toggle('met', pontSzam >= 1000);
    }
}

/*############################## TOPLISTA REGION ##############################*/

function setLeaderboardFeedback(msg, isError = true) {
    const el = document.getElementById('leaderboardFeedback');
    if (!el) return;
    el.textContent = msg;
    el.className = `feedback-msg ${isError ? 'error' : 'success'}`;
}

document.getElementById('jatekosNev').addEventListener('input', function () {
    const len = this.value.trim().length;
    const reqName = document.getElementById('reqName');
    if (reqName) {
        reqName.classList.toggle('met', len >= 3 && len <= 30);
    }
    setLeaderboardFeedback('', false);
});

document.getElementById('jatekosNev').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('toplistaHozzaadas').click();
    }
});

document.getElementById('toplistaHozzaadas').addEventListener('click', async function () {
    const inputEl = document.getElementById('jatekosNev');
    const jatekosNev = inputEl.value.trim();
    const score = pontSzam;
    const szinValaszto = document.getElementById('colorSelect');
    const timeSelectEl = document.getElementById('timeSelect');

    if (jatekosNev.length <= 2) {
        setLeaderboardFeedback('Túl rövid név! Minimum 3 karakter szükséges.', true);
        showToast('Túl rövid név! (Minimum 3 karakter)', 'warning');
        return;
    }

    if (jatekosNev.length > 30) {
        setLeaderboardFeedback('Túl hosszú név! Maximum 30 karakter lehet.', true);
        showToast('Túl hosszú név! (Maximum 30 karakter)', 'warning');
        return;
    }

    if (score < 1000) {
        setLeaderboardFeedback('Legalább 1000 pont szükséges a felkerüléshez!', true);
        showToast('Legalább 1000 pont szükséges a ranglistához!', 'warning');
        return;
    }

    const JatekosId = Date.now();
    const jatekosAdat = {
        id: JatekosId,
        name: jatekosNev,
        score: score,
        color: szinValaszto ? szinValaszto.value : '3',
        duration: MAX_TIME,
        timestamp: new Date().toISOString()
    };

    const eredmeny = await toplistaHozzaadas(jatekosAdat);

    if (eredmeny && eredmeny.success) {
        inputEl.value = '';
        inputEl.disabled = true;
        this.disabled = true;
        const msg = eredmeny.isOnline ? 'Sikeresen felkerültél az online globális ranglistára! 🏆' : 'Sikeres mentés a helyi ranglistára! 🎉';
        setLeaderboardFeedback(msg, false);
        showToast(`Gratulálok, ${jatekosNev}! Eredményed elmentve.`, 'success');
        await toplistaMegjelenites();
    } else {
        setLeaderboardFeedback('Ez a név már szerepel a ranglistán! Válassz másikat.', true);
        showToast('Ez a név már szerepel a ranglistán!', 'error');
    }
});

async function toplistaHozzaadas(jatekosAdat) {
    if (window.leaderboardService) {
        return await window.leaderboardService.addScore(jatekosAdat);
    }
    let toplista = JSON.parse(localStorage.getItem('toplista')) || [];
    const letezoJatekosNev = toplista.find(
        i => i.name.toLowerCase() === jatekosAdat.name.toLowerCase()
    );
    if (letezoJatekosNev) {
        return { success: false, reason: 'duplicate_name' };
    }
    toplista.push(jatekosAdat);
    toplista.sort((a, b) => b.score - a.score);
    localStorage.setItem('toplista', JSON.stringify(toplista));
    return { success: true, isOnline: false };
}

async function toplistaMegjelenites() {
    let toplista = [];
    if (window.leaderboardService) {
        toplista = await window.leaderboardService.getScores();
        const syncTag = document.getElementById('leaderboardSyncTag');
        const scopeBadge = document.getElementById('leaderboardScopeBadge');
        if (syncTag) {
            syncTag.className = `status-indicator ${window.leaderboardService.isOnline ? '' : 'offline'}`;
            syncTag.title = window.leaderboardService.isOnline ? 'Firebase Online Szinkronizáció Aktív' : 'Helyi Mód (Firebase nincs csatlakoztatva)';
        }
        if (scopeBadge) {
            scopeBadge.textContent = window.leaderboardService.isOnline ? 'Globális Online' : 'Helyi Rekordok';
        }
    } else {
        toplista = JSON.parse(localStorage.getItem('toplista')) || [];
    }

    const toplistaLista = document.getElementById('toplistaLista');
    if (!toplistaLista) return;
    toplistaLista.innerHTML = '';

    if (currentLeaderboardFilter !== 'all') {
        toplista = toplista.filter(elem => String(elem.color) === String(currentLeaderboardFilter));
    }

    if (toplista.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'leaderboard-empty';
        emptyLi.textContent = 'Még nincs mentett eredmény ebben a kategóriában. Legyél te az első!';
        toplistaLista.appendChild(emptyLi);
        return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    toplista.forEach((elem, i) => {
        const listaElem = document.createElement('li');
        listaElem.className = `leaderboard-item ${i < 3 ? `rank-${i + 1}` : ''}`;

        const leftDiv = document.createElement('div');
        leftDiv.className = 'lb-left';

        const rankSpan = document.createElement('span');
        rankSpan.className = 'lb-rank';
        rankSpan.textContent = i < 3 ? medals[i] : `${i + 1}.`;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'lb-name';
        nameSpan.textContent = elem.name;

        leftDiv.appendChild(rankSpan);
        leftDiv.appendChild(nameSpan);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'lb-right';

        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'lb-score';
        scoreSpan.textContent = `${elem.score} p`;

        const colorTag = document.createElement('span');
        colorTag.className = 'lb-color-tag';
        const durText = elem.duration ? `${elem.duration}s` : '';
        colorTag.textContent = durText ? `${elem.color} sz • ${durText}` : `${elem.color} szín`;

        rightDiv.appendChild(scoreSpan);
        rightDiv.appendChild(colorTag);

        listaElem.appendChild(leftDiv);
        listaElem.appendChild(rightDiv);
        toplistaLista.appendChild(listaElem);
    });
}

// Feliratkozás az online változásokra
if (window.leaderboardService) {
    window.leaderboardService.onScoresChanged(() => {
        toplistaMegjelenites();
    });
}

document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentLeaderboardFilter = this.getAttribute('data-filter');
        toplistaMegjelenites();
    });
});

/*############################## ESEMÉNYKEZELŐK & VEZÉRLÉS ##############################*/

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

function startMatch() {
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

    const overlay = document.getElementById('canvasOverlay');
    if (overlay) overlay.classList.add('hidden');

    const timeUpMsg = document.getElementById('timeUpMessage');
    if (timeUpMsg) timeUpMsg.style.display = 'none';

    const appearLb = document.getElementById('appear-leaderboard');
    if (appearLb) appearLb.style.display = 'none';

    const toplistaBtn = document.getElementById('toplistaHozzaadas');
    if (toplistaBtn) toplistaBtn.disabled = false;

    setLeaderboardFeedback('', false);
}

/**
 * Visszaállítja a játékot az alaphelyzetbe (lobby állapot),
 * ahol szabadon választható a színek száma, és a játék csak a
 * "Játék indítása" gombra kattintva indul el.
 */
function ujJatekInditasaFunc() {
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
    if (timeSelectEl) {
        timeSelectEl.disabled = false;
        MAX_TIME = parseInt(timeSelectEl.value, 10);
        remainingTime = MAX_TIME;
    } else {
        remainingTime = MAX_TIME;
    }
    refreshTimerText();

    const startBtn = document.getElementById('startGameButton');
    if (startBtn) startBtn.disabled = false;

    const ujSorGomb = document.getElementById('addRowButton');
    if (ujSorGomb) ujSorGomb.disabled = true;

    const timeUpMsg = document.getElementById('timeUpMessage');
    if (timeUpMsg) timeUpMsg.style.display = 'none';

    const appearLb = document.getElementById('appear-leaderboard');
    if (appearLb) appearLb.style.display = 'none';

    const overlay = document.getElementById('canvasOverlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlaySubtitle = document.getElementById('overlaySubtitle');
    const overlayBtn = document.getElementById('overlayStartBtn');
    if (overlay) {
        overlay.classList.remove('hidden');
        if (overlayTitle) overlayTitle.textContent = 'Crashdown';
        if (overlaySubtitle) {
            overlaySubtitle.textContent = 'Kattints vagy érints legalább 3 azonos színű blokkot a törléshez!';
        }
        if (overlayBtn) {
            overlayBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg><span>Játék indítása</span>';
        }
    }

    canvas.style.cursor = 'pointer';
    setComboStatus('Készen állsz?', false);
    initPreviewBoard();
    showToast('Alaphelyzet: válassz nehézséget és játékidőt, majd indítsd a játékot!', 'info');
}

document.getElementById('startGameButton').addEventListener('click', startMatch);
document.getElementById('startNewGame').addEventListener('click', ujJatekInditasaFunc);

const overlayStartBtn = document.getElementById('overlayStartBtn');
if (overlayStartBtn) {
    overlayStartBtn.addEventListener('click', startMatch);
}

document.getElementById('addRowButton').addEventListener('click', function () {
    if (!jatekFut || vegeAJateknak) return;
    if (pendingRowTimeout) {
        clearTimeout(pendingRowTimeout);
        pendingRowTimeout = null;
    }
    addRow();
});

document.getElementById('colorSelect').addEventListener('change', function () {
    localStorage.setItem('selectedColorCount', this.value);
    getSzinek(this.value);
    initPreviewBoard();
    showToast(`Nehézség beállítva: ${this.value} szín`, 'info');
});

const timeSelectEl = document.getElementById('timeSelect');
if (timeSelectEl) {
    timeSelectEl.addEventListener('change', function () {
        if (!jatekFut) {
            MAX_TIME = parseInt(this.value, 10);
            remainingTime = MAX_TIME;
            refreshTimerText();
            showToast(`Játékidő beállítva: ${this.options[this.selectedIndex].text}`, 'info');
        }
    });
}

// Mobilos fül-váltó navigáció
document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.mobile-tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const targetId = this.getAttribute('data-target');
        
        document.querySelectorAll('.controls-panel, .game-stage, .leaderboard-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// Érintéskezelés mobiltelefonokra (késleltetés-mentes, pontos koordináták)
function handleCanvasTouch(e) {
    e.preventDefault();
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    handleClick({
        clientX: touch.clientX,
        clientY: touch.clientY
    });
}
canvas.addEventListener('touchstart', handleCanvasTouch, { passive: false });

// Billentyűparancsok (Space = Új sor, M = Némítás)
document.addEventListener('keydown', function (e) {
    if (document.activeElement === document.getElementById('jatekosNev')) return;
    if (e.code === 'Space' && jatekFut && !vegeAJateknak) {
        e.preventDefault();
        if (pendingRowTimeout) {
            clearTimeout(pendingRowTimeout);
            pendingRowTimeout = null;
        }
        addRow();
    } else if (e.key === 'm' || e.key === 'M') {
        toggleVolume();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const selectedValue = localStorage.getItem('selectedColorCount') || '3';
    const selectEl = document.getElementById('colorSelect');
    if (selectEl) selectEl.value = selectedValue;
    applyAudioSettings();
    toplistaMegjelenites();
    initPreviewBoard();
    requestAnimationFrame(animationLoop);
});

/*############################## JATEK LOGIKA & POWERUPOK ##############################*/

function pluszIdoPowerUp() {
    remainingTime = Math.min(MAX_TIME + 30, remainingTime + 15);
    refreshTimerText();
}

function scheduleNextRow() {
    if (pendingRowTimeout) {
        clearTimeout(pendingRowTimeout);
    }
    pendingRowTimeout = setTimeout(() => {
        pendingRowTimeout = null;
        if (jatekFut && !vegeAJateknak) {
            addRow();
        }
    }, 240);
}

function addRow() {
    if (!jatekFut || vegeAJateknak) return;

    const ujSor = [];
    for (let j = 0; j < oszlopok; j++) {
        const randColor = szinek[Math.floor(Math.random() * szinek.length)];
        ujSor[j] = createCell(randColor, 0);
    }

    // Kiegyensúlyozott, gazdag power-up esélyek (összesen 7 féle képesség)
    const roll = Math.random();
    if (roll < 0.04) {
        const idx = Math.floor(Math.random() * oszlopok);
        ujSor[idx].color = 'cyan'; // Duplázó
    } else if (roll < 0.08) {
        const idx = Math.floor(Math.random() * oszlopok);
        ujSor[idx].color = 'pink'; // Sor törlő
    } else if (roll < 0.12) {
        const idx = Math.floor(Math.random() * oszlopok);
        ujSor[idx].color = '#f97316'; // Oszlop törlő lézer
    } else if (roll < 0.16) {
        const idx = Math.floor(Math.random() * oszlopok);
        ujSor[idx].color = 'darkgreen'; // 3x3 TNT
    } else if (roll < 0.20) {
        const idx = Math.floor(Math.random() * oszlopok);
        ujSor[idx].color = '#14b8a6'; // Szín-bomba
    } else if (roll < 0.24) {
        const idx = Math.floor(Math.random() * oszlopok);
        ujSor[idx].color = '#6366f1'; // Pálya keverés
    } else if (roll < 0.28) {
        const idx = Math.floor(Math.random() * oszlopok);
        ujSor[idx].color = '#581845'; // +15mp Idő
    }

    grid.push(ujSor);
    grid.shift();

    // Sima felfelé csúszó animáció minden nem-üres cellának
    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            if (grid[i][j].color !== 'white') {
                grid[i][j].offsetY += negyzetMeret;
                grid[i][j].velY = 0;
            }
        }
    }

    updateHoverPreview();
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
        // Pontduplázó power-up
        spawnCellParticles(x, y, 'cyan', 16);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        playSound(doublerKatt);
        gridUjraRendezes();
        pontSzam = pontSzam > 0 ? pontSzam * 2 : 100;
        updateScoreUI();
        spawnFloatingText(x, y, '2× PONT! 💵', '#22d3ee');
        setComboStatus('💵 Pontszám megduplázva!', true);
        scheduleNextRow();
    } else if (targetColor === 'pink') {
        // Cunami: teljes sor törlése
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
        pontSzam += 100;
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, '⇄ CUNAMI +100', '#f472b6');
        setComboStatus('⇄ Teljes sor eltakarítva! (+100p)', true);
        scheduleNextRow();
    } else if (targetColor === '#f97316') {
        // Oszloptörlő lézer: teljes oszlop törlése
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
        pontSzam += 100;
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, '⇅ OSZLOP +100', '#f97316');
        setComboStatus('⇅ Teljes oszlop kilőve! (+100p)', true);
        scheduleNextRow();
    } else if (targetColor === 'darkgreen') {
        // 3x3 TNT robbantás
        playSound(tntKatt);
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
        pontSzam += 90;
        updateScoreUI();
        spawnFloatingText(x, y, 'TNT BUMM +90', '#4ade80');
        setComboStatus('💥 3×3-as TNT robbanás! (+90p)', true);
        scheduleNextRow();
    } else if (targetColor === '#14b8a6') {
        // Szín-bomba: egy teljes szín összes blokkját eltakarítja
        playSound(tntKatt);
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
        const earned = Math.max(50, wipedCount * 15);
        pontSzam += earned;
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, `✦ BOMB +${earned}`, '#14b8a6');
        setComboStatus(`✦ Szín-bomba: ${wipedCount} blokk megsemmisítve! (+${earned}p)`, true);
        scheduleNextRow();
    } else if (targetColor === '#6366f1') {
        // Pálya keverés: újrakeveri a blokkok színeit
        playSound(doublerKatt);
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
        pontSzam += 50;
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, '⟳ KEVERÉS +50', '#818cf8');
        setComboStatus('⟳ Pálya újrakeverve! (+50p)', true);
        scheduleNextRow();
    } else if (targetColor === '#581845') {
        // +15 mp idő power-up
        spawnCellParticles(x, y, '#581845', 14);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        playSound(timeEffekt);
        gridUjraRendezes();
        pluszIdoPowerUp();
        spawnFloatingText(x, y, '+15 MP!', '#c084fc');
        setComboStatus('⌛ +15 másodperc extra idő!', true);
        scheduleNextRow();
    } else {
        // Normál színes négyzetek keresése (BFS)
        const torlendoNegyzetek = getTorlendoNegyzetek(x, y, targetColor);
        if (torlendoNegyzetek.length >= 3) {
            playSound(sikeresKatt);
            for (let i = 0; i < torlendoNegyzetek.length; i++) {
                const cellPos = torlendoNegyzetek[i];
                spawnCellParticles(cellPos.x, cellPos.y, targetColor, 5);
                grid[cellPos.y][cellPos.x].marked = true;
            }
            const gained = torlendoNegyzetek.length * 10;
            pontSzam += gained;
            updateScoreUI();
            gridUjraRendezes();

            const style = COLOR_STYLES[targetColor];
            spawnFloatingText(x, y, `+${gained}`, style ? style.top : '#fff');
            if (torlendoNegyzetek.length >= 7) {
                setComboStatus(`🔥 Óriási kombó! ${torlendoNegyzetek.length} blokk (+${gained}p)`, true);
            } else {
                setComboStatus(`${torlendoNegyzetek.length} blokk törölve (+${gained}p)`, false);
            }
            scheduleNextRow();
        } else {
            // Kevés az érintkező négyzet -> enyhe vizuális visszajelzés
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

/**
 * Azonnali, versenyhelyzet-mentes oszlop-újrarendezés:
 * A logikai rácsot szinkron frissítjük, a leeső blokkoknak pedig negatív
 * vizuális offsetY-t adunk, amit a requestAnimationFrame loop vajpuhán a helyére ejt.
 */
function gridUjraRendezes() {
    for (let j = 0; j < oszlopok; j++) {
        // Megjelölt cellák ürítése
        for (let i = sorok - 1; i >= 0; i--) {
            if (grid[i][j].marked) {
                grid[i][j].color = 'white';
                grid[i][j].marked = false;
                grid[i][j].offsetY = 0;
                grid[i][j].velY = 0;
            }
        }

        // Nem üres cellák tömörítése alulra
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

/*############################## HOVER ELŐNÉZET ##############################*/

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
        for (let j = 0; j < oszlopok; j++) {
            hoverHighlightSet.add(`${j}:${y}`);
        }
        hoverPreviewText = 'Sor törlés (+100)';
    } else if (c === '#f97316') {
        for (let i = 0; i < sorok; i++) {
            hoverHighlightSet.add(`${x}:${i}`);
        }
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
        hoverPreviewText = '+15 mp extra idő';
    } else {
        const group = getTorlendoNegyzetek(x, y, c);
        if (group.length >= 3) {
            group.forEach(pos => hoverHighlightSet.add(`${pos.x}:${pos.y}`));
            hoverPreviewText = `+${group.length * 10} pont`;
        }
    }
}

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

/*############################## RENDERELÉS & 60FPS ANIMÁCIÓ ##############################*/

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

    // Képernyőrázkódás (TNT robbanásnál)
    if (screenShake > 0.2) {
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
    }

    // Sötét háttérrács kirajzolása
    ctx.fillStyle = '#0d1017';
    ctx.fillRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);

    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            const gx = j * negyzetMeret + 3;
            const gy = i * negyzetMeret + 3;
            const gw = negyzetMeret - 6;
            ctx.fillStyle = '#151a24';
            drawRoundedRect(gx, gy, gw, gw, 6);
            ctx.fill();
        }
    }

    // Blokkok kirajzolása (plasztikus 3D arcade csempék)
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

            // Blokk alap kitöltése
            const grad = ctx.createLinearGradient(x, y, x, y + size);
            grad.addColorStop(0, style.top);
            grad.addColorStop(1, style.bottom);

            ctx.fillStyle = grad;
            drawRoundedRect(x, y, size, size, 7);
            ctx.fill();

            // Finom 3D plasztikus élfény (taktilis arcade csempe hatás)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x + 5, y + size - 3);
            ctx.lineTo(x + 5, y + 4);
            ctx.quadraticCurveTo(x + 4, y + 2, x + 7, y + 2);
            ctx.lineTo(x + size - 5, y + 2);
            ctx.stroke();

            // Alsó és jobb belső árnyék
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x + size - 2, y + 5);
            ctx.lineTo(x + size - 2, y + size - 5);
            ctx.quadraticCurveTo(x + size - 2, y + size - 2, x + size - 5, y + size - 2);
            ctx.lineTo(x + 5, y + size - 2);
            ctx.stroke();

            // Külső keret és kijelölés
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

            // Power-up címke kirajzolása
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
                } else if (style.label === '+15s') {
                    ctx.font = '800 12px "JetBrains Mono", monospace';
                    ctx.fillText('+15s', x + size / 2, y + size / 2 + 1);
                }
                ctx.restore();
            }

            ctx.restore();
        }
    }

    // Lökéshullámok kirajzolása
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

    // Részecskék (particles) kirajzolása
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

    // Hover előnézeti címke
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

    // Lebegő pontszám feliratok
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

    // Pontszám animált pörgetése
    if (displayedScore !== pontSzam) {
        const diff = pontSzam - displayedScore;
        const step = Math.ceil(Math.abs(diff) * 0.25);
        displayedScore += Math.sign(diff) * step;
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = displayedScore;
    }

    // Képernyőrázkódás csillapítása
    if (screenShake > 0) {
        screenShake = Math.max(0, screenShake - 35 * dt);
    }

    // Cellák fizikai mozgása (zuhanás és emelkedés)
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

    // Részecskék frissítése
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 480 * dt; // gravitáció
        p.life -= dt;
        p.alpha = Math.max(0, p.life / 0.5);
        if (p.life <= 0) particles.splice(i, 1);
    }

    // Lökéshullámok frissítése
    for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 10 * dt + 120 * dt;
        sw.alpha -= 2.4 * dt;
        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
            shockwaves.splice(i, 1);
        }
    }

    // Lebegő szövegek frissítése
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

/*############################## JATEK INDITASA & IDOZITO ##############################*/

function initPreviewBoard() {
    getSzinek(document.getElementById('colorSelect').value);
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

    getSzinek(document.getElementById('colorSelect').value);

    for (let i = 0; i < sorok; i++) {
        grid[i] = [];
        for (let j = 0; j < oszlopok; j++) {
            const randomColor = szinek[Math.floor(Math.random() * szinek.length)];
            // Beugró animáció felülről a játék indulásakor
            grid[i][j] = createCell(randomColor, -(sorok - i) * 18);
        }
    }

    // Kezdő power-upok elhelyezése garantáltan különböző pozíciókra
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

    const powerUpTypes = ['cyan', 'pink', '#f97316', 'darkgreen', '#14b8a6', '#6366f1', '#581845'];
    // Véletlenszerűen kiválasztunk 5 különböző power-upot és lehelyezzük
    const shuffledPows = powerUpTypes.sort(() => 0.5 - Math.random()).slice(0, 5);
    shuffledPows.forEach(pow => placePowerUp(pow));

    canvas.style.cursor = 'pointer';

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
    if (safeTime <= 30) {
        idozito.classList.add('timer-danger');
    } else if (safeTime <= 60) {
        idozito.classList.add('timer-warning');
    }

    if (progressBar) {
        const pct = Math.max(0, Math.min(100, (safeTime / MAX_TIME) * 100));
        progressBar.style.width = `${pct}%`;
        if (safeTime <= 30) {
            progressBar.style.background = 'linear-gradient(90deg, #e11d48, #fb7185)';
        } else if (safeTime <= 60) {
            progressBar.style.background = 'linear-gradient(90deg, #d97706, #fbbf24)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        }
    }
}

function timer() {
    const lejartAzIdo = document.getElementById('timeUpMessage');
    const toplistaInput = document.getElementById('jatekosNev');
    const toplistaMegjelenitesDiv = document.getElementById('appear-leaderboard');
    const ujSorGomb = document.getElementById('addRowButton');
    const szinValaszto = document.getElementById('colorSelect');
    const timeSelectEl = document.getElementById('timeSelect');

    szinValaszto.disabled = true;
    if (timeSelectEl) {
        timeSelectEl.disabled = true;
        MAX_TIME = parseInt(timeSelectEl.value, 10);
    }
    ujSorGomb.disabled = false;
    remainingTime = MAX_TIME;
    toplistaInput.disabled = true;
    refreshTimerText();

    timerInterval = setInterval(function () {
        remainingTime--;
        refreshTimerText();

        if (remainingTime < 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            jatekFut = false;
            vegeAJateknak = true;
            hoverHighlightSet.clear();
            hoverPreviewText = '';

            canvas.style.cursor = 'not-allowed';
            if (lejartAzIdo) lejartAzIdo.style.display = 'block';

            const overlay = document.getElementById('canvasOverlay');
            const overlayTitle = document.getElementById('overlayTitle');
            const overlaySubtitle = document.getElementById('overlaySubtitle');
            const overlayBtn = document.getElementById('overlayStartBtn');
            if (overlay) {
                overlay.classList.remove('hidden');
                if (overlayTitle) overlayTitle.textContent = `Végső pontszám: ${pontSzam}`;
                if (overlaySubtitle) {
                    overlaySubtitle.textContent = pontSzam >= 1000
                        ? 'Nagyszerű játék! Jobb oldalon feliratkozhatsz a toplistára.'
                        : 'Próbáld újra, és érj el legalább 1000 pontot a toplistához!';
                }
                if (overlayBtn) {
                    overlayBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg><span>Új játék kezdése</span>';
                }
            }

            toplistaInput.disabled = false;
            if (toplistaMegjelenitesDiv) toplistaMegjelenitesDiv.style.display = 'block';
            ujSorGomb.disabled = true;
            szinValaszto.disabled = false;
            if (timeSelectEl) timeSelectEl.disabled = false;
            const startBtn = document.getElementById('startGameButton');
            if (startBtn) startBtn.disabled = false;

            updateScoreUI(true);
            setComboStatus('Lejárt az idő!', false);
        }
    }, 1000);
}
