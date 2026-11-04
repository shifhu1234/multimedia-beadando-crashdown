/* ================================================================
   CRASHDOWN ARCADE - UI, MODALS, THEMES & LEADERBOARD
   ================================================================ */

let currentLeaderboardColorFilter = "all";
let currentLeaderboardModeFilter = "all";
let currentLeaderboardTimeFilter = "all";
let pendingScore = null;
let openedProfileFromPlayersModal = false;

// ==================== PONTSZÁM FORMÁZÓ (3 SZÁMJEGYENKÉNT VESSZŐVEL) ====================
function formatScore(score) {
  if (score === null || score === undefined || score === "") return "0";
  const num = typeof score === "number" ? Math.round(score) : parseInt(score, 10);
  if (isNaN(num)) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
window.formatScore = formatScore;

// ==================== ADMINISZTRÁTOR JOGOSULTSÁG ====================
const ADMIN_EMAIL = "n.gabikaa03@gmail.com";

function isEligibleAdmin() {
  const user = window.authService?.getCurrentUser();
  if (!user) return false;
  const email = (user.email || "").trim().toLowerCase();
  const displayName = (user.displayName || "").trim().toLowerCase();
  return (
    email === ADMIN_EMAIL.toLowerCase() ||
    displayName === "shifhu1234"
  );
}

function isAdminModeActive() {
  return localStorage.getItem("crashdown_admin_mode_active") === "true";
}

function isAdminUser() {
  return isEligibleAdmin() && isAdminModeActive();
}

function toggleAdminMode() {
  if (!isEligibleAdmin()) return;
  const current = isAdminModeActive();
  const next = !current;
  localStorage.setItem("crashdown_admin_mode_active", next ? "true" : "false");
  if (next) {
    showToast("🛡️ Adminisztrátori felület bekapcsolva!", "success");
    if (typeof playSound !== "undefined" && typeof sikeresKatt !== "undefined") playSound(sikeresKatt);
  } else {
    showToast("👤 Normál játékos nézet aktív (admin felület elrejtve)!", "info");
    if (typeof playSound !== "undefined" && typeof hangKatt !== "undefined") playSound(hangKatt);
  }
  const curUser = window.authService?.getCurrentUser();
  if (curUser) updateAuthUI(curUser);
  if (typeof toplistaMegjelenites === "function") toplistaMegjelenites();

  const profileModal = document.getElementById("playerProfileModal");
  if (profileModal && !profileModal.classList.contains("hidden") && window._currentOpenProfileUsername) {
    openPlayerProfileModal(window._currentOpenProfileUsername, false);
  }
}

window.isEligibleAdmin = isEligibleAdmin;
window.isAdminModeActive = isAdminModeActive;
window.isAdminUser = isAdminUser;
window.toggleAdminMode = toggleAdminMode;

/**
 * Adminisztrátori jogosultsággal mérföldkövek force unlockolása és lockolása
 */
async function adminForceUpdateUserAchievements(targetUsername, newAchievementsList, customToast = null, skipModalRerender = false) {
  if (!isAdminUser() || !targetUsername) return;

  window.isPerformingAdminAction = true;
  if (window._adminActionTimer) clearTimeout(window._adminActionTimer);

  let profile = null;
  if (window.leaderboardService && typeof window.leaderboardService.getPlayerProfile === "function") {
    profile = await window.leaderboardService.getPlayerProfile(targetUsername);
  }
  if (!profile) {
    const key = "crashdown_player_profiles";
    const localProfiles = JSON.parse(localStorage.getItem(key) || "{}");
    profile = localProfiles[targetUsername] || { username: targetUsername };
  }

  profile.achievements = newAchievementsList;

  // Lokális mentés
  const profilesKey = "crashdown_player_profiles";
  const localProfiles = JSON.parse(localStorage.getItem(profilesKey) || "{}");
  localProfiles[targetUsername] = profile;
  localStorage.setItem(profilesKey, JSON.stringify(localProfiles));

  // Ha a bejelentkezett admin a célfelhasználó
  const currentUser = window.authService?.getCurrentUser();
  if (currentUser && currentUser.displayName && currentUser.displayName.toLowerCase() === targetUsername.toLowerCase()) {
    const uKey = "crashdown_achievements_" + targetUsername.trim().toLowerCase();
    localStorage.setItem(uKey, JSON.stringify(newAchievementsList));
    localStorage.setItem("crashdown_achievements", JSON.stringify(newAchievementsList));
    if (typeof updateThemeSelectUI === "function") updateThemeSelectUI();
  }

  // Firebase profil mentés
  if (window.leaderboardService && typeof window.leaderboardService.savePlayerProfile === "function") {
    await window.leaderboardService.savePlayerProfile(targetUsername, profile);
  }

  const toastMsg = customToast || `⚡ ${targetUsername} jelvényei frissítve (${newAchievementsList.length} db)!`;
  showToast(toastMsg, "success");

  if (!skipModalRerender) {
    // Profil, Játékosok lista és Ranglista azonnali frissítése (görgetési pozíció megtartásával)
    const pArea = document.querySelector(".profile-content-area");
    const prevScroll = pArea ? pArea.scrollTop : 0;
    await openPlayerProfileModal(targetUsername, false);
    const pAreaAfter = document.querySelector(".profile-content-area");
    if (pAreaAfter) {
      pAreaAfter.scrollTop = prevScroll;
    }
  }
  if (typeof updatePlayersModalUI === "function") {
    updatePlayersModalUI();
  }
  if (typeof toplistaMegjelenites === "function") {
    toplistaMegjelenites();
  }

  window._adminActionTimer = setTimeout(() => {
    window.isPerformingAdminAction = false;
  }, 400);
}

/**
 * Adminisztrátori jogosultsággal rangcímek, témák, névszínek és profilképek force unlockolása és lockolása
 * (Kizárólag a független feloldási állapotokat kezeli, nem függ a meccs pontszámtól vagy achievementektől)
 */
async function adminForceUpdatePlayerCustomRewards(targetUsername, updates = {}, customToast = null, skipModalRerender = false) {
  if (!isAdminUser() || !targetUsername) return;

  window.isPerformingAdminAction = true;
  if (window._adminActionTimer) clearTimeout(window._adminActionTimer);

  let profile = null;
  if (window.leaderboardService && typeof window.leaderboardService.getPlayerProfile === "function") {
    profile = await window.leaderboardService.getPlayerProfile(targetUsername);
  }
  if (!profile) {
    const key = "crashdown_player_profiles";
    const localProfiles = JSON.parse(localStorage.getItem(key) || "{}");
    profile = localProfiles[targetUsername] || { username: targetUsername };
  }

  if (!Array.isArray(profile.unlockedTitles)) profile.unlockedTitles = ["title_beginner"];
  if (!Array.isArray(profile.unlockedColors)) profile.unlockedColors = ["name_white"];
  if (!Array.isArray(profile.unlockedAvatars)) profile.unlockedAvatars = ["avatar_default"];
  if (!Array.isArray(profile.unlockedThemes)) profile.unlockedThemes = ["retro", "cyber"];

  if (Array.isArray(updates.unlockedTitles)) profile.unlockedTitles = [...updates.unlockedTitles];
  if (Array.isArray(updates.unlockedColors)) profile.unlockedColors = [...updates.unlockedColors];
  if (Array.isArray(updates.unlockedAvatars)) profile.unlockedAvatars = [...updates.unlockedAvatars];
  if (Array.isArray(updates.unlockedThemes)) profile.unlockedThemes = [...updates.unlockedThemes];

  if (!profile.unlockedTitles.includes("title_beginner")) profile.unlockedTitles.unshift("title_beginner");
  if (!profile.unlockedColors.includes("name_white")) profile.unlockedColors.unshift("name_white");
  if (!profile.unlockedAvatars.includes("avatar_default")) profile.unlockedAvatars.unshift("avatar_default");
  if (!profile.unlockedThemes.includes("retro")) profile.unlockedThemes.unshift("retro");
  if (!profile.unlockedThemes.includes("cyber")) profile.unlockedThemes.push("cyber");

  if (updates.chosenTitle !== undefined) profile.chosenTitle = updates.chosenTitle;
  if (updates.chosenAvatar !== undefined) profile.chosenAvatar = updates.chosenAvatar;
  if (updates.chosenNameColor !== undefined) profile.chosenNameColor = updates.chosenNameColor;
  if (updates.chosenTheme !== undefined) profile.chosenTheme = updates.chosenTheme;

  // Ha zároltunk egy aktív elemet, azonnal visszaléptetjük az alapértelmezettre
  if (!profile.unlockedTitles.includes(profile.chosenTitle)) {
    profile.chosenTitle = "title_beginner";
  }
  if (!profile.unlockedColors.includes(profile.chosenNameColor)) {
    profile.chosenNameColor = "name_white";
  }
  if (!profile.unlockedAvatars.includes(profile.chosenAvatar)) {
    profile.chosenAvatar = "avatar_default";
  }
  if (profile.chosenTheme && !profile.unlockedThemes.includes(profile.chosenTheme)) {
    profile.chosenTheme = "retro";
  }

  // Lokális mentés
  const profilesKey = "crashdown_player_profiles";
  const localProfiles = JSON.parse(localStorage.getItem(profilesKey) || "{}");
  localProfiles[targetUsername] = profile;
  localStorage.setItem(profilesKey, JSON.stringify(localProfiles));

  // Toplista lokális frissítése az adott játékos rekordjainál valós időben
  try {
    const toplistaRaw = localStorage.getItem("toplista");
    if (toplistaRaw) {
      const toplista = JSON.parse(toplistaRaw);
      let updated = false;
      const uLower = targetUsername.trim().toLowerCase();
      toplista.forEach((entry) => {
        if (entry.name && entry.name.toLowerCase() === uLower) {
          if (profile.chosenAvatar) entry.chosenAvatar = profile.chosenAvatar;
          if (profile.chosenTitle) entry.chosenTitle = profile.chosenTitle;
          if (profile.chosenNameColor) entry.chosenNameColor = profile.chosenNameColor;
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem("toplista", JSON.stringify(toplista));
      }
    }
  } catch (e) {}

  // Ha a bejelentkezett felhasználó a célfelhasználó, a választott kulcsokat is szinkronizáljuk
  const currentUser = window.authService?.getCurrentUser();
  if (currentUser && currentUser.displayName && currentUser.displayName.toLowerCase() === targetUsername.toLowerCase()) {
    if (profile.chosenTitle) localStorage.setItem("crashdown_chosen_title", profile.chosenTitle);
    if (profile.chosenAvatar) localStorage.setItem("crashdown_chosen_avatar", profile.chosenAvatar);
    if (profile.chosenNameColor) localStorage.setItem("crashdown_chosen_name_color", profile.chosenNameColor);
    if (profile.chosenTheme) {
      localStorage.setItem("crashdown_theme", profile.chosenTheme);
      if (typeof applyTheme === "function") applyTheme(profile.chosenTheme);
    }
    if (typeof updateThemeSelectUI === "function") updateThemeSelectUI();
  }

  // Firebase profil mentés
  if (window.leaderboardService && typeof window.leaderboardService.savePlayerProfile === "function") {
    await window.leaderboardService.savePlayerProfile(targetUsername, profile);
  }

  if (customToast) {
    showToast(customToast, "success");
  }

  if (!skipModalRerender) {
    // Profil, Játékosok lista és Ranglista azonnali frissítése (görgetési pozíció megtartásával)
    const pArea = document.querySelector(".profile-content-area");
    const prevScroll = pArea ? pArea.scrollTop : 0;
    await openPlayerProfileModal(targetUsername, false);
    const pAreaAfter = document.querySelector(".profile-content-area");
    if (pAreaAfter) {
      pAreaAfter.scrollTop = prevScroll;
    }
  }
  if (typeof updatePlayersModalUI === "function") {
    updatePlayersModalUI();
  }
  if (typeof toplistaMegjelenites === "function") {
    toplistaMegjelenites();
  }

  window._adminActionTimer = setTimeout(() => {
    window.isPerformingAdminAction = false;
  }, 400);
}

// ==================== TOAST RENDSZER (MAXIMUM 3 DARAB) ====================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  // Szigorúan maximum 3 darab toast maradhat
  while (container.children.length >= 3) {
    container.firstElementChild.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    toast.style.transition = "all 0.22s ease";
    setTimeout(() => toast.remove(), 220);
  }, 2400);
}

// ==================== STÁTUSZ & PONT KIJELZŐ ====================
function setComboStatus(text, highlight = false) {
  const pill = document.getElementById("comboIndicator");
  if (!pill) return;
  pill.textContent = text;
  if (highlight) {
    pill.style.background = "rgba(16, 185, 129, 0.25)";
    pill.style.borderColor = "rgba(16, 185, 129, 0.55)";
    pill.style.color = "#6ee7b7";
  } else {
    pill.style.background = "rgba(59, 130, 246, 0.2)";
    pill.style.borderColor = "rgba(59, 130, 246, 0.4)";
    pill.style.color = "#93c5fd";
  }
}

function updateScoreUI(instant = false) {
  const scoreEl = document.getElementById("score");
  if (instant) {
    displayedScore = pontSzam;
    if (scoreEl) scoreEl.textContent = formatScore(pontSzam);
  }
  const reqScore = document.getElementById("reqScore");
  if (reqScore) {
    reqScore.classList.toggle("met", pontSzam >= 1000);
  }
  if (pontSzam >= 500) checkAchievement("first_500");
  if (pontSzam >= 1500) checkAchievement("score_1500");
  if (pontSzam >= 5000) checkAchievement("score_5000");
  if (pontSzam >= 10000) checkAchievement("score_10k");
  if (pontSzam >= 25000) checkAchievement("score_25k");
  if (pontSzam >= 50000) checkAchievement("score_50k");
  if (pontSzam >= 75000) checkAchievement("score_75k");
  if (pontSzam >= 100000) checkAchievement("score_100k");
  if (pontSzam >= 150000) checkAchievement("score_150k");
  if (pontSzam >= 250000) checkAchievement("score_250k");
  const colorSelect = document.getElementById("colorSelect");
  if (colorSelect && colorSelect.value === "5" && pontSzam >= 2000)
    checkAchievement("master_5_color");
}

// ==================== TÉMA KEZELÉS ====================
function updateThemeSelectUI() {
  const themeSelect = document.getElementById("themeSelect");
  if (!themeSelect) return;
  const unlockedAchs = getUnlockedAchievements();
  const achSet = new Set(unlockedAchs);
  const currentUser = window.authService?.getCurrentUser();
  let userUnlockedThemes = null;
  if (currentUser && currentUser.displayName) {
    try {
      const profiles = JSON.parse(localStorage.getItem("crashdown_player_profiles") || "{}");
      const p = profiles[currentUser.displayName];
      if (p && Array.isArray(p.unlockedThemes)) {
        userUnlockedThemes = new Set(p.unlockedThemes);
      }
    } catch (e) {}
  }

  themeSelect.innerHTML = THEMES_CATALOG.map((t) => {
    const isUnlocked = userUnlockedThemes
      ? userUnlockedThemes.has(t.id)
      : (!t.achId || achSet.has(t.achId));
    return `<option value="${t.id}">${isUnlocked ? "" : "🔒 "}${t.name}</option>`;
  }).join("");

  themeSelect.value = currentTheme;

  const paletteWrap = document.getElementById("themeSelectPalette");
  if (paletteWrap) {
    const pal = THEME_PALETTES[currentTheme] || THEME_PALETTES.retro;
    paletteWrap.innerHTML = pal
      .map((c) => `<span class="theme-palette-dot" style="background-color: ${c};"></span>`)
      .join("");
  }
}

function applyTheme(themeKey) {
  if (!THEME_PALETTES[themeKey]) themeKey = "retro";

  const paletteWrap = document.getElementById("themeSelectPalette");
  if (paletteWrap) {
    const pal = THEME_PALETTES[themeKey] || THEME_PALETTES.retro;
    paletteWrap.innerHTML = pal
      .map((c) => `<span class="theme-palette-dot" style="background-color: ${c};"></span>`)
      .join("");
  }

  const unlockedAchs = getUnlockedAchievements();
  const achSet = new Set(unlockedAchs);
  const themeObj =
    THEMES_CATALOG.find((t) => t.id === themeKey) || THEMES_CATALOG[0];

  const currentUser = window.authService?.getCurrentUser();
  let userUnlockedThemes = null;
  if (currentUser && currentUser.displayName) {
    try {
      const profiles = JSON.parse(localStorage.getItem("crashdown_player_profiles") || "{}");
      const p = profiles[currentUser.displayName];
      if (p && Array.isArray(p.unlockedThemes)) {
        userUnlockedThemes = new Set(p.unlockedThemes);
      }
    } catch (e) {}
  }

  const isUnlocked = userUnlockedThemes
    ? userUnlockedThemes.has(themeObj.id)
    : (!themeObj.achId || achSet.has(themeObj.achId));

  if (!isUnlocked) {
    const reqAch = ACHIEVEMENTS.find((a) => a.id === themeObj.achId);
    showToast(
      `🔒 Ez a téma még zárolva van! Feloldáshoz: ${reqAch?.title || "Mérföldkő"}`,
      "warning",
    );
    themeKey = currentTheme || "retro";
  }

  const oldPalette = THEME_PALETTES[currentTheme] || THEME_PALETTES.retro;
  currentTheme = themeKey;
  localStorage.setItem("crashdown_theme", themeKey);

  document.body.className = document.body.className
    .replace(/\btheme-[^\s]+\b/g, "")
    .trim();
  document.body.classList.add(`theme-${themeKey}`);

  const newPalette = THEME_PALETTES[themeKey] || THEME_PALETTES.retro;
  negyzetSzinek = newPalette;
  const colorSelect = document.getElementById("colorSelect");
  if (colorSelect) {
    getSzinek(colorSelect.value);
  } else {
    getSzinek(3);
  }

  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect && themeSelect.value !== themeKey) {
    themeSelect.value = themeKey;
  }

  // Canvas újraszínezése 1-az-1-es determinisztikus leképezéssel (nem randomizál!)
  const targetGrid =
    typeof grid !== "undefined" && grid && grid.length
      ? grid
      : typeof palya !== "undefined"
        ? palya
        : [];
  if (targetGrid && targetGrid.length) {
    targetGrid.forEach((sor) => {
      sor.forEach((cella) => {
        if (
          cella &&
          cella.color !== "white" &&
          (!cella.type || cella.type === "normal")
        ) {
          if (
            typeof powerUpColors !== "undefined" &&
            powerUpColors.has(cella.color)
          ) {
            return; // Power-upok egyedi színét sosem írjuk felül
          }
          const oldIdx = oldPalette.indexOf(cella.color);
          if (oldIdx !== -1) {
            cella.color = newPalette[oldIdx % newPalette.length];
          } else if (!szinek.includes(cella.color)) {
            cella.color = szinek[0];
          }
        }
      });
    });
    if (typeof drawGrid === "function") drawGrid();
  }
}

