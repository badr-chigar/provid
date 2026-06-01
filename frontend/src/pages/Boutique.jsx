import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useCart } from '../cart.jsx';

const OBJECTIFS = ['Prise de masse', 'Perte de poids', 'Énergie & endurance', 'Forme générale'];

export default function Boutique() {
  const [produits, setProduits] = useState([]);
  const [cats, setCats] = useState([]);
  const [filtre, setFiltre] = useState(null);
  const [err, setErr] = useState('');
  const { add } = useCart();

  // --- Conseil nutrition (API Gemini) ---
  const [objectif, setObjectif] = useState(OBJECTIFS[0]);
  const [conseil, setConseil] = useState(null);
  const [loadingConseil, setLoadingConseil] = useState(false);

  useEffect(() => {
    api.produits().then(setProduits).catch(e => setErr(e.message));
    api.categories().then(setCats).catch(() => {});
  }, []);

  async function demanderConseil() {
    setLoadingConseil(true); setConseil(null);
    try { setConseil(await api.conseil(objectif)); }
    catch (e) { setConseil({ recommandation: 'Service indisponible : ' + e.message, source: 'erreur' }); }
    finally { setLoadingConseil(false); }
  }

  const liste = filtre ? produits.filter(p => p.categorie && p.categorie.id === filtre) : produits;

  return (
    <div>
      <section className="hero">
        <h1>Votre nutrition, <em>optimisée</em>.</h1>
        <p>Protéines, vitamines et compléments sélectionnés pour vos objectifs.</p>
      </section>

      <section className="conseil">
        <div className="conseil-head">
          <div>
            <h3>🤖 Conseil nutrition personnalisé</h3>
            <p className="muted">Propulsé par l'IA — choisissez votre objectif.</p>
          </div>
          <div className="conseil-form">
            <select value={objectif} onChange={e => setObjectif(e.target.value)}>
              {OBJECTIFS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <button className="btn-primary" onClick={demanderConseil} disabled={loadingConseil}>
              {loadingConseil ? 'Analyse…' : 'Obtenir un conseil'}
            </button>
          </div>
        </div>
        {conseil && (
          <div className="conseil-result">
            <p>{conseil.recommandation}</p>
            <span className={'src ' + (conseil.source === 'gemini' ? 'live' : '')}>
              {conseil.source === 'gemini' ? '✓ Généré par Gemini' : 'Conseil par défaut (clé Gemini non configurée)'}
            </span>
          </div>
        )}
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
