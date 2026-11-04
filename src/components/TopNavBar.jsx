import React from 'react';

export function TopNavBar() {
  return (
    <header className="top-nav-bar">
      <div className="user-profile-bar" id="userProfileBar">
        <button id="openAuthModalBtn" className="top-nav-btn btn-auth-trigger">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>Bejelentkezés / Regisztráció</span>
        </button>

        {/* Különálló doboz: Profil & Név */}
        <button
          id="openMyProfileBtn"
          className="top-nav-btn btn-user-box"
          style={{ display: 'none' }}
          title="Kattints a saját profilod és rangod megtekintéséhez"
        >
          <span id="userAvatarDot" className="user-avatar-symbol">👤</span>
          <span id="currentUserNameLabel" className="current-user-name">Játékos</span>
        </button>

        {/* Különálló doboz: Admin Mód Kapcsoló (csak jogosult fióknak) */}
        <button
          id="navAdminModeToggleBtn"
          className="top-nav-btn btn-admin-toggle"
          style={{ display: 'none' }}
          type="button"
          title="Adminisztrátori funkciók be/kikapcsolása"
        >
          <span id="navAdminModeIcon">🛡️</span>
          <span id="navAdminModeText">Admin Mód</span>
        </button>

        {/* Különálló doboz: Kilépés */}
        <button
          id="logoutBtn"
          className="top-nav-btn btn-logout-box"
          style={{ display: 'none' }}
          title="Kijelentkezés"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
          <span>Kilépés</span>
        </button>
      </div>

      {/* Mobilos fülek */}
      <nav className="mobile-nav" id="mobileNav">
        <button className="mobile-tab-btn active" data-target="stagePanel">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
          <span>Játék</span>
        </button>
        <button className="mobile-tab-btn" data-target="controlsPanel">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
          <span>Beállítások</span>
        </button>
        <button className="mobile-tab-btn" data-target="leaderboardPanel">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <span>Ranglista</span>
        </button>
      </nav>
    </header>
  );
}
