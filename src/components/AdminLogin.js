'use client';

import { useState } from 'react';

export default function AdminLogin({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === correctPassword) {
      onAuthenticated(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-card-wrapper">
        {/* Decorative orbs */}
        <div className="admin-login__orb admin-login__orb--1" />
        <div className="admin-login__orb admin-login__orb--2" />

        <form
          className={`admin-login-card ${shake ? 'admin-login-card--shake' : ''}`}
          onSubmit={handleSubmit}
        >
          <div className="admin-login__icon-wrapper">
            <span className="admin-login__icon">🔐</span>
          </div>

          <h1 className="admin-login__title">Painel Administrativo</h1>
          <p className="admin-login__subtitle">
            Insira a senha para acessar o dashboard de respostas
          </p>

          <div className="admin-login__input-group">
            <div className="admin-login__input-wrapper">
              <span className="admin-login__input-icon">🔑</span>
              <input
                type="password"
                className="admin-login__input"
                placeholder="Digite a senha..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                autoFocus
              />
            </div>

            {error && (
              <div className="admin-login__error">
                <span>⚠️</span> Senha incorreta. Tente novamente.
              </div>
            )}
          </div>

          <button type="submit" className="admin-login__btn">
            <span>Entrar</span>
            <span className="admin-login__btn-arrow">→</span>
          </button>

          <a href="/" className="admin-login__back-link">
            ← Voltar ao formulário
          </a>
        </form>
      </div>
    </div>
  );
}
