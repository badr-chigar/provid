import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useCart } from '../cart.jsx';

export default function Boutique() {
  const [produits, setProduits] = useState([]);
  const [cats, setCats] = useState([]);
  const [filtre, setFiltre] = useState(null);
  const [err, setErr] = useState('');
  const { add } = useCart();

  useEffect(() => {
    api.produits().then(setProduits).catch(e => setErr(e.message));
    api.categories().then(setCats).catch(() => {});
  }, []);

  const liste = filtre ? produits.filter(p => p.categorie && p.categorie.id === filtre) : produits;

  return (
    <div>
      <section className="hero">
        <h1>Votre nutrition, <em>optimisée</em>.</h1>
        <p>Protéines, vitamines et compléments sélectionnés pour vos objectifs.</p>
      </section>

      <div className="chips">
        <button className={!filtre ? 'chip on' : 'chip'} onClick={() => setFiltre(null)}>Tout</button>
        {cats.map(c => (
          <button key={c.id} className={filtre === c.id ? 'chip on' : 'chip'} onClick={() => setFiltre(c.id)}>{c.nom}</button>
        ))}
      </div>

      {err && <div className="error">{err}</div>}

      <div className="grid">
        {liste.map(p => (
          <article className="card" key={p.id}>
            <div className="card-img">{p.nom.charAt(0)}</div>
            <div className="card-body">
              <div className="card-cat">{p.categorie ? p.categorie.nom : ''} · {p.marque}</div>
              <h3>{p.nom}</h3>
              <p className="card-desc">{p.description}</p>
              <div className="card-foot">
                <span className="price">{p.prix.toFixed(2)} MAD</span>
                {p.stock > 0
                  ? <button className="btn-primary" onClick={() => add(p)}>Ajouter</button>
                  : <span className="rupture">Rupture</span>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
