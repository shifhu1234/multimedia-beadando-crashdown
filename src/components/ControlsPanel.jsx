import React from 'react';

export function ControlsPanel() {
  return (
    <aside className="panel controls-panel" id="controlsPanel">
      {/* Felső Doboz: Játékbeállítások, Játékmód/Modifierek & Indító gombok */}
      <div className="panel-card game-settings-box">
        <div className="brand">
          <div className="brand-icon">
            <span className="tile tile-red"></span>
            <span className="tile tile-yellow"></span>
            <span className="tile tile-green"></span>
            <span className="tile tile-blue"></span>
          </div>
          <div className="brand-text">
            <div className="brand-text-row">
              <h1>CRASHDOWN</h1>
              <span className="engine-tech-badge" title="PixiJS WebGL + React 18 motor">⚡ WebGL</span>
            </div>
            <span className="subtitle">Arcade Block Puzzle</span>
          </div>
        </div>

        <div className="select-option control-group">
          <div className="select-grid">
            <div className="select-field">
              <label htmlFor="colorSelect" className="control-label">
                Színek száma
              </label>
              <div className="select-wrapper">
                <select id="colorSelect" defaultValue="3">
                  <option value="2">2 szín (Könnyű)</option>
                  <option value="3">3 szín (Normál)</option>
                  <option value="4">4 szín (Nehéz)</option>
                  <option value="5">5 szín (Extrém)</option>
                </select>
              </div>
            </div>

            <div className="select-field">
              <label htmlFor="timeSelect" className="control-label">
                Játékidő
              </label>
              <div className="select-wrapper">
                <select id="timeSelect" defaultValue="60">
                  <option value="30">30 mp (Villám)</option>
                  <option value="60">1 perc (Gyors)</option>
                  <option value="90">90 mp (Klasszikus)</option>
                  <option value="120">2 perc (Normál)</option>
                  <option value="150">2.5 perc (Bővített)</option>
                  <option value="180">3 perc (Maraton)</option>
                </select>
              </div>
            </div>

            <div className="select-field select-field-full">
              <label htmlFor="modeSelect" className="control-label">
                Játékmód
              </label>
              <div className="select-wrapper">
                <select id="modeSelect" defaultValue="normal">
                  <option value="normal">Normál</option>
                  <option value="no_powerups">Nyers</option>
                  <option value="chaos">Káosz</option>
                  <option value="time_rush">Időhajsza</option>
                  <option value="bomb_frenzy">Robbanás Mánia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="button-stack">
            <button id="startGameButton" className="btn btn-primary">
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="16"
                height="16"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Játék indítása</span>
            </button>
            <button id="startNewGame" className="btn btn-secondary">
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="16"
                height="16"
              >
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              <span>Új játék kezdése</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alsó Doboz: Téma választó (magyarosítva), Különleges Power-upok & Hangerő */}
      <div className="panel-card game-extra-box">
        <div className="theme-field-wrap">
          <div className="theme-label-row">
            <label htmlFor="themeSelect" className="control-label">
              Téma
            </label>
            <div
              id="themeSelectPalette"
              className="theme-select-palette"
              title="Aktív témapaletta"
            ></div>
          </div>
          <div className="select-wrapper">
            <select id="themeSelect" defaultValue="retro">
              <option value="retro">Retro Játékterem</option>
              <option value="cyber">Kiber Neon</option>
              <option value="candy">Cukorka Pop</option>
              <option value="space">Mélyűr Odüsszeia</option>
              <option value="sunset">Naplemente Szintetizátor</option>
              <option value="forest">Smaragd Vadon</option>
              <option value="lava">Tűzhányó Láva</option>
              <option value="noir">Éjféli Noir</option>
              <option value="ocean">Mélytengeri Misztikum</option>
            </select>
          </div>
        </div>

        <div className="legend-card">
          <h3>Különleges Power-upok</h3>
          <ul className="legend-list">
            <li>
              <span className="legend-badge badge-cyan">2×</span>
              <div>
                <strong>Pontduplázó (5 mp)</strong>
                <small>5 mp-ig a kapott pontokat megduplázza</small>
              </div>
            </li>
            <li>
              <span className="legend-badge badge-pink">⇄</span>
              <div>
                <strong>Cunami sorirtó</strong>
                <small>Törli a teljes vízszintes sort (+100)</small>
              </div>
            </li>
            <li>
              <span className="legend-badge badge-orange">⇅</span>
              <div>
                <strong>Oszloptörlő lézer</strong>
                <small>Törli a teljes függőleges oszlopot (+100)</small>
              </div>
            </li>
            <li>
              <span className="legend-badge badge-green">TNT</span>
              <div>
                <strong>TNT Robbanófej</strong>
                <small>3×3-as zónát robbant ki (+90)</small>
              </div>
            </li>
            <li>
              <span className="legend-badge badge-teal">✦</span>
              <div>
                <strong>Szín-bomba</strong>
                <small>Egy teljes szín összes blokkját törli (+15/db)</small>
              </div>
            </li>
            <li>
              <span className="legend-badge badge-indigo">⟳</span>
              <div>
                <strong>Pálya keverés</strong>
                <small>Újrakeveri az összes blokk színét (+50)</small>
              </div>
            </li>
            <li>
              <span className="legend-badge badge-purple">+5s</span>
              <div>
                <strong>Időbónusz</strong>
                <small>+5 mp extra játékidőt ad</small>
              </div>
            </li>
            <li>
              <span className="legend-badge badge-blue">❄</span>
              <div>
                <strong>Időfagyasztó Jégkocka</strong>
                <small>Megállítja a visszaszámlálót 4 másodpercre</small>
              </div>
            </li>
            <li>
              <span className="legend-badge badge-red">🧲</span>
              <div>
                <strong>Szuper Mágnes</strong>
                <small>Összeránt egy teljes színt egy tömbbe</small>
              </div>
            </li>
          </ul>
        </div>

        <div className="audio-card">
          <div className="audio-row">
            <button
              id="toggleVolBtn"
              className="vol-btn"
              title="Hang némítása / visszakapcsolása (M)"
            >
              <img
                src="images/volume_on_icon.png"
                id="toggleVol"
                alt="Hangerő"
                width="20"
                height="20"
              />
            </button>
            <div className="audio-slider-wrap">
              <div className="audio-label-row">
                <span>Zene / Mester</span>
                <span id="volumeValue">35%</span>
              </div>
              <input
                type="range"
                id="volumeSlider"
                min="0"
                max="100"
                defaultValue="35"
              />
            </div>
          </div>
          <div className="audio-row audio-sfx-row">
            <div
              className="vol-btn vol-sfx-badge"
              title="Effektek hangereje (blokk kiütés, power-upok)"
            >
              <span style={{ fontSize: '14px', lineHeight: 1 }}>🎮</span>
            </div>
            <div className="audio-slider-wrap">
              <div className="audio-label-row">
                <span>Effektek (SFX)</span>
                <span id="sfxVolumeValue">70%</span>
              </div>
              <input
                type="range"
                id="sfxSlider"
                min="0"
                max="100"
                defaultValue="70"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
