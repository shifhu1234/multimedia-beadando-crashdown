/**
 * FIREBASE KONFIGURÁCIÓ ÉS GLOBÁLIS ONLINE RANGLISTA SZOLGÁLTATÁS
 *
 * Beállítási útmutató a globális ranglistához:
 * 1. Nyisd meg a Firebase Console-t: https://console.firebase.google.com/
 * 2. Válaszd ki a 'multi-beadando-crashdown' projektet.
 * 3. A bal oldali menüben kattints a 'Build' -> 'Realtime Database' menüpontra, majd kattints a 'Create Database' gombra.
 * 4. Válaszd ki a szerver régiót (pl. Belgium: europe-west1 vagy Egyesült Államok: us-central1).
 * 5. Másold be az alábbi firebaseConfig objektumba a Project Settings -> General -> Your apps -> Web app beállításaidat.
 * 6. Futtasd a terminálban: 'firebase deploy' (vagy 'firebase deploy --only database')
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

class LeaderboardService {
  constructor() {
    this.isOnline = false;
    this.db = null;
    this.subscribers = [];
    this.initFirebase();
  }

  initFirebase() {
    try {
      if (
        typeof firebase !== "undefined" &&
        firebaseConfig.databaseURL &&
        firebaseConfig.databaseURL.length > 10
      ) {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        this.db = firebase.database();
        this.isOnline = true;
        this.listenForUpdates();
        console.log("Firebase Realtime Database sikeresen csatlakoztatva.");
      } else {
        console.info(
          "Firebase konfiguráció nincs kitöltve vagy SDK hiányzik, helyi tároló (localStorage) használatban.",
        );
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
    if (!this.isOnline || !this.db) return;
    try {
      const scoresRef = this.db.ref("leaderboard");
      scoresRef
        .orderByChild("score")
        .limitToLast(100)
        .on(
          "value",
          (snapshot) => {
            const data = snapshot.val();
            const list = [];
            if (data) {
              Object.keys(data).forEach((key) => {
                list.push({ ...data[key], firebaseKey: key });
              });
              list.sort((a, b) => b.score - a.score);
            }
            // Helyi gyorsítótár frissítése is
            localStorage.setItem("toplista", JSON.stringify(list));
            this.notifySubscribers(list);
          },
          (error) => {
            console.warn(
              "Firebase olvasási hiba (szabályok ellenőrzése szükséges!):",
              error,
            );
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
    if (this.isOnline && this.db) {
      try {
        const snapshot = await this.db
          .ref("leaderboard")
          .orderByChild("score")
          .limitToLast(100)
          .once("value");
        const data = snapshot.val();
        const list = [];
        if (data) {
          Object.keys(data).forEach((key) => {
            list.push({ ...data[key], firebaseKey: key });
          });
          list.sort((a, b) => b.score - a.score);
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
    // Ellenőrizzük mind helyileg, mind online
    const currentScores = await this.getScores();
    const letezo = currentScores.find(
      (i) => i.name.toLowerCase() === jatekosAdat.name.toLowerCase(),
    );
    if (letezo) {
      return { success: false, reason: "duplicate_name" };
    }

    // Helyi mentés azonnal
    currentScores.push(jatekosAdat);
    currentScores.sort((a, b) => b.score - a.score);
    localStorage.setItem("toplista", JSON.stringify(currentScores));

    // Online mentés, ha elérhető
    if (this.isOnline && this.db) {
      try {
        const newRef = this.db.ref("leaderboard").push();
        await newRef.set(jatekosAdat);
        return { success: true, isOnline: true };
      } catch (err) {
        console.warn(
          "Nem sikerült az online mentés a Firebase-be (szabályok tiltják?):",
          err,
        );
        return { success: true, isOnline: false, error: err.message };
      }
    }

    return { success: true, isOnline: false };
  }
}

window.leaderboardService = new LeaderboardService();
