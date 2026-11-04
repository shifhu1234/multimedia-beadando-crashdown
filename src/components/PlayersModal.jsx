import React from 'react';

export function PlayersModal() {
  return (
    <>
      <div id="playersModal" className="modal-backdrop hidden">
        <div className="auth-modal-card players-modal-card">
          <div className="auth-modal-header">
            <div className="players-modal-header-info">
              <h3>👥 Játékosok & Jelenlét</h3>
              <div className="players-modal-counters">
                <span
                  id="onlinePlayersCountBadge"
                  className="players-presence-pill online"
                >
                  🟢 0 online
                </span>
                <span
                  id="totalPlayersCountBadge"
                  className="players-presence-pill total"
                >
                  0 regisztrált
                </span>
              </div>
            </div>
            <button
              id="closePlayersModalBtn"
              className="modal-close-x"
              title="Bezárás"
            >
              &times;
            </button>
          </div>

          <div className="players-modal-toolbar">
            <div className="players-modal-search-bar">
              <span className="players-search-icon">🔍</span>
              <input
                type="text"
                id="playerSearchInput"
                className="players-search-input"
                placeholder="Játékos keresése név szerint..."
                autoComplete="off"
              />
            </div>
            <div className="section-sort-wrapper players-sort-wrapper">
              <label htmlFor="sortPlayersSelect" className="sort-label">
                Rendezés:
              </label>
              <select
                id="sortPlayersSelect"
                className="section-sort-select"
                defaultValue="online_first"
              >
                <option value="online_first">🟢 Online elöl</option>
                <option value="alpha_asc">ABC (A → Z)</option>
                <option value="alpha_desc">ABC (Z → A)</option>
                <option value="best_score">🏆 Legjobb pont</option>
                <option value="total_matches">🎮 Meccsszám</option>
                <option value="offline_first">⚪ Offline elöl</option>
              </select>
            </div>
          </div>

          <div id="playersListContainer" className="players-roster-list"></div>
        </div>
      </div>

      {/* Lebegő intelligens tooltip a jelvényekhez (nem vágódik le az ablak szélén) */}
      <div
        id="profileBadgeFloatingTooltip"
        className="profile-floating-tooltip"
      ></div>

      <div id="toastContainer" className="toast-container"></div>
    </>
  );
}
