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
                
                this.auth.onAuthStateChanged(user => {
                    if (user) {
                        this.currentUser = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || user.email.split('@')[0]
                        };
                        sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
                    } else {
                        // Ellenőrizzük a helyi mentett felhasználót
                        this.currentUser = JSON.parse(sessionStorage.getItem('crashdown_session_user') || 'null');
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
                    this.notifyAuthChanged();
                    return { success: true, user: this.currentUser };
                }
            } catch (err) {
                console.error('Firebase Auth regisztrációs hiba:', err.code, err.message);
                if (err.code === 'auth/email-already-in-use') {
                    return { success: false, error: 'Ez az e-mail cím már regisztrálva van!' };
                }
                if (err.code === 'auth/weak-password') {
                    return { success: false, error: 'A jelszónak legalább 6 karakter hosszúnak kell lennie!' };
                }
                if (err.code === 'auth/invalid-email') {
                    return { success: false, error: 'Érvénytelen e-mail formátum!' };
                }
                if (err.code === 'auth/operation-not-allowed') {
                    return { success: false, error: 'Az Email/Password bejelentkezés nincs engedélyezve a Firebase konzolban!' };
                }
                return { success: false, error: `Hiba a regisztráció során: ${err.message}` };
            }
        }

        // 2. Tartalék helyi regisztráció ha a hálózat nem elérhető
        return this.registerLocally(email, password, displayName);
    }

    registerLocally(email, password, displayName) {
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
                                this.notifyAuthChanged();
                                return { success: true, user: this.currentUser };
                            }
                        } catch (createErr) {
                            console.warn('Helyi felhasználó Firebase-be migrálása sikertelen:', createErr);
                        }
                    }
                }

                if (err.code === 'auth/user-not-found') {
                    return { success: false, error: 'Nincs ilyen e-mail címmel regisztrált fiók!' };
                }
                if (err.code === 'auth/wrong-password') {
                    return { success: false, error: 'Helytelen jelszó!' };
                }
                if (err.code === 'auth/invalid-email') {
                    return { success: false, error: 'Érvénytelen e-mail formátum!' };
                }
                if (err.code === 'auth/operation-not-allowed') {
                    return { success: false, error: 'Az Email/Password bejelentkezés nincs engedélyezve a Firebase konzolban!' };
                }
                return { success: false, error: err.message || 'Hiba a bejelentkezés során.' };
            }
        }

        // 2. Tartalék helyi bejelentkezés
        const found = this.findLocalUser(email, password);
        if (found) {
            this.currentUser = { uid: found.uid, email: found.email, displayName: found.displayName };
            sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
            this.notifyAuthChanged();
            return { success: true, user: this.currentUser };
        }

        return { success: false, error: 'Hibás e-mail cím vagy jelszó!' };
    }

    async logout() {
        if (this.auth) {
            try { await this.auth.signOut(); } catch (e) {}
        }
        sessionStorage.removeItem('crashdown_session_user');
        this.currentUser = null;
        this.notifyAuthChanged();
        return { success: true };
    }

    async resetPassword(email) {
        if (!email) {
            return { success: false, error: 'Kérjük, add meg az e-mail címed!' };
        }
        if (this.auth) {
            try {
                await this.auth.sendPasswordResetEmail(email);
                return { success: true, message: 'A jelszóvisszaállító linket elküldtük az e-mail címedre!' };
            } catch (err) {
                console.error('Jelszóvisszaállítási hiba:', err.code, err.message);
                if (err.code === 'auth/user-not-found') {
                    return { success: false, error: 'Nem található fiók ezzel az e-mail címmel!' };
                }
                if (err.code === 'auth/invalid-email') {
                    return { success: false, error: 'Érvénytelen e-mail formátum!' };
                }
                return { success: false, error: err.message || 'Hiba a visszaállító levél küldésekor.' };
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
                if (err.code === 'auth/requires-recent-login') {
                    return { success: false, error: 'Biztonsági okokból jelentkezz be újra a jelszómódosítás előtt!' };
                }
                if (err.code === 'auth/weak-password') {
                    return { success: false, error: 'A jelszó túl egyszerű, válassz erősebb jelszót!' };
                }
                return { success: false, error: err.message || 'Nem sikerült megváltoztatni a jelszót.' };
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
                this.listenForUpdates();
                console.log('Firebase Realtime Database sikeresen csatlakoztatva.');
            }
        } catch (err) {
            console.warn('Firebase inicializálási figyelmeztetés (helyi mód aktív):', err.message);
            this.isOnline = false;
        }
    }

    listenForUpdates() {
        if (!this.isOnline || !this.db) return;
        try {
            const scoresRef = this.db.ref('leaderboard');
            scoresRef.orderByChild('score').limitToLast(100).on('value', (snapshot) => {
                const data = snapshot.val();
                const list = [];
                if (data) {
                    Object.keys(data).forEach(key => {
                        list.push({ ...data[key], firebaseKey: key });
                    });
                    list.sort((a, b) => b.score - a.score);
                }
                localStorage.setItem('toplista', JSON.stringify(list));
                this.notifySubscribers(list);
            }, (error) => {
                console.warn('Firebase olvasási hiba:', error);
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
        if (this.isOnline && this.db) {
            try {
                const snapshot = await this.db.ref('leaderboard').orderByChild('score').limitToLast(100).once('value');
                const data = snapshot.val();
                const list = [];
                if (data) {
                    Object.keys(data).forEach(key => {
                        list.push({ ...data[key], firebaseKey: key });
                    });
                    list.sort((a, b) => b.score - a.score);
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
        
        // Helyi mentés
        currentScores.push(jatekosAdat);
        currentScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('toplista', JSON.stringify(currentScores));

        // Online mentés
        if (this.isOnline && this.db) {
            try {
                const newRef = this.db.ref('leaderboard').push();
                await newRef.set(jatekosAdat);
                return { success: true, isOnline: true };
            } catch (err) {
                console.warn('Nem sikerült az online mentés a Firebase-be:', err);
                return { success: true, isOnline: false, error: err.message };
            }
        }

        return { success: true, isOnline: false };
    }
}

// Globális példányok
window.authService = new AuthService();
window.leaderboardService = new LeaderboardService();
