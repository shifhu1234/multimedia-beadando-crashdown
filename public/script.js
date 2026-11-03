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

// Alapértelmezett színek és témák
let negyzetSzinek = ['#FF2E4C', '#22C55E', '#FACC15', '#3B82F6', '#D946EF'];

const THEME_PALETTES = {
    cyber: ['#FF2E4C', '#22C55E', '#FACC15', '#3B82F6', '#D946EF'],
    candy: ['#fb7185', '#34d399', '#fde047', '#38bdf8', '#c084fc'],
    retro: ['#ef4444', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'],
    space: ['#f43f5e', '#10b981', '#eab308', '#4f46e5', '#ec4899']
};

const COLOR_STYLES = {
    // Cyber & Standard
    '#FF2E4C': { top: '#f87171', bottom: '#dc2626', border: '#fca5a5' },
    '#22C55E': { top: '#34d399', bottom: '#059669', border: '#86efac' },
    '#FACC15': { top: '#fbbf24', bottom: '#d97706', border: '#fde68a' },
    '#3B82F6': { top: '#60a5fa', bottom: '#2563eb', border: '#bfdbfe' },
    '#D946EF': { top: '#c084fc', bottom: '#7c3aed', border: '#e9d5ff' },

    // Candy Pop & Retro & Space extra színek
    '#fb7185': { top: '#fda4af', bottom: '#e11d48', border: '#ffe4e6' },
    '#34d399': { top: '#6ee7b7', bottom: '#059669', border: '#a7f3d0' },
    '#fde047': { top: '#fef08a', bottom: '#eab308', border: '#fef9c3' },
    '#38bdf8': { top: '#7dd3fc', bottom: '#0284c7', border: '#e0f2fe' },
    '#c084fc': { top: '#d8b4fe', bottom: '#9333ea', border: '#f3e8ff' },
    '#ef4444': { top: '#f87171', bottom: '#dc2626', border: '#fca5a5' },
    '#10b981': { top: '#34d399', bottom: '#047857', border: '#a7f3d0' },
    '#f59e0b': { top: '#fbbf24', bottom: '#d97706', border: '#fde68a' },
    '#06b6d4': { top: '#22d3ee', bottom: '#0891b2', border: '#a5f3fc' },
    '#8b5cf6': { top: '#a78bfa', bottom: '#6d28d9', border: '#ddd6fe' },
    '#f43f5e': { top: '#fb7185', bottom: '#be123c', border: '#ffe4e6' },
    '#eab308': { top: '#fde047', bottom: '#ca8a04', border: '#fef08a' },
    '#4f46e5': { top: '#818cf8', bottom: '#3730a3', border: '#c7d2fe' },
    '#ec4899': { top: '#f472b6', bottom: '#be185d', border: '#fbcfe8' },

    // Power-up színek és címkék
    'cyan':      { top: '#38bdf8', bottom: '#0284c7', border: '#bae6fd', label: '2×' },
    'pink':      { top: '#f472b6', bottom: '#db2777', border: '#fbcfe8', label: '⇄' },
    '#f97316':   { top: '#fb923c', bottom: '#ea580c', border: '#fed7aa', label: '⇅' },
    'darkgreen': { top: '#4ade80', bottom: '#15803d', border: '#bbf7d0', label: 'TNT' },
    '#14b8a6':   { top: '#2dd4bf', bottom: '#0f766e', border: '#99f6e4', label: '✦' },
    '#6366f1':   { top: '#818cf8', bottom: '#4338ca', border: '#c7d2fe', label: '⟳' },
    '#581845':   { top: '#c084fc', bottom: '#6b21a8', border: '#e9d5ff', label: '+5s' },
    '#0284c7':   { top: '#7dd3fc', bottom: '#0284c7', border: '#e0f2fe', label: '❄' },
    '#e11d48':   { top: '#fb7185', bottom: '#be123c', border: '#ffe4e6', label: '🧲' }
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

// Téma állapot
let currentTheme = localStorage.getItem('crashdown_theme') || 'cyber';

// Haptikus rezgés
function triggerHaptic(type = 'light') {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
            if (type === 'light') navigator.vibrate(15);
            else if (type === 'medium') navigator.vibrate(35);
            else if (type === 'heavy') navigator.vibrate([40, 30, 50]);
            else if (type === 'success') navigator.vibrate([30, 50, 70]);
            else if (type === 'freeze') navigator.vibrate([20, 20, 20, 20]);
        } catch (e) {}
    }
}

