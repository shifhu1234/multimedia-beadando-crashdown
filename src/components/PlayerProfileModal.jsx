import React from 'react';

export function PlayerProfileModal() {
  return (
    <div id="playerProfileModal" className="modal-backdrop hidden">
      <div className="auth-modal-card player-profile-modal-card">
        <div className="auth-modal-header">
          <div className="profile-header-info">
            <div className="profile-header-top-row">
              <div id="profileAvatar" className="profile-avatar-circle">
                J
              </div>
              <div className="profile-title-container">
                <h3 id="profilePlayerName">Játékos Neve</h3>
                <div className="profile-title-row">
                  <span id="profilePlayerTitle" className="profile-player-badge">
                    Crashdown Játékos
                  </span>
                  <button
                    id="profileAdminModeToggleBtn"
                    className="profile-admin-toggle-pill"
                    style={{ display: 'none' }}
                    type="button"
                    title="Adminisztrátori funkciók kapcsolása"
                  >
                    🛡️ Admin Mód
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            id="closePlayerProfileModalBtn"
            className="modal-close-x"
            title="Bezárás"
          >
            &times;
          </button>
        </div>

        <div className="profile-content-area">
          {/* 1. Alapstatisztikák Kártyák (Legjobb pont ... Átlagpont) */}
          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <span className="profile-stat-icon">🏆</span>
              <div className="profile-stat-data">
                <span className="profile-stat-label">Legjobb pont</span>
                <strong id="profileBestScore" className="profile-stat-val">
                  0
                </strong>
              </div>
            </div>

            <div className="profile-stat-box">
              <span className="profile-stat-icon">🎮</span>
              <div className="profile-stat-data">
                <span className="profile-stat-label">Lejátszott meccs</span>
                <strong id="profileTotalMatches" className="profile-stat-val">
                  0
                </strong>
              </div>
            </div>

            <div className="profile-stat-box">
              <span className="profile-stat-icon">⏱️</span>
              <div className="profile-stat-data">
                <span className="profile-stat-label">Összes játékidő</span>
                <strong id="profileTotalTime" className="profile-stat-val">
                  0 perc
                </strong>
              </div>
            </div>

            <div className="profile-stat-box">
              <span className="profile-stat-icon">💎</span>
              <div className="profile-stat-data">
                <span className="profile-stat-label">Összes pontszám</span>
                <strong id="profileTotalScore" className="profile-stat-val">
                  0
                </strong>
              </div>
            </div>

            <div className="profile-stat-box">
              <span className="profile-stat-icon">📈</span>
              <div className="profile-stat-data">
                <span className="profile-stat-label">Átlagpont / meccs</span>
                <strong id="profileAvgScore" className="profile-stat-val">
                  0
                </strong>
              </div>
            </div>
          </div>

          {/* 2. Teljesítmény Színmódok szerint */}
          <div className="profile-section">
            <h4 className="profile-section-title">
              📊 Teljesítmény Színmódok szerint
            </h4>
            <div id="profileModesBreakdown" className="profile-modes-list"></div>
          </div>

          {/* 3. Teljesítmény Játékmód szerint */}
          <div className="profile-section">
            <h4 className="profile-section-title">
              🎯 Teljesítmény Játékmód szerint
            </h4>
            <div
              id="profileGameModesBreakdown"
              className="profile-modes-list"
            ></div>
          </div>

          {/* 4. Teljesítmény Játékidő szerint */}
          <div className="profile-section">
            <h4 className="profile-section-title">
              ⏱️ Teljesítmény Játékidő szerint
            </h4>
            <div
              id="profileDurationsBreakdown"
              className="profile-modes-list"
            ></div>
          </div>

          {/* 4.5. Téma Választása */}
          <div id="profileThemeSection" className="profile-section">
            <div className="profile-section-header">
              <div>
                <h4 className="profile-section-title">🎨 Játéktéma Választása</h4>
              </div>
              <div className="section-sort-wrapper">
                <label htmlFor="sortThemesSelect" className="sort-label">
                  Rendezés:
                </label>
                <select
                  id="sortThemesSelect"
                  className="section-sort-select"
                  defaultValue="default"
                >
                  <option value="default">Alapértelmezett</option>
                  <option value="alpha_asc">ABC (A → Z)</option>
                  <option value="alpha_desc">ABC (Z → A)</option>
                  <option value="unlocked_first">Feloldott elöl</option>
                  <option value="locked_first">Zárolt elöl</option>
                  <option value="special_first">Speciális elöl</option>
                </select>
              </div>
            </div>
            <div id="profileThemeGrid" className="profile-theme-grid"></div>
          </div>

          {/* 5. Név Színének Állítása */}
          <div
            id="profileNameColorSection"
            className="profile-section"
            style={{ display: 'none' }}
          >
            <div className="profile-section-header">
              <div>
                <h4 className="profile-section-title">
                  🎨 Név Színének Választása
                </h4>
              </div>
              <div className="section-sort-wrapper">
                <label htmlFor="sortNameColorsSelect" className="sort-label">
                  Rendezés:
                </label>
                <select
                  id="sortNameColorsSelect"
                  className="section-sort-select"
                  defaultValue="default"
                >
                  <option value="default">Alapértelmezett</option>
                  <option value="alpha_asc">ABC (A → Z)</option>
                  <option value="alpha_desc">ABC (Z → A)</option>
                  <option value="unlocked_first">Feloldott elöl</option>
                  <option value="locked_first">Zárolt elöl</option>
                  <option value="special_first">Speciális elöl</option>
                </select>
              </div>
            </div>
            <div
              id="profileNameColorGrid"
              className="profile-name-color-grid"
            ></div>
          </div>

          {/* 6. Rangcím Állítása (Kártyás lista) */}
          <div
            id="profileTitleSection"
            className="profile-section"
            style={{ display: 'none' }}
          >
            <div className="profile-section-header">
              <div>
                <h4 className="profile-section-title">🎖️ Rangcím Választása</h4>
              </div>
              <div className="section-sort-wrapper">
                <label htmlFor="sortTitlesSelect" className="sort-label">
                  Rendezés:
                </label>
                <select
                  id="sortTitlesSelect"
                  className="section-sort-select"
                  defaultValue="default"
                >
                  <option value="default">Alapértelmezett</option>
                  <option value="alpha_asc">ABC (A → Z)</option>
                  <option value="alpha_desc">ABC (Z → A)</option>
                  <option value="unlocked_first">Feloldott elöl</option>
                  <option value="locked_first">Zárolt elöl</option>
                  <option value="special_first">Speciális elöl</option>
                </select>
              </div>
            </div>
            <div id="profileTitleGrid" className="profile-title-grid"></div>
          </div>

          {/* 7. Profilkép Választása */}
          <div
            id="profileAvatarSection"
            className="profile-section"
            style={{ display: 'none' }}
          >
            <div className="profile-section-header">
              <div>
                <h4 className="profile-section-title">🖼️ Profilkép választása</h4>
              </div>
              <div className="section-sort-wrapper">
                <label htmlFor="sortAvatarsSelect" className="sort-label">
                  Rendezés:
                </label>
                <select
                  id="sortAvatarsSelect"
                  className="section-sort-select"
                  defaultValue="default"
                >
                  <option value="default">Alapértelmezett</option>
                  <option value="alpha_asc">ABC (A → Z)</option>
                  <option value="alpha_desc">ABC (Z → A)</option>
                  <option value="unlocked_first">Feloldott elöl</option>
                  <option value="locked_first">Zárolt elöl</option>
                  <option value="special_first">Speciális elöl</option>
                </select>
              </div>
            </div>
            <div id="profileAvatarGrid" className="profile-avatar-grid"></div>
          </div>

          {/* 8. Elért Jelvények */}
          <div className="profile-section">
            <div className="profile-section-header">
              <div>
                <h4 className="profile-section-title">
                  🎖️ Elért Jelvények{' '}
                  <span
                    id="profileBadgeSummary"
                    className="profile-badge-summary-inline"
                  ></span>
                </h4>
              </div>
              <div className="profile-badges-header-right">
                <div className="section-sort-wrapper">
                  <label htmlFor="sortAchievementsSelect" className="sort-label">
                    Rendezés:
                  </label>
                  <select
                    id="sortAchievementsSelect"
                    className="section-sort-select"
                    defaultValue="default"
                  >
                    <option value="default">Alapértelmezett</option>
                    <option value="alpha_asc">ABC (A → Z)</option>
                    <option value="alpha_desc">ABC (Z → A)</option>
                    <option value="unlocked_first">Feloldott elöl</option>
                    <option value="locked_first">Zárolt elöl</option>
                    <option value="reward_first">Jutalmat adók elöl</option>
                  </select>
                </div>
                <div
                  id="profileAdminBadgeActions"
                  className="profile-admin-badge-actions"
                  style={{ display: 'none' }}
                >
                  <button
                    id="profileAdminUnlockAllBtn"
                    type="button"
                    className="admin-inline-btn admin-inline-unlock"
                    title="Összes jelvény feloldása"
                  >
                    🔓 Mind felold
                  </button>
                  <button
                    id="profileAdminLockAllBtn"
                    type="button"
                    className="admin-inline-btn admin-inline-lock"
                    title="Összes jelvény visszazárása"
                  >
                    🔒 Mind zár
                  </button>
                </div>
              </div>
            </div>
            <div
              id="profileAchievementsList"
              className="profile-badges-mini-grid"
            ></div>
          </div>

          {/* 9. Játékelőzmények (Match History) */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h4 className="profile-section-title">
                📜 Legutóbbi Játékok (Előzmények)
              </h4>
              <span id="profileHistorySummary" className="auth-hint-text">
                Utolsó 10 meccs
              </span>
            </div>
            <div id="profileHistoryList" className="profile-history-list"></div>
          </div>

          {/* 10. Jelszó Megváltoztatása */}
          <div
            className="profile-section"
            id="profileChangePasswordSection"
            style={{ display: 'none' }}
          >
            <div className="profile-section-header">
              <h4 className="profile-section-title">🔑 Jelszó Megváltoztatása</h4>
            </div>
            <form
              id="changePasswordForm"
              className="auth-form-fields"
              onSubmit={(e) => e.preventDefault()}
              style={{ marginTop: '6px' }}
            >
              <div className="auth-field">
                <label htmlFor="newPasswordInput">Új jelszó</label>
                <input
                  type="password"
                  id="newPasswordInput"
                  placeholder="Minimum 6 karakter"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="confirmNewPasswordInput">
                  Új jelszó ismétlése
                </label>
                <input
                  type="password"
                  id="confirmNewPasswordInput"
                  placeholder="Ismételd meg az új jelszót"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <p
                id="changePasswordErrorMsg"
                className="auth-error-alert"
                style={{ display: 'none' }}
              ></p>
              <button
                type="submit"
                id="changePasswordSubmitBtn"
                className="btn btn-primary btn-block"
                style={{ height: '38px' }}
              >
                Új jelszó mentése
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
