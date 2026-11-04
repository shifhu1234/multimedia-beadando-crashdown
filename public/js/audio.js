/* ================================================================
   CRASHDOWN ARCADE - AUDIO & HAPTIC FEEDBACK SYSTEM
   ================================================================ */

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

function triggerHaptic(type = 'light') {
    if (!navigator.vibrate) return;
    try {
        if (type === 'light') navigator.vibrate(15);
        else if (type === 'medium') navigator.vibrate([25, 20, 25]);
        else if (type === 'heavy') navigator.vibrate([40, 30, 60]);
    } catch (_) {}
}

// Hangerő gomb és csúszka események bekötése
function initAudioListeners() {
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

    // Telefon elsötétülés / képernyő zárolás / háttérbe küldés kezelése
    let wasMusicPlayingBeforeHidden = false;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (!hatterZene.paused) {
                wasMusicPlayingBeforeHidden = true;
                try { hatterZene.pause(); } catch (_) {}
            } else {
                wasMusicPlayingBeforeHidden = false;
            }
        } else {
            // Visszatéréskor csak akkor indítjuk újra, ha szólt előtte és a játék még fut és nincs némítva
            const isGameActive = typeof jatekFut !== 'undefined' && jatekFut && (typeof vegeAJateknak === 'undefined' || !vegeAJateknak);
            if (wasMusicPlayingBeforeHidden && !toggledVOlume && masterVolume > 0 && isGameActive) {
                try {
                    const p = hatterZene.play();
                    if (p && typeof p.catch === 'function') p.catch(() => {});
                } catch (_) {}
            }
        }
    });

    window.addEventListener('pagehide', () => {
        try { hatterZene.pause(); } catch (_) {}
    });
}