// ==================== MOBIL TAB NAVIGÁCIÓ (AUTO GÖRGETÉSSEL A TETEJÉRE) ====================
function switchToMobileTab(targetId, shouldScroll = true) {
  document.querySelectorAll(".mobile-tab-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-target") === targetId);
  });
  document
    .querySelectorAll(".controls-panel, .game-stage, .leaderboard-panel")
    .forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetId);
    });
  if (shouldScroll) {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
}

// ==================== JÁTÉKOS PROFIL MODAL ====================
// ==================== JÁTÉKOS PROFIL TESTRESZABÁS SZINKRONIZÁLÁS ====================
async function syncPlayerCustomization(username, updates) {
  if (!username) return;
  try {
    const key = "crashdown_player_profiles";
    const profiles = JSON.parse(localStorage.getItem(key) || "{}");
    if (!profiles[username]) {
      profiles[username] = { username: username };
    }
    Object.assign(profiles[username], updates);
    localStorage.setItem(key, JSON.stringify(profiles));

    // Ha a bejelentkezett felhasználó témát választott
    const currentUser = window.authService?.getCurrentUser();
    if (currentUser && currentUser.displayName && currentUser.displayName.toLowerCase() === username.toLowerCase()) {
      if (updates.chosenTheme) {
        localStorage.setItem("crashdown_theme", updates.chosenTheme);
        if (typeof applyTheme === "function") applyTheme(updates.chosenTheme);
        if (typeof updateThemeSelectUI === "function") updateThemeSelectUI();
      }
    }

    // Frissítsük a helyi toplistát is azonnal a módosított adatokkal
    try {
      const localScores = JSON.parse(localStorage.getItem("toplista") || "[]");
      const uLower = username.trim().toLowerCase();
      let updatedAny = false;
      localScores.forEach((s) => {
        if (String(s.name || "").trim().toLowerCase() === uLower) {
          if (updates.chosenTitle !== undefined) s.chosenTitle = updates.chosenTitle;
          if (updates.chosenAvatar !== undefined) s.chosenAvatar = updates.chosenAvatar;
          if (updates.chosenNameColor !== undefined) s.chosenNameColor = updates.chosenNameColor;
          updatedAny = true;
        }
      });
      if (updatedAny) {
        localStorage.setItem("toplista", JSON.stringify(localScores));
      }
    } catch (e) {}

    // Azonnali felületi frissítések a Ranglistán és a Játékosok listán
    if (typeof toplistaMegjelenites === "function") {
      toplistaMegjelenites();
    }
    if (typeof updatePlayersModalUI === "function") {
      updatePlayersModalUI();
    }

    if (
      window.leaderboardService &&
      typeof window.leaderboardService.updatePlayerCustomizations === "function"
    ) {
      await window.leaderboardService.updatePlayerCustomizations(
        username,
        updates,
      );
    } else if (
      window.databaseService &&
      typeof window.databaseService.savePlayerProfile === "function"
    ) {
      await window.databaseService.savePlayerProfile(
        username,
        profiles[username],
      );
    }
  } catch (e) {
    console.warn("Hiba a testreszabások online szinkronizálásakor:", e);
  }
}

function sortCatalogItems(items, sortMode, unlockedCheck, nameKey = "name", specialKey = "isSpecial") {
  const arr = [...items];
  if (!sortMode || sortMode === "default") return arr;
  if (sortMode === "alpha_asc") {
    arr.sort((a, b) => String(a[nameKey] || "").localeCompare(String(b[nameKey] || ""), "hu"));
  } else if (sortMode === "alpha_desc") {
    arr.sort((a, b) => String(b[nameKey] || "").localeCompare(String(a[nameKey] || ""), "hu"));
  } else if (sortMode === "unlocked_first") {
    arr.sort((a, b) => {
      const uA = unlockedCheck(a) ? 1 : 0;
      const uB = unlockedCheck(b) ? 1 : 0;
      if (uA !== uB) return uB - uA;
      return String(a[nameKey] || "").localeCompare(String(b[nameKey] || ""), "hu");
    });
  } else if (sortMode === "locked_first") {
    arr.sort((a, b) => {
      const uA = unlockedCheck(a) ? 1 : 0;
      const uB = unlockedCheck(b) ? 1 : 0;
      if (uA !== uB) return uA - uB;
      return String(a[nameKey] || "").localeCompare(String(b[nameKey] || ""), "hu");
    });
  } else if (sortMode === "special_first") {
    arr.sort((a, b) => {
      const sA = a[specialKey] ? 1 : 0;
      const sB = b[specialKey] ? 1 : 0;
      if (sA !== sB) return sB - sA;
      return String(a[nameKey] || "").localeCompare(String(b[nameKey] || ""), "hu");
    });
  } else if (sortMode === "reward_first") {
    arr.sort((a, b) => {
      const rA = (typeof getAchievementRewards === "function" && getAchievementRewards(a.id).length > 0) ? 1 : 0;
      const rB = (typeof getAchievementRewards === "function" && getAchievementRewards(b.id).length > 0) ? 1 : 0;
      if (rA !== rB) return rB - rA;
      return String(a[nameKey] || "").localeCompare(String(b[nameKey] || ""), "hu");
    });
  }
  return arr;
}

