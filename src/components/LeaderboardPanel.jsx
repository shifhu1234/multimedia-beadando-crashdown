import React from 'react';

export function LeaderboardPanel() {
  return (
    <aside id="leaderboardPanel" className="panel modal leaderboard-panel">
      <div className="panel-header">
        <div>
          <h2>Ranglista</h2>
          <span id="leaderboardSyncTag" className="status-indicator"></span>
        </div>
        <button
          id="openPlayersModalBtn"
          className="btn-user-profile-badge"
          title="Regisztrált játékosok és online jelenlét megtekintése"
        >
          <span>👥 Játékosok</span>
        </button>
      </div>

      <div className="leaderboard-filter-toolbar">
        <div className="lb-filter-box">
          <span className="lb-filter-icon">🎨</span>
          <select
            id="lbFilterColor"
            className="lb-select-input"
            aria-label="Színek száma szűrő"
            defaultValue="all"
          >
            <option value="all">Összes</option>
            <option value="2">2 szín</option>
            <option value="3">3 szín</option>
            <option value="4">4 szín</option>
            <option value="5">5 szín</option>
          </select>
        </div>
        <div className="lb-filter-box">
          <span className="lb-filter-icon">🎯</span>
          <select
            id="lbFilterMode"
            className="lb-select-input"
            aria-label="Játékmód szűrő"
            defaultValue="all"
          >
            <option value="all">Összes</option>
            <option value="normal">Normál</option>
            <option value="chaos">Káosz</option>
            <option value="bomb_frenzy">Robbanás</option>
            <option value="time_rush">Időhajsza</option>
            <option value="no_powerups">Nyers</option>
          </select>
        </div>
        <div className="lb-filter-box">
          <span className="lb-filter-icon">⏱️</span>
          <select
            id="lbFilterTime"
            className="lb-select-input"
            aria-label="Játékidő szűrő"
            defaultValue="all"
          >
            <option value="all">Összes</option>
            <option value="30">30 mp</option>
            <option value="60">1 perc</option>
            <option value="90">90 mp</option>
            <option value="120">2 perc</option>
            <option value="150">2.5 p</option>
            <option value="180">3 perc</option>
          </select>
        </div>
      </div>

      <ul id="toplistaLista" className="leaderboard-list"></ul>
    </aside>
  );
}
