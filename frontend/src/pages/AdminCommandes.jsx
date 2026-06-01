import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

const STATUTS = ['EN_ATTENTE', 'VALIDEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];
const LABEL = { EN_ATTENTE: 'En attente', VALIDEE: 'Validée', EXPEDIEE: 'Expédiée', LIVREE: 'Livrée', ANNULEE: 'Annulée' };
const CLS = { EN_ATTENTE: 's-planifie', VALIDEE: 's-en_cours', EXPEDIEE: 's-en_cours', LIVREE: 's-termine', ANNULEE: 's-annule' };

export default function AdminCommandes() {
  const [list, setList] = useState([]);
  const load = () => api.adminCommandes().then(setList);
  useEffect(() => { load(); }, []);
  async function change(id, statut) { await api.setStatut(id, statut); load(); }
  return (
    <table>
      <thead><tr><th>Référence</th><th>Client</th><th>Articles</th><th>Total</th><th>Statut</th><th>Changer</th></tr></thead>
      <tbody>
        {list.map(c => (
          <tr key={c.id}>
            <td>{c.reference}</td>
            <td>{c.clientNom}<br /><span className="muted">{c.clientEmail}</span></td>
            <td>{c.lignes.reduce((s, l) => s + l.quantite, 0)} art.</td>
            <td>{c.total.toFixed(2)} MAD</td>
            <td><span className={'tag ' + CLS[c.statut]}>{LABEL[c.statut]}</span></td>
            <td>
              <select value={c.statut} onChange={e => change(c.id, e.target.value)}>
                {STATUTS.map(s => <option key={s} value={s}>{LABEL[s]}</option>)}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
