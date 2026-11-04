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
if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase sikeresen inicializálva a konfigurációval.');
        }
    } catch (err) {
        console.warn('Firebase initializeApp figyelmeztetés:', err.message);
    }
}

// ==================== AUTH SERVICE ====================
function getHungarianAuthErrorMessage(err, context = 'login') {
    if (!err) return 'Ismeretlen hiba történt a művelet során.';
    const code = err.code || '';
    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
            return 'Helytelen e-mail cím vagy jelszó!';
        case 'auth/user-not-found':
            return 'Nem található fiók ezzel az e-mail címmel!';
        case 'auth/wrong-password':
            return 'Helytelen jelszó!';
        case 'auth/email-already-in-use':
            return 'Ez az e-mail cím már regisztrálva van! Jelentkezz be!';
        case 'auth/invalid-email':
            return 'Érvénytelen e-mail cím formátum! Kérjük ellenőrizd az e-mail címed.';
        case 'auth/weak-password':
            return 'Túl gyenge jelszó! A jelszónak legalább 6 karakter hosszúnak kell lennie.';
        case 'auth/missing-password':
            return 'Kérjük, add meg a jelszavad!';
        case 'auth/too-many-requests':
            return 'Túl sok sikertelen próbálkozás történt! Kérjük, várj pár percet a következő próbálkozás előtt.';
        case 'auth/user-disabled':
            return 'Ez a felhasználói fiók fel van függesztve vagy le van tiltva.';
        case 'auth/network-request-failed':
            return 'Hálózati hiba történt! Kérjük, ellenőrizd az internetkapcsolatodat.';
        case 'auth/requires-recent-login':
            return 'Biztonsági okokból kérjük, jelentkezz be újra a módosítás előtt!';
        case 'auth/operation-not-allowed':
            return 'Az e-mail/jelszó bejelentkezés jelenleg nincs engedélyezve a rendszerben.';
        default:
            return context === 'register' 
                ? 'Nem sikerült létrehozni a fiókot. Kérjük, próbáld újra!' 
                : 'Sikertelen bejelentkezés. Kérjük, ellenőrizd az adataidat és próbáld újra!';
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
            if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                this.auth = firebase.auth();
                console.log('Firebase Auth szolgáltatás aktív.');
                
                this.auth.onAuthStateChanged(async user => {
                    if (user) {
                        this.currentUser = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || user.email.split('@')[0]
                        };
                        sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
                        await this.syncUserProfileSession(this.currentUser);
                    } else {
                        // Ellenőrizzük a helyi mentett felhasználót
                        this.currentUser = JSON.parse(sessionStorage.getItem('crashdown_session_user') || 'null');
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
                this.currentUser = JSON.parse(sessionStorage.getItem('crashdown_session_user') || 'null');
                this.notifyAuthChanged();
            }
        } catch (e) {
            console.warn('Firebase Auth inicializálás, helyi mód aktív:', e.message);
            this.currentUser = JSON.parse(sessionStorage.getItem('crashdown_session_user') || 'null');
            this.notifyAuthChanged();
        }
    }

    onAuthStateChanged(cb) {
        this.authSubscribers.push(cb);
        cb(this.currentUser);
    }

    notifyAuthChanged() {
        this.authSubscribers.forEach(cb => {
            try { cb(this.currentUser); } catch (e) { console.error(e); }
        });
    }

    findLocalUser(email, password) {
        const users = JSON.parse(localStorage.getItem('crashdown_local_users') || '[]');
        if (password !== undefined) {
            return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        }
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    removeLocalUser(email) {
        let users = JSON.parse(localStorage.getItem('crashdown_local_users') || '[]');
        users = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
        localStorage.setItem('crashdown_local_users', JSON.stringify(users));
    }

    /**
     * Korábban helyben (localStorage-ben) regisztrált felhasználók migrálása Firebase Auth-ba
     */
    async syncLocalUsersToFirebase() {
        if (!this.auth) return;
        const localUsers = JSON.parse(localStorage.getItem('crashdown_local_users') || '[]');
        if (!localUsers || !localUsers.length) return;

        console.log(`[AuthService] ${localUsers.length} korábban helyben tárolt felhasználó migrálása a Firebase Auth-ba...`);
        const initialCurrentUser = this.auth.currentUser;

        for (const u of [...localUsers]) {
            if (!u.email || !u.password) continue;
            try {
                const cred = await this.auth.createUserWithEmailAndPassword(u.email, u.password);
                if (cred.user) {
                    await cred.user.updateProfile({ displayName: u.displayName || u.email.split('@')[0] });
                    console.log(`[AuthService] Sikeresen feltöltve Firebase Auth-ba: ${u.email}`);
                    this.removeLocalUser(u.email);
                }
            } catch (err) {
                if (err.code === 'auth/email-already-in-use') {
                    // Már létezik a Firebase-ben
                    console.log(`[AuthService] ${u.email} már szerepel a Firebase Auth adatbázisban.`);
                    this.removeLocalUser(u.email);
                } else if (err.code === 'auth/operation-not-allowed') {
                    console.warn('[AuthService] Firebase Console: Email/Password Authentication nincs bekapcsolva!');
                    break;
                } else {
                    console.warn(`[AuthService] Nem sikerült a szinkronizálás (${u.email}):`, err.message);
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
                const cred = await this.auth.createUserWithEmailAndPassword(email, password);
                if (cred.user) {
                    if (displayName) {
                        await cred.user.updateProfile({ displayName: displayName });
                    }
                    this.currentUser = {
                        uid: cred.user.uid,
                        email: cred.user.email,
                        displayName: displayName || cred.user.email.split('@')[0]
                    };
                    sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
                    this.removeLocalUser(email);
                    await this.syncUserProfileSession(this.currentUser);
                    this.notifyAuthChanged();
                    return { success: true, user: this.currentUser };
                }
            } catch (err) {
                console.error('Firebase Auth regisztrációs hiba:', err.code, err.message);
                return { success: false, error: getHungarianAuthErrorMessage(err, 'register') };
            }
        }

        // 2. Tartalék helyi regisztráció ha a hálózat nem elérhető
        return await this.registerLocally(email, password, displayName);
    }

    async registerLocally(email, password, displayName) {
        let users = JSON.parse(localStorage.getItem('crashdown_local_users') || '[]');
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return { success: false, error: 'Ez az e-mail cím már regisztrálva van!' };
        }

        const newUser = {
            uid: 'local_' + Date.now(),
            email: email,
            displayName: displayName || email.split('@')[0],
            password: password
        };
        users.push(newUser);
        localStorage.setItem('crashdown_local_users', JSON.stringify(users));

        this.currentUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.displayName };
        sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
        await this.syncUserProfileSession(this.currentUser);
        this.notifyAuthChanged();
        return { success: true, user: this.currentUser };
    }

    async login(email, password) {
        // 1. Megpróbáljuk Firebase Auth-szal beléptetni
        if (this.auth) {
            try {
                const cred = await this.auth.signInWithEmailAndPassword(email, password);
                if (cred.user) {
                    this.currentUser = {
                        uid: cred.user.uid,
                        email: cred.user.email,
                        displayName: cred.user.displayName || cred.user.email.split('@')[0]
                    };
                    sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
                    this.removeLocalUser(email);
                    await this.syncUserProfileSession(this.currentUser);
                    this.notifyAuthChanged();
                    return { success: true, user: this.currentUser };
                }
            } catch (err) {
                console.warn('Firebase Auth bejelentkezési hiba:', err.code, err.message);

                // Ha nem található a Firebase-ben, ellenőrizzük: szerepel-e a helyi tárolóban?
                if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                    const localUser = this.findLocalUser(email, password);
                    if (localUser) {
                        // Megtaláltuk a helyi tárolóban! Feltöltjük (migráljuk) a Firebase-be
                        try {
                            const newCred = await this.auth.createUserWithEmailAndPassword(email, password);
                            if (newCred.user) {
                                await newCred.user.updateProfile({ displayName: localUser.displayName });
                                this.currentUser = {
                                    uid: newCred.user.uid,
                                    email: newCred.user.email,
                                    displayName: localUser.displayName
                                };
                                sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
                                this.removeLocalUser(email);
                                await this.syncUserProfileSession(this.currentUser);
                                this.notifyAuthChanged();
                                return { success: true, user: this.currentUser };
                            }
                        } catch (createErr) {
                            console.warn('Helyi felhasználó Firebase-be migrálása sikertelen:', createErr);
                        }
                    }
                }

                return { success: false, error: getHungarianAuthErrorMessage(err, 'login') };
            }
        }

        // 2. Tartalék helyi bejelentkezés
        const found = this.findLocalUser(email, password);
        if (found) {
            this.currentUser = { uid: found.uid, email: found.email, displayName: found.displayName };
            sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
            await this.syncUserProfileSession(this.currentUser);
            this.notifyAuthChanged();
            return { success: true, user: this.currentUser };
        }

        return { success: false, error: 'Hibás e-mail cím vagy jelszó!' };
    }

    clearUserSessionState() {
        try {
            localStorage.removeItem('crashdown_chosen_title');
            localStorage.removeItem('crashdown_chosen_avatar');
            localStorage.removeItem('crashdown_chosen_name_color');
            localStorage.removeItem('crashdown_achievements');
            localStorage.removeItem('crashdown_powerup_count');
            localStorage.removeItem('crashdown_powerup_tnt_count');
            localStorage.removeItem('crashdown_powerup_magnet_count');
            localStorage.removeItem('crashdown_powerup_freeze_count');
            localStorage.removeItem('crashdown_powerup_doubler_count');
            localStorage.removeItem('crashdown_powerup_colorbomb_count');
        } catch (e) {}
    }

    async syncUserProfileSession(user) {
        if (!user || !user.displayName) return;
        const username = user.displayName;
        const uLower = username.trim().toLowerCase();

        this.clearUserSessionState();

        let profile = null;
        if (window.leaderboardService && typeof window.leaderboardService.getPlayerProfile === 'function') {
            try {
                profile = await window.leaderboardService.getPlayerProfile(username);
            } catch (e) {}
        }

        if (!profile) {
            try {
                const localProfiles = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
                const matchKey = Object.keys(localProfiles).find(k => k.toLowerCase() === uLower);
                if (matchKey) {
                    profile = localProfiles[matchKey];
                }
            } catch (e) {}
        }

        if (profile) {
            const achList = Array.isArray(profile.achievements) ? profile.achievements : [];
            localStorage.setItem('crashdown_achievements_' + uLower, JSON.stringify(achList));
            localStorage.setItem('crashdown_achievements', JSON.stringify(achList));

            if (profile.chosenTitle) {
                localStorage.setItem('crashdown_chosen_title', profile.chosenTitle);
            }
            localStorage.setItem('crashdown_chosen_avatar', profile.chosenAvatar || 'avatar_default');
            localStorage.setItem('crashdown_chosen_name_color', profile.chosenNameColor || 'name_white');

            try {
                const localProfiles = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
                localProfiles[username] = { ...(localProfiles[username] || {}), ...profile };
                localStorage.setItem('crashdown_player_profiles', JSON.stringify(localProfiles));
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
                chosenAvatar: 'avatar_default',
                chosenNameColor: 'name_white'
            };

            localStorage.setItem('crashdown_achievements_' + uLower, JSON.stringify([]));
            localStorage.setItem('crashdown_achievements', JSON.stringify([]));
            localStorage.setItem('crashdown_chosen_avatar', 'avatar_default');
            localStorage.setItem('crashdown_chosen_name_color', 'name_white');

            try {
                const localProfiles = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
                localProfiles[username] = cleanProfile;
                localStorage.setItem('crashdown_player_profiles', JSON.stringify(localProfiles));
            } catch (e) {}

            if (window.leaderboardService && typeof window.leaderboardService.savePlayerProfile === 'function') {
                window.leaderboardService.savePlayerProfile(username, cleanProfile).catch(() => {});
            }
        }

        if (typeof updateAchievementsUI === 'function') {
            updateAchievementsUI();
        }
        if (typeof toplistaMegjelenites === 'function') {
            toplistaMegjelenites();
        }

        this.updatePresence(true);
    }

    updatePresence(isOnline) {
        if (!this.currentUser || !window.leaderboardService || !window.leaderboardService.db) return;
        const username = this.currentUser.displayName;
        if (!username) return;
        const safeKey = encodeURIComponent(username.trim().toLowerCase()).replace(/\./g, '%2E');
        try {
            const presRef = window.leaderboardService.db.ref('presence/' + safeKey);
            if (isOnline) {
                if (typeof firebase !== 'undefined' && firebase.database) {
                    presRef.onDisconnect().set({
                        online: false,
                        username: username,
                        lastSeen: firebase.database.ServerValue.TIMESTAMP
                    });
                    presRef.set({
                        online: true,
                        username: username,
                        lastSeen: firebase.database.ServerValue.TIMESTAMP
                    });
                }
            } else {
                if (typeof firebase !== 'undefined' && firebase.database) {
                    presRef.set({
                        online: false,
                        username: username,
                        lastSeen: firebase.database.ServerValue.TIMESTAMP
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
            try { await this.auth.signOut(); } catch (e) {}
        }
        sessionStorage.removeItem('crashdown_session_user');
        this.currentUser = null;
        this.clearUserSessionState();
        if (typeof updateAchievementsUI === 'function') {
            updateAchievementsUI();
        }
        if (typeof toplistaMegjelenites === 'function') {
            toplistaMegjelenites();
        }
        this.notifyAuthChanged();
        return { success: true };
    }

    getResetCooldownRemaining(email) {
        if (!email) return 0;
        const key = 'crashdown_pwd_reset_' + btoa(email.toLowerCase()).replace(/=/g, '');
        const lastTime = parseInt(localStorage.getItem(key) || '0', 10);
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
        const key = 'crashdown_pwd_reset_' + btoa(email.toLowerCase()).replace(/=/g, '');
        localStorage.setItem(key, String(Date.now()));
    }

    async resetPassword(email) {
        if (!email) {
            return { success: false, error: 'Kérjük, add meg az e-mail címed!' };
        }

        const remainingSec = this.getResetCooldownRemaining(email);
        if (remainingSec > 0) {
            const min = Math.floor(remainingSec / 60);
            const sec = remainingSec % 60;
            const timeStr = min > 0 ? `${min} perc ${sec} mp` : `${sec} másodperc`;
            return {
                success: false,
                error: `Biztonsági korlátozás: Jelszó-visszaállítás 5 percenként egyszer kérhető! Várj még ${timeStr}-et.`
            };
        }

        if (this.auth) {
            try {
                await this.auth.sendPasswordResetEmail(email);
                this.setResetCooldown(email);
                return { success: true, message: 'A jelszóvisszaállító linket elküldtük az e-mail címedre! (5 perc múlva kérhetsz újat)' };
            } catch (err) {
                console.error('Jelszóvisszaállítási hiba:', err.code, err.message);
                if (err.code === 'auth/too-many-requests') {
                    this.setResetCooldown(email);
                    return { success: false, error: 'Túl sok kérés érkezett! Kérjük, várj 5 percet az újabb kérés előtt.' };
                }
                return { success: false, error: getHungarianAuthErrorMessage(err, 'reset') };
            }
        }
        return { success: false, error: 'A jelszóvisszaállítás csak online Firebase kapcsolattal érhető el.' };
    }

    async updatePassword(newPassword) {
        if (!newPassword || newPassword.length < 6) {
            return { success: false, error: 'Az új jelszónak legalább 6 karakter hosszúnak kell lennie!' };
        }
        if (this.auth && this.auth.currentUser) {
            try {
                await this.auth.currentUser.updatePassword(newPassword);
                return { success: true, message: 'A jelszavad sikeresen megváltozott!' };
            } catch (err) {
                console.error('Jelszómódosítási hiba:', err.code, err.message);
                return { success: false, error: getHungarianAuthErrorMessage(err, 'updatePassword') };
            }
        }

        if (this.currentUser && this.currentUser.email) {
            let users = JSON.parse(localStorage.getItem('crashdown_local_users') || '[]');
            const idx = users.findIndex(u => u.email.toLowerCase() === this.currentUser.email.toLowerCase());
            if (idx !== -1) {
                users[idx].password = newPassword;
                localStorage.setItem('crashdown_local_users', JSON.stringify(users));
                return { success: true, message: 'A jelszavad sikeresen megváltozott!' };
            }
        }

        return { success: false, error: 'Nincs bejelentkezett felhasználó!' };
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
            if (typeof firebase !== 'undefined') {
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                this.db = firebase.database();
                this.isOnline = true;
                
                // Kapcsolati állapot valós idejű követése
                this.db.ref('.info/connected').on('value', (snap) => {
                    this.isOnline = snap.val() === true;
                    const cached = JSON.parse(localStorage.getItem('toplista') || '[]');
                    if (cached && cached.length > 0) {
                        this.notifySubscribers(cached);
                    }
                });

                this.listenForUpdates();
                console.log('Firebase Realtime Database sikeresen csatlakoztatva.');
            }
        } catch (err) {
            console.warn('Firebase inicializálási figyelmeztetés (helyi mód aktív):', err.message);
            this.isOnline = false;
        }
    }

    listenForUpdates() {
        if (!this.db) return;
        try {
            const scoresRef = this.db.ref('leaderboard');
            scoresRef.on('value', (snapshot) => {
                const data = snapshot.val();
                const list = [];
                if (data) {
                    Object.keys(data).forEach(key => {
                        list.push({ ...data[key], firebaseKey: key });
                    });
                    list.sort((a, b) => (parseInt(b.score, 10) || 0) - (parseInt(a.score, 10) || 0));
                }
                localStorage.setItem('toplista', JSON.stringify(list));
                this.notifySubscribers(list);
            }, (error) => {
                console.warn('Firebase valós idejű olvasási hiba:', error);
            });

            // Valós idejű profil-figyelés (név szín, rangcím, avatar változások azonnali lekövetése)
            const profilesRef = this.db.ref('profiles');
            profilesRef.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    try {
                        const localProfiles = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
                        Object.keys(data).forEach(key => {
                            const p = data[key];
                            if (p && p.username) {
                                localProfiles[p.username] = {
                                    ...(localProfiles[p.username] || {}),
                                    ...p
                                };
                            }
                        });
                        localStorage.setItem('crashdown_player_profiles', JSON.stringify(localProfiles));

                        // Ha a bejelentkezett felhasználó profilját módosította valaki (pl. admin valós időben):
                        const currentUser = window.authService?.getCurrentUser();
                        if (currentUser && currentUser.displayName && data) {
                            const cMatchKey = Object.keys(data).find(k => String(data[k]?.username || '').toLowerCase() === currentUser.displayName.toLowerCase());
                            if (cMatchKey) {
                                const myUpdatedProfile = data[cMatchKey];
                                if (myUpdatedProfile.achievements) {
                                    localStorage.setItem('crashdown_achievements_' + currentUser.displayName.toLowerCase(), JSON.stringify(myUpdatedProfile.achievements));
                                    localStorage.setItem('crashdown_achievements', JSON.stringify(myUpdatedProfile.achievements));
                                }
                                if (myUpdatedProfile.chosenNameColor) {
                                    localStorage.setItem('crashdown_chosen_name_color', myUpdatedProfile.chosenNameColor);
                                }
                                if (myUpdatedProfile.chosenTitle) {
                                    localStorage.setItem('crashdown_chosen_title', myUpdatedProfile.chosenTitle);
                                }
                                if (myUpdatedProfile.chosenAvatar) {
                                    localStorage.setItem('crashdown_chosen_avatar', myUpdatedProfile.chosenAvatar);
                                }
                                if (typeof updateAuthUI === 'function') {
                                    updateAuthUI(currentUser);
                                }
                                if (typeof updateThemeSelectUI === 'function') {
                                    updateThemeSelectUI();
                                }
                            }
                        }

                        if (typeof toplistaMegjelenites === 'function') {
                            toplistaMegjelenites();
                        }
                        // Ha valaki épp néz egy profilt, frissítsük azt is azonnal valós időben
                        if (window.currentlyViewedProfileUser && typeof refreshOpenProfileModalRealtime === 'function') {
                            refreshOpenProfileModalRealtime(window.currentlyViewedProfileUser);
                        }
                        // Ha nyitva van a Játékosok lista modal, frissítsük
                        if (typeof updatePlayersModalUI === 'function') {
                            updatePlayersModalUI();
                        }
                    } catch (e) {
                        console.warn('Hiba profilok valós idejű frissítésekor:', e);
                    }
                }
            }, (error) => {
                console.warn('Firebase valós idejű profil olvasási hiba:', error);
            });

            // Valós idejű jelenlét (online / offline) követése
            const presenceRef = this.db.ref('presence');
            presenceRef.on('value', (snapshot) => {
                window.onlinePresenceData = snapshot.val() || {};
                if (typeof updatePlayersModalUI === 'function') {
                    updatePlayersModalUI();
                }
            }, (error) => {
                console.warn('Firebase valós idejű jelenlét olvasási hiba:', error);
            });
        } catch (err) {
            console.warn('Firebase figyelő hiba:', err);
        }
    }

    onScoresChanged(callback) {
        this.subscribers.push(callback);
    }

    notifySubscribers(scores) {
        this.subscribers.forEach(cb => {
            try { cb(scores); } catch (e) { console.error(e); }
        });
    }

    async getScores() {
        if (this.db) {
            try {
                const snapshot = await this.db.ref('leaderboard').once('value');
                const data = snapshot.val();
                const list = [];
                if (data) {
                    Object.keys(data).forEach(key => {
                        list.push({ ...data[key], firebaseKey: key });
                    });
                    list.sort((a, b) => (parseInt(b.score, 10) || 0) - (parseInt(a.score, 10) || 0));
                }
                localStorage.setItem('toplista', JSON.stringify(list));
                return list;
            } catch (err) {
                console.warn('Firebase lekérési hiba, tartalék helyi tároló:', err);
            }
        }
        return JSON.parse(localStorage.getItem('toplista')) || [];
    }

    async addScore(jatekosAdat) {
        const currentScores = await this.getScores();
        const userNameLower = String(jatekosAdat.name || '').trim().toLowerCase();
        const targetColor = String(jatekosAdat.color || '3');
        const targetModifier = String(jatekosAdat.modifier || 'normal');
        const newScore = parseInt(jatekosAdat.score, 10) || 0;

        if (!jatekosAdat.chosenAvatar) {
            jatekosAdat.chosenAvatar = localStorage.getItem('crashdown_chosen_avatar') || 'avatar_default';
        }
        if (!jatekosAdat.chosenTitle) {
            jatekosAdat.chosenTitle = localStorage.getItem('crashdown_chosen_title') || null;
        }
        if (!jatekosAdat.chosenNameColor) {
            jatekosAdat.chosenNameColor = localStorage.getItem('crashdown_chosen_name_color') || 'name_white';
        }

        const existingIndex = currentScores.findIndex(s => 
            String(s.name || '').trim().toLowerCase() === userNameLower &&
            String(s.color || '3') === targetColor &&
            String(s.modifier || 'normal') === targetModifier
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
                        await this.db.ref('leaderboard/' + existing.firebaseKey).update({
                            score: newScore,
                            duration: jatekosAdat.duration,
                            modifier: targetModifier,
                            timestamp: jatekosAdat.timestamp,
                            chosenAvatar: jatekosAdat.chosenAvatar,
                            chosenTitle: jatekosAdat.chosenTitle,
                            chosenNameColor: jatekosAdat.chosenNameColor
                        });
                    } catch (err) {
                        console.warn('Nem sikerült az online rekordfrissítés:', err);
                    }
                }
            } else {
                // Nem döntötte meg a rekordját ebben a kategóriában, nem mentjük feleslegesen
                return { success: true, updated: false, isRecord: false, previousBest: existing.score };
            }
        } else {
            // Új bejegyzés ebben a kategóriában
            wasAdded = true;
            jatekosAdat.modifier = targetModifier;
            if (this.isOnline && this.db) {
                try {
                    const newRef = this.db.ref('leaderboard').push();
                    await newRef.set(jatekosAdat);
                    jatekosAdat.firebaseKey = newRef.key;
                } catch (err) {
                    console.warn('Nem sikerült az online mentés:', err);
                }
            }
            currentScores.push(jatekosAdat);
        }

        currentScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('toplista', JSON.stringify(currentScores));
        this.notifySubscribers(currentScores);

        return { success: true, updated: wasUpdated, isNew: wasAdded, isRecord: true };
    }

    async deleteScoreRecord(elem) {
        if (!elem) return false;
        let currentScores = await this.getScores();
        const targetName = String(elem.name || '').trim().toLowerCase();
        const targetScore = parseInt(elem.score, 10) || 0;
        const targetTimestamp = elem.timestamp;
        const targetKey = elem.firebaseKey;

        if (this.isOnline && this.db) {
            try {
                if (targetKey) {
                    await this.db.ref('leaderboard/' + targetKey).remove();
                } else {
                    const snap = await this.db.ref('leaderboard').once('value');
                    const data = snap.val();
                    if (data) {
                        for (const k of Object.keys(data)) {
                            const item = data[k];
                            if (String(item.name || '').trim().toLowerCase() === targetName &&
                                (parseInt(item.score, 10) || 0) === targetScore &&
                                (!targetTimestamp || item.timestamp === targetTimestamp)) {
                                await this.db.ref('leaderboard/' + k).remove();
                                break;
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn('Nem sikerült az online pontszám törlése:', err);
            }
        }

        // Lokális toplista frissítése
        currentScores = currentScores.filter(s => {
            if (targetKey && s.firebaseKey) return s.firebaseKey !== targetKey;
            const matches = String(s.name || '').trim().toLowerCase() === targetName &&
                            (parseInt(s.score, 10) || 0) === targetScore &&
                            (!targetTimestamp || s.timestamp === targetTimestamp);
            return !matches;
        });

        localStorage.setItem('toplista', JSON.stringify(currentScores));
        this.notifySubscribers(currentScores);

        // A játékos maradt pontszámainak vizsgálata a profil frissítéséhez
        const remainingForUser = currentScores.filter(s => String(s.name || '').trim().toLowerCase() === targetName);
        const newBestScore = remainingForUser.length > 0 
            ? Math.max(...remainingForUser.map(s => parseInt(s.score, 10) || 0))
            : 0;

        // Profil adatainak lekérése és frissítése
        let profile = await this.getPlayerProfile(elem.name);
        if (!profile) {
            const localProfiles = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
            profile = localProfiles[elem.name] || localProfiles[targetName];
        }

        if (profile) {
            profile.bestScore = newBestScore;
            if (Array.isArray(profile.history)) {
                profile.history = profile.history.filter(h => !(
                    (parseInt(h.score, 10) || 0) === targetScore &&
                    (!targetTimestamp || h.timestamp === targetTimestamp)
                ));
            }
            const pKey = 'crashdown_player_profiles';
            const localProfiles = JSON.parse(localStorage.getItem(pKey) || '{}');
            localProfiles[elem.name] = profile;
            localStorage.setItem(pKey, JSON.stringify(localProfiles));
            await this.savePlayerProfile(elem.name, profile);
        }

        return true;
    }

    async resetLeaderboard(adminConfirmation) {
        if (adminConfirmation !== 'CONFIRM_PURGE_LEADERBOARD') {
            console.warn('[LeaderboardService] resetLeaderboard hívása megtagadva: nincs admin jóváhagyás.');
            return;
        }
        localStorage.removeItem('toplista');
        if (this.isOnline && this.db) {
            try {
                await this.db.ref('leaderboard').remove();
                console.log('Firebase leaderboard sikeresen nullázva.');
            } catch (err) {
                console.warn('Nem sikerült a Firebase leaderboard törlése:', err);
            }
        }
        this.notifySubscribers([]);
    }

    async getPlayerProfile(username) {
        if (!username) return null;
        const safeKey = encodeURIComponent(username.trim().toLowerCase()).replace(/\./g, '%2E');
        if (this.db) {
            try {
                const snap = await this.db.ref('profiles/' + safeKey).once('value');
                if (snap.exists()) {
                    return snap.val();
                }
            } catch (e) {
                console.warn('Firebase profil lekérési hiba:', e);
            }
        }
        return null;
    }

    async savePlayerProfile(username, profileData) {
        if (!username || !profileData) return;
        const safeKey = encodeURIComponent(username.trim().toLowerCase()).replace(/\./g, '%2E');
        if (this.isOnline && this.db) {
            try {
                await this.db.ref('profiles/' + safeKey).set({
                    username: username,
                    bestScore: profileData.bestScore || 0,
                    totalMatches: profileData.totalMatches || 0,
                    totalPlaytimeSeconds: profileData.totalPlaytimeSeconds || 0,
                    totalScore: profileData.totalScore || 0,
                    achievements: profileData.achievements || [],
                    history: (profileData.history || []).slice(0, 10),
                    chosenTitle: profileData.chosenTitle || null,
                    chosenAvatar: profileData.chosenAvatar || 'avatar_default',
                    chosenNameColor: profileData.chosenNameColor || 'name_white',
                    modifierStats: profileData.modifierStats || {},
                    durationStats: profileData.durationStats || {},
                    modes: profileData.modes || {},
                    updatedAt: new Date().toISOString()
                });

                // Frissítsük a játékos meglévő rekordjait a ranglistán is valós időben
                const snap = await this.db.ref('leaderboard').once('value');
                const data = snap.val();
                if (data) {
                    const uLower = username.trim().toLowerCase();
                    const batchUpdates = {};
                    Object.keys(data).forEach(key => {
                        if (String(data[key].name || '').trim().toLowerCase() === uLower) {
                            if (profileData.chosenTitle !== undefined) batchUpdates[`leaderboard/${key}/chosenTitle`] = profileData.chosenTitle;
                            if (profileData.chosenAvatar !== undefined) batchUpdates[`leaderboard/${key}/chosenAvatar`] = profileData.chosenAvatar;
                            if (profileData.chosenNameColor !== undefined) batchUpdates[`leaderboard/${key}/chosenNameColor`] = profileData.chosenNameColor;
                        }
                    });
                    if (Object.keys(batchUpdates).length > 0) {
                        await this.db.ref().update(batchUpdates);
                    }
                }
            } catch (e) {
                console.warn('Firebase profil mentési hiba:', e);
            }
        }
    }

    async updatePlayerCustomizations(username, { chosenTitle, chosenAvatar, chosenNameColor }) {
        if (!username) return;
        const safeKey = encodeURIComponent(username.trim().toLowerCase()).replace(/\./g, '%2E');
        if (this.isOnline && this.db) {
            try {
                const updates = {};
                if (chosenTitle !== undefined) updates.chosenTitle = chosenTitle;
                if (chosenAvatar !== undefined) updates.chosenAvatar = chosenAvatar;
                if (chosenNameColor !== undefined) updates.chosenNameColor = chosenNameColor;
                updates.updatedAt = new Date().toISOString();

                await this.db.ref('profiles/' + safeKey).update(updates);

                // Frissítsük a játékos meglévő rekordjait a ranglistán is valós időben
                const snap = await this.db.ref('leaderboard').once('value');
                const data = snap.val();
                if (data) {
                    const uLower = username.trim().toLowerCase();
                    const batchUpdates = {};
                    Object.keys(data).forEach(key => {
                        if (String(data[key].name || '').trim().toLowerCase() === uLower) {
                            if (chosenTitle !== undefined) batchUpdates[`leaderboard/${key}/chosenTitle`] = chosenTitle;
                            if (chosenAvatar !== undefined) batchUpdates[`leaderboard/${key}/chosenAvatar`] = chosenAvatar;
                            if (chosenNameColor !== undefined) batchUpdates[`leaderboard/${key}/chosenNameColor`] = chosenNameColor;
                        }
                    });
                    if (Object.keys(batchUpdates).length > 0) {
                        await this.db.ref().update(batchUpdates);
                    }
                }
            } catch (e) {
                console.warn('Firebase testreszabás mentési hiba:', e);
            }
        }
    }

    async getAllRegisteredPlayers() {
        if (this.db) {
            try {
                const snap = await this.db.ref('profiles').once('value');
                if (snap.exists()) {
                    const data = snap.val();
                    const players = [];
                    Object.keys(data).forEach(key => {
                        const p = data[key];
                        if (p && p.username) {
                            players.push(p);
                        }
                    });
                    return players;
                }
            } catch (e) {
                console.warn('Hiba a regisztrált játékosok lekérésekor:', e);
            }
        }
        const local = JSON.parse(localStorage.getItem('crashdown_player_profiles') || '{}');
        return Object.keys(local).map(k => local[k]).filter(p => p && p.username);
    }
}

// Globális példányok
window.authService = new AuthService();
window.leaderboardService = new LeaderboardService();
window.databaseService = window.leaderboardService;
