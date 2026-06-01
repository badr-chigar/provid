import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './cart.jsx';
import ClientLayout from './components/ClientLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Boutique from './pages/Boutique.jsx';
import Panier from './pages/Panier.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProduits from './pages/AdminProduits.jsx';
import AdminCommandes from './pages/AdminCommandes.jsx';

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('provid_user') || '{}');
  return user.role === 'ADMIN' ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Boutique />} />
            <Route path="/panier" element={<Panier />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/produits" element={<AdminProduits />} />
            <Route path="/admin/commandes" element={<AdminCommandes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </CartProvider>
  );
}
