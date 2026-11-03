/* ================================================================
   CRASHDOWN ARCADE - ACHIEVEMENTS, TITLES, AVATARS & USER STATS
   ================================================================ */

// ==================== MÉRFÖLDKÖVEK & JELVÉNYEK (36 DB) ====================
const ACHIEVEMENTS = [
    // 1. Kezdő & Pontszám mérföldkövek
    { id: 'first_match', icon: '🎯', title: 'Első Lépés', desc: 'Törölj ki egy legalább 3 blokkból álló csoportot!' },
    { id: 'first_500', icon: '⭐', title: 'Kezdő Pontgyűjtő', desc: 'Érj el legalább 500 pontot egy menetben!' },
    { id: 'score_1500', icon: '🏅', title: 'Haladó Törő', desc: 'Érj el legalább 1 500 pontot egy meccsben!' },
    { id: 'score_5000', icon: '🏆', title: 'Pontvadász', desc: 'Érj el legalább 5 000 pontot egyetlen játékban!' },
    { id: 'score_10k', icon: '👑', title: 'Crashdown Mester', desc: 'Lépd át a 10 000 pontos álomhatárt!' },
    { id: 'score_25k', icon: '🌌', title: 'Galaktikus Bajnok', desc: 'Érj el szédítő 25 000 pontot egy menetben!' },
    { id: 'score_50k', icon: '💎', title: 'Kozmikus Rekorder', desc: 'Lépd át a felfoghatatlan 50 000 pontos rekordot!' },

    // 2. Kombók & Láncreakciók
    { id: 'combo_x2', icon: '⚡', title: 'Kombó Kezdő', desc: 'Érj el 2×-es kombó szorzót gyors egymásutánban!' },
    { id: 'combo_x3', icon: '⚡', title: 'Kombó Guru', desc: 'Pörgesd fel a szorzót legalább 3×-os értékre!' },
    { id: 'combo_x4', icon: '🔥', title: 'Lángoló Kezek', desc: 'Érj el legalább 4×-es kombó szorzót játék közben!' },
    { id: 'combo_x5', icon: '🔥', title: 'Kombó Isten', desc: 'Érd el a maximális 5×-ös kombó csúcsot!' },
    { id: 'mega_clear', icon: '💥', title: 'Mega Törlés', desc: 'Takaríts el egyetlen kattintással legalább 8 blokkot!' },
    { id: 'hyper_clear', icon: '⚡', title: 'Kolosszus Törlés', desc: 'Takaríts el legalább 12 blokkot egyetlen kattintással!' },

    // 3. Power-Up Mester
    { id: 'tnt_boom', icon: '💣', title: 'TNT Szakértő', desc: 'Robbants fel egy 3×3-as TNT power-up blokkot!' },
    { id: 'freeze_time', icon: '❄️', title: 'Jégvarázs', desc: 'Fagyaszd be az időt az Időfagyasztó Jégkockával!' },
    { id: 'magnet_pull', icon: '🧲', title: 'Szuper Mágnes', desc: 'Ránts össze egy egész színt egy blokkba a Mágnessel!' },
    { id: 'color_bomb', icon: '✦', title: 'Szín-kataklizma', desc: 'Tisztíts let egy teljes színt a Szín-bomba használatával!' },
    { id: 'frenzy_master', icon: '⚡', title: 'Dupla vagy Semmi', desc: 'Aktiválj egy 2× Pontduplázó Frenzy időszakot!' },
    { id: 'time_bonus', icon: '⌛', title: 'Időutazó', desc: 'Gyűjts be egy +5 másodperces extra idő blokkot!' },

    // 4. Power-up Gyűjtő mérföldkövek
    { id: 'powerup_5', icon: '⚡', title: 'Power-up Kezdő', desc: 'Aktiválj összesen legalább 5 db power-upot!' },
    { id: 'powerup_10', icon: '✨', title: 'Power-up Gyűjtő', desc: 'Aktiválj összesen legalább 10 db power-upot!' },
    { id: 'powerup_25', icon: '💥', title: 'Power-up Mester', desc: 'Aktiválj összesen legalább 25 db power-upot!' },
    { id: 'powerup_50', icon: '👑', title: 'Power-up Titán', desc: 'Aktiválj összesen legalább 50 db power-upot!' },

    // 5. Stratégia & Játékmenet
    { id: 'perfect_clear', icon: '✨', title: 'Tiszta Pálya', desc: 'Pucold le az utolsó szálig az egész táblát (0 blokk)!' },
    { id: 'shuffle_master', icon: '⟳', title: 'Új Esély', desc: 'Használd a Pálya keverése funkciót szorult helyzetben!' },
    { id: 'speed_demon', icon: '🐆', title: 'Villám Kéz', desc: 'Kattints legalább 8 sikeres csoportra 10 másodpercen belül!' },
    { id: 'master_5_color', icon: '🌈', title: 'Színkavalkád', desc: 'Érj el legalább 2 000 pontot az 5 színű mester módban!' },

    // 6. Közösség, Mérkőzések & Játékidő
    { id: 'inspect_profile', icon: '🔍', title: 'Kíváncsi Szemek', desc: 'Nézd meg egy másik játékos profilját a ranglistán!' },
    { id: 'play_5_matches', icon: '🎮', title: 'Gyakori Vendég', desc: 'Játssz le legalább 5 teljes mérkőzést!' },
    { id: 'matches_10', icon: '⚔️', title: 'Harcedzett Zúzó', desc: 'Játssz le legalább 10 teljes mérkőzést!' },
    { id: 'play_20_matches', icon: '🔥', title: 'Elhivatott Zúzó', desc: 'Játssz le legalább 20 teljes mérkőzést!' },
    { id: 'matches_50', icon: '🎖️', title: 'Crashdown Veterán', desc: 'Játssz le legalább 50 teljes mérkőzést!' },
    { id: 'play_time_1m', icon: '⏱️', title: 'Bemelegítés', desc: 'Játssz összesen legalább 1 percet a játékban!' },
    { id: 'play_time_5m', icon: '⏳', title: 'Kitartó Blokkozó', desc: 'Játssz összesen legalább 5 percet!' },
    { id: 'play_time_15m', icon: '⌛', title: 'Időmester', desc: 'Érj el legalább 15 perc összesített játékidőt!' },
    { id: 'play_time_30m', icon: '🌌', title: 'Crashdown Fanatikus', desc: 'Tölts el legalább 30 percet a játékban!' }
];

