/* ================================================================
   CRASHDOWN ARCADE - UI, MODALS, THEMES & LEADERBOARD
   ================================================================ */

let currentLeaderboardColorFilter = 'all';
let currentLeaderboardTimeFilter = 'all';
let pendingScore = null;

// ==================== TOAST RENDSZER (MAXIMUM 3 DARAB) ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Szigorúan maximum 3 darab toast maradhat
    while (container.children.length >= 3) {
        container.firstElementChild.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.22s ease';
        setTimeout(() => toast.remove(), 220);
    }, 2400);
}

// ==================== STÁTUSZ & PONT KIJELZŐ ====================
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
    if (pontSzam >= 1500) checkAchievement('score_1500');
    if (pontSzam >= 5000) checkAchievement('score_5000');
    if (pontSzam >= 10000) checkAchievement('score_10k');
    if (pontSzam >= 25000) checkAchievement('score_25k');
    if (pontSzam >= 50000) checkAchievement('score_5000');
    const colorSelect = document.getElementById('colorSelect');
    if (colorSelect && colorSelect.value === '5' && pontSzam >= 2000) checkAchievement('master_5_color');
}

// ==================== TÉMA KEZELÉS ====================
function updateThemeSelectUI() {
    const themeSelect = document.getElementById('themeSelect');
    if (!themeSelect) return;
    const unlockedAchs = getUnlockedAchievements();
    const achSet = new Set(unlockedAchs);

    themeSelect.innerHTML = THEMES_CATALOG.map(t => {
        const isUnlocked = !t.achId || achSet.has(t.achId);
        return `<option value="${t.id}">${isUnlocked ? '' : '🔒 '}${t.name}</option>`;
    }).join('');

    themeSelect.value = currentTheme;
}

function applyTheme(themeKey) {
    if (!THEME_PALETTES[themeKey]) themeKey = 'retro';

    const unlockedAchs = getUnlockedAchievements();
    const achSet = new Set(unlockedAchs);
    const themeObj = THEMES_CATALOG.find(t => t.id === themeKey) || THEMES_CATALOG[0];

    if (themeObj.achId && !achSet.has(themeObj.achId)) {
        const reqAch = ACHIEVEMENTS.find(a => a.id === themeObj.achId);
        showToast(`🔒 Ez a téma még zárolva van! Feloldáshoz: ${reqAch?.title || 'Mérföldkő'}`, 'warning');
        themeKey = currentTheme || 'retro';
    }

    currentTheme = themeKey;
    localStorage.setItem('crashdown_theme', themeKey);

    document.body.className = document.body.className.replace(/\btheme-[^\s]+\b/g, '').trim();
    document.body.classList.add(`theme-${themeKey}`);

    negyzetSzinek = THEME_PALETTES[themeKey] || THEME_PALETTES.retro;
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

    // Canvas azonnali frissítése újraszínezéssel
    if (jatekFut && palya && palya.length) {
        palya.forEach(sor => {
            sor.forEach(cella => {
                if (cella && (!cella.type || cella.type === 'normal')) {
                    if (!negyzetSzinek.includes(cella.color)) {
                        cella.color = negyzetSzinek[Math.floor(Math.random() * negyzetSzinek.length)];
                    }
                }
            });
        });
        if (typeof drawGrid === 'function') drawGrid();
    } else {
        if (typeof initPreviewBoard === 'function') initPreviewBoard();
        if (typeof drawGrid === 'function') drawGrid();
    }
}

// ==================== MOBIL TAB NAVIGÁCIÓ (AUTO GÖRGETÉSSEL A TETEJÉRE) ====================
function switchToMobileTab(targetId, shouldScroll = true) {
    document.querySelectorAll('.mobile-tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-target') === targetId);
    });
    document.querySelectorAll('.controls-panel, .game-stage, .leaderboard-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === targetId);
    });
    if (shouldScroll) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
}

