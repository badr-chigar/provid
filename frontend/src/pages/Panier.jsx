import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart.jsx';
import { api } from '../api.js';

export default function Panier() {
  const { items, setQte, remove, total, clear } = useCart();
  const [form, setForm] = useState({ clientNom: '', clientEmail: '', adresse: '' });
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function commander(e) {
    e.preventDefault(); setErr('');
    try {
      const cmd = await api.passerCommande({
        ...form,
        items: items.map(i => ({ produitId: i.id, quantite: i.quantite })),
      });
      setOk(cmd); clear();
    } catch (e) { setErr(e.message); }
  }

  if (ok) return (
    <div className="confirm">
      <div className="check">✓</div>
      <h2>Commande confirmée</h2>
      <p>Référence <b>{ok.reference}</b> — total <b>{ok.total.toFixed(2)} MAD</b>.</p>
      <button className="btn-primary" onClick={() => nav('/')}>Retour à la boutique</button>
    </div>
  );

  if (items.length === 0) return (
    <div className="empty"><p>Votre panier est vide.</p><button className="btn-primary" onClick={() => nav('/')}>Voir la boutique</button></div>
  );

  return (
    <div className="panier">
      <div className="panier-list">
        <h2>Mon panier</h2>
        {items.map(i => (
          <div className="line" key={i.id}>
            <div className="line-img">{i.nom.charAt(0)}</div>
            <div className="line-info"><b>{i.nom}</b><span>{i.prix.toFixed(2)} MAD</span></div>
            <input type="number" min="1" value={i.quantite} onChange={e => setQte(i.id, +e.target.value)} />
            <div className="line-total">{(i.prix * i.quantite).toFixed(2)}</div>
            <button className="link-danger" onClick={() => remove(i.id)}>✕</button>
          </div>
        ))}
        <div className="panier-total">Total : <b>{total.toFixed(2)} MAD</b></div>
      </div>
      <form className="panier-form" onSubmit={commander}>
        <h3>Livraison</h3>
        <label>Nom complet<input required value={form.clientNom} onChange={e => setForm({ ...form, clientNom: e.target.value })} /></label>
        <label>Email<input type="email" required value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} /></label>
        <label>Adresse<textarea required value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} /></label>
        {err && <div className="error">{err}</div>}
        <button className="btn-primary" type="submit">Valider la commande ({total.toFixed(2)} MAD)</button>
      </form>
    </div>
  );
}