// ==================== MÉRFÖLDKÖVEK & JELVÉNYEK ====================
const ACHIEVEMENTS = [
    { id: 'first_match', icon: '🎯', title: 'Első lépés', desc: 'Törölj ki egy blokkcsoportot (legalább 3 db)' },
    { id: 'first_500', icon: '⭐', title: 'Kezdő Pontgyűjtő', desc: 'Érj el legalább 500 pontot egy játékban' },
    { id: 'score_10k', icon: '👑', title: 'Crashdown Mester', desc: 'Érj el legalább 10 000 pontot' },
    { id: 'combo_x3', icon: '⚡', title: 'Kombó Guru', desc: 'Érj el legalább 3×-os lánc kombó szorzót' },
    { id: 'combo_x5', icon: '🔥', title: 'Kombó Isten', desc: 'Érd el a maximális 5×-ös kombót!' },
    { id: 'tnt_boom', icon: '💣', title: 'TNT Szakértő', desc: 'Aktiválj egy 3×3-as TNT robbanást' },
    { id: 'freeze_time', icon: '❄️', title: 'Fagyos Pillanatok', desc: 'Állítsd meg az időt az Időfagyasztó Jégkockával' },
    { id: 'magnet_pull', icon: '🧲', title: 'Szuper Mágnes', desc: 'Ránts össze egy egész színt a Szuper Mágnessel' }
];

