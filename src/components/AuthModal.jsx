import React from 'react';

export function AuthModal() {
  return (
    <div id="authModal" className="modal-backdrop hidden">
      <div className="auth-modal-card">
        <div className="auth-modal-header">
          <h3 id="authModalTitle">Bejelentkezés</h3>
          <button id="closeAuthModalBtn" className="modal-close-x" title="Bezárás">
            &times;
          </button>
        </div>

        <div className="auth-tab-row">
          <button id="tabLoginBtn" className="auth-tab-btn active">
            Bejelentkezés
          </button>
          <button id="tabRegisterBtn" className="auth-tab-btn">
            Új regisztráció
          </button>
        </div>

        {/* Függőben lévő játékeredmény értesítő */}
        <div
          id="authPendingNotice"
          className="pending-score-box"
          style={{ display: 'none' }}
        >
          <div className="pending-icon">⭐</div>
          <div>
            <strong>Játékeredmény elmentése!</strong>
            <p>
              Jelentkezz be vagy regisztrálj, és az elért{' '}
              <span id="pendingScoreVal" className="pending-highlight">
                0
              </span>{' '}
              pontod azonnal bekerül a ranglistára!
            </p>
          </div>
        </div>

        <form
          id="authForm"
          className="auth-form-fields"
          onSubmit={(e) => e.preventDefault()}
        >
          <div
            className="auth-field"
            id="displayNameField"
            style={{ display: 'none' }}
          >
            <label htmlFor="authDisplayName">
              Játékosnév (A ranglistán ez látszik)
            </label>
            <input
              type="text"
              id="authDisplayName"
              placeholder="pl. BlockMaster99"
              maxLength={30}
              autoComplete="nickname"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="authEmail">E-mail cím</label>
            <input
              type="email"
              id="authEmail"
              placeholder="pelda@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="authPassword">Jelszó</label>
            <input
              type="password"
              id="authPassword"
              placeholder="Minimum 6 karakter"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </div>

          <div className="auth-sub-actions" id="forgotPasswordWrap">
            <button
              type="button"
              id="forgotPasswordBtn"
              className="link-btn-subtle"
            >
              Elfelejtetted a jelszavad?
            </button>
          </div>

          <p
            id="authErrorMsg"
            className="auth-error-alert"
            style={{ display: 'none' }}
          ></p>

          <button
            type="submit"
            id="authSubmitBtn"
            className="btn btn-primary btn-block btn-lg"
          >
            Bejelentkezés
          </button>
        </form>
      </div>
    </div>
  );
}
