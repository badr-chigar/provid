# Provid — Plateforme e-commerce nutrition

Boutique en ligne de compléments alimentaires avec **espace client** (catalogue, panier, commande) et **espace administrateur** (produits, commandes, tableau de bord). Backend **Spring Boot (Java)** + frontend **React (Vite)**.

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=googlegemini&logoColor=white)

🌐 **Démo live** : [badr-chigar.vercel.app/provid-user.html](https://badr-chigar.vercel.app/provid-user.html) · 👤 **Portfolio** : [badr-chigar.vercel.app](https://badr-chigar.vercel.app)

> Projet personnel de Badr Chigar — Ingénieur d'État en Informatique (EMSI Casablanca), développeur Full Stack Java/Spring & React.

## ✨ Fonctionnalités

**Espace client**
- Catalogue de produits filtrable par catégorie (protéines, vitamines, énergie, minceur).
- Panier persistant (localStorage) avec quantités.
- Passage de commande → décrément automatique du stock côté serveur.
- **Conseil nutrition par IA** : appel réel à l'API Google Gemini (`/api/conseil`), avec repli automatique si la clé n'est pas configurée.

**Espace administrateur**
- Authentification (rôle ADMIN).
- CRUD complet des produits.
- Suivi des commandes avec workflow de statut (En attente → Validée → Expédiée → Livrée).
- Tableau de bord : produits, commandes, chiffre d'affaires, ruptures de stock.

## 🛠️ Stack

| Couche | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router |
| Backend | Spring Boot 2.7, Spring Data JPA, Hibernate |
| Base de données | H2 (démo) / MySQL (production) |
| IA | Google Gemini API (recommandations) |

## 🗂️ Architecture

```
provid/
├── backend/                 API REST Spring Boot
│   └── src/main/java/ma/provid/
│       ├── model/           entités JPA (Produit, Commande, ...)
│       ├── repository/      Spring Data JPA
│       ├── controller/      Produit, Commande, Auth, Stats, Nutrition
│       ├── dto/             objets de transfert
│       └── config/          CORS + jeu de données de démo
└── frontend/                SPA React (Vite)
    └── src/
        ├── pages/           Boutique, Panier, Login, Admin*
        └── components/      ClientLayout, AdminLayout
```

## 🚀 Démarrage

**Backend (port 8080)**
```bash
cd backend
mvn spring-boot:run
```
La base H2 en mémoire est créée et alimentée automatiquement (aucune installation requise).

**Frontend (port 5173)**
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Comptes de démo

| Email | Mot de passe | Rôle |
|---|---|---|
| `admin@provid.ma` | `admin123` | ADMIN |
| `client@provid.ma` | `client123` | CLIENT |

## 🔌 API (extrait)

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/produits` | Catalogue (produits actifs) |
| POST | `/api/commandes` | Passer une commande |
| POST | `/api/auth/login` | Authentification |
| GET | `/api/admin/produits` | Liste admin |
| PATCH | `/api/admin/commandes/{id}/statut` | Changer le statut |
| GET | `/api/admin/stats` | KPIs du tableau de bord |
| POST | `/api/conseil` | Recommandation nutrition (Gemini) |

## 📄 Licence

MIT © Badr Chigar
