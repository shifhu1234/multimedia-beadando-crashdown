import React from 'react';

export function GameStage() {
  return (
    <main className="game-stage active" id="stagePanel">
      <div id="safeTimer" className="hud-bar">
        <div className="hud-main-row">
          <div className="stat-box">
            <span className="stat-label">Hátralévő idő</span>
            <div className="timer-row">
              <p id="timerDisplay">01:00</p>
            </div>
            <div className="timer-progress-track">
              <div id="timerProgressBar" className="timer-progress-fill"></div>
            </div>
          </div>

          {/* Aktív power-up effektek a HUD közepén (egymás felett, nem ütköznek) */}
          <div id="activeBuffsBar" className="hud-center-buffs">
            <div id="doublePointsBanner" className="buff-pill buff-frenzy hidden">
              <span className="buff-icon">⚡</span>
              <span className="buff-title">2× DUPLÁZÓ</span>
              <span id="frenzyTimerBadge" className="buff-timer">5.0s</span>
            </div>

            <div id="freezeOverlay" className="buff-pill buff-freeze hidden">
              <span className="buff-icon">❄</span>
              <span className="buff-title">IDŐSTOP</span>
              <span id="freezeTimerBadge" className="buff-timer">4.0s</span>
            </div>
          </div>

          <div className="stat-box score-box">
            <span className="stat-label">Pontszám</span>
            <h2>
              <span id="score">0</span>
            </h2>
          </div>
        </div>

        {/* A doboz aljára rögzített információs sáv / kombóméter */}
        <div id="comboIndicatorWrap" className="combo-indicator-bottom-bar">
          <span id="comboIndicator" className="combo-pill">Készen állsz?</span>
        </div>
      </div>

      <div className="canvas-wrapper" id="canvasWrapper">
        <canvas id="crashdownCanvas" width="440" height="440"></canvas>
        {/* Pálya feletti indító és játék végi overlay (kizárólag a pálya felett) */}
        <div id="canvasOverlay" className="canvas-overlay">
          <div className="overlay-card">
            <h2 id="overlayTitle">Crashdown Arcade</h2>
            <p id="overlaySubtitle">
              Kattints vagy érints legalább 3 azonos színű szomszédos blokkot a
              törléshez!
            </p>

            {/* Játék beállítások előnézete indítás előtt */}
            <div id="overlaySettingsBox" className="overlay-settings-box">
              <div className="overlay-setting-header">
                <span
                  id="overlayModeBadge"
                  className="overlay-mode-badge overlay-chip"
                >
                  🎯 Normál
                </span>
                <div className="overlay-setting-pills">
                  <span id="overlayTimeChip" className="overlay-chip">
                    ⏱️ 1 perc (60 mp)
                  </span>
                  <span id="overlayColorChip" className="overlay-chip">
                    🎨 3 szín
                  </span>
                </div>
              </div>
              <p id="overlayModeDesc" className="overlay-mode-desc">
                Kiegyensúlyozott játékmenet minden elérhető power-uppal.
              </p>
            </div>

            <p id="timeUpMessage" style={{ display: 'none' }}>
              Lejárt az idő!
            </p>

            <div className="overlay-action-stack">
              <button
                id="overlaySaveScoreBtn"
                className="btn btn-accent btn-lg"
                style={{ display: 'none' }}
                title="Jelentkezz be az eredményed mentéséhez"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                </svg>
                <span>Eredmény mentése (Bejelentkezés)</span>
              </button>
              <button id="overlayStartBtn" className="btn btn-primary btn-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span id="overlayStartBtnText">Játék indítása</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="stage-actions">
        <button
          id="shuffleButton"
          className="btn btn-shuffle"
          title="Pálya újrakeverése (10 mp újratöltődés)"
        >
          <svg
            className="shuffle-spin-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
          </svg>
          <span>Pálya újrakeverése</span>
          <span id="shuffleCooldownBadge" className="shuffle-badge">
            Kész
          </span>
        </button>
      </div>
    </main>
  );
}
