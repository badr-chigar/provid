import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../cart.jsx';

export default function ClientLayout() {
  const { count } = useCart();
  const nav = useNavigate();
  return (
    <div className="shop">
      <header className="shop-head">
        <div className="logo" onClick={() => nav('/')}>Provid<span>.</span></div>
        <nav className="shop-nav">
          <Link to="/">Boutique</Link>
          <a href="#/login">Espace admin</a>
        </nav>
        <button className="cart-btn" onClick={() => nav('/panier')}>
          Panier {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </header>
      <main className="shop-main"><Outlet /></main>
      <footer className="shop-foot">© 2026 Provid — Nutrition &amp; compléments · Badr Chigar</footer>
    </div>
  );
}
