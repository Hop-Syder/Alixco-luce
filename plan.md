# plan.md — Alixco Luxe (plateforme e-commerce + commande WhatsApp)

## 1) Objectifs
- Créer une plateforme e-commerce **100% FR** pour **Alixco Luxe** (Bénin) avec devise **XOF (FCFA)**.
- Permettre la **commande via WhatsApp uniquement**: panier → création commande en DB → redirection **wa.me** avec message pré-rempli.
- Offrir un **site public premium artisanal** + un **dashboard admin** (produits, services, catégories, commandes, clients, stock).
- Authentification **email + mot de passe** (bcrypt) pour clients + admin (comptes séparés).

## 2) Étapes d’implémentation (par phases)

### Phase 1 — POC Core Flow (Isolation)
> Core = “Créer une commande + générer le lien WhatsApp correct + persister en MongoDB”.

1) **Backend POC (FastAPI)**
- Modèles minimalistes: Product, CartItem, Order.
- Endpoint `POST /api/poc/orders`:
  - input: client (nom/tel/adresse), items (id, qty, notes), totals
  - crée `orderNumber` + enregistre en MongoDB (status `pending`)
  - retourne `whatsappUrl` (URL-encoded) vers `https://wa.me/2290197412933?...`
- Endpoint `GET /api/poc/orders/{id}` pour vérifier la persistance.

2) **Frontend POC (React)**
- Page unique “POC commande”:
  - 2 produits mockés (ou chargés du backend)
  - panier simple + champ notes de personnalisation
  - bouton “Valider via WhatsApp” → appelle backend → redirige vers `whatsappUrl`.

3) **Validation POC (bloquant avant suite)**
- Vérifier: encodage message, lisibilité WhatsApp, total correct, notes incluses, DB persistée.
- Fix jusqu’à: 10/10 exécutions sans erreur.

**User stories (Phase 1)**
1. En tant que visiteur, je peux ajouter un article test au panier.
2. En tant que visiteur, je peux ajouter une note de personnalisation à l’article.
3. En tant que visiteur, je peux saisir nom/téléphone/adresse.
4. En tant que visiteur, je peux valider et être redirigé vers WhatsApp avec un message complet.
5. En tant que gérant, je peux retrouver la commande enregistrée en base avec statut `pending`.

---

### Phase 2 — Développement V1 (site public + admin, MVP complet)
1) **Schéma MongoDB (collections)**
- `users` (customers), `admins`, `products`, `services`, `categories`, `orders` (+ éventuellement `inventoryEvents`).

2) **Backend FastAPI (V1)**
- Auth JWT + bcrypt:
  - customers: register/login/profile
  - admins: admin login séparé + rôles (simple: `isAdmin`/collection séparée)
- Produits:
  - CRUD admin, listing public, featured, stock, prix FCFA, images multiples
- Services:
  - CRUD admin + listing public
- Catégories:
  - CRUD admin + listing public
- Commandes:
  - création depuis panier (avec notes) + status workflow
  - admin: liste + détail + update status
- WhatsApp:
  - util central `build_whatsapp_message(order)` (format propre)

3) **Gestion images (MVP)**
- Choix MVP: stockage **filesystem** (`/uploads`) + URL servie par FastAPI (évite Mongo qui grossit).
- Upload multi-images via endpoint admin.

4) **Frontend React (V1) — UI premium artisanal**
- Stack: React Router + Tailwind + shadcn/ui + Context (auth/cart) + localStorage.
- Pages publiques:
  - Accueil (hero, catégories, produits en vedette, services, à-propos, bouton WhatsApp flottant)
  - Catalogue (grid, recherche, filtres catégorie/prix, tri)
  - Détail produit (galerie, prix, notes, qty, add-to-cart, commander WhatsApp)
  - Services (listing)
  - Panier (édition quantités, notes, total, checkout WhatsApp)
  - Auth (register/login) + Profil (infos + historique commandes)
