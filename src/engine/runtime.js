/* ================================================================
   CRASHDOWN ARCADE - UNIFIED RUNTIME & PIXIJS ENGINE INTEGRATION
   ================================================================ */

import { PixiBoardRenderer } from "./pixiRenderer.js";
import {
  THEME_PALETTES,
  THEMES_CATALOG,
  NAME_COLORS_CATALOG,
  PROFILE_AVATARS,
  GAME_MODIFIERS,
  COLOR_STYLES,
  ACHIEVEMENTS,
  MATCHES_MILESTONES,
  cleanSymbolText,
  getAchievementRewards as getAchievementRewardsBase,
  PROFILE_TITLES,
} from "../data/index.js";
import { sortCatalogItems } from "../utils/catalogSort.js";

let runtimeInitialized = false;

export function initCrashdownRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;

  /**
   * FIREBASE KONFIGURÁCIÓ, AUTHENTICATION ÉS GLOBÁLIS ONLINE RANGLISTA
   */

  const firebaseConfig = {
    apiKey: "AIzaSyCxKwf8_rqsSDxrAtO6lIl3h2mD2dfM6TU",
    authDomain: "multi-beadando-crashdown.firebaseapp.com",
    databaseURL:
      "https://multi-beadando-crashdown-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "multi-beadando-crashdown",
    storageBucket: "multi-beadando-crashdown.firebasestorage.app",
    messagingSenderId: "147405695983",
    appId: "1:147405695983:web:d31a586120b78af4aba41a",
    measurementId: "G-YBLP9TEZN4",
  };

  // Azonnali Firebase App inicializálás a modul betöltésekor
  if (typeof firebase !== "undefined") {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase sikeresen inicializálva a konfigurációval.");
      }
    } catch (err) {
      console.warn("Firebase initializeApp figyelmeztetés:", err.message);
    }
  }

  // ==================== AUTH SERVICE ====================
  function getHungarianAuthErrorMessage(err, context = "login") {
    if (!err) return "Ismeretlen hiba történt a művelet során.";
    const code = err.code || "";
    switch (code) {
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
        return "Helytelen e-mail cím vagy jelszó!";
      case "auth/user-not-found":
        return "Nem található fiók ezzel az e-mail címmel!";
      case "auth/wrong-password":
        return "Helytelen jelszó!";
      case "auth/email-already-in-use":
        return "Ez az e-mail cím már regisztrálva van! Jelentkezz be!";
      case "auth/invalid-email":
        return "Érvénytelen e-mail cím formátum! Kérjük ellenőrizd az e-mail címed.";
      case "auth/weak-password":
        return "Túl gyenge jelszó! A jelszónak legalább 6 karakter hosszúnak kell lennie.";
      case "auth/missing-password":
        return "Kérjük, add meg a jelszavad!";
      case "auth/too-many-requests":
        return "Túl sok sikertelen próbálkozás történt! Kérjük, várj pár percet a következő próbálkozás előtt.";
      case "auth/user-disabled":
        return "Ez a felhasználói fiók fel van függesztve vagy le van tiltva.";
      case "auth/network-request-failed":
        return "Hálózati hiba történt! Kérjük, ellenőrizd az internetkapcsolatodat.";
      case "auth/requires-recent-login":
        return "Biztonsági okokból kérjük, jelentkezz be újra a módosítás előtt!";
      case "auth/operation-not-allowed":
        return "Az e-mail/jelszó bejelentkezés jelenleg nincs engedélyezve a rendszerben.";
      default:
        return context === "register"
          ? "Nem sikerült létrehozni a fiókot. Kérjük, próbáld újra!"
          : "Sikertelen bejelentkezés. Kérjük, ellenőrizd az adataidat és próbáld újra!";
    }
  }

  class AuthService {
    constructor() {
      this.currentUser = null;
      this.authSubscribers = [];
      this.auth = null;
      this.init();
    }

    init() {
      try {
        if (typeof firebase !== "undefined" && firebase.apps.length > 0) {
          this.auth = firebase.auth();
          console.log("Firebase Auth szolgáltatás aktív.");

          this.auth.onAuthStateChanged(async (user) => {
            if (user) {
              this.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split("@")[0],
              };
              sessionStorage.setItem(
                "crashdown_session_user",
                JSON.stringify(this.currentUser),
              );
              await this.syncUserProfileSession(this.currentUser);
            } else {
              // Ellenőrizzük a helyi mentett felhasználót
              this.currentUser = JSON.parse(
                sessionStorage.getItem("crashdown_session_user") || "null",
              );
              if (this.currentUser) {
                await this.syncUserProfileSession(this.currentUser);
              } else {
                this.clearUserSessionState();
              }
            }
            this.notifyAuthChanged();
          });

          // Helyi felhasználók automatikus feltöltése a Firebase Auth-ba
          setTimeout(() => {
            this.syncLocalUsersToFirebase();
          }, 800);
        } else {
          this.currentUser = JSON.parse(
            sessionStorage.getItem("crashdown_session_user") || "null",
          );
          this.notifyAuthChanged();
        }
      } catch (e) {
        console.warn(
          "Firebase Auth inicializálás, helyi mód aktív:",
          e.message,
        );
        this.currentUser = JSON.parse(
          sessionStorage.getItem("crashdown_session_user") || "null",
        );
        this.notifyAuthChanged();
      }
    }

    onAuthStateChanged(cb) {
      this.authSubscribers.push(cb);
      cb(this.currentUser);
    }

    notifyAuthChanged() {
      this.authSubscribers.forEach((cb) => {
        try {
          cb(this.currentUser);
        } catch (e) {
          console.error(e);
        }
      });
    }

    findLocalUser(email, password) {
      const users = JSON.parse(
        localStorage.getItem("crashdown_local_users") || "[]",
      );
      if (password !== undefined) {
        return users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password,
        );
      }
      return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    }

    removeLocalUser(email) {
      let users = JSON.parse(
        localStorage.getItem("crashdown_local_users") || "[]",
      );
      users = users.filter(
        (u) => u.email.toLowerCase() !== email.toLowerCase(),
      );
      localStorage.setItem("crashdown_local_users", JSON.stringify(users));
    }

    /**
     * Korábban helyben (localStorage-ben) regisztrált felhasználók migrálása Firebase Auth-ba
     */
    async syncLocalUsersToFirebase() {
      if (!this.auth) return;
      const localUsers = JSON.parse(
        localStorage.getItem("crashdown_local_users") || "[]",
      );
      if (!localUsers || !localUsers.length) return;

      console.log(
        `[AuthService] ${localUsers.length} korábban helyben tárolt felhasználó migrálása a Firebase Auth-ba...`,
      );
      const initialCurrentUser = this.auth.currentUser;

      for (const u of [...localUsers]) {
        if (!u.email || !u.password) continue;
        try {
          const cred = await this.auth.createUserWithEmailAndPassword(
            u.email,
            u.password,
          );
          if (cred.user) {
            await cred.user.updateProfile({
              displayName: u.displayName || u.email.split("@")[0],
            });
            console.log(
              `[AuthService] Sikeresen feltöltve Firebase Auth-ba: ${u.email}`,
            );
            this.removeLocalUser(u.email);
          }
        } catch (err) {
          if (err.code === "auth/email-already-in-use") {
            // Már létezik a Firebase-ben
            console.log(
              `[AuthService] ${u.email} már szerepel a Firebase Auth adatbázisban.`,
            );
            this.removeLocalUser(u.email);
          } else if (err.code === "auth/operation-not-allowed") {
            console.warn(
              "[AuthService] Firebase Console: Email/Password Authentication nincs bekapcsolva!",
            );
            break;
          } else {
            console.warn(
              `[AuthService] Nem sikerült a szinkronizálás (${u.email}):`,
              err.message,
            );
          }
        }
      }

      // Ha eredetileg senki nem volt bejelentkezve, vagy más volt belépve, kijelentkezünk
      if (!initialCurrentUser && this.auth.currentUser) {
        await this.auth.signOut();
      }
    }

    async register(email, password, displayName) {
      // 1. Megpróbáljuk Firebase Auth-szal regisztrálni
      if (this.auth) {
        try {
          const cred = await this.auth.createUserWithEmailAndPassword(
            email,
            password,
          );
          if (cred.user) {
            if (displayName) {
              await cred.user.updateProfile({ displayName: displayName });
            }
            this.currentUser = {
              uid: cred.user.uid,
              email: cred.user.email,
              displayName: displayName || cred.user.email.split("@")[0],
            };
            sessionStorage.setItem(
              "crashdown_session_user",
              JSON.stringify(this.currentUser),
            );
            this.removeLocalUser(email);
            await this.syncUserProfileSession(this.currentUser);
            this.notifyAuthChanged();
            return { success: true, user: this.currentUser };
          }
        } catch (err) {
          console.error(
            "Firebase Auth regisztrációs hiba:",
            err.code,
            err.message,
          );
          return {
            success: false,
            error: getHungarianAuthErrorMessage(err, "register"),
          };
        }
      }

      // 2. Tartalék helyi regisztráció ha a hálózat nem elérhető
      return await this.registerLocally(email, password, displayName);
    }

    async registerLocally(email, password, displayName) {
      let users = JSON.parse(
        localStorage.getItem("crashdown_local_users") || "[]",
      );
      const existing = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (existing) {
        return {
          success: false,
          error: "Ez az e-mail cím már regisztrálva van!",
        };
      }

      const newUser = {
        uid: "local_" + Date.now(),
        email: email,
        displayName: displayName || email.split("@")[0],
        password: password,
      };
      users.push(newUser);
      localStorage.setItem("crashdown_local_users", JSON.stringify(users));

      this.currentUser = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
      };
      sessionStorage.setItem(
        "crashdown_session_user",
        JSON.stringify(this.currentUser),
      );
      await this.syncUserProfileSession(this.currentUser);
      this.notifyAuthChanged();
      return { success: true, user: this.currentUser };
    }

    async login(email, password) {
      // 1. Megpróbáljuk Firebase Auth-szal beléptetni
      if (this.auth) {
        try {
          const cred = await this.auth.signInWithEmailAndPassword(
            email,
            password,
          );
          if (cred.user) {
            this.currentUser = {
              uid: cred.user.uid,
              email: cred.user.email,
              displayName:
                cred.user.displayName || cred.user.email.split("@")[0],
            };
            sessionStorage.setItem(
              "crashdown_session_user",
              JSON.stringify(this.currentUser),
            );
            this.removeLocalUser(email);
            await this.syncUserProfileSession(this.currentUser);
            this.notifyAuthChanged();
            return { success: true, user: this.currentUser };
          }
        } catch (err) {
          console.warn(
            "Firebase Auth bejelentkezési hiba:",
            err.code,
            err.message,
          );

          // Ha nem található a Firebase-ben, ellenőrizzük: szerepel-e a helyi tárolóban?
          if (
            err.code === "auth/user-not-found" ||
            err.code === "auth/wrong-password"
          ) {
            const localUser = this.findLocalUser(email, password);
            if (localUser) {
              // Megtaláltuk a helyi tárolóban! Feltöltjük (migráljuk) a Firebase-be
              try {
                const newCred = await this.auth.createUserWithEmailAndPassword(
                  email,
                  password,
                );
                if (newCred.user) {
                  await newCred.user.updateProfile({
                    displayName: localUser.displayName,
                  });
                  this.currentUser = {
                    uid: newCred.user.uid,
                    email: newCred.user.email,
                    displayName: localUser.displayName,
                  };
                  sessionStorage.setItem(
                    "crashdown_session_user",
                    JSON.stringify(this.currentUser),
                  );
                  this.removeLocalUser(email);
                  await this.syncUserProfileSession(this.currentUser);
                  this.notifyAuthChanged();
                  return { success: true, user: this.currentUser };
                }
              } catch (createErr) {
                console.warn(
                  "Helyi felhasználó Firebase-be migrálása sikertelen:",
                  createErr,
                );
              }
            }
          }

          return {
            success: false,
            error: getHungarianAuthErrorMessage(err, "login"),
          };
        }
      }

      // 2. Tartalék helyi bejelentkezés
      const found = this.findLocalUser(email, password);
      if (found) {
        this.currentUser = {
          uid: found.uid,
          email: found.email,
          displayName: found.displayName,
        };
        sessionStorage.setItem(
          "crashdown_session_user",
          JSON.stringify(this.currentUser),
        );
        await this.syncUserProfileSession(this.currentUser);
        this.notifyAuthChanged();
        return { success: true, user: this.currentUser };
      }

      return { success: false, error: "Hibás e-mail cím vagy jelszó!" };
    }

    clearUserSessionState() {
      try {
        localStorage.removeItem("crashdown_chosen_title");
        localStorage.removeItem("crashdown_chosen_avatar");
        localStorage.removeItem("crashdown_chosen_name_color");
        localStorage.removeItem("crashdown_achievements");
        localStorage.removeItem("crashdown_powerup_count");
        localStorage.removeItem("crashdown_powerup_tnt_count");
        localStorage.removeItem("crashdown_powerup_magnet_count");
        localStorage.removeItem("crashdown_powerup_freeze_count");
        localStorage.removeItem("crashdown_powerup_doubler_count");
        localStorage.removeItem("crashdown_powerup_colorbomb_count");
      } catch (e) {}
    }

    async syncUserProfileSession(user) {
      if (!user || !user.displayName) return;
      const username = user.displayName;
      const uLower = username.trim().toLowerCase();

      this.clearUserSessionState();

      let profile = null;
      if (
        window.leaderboardService &&
        typeof window.leaderboardService.getPlayerProfile === "function"
      ) {
        try {
          profile = await window.leaderboardService.getPlayerProfile(username);
        } catch (e) {}
      }

      if (!profile) {
        try {
          const localProfiles = JSON.parse(
            localStorage.getItem("crashdown_player_profiles") || "{}",
          );
          const matchKey = Object.keys(localProfiles).find(
            (k) => k.toLowerCase() === uLower,
          );
          if (matchKey) {
            profile = localProfiles[matchKey];
          }
        } catch (e) {}
      }

      if (profile) {
        const achList = Array.isArray(profile.achievements)
          ? profile.achievements
          : [];
        localStorage.setItem(
          "crashdown_achievements_" + uLower,
          JSON.stringify(achList),
        );
        localStorage.setItem("crashdown_achievements", JSON.stringify(achList));

        if (profile.chosenTitle) {
          localStorage.setItem("crashdown_chosen_title", profile.chosenTitle);
        }
        localStorage.setItem(
          "crashdown_chosen_avatar",
          profile.chosenAvatar || "avatar_default",
        );
        localStorage.setItem(
          "crashdown_chosen_name_color",
          profile.chosenNameColor || "name_white",
        );

        try {
          const localProfiles = JSON.parse(
            localStorage.getItem("crashdown_player_profiles") || "{}",
          );
          localProfiles[username] = {
            ...(localProfiles[username] || {}),
            ...profile,
          };
          localStorage.setItem(
            "crashdown_player_profiles",
            JSON.stringify(localProfiles),
          );
        } catch (e) {}
      } else {
        const cleanProfile = {
          username: username,
          bestScore: 0,
          totalMatches: 0,
          totalPlaytimeSeconds: 0,
          totalScore: 0,
          achievements: [],
          modes: {},
          durations: {},
          modifierStats: {},
          durationStats: {},
          history: [],
          chosenTitle: null,
          chosenAvatar: "avatar_default",
          chosenNameColor: "name_white",
        };

        localStorage.setItem(
          "crashdown_achievements_" + uLower,
          JSON.stringify([]),
        );
        localStorage.setItem("crashdown_achievements", JSON.stringify([]));
        localStorage.setItem("crashdown_chosen_avatar", "avatar_default");
        localStorage.setItem("crashdown_chosen_name_color", "name_white");

        try {
          const localProfiles = JSON.parse(
            localStorage.getItem("crashdown_player_profiles") || "{}",
          );
          localProfiles[username] = cleanProfile;
          localStorage.setItem(
            "crashdown_player_profiles",
            JSON.stringify(localProfiles),
          );
        } catch (e) {}

        if (
          window.leaderboardService &&
          typeof window.leaderboardService.savePlayerProfile === "function"
        ) {
          window.leaderboardService
            .savePlayerProfile(username, cleanProfile)
            .catch(() => {});
        }
      }

      if (typeof updateAchievementsUI === "function") {
        updateAchievementsUI();
      }
      if (typeof toplistaMegjelenites === "function") {
        toplistaMegjelenites();
      }

      this.updatePresence(true);
    }

    updatePresence(isOnline) {
      if (
        !this.currentUser ||
        !window.leaderboardService ||
        !window.leaderboardService.db
      )
        return;
      const username = this.currentUser.displayName;
      if (!username) return;
      const safeKey = encodeURIComponent(username.trim().toLowerCase()).replace(
        /\./g,
        "%2E",
      );
      try {
        const presRef = window.leaderboardService.db.ref("presence/" + safeKey);
        if (isOnline) {
          if (typeof firebase !== "undefined" && firebase.database) {
            presRef.onDisconnect().set({
              online: false,
              username: username,
              lastSeen: firebase.database.ServerValue.TIMESTAMP,
            });
            presRef.set({
              online: true,
              username: username,
              lastSeen: firebase.database.ServerValue.TIMESTAMP,
            });
          }
        } else {
          if (typeof firebase !== "undefined" && firebase.database) {
            presRef.set({
              online: false,
              username: username,
              lastSeen: firebase.database.ServerValue.TIMESTAMP,
            });
          }
        }
      } catch (e) {}
    }

    async logout() {
      if (this.currentUser) {
        this.updatePresence(false);
      }
      if (this.auth) {
        try {
          await this.auth.signOut();
        } catch (e) {}
      }
      sessionStorage.removeItem("crashdown_session_user");
      this.currentUser = null;
      this.clearUserSessionState();
      if (typeof updateAchievementsUI === "function") {
        updateAchievementsUI();
      }
      if (typeof toplistaMegjelenites === "function") {
        toplistaMegjelenites();
      }
      this.notifyAuthChanged();
      return { success: true };
    }

    getResetCooldownRemaining(email) {
      if (!email) return 0;
      const key =
        "crashdown_pwd_reset_" + btoa(email.toLowerCase()).replace(/=/g, "");
      const lastTime = parseInt(localStorage.getItem(key) || "0", 10);
      const now = Date.now();
      const diff = now - lastTime;
      const cooldownMs = 5 * 60 * 1000; // 5 perc (300 000 ms)
      if (diff < cooldownMs) {
        return Math.ceil((cooldownMs - diff) / 1000);
      }
      return 0;
    }

    setResetCooldown(email) {
      if (!email) return;
      const key =
        "crashdown_pwd_reset_" + btoa(email.toLowerCase()).replace(/=/g, "");
      localStorage.setItem(key, String(Date.now()));
    }

    async resetPassword(email) {
      if (!email) {
        return { success: false, error: "Kérjük, add meg az e-mail címed!" };
      }

      const remainingSec = this.getResetCooldownRemaining(email);
      if (remainingSec > 0) {
        const min = Math.floor(remainingSec / 60);
        const sec = remainingSec % 60;
        const timeStr = min > 0 ? `${min} perc ${sec} mp` : `${sec} másodperc`;
        return {
          success: false,
          error: `Biztonsági korlátozás: Jelszó-visszaállítás 5 percenként egyszer kérhető! Várj még ${timeStr}-et.`,
        };
      }

      if (this.auth) {
        try {
          await this.auth.sendPasswordResetEmail(email);
          this.setResetCooldown(email);
          return {
            success: true,
            message:
              "A jelszóvisszaállító linket elküldtük az e-mail címedre! (5 perc múlva kérhetsz újat)",
          };
        } catch (err) {
          console.error("Jelszóvisszaállítási hiba:", err.code, err.message);
          if (err.code === "auth/too-many-requests") {
            this.setResetCooldown(email);
            return {
              success: false,
              error:
                "Túl sok kérés érkezett! Kérjük, várj 5 percet az újabb kérés előtt.",
            };
          }
          return {
            success: false,
            error: getHungarianAuthErrorMessage(err, "reset"),
          };
        }
      }
      return {
        success: false,
        error:
          "A jelszóvisszaállítás csak online Firebase kapcsolattal érhető el.",
      };
    }

    async updatePassword(newPassword) {
      if (!newPassword || newPassword.length < 6) {
        return {
          success: false,
          error: "Az új jelszónak legalább 6 karakter hosszúnak kell lennie!",
        };
      }
      if (this.auth && this.auth.currentUser) {
        try {
          await this.auth.currentUser.updatePassword(newPassword);
          return {
            success: true,
            message: "A jelszavad sikeresen megváltozott!",
          };
        } catch (err) {
          console.error("Jelszómódosítási hiba:", err.code, err.message);
          return {
            success: false,
            error: getHungarianAuthErrorMessage(err, "updatePassword"),
          };
        }
      }

      if (this.currentUser && this.currentUser.email) {
        let users = JSON.parse(
          localStorage.getItem("crashdown_local_users") || "[]",
        );
        const idx = users.findIndex(
          (u) => u.email.toLowerCase() === this.currentUser.email.toLowerCase(),
        );
        if (idx !== -1) {
          users[idx].password = newPassword;
          localStorage.setItem("crashdown_local_users", JSON.stringify(users));
          return {
            success: true,
            message: "A jelszavad sikeresen megváltozott!",
          };
        }
      }

      return { success: false, error: "Nincs bejelentkezett felhasználó!" };
    }

    getCurrentUser() {
      return this.currentUser;
    }
  }

  // ==================== LEADERBOARD SERVICE ====================
  class LeaderboardService {
    constructor() {
      this.isOnline = false;
      this.db = null;
      this.subscribers = [];
      this.initFirebase();
    }

    initFirebase() {
      try {
        if (typeof firebase !== "undefined") {
          if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
          }
          this.db = firebase.database();
          this.isOnline = true;

          // Kapcsolati állapot valós idejű követése
          this.db.ref(".info/connected").on("value", (snap) => {
            this.isOnline = snap.val() === true;
            const cached = JSON.parse(localStorage.getItem("toplista") || "[]");
            if (cached && cached.length > 0) {
              this.notifySubscribers(cached);
            }
          });

          this.listenForUpdates();
          console.log("Firebase Realtime Database sikeresen csatlakoztatva.");
        }
      } catch (err) {
        console.warn(
          "Firebase inicializálási figyelmeztetés (helyi mód aktív):",
          err.message,
        );
        this.isOnline = false;
      }
    }

    listenForUpdates() {
      if (!this.db) return;
      try {
        const scoresRef = this.db.ref("leaderboard");
        scoresRef.on(
          "value",
          (snapshot) => {
            const data = snapshot.val();
            const list = [];
            if (data) {
              Object.keys(data).forEach((key) => {
                list.push({ ...data[key], firebaseKey: key });
              });
              list.sort(
                (a, b) =>
                  (parseInt(b.score, 10) || 0) - (parseInt(a.score, 10) || 0),
              );
            }
            localStorage.setItem("toplista", JSON.stringify(list));
            this.notifySubscribers(list);
          },
          (error) => {
            console.warn("Firebase valós idejű olvasási hiba:", error);
          },
        );

        // Valós idejű profil-figyelés (név szín, rangcím, avatar változások azonnali lekövetése)
        const profilesRef = this.db.ref("profiles");
        profilesRef.on(
          "value",
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              try {
                const localProfiles = JSON.parse(
                  localStorage.getItem("crashdown_player_profiles") || "{}",
                );
                Object.keys(data).forEach((key) => {
                  const p = data[key];
                  if (p && p.username) {
                    localProfiles[p.username] = {
                      ...(localProfiles[p.username] || {}),
                      ...p,
                    };
                  }
                });
                localStorage.setItem(
                  "crashdown_player_profiles",
                  JSON.stringify(localProfiles),
                );

                // Ha a bejelentkezett felhasználó profilját módosította valaki (pl. admin valós időben):
                const currentUser = window.authService?.getCurrentUser();
                if (currentUser && currentUser.displayName && data) {
                  const cMatchKey = Object.keys(data).find(
                    (k) =>
                      String(data[k]?.username || "").toLowerCase() ===
                      currentUser.displayName.toLowerCase(),
                  );
                  if (cMatchKey) {
                    const myUpdatedProfile = data[cMatchKey];
                    if (myUpdatedProfile.achievements) {
                      localStorage.setItem(
                        "crashdown_achievements_" +
                          currentUser.displayName.toLowerCase(),
                        JSON.stringify(myUpdatedProfile.achievements),
                      );
                      localStorage.setItem(
                        "crashdown_achievements",
                        JSON.stringify(myUpdatedProfile.achievements),
                      );
                    }
                    if (myUpdatedProfile.chosenNameColor) {
                      localStorage.setItem(
                        "crashdown_chosen_name_color",
                        myUpdatedProfile.chosenNameColor,
                      );
                    }
                    if (myUpdatedProfile.chosenTitle) {
                      localStorage.setItem(
                        "crashdown_chosen_title",
                        myUpdatedProfile.chosenTitle,
                      );
                    }
                    if (myUpdatedProfile.chosenAvatar) {
                      localStorage.setItem(
                        "crashdown_chosen_avatar",
                        myUpdatedProfile.chosenAvatar,
                      );
                    }
                    if (myUpdatedProfile.chosenTheme) {
                      localStorage.setItem(
                        "crashdown_theme",
                        myUpdatedProfile.chosenTheme,
                      );
                      if (typeof applyTheme === "function") {
                        applyTheme(myUpdatedProfile.chosenTheme);
                      }
                    }
                    if (typeof updateAuthUI === "function") {
                      updateAuthUI(currentUser);
                    }
                    if (typeof updateThemeSelectUI === "function") {
                      updateThemeSelectUI();
                    }
                  }
                }

                if (typeof toplistaMegjelenites === "function") {
                  toplistaMegjelenites();
                }
                // Ha valaki épp néz egy profilt, frissítsük azt is azonnal valós időben (kivéve ha épp lokális admin kattintás zajlik)
                if (
                  window.currentlyViewedProfileUser &&
                  typeof refreshOpenProfileModalRealtime === "function"
                ) {
                  if (!window.isPerformingAdminAction) {
                    refreshOpenProfileModalRealtime(
                      window.currentlyViewedProfileUser,
                    );
                  }
                }
                // Ha nyitva van a Játékosok lista modal, frissítsük
                if (typeof updatePlayersModalUI === "function") {
                  updatePlayersModalUI();
                }
              } catch (e) {
                console.warn("Hiba profilok valós idejű frissítésekor:", e);
              }
            }
          },
          (error) => {
            console.warn("Firebase valós idejű profil olvasási hiba:", error);
          },
        );

        // Valós idejű jelenlét (online / offline) követése
        const presenceRef = this.db.ref("presence");
        presenceRef.on(
          "value",
          (snapshot) => {
            window.onlinePresenceData = snapshot.val() || {};
            if (typeof updatePlayersModalUI === "function") {
              updatePlayersModalUI();
            }
          },
          (error) => {
            console.warn("Firebase valós idejű jelenlét olvasási hiba:", error);
          },
        );
      } catch (err) {
        console.warn("Firebase figyelő hiba:", err);
      }
    }

    onScoresChanged(callback) {
      this.subscribers.push(callback);
    }

    notifySubscribers(scores) {
      this.subscribers.forEach((cb) => {
        try {
          cb(scores);
        } catch (e) {
          console.error(e);
        }
      });
    }

    async getScores() {
      if (this.db) {
        try {
          const snapshot = await this.db.ref("leaderboard").once("value");
          const data = snapshot.val();
          const list = [];
          if (data) {
            Object.keys(data).forEach((key) => {
              list.push({ ...data[key], firebaseKey: key });
            });
            list.sort(
              (a, b) =>
                (parseInt(b.score, 10) || 0) - (parseInt(a.score, 10) || 0),
            );
          }
          localStorage.setItem("toplista", JSON.stringify(list));
          return list;
        } catch (err) {
          console.warn("Firebase lekérési hiba, tartalék helyi tároló:", err);
        }
      }
      return JSON.parse(localStorage.getItem("toplista")) || [];
    }

    async addScore(jatekosAdat) {
      const currentScores = await this.getScores();
      const userNameLower = String(jatekosAdat.name || "")
        .trim()
        .toLowerCase();
      const targetColor = String(jatekosAdat.color || "3");
      const targetModifier = String(jatekosAdat.modifier || "normal");
      const newScore = parseInt(jatekosAdat.score, 10) || 0;

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

      const existingIndex = currentScores.findIndex(
        (s) =>
          String(s.name || "")
            .trim()
            .toLowerCase() === userNameLower &&
          String(s.color || "3") === targetColor &&
          String(s.modifier || "normal") === targetModifier,
      );

      let wasUpdated = false;
      let wasAdded = false;

      if (existingIndex !== -1) {
        const existing = currentScores[existingIndex];
        if (newScore > (parseInt(existing.score, 10) || 0)) {
          existing.score = newScore;
          existing.duration = jatekosAdat.duration;
          existing.modifier = targetModifier;
          existing.timestamp = jatekosAdat.timestamp;
          existing.chosenAvatar = jatekosAdat.chosenAvatar;
          existing.chosenTitle = jatekosAdat.chosenTitle;
          existing.chosenNameColor = jatekosAdat.chosenNameColor;
          wasUpdated = true;

          if (this.isOnline && this.db && existing.firebaseKey) {
            try {
              await this.db.ref("leaderboard/" + existing.firebaseKey).update({
                score: newScore,
                duration: jatekosAdat.duration,
                modifier: targetModifier,
                timestamp: jatekosAdat.timestamp,
                chosenAvatar: jatekosAdat.chosenAvatar,
                chosenTitle: jatekosAdat.chosenTitle,
                chosenNameColor: jatekosAdat.chosenNameColor,
              });
            } catch (err) {
              console.warn("Nem sikerült az online rekordfrissítés:", err);
            }
          }
        } else {
          // Nem döntötte meg a rekordját ebben a kategóriában, nem mentjük feleslegesen
          return {
            success: true,
            updated: false,
            isRecord: false,
            previousBest: existing.score,
          };
        }
      } else {
        // Új bejegyzés ebben a kategóriában
        wasAdded = true;
        jatekosAdat.modifier = targetModifier;
        if (this.isOnline && this.db) {
          try {
            const newRef = this.db.ref("leaderboard").push();
            await newRef.set(jatekosAdat);
            jatekosAdat.firebaseKey = newRef.key;
          } catch (err) {
            console.warn("Nem sikerült az online mentés:", err);
          }
        }
        currentScores.push(jatekosAdat);
      }

      currentScores.sort((a, b) => b.score - a.score);
      localStorage.setItem("toplista", JSON.stringify(currentScores));
      this.notifySubscribers(currentScores);

      return {
        success: true,
        updated: wasUpdated,
        isNew: wasAdded,
        isRecord: true,
      };
    }

    async deleteScoreRecord(elem) {
      if (!elem) return false;
      let currentScores = await this.getScores();
      const targetName = String(elem.name || "")
        .trim()
        .toLowerCase();
      const targetScore = parseInt(elem.score, 10) || 0;
      const targetTimestamp = elem.timestamp;
      const targetKey = elem.firebaseKey;

      if (this.isOnline && this.db) {
        try {
          if (targetKey) {
            await this.db.ref("leaderboard/" + targetKey).remove();
          } else {
            const snap = await this.db.ref("leaderboard").once("value");
            const data = snap.val();
            if (data) {
              for (const k of Object.keys(data)) {
                const item = data[k];
                if (
                  String(item.name || "")
                    .trim()
                    .toLowerCase() === targetName &&
                  (parseInt(item.score, 10) || 0) === targetScore &&
                  (!targetTimestamp || item.timestamp === targetTimestamp)
                ) {
                  await this.db.ref("leaderboard/" + k).remove();
                  break;
                }
              }
            }
          }
        } catch (err) {
          console.warn("Nem sikerült az online pontszám törlése:", err);
        }
      }

      // Lokális toplista frissítése
      currentScores = currentScores.filter((s) => {
        if (targetKey && s.firebaseKey) return s.firebaseKey !== targetKey;
        const matches =
          String(s.name || "")
            .trim()
            .toLowerCase() === targetName &&
          (parseInt(s.score, 10) || 0) === targetScore &&
          (!targetTimestamp || s.timestamp === targetTimestamp);
        return !matches;
      });

      localStorage.setItem("toplista", JSON.stringify(currentScores));
      this.notifySubscribers(currentScores);

      // A játékos maradt pontszámainak vizsgálata a profil frissítéséhez
      const remainingForUser = currentScores.filter(
        (s) =>
          String(s.name || "")
            .trim()
            .toLowerCase() === targetName,
      );
      const newBestScore =
        remainingForUser.length > 0
          ? Math.max(...remainingForUser.map((s) => parseInt(s.score, 10) || 0))
          : 0;

      // Profil adatainak lekérése és frissítése
      let profile = await this.getPlayerProfile(elem.name);
      if (!profile) {
        const localProfiles = JSON.parse(
          localStorage.getItem("crashdown_player_profiles") || "{}",
        );
        profile = localProfiles[elem.name] || localProfiles[targetName];
      }

      if (profile) {
        profile.bestScore = newBestScore;
        if (Array.isArray(profile.history)) {
          profile.history = profile.history.filter(
            (h) =>
              !(
                (parseInt(h.score, 10) || 0) === targetScore &&
                (!targetTimestamp || h.timestamp === targetTimestamp)
              ),
          );
        }
        const pKey = "crashdown_player_profiles";
        const localProfiles = JSON.parse(localStorage.getItem(pKey) || "{}");
        localProfiles[elem.name] = profile;
        localStorage.setItem(pKey, JSON.stringify(localProfiles));
        await this.savePlayerProfile(elem.name, profile);
      }

      return true;
    }

    async resetLeaderboard(adminConfirmation) {
      if (adminConfirmation !== "CONFIRM_PURGE_LEADERBOARD") {
        console.warn(
          "[LeaderboardService] resetLeaderboard hívása megtagadva: nincs admin jóváhagyás.",
        );
        return;
      }
      localStorage.removeItem("toplista");
      if (this.isOnline && this.db) {
        try {
          await this.db.ref("leaderboard").remove();
          console.log("Firebase leaderboard sikeresen nullázva.");
        } catch (err) {
          console.warn("Nem sikerült a Firebase leaderboard törlése:", err);
        }
      }
      this.notifySubscribers([]);
    }

    async getPlayerProfile(username) {
      if (!username) return null;
      const safeKey = encodeURIComponent(username.trim().toLowerCase()).replace(
        /\./g,
        "%2E",
      );
      if (this.db) {
        try {
          const snap = await this.db.ref("profiles/" + safeKey).once("value");
          if (snap.exists()) {
            return snap.val();
          }
        } catch (e) {
          console.warn("Firebase profil lekérési hiba:", e);
        }
      }
      return null;
    }

    async savePlayerProfile(username, profileData) {
      if (!username || !profileData) return;
      const safeKey = encodeURIComponent(username.trim().toLowerCase()).replace(
        /\./g,
        "%2E",
      );
      if (this.isOnline && this.db) {
        try {
          await this.db.ref("profiles/" + safeKey).set({
            username: username,
            bestScore: profileData.bestScore || 0,
            totalMatches: profileData.totalMatches || 0,
            totalPlaytimeSeconds: profileData.totalPlaytimeSeconds || 0,
            totalScore: profileData.totalScore || 0,
            achievements: profileData.achievements || [],
            unlockedTitles: profileData.unlockedTitles || ["title_beginner"],
            unlockedColors: profileData.unlockedColors || ["name_white"],
            unlockedAvatars: profileData.unlockedAvatars || ["avatar_default"],
            unlockedThemes: profileData.unlockedThemes || ["retro", "cyber"],
            history: (profileData.history || []).slice(0, 10),
            chosenTitle: profileData.chosenTitle || null,
            chosenAvatar: profileData.chosenAvatar || "avatar_default",
            chosenNameColor: profileData.chosenNameColor || "name_white",
            chosenTheme: profileData.chosenTheme || null,
            modifierStats: profileData.modifierStats || {},
            durationStats: profileData.durationStats || {},
            modes: profileData.modes || {},
            updatedAt: new Date().toISOString(),
          });

          // Frissítsük a játékos meglévő rekordjait a ranglistán is valós időben
          const snap = await this.db.ref("leaderboard").once("value");
          const data = snap.val();
          if (data) {
            const uLower = username.trim().toLowerCase();
            const batchUpdates = {};
            Object.keys(data).forEach((key) => {
              if (
                String(data[key].name || "")
                  .trim()
                  .toLowerCase() === uLower
              ) {
                if (profileData.chosenTitle !== undefined)
                  batchUpdates[`leaderboard/${key}/chosenTitle`] =
                    profileData.chosenTitle;
                if (profileData.chosenAvatar !== undefined)
                  batchUpdates[`leaderboard/${key}/chosenAvatar`] =
                    profileData.chosenAvatar;
                if (profileData.chosenNameColor !== undefined)
                  batchUpdates[`leaderboard/${key}/chosenNameColor`] =
                    profileData.chosenNameColor;
              }
            });
            if (Object.keys(batchUpdates).length > 0) {
              await this.db.ref().update(batchUpdates);
            }
          }
        } catch (e) {
          console.warn("Firebase profil mentési hiba:", e);
        }
      }
    }

    async updatePlayerCustomizations(
      username,
      {
        chosenTitle,
        chosenAvatar,
        chosenNameColor,
        chosenTheme,
        unlockedTitles,
        unlockedColors,
        unlockedAvatars,
        unlockedThemes,
      },
    ) {
      if (!username) return;
      const safeKey = encodeURIComponent(username.trim().toLowerCase()).replace(
        /\./g,
        "%2E",
      );
      if (this.isOnline && this.db) {
        try {
          const updates = {};
          if (chosenTitle !== undefined) updates.chosenTitle = chosenTitle;
          if (chosenAvatar !== undefined) updates.chosenAvatar = chosenAvatar;
          if (chosenNameColor !== undefined)
            updates.chosenNameColor = chosenNameColor;
          if (chosenTheme !== undefined) updates.chosenTheme = chosenTheme;
          if (unlockedTitles !== undefined)
            updates.unlockedTitles = unlockedTitles;
          if (unlockedColors !== undefined)
            updates.unlockedColors = unlockedColors;
          if (unlockedAvatars !== undefined)
            updates.unlockedAvatars = unlockedAvatars;
          if (unlockedThemes !== undefined)
            updates.unlockedThemes = unlockedThemes;
          updates.updatedAt = new Date().toISOString();

          await this.db.ref("profiles/" + safeKey).update(updates);

          // Frissítsük a játékos meglévő rekordjait a ranglistán is valós időben
          const snap = await this.db.ref("leaderboard").once("value");
          const data = snap.val();
          if (data) {
            const uLower = username.trim().toLowerCase();
            const batchUpdates = {};
            Object.keys(data).forEach((key) => {
              if (
                String(data[key].name || "")
                  .trim()
                  .toLowerCase() === uLower
              ) {
                if (chosenTitle !== undefined)
                  batchUpdates[`leaderboard/${key}/chosenTitle`] = chosenTitle;
                if (chosenAvatar !== undefined)
                  batchUpdates[`leaderboard/${key}/chosenAvatar`] =
                    chosenAvatar;
                if (chosenNameColor !== undefined)
                  batchUpdates[`leaderboard/${key}/chosenNameColor`] =
                    chosenNameColor;
              }
            });
            if (Object.keys(batchUpdates).length > 0) {
              await this.db.ref().update(batchUpdates);
            }
          }
        } catch (e) {
          console.warn("Firebase testreszabás mentési hiba:", e);
        }
      }
    }

    async getAllRegisteredPlayers() {
      if (this.db) {
        try {
          const snap = await this.db.ref("profiles").once("value");
          if (snap.exists()) {
            const data = snap.val();
            const players = [];
            Object.keys(data).forEach((key) => {
              const p = data[key];
              if (p && p.username) {
                players.push(p);
              }
            });
            return players;
          }
        } catch (e) {
          console.warn("Hiba a regisztrált játékosok lekérésekor:", e);
        }
      }
      const local = JSON.parse(
        localStorage.getItem("crashdown_player_profiles") || "{}",
      );
      return Object.keys(local)
        .map((k) => local[k])
        .filter((p) => p && p.username);
    }
  }

  // Globális példányok
  window.authService = new AuthService();
  window.leaderboardService = new LeaderboardService();
  window.databaseService = window.leaderboardService;

  /* ================================================================
   CRASHDOWN ARCADE - CONFIGURATION & CONSTANTS
   ================================================================ */

  const LOGICAL_SIZE = 440;
  const sorok = 10;
  const oszlopok = 10;
  const negyzetMeret = LOGICAL_SIZE / oszlopok; // 44px

  // A színtémák, téma katalógus, név színek, modifierek és blokkstílusok a src/data/cosmeticsData.js modulból érkeznek


  // Aktív színek és téma alapértelmezések
  let currentTheme = localStorage.getItem("crashdown_theme") || "retro";
  let negyzetSzinek = THEME_PALETTES[currentTheme] || THEME_PALETTES.retro;

  /* ================================================================
   CRASHDOWN ARCADE - AUDIO & HAPTIC FEEDBACK SYSTEM
   ================================================================ */

  const hatterZene = new Audio("audio/hopes_and_dreams.mp3");
  hatterZene.loop = true;
  hatterZene.load();

  const tntKatt = new Audio("audio/minecraft_tnt_effect.mp3");
  tntKatt.load();

  const sorEffekt = new Audio("audio/minecraft_anvil_effect.mp3");
  sorEffekt.load();

  const timeEffekt = new Audio("audio/minecraft_brewing_effect.mp3");
  timeEffekt.load();

  const doublerKatt = new Audio("audio/minecraft_xp_effect.mp3");
  doublerKatt.load();

  const sikeresKatt = new Audio("audio/minecraft_item_pickup_effect.mp3");
  sikeresKatt.load();

  const BASE_VOLUMES = {
    music: 0.14,
    tnt: 0.22,
    row: 0.22,
    time: 0.25,
    doubler: 0.28,
    pop: 0.35,
  };

  let musicMuted =
    localStorage.getItem("crashdownMusicMuted") !== null
      ? localStorage.getItem("crashdownMusicMuted") === "true"
      : localStorage.getItem("crashdownMuted") === "true";
  let musicVolume = parseFloat(
    localStorage.getItem("crashdownMusicVolume") ??
      localStorage.getItem("crashdownVolume") ??
      "0.35",
  );
  let sfxMuted = localStorage.getItem("crashdownSfxMuted") === "true";
  let sfxVolume = parseFloat(
    localStorage.getItem("crashdownSfxVolume") ?? "0.70",
  );

  function applyAudioSettings() {
    const effectiveMusic = musicMuted ? 0 : musicVolume;
    const effectiveSfx = sfxMuted ? 0 : sfxVolume;

    hatterZene.volume = Math.min(
      1,
      Math.max(0, BASE_VOLUMES.music * effectiveMusic * 2),
    );
    tntKatt.volume = Math.min(
      1,
      Math.max(0, BASE_VOLUMES.tnt * effectiveSfx * 2),
    );
    sorEffekt.volume = Math.min(
      1,
      Math.max(0, BASE_VOLUMES.row * effectiveSfx * 2),
    );
    timeEffekt.volume = Math.min(
      1,
      Math.max(0, BASE_VOLUMES.time * effectiveSfx * 2),
    );
    doublerKatt.volume = Math.min(
      1,
      Math.max(0, BASE_VOLUMES.doubler * effectiveSfx * 2),
    );
    sikeresKatt.volume = Math.min(
      1,
      Math.max(0, BASE_VOLUMES.pop * effectiveSfx * 2),
    );

    // Dinamikus zene némítás: ha le van némítva a zene vagy 0, azonnal állítsuk meg
    if (musicMuted || musicVolume === 0) {
      if (!hatterZene.paused) {
        try {
          hatterZene.pause();
        } catch (_) {}
      }
    }

    const volIcon = document.getElementById("toggleVol");
    if (volIcon) {
      volIcon.setAttribute(
        "src",
        musicMuted || musicVolume === 0
          ? "images/volume_off_icon.png"
          : "images/volume_on_icon.png",
      );
    }
    const slider = document.getElementById("volumeSlider");
    const label = document.getElementById("volumeValue");
    if (slider)
      slider.value = Math.round((musicMuted ? 0 : musicVolume) * 100);
    if (label)
      label.textContent = `${Math.round((musicMuted ? 0 : musicVolume) * 100)}%`;

    const sfxIcon = document.getElementById("toggleSfx");
    if (sfxIcon) {
      sfxIcon.setAttribute(
        "src",
        sfxMuted || sfxVolume === 0
          ? "images/volume_off_icon.png"
          : "images/volume_on_icon.png",
      );
    }
    const sfxSliderEl = document.getElementById("sfxSlider");
    const sfxLabelEl = document.getElementById("sfxVolumeValue");
    if (sfxSliderEl)
      sfxSliderEl.value = Math.round((sfxMuted ? 0 : sfxVolume) * 100);
    if (sfxLabelEl)
      sfxLabelEl.textContent = `${Math.round((sfxMuted ? 0 : sfxVolume) * 100)}%`;
  }

  function playSound(audioObj) {
    if (sfxMuted || sfxVolume <= 0 || !audioObj) return;
    try {
      audioObj.pause();
      audioObj.currentTime = 0;
      const p = audioObj.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (_) {}
  }

  function toggleVolume() {
    musicMuted = !musicMuted;
    if (!musicMuted && musicVolume === 0) {
      musicVolume = 0.35;
      localStorage.setItem("crashdownMusicVolume", String(musicVolume));
      localStorage.setItem("crashdownVolume", String(musicVolume));
    }
    localStorage.setItem("crashdownMusicMuted", String(musicMuted));
    localStorage.setItem("crashdownMuted", String(musicMuted));
    applyAudioSettings();

    // Dinamikus zene engedélyezés: amint feloldjuk a némítást, azonnal induljon el a zene
    if (!musicMuted && musicVolume > 0) {
      try {
        const p = hatterZene.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch (_) {}
    }
  }

  function toggleSfx() {
    sfxMuted = !sfxMuted;
    if (!sfxMuted && sfxVolume === 0) {
      sfxVolume = 0.70;
      localStorage.setItem("crashdownSfxVolume", String(sfxVolume));
    }
    localStorage.setItem("crashdownSfxMuted", String(sfxMuted));
    applyAudioSettings();

    if (!sfxMuted && sfxVolume > 0) {
      playSound(sikeresKatt);
    }
  }

  function triggerHaptic(type = "light") {
    if (!navigator.vibrate) return;
    try {
      if (type === "light") navigator.vibrate(15);
      else if (type === "medium") navigator.vibrate([25, 20, 25]);
      else if (type === "heavy") navigator.vibrate([40, 30, 60]);
    } catch (_) {}
  }

  // Hangerő gomb és csúszka események bekötése
  function initAudioListeners() {
    const toggleVolBtn =
      document.getElementById("toggleVolBtn") ||
      document.getElementById("toggleVol");
    if (toggleVolBtn) {
      toggleVolBtn.addEventListener("click", toggleVolume);
    }

    const toggleSfxBtn = document.getElementById("toggleSfxBtn");
    if (toggleSfxBtn) {
      toggleSfxBtn.addEventListener("click", toggleSfx);
    }

    const volumeSlider = document.getElementById("volumeSlider");
    if (volumeSlider) {
      volumeSlider.addEventListener("input", function () {
        musicVolume = parseInt(this.value, 10) / 100;
        musicMuted = musicVolume === 0;
        localStorage.setItem("crashdownMusicVolume", String(musicVolume));
        localStorage.setItem("crashdownVolume", String(musicVolume));
        localStorage.setItem("crashdownMusicMuted", String(musicMuted));
        localStorage.setItem("crashdownMuted", String(musicMuted));
        applyAudioSettings();

        // Dinamikusan ha 0 fölé húzzuk a hangerőt, azonnal induljon el a zene ha áll
        if (!musicMuted && musicVolume > 0 && hatterZene.paused) {
          try {
            const p = hatterZene.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          } catch (_) {}
        }
      });
    }

    const sfxSlider = document.getElementById("sfxSlider");
    if (sfxSlider) {
      sfxSlider.addEventListener("input", function () {
        sfxVolume = parseInt(this.value, 10) / 100;
        sfxMuted = sfxVolume === 0;
        localStorage.setItem("crashdownSfxVolume", String(sfxVolume));
        localStorage.setItem("crashdownSfxMuted", String(sfxMuted));
        applyAudioSettings();
      });
      sfxSlider.addEventListener("change", function () {
        playSound(sikeresKatt);
      });
    }

    // Telefon elsötétülés / képernyő zárolás / háttérbe küldés kezelése
    let wasMusicPlayingBeforeHidden = false;

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!hatterZene.paused) {
          wasMusicPlayingBeforeHidden = true;
          try {
            hatterZene.pause();
          } catch (_) {}
        } else {
          wasMusicPlayingBeforeHidden = false;
        }
      } else {
        // Visszatéréskor csak akkor indítjuk újra, ha szólt előtte és a játék még fut és nincs némítva
        const isGameActive =
          typeof jatekFut !== "undefined" &&
          jatekFut &&
          (typeof vegeAJateknak === "undefined" || !vegeAJateknak);
        if (
          wasMusicPlayingBeforeHidden &&
          !musicMuted &&
          musicVolume > 0 &&
          isGameActive
        ) {
          try {
            const p = hatterZene.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          } catch (_) {}
        }
      }
    });

    window.addEventListener("pagehide", () => {
      try {
        hatterZene.pause();
      } catch (_) {}
    });
  }

  /* ================================================================
   CRASHDOWN ARCADE - ACHIEVEMENTS, TITLES, AVATARS & USER STATS
   ================================================================ */

  // A mérföldkövek (achievements) katalógusa a src/data/achievementsData.js modulból érkezik


  // A profilképek (avatars) a src/data/cosmeticsData.js modulból érkeznek
  function getAchievementRewards(achId) {
    return getAchievementRewardsBase(achId, {
      avatars: PROFILE_AVATARS,
      titles: PROFILE_TITLES,
      themes: THEMES_CATALOG,
      nameColors: NAME_COLORS_CATALOG,
    });
  }

  // ==================== RANGCÍMEK (PROFILE TITLES) RENDSZER ====================
  // A rangcímek katalógusa a src/data/titlesData.js modulból érkezik


  let recentSuccessfulClicks = [];
  let currentAchievementFilter = "all";

  function getUnlockedAchievements(username = null) {
    try {
      const user =
        username || window.authService?.getCurrentUser()?.displayName;
      if (user) {
        const uKey = "crashdown_achievements_" + user.trim().toLowerCase();
        const userRaw = localStorage.getItem(uKey);
        if (userRaw) return JSON.parse(userRaw);
      }
      const raw = localStorage.getItem("crashdown_achievements");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUserAchievementToProfile(username, achId) {
    if (!username || !achId) return;
    try {
      const key = "crashdown_player_profiles";
      const profiles = JSON.parse(localStorage.getItem(key) || "{}");
      const p = profiles[username] || {
        username: username,
        totalMatches: 0,
        totalPlaytimeSeconds: 0,
        totalScore: 0,
        bestScore: 0,
        achievements: [],
        modes: {},
        durations: {},
        modifierStats: {},
        durationStats: {},
        history: [],
        chosenTitle: null,
        chosenAvatar: "avatar_default",
        chosenNameColor: "name_white",
      };

      if (!p.achievements) p.achievements = [];
      if (!p.achievements.includes(achId)) {
        p.achievements.push(achId);
      }

      if (!Array.isArray(p.unlockedTitles))
        p.unlockedTitles = ["title_none", "title_beginner"];
      if (!Array.isArray(p.unlockedColors)) p.unlockedColors = ["name_white"];
      if (!Array.isArray(p.unlockedAvatars))
        p.unlockedAvatars = ["avatar_default"];
      if (!Array.isArray(p.unlockedThemes))
        p.unlockedThemes = ["retro", "cyber"];

      if (typeof PROFILE_TITLES !== "undefined") {
        const matchTitle = PROFILE_TITLES.find((t) => t.achId === achId);
        if (matchTitle && !p.unlockedTitles.includes(matchTitle.id)) {
          p.unlockedTitles.push(matchTitle.id);
        }
      }

      const nColorCat =
        typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
      const matchColor = nColorCat.find((c) => c.achId === achId);
      if (matchColor && !p.unlockedColors.includes(matchColor.id)) {
        p.unlockedColors.push(matchColor.id);
      }

      if (typeof PROFILE_AVATARS !== "undefined") {
        const matchAvatar = PROFILE_AVATARS.find((a) => a.achId === achId);
        if (matchAvatar && !p.unlockedAvatars.includes(matchAvatar.id)) {
          p.unlockedAvatars.push(matchAvatar.id);
        }
      }

      if (typeof THEMES_CATALOG !== "undefined") {
        const matchTheme = THEMES_CATALOG.find((th) => th.achId === achId);
        if (matchTheme && !p.unlockedThemes.includes(matchTheme.id)) {
          p.unlockedThemes.push(matchTheme.id);
        }
      }

      // Mindig a legfrissebb feloldott mérföldköveket mentsük el a profilba,
      // nehogy a korábban betöltött lista felülírja az épp most megszerzett jelvényeket!
      p.achievements = getUnlockedAchievements(username);

      profiles[username] = p;
      localStorage.setItem(key, JSON.stringify(profiles));

      if (
        window.leaderboardService &&
        typeof window.leaderboardService.savePlayerProfile === "function"
      ) {
        window.leaderboardService
          .savePlayerProfile(username, p)
          .catch(() => {});
      } else if (
        window.databaseService &&
        typeof window.databaseService.savePlayerProfile === "function"
      ) {
        window.databaseService.savePlayerProfile(username, p).catch(() => {});
      }
    } catch (e) {
      console.error("Hiba az elért mérföldkő mentésekor:", e);
    }
  }

  const SCORE_MILESTONES = [
    { score: 500, id: "ach_score_500", altId: "first_500" },
    { score: 1000, id: "ach_score_1000" },
    { score: 2500, id: "ach_score_2500", altId: "ach_score_1500" },
    { score: 5000, id: "ach_score_5000", altId: "score_5000" },
    { score: 7500, id: "ach_score_7500" },
    { score: 10000, id: "ach_score_10k", altId: "score_10k" },
    { score: 15000, id: "ach_score_15k" },
    { score: 20000, id: "ach_score_20k" },
    { score: 25000, id: "ach_score_25k", altId: "score_25k" },
    { score: 30000, id: "ach_score_30k", altId: "ach_score_35k" },
    { score: 40000, id: "ach_score_40k" },
    { score: 50000, id: "ach_score_50k", altId: "score_50k" },
    { score: 60000, id: "ach_score_60k" },
    { score: 70000, id: "ach_score_70k", altId: "ach_score_75k" },
    { score: 80000, id: "ach_score_80k", altId: "ach_score_85k" },
    { score: 90000, id: "ach_score_90k" },
    { score: 100000, id: "ach_score_100k", altId: "score_100k" },
    { score: 115000, id: "ach_score_115k", altId: "ach_score_110k" },
    { score: 130000, id: "ach_score_130k", altId: "ach_score_125k" },
    { score: 145000, id: "ach_score_145k" },
    { score: 160000, id: "ach_score_160k", altId: "ach_score_150k" },
    { score: 180000, id: "ach_score_180k" },
    { score: 200000, id: "ach_score_200k" },
    { score: 225000, id: "ach_score_225k" },
    { score: 250000, id: "ach_score_250k", altId: "score_250k" },
    { score: 275000, id: "ach_score_275k" },
    { score: 300000, id: "ach_score_300k" },
    { score: 350000, id: "ach_score_350k" },
    { score: 450000, id: "ach_score_450k", altId: "ach_score_500k" },
    { score: 550000, id: "ach_score_550k" },
    { score: 650000, id: "ach_score_650k" },
    { score: 800000, id: "ach_score_800k" },
    { score: 1000000, id: "ach_score_1m" },
  ];

  function checkScoreAchievements(
    score,
    colorCount = null,
    modifier = null,
    durationSeconds = null,
  ) {
    const numScore = parseInt(score, 10) || 0;
    if (numScore <= 0) return;

    for (let i = 0; i < SCORE_MILESTONES.length; i++) {
      const m = SCORE_MILESTONES[i];
      if (numScore >= m.score) {
        checkAchievement(m.id);
        if (m.altId) checkAchievement(m.altId);
      }
    }

    const mVal =
      modifier || document.getElementById("modeSelect")?.value || "normal";
    const checkModeScores = (mode, prefix) => {
      if (mVal === mode) {
        if (numScore >= 5000) checkAchievement(`${prefix}_5k`);
        if (numScore >= 25000) checkAchievement(`${prefix}_25k`);
        if (numScore >= 50000) checkAchievement(`${prefix}_50k`);
        if (numScore >= 100000) checkAchievement(`${prefix}_100k`);
        if (numScore >= 250000) checkAchievement(`${prefix}_250k`);
      }
    };
    checkModeScores("chaos", "ach_chaos");
    checkModeScores("bomb_frenzy", "ach_bomb");
    checkModeScores("time_rush", "ach_timerush");
    checkModeScores("no_powerups", "ach_raw");
  }

  function checkAchievement(id) {
    const currentUser = window.authService?.getCurrentUser();
    const username = currentUser?.displayName;
    const list = getUnlockedAchievements(username);
    const set = new Set(list);
    if (set.has(id)) return;

    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) return;

    set.add(id);
    const updatedList = [...set];

    if (username) {
      const uKey = "crashdown_achievements_" + username.trim().toLowerCase();
      localStorage.setItem(uKey, JSON.stringify(updatedList));
    }
    localStorage.setItem("crashdown_achievements", JSON.stringify(updatedList));

    // Kizárólag az elért mérföldkövet mentjük le, nem generálunk ál-mérkőzést és ál-játékidőt!
    if (username) {
      saveUserAchievementToProfile(username, id);
    }

    triggerHaptic("success");
    playSound(sikeresKatt);
    if (typeof showToast === "function") {
      showToast(`🏆 Jelvény feloldva: ${ach.icon} ${ach.title}!`, "success");
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

    const countEl = document.getElementById("unlockedAchievementsCount");
    const totalEl = document.getElementById("totalAchievementsCount");
    if (countEl) countEl.textContent = unlockedCount;
    if (totalEl) totalEl.textContent = totalCount;

    const summaryCountEl = document.getElementById("achievementsSummaryCount");
    const totalSummaryCountEl = document.getElementById(
      "achievementsTotalSummaryCount",
    );
    const percentEl = document.getElementById("achievementsPercent");
    const progressFill = document.getElementById("achievementsProgressFill");

    if (summaryCountEl) summaryCountEl.textContent = unlockedCount;
    if (totalSummaryCountEl) totalSummaryCountEl.textContent = totalCount;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (progressFill) progressFill.style.width = `${percent}%`;

    const fAll = document.getElementById("achFilterAllCount");
    const fUn = document.getElementById("achFilterUnlockedCount");
    const fLock = document.getElementById("achFilterLockedCount");
    if (fAll) fAll.textContent = totalCount;
    if (fUn) fUn.textContent = unlockedCount;
    if (fLock) fLock.textContent = lockedCount;

    const listContainer = document.getElementById("achievementsList");
    if (!listContainer) return;

    listContainer.innerHTML = ACHIEVEMENTS.map((ach) => {
      const isUnlocked = unlockedSet.has(ach.id);
      const shouldHide =
        (currentAchievementFilter === "unlocked" && !isUnlocked) ||
        (currentAchievementFilter === "locked" && isUnlocked);

      const rewList = getAchievementRewards(ach.id);
      const rewardSnippet =
        rewList.length > 0
          ? `<div class="ach-card-reward-tag"><strong>Jutalmak:</strong><br>${rewList.map((r) => r.text).join("<br>")}</div>`
          : "";

      return `
            <div class="achievement-card ${isUnlocked ? "unlocked" : "locked"} ${shouldHide ? "card-filtered-out" : ""}" data-ach-id="${ach.id}" data-unlocked="${isUnlocked ? "1" : "0"}">
                <div class="ach-card-header">
                    <div class="achievement-icon-wrap">${ach.icon}</div>
                    <span class="achievement-status">${isUnlocked ? "Feloldva ✓" : "🔒 Zárolva"}</span>
                </div>
                <div class="achievement-info">
                    <strong>${ach.title}</strong>
                    <small>${ach.desc}</small>
                    ${rewardSnippet}
                </div>
            </div>
        `;
    }).join("");

    if (typeof updateThemeSelectUI === "function") {
      updateThemeSelectUI();
    }
  }

  function applyAchievementFilter(filter) {
    currentAchievementFilter = filter;
    const listContainer = document.getElementById("achievementsList");
    if (!listContainer) return;

    const cards = listContainer.querySelectorAll(".achievement-card");
    cards.forEach((card) => {
      const isUnlocked = card.getAttribute("data-unlocked") === "1";
      if (filter === "all") {
        card.classList.remove("card-filtered-out");
      } else if (filter === "unlocked") {
        card.classList.toggle("card-filtered-out", !isUnlocked);
      } else if (filter === "locked") {
        card.classList.toggle("card-filtered-out", isUnlocked);
      }
    });
  }

  // Játékos profil statisztika frissítése és tárolása
  function updatePlayerStatsRecord(
    username,
    score,
    colorCount,
    durationSeconds,
    modifier,
  ) {
    if (!username) return;
    try {
      const key = "crashdown_player_profiles";
      const profiles = JSON.parse(localStorage.getItem(key) || "{}");
      const p = profiles[username] || {
        username: username,
        totalMatches: 0,
        totalPlaytimeSeconds: 0,
        totalScore: 0,
        bestScore: 0,
        achievements: [],
        modes: {},
        durations: {},
        modifierStats: {},
        durationStats: {},
        history: [],
        chosenTitle: null,
        chosenAvatar: "avatar_default",
        chosenNameColor: "name_white",
      };

      if (!p.history) p.history = [];
      if (!p.modes) p.modes = {};
      if (!p.modifierStats) p.modifierStats = {};
      if (!p.durationStats) p.durationStats = {};

      const numericScore = parseInt(score, 10) || 0;
      const durSec =
        durationSeconds !== undefined && durationSeconds !== null
          ? parseInt(durationSeconds, 10)
          : 0;
      const modKey = modifier || "normal";
      const cKey = String(colorCount || "3");

      // Kizárólag valódi lezárult meccs esetén (durSec > 0) rögzítünk statisztikát!
      if (durSec > 0) {
        p.totalMatches = (p.totalMatches || 0) + 1;
        p.totalPlaytimeSeconds = (p.totalPlaytimeSeconds || 0) + durSec;
        p.totalScore = (p.totalScore || 0) + numericScore;
        if (numericScore > (p.bestScore || 0)) p.bestScore = numericScore;

        // Színmód statisztika
        if (!p.modes[cKey]) p.modes[cKey] = { matches: 0, bestScore: 0 };
        p.modes[cKey].matches += 1;
        if (numericScore > p.modes[cKey].bestScore)
          p.modes[cKey].bestScore = numericScore;

        // Játékmód statisztika
        if (!p.modifierStats[modKey])
          p.modifierStats[modKey] = { matches: 0, bestScore: 0, totalScore: 0 };
        p.modifierStats[modKey].matches += 1;
        p.modifierStats[modKey].totalScore += numericScore;
        if (numericScore > p.modifierStats[modKey].bestScore)
          p.modifierStats[modKey].bestScore = numericScore;

        // Időtartam statisztika
        const dKey = String(durSec);
        if (!p.durationStats[dKey])
          p.durationStats[dKey] = { matches: 0, bestScore: 0, totalScore: 0 };
        p.durationStats[dKey].matches += 1;
        p.durationStats[dKey].totalScore += numericScore;
        if (numericScore > p.durationStats[dKey].bestScore)
          p.durationStats[dKey].bestScore = numericScore;

        p.history.unshift({
          score: numericScore,
          color: cKey,
          modifier: modKey,
          duration: durSec,
          timestamp: new Date().toISOString(),
        });
        if (p.history.length > 10) {
          p.history = p.history.slice(0, 10);
        }
      }

      const currentUser = window.authService?.getCurrentUser();
      if (currentUser && currentUser.displayName === username) {
        p.achievements = getUnlockedAchievements(username);
        p.chosenTitle =
          localStorage.getItem("crashdown_chosen_title") || p.chosenTitle;
        p.chosenAvatar =
          localStorage.getItem("crashdown_chosen_avatar") ||
          p.chosenAvatar ||
          "avatar_default";
        p.chosenNameColor =
          localStorage.getItem("crashdown_chosen_name_color") ||
          p.chosenNameColor ||
          "name_white";
      }

      // Mérföldkő ellenőrzések CSAKIS valódi lefutott meccs esetén (durSec > 0)
      if (durSec > 0) {
        // Mérkőzésszám mérföldkövek (15 szint az új Arénázó rendszerben)
        MATCHES_MILESTONES.forEach((m) => {
          if (p.totalMatches >= m.count) {
            checkAchievement(m.achId);
          }
        });
        // Visszafelé kompatibilitás korábbi achievement azonosítókkal
        if (p.totalMatches >= 5) checkAchievement("play_5_matches");
        if (p.totalMatches >= 10) checkAchievement("matches_10");
        if (p.totalMatches >= 20) checkAchievement("play_20_matches");
        if (p.totalMatches >= 50) checkAchievement("matches_50");
        if (p.totalMatches >= 100) checkAchievement("matches_100");
        if (p.totalMatches >= 250) checkAchievement("matches_250");
        if (p.totalMatches >= 500) checkAchievement("matches_500");
        if (p.totalMatches >= 750) checkAchievement("ach_matches_750");
        if (p.totalMatches >= 1000) checkAchievement("ach_matches_1000");

        // Játékidő mérföldkövek
        if (p.totalPlaytimeSeconds >= 15) {
          checkAchievement("ach_play_time_15s");
        }
        if (p.totalPlaytimeSeconds >= 60) {
          checkAchievement("ach_play_time_1m");
          checkAchievement("play_time_1m");
        }
        if (p.totalPlaytimeSeconds >= 180) {
          checkAchievement("ach_play_time_3m");
        }
        if (p.totalPlaytimeSeconds >= 300) {
          checkAchievement("ach_play_time_5m");
          checkAchievement("play_time_5m");
        }
        if (p.totalPlaytimeSeconds >= 600) {
          checkAchievement("ach_play_time_10m");
        }
        if (p.totalPlaytimeSeconds >= 900) {
          checkAchievement("ach_play_time_15m");
          checkAchievement("play_time_15m");
        }
        if (p.totalPlaytimeSeconds >= 1200) {
          checkAchievement("ach_play_time_20m");
        }
        if (p.totalPlaytimeSeconds >= 1800) {
          checkAchievement("ach_play_time_30m");
          checkAchievement("play_time_30m");
        }
        if (p.totalPlaytimeSeconds >= 2700) {
          checkAchievement("ach_play_time_45m");
        }
        if (p.totalPlaytimeSeconds >= 3600) {
          checkAchievement("ach_play_time_1h");
          checkAchievement("play_time_1h");
        }
        if (p.totalPlaytimeSeconds >= 5400) {
          checkAchievement("ach_play_time_90m");
        }
        if (p.totalPlaytimeSeconds >= 7200) {
          checkAchievement("ach_play_time_2h");
          checkAchievement("play_time_2h");
        }
        if (p.totalPlaytimeSeconds >= 10800) {
          checkAchievement("ach_play_time_3h");
        }

        // Összesített pontszám mérföldkövek
        if (p.totalScore >= 50000) {
          checkAchievement("ach_total_score_50k");
        }
        if (p.totalScore >= 100000) {
          checkAchievement("ach_total_score_100k");
          checkAchievement("total_score_100k");
        }
        if (p.totalScore >= 250000) {
          checkAchievement("ach_total_score_250k");
        }
        if (p.totalScore >= 500000) {
          checkAchievement("ach_total_score_500k");
          checkAchievement("total_score_500k");
        }
        if (p.totalScore >= 1000000) {
          checkAchievement("ach_total_score_1m");
          checkAchievement("total_score_1m");
        }
        if (p.totalScore >= 2000000) {
          checkAchievement("ach_total_score_2m");
        }
        if (p.totalScore >= 5000000) {
          checkAchievement("ach_total_score_5m");
          checkAchievement("total_score_5m");
        }
        if (p.totalScore >= 10000000) {
          checkAchievement("ach_total_score_10m");
        }

        // Pontszám rekord mérföldkövek (egységesen SCORE_MILESTONES alapján)
        for (let i = 0; i < SCORE_MILESTONES.length; i++) {
          const m = SCORE_MILESTONES[i];
          if (numericScore >= m.score) {
            checkAchievement(m.id);
            if (m.altId) checkAchievement(m.altId);
          }
        }

        // Mód szerinti pontszámok (5 szint a 4 speciális játékmódhoz)
        const checkEndModeScores = (mode, prefix) => {
          if (modKey === mode) {
            if (numericScore >= 5000) checkAchievement(`${prefix}_5k`);
            if (numericScore >= 25000) checkAchievement(`${prefix}_25k`);
            if (numericScore >= 50000) checkAchievement(`${prefix}_50k`);
            if (numericScore >= 100000) checkAchievement(`${prefix}_100k`);
            if (numericScore >= 250000) checkAchievement(`${prefix}_250k`);
          }
        };
        checkEndModeScores("chaos", "ach_chaos");
        checkEndModeScores("bomb_frenzy", "ach_bomb");
        checkEndModeScores("time_rush", "ach_timerush");
        checkEndModeScores("no_powerups", "ach_raw");

        // Változatosság mérföldkövek
        const all5Modes = [
          "normal",
          "chaos",
          "bomb_frenzy",
          "time_rush",
          "no_powerups",
        ];
        if (
          all5Modes.every(
            (m) => p.modifierStats[m] && p.modifierStats[m].matches > 0,
          )
        ) {
          checkAchievement("ach_all_modes_played");
          checkAchievement("all_modes_played");
        }
        const allDurations = ["30", "60", "90", "180"];
        if (
          allDurations.every(
            (d) => p.durationStats[d] && p.durationStats[d].matches > 0,
          )
        ) {
          checkAchievement("ach_all_durations_played");
          checkAchievement("all_durations_played");
        }
        const allColors = ["2", "3", "4", "5"];
        if (allColors.every((c) => p.modes[c] && p.modes[c].matches > 0)) {
          checkAchievement("ach_all_colors_played");
          checkAchievement("all_colors_played");
        }
      }

      profiles[username] = p;
      localStorage.setItem(key, JSON.stringify(profiles));

      if (
        window.databaseService &&
        typeof window.databaseService.savePlayerProfile === "function"
      ) {
        window.databaseService.savePlayerProfile(username, p).catch(() => {});
      }
    } catch (e) {
      console.error("Hiba a játékos statisztika mentésekor:", e);
    }
  }

  function regisztraljPowerupHasznalatot(type = null) {
    let count = parseInt(
      localStorage.getItem("crashdown_powerup_count") || "0",
      10,
    );
    count += 1;
    localStorage.setItem("crashdown_powerup_count", count);

    checkAchievement("ach_powerup_first_any");
    if (count >= 5) {
      checkAchievement("ach_powerup_5");
      checkAchievement("powerup_5");
    }
    if (count >= 10) {
      checkAchievement("ach_powerup_10");
      checkAchievement("powerup_10");
    }
    if (count >= 25) {
      checkAchievement("ach_powerup_25");
      checkAchievement("powerup_25");
    }
    if (count >= 35) {
      checkAchievement("ach_powerup_total_35");
    }
    if (count >= 50) {
      checkAchievement("ach_powerup_50");
      checkAchievement("powerup_50");
    }
    if (count >= 75) {
      checkAchievement("ach_powerup_75");
    }
    if (count >= 100) {
      checkAchievement("ach_powerup_100");
      checkAchievement("powerup_100");
    }
    if (count >= 150) {
      checkAchievement("ach_powerup_150");
    }
    if (count >= 250) {
      checkAchievement("ach_powerup_250");
      checkAchievement("powerup_250");
    }
    if (count >= 500) {
      checkAchievement("ach_powerup_500");
      checkAchievement("powerup_500");
    }

    if (type) {
      const key = `crashdown_powerup_${type}_count`;
      let tCount = parseInt(localStorage.getItem(key) || "0", 10) + 1;
      localStorage.setItem(key, tCount);
      if (type === "tnt") {
        checkAchievement("ach_powerup_tnt_first");
        if (tCount >= 25) {
          checkAchievement("ach_tnt_collector_25");
          checkAchievement("tnt_collector_25");
        }
        if (tCount >= 50) {
          checkAchievement("ach_tnt_collector_50");
        }
      }
      if (type === "magnet") {
        checkAchievement("ach_powerup_magnet_first");
        if (tCount >= 25) {
          checkAchievement("ach_magnet_collector_25");
          checkAchievement("magnet_collector_25");
        }
      }
      if (type === "freeze") {
        checkAchievement("ach_powerup_freeze_first");
        if (tCount >= 25) {
          checkAchievement("ach_freeze_collector_25");
          checkAchievement("freeze_collector_25");
        }
        if (tCount >= 50) {
          checkAchievement("ach_freeze_collector_50");
        }
      }
      if (type === "doubler") {
        if (tCount >= 25) {
          checkAchievement("ach_doubler_collector_25");
          checkAchievement("doubler_collector_25");
        }
      }
      if (type === "colorbomb") {
        checkAchievement("ach_powerup_colorbomb_first");
        if (tCount >= 25) {
          checkAchievement("ach_colorbomb_collector_25");
          checkAchievement("colorbomb_collector_25");
        }
      }
    }
  }

  function ensureArray(val, fallback = []) {
    if (!val) return [...fallback];
    if (Array.isArray(val)) return [...val];
    if (typeof val === "object") return Object.values(val);
    return [...fallback];
  }

  function getPlayerProfileStats(
    username,
    allScores = [],
    onlineProfile = null,
  ) {
    let profile = null;
    try {
      const profiles = JSON.parse(
        localStorage.getItem("crashdown_player_profiles") || "{}",
      );
      if (profiles[username]) {
        profile = { ...profiles[username] };
      } else {
        const matchKey = Object.keys(profiles).find(
          (k) => k.toLowerCase() === String(username).toLowerCase(),
        );
        if (matchKey) {
          profile = { ...profiles[matchKey] };
        }
      }
    } catch (e) {}

    const playerScores = allScores.filter(
      (s) => s.name && s.name.toLowerCase() === String(username).toLowerCase(),
    );

    if (!profile) {
      profile = {
        username: username,
        totalMatches: 0,
        totalPlaytimeSeconds: 0,
        totalScore: 0,
        bestScore: 0,
        achievements: [],
        modes: {},
        durations: {},
        modifierStats: {},
        durationStats: {},
        history: [],
        chosenTitle: null,
        chosenAvatar: "avatar_default",
        chosenNameColor: "name_white",
      };
    }

    // Ha a ranglistán szerepel a játékos egyedi testreszabása, vegyük figyelembe
    playerScores.forEach((s) => {
      if (
        (!profile.chosenAvatar || profile.chosenAvatar === "avatar_default") &&
        s.chosenAvatar
      ) {
        profile.chosenAvatar = s.chosenAvatar;
      }
      if (!profile.chosenTitle && s.chosenTitle) {
        profile.chosenTitle = s.chosenTitle;
      }
      if (
        (!profile.chosenNameColor ||
          profile.chosenNameColor === "name_white") &&
        s.chosenNameColor
      ) {
        profile.chosenNameColor = s.chosenNameColor;
      }
    });
    if (!profile.history) profile.history = [];
    if (!profile.modes) profile.modes = {};
    if (!profile.modifierStats) profile.modifierStats = {};
    if (!profile.durationStats) profile.durationStats = {};

    // Online profil adatainak összefésülése
    if (onlineProfile) {
      if (
        onlineProfile.history &&
        Array.isArray(onlineProfile.history) &&
        onlineProfile.history.length > 0
      ) {
        profile.history = onlineProfile.history;
      }
      if (
        onlineProfile.achievements &&
        Array.isArray(onlineProfile.achievements)
      ) {
        profile.achievements = [...onlineProfile.achievements];
      }
      if (
        onlineProfile.unlockedTitles !== undefined &&
        onlineProfile.unlockedTitles !== null
      ) {
        profile.unlockedTitles = ensureArray(onlineProfile.unlockedTitles, [
          "title_none",
          "title_beginner",
        ]);
      }
      if (
        onlineProfile.unlockedColors !== undefined &&
        onlineProfile.unlockedColors !== null
      ) {
        profile.unlockedColors = ensureArray(onlineProfile.unlockedColors, [
          "name_white",
        ]);
      }
      if (
        onlineProfile.unlockedAvatars !== undefined &&
        onlineProfile.unlockedAvatars !== null
      ) {
        profile.unlockedAvatars = ensureArray(onlineProfile.unlockedAvatars, [
          "avatar_default",
        ]);
      }
      if (
        onlineProfile.unlockedThemes !== undefined &&
        onlineProfile.unlockedThemes !== null
      ) {
        profile.unlockedThemes = ensureArray(onlineProfile.unlockedThemes, [
          "retro",
          "cyber",
        ]);
      }
      if (onlineProfile.chosenTitle)
        profile.chosenTitle = onlineProfile.chosenTitle;
      if (onlineProfile.chosenAvatar)
        profile.chosenAvatar = onlineProfile.chosenAvatar;
      if (onlineProfile.chosenNameColor)
        profile.chosenNameColor = onlineProfile.chosenNameColor;
      if (onlineProfile.chosenTheme)
        profile.chosenTheme = onlineProfile.chosenTheme;
      if ((onlineProfile.bestScore || 0) > (profile.bestScore || 0))
        profile.bestScore = onlineProfile.bestScore;
      if ((onlineProfile.totalMatches || 0) > (profile.totalMatches || 0))
        profile.totalMatches = onlineProfile.totalMatches;
      if ((onlineProfile.totalScore || 0) > (profile.totalScore || 0))
        profile.totalScore = onlineProfile.totalScore;
      if (
        (onlineProfile.totalPlaytimeSeconds || 0) >
        (profile.totalPlaytimeSeconds || 0)
      )
        profile.totalPlaytimeSeconds = onlineProfile.totalPlaytimeSeconds;
      if (onlineProfile.modifierStats) {
        profile.modifierStats = {
          ...profile.modifierStats,
          ...onlineProfile.modifierStats,
        };
      }
      if (onlineProfile.durationStats) {
        profile.durationStats = {
          ...profile.durationStats,
          ...onlineProfile.durationStats,
        };
      }
    }

    // Statisztikák kiegészítése a meccsek listájából
    let aggTotalScore = profile.totalScore || 0;
    playerScores.forEach((s) => {
      const sc = parseInt(s.score, 10) || 0;
      if (sc > (profile.bestScore || 0)) profile.bestScore = sc;

      const cKey = String(s.color || "3");
      if (!profile.modes[cKey])
        profile.modes[cKey] = { matches: 0, bestScore: 0 };
      profile.modes[cKey].matches += 1;
      if (sc > profile.modes[cKey].bestScore)
        profile.modes[cKey].bestScore = sc;

      const mKey = s.modifier || "normal";
      if (!profile.modifierStats[mKey])
        profile.modifierStats[mKey] = {
          matches: 0,
          bestScore: 0,
          totalScore: 0,
        };
      profile.modifierStats[mKey].matches += 1;
      profile.modifierStats[mKey].totalScore += sc;
      if (sc > profile.modifierStats[mKey].bestScore)
        profile.modifierStats[mKey].bestScore = sc;

      const dKey = String(s.duration || "60");
      if (!profile.durationStats[dKey])
        profile.durationStats[dKey] = {
          matches: 0,
          bestScore: 0,
          totalScore: 0,
        };
      profile.durationStats[dKey].matches += 1;
      profile.durationStats[dKey].totalScore += sc;
      if (sc > profile.durationStats[dKey].bestScore)
        profile.durationStats[dKey].bestScore = sc;
    });

    if (profile.totalMatches < playerScores.length) {
      profile.totalMatches = playerScores.length;
    }
    if (profile.totalPlaytimeSeconds === 0 && playerScores.length > 0) {
      playerScores.forEach((s) => {
        profile.totalPlaytimeSeconds += parseInt(s.duration, 10) || 60;
      });
    }

    // Ha totalScore még mindig 0, számoljuk ki a meccsekből
    if (!profile.totalScore || profile.totalScore === 0) {
      if (playerScores.length > 0) {
        profile.totalScore = playerScores.reduce(
          (sum, s) => sum + (parseInt(s.score, 10) || 0),
          0,
        );
      } else if (profile.history && profile.history.length > 0) {
        profile.totalScore = profile.history.reduce(
          (sum, h) => sum + (parseInt(h.score, 10) || 0),
          0,
        );
      }
    }

    // Ha az előzmények üresek, de vannak meccsei a ranglistán, töltsük be azokat!
    if (!profile.history || profile.history.length === 0) {
      profile.history = playerScores
        .map((s) => ({
          score: parseInt(s.score, 10) || 0,
          color: String(s.color || "3"),
          modifier: s.modifier || "normal",
          duration: parseInt(s.duration, 10) || 60,
          timestamp: s.timestamp || new Date().toISOString(),
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    }

    // Ha nincsenek szinkronizált mérföldkövei, a statisztikái alapján következtessük ki (CSAK HA MÁR JÁTSZOTT!)
    if (
      (!profile.achievements || profile.achievements.length === 0) &&
      (profile.bestScore > 0 || profile.totalMatches > 0)
    ) {
      const inferred = [];
      if (profile.bestScore >= 500) inferred.push("first_500");
      if (profile.bestScore >= 1500) inferred.push("score_1500");
      if (profile.bestScore >= 5000) inferred.push("score_5000");
      if (profile.bestScore >= 10000) inferred.push("score_10k");
      if (profile.bestScore >= 25000) inferred.push("score_25k");
      if (profile.bestScore >= 50000) inferred.push("score_50k");
      if (profile.bestScore >= 75000) inferred.push("score_75k");
      if (profile.bestScore >= 100000) inferred.push("score_100k");
      MATCHES_MILESTONES.forEach((m) => {
        if (profile.totalMatches >= m.count) inferred.push(m.achId);
      });
      if (profile.totalMatches >= 5) inferred.push("play_5_matches");
      if (profile.totalMatches >= 10) inferred.push("matches_10");
      if (profile.totalMatches >= 20) inferred.push("play_20_matches");
      if (profile.totalMatches >= 50) inferred.push("matches_50");
      if (profile.totalMatches >= 100) inferred.push("matches_100");
      if (profile.totalMatches >= 250) inferred.push("matches_250");
      if (profile.totalPlaytimeSeconds >= 60) inferred.push("play_time_1m");
      if (profile.totalPlaytimeSeconds >= 300) inferred.push("play_time_5m");
      if (profile.totalPlaytimeSeconds >= 900) inferred.push("play_time_15m");
      if (profile.totalPlaytimeSeconds >= 1800) inferred.push("play_time_30m");
      if (profile.totalPlaytimeSeconds >= 3600) inferred.push("play_time_1h");
      if (profile.totalPlaytimeSeconds >= 7200) inferred.push("play_time_2h");
      profile.achievements = inferred;
    }

    const currentUser = window.authService?.getCurrentUser();
    if (
      currentUser &&
      currentUser.displayName &&
      currentUser.displayName.toLowerCase() === username.toLowerCase()
    ) {
      profile.achievements = getUnlockedAchievements(username);
      profile.chosenTitle =
        localStorage.getItem("crashdown_chosen_title") || profile.chosenTitle;
      profile.chosenAvatar =
        localStorage.getItem("crashdown_chosen_avatar") ||
        profile.chosenAvatar ||
        "avatar_default";
      profile.chosenNameColor =
        localStorage.getItem("crashdown_chosen_name_color") ||
        profile.chosenNameColor ||
        "name_white";
    }

    const achSet = new Set(profile.achievements || []);

    const nameColorCatalog =
      typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];

    // Független feloldási listák inicializálása ha még nincsenek definiálva
    if (
      profile.unlockedTitles === undefined ||
      profile.unlockedTitles === null
    ) {
      const initTitles = ["title_none", "title_beginner"];
      PROFILE_TITLES.forEach((t) => {
        if (t.id === "title_none" || t.id === "title_beginner") return;
        if (t.achId && achSet.has(t.achId)) {
          initTitles.push(t.id);
        } else if (
          typeof t.isUnlocked === "function" &&
          t.isUnlocked(profile, achSet)
        ) {
          initTitles.push(t.id);
        }
      });
      profile.unlockedTitles = Array.from(new Set(initTitles));
    } else {
      profile.unlockedTitles = ensureArray(profile.unlockedTitles, [
        "title_none",
        "title_beginner",
      ]);
    }
    if (!profile.unlockedTitles.includes("title_none")) {
      profile.unlockedTitles.unshift("title_none");
    }
    if (!profile.unlockedTitles.includes("title_beginner")) {
      profile.unlockedTitles.push("title_beginner");
    }

    if (
      profile.unlockedColors === undefined ||
      profile.unlockedColors === null
    ) {
      const initColors = ["name_white"];
      nameColorCatalog.forEach((col) => {
        if (col.id === "name_white") return;
        if (!col.achId || achSet.has(col.achId)) {
          initColors.push(col.id);
        }
      });
      profile.unlockedColors = Array.from(new Set(initColors));
    } else {
      profile.unlockedColors = ensureArray(profile.unlockedColors, [
        "name_white",
      ]);
    }
    if (!profile.unlockedColors.includes("name_white")) {
      profile.unlockedColors.unshift("name_white");
    }

    if (
      profile.unlockedAvatars === undefined ||
      profile.unlockedAvatars === null
    ) {
      const initAvatars = ["avatar_default"];
      PROFILE_AVATARS.forEach((av) => {
        if (av.id === "avatar_default") return;
        if (!av.achId || achSet.has(av.achId)) {
          initAvatars.push(av.id);
        }
      });
      profile.unlockedAvatars = Array.from(new Set(initAvatars));
    } else {
      profile.unlockedAvatars = ensureArray(profile.unlockedAvatars, [
        "avatar_default",
      ]);
    }
    if (!profile.unlockedAvatars.includes("avatar_default")) {
      profile.unlockedAvatars.unshift("avatar_default");
    }

    const themesCatalog =
      typeof THEMES_CATALOG !== "undefined" ? THEMES_CATALOG : [];
    if (
      profile.unlockedThemes === undefined ||
      profile.unlockedThemes === null
    ) {
      const initThemes = ["retro", "cyber"];
      themesCatalog.forEach((th) => {
        if (th.id === "retro" || th.id === "cyber") return;
        if (!th.achId || achSet.has(th.achId)) {
          initThemes.push(th.id);
        }
      });
      profile.unlockedThemes = Array.from(new Set(initThemes));
    } else {
      profile.unlockedThemes = ensureArray(profile.unlockedThemes, [
        "retro",
        "cyber",
      ]);
    }
    if (!profile.unlockedThemes.includes("retro")) {
      profile.unlockedThemes.unshift("retro");
    }
    if (!profile.unlockedThemes.includes("cyber")) {
      profile.unlockedThemes.push("cyber");
    }

    // Aktív téma
    profile.activeTheme =
      profile.chosenTheme ||
      (typeof currentTheme !== "undefined" ? currentTheme : "retro");
    if (!profile.unlockedThemes.includes(profile.activeTheme)) {
      profile.activeTheme = "retro";
    }

    // Rangcím meghatározása: kizárólag a független unlockedTitles listától függ
    let activeTitle = null;
    if (
      profile.chosenTitle &&
      profile.unlockedTitles.includes(profile.chosenTitle)
    ) {
      const foundTitle = PROFILE_TITLES.find(
        (t) => t.id === profile.chosenTitle,
      );
      if (foundTitle) {
        activeTitle = foundTitle;
      }
    }
    profile.activeTitle = activeTitle || PROFILE_TITLES[0];

    // Profilkép (Avatar) meghatározása: kizárólag az unlockedAvatars listától függ
    let activeAvatar = null;
    if (
      profile.chosenAvatar &&
      profile.unlockedAvatars.includes(profile.chosenAvatar)
    ) {
      const foundAv = PROFILE_AVATARS.find(
        (a) => a.id === profile.chosenAvatar,
      );
      if (foundAv) {
        activeAvatar = foundAv;
      }
    }
    profile.activeAvatar = activeAvatar || PROFILE_AVATARS[0];

    // Név szín meghatározása: kizárólag az unlockedColors listától függ
    let activeNameColor = null;
    if (
      profile.chosenNameColor &&
      profile.unlockedColors.includes(profile.chosenNameColor)
    ) {
      const foundCol = nameColorCatalog.find(
        (c) => c.id === profile.chosenNameColor,
      );
      if (foundCol) {
        activeNameColor = foundCol;
      }
    }
    profile.activeNameColor = activeNameColor ||
      nameColorCatalog[0] || {
        id: "name_white",
        name: "Klasszikus Fehér",
        className: "name-color-white",
      };

    return profile;
  }

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
    const num =
      typeof score === "number" ? Math.round(score) : parseInt(score, 10);
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
    return email === ADMIN_EMAIL.toLowerCase() || displayName === "shifhu1234";
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
    localStorage.setItem(
      "crashdown_admin_mode_active",
      next ? "true" : "false",
    );
    if (next) {
      showToast("🛡️ Adminisztrátori felület bekapcsolva!", "success");
      if (
        typeof playSound !== "undefined" &&
        typeof sikeresKatt !== "undefined"
      )
        playSound(sikeresKatt);
    } else {
      showToast(
        "👤 Normál játékos nézet aktív (admin felület elrejtve)!",
        "info",
      );
      if (typeof playSound !== "undefined" && typeof hangKatt !== "undefined")
        playSound(hangKatt);
    }
    const curUser = window.authService?.getCurrentUser();
    if (curUser) updateAuthUI(curUser);
    if (typeof toplistaMegjelenites === "function") toplistaMegjelenites();

    const profileModal = document.getElementById("playerProfileModal");
    if (
      profileModal &&
      !profileModal.classList.contains("hidden") &&
      window._currentOpenProfileUsername
    ) {
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
  async function adminForceUpdateUserAchievements(
    targetUsername,
    newAchievementsList,
    customToast = null,
    skipModalRerender = false,
  ) {
    if (!isAdminUser() || !targetUsername) return;

    window.isPerformingAdminAction = true;
    if (window._adminActionTimer) clearTimeout(window._adminActionTimer);

    let profile = null;
    if (
      window.leaderboardService &&
      typeof window.leaderboardService.getPlayerProfile === "function"
    ) {
      profile =
        await window.leaderboardService.getPlayerProfile(targetUsername);
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
    if (
      currentUser &&
      currentUser.displayName &&
      currentUser.displayName.toLowerCase() === targetUsername.toLowerCase()
    ) {
      const uKey =
        "crashdown_achievements_" + targetUsername.trim().toLowerCase();
      localStorage.setItem(uKey, JSON.stringify(newAchievementsList));
      localStorage.setItem(
        "crashdown_achievements",
        JSON.stringify(newAchievementsList),
      );
      if (typeof updateThemeSelectUI === "function") updateThemeSelectUI();
    }

    // Firebase profil mentés
    if (
      window.leaderboardService &&
      typeof window.leaderboardService.savePlayerProfile === "function"
    ) {
      await window.leaderboardService.savePlayerProfile(
        targetUsername,
        profile,
      );
    }

    const toastMsg =
      customToast ||
      `⚡ ${targetUsername} jelvényei frissítve (${newAchievementsList.length} db)!`;
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
  async function adminForceUpdatePlayerCustomRewards(
    targetUsername,
    updates = {},
    customToast = null,
    skipModalRerender = false,
  ) {
    if (!isAdminUser() || !targetUsername) return;

    window.isPerformingAdminAction = true;
    if (window._adminActionTimer) clearTimeout(window._adminActionTimer);

    let profile = null;
    if (
      window.leaderboardService &&
      typeof window.leaderboardService.getPlayerProfile === "function"
    ) {
      profile =
        await window.leaderboardService.getPlayerProfile(targetUsername);
    }
    if (!profile) {
      const key = "crashdown_player_profiles";
      const localProfiles = JSON.parse(localStorage.getItem(key) || "{}");
      profile = localProfiles[targetUsername] || { username: targetUsername };
    }

    if (!Array.isArray(profile.unlockedTitles))
      profile.unlockedTitles = ["title_beginner"];
    if (!Array.isArray(profile.unlockedColors))
      profile.unlockedColors = ["name_white"];
    if (!Array.isArray(profile.unlockedAvatars))
      profile.unlockedAvatars = ["avatar_default"];
    if (!Array.isArray(profile.unlockedThemes))
      profile.unlockedThemes = ["retro", "cyber"];

    if (Array.isArray(updates.unlockedTitles))
      profile.unlockedTitles = [...updates.unlockedTitles];
    if (Array.isArray(updates.unlockedColors))
      profile.unlockedColors = [...updates.unlockedColors];
    if (Array.isArray(updates.unlockedAvatars))
      profile.unlockedAvatars = [...updates.unlockedAvatars];
    if (Array.isArray(updates.unlockedThemes))
      profile.unlockedThemes = [...updates.unlockedThemes];

    if (!profile.unlockedTitles.includes("title_beginner"))
      profile.unlockedTitles.unshift("title_beginner");
    if (!profile.unlockedColors.includes("name_white"))
      profile.unlockedColors.unshift("name_white");
    if (!profile.unlockedAvatars.includes("avatar_default"))
      profile.unlockedAvatars.unshift("avatar_default");
    if (!profile.unlockedThemes.includes("retro"))
      profile.unlockedThemes.unshift("retro");
    if (!profile.unlockedThemes.includes("cyber"))
      profile.unlockedThemes.push("cyber");

    if (updates.chosenTitle !== undefined)
      profile.chosenTitle = updates.chosenTitle;
    if (updates.chosenAvatar !== undefined)
      profile.chosenAvatar = updates.chosenAvatar;
    if (updates.chosenNameColor !== undefined)
      profile.chosenNameColor = updates.chosenNameColor;
    if (updates.chosenTheme !== undefined)
      profile.chosenTheme = updates.chosenTheme;

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
    if (
      profile.chosenTheme &&
      !profile.unlockedThemes.includes(profile.chosenTheme)
    ) {
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
            if (profile.chosenNameColor)
              entry.chosenNameColor = profile.chosenNameColor;
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
    if (
      currentUser &&
      currentUser.displayName &&
      currentUser.displayName.toLowerCase() === targetUsername.toLowerCase()
    ) {
      if (profile.chosenTitle)
        localStorage.setItem("crashdown_chosen_title", profile.chosenTitle);
      if (profile.chosenAvatar)
        localStorage.setItem("crashdown_chosen_avatar", profile.chosenAvatar);
      if (profile.chosenNameColor)
        localStorage.setItem(
          "crashdown_chosen_name_color",
          profile.chosenNameColor,
        );
      if (profile.chosenTheme) {
        localStorage.setItem("crashdown_theme", profile.chosenTheme);
        if (typeof applyTheme === "function") applyTheme(profile.chosenTheme);
      }
      if (typeof updateThemeSelectUI === "function") updateThemeSelectUI();
    }

    // Firebase profil mentés
    if (
      window.leaderboardService &&
      typeof window.leaderboardService.savePlayerProfile === "function"
    ) {
      await window.leaderboardService.savePlayerProfile(
        targetUsername,
        profile,
      );
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
    if (typeof checkScoreAchievements === "function") {
      checkScoreAchievements(pontSzam);
    }
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
        const profiles = JSON.parse(
          localStorage.getItem("crashdown_player_profiles") || "{}",
        );
        const p = profiles[currentUser.displayName];
        if (p && Array.isArray(p.unlockedThemes)) {
          userUnlockedThemes = new Set(p.unlockedThemes);
        }
      } catch (e) {}
    }

    themeSelect.innerHTML = THEMES_CATALOG.map((t) => {
      const isUnlocked = userUnlockedThemes
        ? userUnlockedThemes.has(t.id)
        : !t.achId || achSet.has(t.achId);
      return `<option value="${t.id}">${isUnlocked ? "" : "🔒 "}${t.name}</option>`;
    }).join("");

    themeSelect.value = currentTheme;

    const paletteWrap = document.getElementById("themeSelectPalette");
    if (paletteWrap) {
      const pal = THEME_PALETTES[currentTheme] || THEME_PALETTES.retro;
      paletteWrap.innerHTML = pal
        .map(
          (c) =>
            `<span class="theme-palette-dot" style="background-color: ${c};"></span>`,
        )
        .join("");
    }
  }

  function applyTheme(themeKey) {
    if (!THEME_PALETTES[themeKey]) themeKey = "retro";

    const paletteWrap = document.getElementById("themeSelectPalette");
    if (paletteWrap) {
      const pal = THEME_PALETTES[themeKey] || THEME_PALETTES.retro;
      paletteWrap.innerHTML = pal
        .map(
          (c) =>
            `<span class="theme-palette-dot" style="background-color: ${c};"></span>`,
        )
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
        const profiles = JSON.parse(
          localStorage.getItem("crashdown_player_profiles") || "{}",
        );
        const p = profiles[currentUser.displayName];
        if (p && Array.isArray(p.unlockedThemes)) {
          userUnlockedThemes = new Set(p.unlockedThemes);
        }
      } catch (e) {}
    }

    const isUnlocked = userUnlockedThemes
      ? userUnlockedThemes.has(themeObj.id)
      : !themeObj.achId || achSet.has(themeObj.achId);

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
      if (
        currentUser &&
        currentUser.displayName &&
        currentUser.displayName.toLowerCase() === username.toLowerCase()
      ) {
        if (updates.chosenTheme) {
          localStorage.setItem("crashdown_theme", updates.chosenTheme);
          if (typeof applyTheme === "function") applyTheme(updates.chosenTheme);
          if (typeof updateThemeSelectUI === "function") updateThemeSelectUI();
        }
      }

      // Frissítsük a helyi toplistát is azonnal a módosított adatokkal
      try {
        const localScores = JSON.parse(
          localStorage.getItem("toplista") || "[]",
        );
        const uLower = username.trim().toLowerCase();
        let updatedAny = false;
        localScores.forEach((s) => {
          if (
            String(s.name || "")
              .trim()
              .toLowerCase() === uLower
          ) {
            if (updates.chosenTitle !== undefined)
              s.chosenTitle = updates.chosenTitle;
            if (updates.chosenAvatar !== undefined)
              s.chosenAvatar = updates.chosenAvatar;
            if (updates.chosenNameColor !== undefined)
              s.chosenNameColor = updates.chosenNameColor;
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
        typeof window.leaderboardService.updatePlayerCustomizations ===
          "function"
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

  // A sortCatalogItems rendező logika a src/utils/catalogSort.js modulból érkezik


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

    const profileAdminToggleBtn = document.getElementById(
      "profileAdminModeToggleBtn",
    );
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
      onlineProfile =
        await window.leaderboardService.getPlayerProfile(username);
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
      ((currentUser.displayName &&
        currentUser.displayName.trim().toLowerCase() ===
          String(stats.username).trim().toLowerCase()) ||
        (currentUser.email &&
          currentUser.email.trim().toLowerCase() ===
            String(stats.username).trim().toLowerCase()));
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
      if (!stats.activeTitle || stats.activeTitle.id === "title_none") {
        titleEl.textContent = "";
        titleEl.style.display = "none";
      } else {
        titleEl.textContent = stats.activeTitle.name;
        titleEl.style.display = "inline-block";
        Array.from(titleEl.classList).forEach((cls) => {
          if (cls.startsWith("title-") && cls !== "profile-player-badge") {
            titleEl.classList.remove(cls);
          }
        });
        if (stats.activeTitle.specialClass) {
          titleEl.classList.add(stats.activeTitle.specialClass);
        }
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
      if (canManageCustomization) {
        themeSection.style.display = "block";

        let clientUnlockedThemes = ["retro", "cyber"];
      const myUser = window.authService?.getCurrentUser();
      if (myUser && myUser.displayName) {
        try {
          const localProfiles = JSON.parse(
            localStorage.getItem("crashdown_player_profiles") || "{}",
          );
          const myProf = localProfiles[myUser.displayName];
          if (myProf && Array.isArray(myProf.unlockedThemes)) {
            clientUnlockedThemes = [...myProf.unlockedThemes];
          }
        } catch (e) {}
      }
      if (isOwnProfile && Array.isArray(stats.unlockedThemes)) {
        clientUnlockedThemes = Array.from(
          new Set([...clientUnlockedThemes, ...stats.unlockedThemes]),
        );
      }
      const localAchKey =
        myUser && myUser.displayName
          ? "crashdown_achievements_" + myUser.displayName.trim().toLowerCase()
          : "crashdown_achievements";
      const clientAchs = new Set(
        JSON.parse(
          localStorage.getItem(localAchKey) ||
            localStorage.getItem("crashdown_achievements") ||
            "[]",
        ),
      );
      themesCatalog.forEach((th) => {
        if (
          th.achId &&
          clientAchs.has(th.achId) &&
          !clientUnlockedThemes.includes(th.id)
        ) {
          clientUnlockedThemes.push(th.id);
        }
      });
      if (!clientUnlockedThemes.includes("retro"))
        clientUnlockedThemes.unshift("retro");
      if (!clientUnlockedThemes.includes("cyber"))
        clientUnlockedThemes.push("cyber");

      function renderThemeCards(sortMode = "default") {
        const clientActiveTheme =
          typeof currentTheme !== "undefined" && currentTheme
            ? currentTheme
            : localStorage.getItem("crashdown_theme") || "retro";

        const sortedThemes = sortCatalogItems(themesCatalog, sortMode, (th) =>
          isAdmin && !isOwnProfile
            ? (stats.unlockedThemes || ["retro", "cyber"]).includes(th.id)
            : clientUnlockedThemes.includes(th.id),
        );

        themeGrid.innerHTML = sortedThemes
          .map((th) => {
            const unlocked =
              isAdmin && !isOwnProfile
                ? (stats.unlockedThemes || ["retro", "cyber"]).includes(th.id)
                : clientUnlockedThemes.includes(th.id);
            const isSelected = clientActiveTheme === th.id;
            const reqAch = th.achId
              ? ACHIEVEMENTS.find((a) => a.id === th.achId)
              : null;
            const lockTitle = reqAch
              ? `Zárolva: ${reqAch.title} (${reqAch.desc}) szükséges hozzá!`
              : "Zárolva";
            const palette =
              typeof THEME_PALETTES !== "undefined" && THEME_PALETTES[th.id]
                ? THEME_PALETTES[th.id]
                : ["#ef4444", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6"];
            const dotsHtml = palette
              .map(
                (c) =>
                  `<span class="theme-palette-dot" style="background-color: ${c};"></span>`,
              )
              .join("");
            const specialBadge = th.isSpecial
              ? '<span class="title-pick-special-tag">Speciális</span>'
              : "";

            return `
            <div class="theme-pick-card ${unlocked ? "" : "locked"} ${isSelected ? "active" : ""} ${isAdmin ? "admin-manageable" : ""}"
                 data-theme-id="${th.id}"
                 data-unlocked="${unlocked ? "1" : "0"}"
                 title="${isAdmin ? (unlocked ? `${th.name} (Kattints a beállításhoz, jobb felső gombbal zárolhatod)` : `${lockTitle} (Admin: kattints a feloldáshoz)`) : unlocked ? th.name : lockTitle}">
                ${
                  isAdmin && th.id !== "retro" && th.id !== "cyber"
                    ? `
                  <button type="button" class="card-admin-toggle-badge ${unlocked ? "unlocked" : "locked"}" 
                          data-action="toggle-lock"
                          title="${unlocked ? "Zárolás (Admin)" : "Feloldás (Admin)"}">
                    ${unlocked ? "✓" : "🔒"}
                  </button>
                `
                    : !unlocked
                      ? '<span class="avatar-lock-icon">🔒</span>'
                      : ""
                }
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

            if (
              isToggleBtn &&
              isAdmin &&
              thObj.id !== "retro" &&
              thObj.id !== "cyber"
            ) {
              e.stopPropagation();
              if (this.dataset.busy === "1") return;
              this.dataset.busy = "1";

              const nextUnlocked = !isUnlocked;
              this.setAttribute("data-unlocked", nextUnlocked ? "1" : "0");
              this.classList.toggle("locked", !nextUnlocked);
              const toggleBtnEl = this.querySelector(
                "[data-action='toggle-lock']",
              );
              if (toggleBtnEl) {
                toggleBtnEl.textContent = nextUnlocked ? "✓" : "🔒";
                toggleBtnEl.className = `card-admin-toggle-badge ${nextUnlocked ? "unlocked" : "locked"}`;
                toggleBtnEl.title = nextUnlocked
                  ? "Zárolás (Admin)"
                  : "Feloldás (Admin)";
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
                  true,
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
                const toggleBtnEl = this.querySelector(
                  "[data-action='toggle-lock']",
                );
                if (toggleBtnEl) {
                  toggleBtnEl.textContent = "✓";
                  toggleBtnEl.className = "card-admin-toggle-badge unlocked";
                  toggleBtnEl.title = "Zárolás (Admin)";
                }

                let curThemes = [
                  ...(stats.unlockedThemes || ["retro", "cyber"]),
                ];
                if (!curThemes.includes(thId)) curThemes.push(thId);
                stats.unlockedThemes = curThemes;
                stats.chosenTheme = thId;

                themeGrid
                  .querySelectorAll(".theme-pick-card")
                  .forEach((c) => c.classList.remove("active"));
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
                    true,
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
              syncPlayerCustomization(loggedInUser.displayName, {
                chosenTheme: thId,
              }).catch(() => {});
            }

            themeGrid
              .querySelectorAll(".theme-pick-card")
              .forEach((c) => c.classList.remove("active"));
            this.classList.add("active");

            showToast(`🎨 Új játéktéma beállítva: ${thObj.name}!`, "success");
            if (
              typeof playSound !== "undefined" &&
              typeof sikeresKatt !== "undefined"
            )
              playSound(sikeresKatt);
            triggerHaptic("success");
            if (typeof updateThemeSelectUI === "function")
              updateThemeSelectUI();
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
    } else {
      themeSection.style.display = "none";
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
            (col) => (stats.unlockedColors || ["name_white"]).includes(col.id),
          );

          nameColorGrid.innerHTML = sortedColors
            .map((col) => {
              const unlocked = (
                stats.unlockedColors || ["name_white"]
              ).includes(col.id);
              const isSelected =
                stats.activeNameColor && stats.activeNameColor.id === col.id;
              const reqAch = col.achId
                ? ACHIEVEMENTS.find((a) => a.id === col.achId)
                : null;
              const lockTitle = reqAch
                ? `Zárolva: ${reqAch.title} (${reqAch.desc}) szükséges hozzá!`
                : "Zárolva";
              const colorBadge = col.isMythic
                ? '<span class="title-pick-mythic-tag">Mítikus</span>'
                : col.isSpecial
                  ? '<span class="title-pick-special-tag">Speciális</span>'
                  : "";
              return `
              <div class="name-color-pick-card ${unlocked ? "" : "locked"} ${isSelected ? "active" : ""} ${isAdmin ? "admin-manageable" : ""}"
                   data-color-id="${col.id}"
                   data-unlocked="${unlocked ? "1" : "0"}"
                   title="${isAdmin ? (unlocked ? `${col.name} (Kattints a beállításhoz, jobb felső gombbal zárolhatod)` : `${lockTitle} (Admin: kattints a feloldáshoz)`) : unlocked ? col.name : lockTitle}">
                  ${
                    isAdmin && col.id !== "name_white"
                      ? `
                    <button type="button" class="card-admin-toggle-badge ${unlocked ? "unlocked" : "locked"}" 
                            data-action="toggle-lock"
                            title="${unlocked ? "Zárolás (Admin)" : "Feloldás (Admin)"}">
                      ${unlocked ? "✓" : "🔒"}
                    </button>
                  `
                      : !unlocked
                        ? '<span class="avatar-lock-icon">🔒</span>'
                        : ""
                  }
                  <span class="name-color-preview-text ${col.className}">Aa</span>
                  <span class="name-color-label">${col.name} ${colorBadge}</span>
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

                const isToggleBtn = e.target.closest(
                  "[data-action='toggle-lock']",
                );
                const isUnlocked = this.getAttribute("data-unlocked") === "1";

                if (isToggleBtn && isAdmin && colObj.id !== "name_white") {
                  e.stopPropagation();
                  if (this.dataset.busy === "1") return;
                  this.dataset.busy = "1";

                  const nextUnlocked = !isUnlocked;
                  this.setAttribute("data-unlocked", nextUnlocked ? "1" : "0");
                  this.classList.toggle("locked", !nextUnlocked);
                  const toggleBtnEl = this.querySelector(
                    "[data-action='toggle-lock']",
                  );
                  if (toggleBtnEl) {
                    toggleBtnEl.textContent = nextUnlocked ? "✓" : "🔒";
                    toggleBtnEl.className = `card-admin-toggle-badge ${nextUnlocked ? "unlocked" : "locked"}`;
                    toggleBtnEl.title = nextUnlocked
                      ? "Zárolás (Admin)"
                      : "Feloldás (Admin)";
                  }

                  let curColors = [...(stats.unlockedColors || ["name_white"])];
                  if (nextUnlocked) {
                    if (!curColors.includes(colId)) curColors.push(colId);
                  } else {
                    curColors = curColors.filter((id) => id !== colId);
                    if (stats.chosenNameColor === colId)
                      stats.chosenNameColor = "name_white";
                    this.classList.remove("active");
                  }
                  stats.unlockedColors = curColors;

                  triggerHaptic("heavy");
                  if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
                  try {
                    await adminForceUpdatePlayerCustomRewards(
                      stats.username,
                      {
                        unlockedColors: curColors,
                        chosenNameColor: stats.chosenNameColor,
                      },
                      nextUnlocked
                        ? `🔓 ${colObj.name} név szín feloldva (${stats.username})!`
                        : `🔒 ${colObj.name} név szín zárolva (${stats.username})!`,
                      true,
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
                    const toggleBtnEl = this.querySelector(
                      "[data-action='toggle-lock']",
                    );
                    if (toggleBtnEl) {
                      toggleBtnEl.textContent = "✓";
                      toggleBtnEl.className =
                        "card-admin-toggle-badge unlocked";
                      toggleBtnEl.title = "Zárolás (Admin)";
                    }

                    let curColors = [
                      ...(stats.unlockedColors || ["name_white"]),
                    ];
                    if (!curColors.includes(colId)) curColors.push(colId);
                    stats.unlockedColors = curColors;
                    stats.chosenNameColor = colId;
                    stats.activeNameColor = colObj;

                    if (nameEl) {
                      nameColorCatalog.forEach((c) =>
                        nameEl.classList.remove(c.className),
                      );
                      nameEl.classList.add(colObj.className);
                    }

                    nameColorGrid
                      .querySelectorAll(".name-color-pick-card")
                      .forEach((c) => c.classList.remove("active"));
                    this.classList.add("active");

                    triggerHaptic("impact");
                    if (typeof hangKatt !== "undefined") playSound(hangKatt);
                    try {
                      await adminForceUpdatePlayerCustomRewards(
                        stats.username,
                        { unlockedColors: curColors, chosenNameColor: colId },
                        `⚡ ${colObj.name} név szín feloldva és beállítva (${stats.username})!`,
                        true,
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

                showToast(
                  `🎨 Új név szín beállítva (${stats.username}): ${colObj.name}!`,
                  "success",
                );
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
          const sortedTitles = sortCatalogItems(PROFILE_TITLES, sortMode, (t) =>
            (stats.unlockedTitles || ["title_none", "title_beginner"]).includes(t.id),
          );

          titleGrid.innerHTML = sortedTitles
            .map((t) => {
              const unlocked = (
                stats.unlockedTitles || ["title_none", "title_beginner"]
              ).includes(t.id);
              const isSelected = stats.chosenTitle
                ? t.id === stats.chosenTitle
                : t.id === stats.activeTitle.id;
              const reqAch = t.achId
                ? ACHIEVEMENTS.find((a) => a.id === t.achId)
                : null;
              const lockTitle = reqAch
                ? `Zárolva: ${reqAch.title} (${reqAch.desc}) szükséges hozzá!`
                : `Zárolva: ${t.desc}`;
              const specialBadge = t.isMythic
                ? '<span class="title-pick-mythic-tag">Mítikus</span>'
                : t.isSpecial
                  ? '<span class="title-pick-special-tag">Speciális</span>'
                  : "";

              return `
            <div class="title-pick-card ${unlocked ? "" : "locked"} ${isSelected ? "active" : ""} ${isAdmin ? "admin-manageable" : ""}"
                 data-title-id="${t.id}"
                 data-unlocked="${unlocked ? "1" : "0"}"
                 title="${isAdmin ? (unlocked ? `${t.name} (Kattints a beállításhoz, jobb felső gombbal zárolhatod)` : `${lockTitle} (Admin: kattints a feloldáshoz)`) : unlocked ? t.name : lockTitle}">
                ${
                  isAdmin && t.id !== "title_none" && t.id !== "title_beginner"
                    ? `
                  <button type="button" class="card-admin-toggle-badge ${unlocked ? "unlocked" : "locked"}" 
                          data-action="toggle-lock"
                          title="${unlocked ? "Zárolás (Admin)" : "Feloldás (Admin)"}">
                    ${unlocked ? "✓" : "🔒"}
                  </button>
                `
                    : !unlocked
                      ? '<span class="avatar-lock-icon">🔒</span>'
                      : ""
                }
                <div class="title-pick-name">
                  <span class="title-text-label ${t.specialClass || ""}">${t.name}</span>
                  ${specialBadge}
                </div>
            </div>
          `;
            })
            .join("");

          titleGrid.querySelectorAll(".title-pick-card").forEach((card) => {
            card.addEventListener("click", async function (e) {
              const chosenId = this.getAttribute("data-title-id");
              const titleObj = PROFILE_TITLES.find((t) => t.id === chosenId);
              if (!titleObj) return;

              const isToggleBtn = e.target.closest(
                "[data-action='toggle-lock']",
              );
              const isUnlocked = this.getAttribute("data-unlocked") === "1";

              if (isToggleBtn && isAdmin && titleObj.id !== "title_none" && titleObj.id !== "title_beginner") {
                e.stopPropagation();
                if (this.dataset.busy === "1") return;
                this.dataset.busy = "1";

                const nextUnlocked = !isUnlocked;
                this.setAttribute("data-unlocked", nextUnlocked ? "1" : "0");
                this.classList.toggle("locked", !nextUnlocked);
                const toggleBtnEl = this.querySelector(
                  "[data-action='toggle-lock']",
                );
                if (toggleBtnEl) {
                  toggleBtnEl.textContent = nextUnlocked ? "✓" : "🔒";
                  toggleBtnEl.className = `card-admin-toggle-badge ${nextUnlocked ? "unlocked" : "locked"}`;
                  toggleBtnEl.title = nextUnlocked
                    ? "Zárolás (Admin)"
                    : "Feloldás (Admin)";
                }

                let curTitles = [
                  ...(stats.unlockedTitles || ["title_none", "title_beginner"]),
                ];
                if (nextUnlocked) {
                  if (!curTitles.includes(chosenId)) curTitles.push(chosenId);
                } else {
                  curTitles = curTitles.filter((id) => id !== chosenId);
                  if (stats.chosenTitle === chosenId)
                    stats.chosenTitle = "title_none";
                  this.classList.remove("active");
                }
                stats.unlockedTitles = curTitles;

                triggerHaptic("heavy");
                if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
                try {
                  await adminForceUpdatePlayerCustomRewards(
                    stats.username,
                    {
                      unlockedTitles: curTitles,
                      chosenTitle: stats.chosenTitle,
                    },
                    nextUnlocked
                      ? `🔓 ${titleObj.name} rangcím feloldva (${stats.username})!`
                      : `🔒 ${titleObj.name} rangcím zárolva (${stats.username})!`,
                    true,
                  );
                } finally {
                  delete this.dataset.busy;
                }
                return;
              }

              if (!isUnlocked) {
                if (isAdmin && titleObj.id !== "title_none" && titleObj.id !== "title_beginner") {
                  this.setAttribute("data-unlocked", "1");
                  this.classList.remove("locked");
                  const toggleBtnEl = this.querySelector(
                    "[data-action='toggle-lock']",
                  );
                  if (toggleBtnEl) {
                    toggleBtnEl.textContent = "✓";
                    toggleBtnEl.className = "card-admin-toggle-badge unlocked";
                    toggleBtnEl.title = "Zárolás (Admin)";
                  }

                  let curTitles = [
                    ...(stats.unlockedTitles || ["title_none", "title_beginner"]),
                  ];
                  if (!curTitles.includes(chosenId)) curTitles.push(chosenId);
                  stats.unlockedTitles = curTitles;
                  stats.chosenTitle = chosenId;
                  stats.activeTitle = titleObj;

                  if (titleEl) {
                    if (titleObj.id === "title_none") {
                      titleEl.textContent = "";
                      titleEl.style.display = "none";
                    } else {
                      titleEl.textContent = titleObj.name;
                      titleEl.style.display = "inline-block";
                      Array.from(titleEl.classList).forEach((cls) => {
                        if (
                          cls.startsWith("title-") &&
                          cls !== "profile-player-badge"
                        ) {
                          titleEl.classList.remove(cls);
                        }
                      });
                      if (titleObj.specialClass) {
                        titleEl.classList.add(titleObj.specialClass);
                      }
                    }
                  }

                  titleGrid
                    .querySelectorAll(".title-pick-card")
                    .forEach((c) => c.classList.remove("active"));
                  this.classList.add("active");

                  triggerHaptic("impact");
                  if (typeof hangKatt !== "undefined") playSound(hangKatt);
                  try {
                    await adminForceUpdatePlayerCustomRewards(
                      stats.username,
                      { unlockedTitles: curTitles, chosenTitle: chosenId },
                      `⚡ ${titleObj.name} rangcím feloldva és beállítva (${stats.username})!`,
                      true,
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
                if (titleObj.id === "title_none") {
                  titleEl.textContent = "";
                  titleEl.style.display = "none";
                } else {
                  titleEl.textContent = titleObj.name;
                  titleEl.style.display = "inline-block";
                  Array.from(titleEl.classList).forEach((cls) => {
                    if (
                      cls.startsWith("title-") &&
                      cls !== "profile-player-badge"
                    ) {
                      titleEl.classList.remove(cls);
                    }
                  });
                  if (titleObj.specialClass) {
                    titleEl.classList.add(titleObj.specialClass);
                  }
                }
              }

              titleGrid
                .querySelectorAll(".title-pick-card")
                .forEach((c) => c.classList.remove("active"));
              this.classList.add("active");

              showToast(
                `🎖️ Új rangcím beállítva (${stats.username}): ${titleObj.name}!`,
                "success",
              );
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
            (av) =>
              (stats.unlockedAvatars || ["avatar_default"]).includes(av.id),
          );

          avatarGrid.innerHTML = sortedAvatars
            .map((av) => {
              const unlocked = (
                stats.unlockedAvatars || ["avatar_default"]
              ).includes(av.id);
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
                 title="${isAdmin ? (unlocked ? `${av.name} (Kattints a beállításhoz, jobb felső gombbal zárolhatod)` : `${lockTitle} (Admin: kattints a feloldáshoz)`) : unlocked ? av.name : lockTitle}">
                ${
                  isAdmin && av.id !== "avatar_default"
                    ? `
                  <button type="button" class="card-admin-toggle-badge ${unlocked ? "unlocked" : "locked"}" 
                          data-action="toggle-lock"
                          title="${unlocked ? "Zárolás (Admin)" : "Feloldás (Admin)"}">
                    ${unlocked ? "✓" : "🔒"}
                  </button>
                `
                    : !unlocked
                      ? '<span class="avatar-lock-icon">🔒</span>'
                      : ""
                }
                <div class="avatar-pick-symbol">${av.symbol}</div>
                <div class="avatar-pick-name">${av.name}</div>
            </div>
          `;
            })
            .join("");

          avatarGrid.querySelectorAll(".avatar-pick-card").forEach((card) => {
            card.addEventListener("click", async function (e) {
              const chosenId = this.getAttribute("data-avatar-id");
              const avObj = PROFILE_AVATARS.find((a) => a.id === chosenId);
              if (!avObj) return;

              const isToggleBtn = e.target.closest(
                "[data-action='toggle-lock']",
              );
              const isUnlocked = this.getAttribute("data-unlocked") === "1";

              if (isToggleBtn && isAdmin && avObj.id !== "avatar_default") {
                e.stopPropagation();
                if (this.dataset.busy === "1") return;
                this.dataset.busy = "1";

                const nextUnlocked = !isUnlocked;
                this.setAttribute("data-unlocked", nextUnlocked ? "1" : "0");
                this.classList.toggle("locked", !nextUnlocked);
                const toggleBtnEl = this.querySelector(
                  "[data-action='toggle-lock']",
                );
                if (toggleBtnEl) {
                  toggleBtnEl.textContent = nextUnlocked ? "✓" : "🔒";
                  toggleBtnEl.className = `card-admin-toggle-badge ${nextUnlocked ? "unlocked" : "locked"}`;
                  toggleBtnEl.title = nextUnlocked
                    ? "Zárolás (Admin)"
                    : "Feloldás (Admin)";
                }

                let curAvatars = [
                  ...(stats.unlockedAvatars || ["avatar_default"]),
                ];
                if (nextUnlocked) {
                  if (!curAvatars.includes(chosenId)) curAvatars.push(chosenId);
                } else {
                  curAvatars = curAvatars.filter((id) => id !== chosenId);
                  if (stats.chosenAvatar === chosenId)
                    stats.chosenAvatar = "avatar_default";
                  this.classList.remove("active");
                }
                stats.unlockedAvatars = curAvatars;

                triggerHaptic("heavy");
                if (typeof sorEffekt !== "undefined") playSound(sorEffekt);
                try {
                  await adminForceUpdatePlayerCustomRewards(
                    stats.username,
                    {
                      unlockedAvatars: curAvatars,
                      chosenAvatar: stats.chosenAvatar,
                    },
                    nextUnlocked
                      ? `🔓 ${avObj.name} profilkép feloldva (${stats.username})!`
                      : `🔒 ${avObj.name} profilkép zárolva (${stats.username})!`,
                    true,
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
                  const toggleBtnEl = this.querySelector(
                    "[data-action='toggle-lock']",
                  );
                  if (toggleBtnEl) {
                    toggleBtnEl.textContent = "✓";
                    toggleBtnEl.className = "card-admin-toggle-badge unlocked";
                    toggleBtnEl.title = "Zárolás (Admin)";
                  }

                  let curAvatars = [
                    ...(stats.unlockedAvatars || ["avatar_default"]),
                  ];
                  if (!curAvatars.includes(chosenId)) curAvatars.push(chosenId);
                  stats.unlockedAvatars = curAvatars;
                  stats.chosenAvatar = chosenId;
                  stats.activeAvatar = avObj;

                  if (avatarEl) {
                    avatarEl.textContent = avObj.symbol;
                    avatarEl.title = `Profilkép: ${avObj.name}`;
                  }

                  avatarGrid
                    .querySelectorAll(".avatar-pick-card")
                    .forEach((c) => c.classList.remove("active"));
                  this.classList.add("active");

                  triggerHaptic("impact");
                  if (typeof hangKatt !== "undefined") playSound(hangKatt);
                  try {
                    await adminForceUpdatePlayerCustomRewards(
                      stats.username,
                      { unlockedAvatars: curAvatars, chosenAvatar: chosenId },
                      `⚡ ${avObj.name} profilkép feloldva és beállítva (${stats.username})!`,
                      true,
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

              showToast(
                `🖼️ Új profilkép beállítva (${stats.username}): ${avObj.name}!`,
                "success",
              );
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

    if (bestScoreEl)
      bestScoreEl.textContent = formatScore(stats.bestScore || 0);
    if (matchesEl) matchesEl.textContent = `${stats.totalMatches || 0} meccs`;

    // Összes pontszám és meccsenkénti átlagpont
    const totalScoreEl = document.getElementById("profileTotalScore");
    const avgScoreEl = document.getElementById("profileAvgScore");
    const totalScoreVal = stats.totalScore || 0;
    if (totalScoreEl) totalScoreEl.textContent = formatScore(totalScoreVal);
    const avgVal =
      stats.totalMatches > 0
        ? Math.round(totalScoreVal / stats.totalMatches)
        : 0;
    if (avgScoreEl) avgScoreEl.textContent = `${formatScore(avgVal)} p`;

    const mins = Math.floor((stats.totalPlaytimeSeconds || 0) / 60);
    const secs = (stats.totalPlaytimeSeconds || 0) % 60;
    const timeStr =
      mins > 0 ? `${mins} perc ${secs > 0 ? `${secs} mp` : ""}` : `${secs} mp`;
    if (timeEl) timeEl.textContent = timeStr;

    const achList = stats.achievements || [];
    if (achCountEl)
      achCountEl.textContent = `${achList.length} / ${ACHIEVEMENTS.length}`;
    if (badgeSummaryEl)
      badgeSummaryEl.textContent = `(${achList.length} / ${ACHIEVEMENTS.length})`;

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
    const gameModesListEl = document.getElementById(
      "profileGameModesBreakdown",
    );
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
    const durationsListEl = document.getElementById(
      "profileDurationsBreakdown",
    );
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

    const adminBadgeActions = document.getElementById(
      "profileAdminBadgeActions",
    );
    if (adminBadgeActions) {
      if (isAdmin) {
        adminBadgeActions.style.display = "inline-flex";
        const unlockAllBtn = document.getElementById(
          "profileAdminUnlockAllBtn",
        );
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
          "title",
        );

        badgesListEl.innerHTML = sortedAchs
          .map((a) => {
            const unlocked = achSet.has(a.id);
            return `
            <div class="profile-badge-item ${unlocked ? "unlocked" : "locked"} ${isAdmin ? "admin-clickable" : ""}" 
                 data-ach-id="${a.id}"
                 title="${isAdmin ? (unlocked ? "Kattints a visszazáráshoz (Admin)" : "Kattints a feloldáshoz (Admin)") : ""}">
              ${isAdmin ? `<span class="badge-admin-dot ${unlocked ? "unlocked" : "locked"}">${unlocked ? "✓" : "🔒"}</span>` : ""}
              <span class="profile-badge-icon">${a.icon}</span>
              <span class="profile-badge-name">${a.title}</span>
            </div>
          `;
          })
          .join("");

        const floatingTip = document.getElementById(
          "profileBadgeFloatingTooltip",
        );
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

            let rewardHtml = "";
            if (rewList.length > 0) {
              const displayName =
                stats.username ||
                window.authService?.getCurrentUser()?.displayName ||
                "Játékos";
              const renderedLines = rewList
                .map((r) => {
                  if (r.type === "title") {
                    return `<div class="reward-line"><span>Rangcím: </span><span class="profile-player-badge ${r.specialClass || ""}" style="display:inline-block; margin-left:4px; vertical-align:middle;">${r.titleName}</span></div>`;
                  } else if (r.type === "color") {
                    return `<div class="reward-line"><span>Név szín: </span><span class="${r.className || ""}" style="font-weight:800; display:inline-block; margin-left:4px;">${displayName}</span></div>`;
                  } else if (r.type === "avatar") {
                    return `<div class="reward-line"><span>Profilkép: </span><span style="font-size:1.15em; margin-left:4px;">${r.symbol}</span></div>`;
                  } else if (r.type === "theme") {
                    return `<div class="reward-line"><span>Téma: </span><strong style="color:#38bdf8; margin-left:4px;">${r.themeName}</strong></div>`;
                  }
                  return `<div class="reward-line"><span>${r.text}</span></div>`;
                })
                .join("");

              rewardHtml = `
              <div class="b-tooltip-reward">
                <div class="reward-heading">Jutalmak:</div>
                ${renderedLines}
              </div>
            `;
            } else {
              rewardHtml = `
              <div class="b-tooltip-reward">
                <div class="reward-heading">Jutalom:</div>
                <div class="reward-line" style="color: var(--text-muted); font-style: italic;">Nincs külön tárgyi jutalom</div>
              </div>
            `;
            }

            const adminHint = isAdmin
              ? `<div class="b-tooltip-admin-hint">⚡ Kattints a ${unlocked ? "visszazáráshoz" : "feloldáshoz"}!</div>`
              : "";

            floatingTip.innerHTML = `
            <div class="b-tooltip-header">
              <span class="b-tooltip-title">${a.icon} ${a.title}</span>
              <span class="b-tooltip-status ${unlocked ? "unlocked" : "locked"}">${unlocked ? "Megszerezve" : "Zárolva"}</span>
            </div>
            <p class="b-tooltip-desc">${a.desc}</p>
            ${rewardHtml}
            ${adminHint}
          `;

            floatingTip.style.display = "block";
            floatingTip.style.opacity = "1";

            const tipHeight = floatingTip.offsetHeight || 110;
            const rect = item.getBoundingClientRect();
            const tipWidth = 240;
            let tipLeft = rect.left + rect.width / 2 - tipWidth / 2;
            tipLeft = Math.max(
              12,
              Math.min(window.innerWidth - tipWidth - 12, tipLeft),
            );

            if (rect.top - tipHeight - 8 > 10) {
              floatingTip.style.top = `${rect.top - tipHeight - 8}px`;
            } else {
              floatingTip.style.top = `${rect.bottom + 8}px`;
            }
            floatingTip.style.left = `${tipLeft}px`;
          });

          item.addEventListener("mouseleave", () => {
            if (floatingTip) {
              floatingTip.style.display = "none";
              floatingTip.style.opacity = "0";
            }
          });

          if (isAdmin) {
            item.addEventListener("click", async (e) => {
              e.stopPropagation();
              if (item.dataset.busy === "1") return;
              item.dataset.busy = "1";

              if (floatingTip) {
                floatingTip.style.display = "none";
                floatingTip.style.opacity = "0";
              }

              const wasUnlocked = achSet.has(achId);
              const nextUnlocked = !wasUnlocked;
              item.classList.toggle("unlocked", nextUnlocked);
              item.classList.toggle("locked", !nextUnlocked);
              const dot = item.querySelector(".badge-admin-dot");
              if (dot) {
                dot.textContent = nextUnlocked ? "✓" : "🔒";
                dot.className = `badge-admin-dot ${nextUnlocked ? "unlocked" : "locked"}`;
              }

              const nextSet = new Set(achSet);
              if (nextUnlocked) {
                nextSet.add(achId);
              } else {
                nextSet.delete(achId);
              }
              achSet.clear();
              nextSet.forEach((x) => achSet.add(x));

              const curAchCountEl = document.getElementById(
                "profileAchievementsCount",
              );
              const curBadgeSummaryEl = document.getElementById(
                "profileBadgeSummary",
              );
              if (curAchCountEl)
                curAchCountEl.textContent = `${nextSet.size} / ${ACHIEVEMENTS.length}`;
              if (curBadgeSummaryEl)
                curBadgeSummaryEl.textContent = `(${nextSet.size} / ${ACHIEVEMENTS.length})`;

              triggerHaptic("impact");
              if (typeof hangKatt !== "undefined") playSound(hangKatt);
              try {
                await adminForceUpdateUserAchievements(
                  stats.username,
                  Array.from(nextSet),
                  null,
                  true,
                );
              } finally {
                delete item.dataset.busy;
              }
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

      const profileArea = document.querySelector(".profile-content-area");
      if (profileArea && !profileArea._tooltipScrollBound) {
        profileArea._tooltipScrollBound = true;
        profileArea.addEventListener(
          "scroll",
          () => {
            const floatingTip = document.getElementById(
              "profileBadgeFloatingTooltip",
            );
            if (floatingTip) {
              floatingTip.style.display = "none";
              floatingTip.style.opacity = "0";
            }
          },
          { passive: true },
        );
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

    const pwSection = document.getElementById("profileChangePasswordSection");
    if (pwSection) {
      pwSection.style.display = isOwnProfile ? "flex" : "none";
      if (isOwnProfile) {
        const p1 = document.getElementById("newPasswordInput");
        const p2 = document.getElementById("confirmNewPasswordInput");
        const errEl = document.getElementById("changePasswordErrorMsg");
        if (p1) p1.value = "";
        if (p2) p2.value = "";
        if (errEl) errEl.style.display = "none";
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

    const sortSelect = document.getElementById("sortPlayersSelect");
    if (sortSelect && !sortSelect._hasChangeListener) {
      sortSelect._hasChangeListener = true;
      sortSelect.addEventListener("change", () => {
        updatePlayersModalUI();
      });
    }
    const sortMode = sortSelect ? sortSelect.value : "online_first";

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

    // Rendezés a kiválasztott szempont szerint
    filtered.sort((a, b) => {
      const aKey = encodeURIComponent(
        String(a.username || "")
          .trim()
          .toLowerCase(),
      ).replace(/\./g, "%2E");
      const bKey = encodeURIComponent(
        String(b.username || "")
          .trim()
          .toLowerCase(),
      ).replace(/\./g, "%2E");
      const aOnline = presenceData[aKey]?.online === true;
      const bOnline = presenceData[bKey]?.online === true;

      if (sortMode === "online_first") {
        if (aOnline !== bOnline) return bOnline ? 1 : -1;
        return (b.bestScore || 0) - (a.bestScore || 0);
      } else if (sortMode === "offline_first") {
        if (aOnline !== bOnline) return aOnline ? 1 : -1;
        return (b.bestScore || 0) - (a.bestScore || 0);
      } else if (sortMode === "alpha_asc") {
        return String(a.username || "").localeCompare(
          String(b.username || ""),
          "hu",
        );
      } else if (sortMode === "alpha_desc") {
        return String(b.username || "").localeCompare(
          String(a.username || ""),
          "hu",
        );
      } else if (sortMode === "best_score") {
        return (b.bestScore || 0) - (a.bestScore || 0);
      } else if (sortMode === "total_matches") {
        return (b.totalMatches || 0) - (a.totalMatches || 0);
      }
      return (b.bestScore || 0) - (a.bestScore || 0);
    });

    // Online számlálók
    let onlineCount = 0;
    players.forEach((p) => {
      const safeKey = encodeURIComponent(
        String(p.username || "")
          .trim()
          .toLowerCase(),
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
          String(p.username || "")
            .trim()
            .toLowerCase(),
        ).replace(/\./g, "%2E");
        const isOnline = presenceData[safeKey]?.online === true;
        const avObj = avatarsList.find((a) => a.id === p.chosenAvatar) ||
          avatarsList[0] || { symbol: "👤" };
        const titleObj = titlesList.find((t) => t.id === p.chosenTitle);
        const nameColorObj = nameColorCatalog.find(
          (c) => c.id === p.chosenNameColor,
        );

        const nameClass = nameColorObj?.className || "";
        const titleClass = titleObj?.specialClass || "";
        const showTitle = titleObj && titleObj.id !== "title_none";
        const titleText = titleObj?.name || "";
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
            ${showTitle ? `<div class="player-roster-title ${titleClass}">${titleText}</div>` : ""}
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
      if (openAchievementsBtn)
        openAchievementsBtn.style.display = "inline-flex";
      if (myProfileBtn) myProfileBtn.style.display = "inline-flex";
      if (changePwBtn) changePwBtn.style.display = "inline-flex";
      if (logoutBtnEl) logoutBtnEl.style.display = "inline-flex";

      if (nameLabel) {
        nameLabel.textContent = user.displayName;
        const nameColorCatalog =
          typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
        nameColorCatalog.forEach((c) =>
          nameLabel.classList.remove(c.className),
        );
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
        nameColorCatalog.forEach((c) =>
          nameLabel.classList.remove(c.className),
        );
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
          String(elem.duration || "60") ===
          String(currentLeaderboardTimeFilter),
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
          if (
            confirm(
              `Biztosan törölni szeretnéd ezt az eredményt a ranglistáról?\n\nJátékos: ${elem.name}\nPontszám: ${formatScore(elem.score)} p\nKategória: ${elem.color} szín • ${modBadge} • ${durText}`,
            )
          ) {
            if (
              window.leaderboardService &&
              typeof window.leaderboardService.deleteScoreRecord === "function"
            ) {
              await window.leaderboardService.deleteScoreRecord(elem);
            } else {
              let toplista = JSON.parse(localStorage.getItem("toplista")) || [];
              toplista = toplista.filter(
                (s) =>
                  !(
                    s.name === elem.name &&
                    String(s.score) === String(elem.score)
                  ),
              );
              localStorage.setItem("toplista", JSON.stringify(toplista));
            }
            showToast(
              `🗑️ Eredmény törölve és profil statisztikák újraszámolva!`,
              "success",
            );
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

  /* ================================================================
   CRASHDOWN ARCADE - GAME ENGINE, CANVAS & CORE MECHANICS
   ================================================================ */

  const canvas = document.getElementById("crashdownCanvas");
  const pixiRenderer = new PixiBoardRenderer(
    canvas,
    LOGICAL_SIZE,
    sorok,
    oszlopok,
  );
  const ctx = pixiRenderer.ctx2d;
  window.pixiRenderer = pixiRenderer;

  function formatScore(score) {
    if (score === null || score === undefined || score === "") return "0";
    const num =
      typeof score === "number" ? Math.round(score) : parseInt(score, 10);
    if (isNaN(num)) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  window.formatScore = formatScore;

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
  let hoverPreviewText = "";
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
    if (pixiRenderer) {
      pixiRenderer.resize();
    }
  }
  setupHiDPICanvas();
  window.addEventListener("resize", setupHiDPICanvas);

  function createCell(color, offsetY = 0) {
    return {
      color,
      marked: false,
      offsetY,
      velY: 0,
      scale: 1,
    };
  }

  function getSzinek(mennyit) {
    const count = Math.max(
      2,
      Math.min(negyzetSzinek.length, parseInt(mennyit, 10) || 3),
    );
    szinek = negyzetSzinek.slice(0, count);
  }

  // ==================== POWER-UP AKTIVÁLÓK ====================
  function aktivaldPontduplazot(seconds = 5) {
    isDoublePointsActive = true;
    doublePointsRemainingTime = seconds;
    regisztraljPowerupHasznalatot("doubler");

    const banner = document.getElementById("doublePointsBanner");
    const badge = document.getElementById("frenzyTimerBadge");
    const wrapper = document.getElementById("canvasWrapper");

    if (banner) banner.classList.remove("hidden");
    if (wrapper) wrapper.classList.add("frenzy-active");
    if (badge) badge.textContent = `${doublePointsRemainingTime.toFixed(1)}s`;

    playSound(doublerKatt);
    triggerHaptic("heavy");
    checkAchievement("frenzy_master");
    checkAchievement("ach_frenzy_active");

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
    const banner = document.getElementById("doublePointsBanner");
    const wrapper = document.getElementById("canvasWrapper");
    if (banner) banner.classList.add("hidden");
    if (wrapper) wrapper.classList.remove("frenzy-active");
  }

  function aktivaldFagyasztast(seconds = 4) {
    isFrozen = true;
    freezeRemainingTime = seconds;
    regisztraljPowerupHasznalatot("freeze");

    const overlay = document.getElementById("freezeOverlay");
    const badge = document.getElementById("freezeTimerBadge");
    const wrapper = document.getElementById("canvasWrapper");

    if (overlay) overlay.classList.remove("hidden");
    if (wrapper) wrapper.classList.add("freeze-active");
    if (badge) badge.textContent = `${freezeRemainingTime.toFixed(1)}s`;

    playSound(timeEffekt);
    triggerHaptic("heavy");
    checkAchievement("freeze_time");
    checkAchievement("ach_powerup_freeze_first");

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
    const overlay = document.getElementById("freezeOverlay");
    const wrapper = document.getElementById("canvasWrapper");
    if (overlay) overlay.classList.add("hidden");
    if (wrapper) wrapper.classList.remove("freeze-active");
  }

  function pluszIdoPowerUp() {
    regisztraljPowerupHasznalatot();
    remainingTime += 5;
    refreshTimerText();
  }

  function magnesPowerUp() {
    regisztraljPowerupHasznalatot("magnet");
    playSound(doublerKatt);
    triggerHaptic("heavy");
    screenShake = 5;

    const colorCounts = {};
    for (let i = 0; i < sorok; i++) {
      for (let j = 0; j < oszlopok; j++) {
        const c = grid[i]?.[j]?.color;
        if (c && c !== "white" && negyzetSzinek.includes(c)) {
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
        if (!cell || cell.color === "white") continue;
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
          grid[i][j].color = "white";
        }
      }
    }

    gridUjraRendezes();
    checkAchievement("magnet_pull");
    checkAchievement("ach_powerup_magnet_first");

    shockwaves.push({
      x: LOGICAL_SIZE / 2,
      y: LOGICAL_SIZE / 2,
      radius: 15,
      maxRadius: LOGICAL_SIZE * 0.8,
      color: "#ef4444",
      alpha: 1,
    });

    spawnFloatingText(
      LOGICAL_SIZE / 2,
      LOGICAL_SIZE / 2,
      "🧲 MÁGNES VONZÁS!",
      "#f87171",
    );
    setComboStatus(
      `🧲 Szuper Mágnes: ${targetCount} db blokk egy tömbbe rántva!`,
      true,
    );
  }

  function regisztraljKomboLepest() {
    comboStreak++;
    comboMultiplier = Math.min(6, 1 + Math.floor(comboStreak / 2));

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
    const pill = document.getElementById("comboIndicator");
    const wrapper = document.getElementById("canvasWrapper");

    if (pill) {
      pill.classList.remove(
        "combo-x2",
        "combo-x3",
        "combo-x4",
        "combo-x5",
        "combo-x6",
      );
      if (comboMultiplier > 1) {
        pill.classList.add(`combo-x${comboMultiplier}`);
        pill.textContent = `🔥 KOMBÓ ×${comboMultiplier}!`;
      }
    }

    if (wrapper) {
      wrapper.classList.remove(
        "combo-glow-2",
        "combo-glow-3",
        "combo-glow-4",
        "combo-glow-5",
        "combo-glow-6",
      );
      if (comboMultiplier >= 2) {
        const glowLevel = Math.min(6, comboMultiplier);
        wrapper.classList.add(`combo-glow-${glowLevel}`);
      }
    }
  }

  function szamolMaradtBlokk() {
    let count = 0;
    for (let i = 0; i < sorok; i++) {
      for (let j = 0; j < oszlopok; j++) {
        if (grid[i]?.[j] && grid[i][j].color !== "white") {
          count++;
        }
      }
    }
    return count;
  }

  function vanMegLepes() {
    if (!jatekFut || vegeAJateknak) return false;

    const powerUpColors = new Set([
      "cyan",
      "pink",
      "#f97316",
      "darkgreen",
      "#14b8a6",
      "#6366f1",
      "#581845",
      "#0284c7",
      "#e11d48",
    ]);
    let blockCount = 0;

    for (let i = 0; i < sorok; i++) {
      for (let j = 0; j < oszlopok; j++) {
        const cell = grid[i]?.[j];
        if (!cell || cell.color === "white") continue;
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
        if (!col || col === "white") continue;

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
    const modeSelect = document.getElementById("modeSelect");
    const mode = modeSelect ? modeSelect.value : "normal";

    // 1. Nyers mód: egyetlen power-up sem jelenik meg
    if (mode === "no_powerups") {
      return [];
    }

    // 2. Káosz mód: lényegesen gyakoribb power-up spawn (12-14 db a táblán)
    if (mode === "chaos") {
      const chaosPows = [
        "cyan",
        "pink",
        "#f97316",
        "darkgreen",
        "#14b8a6",
        "#6366f1",
        "#e11d48",
        "#f97316",
        "darkgreen",
        "cyan",
        "#0284c7",
        "#581845",
        "#14b8a6",
        "#6366f1",
      ];
      const shuffled = [...chaosPows].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 13);
    }

    // 3. Időhajsza mód: ritkábban jelenjenek meg a powerupok (csakis fagyasztó és 2x, mindössze 1-2 db)
    if (mode === "time_rush") {
      const candidates = ["#0284c7", "cyan"];
      const count = Math.random() < 0.55 ? 1 : 2;
      const res = [];
      for (let i = 0; i < count; i++) {
        res.push(candidates[Math.floor(Math.random() * candidates.length)]);
      }
      return res;
    }

    // 4. Robbanás Mánia: kizárólag TNT spawnoljon, semmilyen más power-up!
    if (mode === "bomb_frenzy") {
      return ["darkgreen", "darkgreen", "darkgreen", "darkgreen", "darkgreen"];
    }

    // 5. Normál mód (Klasszikus kiegyensúlyozott)
    const basePows = [
      "cyan",
      "pink",
      "#f97316",
      "darkgreen",
      "#14b8a6",
      "#6366f1",
      "#0284c7",
      "#e11d48",
    ];
    const shuffled = [...basePows].sort(() => 0.5 - Math.random());
    if (Math.random() < 0.3) {
      shuffled[Math.floor(Math.random() * shuffled.length)] = "#581845";
    }
    return shuffled.slice(0, db);
  }

  function ujPalyaLedobas() {
    if (!jatekFut || vegeAJateknak) return;
    const szinSelect = document.getElementById("colorSelect");
    getSzinek(szinSelect ? szinSelect.value : "3");

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
    shuffledPows.forEach((pow) => placePowerUp(pow));

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
      triggerHaptic("success");
      checkAchievement("perfect_clear");
      checkAchievement("ach_perfect_clear_board");
      checkAchievement("ach_perfect_clear_1");

      let pCount = 1;
      const currentUser = window.authService?.getCurrentUser();
      const username = currentUser?.displayName;
      if (username) {
        try {
          const key = "crashdown_profiles_data";
          const profiles = JSON.parse(localStorage.getItem(key) || "{}");
          if (profiles[username]) {
            profiles[username].totalPerfectClears =
              (profiles[username].totalPerfectClears || 0) + 1;
            pCount = profiles[username].totalPerfectClears;
            localStorage.setItem(key, JSON.stringify(profiles));
          }
        } catch (_) {}
      }
      if (pCount >= 5) checkAchievement("ach_perfect_clear_5");
      if (pCount >= 15) checkAchievement("ach_perfect_clear_15");
      if (pCount >= 25) checkAchievement("ach_perfect_clear_25");
      if (pCount >= 50) checkAchievement("ach_perfect_clear_50");
      if (pCount >= 100) checkAchievement("ach_perfect_clear_100");

      shockwaves.push({
        x: LOGICAL_SIZE / 2,
        y: LOGICAL_SIZE / 2,
        radius: 10,
        maxRadius: LOGICAL_SIZE * 0.8,
        color: "#10b981",
        alpha: 1,
      });
      spawnFloatingText(
        LOGICAL_SIZE / 2,
        LOGICAL_SIZE / 2,
        "PÁLYA KITISZTÍTVA! +500",
        "#10b981",
      );
      setComboStatus("🌟 TÖKÉLETES! Teljes pálya letakarítva! (+500p)", true);

      setTimeout(() => {
        ujPalyaLedobas();
        palyaUjratoltesFolyamatban = false;
      }, 500);
      return;
    }

    if (!vanMegLepes()) {
      palyaUjratoltesFolyamatban = true;
      let bonusz = 50;
      let bonuszSzoveg = "";

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
        color: "#6366f1",
        alpha: 1,
      });

      spawnFloatingText(
        LOGICAL_SIZE / 2,
        LOGICAL_SIZE / 2,
        `+${bonusz} BÓNUSZ!`,
        "#818cf8",
      );
      setComboStatus(bonuszSzoveg, true);

      for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
          if (grid[i]?.[j] && grid[i][j].color !== "white") {
            spawnCellParticles(j, i, grid[i][j].color, 5);
            grid[i][j].color = "white";
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
    const baseColor = style ? style.top : color === "white" ? "#94a3b8" : color;

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
        life: 0.45 + Math.random() * 0.25,
      });
    }
  }

  function spawnFloatingText(col, row, text, color = "#ffffff") {
    const x = Math.min(
      LOGICAL_SIZE - 55,
      Math.max(55, col * negyzetMeret + negyzetMeret / 2),
    );
    const y = Math.max(30, row * negyzetMeret + negyzetMeret / 2);
    floatingTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -55,
      life: 0.85,
    });
  }

  function handleClick(event) {
    if (!jatekFut || vegeAJateknak || kattOffset) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = LOGICAL_SIZE / rect.width;
    const scaleY = LOGICAL_SIZE / rect.height;
    const x = Math.floor(((event.clientX - rect.left) * scaleX) / negyzetMeret);
    const y = Math.floor(((event.clientY - rect.top) * scaleY) / negyzetMeret);

    if (x < 0 || x >= oszlopok || y < 0 || y >= sorok) return;

    const targetColor = grid[y][x].color;
    if (targetColor === "white") return;

    if (hatterZene.paused && !musicMuted && musicVolume > 0) {
      const p = hatterZene.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }

    if (targetColor === "cyan") {
      spawnCellParticles(x, y, "cyan", 16);
      grid[y][x].color = "white";
      grid[y][x].marked = true;
      gridUjraRendezes();
      aktivaldPontduplazot(5);
      spawnFloatingText(x, y, "2× FRENZY (5 mp)!", "#38bdf8");
      setComboStatus(
        "⚡ 2× Pontduplázó: következő 5 mp-ben minden pontod duplázódik!",
        true,
      );
      ellenorizdPalyaAllapot();
    } else if (targetColor === "pink") {
      regisztraljPowerupHasznalatot();
      playSound(sorEffekt);
      for (let j = 0; j < oszlopok; j++) {
        if (grid[y][j].color !== "white") {
          spawnCellParticles(j, y, grid[y][j].color, 5);
        }
        grid[y][j].color = "white";
        grid[y][j].marked = true;
      }
      shockwaves.push({
        x: LOGICAL_SIZE / 2,
        y: y * negyzetMeret + negyzetMeret / 2,
        radius: 10,
        maxRadius: LOGICAL_SIZE * 0.7,
        color: "#f472b6",
        alpha: 0.9,
      });
      const gained = 100 * (isDoublePointsActive ? 2 : 1);
      pontSzam += gained;
      updateScoreUI();
      gridUjraRendezes();
      spawnFloatingText(
        x,
        y,
        isDoublePointsActive
          ? `⇄ CUNAMI +${gained} (2×)`
          : `⇄ CUNAMI +${gained}`,
        "#f472b6",
      );
      setComboStatus(`⇄ Teljes sor eltakarítva! (+${gained}p)`, true);
      ellenorizdPalyaAllapot();
    } else if (targetColor === "#f97316") {
      regisztraljPowerupHasznalatot();
      playSound(sorEffekt);
      for (let i = 0; i < sorok; i++) {
        if (grid[i][x].color !== "white") {
          spawnCellParticles(x, i, grid[i][x].color, 5);
        }
        grid[i][x].color = "white";
        grid[i][x].marked = true;
      }
      shockwaves.push({
        x: x * negyzetMeret + negyzetMeret / 2,
        y: LOGICAL_SIZE / 2,
        radius: 10,
        maxRadius: LOGICAL_SIZE * 0.7,
        color: "#f97316",
        alpha: 0.95,
      });
      const gained = 100 * (isDoublePointsActive ? 2 : 1);
      pontSzam += gained;
      updateScoreUI();
      gridUjraRendezes();
      spawnFloatingText(
        x,
        y,
        isDoublePointsActive
          ? `⇅ OSZLOP +${gained} (2×)`
          : `⇅ OSZLOP +${gained}`,
        "#f97316",
      );
      setComboStatus(`⇅ Teljes oszlop kilőve! (+${gained}p)`, true);
      ellenorizdPalyaAllapot();
    } else if (targetColor === "darkgreen") {
      regisztraljPowerupHasznalatot("tnt");
      playSound(tntKatt);
      triggerHaptic("heavy");
      checkAchievement("tnt_boom");
      checkAchievement("ach_powerup_tnt_first");
      robbantasPowerUp(x, y);
      screenShake = 8;
      shockwaves.push({
        x: x * negyzetMeret + negyzetMeret / 2,
        y: y * negyzetMeret + negyzetMeret / 2,
        radius: 8,
        maxRadius: negyzetMeret * 2.5,
        color: "#4ade80",
        alpha: 0.95,
      });
      const gained = 90 * (isDoublePointsActive ? 2 : 1);
      pontSzam += gained;
      updateScoreUI();
      spawnFloatingText(
        x,
        y,
        isDoublePointsActive
          ? `TNT BUMM +${gained} (2×)`
          : `TNT BUMM +${gained}`,
        "#4ade80",
      );
      setComboStatus(`💥 3×3-as TNT robbanás! (+${gained}p)`, true);
      ellenorizdPalyaAllapot();
    } else if (targetColor === "#14b8a6") {
      regisztraljPowerupHasznalatot("colorbomb");
      playSound(tntKatt);
      triggerHaptic("medium");
      const activeColors = [];
      for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
          const col = grid[i][j].color;
          if (col !== "white" && negyzetSzinek.includes(col)) {
            activeColors.push(col);
          }
        }
      }
      const wipedColor =
        activeColors.length > 0
          ? activeColors[Math.floor(Math.random() * activeColors.length)]
          : null;
      let wipedCount = 0;
      if (wipedColor) {
        for (let i = 0; i < sorok; i++) {
          for (let j = 0; j < oszlopok; j++) {
            if (grid[i][j].color === wipedColor) {
              spawnCellParticles(j, i, wipedColor, 6);
              grid[i][j].color = "white";
              grid[i][j].marked = true;
              wipedCount++;
            }
          }
        }
      }
      grid[y][x].color = "white";
      grid[y][x].marked = true;
      screenShake = 6;
      shockwaves.push({
        x: x * negyzetMeret + negyzetMeret / 2,
        y: y * negyzetMeret + negyzetMeret / 2,
        radius: 12,
        maxRadius: LOGICAL_SIZE * 0.6,
        color: "#14b8a6",
        alpha: 0.95,
      });
      const baseEarned = Math.max(50, wipedCount * 15);
      const earned = baseEarned * (isDoublePointsActive ? 2 : 1);
      pontSzam += earned;
      checkAchievement("color_bomb");
      checkAchievement("ach_powerup_colorbomb_first");
      updateScoreUI();
      gridUjraRendezes();
      spawnFloatingText(
        x,
        y,
        isDoublePointsActive ? `✦ BOMB +${earned} (2×)` : `✦ BOMB +${earned}`,
        "#14b8a6",
      );
      setComboStatus(
        `✦ Szín-bomba: ${wipedCount} blokk megsemmisítve! (+${earned}p)`,
        true,
      );
      ellenorizdPalyaAllapot();
    } else if (targetColor === "#6366f1") {
      regisztraljPowerupHasznalatot();
      playSound(doublerKatt);
      triggerHaptic("medium");
      grid[y][x].color = "white";
      grid[y][x].marked = true;
      spawnCellParticles(x, y, "#818cf8", 12);

      const powerUpColors = new Set([
        "cyan",
        "pink",
        "#f97316",
        "darkgreen",
        "#14b8a6",
        "#6366f1",
        "#581845",
        "#0284c7",
        "#e11d48",
      ]);
      const positions = [];
      const colors = [];
      for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
          if (i === y && j === x) continue;
          const col = grid[i][j].color;
          if (col !== "white" && !powerUpColors.has(col)) {
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
      shockwaves.push({
        x: x * negyzetMeret + negyzetMeret / 2,
        y: y * negyzetMeret + negyzetMeret / 2,
        radius: 10,
        maxRadius: LOGICAL_SIZE * 0.5,
        color: "#818cf8",
        alpha: 0.9,
      });
      const gained = 50 * (isDoublePointsActive ? 2 : 1);
      pontSzam += gained;
      checkAchievement("shuffle_master");
      checkAchievement("ach_shuffle_board");
      updateScoreUI();
      gridUjraRendezes();
      spawnFloatingText(
        x,
        y,
        isDoublePointsActive
          ? `⟳ KEVERÉS +${gained} (2×)`
          : `⟳ KEVERÉS +${gained}`,
        "#818cf8",
      );
      setComboStatus(`⟳ Pálya újrakeverve! (+${gained}p)`, true);
      ellenorizdPalyaAllapot();
    } else if (targetColor === "#581845") {
      spawnCellParticles(x, y, "#581845", 14);
      grid[y][x].color = "white";
      grid[y][x].marked = true;
      playSound(timeEffekt);
      triggerHaptic("medium");
      gridUjraRendezes();
      pluszIdoPowerUp();
      checkAchievement("time_bonus");
      checkAchievement("ach_time_bonus_catch");
      spawnFloatingText(x, y, "+5 MP!", "#c084fc");
      setComboStatus("⌛ +5 másodperc extra idő!", true);
      ellenorizdPalyaAllapot();
    } else if (targetColor === "#0284c7") {
      spawnCellParticles(x, y, "#0284c7", 16);
      grid[y][x].color = "white";
      grid[y][x].marked = true;
      gridUjraRendezes();
      aktivaldFagyasztast(4);
      spawnFloatingText(x, y, "❄ IDŐ MEGÁLLÍTVA!", "#7dd3fc");
      setComboStatus("❄ Időfagyasztó: 4 másodpercig nem telik az idő!", true);
      ellenorizdPalyaAllapot();
    } else if (targetColor === "#e11d48") {
      spawnCellParticles(x, y, "#e11d48", 16);
      grid[y][x].color = "white";
      grid[y][x].marked = true;
      magnesPowerUp();
      ellenorizdPalyaAllapot();
    } else {
      const torlendoNegyzetek = getTorlendoNegyzetek(x, y, targetColor);
      if (torlendoNegyzetek.length >= 3) {
        playSound(sikeresKatt);
        triggerHaptic("light");
        checkAchievement("first_match");
        checkAchievement("ach_first_click");
        const count = torlendoNegyzetek.length;
        if (count >= 4) checkAchievement("ach_clear_blocks_4");
        if (count >= 6) checkAchievement("ach_clear_blocks_6");
        if (count >= 8) {
          checkAchievement("mega_clear");
          checkAchievement("ach_mega_clear_8");
          checkAchievement("ach_clear_blocks_8");
        }
        if (count >= 10) checkAchievement("ach_clear_blocks_10");
        if (count >= 12) {
          checkAchievement("hyper_clear");
          checkAchievement("ach_hyper_clear_12");
          checkAchievement("ach_clear_blocks_12");
        }
        if (count >= 14) checkAchievement("ach_clear_blocks_14");
        if (count >= 16) {
          checkAchievement("massive_clear_16");
          checkAchievement("ach_massive_clear_16");
          checkAchievement("ach_clear_blocks_16");
        }
        if (count >= 18) checkAchievement("ach_clear_blocks_18");
        if (count >= 20) {
          checkAchievement("ach_massive_clear_20");
          checkAchievement("ach_clear_blocks_20");
        }
        if (count >= 24) checkAchievement("ach_clear_blocks_24");
        if (count >= 28) checkAchievement("ach_clear_blocks_28");
        if (count >= 32) checkAchievement("ach_clear_blocks_32");
        if (count >= 36) checkAchievement("ach_clear_blocks_36");
        if (count >= 40) checkAchievement("ach_clear_blocks_40");

        recentSuccessfulClicks.push(Date.now());
        recentSuccessfulClicks = recentSuccessfulClicks.filter(
          (t) => Date.now() - t <= 10000,
        );
        const rCount = recentSuccessfulClicks.length;
        if (rCount >= 8) {
          checkAchievement("speed_demon");
          checkAchievement("ach_speed_demon_8");
        }
        if (rCount >= 12) checkAchievement("ach_speed_demon_12");
        if (rCount >= 16) checkAchievement("ach_speed_demon_16");
        if (rCount >= 24) checkAchievement("ach_speed_demon_24");
        if (rCount >= 32) checkAchievement("ach_speed_demon_32");
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
        const textCol = isDoublePointsActive
          ? "#38bdf8"
          : style
            ? style.top
            : "#fff";
        let comboSuffix = "";
        if (frenzyMultiplier > 1 && mult > 1) {
          comboSuffix = ` (2× • ×${mult})`;
        } else if (frenzyMultiplier > 1) {
          comboSuffix = " (2×)";
        } else if (mult > 1) {
          comboSuffix = ` (×${mult})`;
        }

        spawnFloatingText(x, y, `+${gained}${comboSuffix}`, textCol);
        if (torlendoNegyzetek.length >= 7) {
          setComboStatus(
            `🔥 Óriási kombó! ${torlendoNegyzetek.length} blokk (+${gained}p)`,
            true,
          );
        } else {
          setComboStatus(
            `${torlendoNegyzetek.length} blokk törölve (+${gained}p)`,
            false,
          );
        }
        ellenorizdPalyaAllapot();
      } else {
        grid[y][x].scale = 0.86;
        setComboStatus("Legalább 3 azonos színű blokk kell!", false);
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
        if (grid[i][j].color !== "white") {
          spawnCellParticles(j, i, grid[i][j].color, 6);
        }
        grid[i][j].color = "white";
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
        cx < 0 ||
        cx >= oszlopok ||
        cy < 0 ||
        cy >= sorok ||
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
          grid[i][j].color = "white";
          grid[i][j].marked = false;
          grid[i][j].offsetY = 0;
          grid[i][j].velY = 0;
        }
      }

      let writeRow = sorok - 1;
      for (let readRow = sorok - 1; readRow >= 0; readRow--) {
        if (grid[readRow][j].color !== "white") {
          if (writeRow !== readRow) {
            const fallDistancePx = (writeRow - readRow) * negyzetMeret;
            const prevOffset = grid[readRow][j].offsetY || 0;
            grid[writeRow][j] = {
              color: grid[readRow][j].color,
              marked: false,
              offsetY: prevOffset - fallDistancePx,
              velY: grid[readRow][j].velY || 0,
              scale: 1,
            };
            grid[readRow][j] = createCell("white", 0);
          }
          writeRow--;
        }
      }
    }
  }

  function updateHoverPreview() {
    hoverHighlightSet.clear();
    hoverPreviewText = "";

    if (!jatekFut || vegeAJateknak || !hoverCell) return;
    const { x, y } = hoverCell;
    if (
      x < 0 ||
      x >= oszlopok ||
      y < 0 ||
      y >= sorok ||
      !grid[y] ||
      !grid[y][x]
    )
      return;

    const c = grid[y][x].color;
    if (c === "white") return;

    if (c === "cyan") {
      hoverHighlightSet.add(`${x}:${y}`);
      hoverPreviewText = "2× Duplázó";
    } else if (c === "pink") {
      for (let j = 0; j < oszlopok; j++) hoverHighlightSet.add(`${j}:${y}`);
      hoverPreviewText = "Sor törlés (+100)";
    } else if (c === "#f97316") {
      for (let i = 0; i < sorok; i++) hoverHighlightSet.add(`${x}:${i}`);
      hoverPreviewText = "Oszlop törlés (+100)";
    } else if (c === "darkgreen") {
      for (let i = Math.max(0, y - 1); i <= Math.min(sorok - 1, y + 1); i++) {
        for (
          let j = Math.max(0, x - 1);
          j <= Math.min(oszlopok - 1, x + 1);
          j++
        ) {
          hoverHighlightSet.add(`${j}:${i}`);
        }
      }
      hoverPreviewText = "TNT robbanás (+90)";
    } else if (c === "#14b8a6") {
      hoverHighlightSet.add(`${x}:${y}`);
      hoverPreviewText = "Szín-bomba (teljes szín)";
    } else if (c === "#6366f1") {
      hoverHighlightSet.add(`${x}:${y}`);
      hoverPreviewText = "Pálya keverés (+50)";
    } else if (c === "#581845") {
      hoverHighlightSet.add(`${x}:${y}`);
      hoverPreviewText = "+5 mp extra idő";
    } else if (c === "#0284c7") {
      hoverHighlightSet.add(`${x}:${y}`);
      hoverPreviewText = "Időfagyasztó (4 mp)";
    } else if (c === "#e11d48") {
      hoverHighlightSet.add(`${x}:${y}`);
      hoverPreviewText = "Szuper Mágnes (szín vonzás)";
    } else {
      const group = getTorlendoNegyzetek(x, y, c);
      if (group.length >= 3) {
        group.forEach((pos) => hoverHighlightSet.add(`${pos.x}:${pos.y}`));
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
    if (pixiRenderer && pixiRenderer.usePixiWebGL) {
      pixiRenderer.render({
        grid,
        screenShake,
        isDoublePointsActive,
        isFrozen,
        comboMultiplier,
        hoverHighlightSet,
        colorStyles: COLOR_STYLES,
        shockwaves,
        particles,
        hoverCell,
        hoverPreviewText,
        floatingTexts,
      });
      return;
    }
    if (!ctx) return;
    ctx.save();

    if (screenShake > 0.2) {
      const dx = (Math.random() - 0.5) * screenShake;
      const dy = (Math.random() - 0.5) * screenShake;
      ctx.translate(dx, dy);
    }

    // Dinamikus háttér és slot szín számítás: fagyasztás, 2x frenzy és kombó fúzió
    let bgFill = "#0d1017";
    let slotFill = "#151a24";

    const has2x = isDoublePointsActive;
    const hasFreeze = isFrozen;
    const cMult = Math.min(6, Math.max(1, comboMultiplier || 1));

    if (hasFreeze && has2x) {
      // Mindkettő aktív egyszerre: elektromos jeges szuperállapot
      if (cMult <= 1) {
        bgFill = "#071f38";
        slotFill = "#0e3e68";
      } else if (cMult <= 3) {
        bgFill = "#0a1d3c";
        slotFill = "#14386e";
      } else if (cMult <= 5) {
        bgFill = "#141843";
        slotFill = "#262875";
      } else {
        bgFill = "#1d1248";
        slotFill = "#371c82";
      }
    } else if (hasFreeze) {
      // Csak fagyasztás aktív: hideg jégkék, amibe a kombó belekeveri a tüzét (Frostfire)
      if (cMult <= 1) {
        bgFill = "#062033";
        slotFill = "#0c3d5c";
      } else if (cMult === 2) {
        bgFill = "#081e35";
        slotFill = "#0e3a60";
      } else if (cMult === 3) {
        bgFill = "#0b1d38";
        slotFill = "#143864";
      } else if (cMult === 4) {
        bgFill = "#111b3d";
        slotFill = "#1f3069";
      } else if (cMult === 5) {
        bgFill = "#17163f";
        slotFill = "#29256d";
      } else {
        bgFill = "#1a1244";
        slotFill = "#311f75";
      }
    } else if (has2x) {
      // Csak 2x szorzó aktív: villanykék, amibe a kombó belekeveri a plazmát
      if (cMult <= 1) {
        bgFill = "#071d2e";
        slotFill = "#0c3554";
      } else if (cMult === 2) {
        bgFill = "#091b32";
        slotFill = "#103359";
      } else if (cMult === 3) {
        bgFill = "#0c1a36";
        slotFill = "#173060";
      } else if (cMult === 4) {
        bgFill = "#121739";
        slotFill = "#222864";
      } else if (cMult === 5) {
        bgFill = "#18143d";
        slotFill = "#2c1e69";
      } else {
        bgFill = "#1d1042";
        slotFill = "#351873";
      }
    } else if (cMult > 1) {
      // Csak kombó izzik
      if (cMult === 2) {
        bgFill = "#141216";
        slotFill = "#201a24";
      } else if (cMult === 3) {
        bgFill = "#171114";
        slotFill = "#27171d";
      } else if (cMult === 4) {
        bgFill = "#1c0e12";
        slotFill = "#30131b";
      } else if (cMult === 5) {
        bgFill = "#200b1a";
        slotFill = "#38112e";
      } else {
        bgFill = "#1a0928";
        slotFill = "#301048";
      }
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
        if (!elem || elem.color === "white") continue;

        const isHighlighted = hoverHighlightSet.has(`${j}:${i}`);
        const pad = isHighlighted ? 2 : 3.5;
        const size = (negyzetMeret - pad * 2) * (elem.scale || 1);
        const x = j * negyzetMeret + (negyzetMeret - size) / 2;
        const y =
          i * negyzetMeret + (negyzetMeret - size) / 2 + (elem.offsetY || 0);

        const style = COLOR_STYLES[elem.color] || {
          top: elem.color,
          bottom: elem.color,
          border: "#ffffff",
        };

        ctx.save();

        const grad = ctx.createLinearGradient(x, y, x, y + size);
        grad.addColorStop(0, style.top);
        grad.addColorStop(1, style.bottom);

        ctx.fillStyle = grad;
        drawRoundedRect(x, y, size, size, 7);
        ctx.fill();

        // 3D élfény
        ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + 5, y + size - 3);
        ctx.lineTo(x + 5, y + 4);
        ctx.quadraticCurveTo(x + 4, y + 2, x + 7, y + 2);
        ctx.lineTo(x + size - 5, y + 2);
        ctx.stroke();

        // Árnyék
        ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + size - 2, y + 5);
        ctx.lineTo(x + size - 2, y + size - 5);
        ctx.quadraticCurveTo(
          x + size - 2,
          y + size - 2,
          x + size - 5,
          y + size - 2,
        );
        ctx.lineTo(x + 5, y + size - 2);
        ctx.stroke();

        if (isHighlighted) {
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = "#ffffff";
          drawRoundedRect(x, y, size, size, 7);
          ctx.stroke();
        } else {
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
          drawRoundedRect(x, y, size, size, 7);
          ctx.stroke();
        }

        if (style.label) {
          ctx.save();
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetY = 1;

          if (style.label === "2×") {
            ctx.font = '800 16px "JetBrains Mono", monospace';
            ctx.fillText("2×", x + size / 2, y + size / 2 + 1);
          } else if (style.label === "⇄") {
            ctx.font = "800 20px system-ui, sans-serif";
            ctx.fillText("⇄", x + size / 2, y + size / 2);
          } else if (style.label === "⇅") {
            ctx.font = "800 20px system-ui, sans-serif";
            ctx.fillText("⇅", x + size / 2, y + size / 2);
          } else if (style.label === "TNT") {
            ctx.font = '900 13px "JetBrains Mono", monospace';
            ctx.fillText("TNT", x + size / 2, y + size / 2 + 1);
          } else if (style.label === "✦") {
            ctx.font = "800 19px system-ui, sans-serif";
            ctx.fillText("✦", x + size / 2, y + size / 2);
          } else if (style.label === "⟳") {
            ctx.font = "800 20px system-ui, sans-serif";
            ctx.fillText("⟳", x + size / 2, y + size / 2);
          } else if (style.label === "+5s") {
            ctx.font = '800 12px "JetBrains Mono", monospace';
            ctx.fillText("+5s", x + size / 2, y + size / 2 + 1);
          } else if (style.label === "❄") {
            ctx.font = "800 20px system-ui, sans-serif";
            ctx.fillText("❄", x + size / 2, y + size / 2);
          } else if (style.label === "🧲") {
            ctx.font = "800 18px system-ui, sans-serif";
            ctx.fillText("🧲", x + size / 2, y + size / 2);
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
      const hx = Math.min(
        LOGICAL_SIZE - 42,
        Math.max(42, hoverCell.x * negyzetMeret + negyzetMeret / 2),
      );
      const hy = Math.max(22, hoverCell.y * negyzetMeret - 6);
      ctx.save();
      ctx.font = '700 11px "Outfit", system-ui, sans-serif';
      const textWidth = ctx.measureText(hoverPreviewText).width + 16;
      ctx.fillStyle = "#181d2a";
      drawRoundedRect(hx - textWidth / 2, hy - 11, textWidth, 22, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(hoverPreviewText, hx, hy);
      ctx.restore();
    }

    for (let i = 0; i < floatingTexts.length; i++) {
      const ft = floatingTexts[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = '800 16px "Outfit", system-ui, sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
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

    const isAnyModalOpen = !!document.querySelector(
      ".modal-backdrop:not(.hidden)",
    );
    const isOverlayVisible = !document
      .getElementById("canvasOverlay")
      ?.classList.contains("hidden");
    const hasActiveFx =
      (particles && particles.length > 0) ||
      (floatingTexts && floatingTexts.length > 0) ||
      (shockwaves && shockwaves.length > 0) ||
      screenShake > 0.1 ||
      isShufflingBoard;

    if ((isAnyModalOpen || (isOverlayVisible && !jatekFut)) && !hasActiveFx) {
      requestAnimationFrame(animationLoop);
      return;
    }

    if (displayedScore !== pontSzam) {
      const diff = pontSzam - displayedScore;
      const step = Math.ceil(Math.abs(diff) * 0.25);
      displayedScore += Math.sign(diff) * step;
      const scoreEl = document.getElementById("score");
      if (scoreEl) scoreEl.textContent = formatScore(displayedScore);
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
    getSzinek(document.getElementById("colorSelect")?.value || "3");
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
    const overlay = document.getElementById("canvasOverlay");
    if (overlay) overlay.classList.add("hidden");

    kattOffset = false;
    jatekFut = true;
    vegeAJateknak = false;
    grid = [];
    pontSzam = 0;
    particles = [];
    floatingTexts = [];
    shockwaves = [];
    updateScoreUI(true);
    setComboStatus("Keresd a 3+ azonos színű blokkot!", false);

    getSzinek(document.getElementById("colorSelect")?.value || "3");

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
    shuffledPows.forEach((pow) => placePowerUp(pow));

    deaktivaldPontduplazot();
    deaktivaldFagyasztast();
    canvas.style.cursor = "pointer";

    if (shuffleCooldownInterval) {
      clearInterval(shuffleCooldownInterval);
      shuffleCooldownInterval = null;
    }
    shuffleCooldownRemaining = 0;
    updateShuffleButtonUI();

    if (!musicMuted && musicVolume > 0) {
      const p = hatterZene.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }

    drawGrid();
  }

  function refreshTimerText() {
    const idozito = document.getElementById("timerDisplay");
    const progressBar = document.getElementById("timerProgressBar");
    if (!idozito) return;

    const safeTime = Math.max(0, remainingTime);
    const min = Math.floor(safeTime / 60);
    const sec = safeTime % 60;
    idozito.textContent = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;

    idozito.classList.remove("timer-warning", "timer-danger");
    if (safeTime <= 10) {
      idozito.classList.add("timer-danger");
    } else if (safeTime <= 20) {
      idozito.classList.add("timer-warning");
    }

    if (progressBar) {
      const pct = Math.max(0, Math.min(100, (safeTime / MAX_TIME) * 100));
      progressBar.style.width = `${pct}%`;
      if (safeTime <= 10) {
        progressBar.style.background =
          "linear-gradient(90deg, #e11d48, #fb7185)";
      } else if (safeTime <= 20) {
        progressBar.style.background =
          "linear-gradient(90deg, #d97706, #fbbf24)";
      } else {
        progressBar.style.background =
          "linear-gradient(90deg, #10b981, #34d399)";
      }
    }
  }

  function timer() {
    const lejartAzIdo = document.getElementById("timeUpMessage");
    const szinValaszto = document.getElementById("colorSelect");
    const timeSelectEl = document.getElementById("timeSelect");

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
        hoverPreviewText = "";

        canvas.style.cursor = "not-allowed";
        if (lejartAzIdo) lejartAzIdo.style.display = "block";

        const currentUser = window.authService?.getCurrentUser();
        const overlay = document.getElementById("canvasOverlay");
        const overlayTitle = document.getElementById("overlayTitle");
        const overlaySubtitle = document.getElementById("overlaySubtitle");
        const overlayBtn = document.getElementById("overlayStartBtn");

        if (overlay) {
          overlay.classList.remove("hidden");
          if (overlayTitle)
            overlayTitle.textContent = `Végső pontszám: ${formatScore(pontSzam)} p`;
          const btnText = document.getElementById("overlayStartBtnText");
          if (btnText) btnText.textContent = "Új játék indítása";
          const timeUpMsg = document.getElementById("timeUpMessage");
          if (timeUpMsg) timeUpMsg.style.display = "block";
          const overlaySettingsBox =
            document.getElementById("overlaySettingsBox");
          if (overlaySettingsBox) overlaySettingsBox.style.display = "none";

          const overlaySaveBtn = document.getElementById("overlaySaveScoreBtn");
          const modeSelectEl = document.getElementById("modeSelect");
          const modVal = modeSelectEl ? modeSelectEl.value : "normal";
          const colorVal = szinValaszto ? szinValaszto.value : "3";

          // Pont alapú mérföldkövek ellenőrzése a meccs végén minden játékmódban
          if (typeof checkScoreAchievements === "function") {
            checkScoreAchievements(pontSzam, colorVal, modVal, MAX_TIME);
          }

          if (currentUser) {
            if (overlaySaveBtn) overlaySaveBtn.style.display = "none";
            const colorVal = szinValaszto ? szinValaszto.value : "3";
            updatePlayerStatsRecord(
              currentUser.displayName,
              pontSzam,
              colorVal,
              MAX_TIME,
              modVal,
            );

            toplistaHozzaadas({
              name: currentUser.displayName,
              score: pontSzam,
              color: colorVal,
              modifier: modVal,
              duration: MAX_TIME,
              timestamp: new Date().toISOString(),
            })
              .then((res) => {
                toplistaMegjelenites();
                if (res && res.isRecord) {
                  if (overlaySubtitle) {
                    overlaySubtitle.textContent = `Gratulálunk, ${currentUser.displayName}! Új egyéni rekordot értél el ebben a módban (${colorVal} szín, ${GAME_MODIFIERS[modVal]?.name || modVal})!`;
                  }
                  showToast(
                    `🏆 Új személyes rekord rögzítve: ${formatScore(pontSzam)} pont!`,
                    "success",
                  );
                  playSound(sikeresKatt);
                  triggerHaptic("success");
                } else {
                  if (overlaySubtitle) {
                    overlaySubtitle.textContent = `Szép menet, ${currentUser.displayName}! A jelenlegi rekordod ebben a kategóriában: ${res?.previousBest ? formatScore(res.previousBest) : "magasabb"} pont.`;
                  }
                  showToast(
                    `Játék vége! Pontszám: ${formatScore(pontSzam)} p`,
                    "info",
                  );
                }
              })
              .catch(() => {
                toplistaMegjelenites();
              });
          } else {
            const colorVal = szinValaszto ? szinValaszto.value : "3";
            pendingScore = {
              score: pontSzam,
              color: colorVal,
              modifier: modVal,
              duration: MAX_TIME,
              timestamp: new Date().toISOString(),
            };
            if (overlaySaveBtn) overlaySaveBtn.style.display = "inline-flex";
            if (overlaySubtitle) {
              overlaySubtitle.textContent = `Elért pontszám: ${formatScore(pontSzam)} pont (${GAME_MODIFIERS[modVal]?.name || modVal}). Jelentkezz be vagy regisztrálj az eredmény elmentéséhez!`;
            }
            showToast(
              `Játék vége! Pontszám: ${formatScore(pontSzam)} p`,
              "info",
            );
          }

          if (overlayBtn) {
            overlayBtn.innerHTML =
              '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg><span>Új játék kezdése</span>';
          }
        }

        if (szinValaszto) szinValaszto.disabled = false;
        if (timeSelectEl) timeSelectEl.disabled = false;
        const modeSelectEl = document.getElementById("modeSelect");
        if (modeSelectEl) modeSelectEl.disabled = false;
        const startBtn = document.getElementById("startGameButton");
        if (startBtn) startBtn.disabled = false;

        updateScoreUI(true);
        setComboStatus("Lejárt az idő!", false);
      }
    }, 1000);
  }

  function startMatch() {
    switchToMobileTab("stagePanel", true);
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

    const startBtn = document.getElementById("startGameButton");
    if (startBtn) startBtn.disabled = true;
    const modeSelectEl = document.getElementById("modeSelect");
    if (modeSelectEl) modeSelectEl.disabled = true;

    const overlay = document.getElementById("canvasOverlay");
    if (overlay) overlay.classList.add("hidden");
  }

  function ujJatekInditasaFunc() {
    switchToMobileTab("stagePanel", true);
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
    hoverPreviewText = "";
    particles = [];
    floatingTexts = [];
    shockwaves = [];

    pontSzam = 0;
    updateScoreUI(true);

    remainingTime = MAX_TIME;
    refreshTimerText();

    const szinValaszto = document.getElementById("colorSelect");
    if (szinValaszto) szinValaszto.disabled = false;
    const timeSelectEl = document.getElementById("timeSelect");
    if (timeSelectEl) timeSelectEl.disabled = false;
    const modeSelectEl2 = document.getElementById("modeSelect");
    if (modeSelectEl2) modeSelectEl2.disabled = false;
    const startBtn = document.getElementById("startGameButton");
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

    const overlay = document.getElementById("canvasOverlay");
    const overlayTitle = document.getElementById("overlayTitle");
    const overlaySubtitle = document.getElementById("overlaySubtitle");
    const overlayBtn = document.getElementById("overlayStartBtn");
    const overlaySaveBtn = document.getElementById("overlaySaveScoreBtn");
    const timeUpMsg = document.getElementById("timeUpMessage");
    const overlaySettingsBox = document.getElementById("overlaySettingsBox");

    // Játék indítás előtt mindig megjelenik az indító overlay a kiválasztott beállításokkal!
    if (overlay) overlay.classList.remove("hidden");
    if (overlayTitle) overlayTitle.textContent = "Crashdown Arcade";
    if (overlaySubtitle)
      overlaySubtitle.textContent =
        "Kattints vagy érints legalább 3 azonos színű szomszédos blokkot a törléshez!";
    if (overlaySaveBtn) overlaySaveBtn.style.display = "none";
    if (timeUpMsg) timeUpMsg.style.display = "none";
    if (overlaySettingsBox) overlaySettingsBox.style.display = "flex";
    if (overlayBtn) {
      overlayBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg><span id="overlayStartBtnText">Játék indítása</span>';
    }
    updateCanvasOverlaySettings();

    setComboStatus("Készen állsz?", false);
    showToast(
      "Alaphelyzet: válassz nehézséget, módot és játékidőt, majd indítsd a játékot!",
      "info",
    );
  }

  // ==================== PÁLYA ÚJRAKEVERÉS (SHUFFLE) ====================
  function updateShuffleButtonUI() {
    const btn = document.getElementById("shuffleButton");
    const badge = document.getElementById("shuffleCooldownBadge");
    if (!btn || !badge) return;

    if (!jatekFut || vegeAJateknak) {
      btn.disabled = true;
      badge.textContent = "Kész";
      return;
    }

    if (shuffleCooldownRemaining > 0) {
      btn.disabled = true;
      badge.textContent = `${shuffleCooldownRemaining}s`;
    } else {
      btn.disabled = false;
      badge.textContent = "Kész";
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
    if (
      !jatekFut ||
      vegeAJateknak ||
      isShufflingBoard ||
      shuffleCooldownRemaining > 0
    )
      return;

    startShuffleCooldown();
    regisztraljPowerupHasznalatot();

    const btn = document.getElementById("shuffleButton");
    if (btn) {
      btn.classList.add("is-spinning");
      setTimeout(() => btn.classList.remove("is-spinning"), 700);
    }

    isShufflingBoard = true;
    playSound(doublerKatt);
    screenShake = 3;

    shockwaves.push({
      x: LOGICAL_SIZE / 2,
      y: LOGICAL_SIZE / 2,
      radius: 12,
      maxRadius: LOGICAL_SIZE * 0.72,
      color: "#818cf8",
      alpha: 1,
    });

    const positions = [];
    const colors = [];
    for (let i = 0; i < sorok; i++) {
      for (let j = 0; j < oszlopok; j++) {
        const col = grid[i]?.[j]?.color;
        if (col && col !== "white") {
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

    spawnFloatingText(
      LOGICAL_SIZE / 2,
      LOGICAL_SIZE / 2,
      "⟳ PÁLYA ÚJRAKEVERVE!",
      "#818cf8",
    );
    setComboStatus("⟳ Pálya újrakeverve! Keresd az új kombinációkat!", true);
    checkAchievement("shuffle_master");
    checkAchievement("ach_shuffle_board");

    setTimeout(() => {
      isShufflingBoard = false;
      updateHoverPreview();
      ellenorizdPalyaAllapot();
    }, 450);
  }

  // Canvas egér és kattintás események
  canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = LOGICAL_SIZE / rect.width;
    const scaleY = LOGICAL_SIZE / rect.height;
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / negyzetMeret);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / negyzetMeret);

    if (!hoverCell || hoverCell.x !== x || hoverCell.y !== y) {
      hoverCell = { x, y };
      updateHoverPreview();
    }
  });

  canvas.addEventListener("mouseleave", function () {
    hoverCell = null;
    hoverHighlightSet.clear();
    hoverPreviewText = "";
  });

  canvas.addEventListener("click", handleClick);

  // A játékot kizárólag a gombokra kattintva lehessen elindítani (az overlay háttérre kattintva ne)
  // A startMatch eseménykezelő az #overlayStartBtn és #startGameButton gombokra van kötve.

  // Játék beállítások összefoglalójának frissítése a canvas overlayen
  function updateCanvasOverlaySettings() {
    const overlayModeBadge = document.getElementById("overlayModeBadge");
    const overlayTimeChip = document.getElementById("overlayTimeChip");
    const overlayColorChip = document.getElementById("overlayColorChip");
    const overlayModeDesc = document.getElementById("overlayModeDesc");

    const modeSelectEl = document.getElementById("modeSelect");
    const timeSelectEl = document.getElementById("timeSelect");
    const colorSelectEl = document.getElementById("colorSelect");

    const modeVal = modeSelectEl ? modeSelectEl.value : "normal";
    const timeVal = timeSelectEl ? timeSelectEl.value : "60";
    const colorVal = colorSelectEl ? colorSelectEl.value : "3";

    const modeInfoMap = {
      normal: {
        badge: "🎯 Normál",
        desc: "Kiegyensúlyozott játékmenet minden elérhető power-uppal.",
      },
      time_rush: {
        badge: "⏳ Időhajsza",
        desc: "Gyors tempó! Csakis időfagyasztó és 2× pontduplázó power-upok ritkított eséllyel.",
      },
      bomb_frenzy: {
        badge: "💣 Robbanás Mánia",
        desc: "Láncreakciók és pusztítás! Kizárólag TNT robbanó blokkok bukkannak fel.",
      },
      chaos: {
        badge: "🌀 Káosz Mód",
        desc: "Maximális intenzitás! Gyakori power-up zápor és villámgyors tempó.",
      },
      no_powerups: {
        badge: "🧱 Nyers Mód",
        desc: "Színtiszta blokktörő kihívás, semmilyen power-up nem jelenik meg.",
      },
    };

    const timeTextMap = {
      30: "⏱️ 30 mp (Villám)",
      60: "⏱️ 1 perc (Gyors)",
      90: "⏱️ 90 mp (Klasszikus)",
      180: "⏱️ 3 perc (Maraton)",
    };

    const colorTextMap = {
      2: "🎨 2 szín (Könnyű)",
      3: "🎨 3 szín (Normál)",
      4: "🎨 4 szín (Nehéz)",
      5: "🎨 5 szín (Mester)",
    };

    const curMode = modeInfoMap[modeVal] || modeInfoMap["normal"];
    if (overlayModeBadge) overlayModeBadge.textContent = curMode.badge;
    if (overlayModeDesc) overlayModeDesc.textContent = curMode.desc;
    if (overlayTimeChip)
      overlayTimeChip.textContent = timeTextMap[timeVal] || `⏱️ ${timeVal} mp`;
    if (overlayColorChip)
      overlayColorChip.textContent =
        colorTextMap[colorVal] || `🎨 ${colorVal} szín`;
  }

  // Inicializálás
  updateCanvasOverlaySettings();
  window.updateCanvasOverlaySettings = updateCanvasOverlaySettings;

  /* ================================================================
   CRASHDOWN ARCADE - MAIN APPLICATION BOOTSTRAP & EVENT LISTENERS
   ================================================================ */

  // Fő gombok bekötése
  document
    .getElementById("startGameButton")
    ?.addEventListener("click", startMatch);
  document
    .getElementById("startNewGame")
    ?.addEventListener("click", ujJatekInditasaFunc);

  const overlayStartBtn = document.getElementById("overlayStartBtn");
  if (overlayStartBtn) {
    overlayStartBtn.addEventListener("click", startMatch);
  }

  const overlaySaveScoreBtn = document.getElementById("overlaySaveScoreBtn");
  if (overlaySaveScoreBtn) {
    overlaySaveScoreBtn.addEventListener("click", () => {
      openAuthModal(true);
    });
  }

  const shuffleButton = document.getElementById("shuffleButton");
  if (shuffleButton) {
    shuffleButton.addEventListener("click", executeBoardShuffle);
  }

  // Nehézség (színek száma) választó
  const colorSelect = document.getElementById("colorSelect");
  if (colorSelect) {
    const savedColors = localStorage.getItem("selectedColorCount");
    if (savedColors) colorSelect.value = savedColors;

    colorSelect.addEventListener("change", function () {
      localStorage.setItem("selectedColorCount", this.value);
      getSzinek(this.value);
      if (
        !jatekFut &&
        !vegeAJateknak &&
        typeof initPreviewBoard === "function"
      ) {
        initPreviewBoard();
      }
      if (typeof updateCanvasOverlaySettings === "function") {
        updateCanvasOverlaySettings();
      }
      showToast(`Nehézség beállítva: ${this.value} szín`, "info");
    });
  }

  // Játékidő választó
  const timeSelect = document.getElementById("timeSelect");
  if (timeSelect) {
    const savedTime = localStorage.getItem("selectedGameTime");
    if (savedTime) timeSelect.value = savedTime;

    timeSelect.addEventListener("change", function () {
      localStorage.setItem("selectedGameTime", this.value);
      MAX_TIME = parseInt(this.value, 10);
      remainingTime = MAX_TIME;
      refreshTimerText();
      if (typeof updateCanvasOverlaySettings === "function") {
        updateCanvasOverlaySettings();
      }
      showToast(
        `Játékidő beállítva: ${this.options[this.selectedIndex].text}`,
        "info",
      );
    });
  }

  // Játékmód választó
  const modeSelect = document.getElementById("modeSelect");
  if (modeSelect) {
    const savedMode = localStorage.getItem("selectedGameMode");
    if (savedMode) modeSelect.value = savedMode;

    modeSelect.addEventListener("change", function () {
      localStorage.setItem("selectedGameMode", this.value);
      if (typeof updateCanvasOverlaySettings === "function") {
        updateCanvasOverlaySettings();
      }
      showToast(
        `Játékmód beállítva: ${this.options[this.selectedIndex].text}`,
        "info",
      );
    });
  }

  // Téma választó
  const themeSelectEl = document.getElementById("themeSelect");
  if (themeSelectEl) {
    themeSelectEl.addEventListener("change", function () {
      applyTheme(this.value);
    });
  }

  // Jelvények / Eredmények Modal eseménykezelői
  const openAchievementsBtn = document.getElementById("openAchievementsBtn");
  const closeAchievementsModalBtn = document.getElementById(
    "closeAchievementsModalBtn",
  );
  const achievementsModal = document.getElementById("achievementsModal");

  function openAchievementsModal() {
    updateAchievementsUI();
    if (achievementsModal) achievementsModal.classList.remove("hidden");
  }

  function closeAchievementsModal() {
    if (achievementsModal) achievementsModal.classList.add("hidden");
  }

  if (openAchievementsBtn)
    openAchievementsBtn.addEventListener("click", openAchievementsModal);
  if (closeAchievementsModalBtn)
    closeAchievementsModalBtn.addEventListener("click", closeAchievementsModal);
  if (achievementsModal) {
    achievementsModal.addEventListener("click", (e) => {
      if (e.target === achievementsModal) closeAchievementsModal();
    });
  }

  // Jelvény kategória szűrő gombok
  document.querySelectorAll(".ach-filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".ach-filter-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      applyAchievementFilter(this.getAttribute("data-filter"));
    });
  });

  // Profil Modal bezárás
  const closePlayerProfileModalBtn = document.getElementById(
    "closePlayerProfileModalBtn",
  );
  const playerProfileModal = document.getElementById("playerProfileModal");

  function closePlayerProfileModal() {
    window.currentlyViewedProfileUser = null;
    if (playerProfileModal) playerProfileModal.classList.add("hidden");
    if (window.openedProfileFromPlayersModal) {
      window.openedProfileFromPlayersModal = false;
      if (typeof openPlayersModal === "function") {
        openPlayersModal();
      }
    }
  }

  if (closePlayerProfileModalBtn)
    closePlayerProfileModalBtn.addEventListener(
      "click",
      closePlayerProfileModal,
    );
  if (playerProfileModal) {
    playerProfileModal.addEventListener("click", (e) => {
      if (e.target === playerProfileModal) closePlayerProfileModal();
    });
  }

  // Játékosok (Roster & Jelenlét) Modal eseménykezelők
  const openPlayersModalBtn = document.getElementById("openPlayersModalBtn");
  const closePlayersModalBtn = document.getElementById("closePlayersModalBtn");
  const playersModal = document.getElementById("playersModal");
  const playerSearchInput = document.getElementById("playerSearchInput");

  if (openPlayersModalBtn) {
    openPlayersModalBtn.addEventListener("click", () => {
      if (typeof openPlayersModal === "function") openPlayersModal();
    });
  }
  if (closePlayersModalBtn) {
    closePlayersModalBtn.addEventListener("click", () => {
      if (typeof closePlayersModal === "function") closePlayersModal();
    });
  }
  if (playersModal) {
    playersModal.addEventListener("click", (e) => {
      if (e.target === playersModal) {
        if (typeof closePlayersModal === "function") closePlayersModal();
      }
    });
  }
  if (playerSearchInput) {
    playerSearchInput.addEventListener("input", function () {
      if (typeof currentPlayersSearchQuery !== "undefined") {
        currentPlayersSearchQuery = this.value;
      }
      if (typeof updatePlayersModalUI === "function") {
        updatePlayersModalUI();
      }
    });
  }
  const sortPlayersSelect = document.getElementById("sortPlayersSelect");
  if (sortPlayersSelect) {
    sortPlayersSelect.addEventListener("change", () => {
      if (typeof updatePlayersModalUI === "function") {
        updatePlayersModalUI();
      }
    });
  }

  // Felső fejléc saját profil gomb kattintás
  const openMyProfileBtn = document.getElementById("openMyProfileBtn");
  if (openMyProfileBtn) {
    openMyProfileBtn.addEventListener("click", () => {
      const currentUser = window.authService?.getCurrentUser();
      if (currentUser && currentUser.displayName) {
        openPlayerProfileModal(currentUser.displayName);
      }
    });
  }

  // Auth modal eseménykezelők
  const openAuthModalBtn = document.getElementById("openAuthModalBtn");
  const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
  const authModal = document.getElementById("authModal");
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  const authForm = document.getElementById("authForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (openAuthModalBtn) {
    openAuthModalBtn.addEventListener("click", () => {
      setAuthMode(false);
      openAuthModal(false);
    });
  }

  if (closeAuthModalBtn)
    closeAuthModalBtn.addEventListener("click", closeAuthModal);
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  if (tabLoginBtn)
    tabLoginBtn.addEventListener("click", () => setAuthMode(false));
  if (tabRegisterBtn)
    tabRegisterBtn.addEventListener("click", () => setAuthMode(true));

  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", async () => {
      const email = document.getElementById("authEmail")?.value.trim();
      if (!email) {
        showAuthError(
          "Kérlek írd be az e-mail címed a fenti mezőbe az új jelszó kéréséhez!",
        );
        document.getElementById("authEmail")?.focus();
        return;
      }
      forgotPasswordBtn.disabled = true;
      forgotPasswordBtn.textContent = "Küldés folyamatban...";
      const res = await window.authService.resetPassword(email);
      forgotPasswordBtn.disabled = false;
      forgotPasswordBtn.textContent = "Elfelejtetted a jelszavad?";
      if (res.success) {
        showToast(res.message, "success");
        const authErrorMsg = document.getElementById("authErrorMsg");
        if (authErrorMsg) {
          authErrorMsg.textContent = res.message;
          authErrorMsg.style.display = "block";
          authErrorMsg.style.color = "#38bdf8";
          authErrorMsg.style.borderColor = "rgba(56, 189, 248, 0.4)";
          authErrorMsg.style.background = "rgba(56, 189, 248, 0.12)";
        }
      } else {
        showAuthError(res.error);
      }
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("authEmail")?.value.trim();
      const password = document.getElementById("authPassword")?.value;
      const displayName = document
        .getElementById("authDisplayName")
        ?.value.trim();
      const authSubmitBtn = document.getElementById("authSubmitBtn");

      if (!email || !password) {
        showAuthError("Kérlek töltsd ki az e-mail és jelszó mezőket!");
        return;
      }

      if (isRegisterMode && (!displayName || displayName.length < 3)) {
        showAuthError(
          "A játékosnévnek legalább 3 karakter hosszúnak kell lennie!",
        );
        return;
      }

      if (authSubmitBtn) {
        authSubmitBtn.disabled = true;
        authSubmitBtn.textContent = "Feldolgozás...";
      }

      let res;
      if (isRegisterMode) {
        res = await window.authService.register(email, password, displayName);
      } else {
        res = await window.authService.login(email, password);
      }

      if (authSubmitBtn) {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = isRegisterMode
          ? "Regisztráció és mentés"
          : "Bejelentkezés";
      }

      if (!res.success) {
        showAuthError(res.error || "Hiba történt a művelet során.");
        return;
      }

      closeAuthModal();
      showToast(`Üdvözlünk, ${res.user.displayName}!`, "success");

      if (pendingScore) {
        const scoreToSave = {
          id: Date.now(),
          name: res.user.displayName,
          score: pendingScore.score,
          color: pendingScore.color,
          modifier: pendingScore.modifier || "normal",
          duration: pendingScore.duration,
          timestamp: new Date().toISOString(),
        };
        await toplistaHozzaadas(scoreToSave);
        updatePlayerStatsRecord(
          res.user.displayName,
          scoreToSave.score,
          scoreToSave.color,
          scoreToSave.duration,
          scoreToSave.modifier,
        );
        pendingScore = null;
        showToast(
          `🎉 Eredményed (${scoreToSave.score} pont) mentve a ranglistára!`,
          "success",
        );
        const overlaySaveBtn = document.getElementById("overlaySaveScoreBtn");
        if (overlaySaveBtn) overlaySaveBtn.style.display = "none";
        await toplistaMegjelenites();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await window.authService.logout();
      showToast("Sikeresen kijelentkeztél.", "info");
    });
  }

  // Jelszóváltás modal eseménykezelők
  const openChangePasswordModalBtn = document.getElementById(
    "openChangePasswordModalBtn",
  );
  const closeChangePasswordModalBtn = document.getElementById(
    "closeChangePasswordModalBtn",
  );
  const changePasswordForm = document.getElementById("changePasswordForm");

  if (openChangePasswordModalBtn)
    openChangePasswordModalBtn.addEventListener(
      "click",
      openChangePasswordModal,
    );
  if (closeChangePasswordModalBtn)
    closeChangePasswordModalBtn.addEventListener(
      "click",
      closeChangePasswordModal,
    );

  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const p1 = document.getElementById("newPasswordInput")?.value;
      const p2 = document.getElementById("confirmNewPasswordInput")?.value;

      if (!p1 || p1.length < 6) {
        showChangePwError(
          "Az új jelszónak legalább 6 karakter hosszúnak kell lennie!",
        );
        return;
      }
      if (p1 !== p2) {
        showChangePwError("A két megadott jelszó nem egyezik!");
        return;
      }

      const submitBtn = document.getElementById("changePasswordSubmitBtn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Módosítás folyamatban...";
      }

      const res = await window.authService.updatePassword(p1);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Új jelszó mentése";
      }

      if (res.success) {
        if (typeof closeChangePasswordModal === "function")
          closeChangePasswordModal();
        const input1 = document.getElementById("newPasswordInput");
        const input2 = document.getElementById("confirmNewPasswordInput");
        if (input1) input1.value = "";
        if (input2) input2.value = "";
        const errEl = document.getElementById("changePasswordErrorMsg");
        if (errEl) errEl.style.display = "none";
        showToast("✅ A jelszavad sikeresen megváltozott!", "success");
      } else {
        showChangePwError(res.error || "Hiba történt a jelszómódosítás során.");
      }
    });
  }

  // Ranglista szűrő események (kompakt dropdown toolbar)
  const lbFilterColor = document.getElementById("lbFilterColor");
  const lbFilterMode = document.getElementById("lbFilterMode");
  const lbFilterTime = document.getElementById("lbFilterTime");

  if (lbFilterColor) {
    lbFilterColor.addEventListener("change", function () {
      currentLeaderboardColorFilter = this.value;
      toplistaMegjelenites();
    });
  }
  if (lbFilterMode) {
    lbFilterMode.addEventListener("change", function () {
      currentLeaderboardModeFilter = this.value;
      toplistaMegjelenites();
    });
  }
  if (lbFilterTime) {
    lbFilterTime.addEventListener("change", function () {
      currentLeaderboardTimeFilter = this.value;
      toplistaMegjelenites();
    });
  }

  // Ranglista szűrő chip események (kompatibilitás céljából)
  document.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filterType = this.getAttribute("data-filter-type") || "color";
      const filterVal = this.getAttribute("data-filter");

      if (filterType === "color") {
        document
          .querySelectorAll("#colorFilterGroup .filter-chip")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        currentLeaderboardColorFilter = filterVal;
      } else if (filterType === "mode") {
        document
          .querySelectorAll("#modeFilterGroup .filter-chip")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        currentLeaderboardModeFilter = filterVal;
      } else if (filterType === "time") {
        document
          .querySelectorAll("#timeFilterGroup .filter-chip")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        currentLeaderboardTimeFilter = filterVal;
      }
      toplistaMegjelenites();
    });
  });

  // Mobil navigációs tabok
  document.querySelectorAll(".mobile-tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchToMobileTab(this.getAttribute("data-target"), true);
    });
  });

  // Escape billentyű az összes modálhoz, 'M' billentyű némításhoz
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAuthModal();
      closeChangePasswordModal();
      closeAchievementsModal();
      closePlayerProfileModal();
      if (typeof closePlayersModal === "function") closePlayersModal();
    } else if (
      (e.key === "m" || e.key === "M") &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
    ) {
      toggleVolume();
    }
  });

  // Firebase Auth figyelő
  if (window.authService) {
    window.authService.onAuthStateChanged((user) => {
      updateAuthUI(user);
      if (typeof toplistaMegjelenites === "function") {
        toplistaMegjelenites();
      }
    });
  }

  if (window.leaderboardService) {
    window.leaderboardService.onScoresChanged(() => {
      toplistaMegjelenites();
    });
  }

  // Alkalmazás indítása és inicializálása
  // React mount után azonnal inicializálunk

  applyTheme(currentTheme);
  updateThemeSelectUI();
  applyAudioSettings();
  initAudioListeners();
  toplistaMegjelenites();
  initPreviewBoard();
  updateShuffleButtonUI();
  updateAchievementsUI();
  requestAnimationFrame(animationLoop);
}
