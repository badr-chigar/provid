const BASE = '/api';
const token = () => localStorage.getItem('provid_token');

async function req(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: 'Bearer ' + token() } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Erreur serveur');
  return res.status === 204 ? null : res.json();
}

export const api = {
  produits: () => req('/produits'),
  produit: (id) => req('/produits/' + id),
  categories: () => req('/categories'),
  passerCommande: (data) => req('/commandes', { method: 'POST', body: JSON.stringify(data) }),
  login: (email, motDePasse) => req('/auth/login', { method: 'POST', body: JSON.stringify({ email, motDePasse }) }),
  conseil: (objectif) => req('/conseil', { method: 'POST', body: JSON.stringify({ objectif }) }),
  // admin
  adminProduits: () => req('/admin/produits'),
  creerProduit: (d) => req('/admin/produits', { method: 'POST', body: JSON.stringify(d) }),
  modifierProduit: (id, d) => req('/admin/produits/' + id, { method: 'PUT', body: JSON.stringify(d) }),
  supprimerProduit: (id) => req('/admin/produits/' + id, { method: 'DELETE' }),
  adminCommandes: () => req('/admin/commandes'),
  setStatut: (id, statut) => req('/admin/commandes/' + id + '/statut', { method: 'PATCH', body: JSON.stringify({ statut }) }),
  stats: () => req('/admin/stats'),
};
