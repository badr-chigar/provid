import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api.stats().then(setS).catch(e => setErr(e.message)); }, []);
  if (err) return <div className="error">{err}</div>;
  if (!s) return <div className="muted">Chargement…</div>;
  const cards = [
    ['Produits', s.produits, 'accent'],
    ['Commandes', s.commandes, 'purple'],
    ["Chiffre d'affaires", (s.chiffreAffaires || 0).toLocaleString('fr-FR') + ' MAD', 'ok'],
    ['En rupture', s.ruptures, s.ruptures > 0 ? 'warn' : 'ok'],
  ];
  return (
    <div>
      <div className="kpis">
        {cards.map(([l, v, c]) => (
          <div key={l} className={'kpi ' + c}><div className="kpi-v">{v}</div><div className="kpi-l">{l}</div></div>
        ))}
      </div>
      <h2>Commandes en attente : {s.enAttente}</h2>
      <p className="muted">Gérez les produits et le suivi des commandes depuis le menu de gauche.</p>
    </div>
  );
}
