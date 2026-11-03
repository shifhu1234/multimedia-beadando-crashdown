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
                this.auth.onAuthStateChanged(user => {
                    if (user) {
                        this.currentUser = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || user.email.split('@')[0]
                        };
                    } else {
                        // Ellenőrizzük a helyi mentett felhasználót
                        this.currentUser = JSON.parse(sessionStorage.getItem('crashdown_session_user') || 'null');
                    }
                    this.notifyAuthChanged();
                });
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

    async register(email, password, displayName) {
        // 1. Megpróbáljuk Firebase Auth-szal
        if (this.auth) {
            try {
                const cred = await this.auth.createUserWithEmailAndPassword(email, password);
                if (cred.user) {
                    await cred.user.updateProfile({ displayName: displayName });
                    this.currentUser = {
                        uid: cred.user.uid,
                        email: cred.user.email,
                        displayName: displayName
                    };
                    sessionStorage.setItem('crashdown_session_user', JSON.stringify(this.currentUser));
                    this.notifyAuthChanged();
                    return { success: true, user: this.currentUser };
                }
            } catch (err) {
                // Ha a Firebase Auth tiltva van vagy hiba lép fel, helyi tároló fallback
                console.warn('Firebase Auth regisztrációs hiba, helyi tároló mentés:', err.message);
                if (err.code === 'auth/email-already-in-use') {
                    return { success: false, error: 'Ez az e-mail cím már regisztrálva van!' };
                }
                if (err.code === 'auth/weak-password') {
                    return { success: false, error: 'A jelszónak legalább 6 karakternek kell lennie!' };
                }
            }
        }

        // 2. Helyi regisztrációs fallback
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
        // 1. Megpróbáljuk Firebase Auth-szal
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
                    this.notifyAuthChanged();
                    return { success: true, user: this.currentUser };
                }
            } catch (err) {
                console.warn('Firebase Auth bejelentkezési hiba, helyi ellenőrzés:', err.message);
                if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                    // Megpróbáljuk a helyi tárolóból is, hátha ott regisztrált
                }
            }
        }

        // 2. Helyi bejelentkezési fallback
        let users = JSON.parse(localStorage.getItem('crashdown_local_users') || '[]');
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
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
