import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const links = [
  ['/admin', 'Tableau de bord'],
  ['/admin/produits', 'Produits'],
  ['/admin/commandes', 'Commandes'],
];

export default function AdminLayout() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('provid_user') || '{}');
  function logout() {
    localStorage.removeItem('provid_token');
    localStorage.removeItem('provid_user');
    nav('/login');
  }
  return (
    <div className="app">
      <aside className="side">
        <div className="brand">Provid <span>Admin</span></div>
        <div className="sub">E-commerce nutrition</div>
        <div className="lab">GESTION</div>
        <nav>
          {links.map(([to, l]) => (
            <NavLink key={to} to={to} end className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <div className="who">{user.nom} · admin</div>
          <button onClick={logout}>Déconnexion</button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="tt"><h1>Espace administrateur</h1><div className="sub">Pilotage de la boutique Provid</div></div>
          <div className="avatar">{(user.nom || 'AD').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>
        </header>
        <div className="content"><Outlet /></div>
      </div>
    </div>
  );
}