async function openPlayerProfileModal(username, resetScroll = true) {
  window.currentlyViewedProfileUser = username;

  if (resetScroll) {
    const modalEl = document.getElementById("playerProfileModal");
    if (modalEl) modalEl.scrollTop = 0;
    const cardEl = modalEl?.querySelector(".modal-card");
    if (cardEl) cardEl.scrollTop = 0;
    const contentArea = modalEl?.querySelector(".profile-content-area");
    if (contentArea) contentArea.scrollTop = 0;
  }

  window._currentOpenProfileUsername = username;

  const profileAdminToggleBtn = document.getElementById("profileAdminModeToggleBtn");
  if (profileAdminToggleBtn) {
    if (isEligibleAdmin()) {
      profileAdminToggleBtn.style.display = "inline-flex";
      const active = isAdminModeActive();
      profileAdminToggleBtn.classList.toggle("active", active);
      profileAdminToggleBtn.innerHTML = active
        ? "⚡ Admin Mód: BEKAPCSOLVA"
        : "🛡️ Admin Mód: Kikapcsolva";
      profileAdminToggleBtn.title = active
        ? "Adminisztrátori mód aktív. Kattints a játékos nézetbe való visszatéréshez!"
        : "Kattints az adminisztrátori funkciók bekapcsolásához ezen a profilon!";
      profileAdminToggleBtn.onclick = (e) => {
        e.stopPropagation();
        toggleAdminMode();
      };
    } else {
      profileAdminToggleBtn.style.display = "none";
    }
  }

  let allScores = [];
  if (window.leaderboardService) {
    allScores = await window.leaderboardService.getScores();
  } else {
    allScores = JSON.parse(localStorage.getItem("toplista")) || [];
  }

  let onlineProfile = null;
  if (
    window.leaderboardService &&
    typeof window.leaderboardService.getPlayerProfile === "function"
  ) {
    onlineProfile = await window.leaderboardService.getPlayerProfile(username);
  } else if (
    window.databaseService &&
    typeof window.databaseService.getPlayerProfile === "function"
  ) {
    onlineProfile = await window.databaseService.getPlayerProfile(username);
  }

  const stats = getPlayerProfileStats(username, allScores, onlineProfile);
  if (!stats.activeAvatar) {
    stats.activeAvatar =
      typeof PROFILE_AVATARS !== "undefined" && PROFILE_AVATARS[0]
        ? PROFILE_AVATARS[0]
        : { id: "avatar_default", name: "Alapértelmezett", symbol: "👤" };
  }
  if (!stats.activeTitle) {
    stats.activeTitle =
      typeof PROFILE_TITLES !== "undefined" && PROFILE_TITLES[0]
        ? PROFILE_TITLES[0]
        : { id: "title_beginner", name: "Kezdő Blokktörő" };
  }
  const currentUser = window.authService?.getCurrentUser();
  const isOwnProfile =
    currentUser &&
    currentUser.displayName &&
    currentUser.displayName.toLowerCase() === stats.username.toLowerCase();
  if (currentUser && !isOwnProfile) {
    checkAchievement("inspect_profile");
  }
  const achSet = new Set(stats.achievements || []);

  const nameEl = document.getElementById("profilePlayerName");
  const avatarEl = document.getElementById("profileAvatar");
  const titleEl = document.getElementById("profilePlayerTitle");
  const bestScoreEl = document.getElementById("profileBestScore");
  const matchesEl = document.getElementById("profileTotalMatches");
  const timeEl = document.getElementById("profileTotalTime");
  const achCountEl = document.getElementById("profileAchievementsCount");
  const modesListEl = document.getElementById("profileModesBreakdown");
  const badgesListEl = document.getElementById("profileAchievementsList");
  const badgeSummaryEl = document.getElementById("profileBadgeSummary");

  if (nameEl) {
    nameEl.textContent = stats.username;
    const nameColorCatalog =
      typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
    nameColorCatalog.forEach((c) => nameEl.classList.remove(c.className));
    if (stats.activeNameColor && stats.activeNameColor.className) {
      nameEl.classList.add(stats.activeNameColor.className);
    }
  }
  if (avatarEl) {
    avatarEl.textContent = stats.activeAvatar.symbol;
    avatarEl.title = `Profilkép: ${stats.activeAvatar.name}`;
  }

  if (titleEl) {
    titleEl.textContent = stats.activeTitle.name;
    titleEl.classList.remove(
      "title-special-gold",
      "title-special-cosmic",
      "title-special-flame",
      "title-special-rainbow",
    );
    if (stats.activeTitle.specialClass) {
      titleEl.classList.add(stats.activeTitle.specialClass);
    }
  }


  const isAdmin = isAdminUser();
  const canManageCustomization = isOwnProfile || isAdmin;

// 4.5. Téma választása (kártyás nézet, rendezhető)
  const themeSection = document.getElementById("profileThemeSection");
  const themeGrid = document.getElementById("profileThemeGrid");
  const themesCatalog =
    typeof THEMES_CATALOG !== "undefined" ? THEMES_CATALOG : [];
  const themeSortSelect = document.getElementById("sortThemesSelect");

  if (themeSection && themeGrid) {
    themeSection.style.display = "block";

    let clientUnlockedThemes = ["retro", "cyber"];
    const myUser = window.authService?.getCurrentUser();
    if (myUser && myUser.displayName) {
      try {
        const localProfiles = JSON.parse(localStorage.getItem("crashdown_player_profiles") || "{}");
        const myProf = localProfiles[myUser.displayName];
        if (myProf && Array.isArray(myProf.unlockedThemes)) {
          clientUnlockedThemes = [...myProf.unlockedThemes];
        }
      } catch (e) {}
    }
    if (isOwnProfile && Array.isArray(stats.unlockedThemes)) {
      clientUnlockedThemes = Array.from(new Set([...clientUnlockedThemes, ...stats.unlockedThemes]));
    }
    const localAchKey = myUser && myUser.displayName
      ? "crashdown_achievements_" + myUser.displayName.trim().toLowerCase()
      : "crashdown_achievements";
    const clientAchs = new Set(JSON.parse(localStorage.getItem(localAchKey) || localStorage.getItem("crashdown_achievements") || "[]"));
    themesCatalog.forEach((th) => {
      if (th.achId && clientAchs.has(th.achId) && !clientUnlockedThemes.includes(th.id)) {
        clientUnlockedThemes.push(th.id);
      }
    });
    if (!clientUnlockedThemes.includes("retro")) clientUnlockedThemes.unshift("retro");
    if (!clientUnlockedThemes.includes("cyber")) clientUnlockedThemes.push("cyber");

    function renderThemeCards(sortMode = "default") {
      const clientActiveTheme = (typeof currentTheme !== "undefined" && currentTheme)
        ? currentTheme
        : (localStorage.getItem("crashdown_theme") || "retro");

      const sortedThemes = sortCatalogItems(
        themesCatalog,
        sortMode,
        (th) => (isAdmin && !isOwnProfile)
          ? (stats.unlockedThemes || ["retro", "cyber"]).includes(th.id)
          : clientUnlockedThemes.includes(th.id)
      );

      themeGrid.innerHTML = sortedThemes
        .map((th) => {
          const unlocked = (isAdmin && !isOwnProfile)
            ? (stats.unlockedThemes || ["retro", "cyber"]).includes(th.id)
            : clientUnlockedThemes.includes(th.id);
          const isSelected = clientActiveTheme === th.id;
          const reqAch = th.achId
            ? ACHIEVEMENTS.find((a) => a.id === th.achId)
            : null;
          const lockTitle = reqAch
            ? `Zárolva: ${reqAch.title} (${reqAch.desc}) szükséges hozzá!`
            : "Zárolva";
          const palette = (typeof THEME_PALETTES !== "undefined" && THEME_PALETTES[th.id]) ? THEME_PALETTES[th.id] : ["#ef4444", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6"];
          const dotsHtml = palette
            .map((c) => `<span class="theme-palette-dot" style="background-color: ${c};"></span>`)
            .join("");
          const specialBadge = th.isSpecial
            ? '<span class="title-pick-special-tag">Speciális</span>'
            : "";

          return `
            <div class="theme-pick-card ${unlocked ? "" : "locked"} ${isSelected ? "active" : ""} ${isAdmin ? "admin-manageable" : ""}"
                 data-theme-id="${th.id}"
                 data-unlocked="${unlocked ? "1" : "0"}"
                 title="${isAdmin ? (unlocked ? `${th.name} (Kattints a beállításhoz, jobb felső gombbal zárolhatod)` : `${lockTitle} (Admin: kattints a feloldáshoz)`) : (unlocked ? th.name : lockTitle)}">
                ${isAdmin && th.id !== "retro" && th.id !== "cyber" ? `
                  <button type="button" class="card-admin-toggle-badge ${unlocked ? "unlocked" : "locked"}" 
                          data-action="toggle-lock"
                          title="${unlocked ? "Zárolás (Admin)" : "Feloldás (Admin)"}">
                    ${unlocked ? "✓" : "🔒"}
                  </button>
                ` : (!unlocked ? '<span class="avatar-lock-icon">🔒</span>' : "")}
                <div class="theme-palette-preview">
                  ${dotsHtml}
                </div>
                <div class="theme-pick-name">
                  <span class="theme-name-text">${th.name}</span>
                  ${specialBadge}
                </div>
            </div>
          `;
        })
        .join("");

      themeGrid.querySelectorAll(".theme-pick-card").forEach((card) => {
        card.addEventListener("click", async function (e) {
          const thId = this.getAttribute("data-theme-id");
          const thObj = themesCatalog.find((t) => t.id === thId);
          if (!thObj) return;

          const isToggleBtn = e.target.closest("[data-action='toggle-lock']");
          const isUnlocked = this.getAttribute("data-unlocked") === "1";

          if (isToggleBtn && isAdmin && thObj.id !== "retro" && thObj.id !== "cyber") {
            e.stopPropagation();
            if (this.dataset.busy === "1") return;
            this.dataset.busy = "1";

            const nextUnlocked = !isUnlocked;
            this.setAttribute("data-unlocked", nextUnlocked ? "1" : "0");
            this.classList.toggle("locked", !nextUnlocked);
            const toggleBtnEl = this.querySelector("[data-action='toggle-lock']");
            if (toggleBtnEl) {
              toggleBtnEl.textContent = nextUnlocked ? "✓" : "🔒";
              toggleBtnEl.className = `card-admin-toggle-badge ${nextUnlocked ? "unlocked" : "locked"}`;
              toggleBtnEl.title = nextUnlocked ? "Zárolás (Admin)" : "Feloldás (Admin)";
            }

            let curThemes = [...(stats.unlockedThemes || ["retro", "cyber"])];
            if (nextUnlocked) {
              if (!curThemes.includes(thId)) curThemes.push(thId);
            } else {
              curThemes = curThemes.filter((id) => id !== thId);
              if (stats.chosenTheme === thId) stats.chosenTheme = "retro";
              this.classList.remove("active");
            }
            stats.unlockedThemes = curThemes;

            triggerHaptic("heavy");
            if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
            try {
              await adminForceUpdatePlayerCustomRewards(
                stats.username,
                { unlockedThemes: curThemes, chosenTheme: stats.chosenTheme },
                nextUnlocked
                  ? `🔓 ${thObj.name} téma feloldva (${stats.username})!`
                  : `🔒 ${thObj.name} téma zárolva (${stats.username})!`,
                true
              );
            } finally {
              delete this.dataset.busy;
            }
            return;
          }

          if (!isUnlocked) {
            if (isAdmin && thObj.id !== "retro" && thObj.id !== "cyber") {
              this.setAttribute("data-unlocked", "1");
              this.classList.remove("locked");
              const toggleBtnEl = this.querySelector("[data-action='toggle-lock']");
              if (toggleBtnEl) {
                toggleBtnEl.textContent = "✓";
                toggleBtnEl.className = "card-admin-toggle-badge unlocked";
                toggleBtnEl.title = "Zárolás (Admin)";
              }

              let curThemes = [...(stats.unlockedThemes || ["retro", "cyber"])];
              if (!curThemes.includes(thId)) curThemes.push(thId);
              stats.unlockedThemes = curThemes;
              stats.chosenTheme = thId;

              themeGrid.querySelectorAll(".theme-pick-card").forEach((c) => c.classList.remove("active"));
              this.classList.add("active");

              if (typeof applyTheme === "function") {
                applyTheme(thId);
              }
              triggerHaptic("impact");
              if (typeof hangKatt !== "undefined") playSound(hangKatt);
              try {
                await adminForceUpdatePlayerCustomRewards(
                  stats.username,
                  { unlockedThemes: curThemes, chosenTheme: thId },
                  `⚡ ${thObj.name} téma feloldva és beállítva (${stats.username})!`,
                  true
                );
              } finally {
                delete this.dataset.busy;
              }
              return;
            } else {
              const reqAch = thObj.achId
                ? ACHIEVEMENTS.find((a) => a.id === thObj.achId)
                : null;
              showToast(
                `🔒 Ez a téma még zárolva van! Feloldáshoz: ${reqAch?.title || "Mérföldkő"}`,
                "warning",
              );
              triggerHaptic("error");
              if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
              return;
            }
          }

          if (typeof applyTheme === "function") {
            applyTheme(thId);
          }
          localStorage.setItem("crashdown_theme", thId);

          const themeSelectEl = document.getElementById("themeSelect");
          if (themeSelectEl) themeSelectEl.value = thId;

          const loggedInUser = window.authService?.getCurrentUser();
          if (loggedInUser && loggedInUser.displayName) {
            syncPlayerCustomization(loggedInUser.displayName, { chosenTheme: thId }).catch(() => {});
          }

          themeGrid
            .querySelectorAll(".theme-pick-card")
            .forEach((c) => c.classList.remove("active"));
          this.classList.add("active");

          showToast(`🎨 Új játéktéma beállítva: ${thObj.name}!`, "success");
          if (typeof playSound !== "undefined" && typeof sikeresKatt !== "undefined") playSound(sikeresKatt);
          triggerHaptic("success");
          if (typeof updateThemeSelectUI === "function") updateThemeSelectUI();
        });
      });
    }

    if (themeSortSelect) {
      themeSortSelect.onchange = (e) => {
        renderThemeCards(e.target.value);
      };
      renderThemeCards(themeSortSelect.value);
    } else {
      renderThemeCards("default");
    }
  }

// 5. Név színének választása (kártyás nézet, rendezhető)
  const nameColorSection = document.getElementById("profileNameColorSection");
  const nameColorGrid = document.getElementById("profileNameColorGrid");
  const nameColorCatalog =
    typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
  const nameColorSortSelect = document.getElementById("sortNameColorsSelect");

  if (nameColorSection && nameColorGrid) {
    if (canManageCustomization) {
      nameColorSection.style.display = "block";

      function renderNameColors(sortMode = "default") {
        const sortedColors = sortCatalogItems(
          nameColorCatalog,
          sortMode,
          (col) => (stats.unlockedColors || ["name_white"]).includes(col.id)
        );

        nameColorGrid.innerHTML = sortedColors
          .map((col) => {
            const unlocked = (stats.unlockedColors || ["name_white"]).includes(col.id);
            const isSelected =
              stats.activeNameColor && stats.activeNameColor.id === col.id;
            const reqAch = col.achId
              ? ACHIEVEMENTS.find((a) => a.id === col.achId)
              : null;
            const lockTitle = reqAch
              ? `Zárolva: ${reqAch.title} (${reqAch.desc}) szükséges hozzá!`
              : "Zárolva";
            return `
              <div class="name-color-pick-card ${unlocked ? "" : "locked"} ${isSelected ? "active" : ""} ${isAdmin ? "admin-manageable" : ""}"
                   data-color-id="${col.id}"
                   data-unlocked="${unlocked ? "1" : "0"}"
                   title="${isAdmin ? (unlocked ? `${col.name} (Kattints a beállításhoz, jobb felső gombbal zárolhatod)` : `${lockTitle} (Admin: kattints a feloldáshoz)`) : (unlocked ? col.name : lockTitle)}">
                  ${isAdmin && col.id !== "name_white" ? `
                    <button type="button" class="card-admin-toggle-badge ${unlocked ? "unlocked" : "locked"}" 
                            data-action="toggle-lock"
                            title="${unlocked ? "Zárolás (Admin)" : "Feloldás (Admin)"}">
                      ${unlocked ? "✓" : "🔒"}
                    </button>
                  ` : (!unlocked ? '<span class="avatar-lock-icon">🔒</span>' : "")}
                  <span class="name-color-preview-text ${col.className}">Aa</span>
                  <span class="name-color-label">${col.name}${col.isSpecial ? " (speciális)" : ""}</span>
              </div>
            `;
          })
          .join("");

        nameColorGrid
          .querySelectorAll(".name-color-pick-card")
          .forEach((card) => {
            card.addEventListener("click", async function (e) {
              const colId = this.getAttribute("data-color-id");
              const colObj = nameColorCatalog.find((c) => c.id === colId);
              if (!colObj) return;

              const isToggleBtn = e.target.closest("[data-action='toggle-lock']");
              const isUnlocked = this.getAttribute("data-unlocked") === "1";

              if (isToggleBtn && isAdmin && colObj.id !== "name_white") {
                e.stopPropagation();
                if (this.dataset.busy === "1") return;
                this.dataset.busy = "1";

                const nextUnlocked = !isUnlocked;
                this.setAttribute("data-unlocked", nextUnlocked ? "1" : "0");
                this.classList.toggle("locked", !nextUnlocked);
                const toggleBtnEl = this.querySelector("[data-action='toggle-lock']");
                if (toggleBtnEl) {
                  toggleBtnEl.textContent = nextUnlocked ? "✓" : "🔒";
                  toggleBtnEl.className = `card-admin-toggle-badge ${nextUnlocked ? "unlocked" : "locked"}`;
                  toggleBtnEl.title = nextUnlocked ? "Zárolás (Admin)" : "Feloldás (Admin)";
                }

                let curColors = [...(stats.unlockedColors || ["name_white"])];
                if (nextUnlocked) {
                  if (!curColors.includes(colId)) curColors.push(colId);
                } else {
                  curColors = curColors.filter((id) => id !== colId);
                  if (stats.chosenNameColor === colId) stats.chosenNameColor = "name_white";
                  this.classList.remove("active");
                }
                stats.unlockedColors = curColors;

                triggerHaptic("heavy");
                if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
                try {
                  await adminForceUpdatePlayerCustomRewards(
                    stats.username,
                    { unlockedColors: curColors, chosenNameColor: stats.chosenNameColor },
                    nextUnlocked
                      ? `🔓 ${colObj.name} név szín feloldva (${stats.username})!`
                      : `🔒 ${colObj.name} név szín zárolva (${stats.username})!`,
                    true
                  );
                } finally {
                  delete this.dataset.busy;
                }
                return;
              }

              if (!isUnlocked) {
                if (isAdmin && colObj.id !== "name_white") {
                  this.setAttribute("data-unlocked", "1");
                  this.classList.remove("locked");
                  const toggleBtnEl = this.querySelector("[data-action='toggle-lock']");
                  if (toggleBtnEl) {
                    toggleBtnEl.textContent = "✓";
                    toggleBtnEl.className = "card-admin-toggle-badge unlocked";
                    toggleBtnEl.title = "Zárolás (Admin)";
                  }

                  let curColors = [...(stats.unlockedColors || ["name_white"])];
                  if (!curColors.includes(colId)) curColors.push(colId);
                  stats.unlockedColors = curColors;
                  stats.chosenNameColor = colId;
                  stats.activeNameColor = colObj;

                  if (nameEl) {
                    nameColorCatalog.forEach((c) => nameEl.classList.remove(c.className));
                    nameEl.classList.add(colObj.className);
                  }

                  nameColorGrid.querySelectorAll(".name-color-pick-card").forEach((c) => c.classList.remove("active"));
                  this.classList.add("active");

                  triggerHaptic("impact");
                  if (typeof hangKatt !== "undefined") playSound(hangKatt);
                  try {
                    await adminForceUpdatePlayerCustomRewards(
                      stats.username,
                      { unlockedColors: curColors, chosenNameColor: colId },
                      `⚡ ${colObj.name} név szín feloldva és beállítva (${stats.username})!`,
                      true
                    );
                  } finally {
                    delete this.dataset.busy;
                  }
                  return;
                } else {
                  const reqAch = colObj.achId
                    ? ACHIEVEMENTS.find((a) => a.id === colObj.achId)
                    : null;
                  showToast(
                    `🔒 Ez a név szín még zárolva van! Feloldáshoz: ${reqAch?.title || "Mérföldkő"}`,
                    "warning",
                  );
                  triggerHaptic("error");
                  if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
                  return;
                }
              }

              stats.chosenNameColor = colId;
              stats.activeNameColor = colObj;
              if (isOwnProfile) {
                localStorage.setItem("crashdown_chosen_name_color", colId);
                const localProfiles = JSON.parse(
                  localStorage.getItem("crashdown_player_profiles") || "{}",
                );
                if (localProfiles[stats.username]) {
                  localProfiles[stats.username].chosenNameColor = colId;
                  localStorage.setItem(
                    "crashdown_player_profiles",
                    JSON.stringify(localProfiles),
                  );
                }
              }

              if (window.databaseService) {
                syncPlayerCustomization(stats.username, {
                  chosenNameColor: colId,
                }).catch(() => {});
              }

              if (nameEl) {
                nameColorCatalog.forEach((c) =>
                  nameEl.classList.remove(c.className),
                );
                nameEl.classList.add(colObj.className);
              }

              if (isOwnProfile) {
                const currentUserNameLabel = document.getElementById(
                  "currentUserNameLabel",
                );
                if (currentUserNameLabel) {
                  nameColorCatalog.forEach((c) =>
                    currentUserNameLabel.classList.remove(c.className),
                  );
                  currentUserNameLabel.classList.add(colObj.className);
                }
              }

              nameColorGrid
                .querySelectorAll(".name-color-pick-card")
                .forEach((c) => c.classList.remove("active"));
              this.classList.add("active");

              showToast(`🎨 Új név szín beállítva (${stats.username}): ${colObj.name}!`, "success");
              playSound(sikeresKatt);
              triggerHaptic("success");
              toplistaMegjelenites();
            });
          });
      }

      if (nameColorSortSelect) {
        nameColorSortSelect.onchange = (e) => {
          renderNameColors(e.target.value);
        };
        renderNameColors(nameColorSortSelect.value);
      } else {
        renderNameColors("default");
      }
    } else {
      nameColorSection.style.display = "none";
    }
  }

// 6. Rangcím választása (Kártyás felsorolás, rendezhető)
  const titleSection = document.getElementById("profileTitleSection");
  const titleGrid = document.getElementById("profileTitleGrid");
  const titleSortSelect = document.getElementById("sortTitlesSelect");

  if (titleSection && titleGrid) {
    if (canManageCustomization) {
      titleSection.style.display = "block";

      function renderTitles(sortMode = "default") {
        const sortedTitles = sortCatalogItems(
          PROFILE_TITLES,
          sortMode,
          (t) => (stats.unlockedTitles || ["title_beginner"]).includes(t.id)
        );

        titleGrid.innerHTML = sortedTitles.map((t) => {
          const unlocked = (stats.unlockedTitles || ["title_beginner"]).includes(t.id);
          const isSelected = stats.chosenTitle
            ? t.id === stats.chosenTitle
            : t.id === stats.activeTitle.id;
          const reqAch = t.achId
            ? ACHIEVEMENTS.find((a) => a.id === t.achId)
            : null;
          const lockTitle = reqAch
            ? `Zárolva: ${reqAch.title} (${reqAch.desc}) szükséges hozzá!`
            : `Zárolva: ${t.desc}`;
          const specialBadge = t.isSpecial
            ? '<span class="title-pick-special-tag">Speciális</span>'
            : "";

          return `
            <div class="title-pick-card ${unlocked ? "" : "locked"} ${isSelected ? "active" : ""} ${isAdmin ? "admin-manageable" : ""}"
                 data-title-id="${t.id}"
                 data-unlocked="${unlocked ? "1" : "0"}"
                 title="${isAdmin ? (unlocked ? `${t.name} (Kattints a beállításhoz, jobb felső gombbal zárolhatod)` : `${lockTitle} (Admin: kattints a feloldáshoz)`) : (unlocked ? t.name : lockTitle)}">
                ${isAdmin && t.id !== "title_beginner" ? `
                  <button type="button" class="card-admin-toggle-badge ${unlocked ? "unlocked" : "locked"}" 
                          data-action="toggle-lock"
                          title="${unlocked ? "Zárolás (Admin)" : "Feloldás (Admin)"}">
                    ${unlocked ? "✓" : "🔒"}
                  </button>
                ` : (!unlocked ? '<span class="avatar-lock-icon">🔒</span>' : "")}
                <div class="title-pick-name">
                  <span class="title-text-label ${t.specialClass || ""}">${t.name}</span>
                  ${specialBadge}
                </div>
            </div>
          `;
        }).join("");

        titleGrid.querySelectorAll(".title-pick-card").forEach((card) => {
          card.addEventListener("click", async function (e) {
            const chosenId = this.getAttribute("data-title-id");
            const titleObj = PROFILE_TITLES.find((t) => t.id === chosenId);
            if (!titleObj) return;

            const isToggleBtn = e.target.closest("[data-action='toggle-lock']");
            const isUnlocked = this.getAttribute("data-unlocked") === "1";

            if (isToggleBtn && isAdmin && titleObj.id !== "title_beginner") {
              e.stopPropagation();
              if (this.dataset.busy === "1") return;
              this.dataset.busy = "1";

              const nextUnlocked = !isUnlocked;
              this.setAttribute("data-unlocked", nextUnlocked ? "1" : "0");
              this.classList.toggle("locked", !nextUnlocked);
              const toggleBtnEl = this.querySelector("[data-action='toggle-lock']");
              if (toggleBtnEl) {
                toggleBtnEl.textContent = nextUnlocked ? "✓" : "🔒";
                toggleBtnEl.className = `card-admin-toggle-badge ${nextUnlocked ? "unlocked" : "locked"}`;
                toggleBtnEl.title = nextUnlocked ? "Zárolás (Admin)" : "Feloldás (Admin)";
              }

              let curTitles = [...(stats.unlockedTitles || ["title_beginner"])];
              if (nextUnlocked) {
                if (!curTitles.includes(chosenId)) curTitles.push(chosenId);
              } else {
                curTitles = curTitles.filter((id) => id !== chosenId);
                if (stats.chosenTitle === chosenId) stats.chosenTitle = "title_beginner";
                this.classList.remove("active");
              }
              stats.unlockedTitles = curTitles;

              triggerHaptic("heavy");
              if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
              try {
                await adminForceUpdatePlayerCustomRewards(
                  stats.username,
                  { unlockedTitles: curTitles, chosenTitle: stats.chosenTitle },
                  nextUnlocked
                    ? `🔓 ${titleObj.name} rangcím feloldva (${stats.username})!`
                    : `🔒 ${titleObj.name} rangcím zárolva (${stats.username})!`,
                  true
                );
              } finally {
                delete this.dataset.busy;
              }
              return;
            }

            if (!isUnlocked) {
              if (isAdmin && titleObj.id !== "title_beginner") {
                this.setAttribute("data-unlocked", "1");
                this.classList.remove("locked");
                const toggleBtnEl = this.querySelector("[data-action='toggle-lock']");
                if (toggleBtnEl) {
                  toggleBtnEl.textContent = "✓";
                  toggleBtnEl.className = "card-admin-toggle-badge unlocked";
                  toggleBtnEl.title = "Zárolás (Admin)";
                }

                let curTitles = [...(stats.unlockedTitles || ["title_beginner"])];
                if (!curTitles.includes(chosenId)) curTitles.push(chosenId);
                stats.unlockedTitles = curTitles;
                stats.chosenTitle = chosenId;
                stats.activeTitle = titleObj;

                if (titleEl) {
                  titleEl.textContent = titleObj.name;
                  titleEl.classList.remove(
                    "title-special-gold",
                    "title-special-cosmic",
                    "title-special-flame",
                    "title-special-rainbow",
                  );
                  if (titleObj.specialClass) {
                    titleEl.classList.add(titleObj.specialClass);
                  }
                }

                titleGrid.querySelectorAll(".title-pick-card").forEach((c) => c.classList.remove("active"));
                this.classList.add("active");

                triggerHaptic("impact");
                if (typeof hangKatt !== "undefined") playSound(hangKatt);
                try {
                  await adminForceUpdatePlayerCustomRewards(
                    stats.username,
                    { unlockedTitles: curTitles, chosenTitle: chosenId },
                    `⚡ ${titleObj.name} rangcím feloldva és beállítva (${stats.username})!`,
                    true
                  );
                } finally {
                  delete this.dataset.busy;
                }
                return;
              } else {
                const reqAch = titleObj.achId
                  ? ACHIEVEMENTS.find((a) => a.id === titleObj.achId)
                  : null;
                showToast(
                  `🔒 Ez a rangcím még zárolva van! Feltétel: ${reqAch?.title || titleObj.desc}`,
                  "warning",
                );
                triggerHaptic("error");
                if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
                return;
              }
            }

            stats.chosenTitle = chosenId;
            stats.activeTitle = titleObj;
            if (isOwnProfile) {
              localStorage.setItem("crashdown_chosen_title", chosenId);
              const localProfiles = JSON.parse(
                localStorage.getItem("crashdown_player_profiles") || "{}",
              );
              if (localProfiles[stats.username]) {
                localProfiles[stats.username].chosenTitle = chosenId;
                localStorage.setItem(
                  "crashdown_player_profiles",
                  JSON.stringify(localProfiles),
                );
              }
            }

            if (window.databaseService) {
              syncPlayerCustomization(stats.username, {
                chosenTitle: chosenId,
              }).catch(() => {});
            }

            if (titleEl) {
              titleEl.textContent = titleObj.name;
              titleEl.classList.remove(
                "title-special-gold",
                "title-special-cosmic",
                "title-special-flame",
                "title-special-rainbow",
              );
              if (titleObj.specialClass) {
                titleEl.classList.add(titleObj.specialClass);
              }
            }

            titleGrid
              .querySelectorAll(".title-pick-card")
              .forEach((c) => c.classList.remove("active"));
            this.classList.add("active");

            showToast(`🎖️ Új rangcím beállítva (${stats.username}): ${titleObj.name}!`, "success");
            playSound(sikeresKatt);
            triggerHaptic("success");
            toplistaMegjelenites();
          });
        });
      }

      if (titleSortSelect) {
        titleSortSelect.onchange = (e) => {
          renderTitles(e.target.value);
        };
        renderTitles(titleSortSelect.value);
      } else {
        renderTitles("default");
      }
    } else {
      titleSection.style.display = "none";
    }
  }

// 7. Profilkép választása (kártyás nézet, rendezhető)
  const avatarSection = document.getElementById("profileAvatarSection");
  const avatarGrid = document.getElementById("profileAvatarGrid");
  const avatarSortSelect = document.getElementById("sortAvatarsSelect");

  if (avatarSection && avatarGrid) {
    if (canManageCustomization) {
      avatarSection.style.display = "block";

      function renderAvatars(sortMode = "default") {
        const sortedAvatars = sortCatalogItems(
          PROFILE_AVATARS,
          sortMode,
          (av) => (stats.unlockedAvatars || ["avatar_default"]).includes(av.id)
        );

        avatarGrid.innerHTML = sortedAvatars.map((av) => {
          const unlocked = (stats.unlockedAvatars || ["avatar_default"]).includes(av.id);
          const isSelected = stats.chosenAvatar
            ? av.id === stats.chosenAvatar
            : av.id === stats.activeAvatar.id;
          const reqAch = av.achId
            ? ACHIEVEMENTS.find((a) => a.id === av.achId)
            : null;
          const lockTitle = reqAch
            ? `Zárolva: ${reqAch.title} (${reqAch.desc}) szükséges hozzá!`
            : "Zárolva";
          const specialBadge = av.isSpecial
            ? '<span class="title-pick-special-tag">Speciális</span>'
            : "";

          return `
            <div class="avatar-pick-card ${unlocked ? "" : "locked"} ${isSelected ? "active" : ""} ${isAdmin ? "admin-manageable" : ""}"
                 data-avatar-id="${av.id}"
                 data-unlocked="${unlocked ? "1" : "0"}"
                 title="${isAdmin ? (unlocked ? `${av.name} (Kattints a beállításhoz, jobb felső gombbal zárolhatod)` : `${lockTitle} (Admin: kattints a feloldáshoz)`) : (unlocked ? av.name : lockTitle)}">
                ${isAdmin && av.id !== "avatar_default" ? `
                  <button type="button" class="card-admin-toggle-badge ${unlocked ? "unlocked" : "locked"}" 
                          data-action="toggle-lock"
                          title="${unlocked ? "Zárolás (Admin)" : "Feloldás (Admin)"}">
                    ${unlocked ? "✓" : "🔒"}
                  </button>
                ` : (!unlocked ? '<span class="avatar-lock-icon">🔒</span>' : "")}
                <div class="avatar-pick-symbol">${av.symbol}</div>
                <div class="avatar-pick-name">${av.name} ${specialBadge}</div>
            </div>
          `;
        }).join("");

        avatarGrid.querySelectorAll(".avatar-pick-card").forEach((card) => {
          card.addEventListener("click", async function (e) {
            const chosenId = this.getAttribute("data-avatar-id");
            const avObj = PROFILE_AVATARS.find((a) => a.id === chosenId);
            if (!avObj) return;

            const isToggleBtn = e.target.closest("[data-action='toggle-lock']");
            const isUnlocked = this.getAttribute("data-unlocked") === "1";

            if (isToggleBtn && isAdmin && avObj.id !== "avatar_default") {
              e.stopPropagation();
              if (this.dataset.busy === "1") return;
              this.dataset.busy = "1";

              const nextUnlocked = !isUnlocked;
              this.setAttribute("data-unlocked", nextUnlocked ? "1" : "0");
              this.classList.toggle("locked", !nextUnlocked);
              const toggleBtnEl = this.querySelector("[data-action='toggle-lock']");
              if (toggleBtnEl) {
                toggleBtnEl.textContent = nextUnlocked ? "✓" : "🔒";
                toggleBtnEl.className = `card-admin-toggle-badge ${nextUnlocked ? "unlocked" : "locked"}`;
                toggleBtnEl.title = nextUnlocked ? "Zárolás (Admin)" : "Feloldás (Admin)";
              }

              let curAvatars = [...(stats.unlockedAvatars || ["avatar_default"])];
              if (nextUnlocked) {
                if (!curAvatars.includes(chosenId)) curAvatars.push(chosenId);
              } else {
                curAvatars = curAvatars.filter((id) => id !== chosenId);
                if (stats.chosenAvatar === chosenId) stats.chosenAvatar = "avatar_default";
                this.classList.remove("active");
              }
              stats.unlockedAvatars = curAvatars;

              triggerHaptic("heavy");
              if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
              try {
                await adminForceUpdatePlayerCustomRewards(
                  stats.username,
                  { unlockedAvatars: curAvatars, chosenAvatar: stats.chosenAvatar },
                  nextUnlocked
                    ? `🔓 ${avObj.name} profilkép feloldva (${stats.username})!`
                    : `🔒 ${avObj.name} profilkép zárolva (${stats.username})!`,
                  true
                );
              } finally {
                delete this.dataset.busy;
              }
              return;
            }

            if (!isUnlocked) {
              if (isAdmin && avObj.id !== "avatar_default") {
                this.setAttribute("data-unlocked", "1");
                this.classList.remove("locked");
                const toggleBtnEl = this.querySelector("[data-action='toggle-lock']");
                if (toggleBtnEl) {
                  toggleBtnEl.textContent = "✓";
                  toggleBtnEl.className = "card-admin-toggle-badge unlocked";
                  toggleBtnEl.title = "Zárolás (Admin)";
                }

                let curAvatars = [...(stats.unlockedAvatars || ["avatar_default"])];
                if (!curAvatars.includes(chosenId)) curAvatars.push(chosenId);
                stats.unlockedAvatars = curAvatars;
                stats.chosenAvatar = chosenId;
                stats.activeAvatar = avObj;

                if (avatarEl) {
                  avatarEl.textContent = avObj.symbol;
                  avatarEl.title = `Profilkép: ${avObj.name}`;
                }

                avatarGrid.querySelectorAll(".avatar-pick-card").forEach((c) => c.classList.remove("active"));
                this.classList.add("active");

                triggerHaptic("impact");
                if (typeof hangKatt !== "undefined") playSound(hangKatt);
                try {
                  await adminForceUpdatePlayerCustomRewards(
                    stats.username,
                    { unlockedAvatars: curAvatars, chosenAvatar: chosenId },
                    `⚡ ${avObj.name} profilkép feloldva és beállítva (${stats.username})!`,
                    true
                  );
                } finally {
                  delete this.dataset.busy;
                }
                return;
              } else {
                const reqAch = avObj.achId
                  ? ACHIEVEMENTS.find((a) => a.id === avObj.achId)
                  : null;
                showToast(
                  `🔒 Ez a profilkép még zárolva van! Feloldáshoz: ${reqAch?.title || "Mérföldkő"}`,
                  "warning",
                );
                triggerHaptic("error");
                if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
                return;
              }
            }

            stats.chosenAvatar = chosenId;
            stats.activeAvatar = avObj;
            if (isOwnProfile) {
              localStorage.setItem("crashdown_chosen_avatar", chosenId);
              const localProfiles = JSON.parse(
                localStorage.getItem("crashdown_player_profiles") || "{}",
              );
              if (localProfiles[stats.username]) {
                localProfiles[stats.username].chosenAvatar = chosenId;
                localStorage.setItem(
                  "crashdown_player_profiles",
                  JSON.stringify(localProfiles),
                );
              }
            }

            if (window.databaseService) {
              syncPlayerCustomization(stats.username, {
                chosenAvatar: chosenId,
              }).catch(() => {});
            }

            if (avatarEl) {
              avatarEl.textContent = avObj.symbol;
              avatarEl.title = `Profilkép: ${avObj.name}`;
            }

            if (isOwnProfile) {
              const currentUserAvatarIcon = document.getElementById(
                "currentUserAvatarIcon",
              );
              if (currentUserAvatarIcon) {
                currentUserAvatarIcon.textContent = avObj.symbol;
              }
            }

            avatarGrid
              .querySelectorAll(".avatar-pick-card")
              .forEach((c) => c.classList.remove("active"));
            this.classList.add("active");

            showToast(`🖼️ Új profilkép beállítva (${stats.username}): ${avObj.name}!`, "success");
            playSound(sikeresKatt);
            triggerHaptic("success");
            toplistaMegjelenites();
          });
        });
      }

      if (avatarSortSelect) {
        avatarSortSelect.onchange = (e) => {
          renderAvatars(e.target.value);
        };
        renderAvatars(avatarSortSelect.value);
      } else {
        renderAvatars("default");
      }
    } else {
      avatarSection.style.display = "none";
    }
  }

  // Színmódok szerinti lebontás
  if (modesListEl) {
    const modes = ["2", "3", "4", "5"];
    modesListEl.innerHTML = modes
      .map((m) => {
        const data = stats.modes[m] || { matches: 0, bestScore: 0 };
        return `
                <div class="profile-mode-card">
                    <div>
                        <strong>🎨 ${m} szín mód</strong>
                        <div style="font-size: 0.7rem; color: var(--text-secondary);">${data.matches} lejátszott meccs</div>
                    </div>
                    <span style="font-weight: 700;">${data.bestScore > 0 ? `${formatScore(data.bestScore)}p` : "-"}</span>
                </div>
            `;
      })
      .join("");
  }

  // Játékmódok szerinti lebontás (Normál, Időhajsza, Robbanás Mánia, Káosz, Nyers)
  const gameModesListEl = document.getElementById("profileGameModesBreakdown");
  if (gameModesListEl) {
    const modDefs = [
      { id: "normal", name: "Normál Mód", icon: "🎯" },
      { id: "time_rush", name: "Időhajsza", icon: "⏳" },
      { id: "bomb_frenzy", name: "Robbanás Mánia", icon: "💣" },
      { id: "chaos", name: "Káosz Mód", icon: "🌀" },
      { id: "no_powerups", name: "Nyers Mód", icon: "🧱" },
    ];
    gameModesListEl.innerHTML = modDefs
      .map((m) => {
        const data = stats.modifierStats?.[m.id] || {
          matches: 0,
          bestScore: 0,
        };
        return `
          <div class="profile-mode-card">
            <div>
              <strong>${m.icon} ${m.name}</strong>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">${data.matches} lejátszott meccs</div>
            </div>
            <span style="font-weight: 700;">${data.bestScore > 0 ? `${formatScore(data.bestScore)}p` : "-"}</span>
          </div>
        `;
      })
      .join("");
  }

  // Játékidő szerinti lebontás (30s, 60s, 90s, 180s)
  const durationsListEl = document.getElementById("profileDurationsBreakdown");
  if (durationsListEl) {
    const durDefs = [
      { id: "30", name: "30 mp (Villám)", icon: "⚡" },
      { id: "60", name: "1 perc (Gyors)", icon: "⏱️" },
      { id: "90", name: "90 mp (Klasszikus)", icon: "⏳" },
      { id: "180", name: "3 perc (Maraton)", icon: "🏃" },
    ];
    durationsListEl.innerHTML = durDefs
      .map((d) => {
        const data = stats.durationStats?.[d.id] || {
          matches: 0,
          bestScore: 0,
        };
        return `
          <div class="profile-mode-card">
            <div>
              <strong>${d.icon} ${d.name}</strong>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">${data.matches} lejátszott meccs</div>
            </div>
            <span style="font-weight: 700;">${data.bestScore > 0 ? `${formatScore(data.bestScore)}p` : "-"}</span>
          </div>
        `;
      })
      .join("");
  }

  const adminBadgeActions = document.getElementById("profileAdminBadgeActions");
  if (adminBadgeActions) {
    if (isAdmin) {
      adminBadgeActions.style.display = "inline-flex";
      const unlockAllBtn = document.getElementById("profileAdminUnlockAllBtn");
      const lockAllBtn = document.getElementById("profileAdminLockAllBtn");

      if (unlockAllBtn) {
        unlockAllBtn.onclick = async (e) => {
          e.stopPropagation();
          if (
            confirm(
              `Biztosan fel szeretnéd oldani az összes (${ACHIEVEMENTS.length} db) jelvényt ${stats.username} számára?`,
            )
          ) {
            await adminForceUpdateUserAchievements(
              stats.username,
              ACHIEVEMENTS.map((a) => a.id),
            );
          }
        };
      }

      if (lockAllBtn) {
        lockAllBtn.onclick = async (e) => {
          e.stopPropagation();
          if (
            confirm(
              `Biztosan vissza szeretnéd zárni az összes jelvényt ${stats.username} profilján?`,
            )
          ) {
            await adminForceUpdateUserAchievements(stats.username, []);
          }
        };
      }
    } else {
      adminBadgeActions.style.display = "none";
    }
  }

if (badgesListEl) {
    const achSortSelect = document.getElementById("sortAchievementsSelect");

    function renderAchievements(sortMode = "default") {
      const sortedAchs = sortCatalogItems(
        ACHIEVEMENTS,
        sortMode,
        (a) => achSet.has(a.id),
        "title"
      );

      badgesListEl.innerHTML = sortedAchs.map((a) => {
        const unlocked = achSet.has(a.id);
        return `
          <div class="profile-badge-item ${unlocked ? "unlocked" : "locked"} ${isAdmin ? "admin-clickable" : ""}" 
               data-ach-id="${a.id}"
               title="${isAdmin ? (unlocked ? 'Kattints a visszazáráshoz (Admin)' : 'Kattints a feloldáshoz (Admin)') : ''}">
            ${isAdmin ? `<span class="badge-admin-dot ${unlocked ? 'unlocked' : 'locked'}">${unlocked ? '✓' : '🔒'}</span>` : ''}
            <span class="profile-badge-icon">${a.icon}</span>
            <span class="profile-badge-name">${a.title}</span>
          </div>
        `;
      }).join("");

      const floatingTip = document.getElementById("profileBadgeFloatingTooltip");
      badgesListEl.querySelectorAll(".profile-badge-item").forEach((item) => {
        const achId = item.getAttribute("data-ach-id");
        const a = ACHIEVEMENTS.find((x) => x.id === achId);
        if (!a || !floatingTip) return;

        item.addEventListener("mouseenter", () => {
          const unlocked = achSet.has(a.id);

          const rewList =
            typeof getAchievementRewards === "function"
              ? getAchievementRewards(a.id)
              : [];

          let rewardBadgeHtml = "";
          if (rewList.length > 0) {
            const tags = rewList
              .map((r) => {
                const spTag = r.isSpecial ? " (Speciális!)" : "";
                return `<span class="ach-tooltip-reward-tag ${r.isSpecial ? "special" : ""}">${r.label}${spTag}</span>`;
              })
              .join(" ");
            rewardBadgeHtml = `
              <div class="ach-tooltip-reward-box">
                <span class="ach-tooltip-reward-title">🎁 Jutalom feloldáskor:</span>
                <div class="ach-tooltip-reward-list">${tags}</div>
              </div>
            `;
          }

          floatingTip.innerHTML = `
            <div class="ach-tooltip-header">
              <span class="ach-tooltip-icon">${a.icon}</span>
              <div class="ach-tooltip-title-wrap">
                <span class="ach-tooltip-title">${a.title}</span>
                <span class="ach-tooltip-status ${unlocked ? "unlocked" : "locked"}">${unlocked ? "✓ Teljesítve" : "🔒 Zárolva"}</span>
              </div>
            </div>
            <div class="ach-tooltip-desc">${a.desc}</div>
            ${rewardBadgeHtml}
            ${isAdmin ? '<div class="ach-tooltip-admin-hint">⚡ Admin kattintás: azonnali feloldás / zárolás</div>' : ""}
          `;

          floatingTip.style.display = "block";
          const rect = item.getBoundingClientRect();
          const tipWidth = 260;
          let leftPos = rect.left + rect.width / 2 - tipWidth / 2;
          if (leftPos < 10) leftPos = 10;
          if (leftPos + tipWidth > window.innerWidth - 10) {
            leftPos = window.innerWidth - tipWidth - 10;
          }
          let topPos = rect.top - floatingTip.offsetHeight - 8;
          if (topPos < 10) {
            topPos = rect.bottom + 8;
          }
          floatingTip.style.left = `${leftPos}px`;
          floatingTip.style.top = `${topPos}px`;
        });

        item.addEventListener("mouseleave", () => {
          floatingTip.style.display = "none";
        });

        if (isAdmin) {
          item.addEventListener("click", async () => {
            const isCurrentlyUnlocked = achSet.has(a.id);
            floatingTip.style.display = "none";
            await adminToggleSingleAchievement(stats.username, a.id, isCurrentlyUnlocked);
          });
        }
      });
    }

    if (achSortSelect) {
      achSortSelect.onchange = (e) => {
        renderAchievements(e.target.value);
      };
      renderAchievements(achSortSelect.value);
    } else {
      renderAchievements("default");
    }
  }

  const historyListEl = document.getElementById("profileHistoryList");
  if (historyListEl) {
    const history = stats.history || [];
    if (history.length === 0) {
      historyListEl.innerHTML =
        '<div class="history-empty">Még nincs rögzített meccselőzmény. Játssz le egy mérkőzést!</div>';
    } else {
      historyListEl.innerHTML = history
        .map((item) => {
          const dateObj = item.timestamp
            ? new Date(item.timestamp)
            : new Date();
          const dateStr = dateObj.toLocaleDateString("hu-HU", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          const modKey = item.modifier || "normal";
          const modBadge =
            typeof GAME_MODIFIERS !== "undefined" &&
            GAME_MODIFIERS[modKey]?.badge
              ? GAME_MODIFIERS[modKey].badge
              : "Normál";
          return `
                    <div class="profile-history-item">
                        <div class="history-left">
                            <span class="history-mode-tag">${item.color} sz • ${modBadge} • ${item.duration}s</span>
                            <span class="history-date">${dateStr}</span>
                        </div>
                        <div class="history-right">
                            <span class="history-score">${item.score} p</span>
                        </div>
                    </div>
                `;
        })
        .join("");
    }
  }

  const modal = document.getElementById("playerProfileModal");
  if (modal) {
    modal.classList.remove("hidden");
    if (resetScroll) {
      modal.scrollTop = 0;
      const cardEl = modal.querySelector(".modal-card");
      if (cardEl) cardEl.scrollTop = 0;
      const contentArea = modal.querySelector(".profile-content-area");
      if (contentArea) contentArea.scrollTop = 0;
    }
  }
}

/**
 * Valós idejű profil-frissítés, ha a megtekintett játékos éppen módosította
 * a rangcímét, névszínét vagy profilképét
 */
async function refreshOpenProfileModalRealtime(username) {
  const modal = document.getElementById("playerProfileModal");
  if (!modal || modal.classList.contains("hidden")) return;
  if (
    !window.currentlyViewedProfileUser ||
    window.currentlyViewedProfileUser.toLowerCase() !== username.toLowerCase()
  ) {
    return;
  }

  // Teljes profil újrarajzolása valós időben a legfrissebb adatokkal, görgetési pozíció megtartásával
  const pArea = document.querySelector(".profile-content-area");
  const prevScroll = pArea ? pArea.scrollTop : 0;
  await openPlayerProfileModal(username, false);
  const pAreaAfter = document.querySelector(".profile-content-area");
  if (pAreaAfter) {
    pAreaAfter.scrollTop = prevScroll;
  }
}

// ==================== JÁTÉKOSOK (PLAYERS & PRESENCE) MODAL ====================
let currentPlayersSearchQuery = "";

async function openPlayersModal() {
  const modal = document.getElementById("playersModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  await updatePlayersModalUI();
  const searchInput = document.getElementById("playerSearchInput");
  if (searchInput) {
    searchInput.value = "";
    currentPlayersSearchQuery = "";
  }
}

function closePlayersModal() {
  const modal = document.getElementById("playersModal");
  if (modal) modal.classList.add("hidden");
}

async function updatePlayersModalUI() {
  const modal = document.getElementById("playersModal");
  if (!modal || modal.classList.contains("hidden")) return;

  const container = document.getElementById("playersListContainer");
  if (!container) return;

  let players = [];
  if (
    window.leaderboardService &&
    typeof window.leaderboardService.getAllRegisteredPlayers === "function"
  ) {
    players = await window.leaderboardService.getAllRegisteredPlayers();
  } else {
    const local = JSON.parse(
      localStorage.getItem("crashdown_player_profiles") || "{}",
    );
    players = Object.keys(local)
      .map((k) => local[k])
      .filter((p) => p && p.username);
  }

  const presenceData = window.onlinePresenceData || {};

  // Szűrés a keresőmező alapján
  const q = currentPlayersSearchQuery.trim().toLowerCase();
  let filtered = players;
  if (q) {
    filtered = players.filter((p) =>
      String(p.username || "")
        .toLowerCase()
        .includes(q),
    );
  }

  // Rendezés: online játékosok elöl, utána legjobb pontszám szerint csökkenő
  filtered.sort((a, b) => {
    const aKey = encodeURIComponent(
      String(a.username || "").trim().toLowerCase(),
    ).replace(/\./g, "%2E");
    const bKey = encodeURIComponent(
      String(b.username || "").trim().toLowerCase(),
    ).replace(/\./g, "%2E");
    const aOnline = presenceData[aKey]?.online === true;
    const bOnline = presenceData[bKey]?.online === true;
    if (aOnline !== bOnline) return bOnline ? 1 : -1;
    return (b.bestScore || 0) - (a.bestScore || 0);
  });

  // Online számlálók
  let onlineCount = 0;
  players.forEach((p) => {
    const safeKey = encodeURIComponent(
      String(p.username || "").trim().toLowerCase(),
    ).replace(/\./g, "%2E");
    if (presenceData[safeKey]?.online === true) onlineCount++;
  });

  const onlineBadge = document.getElementById("onlinePlayersCountBadge");
  const totalBadge = document.getElementById("totalPlayersCountBadge");
  if (onlineBadge) onlineBadge.textContent = `🟢 ${onlineCount} online`;
  if (totalBadge)
    totalBadge.textContent = `${players.length} regisztrált játékos`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="players-empty-notice">
        ${q ? "Nincs a keresésnek megfelelő játékos." : "Még nincsenek regisztrált játékosok."}
      </div>
    `;
    return;
  }

  const nameColorCatalog =
    typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
  const avatarsList =
    typeof PROFILE_AVATARS !== "undefined" ? PROFILE_AVATARS : [];
  const titlesList =
    typeof PROFILE_TITLES !== "undefined" ? PROFILE_TITLES : [];

  container.innerHTML = filtered
    .map((p) => {
      const safeKey = encodeURIComponent(
        String(p.username || "").trim().toLowerCase(),
      ).replace(/\./g, "%2E");
      const isOnline = presenceData[safeKey]?.online === true;
      const avObj =
        avatarsList.find((a) => a.id === p.chosenAvatar) ||
        avatarsList[0] || { symbol: "👤" };
      const titleObj = titlesList.find((t) => t.id === p.chosenTitle);
      const nameColorObj = nameColorCatalog.find(
        (c) => c.id === p.chosenNameColor,
      );

      const nameClass = nameColorObj?.className || "";
      const titleClass = titleObj?.specialClass || "";
      const titleText = titleObj?.name || "Kezdő Blokktörő";
      const bestScoreText = formatScore(p.bestScore || 0);

      return `
      <div class="player-roster-card lb-clickable" data-player-name="${p.username}" title="Kattints a profil megtekintéséhez!">
        <div class="player-roster-left">
          <div class="player-roster-avatar-wrap">
            <span class="player-roster-avatar">${avObj.symbol}</span>
            <span class="presence-dot ${isOnline ? "online" : "offline"}" title="${isOnline ? "Online" : "Offline"}"></span>
          </div>
          <div class="player-roster-info">
            <strong class="player-roster-name ${nameClass}">${p.username}</strong>
            <div class="player-roster-title ${titleClass}">${titleText}</div>
          </div>
        </div>
        <div class="player-roster-right">
          <span class="presence-label ${isOnline ? "online" : "offline"}">${isOnline ? "🟢 Online" : "⚪ Offline"}</span>
          <span class="player-roster-score">${bestScoreText} p</span>
          <span class="player-roster-matches">${p.totalMatches || 0} meccs</span>
        </div>
      </div>
    `;
    })
    .join("");

  container.querySelectorAll(".player-roster-card").forEach((card) => {
    card.addEventListener("click", function () {
      const uName = this.getAttribute("data-player-name");
      if (uName) {
        window.openedProfileFromPlayersModal = true;
        closePlayersModal();
        openPlayerProfileModal(uName);
      }
    });
  });
}

// ==================== AUTH MODAL KEZELÉS ====================
let isRegisterMode = false;

function openAuthModal(withPendingNotice = false) {
  const authModal = document.getElementById("authModal");
  const authErrorMsg = document.getElementById("authErrorMsg");
  const authPendingNotice = document.getElementById("authPendingNotice");
  const pendingScoreVal = document.getElementById("pendingScoreVal");
  if (!authModal) return;
  authModal.classList.remove("hidden");
  if (authErrorMsg) authErrorMsg.style.display = "none";

  if (withPendingNotice && pendingScore) {
    if (authPendingNotice) authPendingNotice.style.display = "flex";
    if (pendingScoreVal) pendingScoreVal.textContent = pendingScore.score;
  } else {
    if (authPendingNotice) authPendingNotice.style.display = "none";
  }
}

function closeAuthModal() {
  const authModal = document.getElementById("authModal");
  const authErrorMsg = document.getElementById("authErrorMsg");
  if (!authModal) return;
  authModal.classList.add("hidden");
  if (authErrorMsg) authErrorMsg.style.display = "none";
}

function setAuthMode(register) {
  isRegisterMode = register;
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");
  const displayNameField = document.getElementById("displayNameField");
  const authModalTitle = document.getElementById("authModalTitle");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const forgotPwWrap = document.getElementById("forgotPasswordWrap");
  const authErrorMsg = document.getElementById("authErrorMsg");

  if (tabLoginBtn) tabLoginBtn.classList.toggle("active", !register);
  if (tabRegisterBtn) tabRegisterBtn.classList.toggle("active", register);
  if (displayNameField)
    displayNameField.style.display = register ? "flex" : "none";
  if (authModalTitle)
    authModalTitle.textContent = register
      ? "Új fiók regisztrációja"
      : "Bejelentkezés";
  if (authSubmitBtn)
    authSubmitBtn.textContent = register
      ? "Regisztráció és mentés"
      : "Bejelentkezés";
  if (forgotPwWrap) forgotPwWrap.style.display = register ? "none" : "flex";
  if (authErrorMsg) authErrorMsg.style.display = "none";
}

function showAuthError(msg) {
  const authErrorMsg = document.getElementById("authErrorMsg");
  if (authErrorMsg) {
    authErrorMsg.textContent = msg;
    authErrorMsg.style.display = "block";
  }
}

// ==================== JELSZÓMÓDOSÍTÁS MODAL ====================
function openChangePasswordModal() {
  const user = window.authService?.getCurrentUser();
  if (!user) {
    showToast(
      "Kérjük, előbb jelentkezz be a jelszavad megváltoztatásához!",
      "info",
    );
    openAuthModal(false);
    return;
  }
  const changePwEmailHint = document.getElementById("changePwEmailHint");
  const changePasswordErrorMsg = document.getElementById(
    "changePasswordErrorMsg",
  );
  const p1 = document.getElementById("newPasswordInput");
  const p2 = document.getElementById("confirmNewPasswordInput");
  const modal = document.getElementById("passwordChangeModal");

  if (changePwEmailHint) changePwEmailHint.textContent = user.email;
  if (changePasswordErrorMsg) changePasswordErrorMsg.style.display = "none";
  if (p1) p1.value = "";
  if (p2) p2.value = "";
  if (modal) modal.classList.remove("hidden");
}

function closeChangePasswordModal() {
  const modal = document.getElementById("passwordChangeModal");
  if (modal) modal.classList.add("hidden");
}

function showChangePwError(msg) {
  const changePasswordErrorMsg = document.getElementById(
    "changePasswordErrorMsg",
  );
  if (changePasswordErrorMsg) {
    changePasswordErrorMsg.textContent = msg;
    changePasswordErrorMsg.style.display = "block";
  }
}

// ==================== AUTH UI ÁLLAPOT FRISSÍTÉSE ====================
function updateAuthUI(user) {
  const openAuthBtn = document.getElementById("openAuthModalBtn");
  const myProfileBtn = document.getElementById("openMyProfileBtn");
  const changePwBtn = document.getElementById("openChangePasswordModalBtn");
  const logoutBtnEl = document.getElementById("logoutBtn");
  const nameLabel = document.getElementById("currentUserNameLabel");
  const avatarDot = document.getElementById("userAvatarDot");
  const openAchievementsBtn = document.getElementById("openAchievementsBtn");
  const navAdminToggleBtn = document.getElementById("navAdminModeToggleBtn");

  if (navAdminToggleBtn) {
    if (user && isEligibleAdmin()) {
      navAdminToggleBtn.style.display = "inline-flex";
      const active = isAdminModeActive();
      navAdminToggleBtn.classList.toggle("active", active);
      const icon = document.getElementById("navAdminModeIcon");
      const text = document.getElementById("navAdminModeText");
      if (icon) icon.textContent = active ? "⚡" : "🛡️";
      if (text) text.textContent = active ? "Admin Aktív" : "Admin Mód";
      navAdminToggleBtn.title = active
        ? "Adminisztrátori mód aktív. Kattints a kikapcsoláshoz!"
        : "Kattints az Adminisztrátori mód bekapcsolásához!";
      navAdminToggleBtn.onclick = (e) => {
        e.stopPropagation();
        toggleAdminMode();
      };
    } else {
      navAdminToggleBtn.style.display = "none";
    }
  }

  if (user) {
    if (openAuthBtn) openAuthBtn.style.display = "none";
    if (openAchievementsBtn) openAchievementsBtn.style.display = "inline-flex";
    if (myProfileBtn) myProfileBtn.style.display = "inline-flex";
    if (changePwBtn) changePwBtn.style.display = "inline-flex";
    if (logoutBtnEl) logoutBtnEl.style.display = "inline-flex";

    if (nameLabel) {
      nameLabel.textContent = user.displayName;
      const nameColorCatalog =
        typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
      nameColorCatalog.forEach((c) => nameLabel.classList.remove(c.className));
      try {
        const myStats = getPlayerProfileStats(user.displayName);
        if (myStats?.activeNameColor?.className) {
          nameLabel.classList.add(myStats.activeNameColor.className);
        }
      } catch (e) {}

      if (isAdminUser()) {
        nameLabel.innerHTML = `${user.displayName} <span class="top-nav-admin-badge">⚡ ADMIN</span>`;
      }
    }
    try {
      const myStats = getPlayerProfileStats(user.displayName);
      if (avatarDot)
        avatarDot.textContent = myStats?.activeAvatar?.symbol || "👤";
    } catch (e) {}
  } else {
    if (openAuthBtn) openAuthBtn.style.display = "inline-flex";
    if (openAchievementsBtn) openAchievementsBtn.style.display = "none";
    if (myProfileBtn) myProfileBtn.style.display = "none";
    if (changePwBtn) changePwBtn.style.display = "none";
    if (logoutBtnEl) logoutBtnEl.style.display = "none";
    if (nameLabel) {
      nameLabel.textContent = "";
      const nameColorCatalog =
        typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
      nameColorCatalog.forEach((c) => nameLabel.classList.remove(c.className));
    }
    if (avatarDot) avatarDot.textContent = "👤";
  }
}

// ==================== RANGLISTA SERVICE & MEGJELENÍTÉS ====================
async function toplistaHozzaadas(jatekosAdat) {
  if (!jatekosAdat.chosenAvatar) {
    jatekosAdat.chosenAvatar =
      localStorage.getItem("crashdown_chosen_avatar") || "avatar_default";
  }
  if (!jatekosAdat.chosenTitle) {
    jatekosAdat.chosenTitle =
      localStorage.getItem("crashdown_chosen_title") || null;
  }
  if (!jatekosAdat.chosenNameColor) {
    jatekosAdat.chosenNameColor =
      localStorage.getItem("crashdown_chosen_name_color") || "name_white";
  }

  if (window.leaderboardService) {
    return await window.leaderboardService.addScore(jatekosAdat);
  }
  let toplista = JSON.parse(localStorage.getItem("toplista")) || [];
  const userNameLower = String(jatekosAdat.name || "")
    .trim()
    .toLowerCase();
  const targetColor = String(jatekosAdat.color || "3");
  const targetModifier = String(jatekosAdat.modifier || "normal");
  const newScore = parseInt(jatekosAdat.score, 10) || 0;

  const existingIndex = toplista.findIndex(
    (s) =>
      String(s.name || "")
        .trim()
        .toLowerCase() === userNameLower &&
      String(s.color || "3") === targetColor &&
      String(s.modifier || "normal") === targetModifier,
  );

  let isRecord = false;
  let previousBest = 0;

  if (existingIndex !== -1) {
    const existing = toplista[existingIndex];
    previousBest = parseInt(existing.score, 10) || 0;
    if (newScore > previousBest) {
      existing.score = newScore;
      existing.duration = jatekosAdat.duration;
      existing.modifier = targetModifier;
      existing.timestamp = jatekosAdat.timestamp;
      existing.chosenAvatar = jatekosAdat.chosenAvatar;
      existing.chosenTitle = jatekosAdat.chosenTitle;
      existing.chosenNameColor = jatekosAdat.chosenNameColor;
      isRecord = true;
    } else {
      return { success: true, isRecord: false, previousBest: previousBest };
    }
  } else {
    jatekosAdat.modifier = targetModifier;
    toplista.push(jatekosAdat);
    isRecord = true;
  }

  toplista.sort((a, b) => b.score - a.score);
  localStorage.setItem("toplista", JSON.stringify(toplista));
  return {
    success: true,
    isRecord: isRecord,
    previousBest: previousBest,
    isOnline: false,
  };
}

async function toplistaMegjelenites() {
  let toplista = [];
  if (window.leaderboardService) {
    toplista = await window.leaderboardService.getScores();
    const syncTag = document.getElementById("leaderboardSyncTag");
    const scopeBadge = document.getElementById("leaderboardScopeBadge");
    if (syncTag) {
      syncTag.className = `status-indicator ${window.leaderboardService.isOnline ? "" : "offline"}`;
      syncTag.title = window.leaderboardService.isOnline
        ? "Firebase Online Szinkronizáció Aktív"
        : "Helyi Mód";
    }
    if (scopeBadge) {
      scopeBadge.textContent = window.leaderboardService.isOnline
        ? "Globális Online"
        : "Helyi Rekordok";
    }
  } else {
    toplista = JSON.parse(localStorage.getItem("toplista")) || [];
  }

  const toplistaLista = document.getElementById("toplistaLista");
  if (!toplistaLista) return;
  toplistaLista.innerHTML = "";

  const selColor = document.getElementById("lbFilterColor");
  if (selColor && selColor.value !== currentLeaderboardColorFilter) {
    selColor.value = currentLeaderboardColorFilter;
  }
  const selMode = document.getElementById("lbFilterMode");
  if (selMode && selMode.value !== currentLeaderboardModeFilter) {
    selMode.value = currentLeaderboardModeFilter;
  }
  const selTime = document.getElementById("lbFilterTime");
  if (selTime && selTime.value !== currentLeaderboardTimeFilter) {
    selTime.value = currentLeaderboardTimeFilter;
  }

  if (currentLeaderboardColorFilter !== "all") {
    toplista = toplista.filter(
      (elem) => String(elem.color) === String(currentLeaderboardColorFilter),
    );
  }
  if (currentLeaderboardModeFilter !== "all") {
    toplista = toplista.filter(
      (elem) =>
        String(elem.modifier || "normal") ===
        String(currentLeaderboardModeFilter),
    );
  }
  if (currentLeaderboardTimeFilter !== "all") {
    toplista = toplista.filter(
      (elem) =>
        String(elem.duration || "60") === String(currentLeaderboardTimeFilter),
    );
  }

  if (toplista.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "leaderboard-empty";
    emptyLi.textContent =
      "Még nincs mentett eredmény ebben a kategóriában. Legyél te az első!";
    toplistaLista.appendChild(emptyLi);
    return;
  }

  const medals = ["🥇", "🥈", "🥉"];
  toplista.forEach((elem, i) => {
    const listaElem = document.createElement("li");
    listaElem.className = `leaderboard-item ${i < 3 ? `rank-${i + 1}` : ""} lb-clickable`;
    listaElem.title = `Kattints ${elem.name} profiljának és statisztikáinak megtekintéséhez!`;
    listaElem.addEventListener("click", () => {
      openPlayerProfileModal(elem.name);
    });

    const leftDiv = document.createElement("div");
    leftDiv.className = "lb-left";

    const rankSpan = document.createElement("span");
    rankSpan.className = "lb-rank";
    rankSpan.textContent = i < 3 ? medals[i] : `${i + 1}.`;
    leftDiv.appendChild(rankSpan);

    try {
      const pStats = getPlayerProfileStats(elem.name, toplista);
      if (pStats && pStats.activeAvatar) {
        const avatarSpan = document.createElement("span");
        avatarSpan.className = "lb-avatar";
        avatarSpan.textContent = pStats.activeAvatar.symbol;
        avatarSpan.title = `Profilkép: ${pStats.activeAvatar.name}`;
        leftDiv.appendChild(avatarSpan);
      }
    } catch (e) {}

    const rawName = String(elem.name || "Játékos");

    const nameSpan = document.createElement("span");
    nameSpan.className = "lb-name";
    nameSpan.textContent = rawName;
    nameSpan.title = rawName;

    try {
      const pStats = getPlayerProfileStats(elem.name, toplista);
      if (
        pStats &&
        pStats.activeNameColor &&
        pStats.activeNameColor.className
      ) {
        nameSpan.classList.add(pStats.activeNameColor.className);
      }
    } catch (e) {}

    leftDiv.appendChild(nameSpan);

    const rightDiv = document.createElement("div");
    rightDiv.className = "lb-right";

    const scoreSpan = document.createElement("span");
    scoreSpan.className = "lb-score";
    scoreSpan.textContent = `${formatScore(elem.score)} p`;

    const colorTag = document.createElement("span");
    colorTag.className = "lb-color-tag";
    const modKey = elem.modifier || "normal";
    const modBadge =
      typeof GAME_MODIFIERS !== "undefined" && GAME_MODIFIERS[modKey]?.badge
        ? GAME_MODIFIERS[modKey].badge
        : "Normál";
    const durText = elem.duration ? `${elem.duration}s` : "60s";
    colorTag.textContent = `${elem.color} sz • ${modBadge} • ${durText}`;

    rightDiv.appendChild(scoreSpan);
    rightDiv.appendChild(colorTag);

    const rightWrapper = document.createElement("div");
    rightWrapper.className = "lb-right-wrapper";
    rightWrapper.appendChild(rightDiv);

    if (isAdminUser()) {
      const delBtn = document.createElement("button");
      delBtn.className = "lb-admin-delete-btn";
      delBtn.title = `Eredmény törlése (Admin) - ${elem.name} (${formatScore(elem.score)} p)`;
      delBtn.innerHTML = "🗑️";
      delBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm(`Biztosan törölni szeretnéd ezt az eredményt a ranglistáról?\n\nJátékos: ${elem.name}\nPontszám: ${formatScore(elem.score)} p\nKategória: ${elem.color} szín • ${modBadge} • ${durText}`)) {
          if (window.leaderboardService && typeof window.leaderboardService.deleteScoreRecord === "function") {
            await window.leaderboardService.deleteScoreRecord(elem);
          } else {
            let toplista = JSON.parse(localStorage.getItem("toplista")) || [];
            toplista = toplista.filter(s => !(s.name === elem.name && String(s.score) === String(elem.score)));
            localStorage.setItem("toplista", JSON.stringify(toplista));
          }
          showToast(`🗑️ Eredmény törölve és profil statisztikák újraszámolva!`, "success");
          await toplistaMegjelenites();
          if (typeof updatePlayersModalUI === "function") {
            updatePlayersModalUI();
          }
        }
      });
      rightWrapper.appendChild(delBtn);
    }

    listaElem.appendChild(leftDiv);
    listaElem.appendChild(rightWrapper);
    toplistaLista.appendChild(listaElem);
  });
}
