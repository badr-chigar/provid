import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

const vide = { nom: '', marque: '', prix: 0, stock: 0, description: '', categorie: null, actif: true };

export default function AdminProduits() {
  const [list, setList] = useState([]);
  const [cats, setCats] = useState([]);
  const [f, setF] = useState(vide);
  const [err, setErr] = useState('');
  const load = () => api.adminProduits().then(setList).catch(e => setErr(e.message));
  useEffect(() => { load(); api.categories().then(setCats); }, []);

  async function add(e) {
    e.preventDefault(); setErr('');
    try {
      const body = { ...f, prix: +f.prix, stock: +f.stock,
        categorie: f.categorieId ? { id: +f.categorieId } : null };
      await api.creerProduit(body); setF(vide); load();
    } catch (e) { setErr(e.message); }
  }
  async function del(id) { if (confirm('Supprimer ce produit ?')) { await api.supprimerProduit(id); load(); } }

  return (
    <div>
      <form className="row-form" onSubmit={add}>
        <input placeholder="Nom" value={f.nom} onChange={e => setF({ ...f, nom: e.target.value })} required />
        <input placeholder="Marque" value={f.marque} onChange={e => setF({ ...f, marque: e.target.value })} />
        <select value={f.categorieId || ''} onChange={e => setF({ ...f, categorieId: e.target.value })}>
          <option value="">Catégorie</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        <input type="number" step="0.01" placeholder="Prix" value={f.prix} onChange={e => setF({ ...f, prix: e.target.value })} style={{ width: 90 }} />
        <input type="number" placeholder="Stock" value={f.stock} onChange={e => setF({ ...f, stock: e.target.value })} style={{ width: 80 }} />
        <button type="submit">+ Ajouter</button>
      </form>
      {err && <div className="error">{err}</div>}
      <table>
        <thead><tr><th>Produit</th><th>Catégorie</th><th>Marque</th><th>Prix</th><th>Stock</th><th>État</th><th></th></tr></thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id}>
              <td>{p.nom}</td>
              <td>{p.categorie ? p.categorie.nom : '—'}</td>
              <td>{p.marque}</td>
              <td>{p.prix.toFixed(2)}</td>
              <td>{p.stock === 0 ? <span className="tag warn">0</span> : p.stock}</td>
              <td>{p.actif ? <span className="tag ok">Actif</span> : <span className="tag">Masqué</span>}</td>
              <td><button className="link-danger" onClick={() => del(p.id)}>Suppr.</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
