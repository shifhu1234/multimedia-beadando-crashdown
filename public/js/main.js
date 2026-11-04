/* ================================================================
   CRASHDOWN ARCADE - MAIN APPLICATION BOOTSTRAP & EVENT LISTENERS
   ================================================================ */

// Fő gombok bekötése
document.getElementById('startGameButton')?.addEventListener('click', startMatch);
document.getElementById('startNewGame')?.addEventListener('click', ujJatekInditasaFunc);

const overlayStartBtn = document.getElementById('overlayStartBtn');
if (overlayStartBtn) {
    overlayStartBtn.addEventListener('click', startMatch);
}

const overlaySaveScoreBtn = document.getElementById('overlaySaveScoreBtn');
if (overlaySaveScoreBtn) {
    overlaySaveScoreBtn.addEventListener('click', () => {
        openAuthModal(true);
    });
}

const shuffleButton = document.getElementById('shuffleButton');
if (shuffleButton) {
    shuffleButton.addEventListener('click', executeBoardShuffle);
}

// Nehézség (színek száma) választó
const colorSelect = document.getElementById('colorSelect');
if (colorSelect) {
    const savedColors = localStorage.getItem('selectedColorCount');
    if (savedColors) colorSelect.value = savedColors;

    colorSelect.addEventListener('change', function () {
        localStorage.setItem('selectedColorCount', this.value);
        getSzinek(this.value);
        if (!jatekFut && !vegeAJateknak && typeof initPreviewBoard === 'function') {
            initPreviewBoard();
        }
        if (typeof updateCanvasOverlaySettings === 'function') {
            updateCanvasOverlaySettings();
        }
        showToast(`Nehézség beállítva: ${this.value} szín`, 'info');
    });
}

// Játékidő választó
const timeSelect = document.getElementById('timeSelect');
if (timeSelect) {
    const savedTime = localStorage.getItem('selectedGameTime');
    if (savedTime) timeSelect.value = savedTime;

    timeSelect.addEventListener('change', function () {
        localStorage.setItem('selectedGameTime', this.value);
        MAX_TIME = parseInt(this.value, 10);
        remainingTime = MAX_TIME;
        refreshTimerText();
        if (typeof updateCanvasOverlaySettings === 'function') {
            updateCanvasOverlaySettings();
        }
        showToast(`Játékidő beállítva: ${this.options[this.selectedIndex].text}`, 'info');
    });
}

// Játékmód választó
const modeSelect = document.getElementById('modeSelect');
if (modeSelect) {
    const savedMode = localStorage.getItem('selectedGameMode');
    if (savedMode) modeSelect.value = savedMode;

    modeSelect.addEventListener('change', function () {
        localStorage.setItem('selectedGameMode', this.value);
        if (typeof updateCanvasOverlaySettings === 'function') {
            updateCanvasOverlaySettings();
        }
        showToast(`Játékmód beállítva: ${this.options[this.selectedIndex].text}`, 'info');
    });
}

// Téma választó
const themeSelectEl = document.getElementById('themeSelect');
if (themeSelectEl) {
    themeSelectEl.addEventListener('change', function () {
        applyTheme(this.value);
    });
}

// Jelvények / Eredmények Modal eseménykezelői
const openAchievementsBtn = document.getElementById('openAchievementsBtn');
const closeAchievementsModalBtn = document.getElementById('closeAchievementsModalBtn');
const achievementsModal = document.getElementById('achievementsModal');

function openAchievementsModal() {
    updateAchievementsUI();
    if (achievementsModal) achievementsModal.classList.remove('hidden');
}

function closeAchievementsModal() {
    if (achievementsModal) achievementsModal.classList.add('hidden');
}

if (openAchievementsBtn) openAchievementsBtn.addEventListener('click', openAchievementsModal);
if (closeAchievementsModalBtn) closeAchievementsModalBtn.addEventListener('click', closeAchievementsModal);
if (achievementsModal) {
    achievementsModal.addEventListener('click', (e) => {
        if (e.target === achievementsModal) closeAchievementsModal();
    });
}

// Jelvény kategória szűrő gombok
document.querySelectorAll('.ach-filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.ach-filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        applyAchievementFilter(this.getAttribute('data-filter'));
    });
});

// Profil Modal bezárás
const closePlayerProfileModalBtn = document.getElementById('closePlayerProfileModalBtn');
const playerProfileModal = document.getElementById('playerProfileModal');

function closePlayerProfileModal() {
    if (playerProfileModal) playerProfileModal.classList.add('hidden');
}

if (closePlayerProfileModalBtn) closePlayerProfileModalBtn.addEventListener('click', closePlayerProfileModal);
if (playerProfileModal) {
    playerProfileModal.addEventListener('click', (e) => {
        if (e.target === playerProfileModal) closePlayerProfileModal();
    });
}

// Felső fejléc saját profil gomb kattintás
const openMyProfileBtn = document.getElementById('openMyProfileBtn');
if (openMyProfileBtn) {
    openMyProfileBtn.addEventListener('click', () => {
        const currentUser = window.authService?.getCurrentUser();
        if (currentUser && currentUser.displayName) {
            openPlayerProfileModal(currentUser.displayName);
        }
    });
}

// Auth modal eseménykezelők
const openAuthModalBtn = document.getElementById('openAuthModalBtn');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const authModal = document.getElementById('authModal');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const authForm = document.getElementById('authForm');
const logoutBtn = document.getElementById('logoutBtn');

