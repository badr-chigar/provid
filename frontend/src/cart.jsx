import React, { createContext, useContext, useEffect, useState } from 'react';

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('provid_cart') || '[]'));
  useEffect(() => { localStorage.setItem('provid_cart', JSON.stringify(items)); }, [items]);

  const add = (produit) => setItems(prev => {
    const ex = prev.find(i => i.id === produit.id);
    if (ex) return prev.map(i => i.id === produit.id ? { ...i, quantite: i.quantite + 1 } : i);
    return [...prev, { id: produit.id, nom: produit.nom, prix: produit.prix, quantite: 1 }];
  });
  const setQte = (id, q) => setItems(prev => prev.map(i => i.id === id ? { ...i, quantite: Math.max(1, q) } : i));
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.prix * i.quantite, 0);
  const count = items.reduce((s, i) => s + i.quantite, 0);

  return <CartCtx.Provider value={{ items, add, setQte, remove, clear, total, count }}>{children}</CartCtx.Provider>;
}