// ==================== PROFILKÉPEK (AVATARS) RENDSZER ====================
const PROFILE_AVATARS = [
    { id: 'avatar_default', symbol: '👤', name: 'Alapértelmezett', achId: null },
    { id: 'avatar_ice', symbol: '🧊', name: 'Jégkristály', achId: 'freeze_time' },
    { id: 'avatar_fire', symbol: '🔥', name: 'Főnix Láng', achId: 'play_20_matches' },
    { id: 'avatar_bomb', symbol: '💣', name: 'Robbanófej', achId: 'tnt_boom' },
    { id: 'avatar_lightning', symbol: '⚡', name: 'Neon Villám', achId: 'hyper_clear' },
    { id: 'avatar_magnet', symbol: '🧲', name: 'Mágnes', achId: 'magnet_pull' },
    { id: 'avatar_crown', symbol: '👑', name: 'Arany Korona', achId: 'score_10k' },
    { id: 'avatar_diamond', symbol: '💎', name: 'Kozmikus Gyémánt', achId: 'score_50k' },
    { id: 'avatar_star', symbol: '✨', name: 'Szupernóva', achId: 'perfect_clear' },
    { id: 'avatar_rainbow', symbol: '🌈', name: 'Szivárvány Prizma', achId: 'master_5_color' },
    { id: 'avatar_speed', symbol: '🐆', name: 'Villám Párduc', achId: 'speed_demon' },
    { id: 'avatar_galaxy', symbol: '🌌', name: 'Kozmosz', achId: 'score_25k' },
    { id: 'avatar_sunset', symbol: '🌅', name: 'Naplemente', achId: 'powerup_10' },
    { id: 'avatar_detective', symbol: '🕵️', name: 'Detektív', achId: 'inspect_profile' },
    { id: 'avatar_hourglass', symbol: '⏳', name: 'Homokóra', achId: 'play_time_15m' },
    { id: 'avatar_sword', symbol: '⚔️', name: 'Lovagkard', achId: 'matches_10' },
    { id: 'avatar_flame_hand', symbol: '💥', name: 'Plazmagömb', achId: 'powerup_50' }
];