// ==================== JÁTÉKOS PROFIL MODAL ====================
async function openPlayerProfileModal(username) {
    let allScores = [];
    if (window.leaderboardService) {
        allScores = await window.leaderboardService.getScores();
    } else {
        allScores = JSON.parse(localStorage.getItem('toplista')) || [];
    }

    const stats = getPlayerProfileStats(username, allScores);
    if (!stats.activeAvatar) {
        stats.activeAvatar = (typeof PROFILE_AVATARS !== 'undefined' && PROFILE_AVATARS[0])
            ? PROFILE_AVATARS[0]
            : { id: 'avatar_default', name: 'Alapértelmezett', symbol: '👤' };
    }
    if (!stats.activeTitle) {
        stats.activeTitle = (typeof PROFILE_TITLES !== 'undefined' && PROFILE_TITLES[0])
            ? PROFILE_TITLES[0]
            : { id: 'title_kevezo', name: 'Újonc Blokktörő' };
    }
    const currentUser = window.authService?.getCurrentUser();
    const isOwnProfile = currentUser && currentUser.displayName && currentUser.displayName.toLowerCase() === stats.username.toLowerCase();
    if (currentUser && !isOwnProfile) {
        checkAchievement('inspect_profile');
    }
    const achSet = new Set(stats.achievements || []);

    const nameEl = document.getElementById('profilePlayerName');
    const avatarEl = document.getElementById('profileAvatar');
    const titleEl = document.getElementById('profilePlayerTitle');
    const titleSelectEl = document.getElementById('profileTitleSelect');
    const bestScoreEl = document.getElementById('profileBestScore');
    const matchesEl = document.getElementById('profileTotalMatches');
    const timeEl = document.getElementById('profileTotalTime');
    const achCountEl = document.getElementById('profileAchievementsCount');
    const modesListEl = document.getElementById('profileModesBreakdown');
    const badgesListEl = document.getElementById('profileAchievementsList');
    const badgeSummaryEl = document.getElementById('profileBadgeSummary');

    if (nameEl) nameEl.textContent = stats.username;
    if (avatarEl) {
        avatarEl.textContent = stats.activeAvatar.symbol;
        avatarEl.title = `Profilkép: ${stats.activeAvatar.name}`;
    }

    if (titleEl) titleEl.textContent = stats.activeTitle.name;

    if (titleSelectEl) {
        if (isOwnProfile) {
            titleSelectEl.style.display = 'inline-block';
            titleSelectEl.innerHTML = PROFILE_TITLES.map(t => {
                const unlocked = t.isUnlocked(stats, achSet);
                const isSelected = stats.chosenTitle ? (t.id === stats.chosenTitle) : (t.id === stats.activeTitle.id);
                if (unlocked) {
                    return `<option value="${t.id}" ${isSelected ? 'selected' : ''}>${t.name} (✓ Feloldva)</option>`;
                } else {
                    return `<option value="${t.id}" disabled>🔒 ${t.name} (${t.desc})</option>`;
                }
            }).join('');

            titleSelectEl.onchange = function () {
                const chosenId = this.value;
                const titleObj = PROFILE_TITLES.find(t => t.id === chosenId);
                if (titleObj) {
                    localStorage.setItem('crashdown_chosen_title', chosenId);
                    stats.chosenTitle = chosenId;
                    stats.activeTitle = titleObj;

                    try {
                        const profiles = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
                        if (!profiles[stats.username]) {
                            profiles[stats.username] = { ...stats };
                        }
                        profiles[stats.username].chosenTitle = chosenId;
                        localStorage.setItem('crashdown_player_profiles', JSON.stringify(profiles));
                    } catch (e) {}

                    if (titleEl) titleEl.textContent = titleObj.name;
                    showToast(`🎖️ Új rangcím beállítva: ${titleObj.name}!`, 'success');
                    playSound(sikeresKatt);
                    triggerHaptic('success');
                    toplistaMegjelenites();
                }
            };
        } else {
            titleSelectEl.style.display = 'none';
        }
    }

    const avatarSection = document.getElementById('profileAvatarSection');
    const avatarGrid = document.getElementById('profileAvatarGrid');
    if (avatarSection && avatarGrid) {
        if (isOwnProfile) {
            avatarSection.style.display = 'block';
            avatarGrid.innerHTML = PROFILE_AVATARS.map(av => {
                const unlocked = !av.achId || achSet.has(av.achId);
                const isSelected = stats.activeAvatar.id === av.id;
                const reqAch = av.achId ? ACHIEVEMENTS.find(a => a.id === av.achId) : null;
                const lockTitle = reqAch ? `Zárolva: ${reqAch.title} (${reqAch.desc}) szükséges hozzá!` : '';
                return `
                    <div class="avatar-pick-card ${unlocked ? '' : 'locked'} ${isSelected ? 'active' : ''}"
                         data-avatar-id="${av.id}"
                         data-unlocked="${unlocked ? '1' : '0'}"
                         title="${unlocked ? av.name : lockTitle}">
                        ${!unlocked ? '<span class="avatar-lock-icon">🔒</span>' : ''}
                        <span class="avatar-pick-symbol">${av.symbol}</span>
                        <span class="avatar-pick-name">${av.name}</span>
                    </div>
                `;
            }).join('');

            avatarGrid.querySelectorAll('.avatar-pick-card').forEach(card => {
                card.addEventListener('click', function () {
                    const avId = this.getAttribute('data-avatar-id');
                    const isUnlocked = this.getAttribute('data-unlocked') === '1';
                    if (!isUnlocked) {
                        const avObj = PROFILE_AVATARS.find(a => a.id === avId);
                        const reqAch = avObj?.achId ? ACHIEVEMENTS.find(a => a.id === avObj.achId) : null;
                        showToast(`🔒 Ez a profilkép még zárolva van! Feloldáshoz: ${reqAch?.title || 'Teljesíts több mérföldkövet'}`, 'warning');
                        triggerHaptic('error');
                        if (typeof sorEffekt !== 'undefined') playSound(sorEffekt);
                        return;
                    }

                    const avObj = PROFILE_AVATARS.find(a => a.id === avId);
                    if (!avObj) return;

                    localStorage.setItem('crashdown_chosen_avatar', avId);
                    stats.chosenAvatar = avId;
                    stats.activeAvatar = avObj;

                    try {
                        const profiles = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
                        if (!profiles[stats.username]) {
                            profiles[stats.username] = { ...stats };
                        }
                        profiles[stats.username].chosenAvatar = avId;
                        localStorage.setItem('crashdown_player_profiles', JSON.stringify(profiles));
                    } catch (e) {}

                    if (avatarEl) avatarEl.textContent = avObj.symbol;
                    const userAvatarDot = document.getElementById('userAvatarDot');
                    if (userAvatarDot) userAvatarDot.textContent = avObj.symbol;

                    avatarGrid.querySelectorAll('.avatar-pick-card').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');

                    showToast(`🖼️ Új profilkép beállítva: ${avObj.symbol} ${avObj.name}!`, 'success');
                    playSound(sikeresKatt);
                    triggerHaptic('success');
                    toplistaMegjelenites();
                });
            });
        } else {
            avatarSection.style.display = 'none';
        }
    }

    if (bestScoreEl) bestScoreEl.textContent = stats.bestScore.toLocaleString();
    if (matchesEl) matchesEl.textContent = `${stats.totalMatches} meccs`;

    const mins = Math.floor(stats.totalPlaytimeSeconds / 60);
    const secs = stats.totalPlaytimeSeconds % 60;
    const timeStr = mins > 0 ? `${mins} perc ${secs > 0 ? `${secs} mp` : ''}` : `${secs} mp`;
    if (timeEl) timeEl.textContent = timeStr;

    const achList = stats.achievements || [];
    if (achCountEl) achCountEl.textContent = `${achList.length} / ${ACHIEVEMENTS.length}`;
    if (badgeSummaryEl) badgeSummaryEl.textContent = `${achList.length} feloldva a ${ACHIEVEMENTS.length}-ből`;

    if (modesListEl) {
        const modes = ['2', '3', '4', '5'];
        modesListEl.innerHTML = modes.map(m => {
            const data = stats.modes[m] || { matches: 0, bestScore: 0 };
            return `
                <div class="profile-mode-card">
                    <div>
                        <strong>${m} szín mód</strong>
                        <div style="font-size: 0.7rem; color: var(--text-secondary);">${data.matches} lejátszott meccs</div>
                    </div>
                    <span>${data.bestScore > 0 ? `${data.bestScore}p` : '-'}</span>
                </div>
            `;
        }).join('');
    }

    if (badgesListEl) {
        badgesListEl.innerHTML = ACHIEVEMENTS.map(a => {
            const unlocked = achSet.has(a.id);
            return `
                <div class="profile-badge-item ${unlocked ? 'unlocked' : 'locked'}" data-ach-id="${a.id}">
                    <span class="profile-badge-icon">${a.icon}</span>
                    <span class="profile-badge-name">${a.title}</span>
                </div>
            `;
        }).join('');

        const floatingTip = document.getElementById('profileBadgeFloatingTooltip');
        badgesListEl.querySelectorAll('.profile-badge-item').forEach(item => {
            const achId = item.getAttribute('data-ach-id');
            const a = ACHIEVEMENTS.find(x => x.id === achId);
            if (!a || !floatingTip) return;

            item.addEventListener('mouseenter', () => {
                const unlocked = achSet.has(a.id);
                
                // Kapcsolódó jutalmak felkutatása (profilkép, rangcím, téma)
                const linkedAv = (typeof PROFILE_AVATARS !== 'undefined') ? PROFILE_AVATARS.find(av => av.achId === a.id) : null;
                const linkedTitle = (typeof PROFILE_TITLES !== 'undefined') ? PROFILE_TITLES.find(t => t.achId === a.id) : null;
                const linkedTheme = (typeof THEMES_CATALOG !== 'undefined') ? THEMES_CATALOG.find(th => th.achId === a.id) : null;

                const rewardRows = [];
                if (linkedAv) {
                    rewardRows.push(`<div class="reward-line"><span>Profilkép</span> <span class="reward-sym">${linkedAv.symbol}</span></div>`);
                }
                if (linkedTitle) {
                    const titleSym = linkedTitle.name.split(' ')[0] || '🎖️';
                    rewardRows.push(`<div class="reward-line"><span>Rangcím</span> <span class="reward-sym">${titleSym}</span></div>`);
                }
                if (linkedTheme) {
                    rewardRows.push(`<div class="reward-line"><span>Téma</span> <span class="reward-sym">${linkedTheme.name}</span></div>`);
                }

                let rewardHtml = '';
                if (rewardRows.length > 0) {
                    rewardHtml = `
                        <div class="b-tooltip-reward">
                            <div class="reward-heading">Jutalmak:</div>
                            ${rewardRows.join('')}
                        </div>
                    `;
                }

                floatingTip.innerHTML = `
                    <div class="b-tooltip-header">
                        <span class="b-tooltip-title">${a.icon} ${a.title}</span>
                        <span class="b-tooltip-status ${unlocked ? 'unlocked' : 'locked'}">${unlocked ? 'Megszerezve ✓' : '🔒 Zárolva'}</span>
                    </div>
                    <p class="b-tooltip-desc">${a.desc}</p>
                    ${rewardHtml}
                `;

                const rect = item.getBoundingClientRect();
                const tipWidth = 240;
                let tipLeft = rect.left + (rect.width / 2) - (tipWidth / 2);
                tipLeft = Math.max(12, Math.min(window.innerWidth - tipWidth - 12, tipLeft));

                let tipTop = rect.top - (rewardRows.length > 0 ? 94 : 72);
                if (tipTop < 10) {
                    tipTop = rect.bottom + 8;
                }

                floatingTip.style.left = `${tipLeft}px`;
                floatingTip.style.top = `${tipTop}px`;
                floatingTip.style.display = 'block';
                floatingTip.style.opacity = '1';
            });

            item.addEventListener('mouseleave', () => {
                if (floatingTip) {
                    floatingTip.style.display = 'none';
                    floatingTip.style.opacity = '0';
                }
            });
        });
    }

    const historyListEl = document.getElementById('profileHistoryList');
    if (historyListEl) {
        const history = stats.history || [];
        if (history.length === 0) {
            historyListEl.innerHTML = '<div class="history-empty">Még nincs rögzített meccselőzmény. Játssz le egy mérkőzést!</div>';
        } else {
            historyListEl.innerHTML = history.map(item => {
                const dateObj = item.timestamp ? new Date(item.timestamp) : new Date();
                const dateStr = dateObj.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `
                    <div class="profile-history-item">
                        <div class="history-left">
                            <span class="history-mode-tag">${item.color} szín • ${item.duration}s</span>
                            <span class="history-date">${dateStr}</span>
                        </div>
                        <div class="history-right">
                            <span class="history-score">${item.score} p</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    const modal = document.getElementById('playerProfileModal');
    if (modal) modal.classList.remove('hidden');
}

// ==================== AUTH MODAL KEZELÉS ====================
let isRegisterMode = false;

function openAuthModal(withPendingNotice = false) {
    const authModal = document.getElementById('authModal');
    const authErrorMsg = document.getElementById('authErrorMsg');
    const authPendingNotice = document.getElementById('authPendingNotice');
    const pendingScoreVal = document.getElementById('pendingScoreVal');
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
    const authModal = document.getElementById('authModal');
    const authErrorMsg = document.getElementById('authErrorMsg');
    if (!authModal) return;
    authModal.classList.add('hidden');
    if (authErrorMsg) authErrorMsg.style.display = 'none';
}

function setAuthMode(register) {
    isRegisterMode = register;
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    const displayNameField = document.getElementById('displayNameField');
    const authModalTitle = document.getElementById('authModalTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const forgotPwWrap = document.getElementById('forgotPasswordWrap');
    const authErrorMsg = document.getElementById('authErrorMsg');

    if (tabLoginBtn) tabLoginBtn.classList.toggle('active', !register);
    if (tabRegisterBtn) tabRegisterBtn.classList.toggle('active', register);
    if (displayNameField) displayNameField.style.display = register ? 'flex' : 'none';
    if (authModalTitle) authModalTitle.textContent = register ? 'Új fiók regisztrációja' : 'Bejelentkezés';
    if (authSubmitBtn) authSubmitBtn.textContent = register ? 'Regisztráció és mentés' : 'Bejelentkezés';
    if (forgotPwWrap) forgotPwWrap.style.display = register ? 'none' : 'flex';
    if (authErrorMsg) authErrorMsg.style.display = 'none';
}

function showAuthError(msg) {
    const authErrorMsg = document.getElementById('authErrorMsg');
    if (authErrorMsg) {
        authErrorMsg.textContent = msg;
        authErrorMsg.style.display = 'block';
    }
}

// ==================== JELSZÓMÓDOSÍTÁS MODAL ====================
function openChangePasswordModal() {
    const user = window.authService?.getCurrentUser();
    if (!user) {
        showToast('Kérjük, előbb jelentkezz be a jelszavad megváltoztatásához!', 'info');
        openAuthModal(false);
        return;
    }
    const changePwEmailHint = document.getElementById('changePwEmailHint');
    const changePasswordErrorMsg = document.getElementById('changePasswordErrorMsg');
    const p1 = document.getElementById('newPasswordInput');
    const p2 = document.getElementById('confirmNewPasswordInput');
    const modal = document.getElementById('passwordChangeModal');

    if (changePwEmailHint) changePwEmailHint.textContent = user.email;
    if (changePasswordErrorMsg) changePasswordErrorMsg.style.display = 'none';
    if (p1) p1.value = '';
    if (p2) p2.value = '';
    if (modal) modal.classList.remove('hidden');
}

function closeChangePasswordModal() {
    const modal = document.getElementById('passwordChangeModal');
    if (modal) modal.classList.add('hidden');
}

function showChangePwError(msg) {
    const changePasswordErrorMsg = document.getElementById('changePasswordErrorMsg');
    if (changePasswordErrorMsg) {
        changePasswordErrorMsg.textContent = msg;
        changePasswordErrorMsg.style.display = 'block';
    }
}

// ==================== AUTH UI ÁLLAPOT FRISSÍTÉSE ====================
function updateAuthUI(user) {
    const openAuthBtn = document.getElementById('openAuthModalBtn');
    const myProfileBtn = document.getElementById('openMyProfileBtn');
    const changePwBtn = document.getElementById('openChangePasswordModalBtn');
    const logoutBtnEl = document.getElementById('logoutBtn');
    const nameLabel = document.getElementById('currentUserNameLabel');
    const avatarDot = document.getElementById('userAvatarDot');
    const openAchievementsBtn = document.getElementById('openAchievementsBtn');

    if (user) {
        if (openAuthBtn) openAuthBtn.style.display = 'none';
        if (openAchievementsBtn) openAchievementsBtn.style.display = 'inline-flex';
        if (myProfileBtn) myProfileBtn.style.display = 'inline-flex';
        if (changePwBtn) changePwBtn.style.display = 'inline-flex';
        if (logoutBtnEl) logoutBtnEl.style.display = 'inline-flex';

        if (nameLabel) nameLabel.textContent = user.displayName;
        try {
            const myStats = getPlayerProfileStats(user.displayName);
            if (avatarDot) avatarDot.textContent = myStats?.activeAvatar?.symbol || '👤';
        } catch (e) {}
    } else {
        if (openAuthBtn) openAuthBtn.style.display = 'inline-flex';
        if (openAchievementsBtn) openAchievementsBtn.style.display = 'none';
        if (myProfileBtn) myProfileBtn.style.display = 'none';
        if (changePwBtn) changePwBtn.style.display = 'none';
        if (logoutBtnEl) logoutBtnEl.style.display = 'none';
    }
}

// ==================== RANGLISTA SERVICE & MEGJELENÍTÉS ====================
async function toplistaHozzaadas(jatekosAdat) {
    if (window.leaderboardService) {
        return await window.leaderboardService.addScore(jatekosAdat);
    }
    let toplista = JSON.parse(localStorage.getItem('toplista')) || [];
    const userNameLower = String(jatekosAdat.name || '').trim().toLowerCase();
    const targetColor = String(jatekosAdat.color || '3');
    const newScore = parseInt(jatekosAdat.score, 10) || 0;

    const existingIndex = toplista.findIndex(s => 
        String(s.name || '').trim().toLowerCase() === userNameLower &&
        String(s.color || '3') === targetColor
    );

    let isRecord = false;
    let previousBest = 0;

    if (existingIndex !== -1) {
        const existing = toplista[existingIndex];
        previousBest = parseInt(existing.score, 10) || 0;
        if (newScore > previousBest) {
            existing.score = newScore;
            existing.duration = jatekosAdat.duration;
            existing.timestamp = jatekosAdat.timestamp;
            isRecord = true;
        } else {
            return { success: true, isRecord: false, previousBest: previousBest };
        }
    } else {
        toplista.push(jatekosAdat);
        isRecord = true;
    }

    toplista.sort((a, b) => b.score - a.score);
    localStorage.setItem('toplista', JSON.stringify(toplista));
    return { success: true, isRecord: isRecord, previousBest: previousBest, isOnline: false };
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

    if (currentLeaderboardColorFilter !== 'all') {
        toplista = toplista.filter(elem => String(elem.color) === String(currentLeaderboardColorFilter));
    }
    if (currentLeaderboardTimeFilter !== 'all') {
        toplista = toplista.filter(elem => String(elem.duration || '60') === String(currentLeaderboardTimeFilter));
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
        listaElem.className = `leaderboard-item ${i < 3 ? `rank-${i + 1}` : ''} lb-clickable`;
        listaElem.title = `Kattints ${elem.name} profiljának és statisztikáinak megtekintéséhez!`;
        listaElem.addEventListener('click', () => {
            openPlayerProfileModal(elem.name);
        });

        const leftDiv = document.createElement('div');
        leftDiv.className = 'lb-left';

        const rankSpan = document.createElement('span');
        rankSpan.className = 'lb-rank';
        rankSpan.textContent = i < 3 ? medals[i] : `${i + 1}.`;
        leftDiv.appendChild(rankSpan);

        try {
            const pStats = getPlayerProfileStats(elem.name, toplista);
            if (pStats && pStats.activeAvatar) {
                const avatarSpan = document.createElement('span');
                avatarSpan.className = 'lb-avatar';
                avatarSpan.textContent = pStats.activeAvatar.symbol;
                avatarSpan.title = `Profilkép: ${pStats.activeAvatar.name}`;
                leftDiv.appendChild(avatarSpan);
            }
        } catch (e) {}

        const rawName = String(elem.name || 'Játékos');
        const dispName = rawName.length > 13 ? rawName.slice(0, 12) + '...' : rawName;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'lb-name';
        nameSpan.textContent = dispName;
        nameSpan.title = rawName;
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
