import React from 'react';

export function AchievementsModal() {
  return (
    <div id="achievementsModal" className="modal-backdrop hidden">
      <div className="auth-modal-card achievements-modal-card">
        <div className="auth-modal-header">
          <div>
            <h3>🏆 Mérföldkövek & Jelvények</h3>
            <div className="ach-progress-wrap">
              <span className="auth-hint-text">
                Feloldva:{' '}
                <strong id="achievementsSummaryCount" style={{ color: '#fbbf24' }}>
                  0
                </strong>{' '}
                / <strong id="achievementsTotalSummaryCount">100</strong> (
                <span id="achievementsPercent">0%</span>)
              </span>
              <div className="ach-progress-track">
                <div
                  id="achievementsProgressFill"
                  className="ach-progress-fill"
                  style={{ width: '0%' }}
                ></div>
              </div>
            </div>
          </div>
          <button
            id="closeAchievementsModalBtn"
            className="modal-close-x"
            title="Bezárás"
          >
            &times;
          </button>
        </div>

        {/* Szűrőfülek */}
        <div className="achievements-filter-bar">
          <button className="ach-filter-btn active" data-filter="all">
            Mind (<span id="achFilterAllCount">100</span>)
          </button>
          <button className="ach-filter-btn" data-filter="unlocked">
            Feloldva (<span id="achFilterUnlockedCount">0</span>)
          </button>
          <button className="ach-filter-btn" data-filter="locked">
            Zárolva (<span id="achFilterLockedCount">100</span>)
          </button>
        </div>

        {/* Nem-görgős / tágas Kártyás Rács */}
        <div className="achievements-card-grid" id="achievementsList">
          {/* Dinamikusan renderelve */}
        </div>
      </div>
    </div>
  );
}