if (openAuthModalBtn) {
    openAuthModalBtn.addEventListener('click', () => {
        setAuthMode(false);
        openAuthModal(false);
    });
}

if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);
if (authModal) {
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });
}

if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => setAuthMode(false));
if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', () => setAuthMode(true));

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
            const authErrorMsg = document.getElementById('authErrorMsg');
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

if (authForm) {
    authForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('authEmail')?.value.trim();
        const password = document.getElementById('authPassword')?.value;
        const displayName = document.getElementById('authDisplayName')?.value.trim();
        const authSubmitBtn = document.getElementById('authSubmitBtn');

        if (!email || !password) {
            showAuthError('Kérlek töltsd ki az e-mail és jelszó mezőket!');
            return;
        }

        if (isRegisterMode && (!displayName || displayName.length < 3)) {
            showAuthError('A játékosnévnek legalább 3 karakter hosszúnak kell lennie!');
            return;
        }

        if (authSubmitBtn) {
            authSubmitBtn.disabled = true;
            authSubmitBtn.textContent = 'Feldolgozás...';
        }

        let res;
        if (isRegisterMode) {
            res = await window.authService.register(email, password, displayName);
        } else {
            res = await window.authService.login(email, password);
        }

        if (authSubmitBtn) {
            authSubmitBtn.disabled = false;
            authSubmitBtn.textContent = isRegisterMode ? 'Regisztráció és mentés' : 'Bejelentkezés';
        }

        if (!res.success) {
            showAuthError(res.error || 'Hiba történt a művelet során.');
            return;
        }

        closeAuthModal();
        showToast(`Üdvözlünk, ${res.user.displayName}!`, 'success');

        if (pendingScore) {
            const scoreToSave = {
                id: Date.now(),
                name: res.user.displayName,
                score: pendingScore.score,
                color: pendingScore.color,
                modifier: pendingScore.modifier || 'normal',
                duration: pendingScore.duration,
                timestamp: new Date().toISOString()
            };
            await toplistaHozzaadas(scoreToSave);
            updatePlayerStatsRecord(res.user.displayName, scoreToSave.score, scoreToSave.color, scoreToSave.duration, scoreToSave.modifier);
            pendingScore = null;
            showToast(`🎉 Eredményed (${scoreToSave.score} pont) mentve a ranglistára!`, 'success');
            const overlaySaveBtn = document.getElementById('overlaySaveScoreBtn');
            if (overlaySaveBtn) overlaySaveBtn.style.display = 'none';
            await toplistaMegjelenites();
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await window.authService.logout();
        showToast('Sikeresen kijelentkeztél.', 'info');
    });
}

// Jelszóváltás modal eseménykezelők
const openChangePasswordModalBtn = document.getElementById('openChangePasswordModalBtn');
const closeChangePasswordModalBtn = document.getElementById('closeChangePasswordModalBtn');
const changePasswordForm = document.getElementById('changePasswordForm');

if (openChangePasswordModalBtn) openChangePasswordModalBtn.addEventListener('click', openChangePasswordModal);
if (closeChangePasswordModalBtn) closeChangePasswordModalBtn.addEventListener('click', closeChangePasswordModal);

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
            if (typeof closeChangePasswordModal === 'function') closeChangePasswordModal();
            const input1 = document.getElementById('newPasswordInput');
            const input2 = document.getElementById('confirmNewPasswordInput');
            if (input1) input1.value = '';
            if (input2) input2.value = '';
            const errEl = document.getElementById('changePasswordErrorMsg');
            if (errEl) errEl.style.display = 'none';
            showToast('✅ A jelszavad sikeresen megváltozott!', 'success');
        } else {
            showChangePwError(res.error || 'Hiba történt a jelszómódosítás során.');
        }
    });
}

// Ranglista szűrő chip események
document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', function () {
        const filterType = this.getAttribute('data-filter-type') || 'color';
        const filterVal = this.getAttribute('data-filter');

        if (filterType === 'color') {
            document.querySelectorAll('#colorFilterGroup .filter-chip').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLeaderboardColorFilter = filterVal;
        } else if (filterType === 'mode') {
            document.querySelectorAll('#modeFilterGroup .filter-chip').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLeaderboardModeFilter = filterVal;
        } else if (filterType === 'time') {
            document.querySelectorAll('#timeFilterGroup .filter-chip').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLeaderboardTimeFilter = filterVal;
        }
        toplistaMegjelenites();
    });
});

// Mobil navigációs tabok
document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        switchToMobileTab(this.getAttribute('data-target'), true);
    });
});

// Escape billentyű az összes modálhoz
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAuthModal();
        closeChangePasswordModal();
        closeAchievementsModal();
        closePlayerProfileModal();
    }
});

// Firebase Auth figyelő
if (window.authService) {
    window.authService.onAuthStateChanged(user => {
        updateAuthUI(user);
    });
}

if (window.leaderboardService) {
    window.leaderboardService.onScoresChanged(() => {
        toplistaMegjelenites();
    });
}

// Alkalmazás indítása és inicializálása
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    updateThemeSelectUI();
    applyAudioSettings();
    initAudioListeners();
    toplistaMegjelenites();
    initPreviewBoard();
    updateShuffleButtonUI();
    updateAchievementsUI();
    requestAnimationFrame(animationLoop);
});