- Admin:
  - Login admin
  - Dashboard (KPIs, commandes récentes, alertes stock)
  - Produits (CRUD + images + featured)
  - Services (CRUD)
  - Catégories (CRUD)
  - Commandes (liste, détail, statut)
  - Clients (liste + historique)

5) **Données initiales**
- Seed des catégories:
  - Tableaux personnalisés, Gravure bois, Gravure métal, Bijoux personnalisés, Vêtements personnalisés, Accessoires.

6) **Fin de phase: 1 round E2E testing**
- Appeler `testing_agent_v3` et corriger bugs bloquants.

**User stories (Phase 2)**
1. En tant que visiteur, je peux parcourir l’accueil et voir les catégories + produits vedettes.
2. En tant que visiteur, je peux filtrer/rechercher/ trier les produits.
3. En tant que visiteur, je peux consulter un produit et ajouter une note de personnalisation avant ajout panier.
4. En tant que client, je peux créer un compte et revoir mon historique de commandes.
5. En tant qu’admin, je peux créer un produit avec plusieurs images, stock et prix.
6. En tant qu’admin, je peux voir les commandes et changer leur statut.

---

### Phase 3 — Ajout fonctionnalités (production-friendly) + durcissement
1) **Dashboard analytics & charts**
- Ventes 7/30 jours, top produits, pending vs delivered.

2) **Inventaire & alertes stock**
- Seuil stock bas configurable + vue dédiée.

3) **Bulk price update**
- Par catégorie / pourcentage / sélection de produits.

4) **Qualité & UX**
- Optimisations perf (pagination, debounce search)
- États vides, loading skeletons, erreurs API uniformes
- SEO basique (meta, OG), pages légales (mentions, confidentialité) si souhaité.

5) **Fin de phase: 1 round E2E testing**
- Appeler `testing_agent_v3` et corriger.

**User stories (Phase 3)**
1. En tant qu’admin, je peux voir un graphe des ventes des 30 derniers jours.
2. En tant qu’admin, je reçois des alertes “stock faible”.
3. En tant qu’admin, je peux augmenter/diminuer les prix en masse.
4. En tant que client, je vois des messages d’erreur clairs si un produit est en rupture.
5. En tant que visiteur mobile, je peux naviguer rapidement avec une UI fluide.

---

### Phase 4 — Polish & finalisation
- Affiner la direction artistique (palette bois/or/bronze, typographies élégantes).
- Animations légères, amélioration galerie images, compression.
- Sécurité: rate-limit login, validation stricte, logs.
- Documentation d’exploitation (env vars, seed, backup).

**User stories (Phase 4)**
1. En tant que visiteur, je perçois une marque “luxe artisanal” cohérente sur toutes les pages.
2. En tant que client, je peux commander en 3 clics depuis le panier sur mobile.
3. En tant qu’admin, je peux gérer le catalogue sans friction.
4. En tant que gérant, je peux retrouver rapidement une commande via numéro.
5. En tant que gérant, je peux mettre en avant des produits vedettes pour des campagnes.

## 3) Next actions (immédiates)
1. Créer `/app/memory/test_credentials.md` avec:
   - admin email: `admin@alixcoluxe.com`
   - mot de passe par défaut: (à définir au démarrage, puis changeable)
2. Démarrer Phase 1 POC: endpoints `create order` + `whatsappUrl` + mini UI panier.
3. Valider POC (message WhatsApp + persistance) avant d’élargir.

## 4) Critères de succès
- **Core**: une commande est enregistrée en MongoDB et la redirection WhatsApp contient toutes les infos (items, qty, notes, total, adresse, numéro commande).
- **Public**: catalogue, filtres, détail produit, panier, checkout WhatsApp, responsive.
- **Admin**: CRUD produits/services/catégories, gestion commandes + statuts, stock.
- **Qualité**: 0 bug bloquant après testing E2E; UI cohérente premium; performances correctes (pagination/tri/recherche).