// ==================== RANGCÍMEK (PROFILE TITLES) RENDSZER ====================
const PROFILE_TITLES = [
    {
        id: 'title_beginner',
        name: '🔰 Kezdő Blokktörő',
        desc: 'Alapértelmezett kezdő rangcím minden játékosnak',
        achId: null,
        isUnlocked: (stats, achSet) => true
    },
    {
        id: 'title_advanced',
        name: '⭐ Haladó Játékos',
        desc: 'Érj el legalább 1 500 pontot vagy játssz 3 meccset',
        achId: null,
        isUnlocked: (stats, achSet) => (stats.bestScore >= 1500) || (stats.totalMatches >= 3)
    },
    {
        id: 'title_champion',
        name: '🏆 Crashdown Bajnok',
        desc: 'Érj el legalább 5 000 pontot egy meccsben',
        achId: 'score_5000',
        isUnlocked: (stats, achSet) => (stats.bestScore >= 5000) || achSet.has('score_5000')
    },
    {
        id: 'title_grandmaster',
        name: '👑 Crashdown Nagymester',
        desc: 'Lépd át a 10 000 pontos álomhatárt',
        achId: 'score_10k',
        isUnlocked: (stats, achSet) => (stats.bestScore >= 10000) || achSet.has('score_10k')
    },
    {
        id: 'title_legend',
        name: '🌌 Galaktikus Legenda',
        desc: 'Érj el szédítő 25 000 pontot',
        achId: 'score_25k',
        isUnlocked: (stats, achSet) => (stats.bestScore >= 25000) || achSet.has('score_25k')
    },
    {
        id: 'title_cosmic',
        name: '💎 Kozmikus Rekorder',
        desc: 'Lépd át az 50 000 pontos csúcsot',
        achId: 'score_50k',
        isUnlocked: (stats, achSet) => (stats.bestScore >= 50000) || achSet.has('score_50k')
    },
    {
        id: 'title_combo_mage',
        name: '⚡ Kombó Mágus',
        desc: 'Érd el a maximális 5×-ös kombó szorzót',
        achId: 'combo_x5',
        isUnlocked: (stats, achSet) => achSet.has('combo_x5')
    },
    {
        id: 'title_titan',
        name: '🌋 Titán Zúzó',
        desc: 'Takaríts el legalább 12 blokkot egyetlen kattintással',
        achId: 'hyper_clear',
        isUnlocked: (stats, achSet) => achSet.has('hyper_clear')
    },
    {
        id: 'title_speed',
        name: '🐆 Villámkezű',
        desc: 'Kattints legalább 8 sikeres csoportra 10 másodpercen belül',
        achId: 'speed_demon',
        isUnlocked: (stats, achSet) => achSet.has('speed_demon')
    },
    {
        id: 'title_color_master',
        name: '🌈 Színmester',
        desc: 'Érj el legalább 2 000 pontot az 5 színű mester módban',
        achId: 'master_5_color',
        isUnlocked: (stats, achSet) => achSet.has('master_5_color')
    },
    {
        id: 'title_demolition',
        name: '💣 Robbantómester',
        desc: 'Használj TNT robbantást vagy Szín-bombát',
        achId: 'tnt_boom',
        isUnlocked: (stats, achSet) => achSet.has('tnt_boom') || achSet.has('color_bomb')
    },
    {
        id: 'title_ice_lord',
        name: '❄️ Jégkirály',
        desc: 'Fagyaszd meg az időt az Időfagyasztóval',
        achId: 'freeze_time',
        isUnlocked: (stats, achSet) => achSet.has('freeze_time')
    },
    {
        id: 'title_magnet_force',
        name: '🧲 Mágneses Erőmű',
        desc: 'Ránts össze egy egész színt a Szuper Mágnessel',
        achId: 'magnet_pull',
        isUnlocked: (stats, achSet) => achSet.has('magnet_pull')
    },
    {
        id: 'title_perfectionist',
        name: '✨ Tökéletesség Híve',
        desc: 'Takarítsd le a teljes táblát 0 blokkra',
        achId: 'perfect_clear',
        isUnlocked: (stats, achSet) => achSet.has('perfect_clear')
    },
    {
        id: 'title_time_bender',
        name: '⏱️ Időhajlító',
        desc: 'Játssz legalább 10 percet vagy gyűjts időbónuszt',
        achId: 'time_bonus',
        isUnlocked: (stats, achSet) => (stats.totalPlaytimeSeconds >= 600) || achSet.has('time_bonus')
    },
    {
        id: 'title_veteran',
        name: '🛡️ Veterán Blokktörő',
        desc: 'Játssz le legalább 5 teljes meccset',
        achId: 'play_5_matches',
        isUnlocked: (stats, achSet) => stats.totalMatches >= 5 || achSet.has('play_5_matches')
    },
    {
        id: 'title_devoted',
        name: '🔥 Zúzó Legenda',
        desc: 'Játssz le legalább 20 teljes mérkőzést',
        achId: 'play_20_matches',
        isUnlocked: (stats, achSet) => stats.totalMatches >= 20 || achSet.has('play_20_matches')
    },
    {
        id: 'title_power_novice',
        name: '⚡ Energikus Zúzó',
        desc: 'Aktiválj legalább 5 power-upot',
        achId: 'powerup_5',
        isUnlocked: (stats, achSet) => achSet.has('powerup_5')
    },
    {
        id: 'title_power_collector',
        name: '✨ Power-up Mágus',
        desc: 'Aktiválj legalább 10 power-upot',
        achId: 'powerup_10',
        isUnlocked: (stats, achSet) => achSet.has('powerup_10')
    },
    {
        id: 'title_power_master',
        name: '💥 Power-up Varázsló',
        desc: 'Aktiválj legalább 25 power-upot',
        achId: 'powerup_25',
        isUnlocked: (stats, achSet) => achSet.has('powerup_25')
    },
    {
        id: 'title_power_titan',
        name: '👑 Power-up Titán',
        desc: 'Aktiválj legalább 50 power-upot',
        achId: 'powerup_50',
        isUnlocked: (stats, achSet) => achSet.has('powerup_50')
    },
    {
        id: 'title_inspector',
        name: '🔍 Profil Kutató',
        desc: 'Nézd meg egy másik játékos profilját a ranglistán',
        achId: 'inspect_profile',
        isUnlocked: (stats, achSet) => achSet.has('inspect_profile')
    },
    {
        id: 'title_time_1m',
        name: '⏱️ Bemelegítő Bajnok',
        desc: 'Játssz legalább 1 percet a játékban',
        achId: 'play_time_1m',
        isUnlocked: (stats, achSet) => (stats.totalPlaytimeSeconds >= 60) || achSet.has('play_time_1m')
    },
    {
        id: 'title_time_5m',
        name: '⏳ Kitartó Blokkozó',
        desc: 'Játssz legalább 5 percet a játékban',
        achId: 'play_time_5m',
        isUnlocked: (stats, achSet) => (stats.totalPlaytimeSeconds >= 300) || achSet.has('play_time_5m')
    },
    {
        id: 'title_time_15m',
        name: '⌛ Időúr',
        desc: 'Érj el legalább 15 perc összesített játékidőt',
        achId: 'play_time_15m',
        isUnlocked: (stats, achSet) => (stats.totalPlaytimeSeconds >= 900) || achSet.has('play_time_15m')
    },
    {
        id: 'title_time_30m',
        name: '🌌 Crashdown Fanatikus',
        desc: 'Érj el legalább 30 perc összesített játékidőt',
        achId: 'play_time_30m',
        isUnlocked: (stats, achSet) => (stats.totalPlaytimeSeconds >= 1800) || achSet.has('play_time_30m')
    },
    {
        id: 'title_matches_10',
        name: '⚔️ Harcedzett Zúzó',
        desc: 'Játssz le legalább 10 teljes mérkőzést',
        achId: 'matches_10',
        isUnlocked: (stats, achSet) => stats.totalMatches >= 10 || achSet.has('matches_10')
    },
    {
        id: 'title_matches_50',
        name: '🎖️ Crashdown Veterán',
        desc: 'Játssz le legalább 50 teljes mérkőzést',
        achId: 'matches_50',
        isUnlocked: (stats, achSet) => stats.totalMatches >= 50 || achSet.has('matches_50')
    },
    {
        id: 'title_combo_x4',
        name: '🔥 Lángoló Kezek',
        desc: 'Érj el legalább 4×-es kombó szorzót',
        achId: 'combo_x4',
        isUnlocked: (stats, achSet) => achSet.has('combo_x4')
    }
];