function getUnlockedAchievements() {
    try {
        const raw = localStorage.getItem('crashdown_achievements');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function checkAchievement(id) {
    const list = getUnlockedAchievements();
    const set = new Set(list);
    if (set.has(id)) return;

    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    set.add(id);
    localStorage.setItem('crashdown_achievements', JSON.stringify([...set]));

    triggerHaptic('success');
    playSound(sikeresKatt);
    showToast(`🏆 Jelvény feloldva: ${ach.icon} ${ach.title}!`, 'success');

    updateAchievementsUI();
}

function updateAchievementsUI() {
    const unlockedList = getUnlockedAchievements();
    const unlockedSet = new Set(unlockedList);

    const countEl = document.getElementById('unlockedAchievementsCount');
    const summaryCountEl = document.getElementById('achievementsSummaryCount');
    if (countEl) countEl.textContent = unlockedList.length;
    if (summaryCountEl) summaryCountEl.textContent = unlockedList.length;

    const listContainer = document.getElementById('achievementsList');
    if (!listContainer) return;

    listContainer.innerHTML = ACHIEVEMENTS.map(ach => {
        const isUnlocked = unlockedSet.has(ach.id);
        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon-wrap">${ach.icon}</div>
                <div class="achievement-info">
                    <strong>${ach.title}</strong>
                    <small>${ach.desc}</small>
                </div>
                <span class="achievement-status">${isUnlocked ? 'Feloldva ✓' : 'Zárolva'}</span>
            </div>
        `;
    }).join('');
}

function applyTheme(themeKey) {
    if (!THEME_PALETTES[themeKey]) themeKey = 'cyber';
    currentTheme = themeKey;
    localStorage.setItem('crashdown_theme', themeKey);

    document.body.classList.remove('theme-candy', 'theme-retro', 'theme-space');
    if (themeKey !== 'cyber') {
        document.body.classList.add(`theme-${themeKey}`);
    }

    negyzetSzinek = THEME_PALETTES[themeKey];
    const colorSelect = document.getElementById('colorSelect');
    if (colorSelect) {
        getSzinek(colorSelect.value);
    } else {
        getSzinek(3);
    }

    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect && themeSelect.value !== themeKey) {
        themeSelect.value = themeKey;
    }

    if (!jatekFut && !vegeAJateknak) {
        initPreviewBoard();
    }
}

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
    if (pontSzam >= 500) checkAchievement('first_500');
    if (pontSzam >= 10000) checkAchievement('score_10k');
}

/*############################## AUTH & TOPLISTA REGION ##############################*/

let pendingScore = null;

function setLeaderboardFeedback(msg, isError = true) {
    const el = document.getElementById('leaderboardFeedback');
    if (!el) return;
    el.textContent = msg;
    el.className = `feedback-msg ${isError ? 'error' : 'success'}`;
}

// Auth Modal Kezelés
const authModal = document.getElementById('authModal');
const openAuthModalBtn = document.getElementById('openAuthModalBtn');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const authModalTitle = document.getElementById('authModalTitle');
const displayNameField = document.getElementById('displayNameField');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authErrorMsg = document.getElementById('authErrorMsg');
const authPendingNotice = document.getElementById('authPendingNotice');
const pendingScoreVal = document.getElementById('pendingScoreVal');
const loggedInUserBox = document.getElementById('loggedInUserBox');
const currentUserNameLabel = document.getElementById('currentUserNameLabel');
const logoutBtn = document.getElementById('logoutBtn');

let isRegisterMode = false;

function openAuthModal(withPendingNotice = false) {
    if (!authModal) return;
    authModal.classList.remove('hidden');
    if (authErrorMsg) authErrorMsg.style.display = 'none';
    
    if (withPendingNotice && pendingScore) {
        if (authPendingNotice) authPendingNotice.style.display = 'flex';
        if (pendingScoreVal) pendingScoreVal.textContent = pendingScore.score;
    } else {
        if (authPendingNotice) authPendingNotice.style.display = 'none';
    }
}

function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.add('hidden');
    if (authErrorMsg) authErrorMsg.style.display = 'none';
}

if (openAuthModalBtn) {
    openAuthModalBtn.addEventListener('click', () => {
        setAuthMode(false);
        openAuthModal(false);
    });
}

if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', closeAuthModal);
}

if (authModal) {
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal && !authModal.classList.contains('hidden')) {
        closeAuthModal();
    }
});

function setAuthMode(register) {
    isRegisterMode = register;
    if (tabLoginBtn) tabLoginBtn.classList.toggle('active', !register);
    if (tabRegisterBtn) tabRegisterBtn.classList.toggle('active', register);
    if (displayNameField) displayNameField.style.display = register ? 'flex' : 'none';
    if (authModalTitle) authModalTitle.textContent = register ? 'Új fiók regisztrációja' : 'Bejelentkezés';
    if (authSubmitBtn) authSubmitBtn.textContent = register ? 'Regisztráció és mentés' : 'Bejelentkezés';
    const forgotPwWrap = document.getElementById('forgotPasswordWrap');
    if (forgotPwWrap) forgotPwWrap.style.display = register ? 'none' : 'flex';
    if (authErrorMsg) authErrorMsg.style.display = 'none';
}

if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => setAuthMode(false));
if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', () => setAuthMode(true));

// Elfelejtett jelszó eseménykezelő
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', async () => {
        const email = document.getElementById('authEmail')?.value.trim();
        if (!email) {
            showAuthError('Kérlek írd be az e-mail címed a fenti mezőbe az új jelszó kéréséhez!');
            document.getElementById('authEmail')?.focus();
            return;
        }
        forgotPasswordBtn.disabled = true;
        forgotPasswordBtn.textContent = 'Küldés folyamatban...';
        const res = await window.authService.resetPassword(email);
        forgotPasswordBtn.disabled = false;
        forgotPasswordBtn.textContent = 'Elfelejtetted a jelszavad?';
        if (res.success) {
            showToast(res.message, 'success');
            if (authErrorMsg) {
                authErrorMsg.textContent = res.message;
                authErrorMsg.style.display = 'block';
                authErrorMsg.style.color = '#38bdf8';
                authErrorMsg.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                authErrorMsg.style.background = 'rgba(56, 189, 248, 0.12)';
            }
        } else {
            showAuthError(res.error);
        }
    });
}

// Jelszóváltoztatási Modal eseménykezelői
const passwordChangeModal = document.getElementById('passwordChangeModal');
const openChangePasswordModalBtn = document.getElementById('openChangePasswordModalBtn');
const closeChangePasswordModalBtn = document.getElementById('closeChangePasswordModalBtn');
const changePasswordForm = document.getElementById('changePasswordForm');
const changePasswordErrorMsg = document.getElementById('changePasswordErrorMsg');
const changePwEmailHint = document.getElementById('changePwEmailHint');

function openChangePasswordModal() {
    const user = window.authService?.getCurrentUser();
    if (!user) {
        showToast('Kérjük, előbb jelentkezz be a jelszavad megváltoztatásához!', 'info');
        openAuthModal(false);
        return;
    }
    if (changePwEmailHint) changePwEmailHint.textContent = user.email;
    if (changePasswordErrorMsg) changePasswordErrorMsg.style.display = 'none';
    const p1 = document.getElementById('newPasswordInput');
    const p2 = document.getElementById('confirmNewPasswordInput');
    if (p1) p1.value = '';
    if (p2) p2.value = '';
    if (passwordChangeModal) passwordChangeModal.classList.remove('hidden');
}

function closeChangePasswordModal() {
    if (passwordChangeModal) passwordChangeModal.classList.add('hidden');
}

if (openChangePasswordModalBtn) {
    openChangePasswordModalBtn.addEventListener('click', openChangePasswordModal);
}
if (closeChangePasswordModalBtn) {
    closeChangePasswordModalBtn.addEventListener('click', closeChangePasswordModal);
}
if (passwordChangeModal) {
    passwordChangeModal.addEventListener('click', (e) => {
        if (e.target === passwordChangeModal) closeChangePasswordModal();
    });
}

if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const p1 = document.getElementById('newPasswordInput')?.value;
        const p2 = document.getElementById('confirmNewPasswordInput')?.value;

        if (!p1 || p1.length < 6) {
            showChangePwError('Az új jelszónak legalább 6 karakter hosszúnak kell lennie!');
            return;
        }
        if (p1 !== p2) {
            showChangePwError('A két megadott jelszó nem egyezik!');
            return;
        }

        const submitBtn = document.getElementById('changePasswordSubmitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Módosítás folyamatban...';
        }

        const res = await window.authService.updatePassword(p1);

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Új jelszó mentése';
        }

        if (res.success) {
            closeChangePasswordModal();
            showToast('✅ A jelszavad sikeresen megváltozott!', 'success');
        } else {
            showChangePwError(res.error || 'Hiba történt a jelszómódosítás során.');
        }
    });
}

function showChangePwError(msg) {
    if (changePasswordErrorMsg) {
        changePasswordErrorMsg.textContent = msg;
        changePasswordErrorMsg.style.display = 'block';
    }
}

// Auth Form beküldése
const authForm = document.getElementById('authForm');
if (authForm) {
    authForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('authEmail')?.value.trim();
        const password = document.getElementById('authPassword')?.value;
        const displayName = document.getElementById('authDisplayName')?.value.trim();

        if (!email || !password) {
            showAuthError('Kérlek töltsd ki az e-mail és jelszó mezőket!');
            return;
        }

        if (isRegisterMode && (!displayName || displayName.length < 3)) {
            showAuthError('A játékosnévnek legalább 3 karakter hosszúnak kell lennie!');
            return;
        }

        authSubmitBtn.disabled = true;
        authSubmitBtn.textContent = 'Feldolgozás...';

        let res;
        if (isRegisterMode) {
            res = await window.authService.register(email, password, displayName);
        } else {
            res = await window.authService.login(email, password);
        }

        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = isRegisterMode ? 'Regisztráció és mentés' : 'Bejelentkezés';

        if (!res.success) {
            showAuthError(res.error || 'Hiba történt a művelet során.');
            return;
        }

        // Sikeres bejelentkezés / regisztráció
        closeAuthModal();
        showToast(`Üdvözlünk, ${res.user.displayName}!`, 'success');

        // Ha volt függőben lévő játékeredmény, azonnal elmentjük!
        if (pendingScore) {
            const scoreToSave = {
                id: Date.now(),
                name: res.user.displayName,
                score: pendingScore.score,
                color: pendingScore.color,
                duration: pendingScore.duration,
                timestamp: new Date().toISOString()
            };
            const saveRes = await toplistaHozzaadas(scoreToSave);
            pendingScore = null;
            showToast(`🎉 Eredményed (${scoreToSave.score} pont) mentve a ranglistára!`, 'success');
            setLeaderboardFeedback('Eredményed sikeresen rögzítve a profiloddal!', false);
            const overlaySaveBtn = document.getElementById('overlaySaveScoreBtn');
            if (overlaySaveBtn) overlaySaveBtn.style.display = 'none';
            await toplistaMegjelenites();
        }
    });
}

function showAuthError(msg) {
    if (authErrorMsg) {
        authErrorMsg.textContent = msg;
        authErrorMsg.style.display = 'block';
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await window.authService.logout();
        showToast('Sikeresen kijelentkeztél.', 'info');
    });
}

// Figyeljük a bejelentkezett felhasználót
if (window.authService) {
    window.authService.onAuthStateChanged(user => {
        updateAuthUI(user);
    });
}

function updateAuthUI(user) {
    if (user) {
        if (openAuthModalBtn) openAuthModalBtn.style.display = 'none';
        if (loggedInUserBox) loggedInUserBox.style.display = 'inline-flex';
        if (currentUserNameLabel) currentUserNameLabel.textContent = user.displayName;
        
        // Játék végi mentési gombok állapota
        const saveAsLoggedInBtn = document.getElementById('saveAsLoggedInBtn');
        const saveWithLoginModalBtn = document.getElementById('saveWithLoginModalBtn');
        const saveUserNameHint = document.getElementById('saveUserNameHint');
        if (saveAsLoggedInBtn) saveAsLoggedInBtn.style.display = 'block';
        if (saveWithLoginModalBtn) saveWithLoginModalBtn.style.display = 'none';
        if (saveUserNameHint) saveUserNameHint.textContent = user.displayName;
    } else {
        if (openAuthModalBtn) openAuthModalBtn.style.display = 'inline-flex';
        if (loggedInUserBox) loggedInUserBox.style.display = 'none';

        const saveAsLoggedInBtn = document.getElementById('saveAsLoggedInBtn');
        const saveWithLoginModalBtn = document.getElementById('saveWithLoginModalBtn');
        if (saveAsLoggedInBtn) saveAsLoggedInBtn.style.display = 'none';
        if (saveWithLoginModalBtn) saveWithLoginModalBtn.style.display = 'block';
    }
}

// Játék végi mentés gombok eseményei
const saveAsLoggedInBtn = document.getElementById('saveAsLoggedInBtn');
if (saveAsLoggedInBtn) {
    saveAsLoggedInBtn.addEventListener('click', async function () {
        const user = window.authService?.getCurrentUser();
        if (!user) {
            openAuthModal(true);
            return;
        }
        const score = pontSzam;
        const szinValaszto = document.getElementById('colorSelect');
        const jatekosAdat = {
            id: Date.now(),
            name: user.displayName,
            score: score,
            color: szinValaszto ? szinValaszto.value : '3',
            duration: MAX_TIME,
            timestamp: new Date().toISOString()
        };
        this.disabled = true;
        const res = await toplistaHozzaadas(jatekosAdat);
        if (res.success) {
            setLeaderboardFeedback('Eredményed sikeresen mentve a profiloddal!', false);
            showToast('Eredményed elmentve a ranglistára!', 'success');
            await toplistaMegjelenites();
        } else {
            setLeaderboardFeedback('Hiba történt a mentés során.', true);
        }
    });
}

const saveWithLoginModalBtn = document.getElementById('saveWithLoginModalBtn');
if (saveWithLoginModalBtn) {
    saveWithLoginModalBtn.addEventListener('click', function () {
        openAuthModal(true);
    });
}

const overlaySaveScoreBtn = document.getElementById('overlaySaveScoreBtn');
if (overlaySaveScoreBtn) {
    overlaySaveScoreBtn.addEventListener('click', function () {
        const user = window.authService?.getCurrentUser();
        if (user) {
            // Már be van lépve, azonnal mentjük
            saveAsLoggedInBtn?.click();
            overlaySaveScoreBtn.style.display = 'none';
        } else {
            openAuthModal(true);
        }
    });
}

async function toplistaHozzaadas(jatekosAdat) {
    if (window.leaderboardService) {
        return await window.leaderboardService.addScore(jatekosAdat);
    }
    let toplista = JSON.parse(localStorage.getItem('toplista')) || [];
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
            syncTag.title = window.leaderboardService.isOnline ? 'Firebase Online Szinkronizáció Aktív' : 'Helyi Mód';
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

    const timeUpMsg = document.getElementById('timeUpMessage');
    if (timeUpMsg) timeUpMsg.style.display = 'none';

    const appearLb = document.getElementById('appear-leaderboard');
    if (appearLb) appearLb.style.display = 'none';

    const overlay = document.getElementById('canvasOverlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlaySubtitle = document.getElementById('overlaySubtitle');
    const overlayBtn = document.getElementById('overlayStartBtn');
    const overlaySaveBtn = document.getElementById('overlaySaveScoreBtn');
    if (overlaySaveBtn) overlaySaveBtn.style.display = 'none';

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

const shuffleButton = document.getElementById('shuffleButton');
if (shuffleButton) {
    shuffleButton.addEventListener('click', executeBoardShuffle);
}

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

    const btn = document.getElementById('shuffleButton');
    if (btn) {
        btn.classList.add('is-spinning');
        setTimeout(() => btn.classList.remove('is-spinning'), 700);
    }

    isShufflingBoard = true;
    playSound(doublerKatt);
    screenShake = 3;

    // Két egymást követő elegáns neon lökéshullám középről
    shockwaves.push({
        x: LOGICAL_SIZE / 2,
        y: LOGICAL_SIZE / 2,
        radius: 12,
        maxRadius: LOGICAL_SIZE * 0.72,
        color: '#818cf8',
        alpha: 1
    });

    setTimeout(() => {
        shockwaves.push({
            x: LOGICAL_SIZE / 2,
            y: LOGICAL_SIZE / 2,
            radius: 10,
            maxRadius: LOGICAL_SIZE * 0.5,
            color: '#c084fc',
            alpha: 0.9
        });
    }, 90);

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

    // Fisher-Yates keverés
    for (let k = colors.length - 1; k > 0; k--) {
        const r = Math.floor(Math.random() * (k + 1));
        [colors[k], colors[r]] = [colors[r], colors[k]];
    }

    // Középponttól kifelé terjedő kaszkádolt "Pop & Swirl" animáció
    const centerX = (oszlopok - 1) / 2;
    const centerY = (sorok - 1) / 2;

    positions.forEach((pos, idx) => {
        const cell = grid[pos.y][pos.x];
        const dist = Math.hypot(pos.x - centerX, pos.y - centerY);
        const delay = dist * 26; // Távolság alapú hullám késleltetés

        setTimeout(() => {
            // 1. Fázis: Összezsugorodás
            cell.scale = 0.2;

            setTimeout(() => {
                // 2. Fázis: Színcsere + részecskeszikrák + ruganyos visszapattanás
                cell.color = colors[idx];
                cell.scale = 1.25;
                spawnCellParticles(pos.x, pos.y, colors[idx], 3);
            }, 100);
        }, delay);
    });

    spawnFloatingText(LOGICAL_SIZE / 2, LOGICAL_SIZE / 2, '⟳ PÁLYA ÚJRAKEVERVE!', '#818cf8');
    setComboStatus('⟳ Pálya újrakeverve! Keresd az új kombinációkat!', true);
    showToast('⟳ Pálya újrakeverve (10 mp újratöltődés)', 'info');

    setTimeout(() => {
        isShufflingBoard = false;
        updateHoverPreview();
        ellenorizdPalyaAllapot();
    }, 450);
}

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

const themeSelectEl = document.getElementById('themeSelect');
if (themeSelectEl) {
    themeSelectEl.addEventListener('change', function () {
        applyTheme(this.value);
        showToast(`Téma váltva: ${this.options[this.selectedIndex].text}`, 'info');
    });
}

const openAchievementsBtn = document.getElementById('openAchievementsBtn');
const closeAchievementsModalBtn = document.getElementById('closeAchievementsModalBtn');
const achievementsModal = document.getElementById('achievementsModal');

if (openAchievementsBtn) {
    openAchievementsBtn.addEventListener('click', () => {
        updateAchievementsUI();
        if (achievementsModal) achievementsModal.classList.remove('hidden');
    });
}
if (closeAchievementsModalBtn) {
    closeAchievementsModalBtn.addEventListener('click', () => {
        if (achievementsModal) achievementsModal.classList.add('hidden');
    });
}
if (achievementsModal) {
    achievementsModal.addEventListener('click', (e) => {
        if (e.target === achievementsModal) {
            achievementsModal.classList.add('hidden');
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

// Billentyűparancsok (M = Némítás)
document.addEventListener('keydown', function (e) {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'm' || e.key === 'M') {
        toggleVolume();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const selectedValue = localStorage.getItem('selectedColorCount') || '3';
    const selectEl = document.getElementById('colorSelect');
    if (selectEl) selectEl.value = selectedValue;
    applyTheme(currentTheme);
    applyAudioSettings();
    toplistaMegjelenites();
    initPreviewBoard();
    updateShuffleButtonUI();
    updateAchievementsUI();
    requestAnimationFrame(animationLoop);
});

/*############################## JATEK LOGIKA & POWERUPOK ##############################*/

function pluszIdoPowerUp() {
    remainingTime = Math.min(MAX_TIME + 30, remainingTime + 5);
    refreshTimerText();
}

function aktivaldPontduplazot(seconds = 5) {
    isDoublePointsActive = true;
    doublePointsRemainingTime = seconds;

    const banner = document.getElementById('doublePointsBanner');
    const badge = document.getElementById('frenzyTimerBadge');
    const bar = document.getElementById('frenzyProgressBar');
    const wrapper = document.getElementById('canvasWrapper');

    if (banner) banner.classList.remove('hidden');
    if (wrapper) wrapper.classList.add('frenzy-active');
    if (badge) badge.textContent = `${doublePointsRemainingTime.toFixed(1)}s`;
    if (bar) bar.style.width = '100%';

    showToast('⚡ 2× PONTDUPLÁZÓ AKTÍV 5 MÁSODPERCIG!', 'success');
    playSound(doublerKatt);

    if (doublePointsInterval) clearInterval(doublePointsInterval);
    doublePointsInterval = setInterval(() => {
        doublePointsRemainingTime = Math.max(0, doublePointsRemainingTime - 0.1);
        if (badge) badge.textContent = `${doublePointsRemainingTime.toFixed(1)}s`;
        if (bar) {
            const pct = Math.max(0, Math.min(100, (doublePointsRemainingTime / FRENZY_MAX_TIME) * 100));
            bar.style.width = `${pct}%`;
        }

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

    const overlay = document.getElementById('freezeOverlay');
    const badge = document.getElementById('freezeTimerBadge');
    const wrapper = document.getElementById('canvasWrapper');

    if (overlay) overlay.classList.remove('hidden');
    if (wrapper) wrapper.classList.add('freeze-active');
    if (badge) badge.textContent = `${freezeRemainingTime.toFixed(1)}s`;

    playSound(timeEffekt);
    triggerHaptic('freeze');
    showToast('❄ IDŐ MEGÁLLÍTVA 4 MÁSODPERCRE!', 'info');
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

function magnesPowerUp() {
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
    setComboStatus(`🧲 Szuper Mágnes: ${targetCount} db blokk egy óriási tömbbe rántva!`, true);
    showToast(`🧲 Szuper Mágnes: ${targetCount} db azonos színű blokk összevonzva!`, 'info');
}

function regisztraljKomboLepest() {
    comboStreak++;
    comboMultiplier = Math.min(5, 1 + Math.floor(comboStreak / 2));

    if (comboMultiplier >= 3) {
        checkAchievement('combo_x3');
    }
    if (comboMultiplier >= 5) {
        checkAchievement('combo_x5');
    }

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

/**
 * Számolja a táblán jelenleg lévő nem-üres színes blokkokat.
 */
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

/**
 * Ellenőrzi, hogy létezik-e még kattintható érvényes lépés:
 * 1. Van-e a táblán bármilyen power-up? (Mindegyik azonnal aktiválható)
 * 2. Van-e legalább egy 3 vagy több azonos színű szomszédos blokkból álló csoport?
 */
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
                return true; // Van power-up, a játékos bármikor rákattinthat!
            }
        }
    }

    // Ha kevesebb mint 3 blokk maradt és nincs power-up, nem lehet lépés
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
                return true; // Találtunk érvényes 3+ kombinációt!
            }
        }
    }

    return false;
}

/**
 * Véletlenszerű power-upok kiválasztása.
 * Az időbónusz (+5s) ritkább (csak 30% eséllyel kerül be a lehetséges készletbe).
 */
function valasszVeletlenPowerUpok(db = 4) {
    const basePows = ['cyan', 'pink', '#f97316', 'darkgreen', '#14b8a6', '#6366f1', '#0284c7', '#e11d48'];
    const shuffled = [...basePows].sort(() => 0.5 - Math.random());
    if (Math.random() < 0.3) {
        shuffled[Math.floor(Math.random() * shuffled.length)] = '#581845';
    }
    return shuffled.slice(0, db);
}

/**
 * Új tiszta tábla legördítése és friss power-upok elhelyezése
 */
function ujPalyaLedobas() {
    if (!jatekFut || vegeAJateknak) return;
    const szinSelect = document.getElementById('colorSelect');
    getSzinek(szinSelect ? szinSelect.value : '3');

    for (let i = 0; i < sorok; i++) {
        grid[i] = [];
        for (let j = 0; j < oszlopok; j++) {
            const rc = szinek[Math.floor(Math.random() * szinek.length)];
            // Látványos beugrás fentről (kaszkádolt késleltetéssel)
            grid[i][j] = createCell(rc, -(sorok - i) * 16 - (j % 2) * 8);
        }
    }

    // 4 új véletlenszerű power-up lehelyezése
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

/**
 * Pálya állapotának ellenőrzése minden lépés után:
 * - 0 blokk esetén: Tökéletes takarítás bónusz (+500p) & új pálya
 * - Nincs több lépés (Deadlock / Soft-lock) esetén: Dinamikus takarítási bónusz & új pálya
 */
function ellenorizdPalyaAllapot() {
    if (!jatekFut || vegeAJateknak || palyaUjratoltesFolyamatban) return;

    const maradt = szamolMaradtBlokk();

    // 1. eset: Teljesen letisztított pálya (0 blokk maradt)
    if (maradt === 0) {
        palyaUjratoltesFolyamatban = true;
        pontSzam += 500;
        updateScoreUI();
        playSound(doublerKatt);

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
        showToast('🌟 Tökéletes táblatakarítás! +500 pont bónusz!', 'success');

        setTimeout(() => {
            ujPalyaLedobas();
            palyaUjratoltesFolyamatban = false;
        }, 500);
        return;
    }

    // 2. eset: Soft-lock / Deadlock: van még blokk, de nincs érvényes lépés
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
        showToast(`${bonuszSzoveg} - Új pálya érkezik...`, 'info');

        // Maradék izolált blokkok látványos elporlasztása
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

// Régi függvénykompatibilitás
function ellenorizdPalyaTisztitas() {
    ellenorizdPalyaAllapot();
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
        // Pontduplázó power-up (5 mp Frenzy)
        spawnCellParticles(x, y, 'cyan', 16);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        gridUjraRendezes();
        aktivaldPontduplazot(5);
        spawnFloatingText(x, y, '2× FRENZY (5 mp)!', '#38bdf8');
        setComboStatus('⚡ 2× Pontduplázó: következő 5 mp-ben minden pontod duplázódik!', true);
        ellenorizdPalyaAllapot();
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
        const gained = 100 * (isDoublePointsActive ? 2 : 1);
        pontSzam += gained;
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, isDoublePointsActive ? `⇄ CUNAMI +${gained} (2×)` : `⇄ CUNAMI +${gained}`, '#f472b6');
        setComboStatus(`⇄ Teljes sor eltakarítva! (+${gained}p)`, true);
        ellenorizdPalyaAllapot();
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
        const gained = 100 * (isDoublePointsActive ? 2 : 1);
        pontSzam += gained;
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, isDoublePointsActive ? `⇅ OSZLOP +${gained} (2×)` : `⇅ OSZLOP +${gained}`, '#f97316');
        setComboStatus(`⇅ Teljes oszlop kilőve! (+${gained}p)`, true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === 'darkgreen') {
        // 3x3 TNT robbantás
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
        // Szín-bomba: egy teljes szín összes blokkját eltakarítja
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
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, isDoublePointsActive ? `✦ BOMB +${earned} (2×)` : `✦ BOMB +${earned}`, '#14b8a6');
        setComboStatus(`✦ Szín-bomba: ${wipedCount} blokk megsemmisítve! (+${earned}p)`, true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#6366f1') {
        // Pálya keverés: újrakeveri a blokkok színeit
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
        updateScoreUI();
        gridUjraRendezes();
        spawnFloatingText(x, y, isDoublePointsActive ? `⟳ KEVERÉS +${gained} (2×)` : `⟳ KEVERÉS +${gained}`, '#818cf8');
        setComboStatus(`⟳ Pálya újrakeverve! (+${gained}p)`, true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#581845') {
        // +5 mp idő power-up
        spawnCellParticles(x, y, '#581845', 14);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        playSound(timeEffekt);
        triggerHaptic('medium');
        gridUjraRendezes();
        pluszIdoPowerUp();
        spawnFloatingText(x, y, '+5 MP!', '#c084fc');
        setComboStatus('⌛ +5 másodperc extra idő!', true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#0284c7') {
        // Időfagyasztó Jégkocka power-up (❄)
        spawnCellParticles(x, y, '#0284c7', 16);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        gridUjraRendezes();
        aktivaldFagyasztast(4);
        spawnFloatingText(x, y, '❄ IDŐ MEGÁLLÍTVA!', '#7dd3fc');
        setComboStatus('❄ Időfagyasztó: 4 másodpercig nem telik az idő!', true);
        ellenorizdPalyaAllapot();
    } else if (targetColor === '#e11d48') {
        // Szuper Mágnes power-up (🧲)
        spawnCellParticles(x, y, '#e11d48', 16);
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        magnesPowerUp();
        ellenorizdPalyaAllapot();
    } else {
        // Normál színes négyzetek keresése (BFS)
        const torlendoNegyzetek = getTorlendoNegyzetek(x, y, targetColor);
        if (torlendoNegyzetek.length >= 3) {
            playSound(sikeresKatt);
            triggerHaptic('light');
            checkAchievement('first_match');
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

    // Képernyőrázkódás (TNT robbanásnál és effekteknél)
    if (screenShake > 0.2) {
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
    }

    // Sötét háttérrács kirajzolása (dinamikus háttér Frenzy és Freeze alatt)
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
    const toplistaMegjelenitesDiv = document.getElementById('appear-leaderboard');
    const szinValaszto = document.getElementById('colorSelect');
    const timeSelectEl = document.getElementById('timeSelect');

    szinValaszto.disabled = true;
    if (timeSelectEl) {
        timeSelectEl.disabled = true;
        MAX_TIME = parseInt(timeSelectEl.value, 10);
    }
    remainingTime = MAX_TIME;
    refreshTimerText();

    timerInterval = setInterval(function () {
        if (isFrozen) {
            return; // Időfagyasztó alatt nem számlálunk le!
        }
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
            const overlaySaveBtn = document.getElementById('overlaySaveScoreBtn');

            if (overlay) {
                overlay.classList.remove('hidden');
                if (overlayTitle) overlayTitle.textContent = `Végső pontszám: ${pontSzam}`;

                if (currentUser) {
                    if (overlaySubtitle) {
                        overlaySubtitle.textContent = `Szép játék, ${currentUser.displayName}! Mentsd el az eredményed az alábbi gombbal.`;
                    }
                    if (overlaySaveBtn) {
                        overlaySaveBtn.style.display = 'inline-flex';
                        overlaySaveBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg><span>Eredmény mentése (' + currentUser.displayName + ')</span>';
                    }
                } else {
                    // Bejelentkezés nélkül játszott -> elmentjük a pendingScore-ba
                    pendingScore = {
                        score: pontSzam,
                        color: szinValaszto ? szinValaszto.value : '3',
                        duration: MAX_TIME,
                        timestamp: new Date().toISOString()
                    };
                    if (overlaySubtitle) {
                        overlaySubtitle.textContent = `Elértél ${pontSzam} pontot! Jelentkezz be vagy regisztrálj most, és az eredményed azonnal rögzítésre kerül!`;
                    }
                    if (overlaySaveBtn) {
                        overlaySaveBtn.style.display = 'inline-flex';
                        overlaySaveBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg><span>Mentés bejelentkezéssel</span>';
                    }
                    // Automatikus párbeszédablak megnyitás
                    setTimeout(() => {
                        openAuthModal(true);
                    }, 400);
                }

                if (overlayBtn) {
                    overlayBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg><span>Új játék kezdése</span>';
                }
            }

            if (toplistaMegjelenitesDiv) toplistaMegjelenitesDiv.style.display = 'block';
            szinValaszto.disabled = false;
            if (timeSelectEl) timeSelectEl.disabled = false;
            const startBtn = document.getElementById('startGameButton');
            if (startBtn) startBtn.disabled = false;

            updateScoreUI(true);
            setComboStatus('Lejárt az idő!', false);
        }
    }, 1000);
}
