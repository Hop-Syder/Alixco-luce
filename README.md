# 🌱 Alixco Luce

> Plateforme intelligente de gestion d'éclairage et de serres agricoles

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/Hop-Syder/Alixco-luce)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## 📋 Table des matières

- [À propos](#-à-propos)
- [Architecture](#-architecture)
- [Démarrage rapide](#-démarrage-rapide)
- [Stack technologique](#-stack-technologique)
- [Structure du projet](#-structure-du-projet)
- [Configuration](#-configuration)
- [Développement](#-développement)
- [Déploiement](#-déploiement)
- [Tests](#-tests)
- [Documentation](#-documentation)

## 🎯 À propos

**Alixco Luce** est une application web fullstack conçue pour optimiser la gestion de l'éclairage et des opérations agricoles en serre. Elle permet aux agriculteurs et aux responsables de:

- ✅ Contrôler les systèmes d'éclairage en temps réel
- ✅ Monitorer les conditions environnementales
- ✅ Gérer les catégories de produits et les commandes
- ✅ Accéder à un tableau de bord administrateur complet
- ✅ Consulter les services et articles disponibles

## 🏗️ Architecture

```
Alixco-luce/
├── frontend/                 # Application React (UI/UX)
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages application
│   │   ├── contexts/        # Context API (Auth, Cart, Admin)
│   │   ├── lib/             # Utilitaires, API client
│   │   └── hooks/           # Custom React hooks
│   └── public/              # Assets statiques
│
├── backend/                  # API Flask/Python
│   ├── server.py            # Serveur principal
│   └── requirements.txt      # Dépendances Python
│
└── docs/                    # Documentation projet
```

## ⚡ Démarrage rapide

### Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (ou **yarn**)
- **Python** >= 3.9
- **pip** ou **conda**

### Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Hop-Syder/Alixco-luce.git
   cd Alixco-luce
   ```

2. **Installer les dépendances Frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Installer les dépendances Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

### Lancer l'application

#### Mode développement

**Terminal 1 - Frontend**
```bash
cd frontend
npm start
```
→ Accessible sur `http://localhost:3000`

**Terminal 2 - Backend**
```bash
# Terminal 1 - Backend
cd backend && python server.py

# Terminal 2 - Frontend  
cd frontend && npm start
```
→ API disponible sur `http://localhost:5000`

#### Build production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
pip install -r requirements.txt
```

## 🛠️ Stack technologique

### Frontend
| Technologie | Utilisation |
|---|---|
| **React** | Framework UI |
| **Tailwind CSS** | Styling avancé |
| **React Router** | Navigation |
| **Axios** | Requêtes HTTP |
| **Context API** | State management |
| **Shadcn/ui** | Composants UI premium |

### Backend
| Technologie | Utilisation |
|---|---|
| **Flask** | Framework API |
| **Python** | Logique métier |
| **SQLAlchemy** | ORM (optionnel) |
| **JWT** | Authentification |

## 📂 Structure détaillée

### Frontend (`/frontend`)
```
src/
├── components/
│   ├── admin/               # Layout administrateur
│   ├── ui/                  # Composants primitifs (button, card, etc.)
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── Skeletons.jsx
│   └── WhatsAppFloat.jsx
├── pages/
│   ├── admin/               # Pages admin
│   ├── Home.jsx
│   ├── Catalog.jsx
│   ├── Cart.jsx
│   ├── Profile.jsx
│   └── ...
├── contexts/
│   ├── AuthContext.js       # Authentification utilisateur
│   ├── AdminAuthContext.js  # Authentification admin
│   └── CartContext.js       # Panier
├── hooks/
│   └── use-toast.js
├── lib/
│   ├── api.js               # Configuration axios
│   └── utils.js             # Fonctions utilitaires
└── App.js
```

### Backend (`/backend`)
```
├── server.py                # Point d'entrée
├── requirements.txt         # Dépendances Python
└── ...                      # Modules métier
```

## ⚙️ Configuration

### Variables d'environnement Frontend

Créer `.frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Alixco Luce
```

### Variables d'environnement Backend

Créer `backend/.env`:
```env
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your-secret-key-here
```

## 👨‍💻 Développement

### Standards de code

- **ESLint** + **Prettier** pour le frontend
- **PEP 8** pour le backend
- **Clean Code** et **SOLID principles**

### Branche de développement

```bash
git checkout -b feature/nom-feature
# ... faire les changements ...
git push origin feature/nom-feature
```

## 🚀 Déploiement

### Frontend

```bash
cd frontend
npm run build
# Puis déployer le dossier 'build' sur Vercel, Netlify, etc.
```

### Backend

```bash
cd backend
# Déployer sur Railway, Heroku, AWS, etc.
python server.py
```

## 🧪 Tests

```bash
# Frontend (Jest + React Testing Library)
cd frontend
npm test

# Backend (Pytest)
cd backend
pytest
```

## 📚 Documentation

- [Plan de développement](./plan.md)
- [Guidelines de design](./design_guidelines.md)
- [Résultats des tests](./test_result.md)

## 👥 Auteur

**@hopsyder** - Nexus AI Dev Team

## 📄 Licence

Distributed under the MIT License. See LICENSE file for more information.

---

**Pour contribuer** : Consultez les guidelines de développement et créez une pull request ! 🚀

This project is proprietary software. All rights reserved. Contact the owners for usage rights.

## 🤝 Contributing

Contributions are welcome! Please follow the standard contribution guidelines:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This is a private project. For commercial licensing and usage rights, please contact the project owners.