let recentSuccessfulClicks = [];
let currentAchievementFilter = 'all';

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

    const currentUser = window.authService?.getCurrentUser();
    if (currentUser && currentUser.displayName) {
        updatePlayerStatsRecord(currentUser.displayName, 0, '3', 0);
    }

    triggerHaptic('success');
    playSound(sikeresKatt);
    if (typeof showToast === 'function') {
        showToast(`🏆 Jelvény feloldva: ${ach.icon} ${ach.title}!`, 'success');
    }

    updateAchievementsUI();
}

function updateAchievementsUI() {
    const unlockedList = getUnlockedAchievements();
    const unlockedSet = new Set(unlockedList);
    const totalCount = ACHIEVEMENTS.length;
    const unlockedCount = unlockedList.length;
    const lockedCount = totalCount - unlockedCount;
    const percent = Math.round((unlockedCount / totalCount) * 100);

    const countEl = document.getElementById('unlockedAchievementsCount');
    const totalEl = document.getElementById('totalAchievementsCount');
    if (countEl) countEl.textContent = unlockedCount;
    if (totalEl) totalEl.textContent = totalCount;

    const summaryCountEl = document.getElementById('achievementsSummaryCount');
    const totalSummaryCountEl = document.getElementById('achievementsTotalSummaryCount');
    const percentEl = document.getElementById('achievementsPercent');
    const progressFill = document.getElementById('achievementsProgressFill');

    if (summaryCountEl) summaryCountEl.textContent = unlockedCount;
    if (totalSummaryCountEl) totalSummaryCountEl.textContent = totalCount;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (progressFill) progressFill.style.width = `${percent}%`;

    const fAll = document.getElementById('achFilterAllCount');
    const fUn = document.getElementById('achFilterUnlockedCount');
    const fLock = document.getElementById('achFilterLockedCount');
    if (fAll) fAll.textContent = totalCount;
    if (fUn) fUn.textContent = unlockedCount;
    if (fLock) fLock.textContent = lockedCount;

    const listContainer = document.getElementById('achievementsList');
    if (!listContainer) return;

    listContainer.innerHTML = ACHIEVEMENTS.map(ach => {
        const isUnlocked = unlockedSet.has(ach.id);
        const shouldHide = (currentAchievementFilter === 'unlocked' && !isUnlocked) || (currentAchievementFilter === 'locked' && isUnlocked);
        
        const linkedAv = (typeof PROFILE_AVATARS !== 'undefined') ? PROFILE_AVATARS.find(av => av.achId === ach.id) : null;
        const linkedTitle = (typeof PROFILE_TITLES !== 'undefined') ? PROFILE_TITLES.find(t => t.achId === ach.id) : null;
        const linkedTheme = (typeof THEMES_CATALOG !== 'undefined') ? THEMES_CATALOG.find(th => th.achId === ach.id) : null;
        
        const rewList = [];
        if (linkedAv) rewList.push(`Profilkép ${linkedAv.symbol}`);
        if (linkedTitle) rewList.push(`Rangcím ${linkedTitle.name.split(' ')[0] || ''}`);
        if (linkedTheme) rewList.push(`Téma: ${linkedTheme.name}`);
        const rewardSnippet = rewList.length > 0 ? `<div class="ach-card-reward-tag">🎁 Jutalmak: ${rewList.join(', ')}</div>` : '';

        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${shouldHide ? 'card-filtered-out' : ''}" data-ach-id="${ach.id}" data-unlocked="${isUnlocked ? '1' : '0'}">
                <div class="ach-card-header">
                    <div class="achievement-icon-wrap">${ach.icon}</div>
                    <span class="achievement-status">${isUnlocked ? 'Feloldva ✓' : '🔒 Zárolva'}</span>
                </div>
                <div class="achievement-info">
                    <strong>${ach.title}</strong>
                    <small>${ach.desc}</small>
                    ${rewardSnippet}
                </div>
            </div>
        `;
    }).join('');

    if (typeof updateThemeSelectUI === 'function') {
        updateThemeSelectUI();
    }
}

function applyAchievementFilter(filter) {
    currentAchievementFilter = filter;
    const listContainer = document.getElementById('achievementsList');
    if (!listContainer) return;

    const cards = listContainer.querySelectorAll('.achievement-card');
    cards.forEach(card => {
        const isUnlocked = card.getAttribute('data-unlocked') === '1';
        if (filter === 'all') {
            card.classList.remove('card-filtered-out');
        } else if (filter === 'unlocked') {
            card.classList.toggle('card-filtered-out', !isUnlocked);
        } else if (filter === 'locked') {
            card.classList.toggle('card-filtered-out', isUnlocked);
        }
    });
}

// Játékos profil statisztika frissítése és tárolása
function updatePlayerStatsRecord(username, score, colorCount, durationSeconds) {
    if (!username) return;
    try {
        const key = 'crashdown_player_profiles';
        const profiles = JSON.parse(localStorage.getItem(key) || '{}');
        const p = profiles[username] || {
            username: username,
            totalMatches: 0,
            totalPlaytimeSeconds: 0,
            bestScore: 0,
            achievements: [],
            modes: {},
            durations: {},
            history: [],
            chosenTitle: null,
            chosenAvatar: 'avatar_default'
        };

        if (!p.history) p.history = [];

        if (score > 0 || durationSeconds > 0) {
            p.totalMatches += 1;
            p.totalPlaytimeSeconds += parseInt(durationSeconds, 10) || 120;
            if (score > p.bestScore) p.bestScore = score;

            const cKey = String(colorCount || '3');
            if (!p.modes[cKey]) p.modes[cKey] = { matches: 0, bestScore: 0 };
            p.modes[cKey].matches += 1;
            if (score > p.modes[cKey].bestScore) p.modes[cKey].bestScore = score;

            const dKey = String(durationSeconds || '120');
            p.durations[dKey] = (p.durations[dKey] || 0) + 1;

            p.history.unshift({
                score: score,
                color: cKey,
                duration: parseInt(durationSeconds, 10) || 120,
                timestamp: new Date().toISOString()
            });
            if (p.history.length > 10) {
                p.history = p.history.slice(0, 10);
            }
        }

        const currentUser = window.authService?.getCurrentUser();
        if (currentUser && currentUser.displayName === username) {
            p.achievements = getUnlockedAchievements();
            p.chosenTitle = localStorage.getItem('crashdown_chosen_title') || p.chosenTitle;
            p.chosenAvatar = localStorage.getItem('crashdown_chosen_avatar') || p.chosenAvatar || 'avatar_default';
        }

        if (p.totalMatches >= 5) checkAchievement('play_5_matches');
        if (p.totalMatches >= 10) checkAchievement('matches_10');
        if (p.totalMatches >= 20) checkAchievement('play_20_matches');
        if (p.totalMatches >= 50) checkAchievement('matches_50');

        if (p.totalPlaytimeSeconds >= 60) checkAchievement('play_time_1m');
        if (p.totalPlaytimeSeconds >= 300) checkAchievement('play_time_5m');
        if (p.totalPlaytimeSeconds >= 900) checkAchievement('play_time_15m');
        if (p.totalPlaytimeSeconds >= 1800) checkAchievement('play_time_30m');

        profiles[username] = p;
        localStorage.setItem(key, JSON.stringify(profiles));
    } catch (e) {
        console.error('Hiba a játékos statisztika mentésekor:', e);
    }
}

function regisztraljPowerupHasznalatot() {
    let count = parseInt(localStorage.getItem('crashdown_powerup_count') || '0', 10);
    count += 1;
    localStorage.setItem('crashdown_powerup_count', count);
    if (count >= 5) checkAchievement('powerup_5');
    if (count >= 10) checkAchievement('powerup_10');
    if (count >= 25) checkAchievement('powerup_25');
    if (count >= 50) checkAchievement('powerup_50');
}

function getPlayerProfileStats(username, allScores = []) {
    let profile = null;
    try {
        const profiles = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
        profile = profiles[username] ? { ...profiles[username] } : null;
    } catch (e) {}

    const playerScores = allScores.filter(s => s.name && s.name.toLowerCase() === username.toLowerCase());

    if (!profile) {
        profile = {
            username: username,
            totalMatches: 0,
            totalPlaytimeSeconds: 0,
            bestScore: 0,
            achievements: [],
            modes: {},
            durations: {},
            history: [],
            chosenTitle: null,
            chosenAvatar: 'avatar_default'
        };
    }
    if (!profile.history) profile.history = [];

    playerScores.forEach(s => {
        const sc = parseInt(s.score, 10) || 0;
        if (sc > profile.bestScore) profile.bestScore = sc;
        const cKey = String(s.color || '3');
        if (!profile.modes[cKey]) profile.modes[cKey] = { matches: 0, bestScore: 0 };
        if (sc > profile.modes[cKey].bestScore) profile.modes[cKey].bestScore = sc;
    });

    if (profile.totalMatches < playerScores.length) {
        profile.totalMatches = playerScores.length;
    }
    if (profile.totalPlaytimeSeconds === 0 && playerScores.length > 0) {
        playerScores.forEach(s => {
            profile.totalPlaytimeSeconds += parseInt(s.duration, 10) || 120;
        });
    }

    const currentUser = window.authService?.getCurrentUser();
    if (currentUser && currentUser.displayName && currentUser.displayName.toLowerCase() === username.toLowerCase()) {
        profile.achievements = getUnlockedAchievements();
        profile.chosenTitle = localStorage.getItem('crashdown_chosen_title') || profile.chosenTitle;
        profile.chosenAvatar = localStorage.getItem('crashdown_chosen_avatar') || profile.chosenAvatar || 'avatar_default';
    }

    const achSet = new Set(profile.achievements || []);

    // Rangcím meghatározása
    let activeTitle = null;
    if (profile.chosenTitle) {
        const foundTitle = PROFILE_TITLES.find(t => t.id === profile.chosenTitle);
        if (foundTitle && foundTitle.isUnlocked(profile, achSet)) {
            activeTitle = foundTitle;
        }
    }
    if (!activeTitle) {
        for (let i = PROFILE_TITLES.length - 1; i >= 0; i--) {
            if (PROFILE_TITLES[i].isUnlocked(profile, achSet)) {
                activeTitle = PROFILE_TITLES[i];
                break;
            }
        }
    }
    profile.activeTitle = activeTitle || PROFILE_TITLES[0];

    // Profilkép (Avatar) meghatározása
    let activeAvatar = null;
    if (profile.chosenAvatar) {
        const foundAv = PROFILE_AVATARS.find(a => a.id === profile.chosenAvatar);
        if (foundAv && (!foundAv.achId || achSet.has(foundAv.achId))) {
            activeAvatar = foundAv;
        }
    }
    profile.activeAvatar = activeAvatar || PROFILE_AVATARS[0];

    return profile;
}
