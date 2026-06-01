import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Login() {
  const [email, setEmail] = useState('admin@provid.ma');
  const [mdp, setMdp] = useState('admin123');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault(); setErr('');
    try {
      const { token, user } = await api.login(email, mdp);
      localStorage.setItem('provid_token', token);
      localStorage.setItem('provid_user', JSON.stringify(user));
      nav(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (e) { setErr(e.message); }
  }
  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <div className="brand big">Provid <span>Admin</span></div>
        <p className="muted">Connexion à l’espace de gestion</p>
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Mot de passe<input type="password" value={mdp} onChange={e => setMdp(e.target.value)} /></label>
        {err && <div className="error">{err}</div>}
        <button type="submit">Se connecter</button>
        <small className="muted">Démo : admin@provid.ma / admin123</small>
      </form>
    </div>
  );
}
