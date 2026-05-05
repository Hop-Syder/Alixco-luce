# 🚀 Guide de Déploiement Alixco Luce

Ce guide couvre le déploiement complet du projet (Frontend + Backend + Database) en 3 options.

## 📋 Table des matières

1. [Option A: Railway (Recommandé)](#option-a-railway-recommandé)
2. [Option B: Heroku (Gratuit limité)](#option-b-heroku-gratuit-limité)
3. [Option C: Serveur VPS/Local](#option-c-serveur-vpslocal)
4. [Comparaison des options](#comparaison-des-options)

---

## Option A: Railway (Recommandé) ⭐

Railway est la **meilleure option**: performant, scalable, avec MongoDB intégré.

### 📦 Prérequis
- Compte [Railway.app](https://railway.app)
- GitHub connecté
- Projet pushé sur GitHub

### 🔧 Étape 1: Préparer le Backend

#### 1.1 Créer un `Procfile` (racine du projet)
```
web: cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
```

#### 1.2 Créer `.railwayrc` (configuration Railway)
À la racine du projet:
```json
{
  "environments": {
    "production": {
      "environment": "backend"
    }
  }
}
```

#### 1.3 Vérifier `backend/requirements.txt`
```
fastapi==0.110.1
uvicorn==0.25.0
motor==3.3.1
pymongo==4.5.0
pydantic>=2.6.4
email-validator>=2.2.0
pyjwt>=2.10.1
bcrypt==4.1.3
python-dotenv>=1.0.1
python-multipart>=0.0.9
```

### 🚀 Étape 2: Déployer Backend + Database sur Railway

1. **Accéder à Railway.app**
   - Connexion avec GitHub
   - Créer nouveau projet

2. **Ajouter MongoDB**
   ```
   + New
   → Database
   → MongoDB
   ```
   Railway génère automatiquement `MONGO_URL`

3. **Connecter GitHub**
   ```
   + New
   → GitHub Repo
   → Sélectionner Alixco-luce
   → Select root directory: backend
   ```

4. **Configurer Variables d'Environnement**
   - Railway → Project → Variables
   - Ajouter:
   ```
   JWT_SECRET=votre-secret-jwt-securise-2026
   WHATSAPP_NUMBER=2290197412933
   DB_NAME=alixco_luce
   ENVIRONMENT=production
   DEBUG=False
   CORS_ORIGINS=https://alixco-luce.vercel.app,https://www.alixco-luce.com
   MAX_UPLOAD_SIZE=10485760
   ```
   - `MONGO_URL` est auto-généré

5. **Déployer**
   - Push vers GitHub
   - Railway déploie automatiquement
   - URL backend: `https://alixco-luce-production.up.railway.app`

### 💻 Étape 3: Déployer Frontend sur Vercel

1. **Préparation**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run build
   ```

2. **Connexion Vercel**
   - [vercel.com](https://vercel.com)
   - Import → GitHub repo
   - Project name: `alixco-luce-frontend`
   - Framework: React

3. **Configurer env vars (Vercel → Settings → Environment Variables)**
   ```
   REACT_APP_API_URL=https://alixco-luce-production.up.railway.app
   REACT_APP_NAME=Alixco Luce
   REACT_APP_WHATSAPP_NUMBER=2290197412933
   REACT_APP_ENV=production
   ```

4. **Déployer**
   - Click "Deploy"
   - URL frontend: `https://alixco-luce-frontend.vercel.app`

### 📤 Étape 4: Mettre à jour Backend (CORS)

Backend → Railway → Variables:
```
CORS_ORIGINS=https://alixco-luce-frontend.vercel.app
```

### ✅ Vérification
```bash
# Tester backend
curl https://alixco-luce-production.up.railway.app/api/categories

# Tester frontend
# Ouvrir https://alixco-luce-frontend.vercel.app
```

### 💰 Coûts Railway
- **Gratuit**: 5$ crédit/mois
- **MongoDB**: ~2$ (512MB)
- **Backend**: ~3$ (CPU + RAM)
- **Total**: Gratuit si usage léger, sinon ~5-10$/mois

---

## Option B: Heroku (Gratuit limité)

Heroku a supprimé le free tier en 2022, mais vous pouvez utiliser des alternatives.

### 📦 Prérequis
- Compte [Heroku.com](https://heroku.com)
- Crédit pour payer (~7$/mois minimum)
- CLI Heroku installée

### 🔧 Étape 1: Préparer le Backend

#### 1.1 Créer `Procfile` (racine du projet)
```
web: cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app
```

#### 1.2 Installer dépendances supplémentaires
```bash
cd backend
pip install gunicorn
echo "gunicorn==21.2.0" >> requirements.txt
```

### 🚀 Étape 2: Déployer Backend + Database

1. **Connexion Heroku**
   ```bash
   heroku login
   heroku create alixco-luce-backend
   ```

2. **Ajouter MongoDB Atlas** (gratuit 512MB)
   - [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Créer cluster gratuit
   - Copier `MONGO_URL`

3. **Configurer variables Heroku**
   ```bash
   heroku config:set MONGO_URL="mongodb+srv://user:pwd@cluster.mongodb.net/alixco_luce"
   heroku config:set JWT_SECRET="votre-secret-jwt-securise-2026"
   heroku config:set WHATSAPP_NUMBER="2290197412933"
   heroku config:set DB_NAME="alixco_luce"
   heroku config:set ENVIRONMENT="production"
   heroku config:set DEBUG="False"
   ```

4. **Déployer**
   ```bash
   git push heroku main
   # Attendre la construction
   # URL: https://alixco-luce-backend.herokuapp.com
   ```

### 💻 Étape 3: Déployer Frontend Vercel (même qu'Option A)

Ajouter env var:
```
REACT_APP_API_URL=https://alixco-luce-backend.herokuapp.com
```

### 💰 Coûts Heroku
- **Backend dyno**: 7$ minimum/mois
- **MongoDB Atlas**: Gratuit (512MB)
- **Total**: ~7-15$/mois

---

## Option C: Serveur VPS/Local

Déployer sur votre serveur personnel (DigitalOcean, Linode, AWS, etc.).

### 📦 Prérequis
- Serveur VPS (DigitalOcean: 5$/mois)
- SSH accès
- Domaine (optionnel)
- Node.js 18+, Python 3.9+, MongoDB

### 🔧 Étape 1: Préparer le Serveur

```bash
# SSH vers le serveur
ssh root@your-server-ip

# Installer dépendances
apt-get update
apt-get install -y nodejs npm python3 python3-pip mongodb nginx

# Créer utilisateur app
useradd -m -s /bin/bash app
```

### 🚀 Étape 2: Installer Backend

```bash
cd /home/app
git clone https://github.com/votre-username/Alixco-luce.git
cd Alixco-luce/backend

# Créer virtual env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Créer .env
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=alixco_luce
JWT_SECRET=votre-secret-jwt-securise-2026
WHATSAPP_NUMBER=2290197412933
ENVIRONMENT=production
DEBUG=False
CORS_ORIGINS=https://your-domain.com
EOF

# Tester
python server.py
# Ctrl+C
```

### 💻 Étape 3: Installer Frontend

```bash
cd /home/app/Alixco-luce/frontend

# Build
npm install --legacy-peer-deps
npm run build

# Créer .env.production
cat > .env.production << EOF
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_NAME=Alixco Luce
REACT_APP_WHATSAPP_NUMBER=2290197412933
REACT_APP_ENV=production
EOF

# Build
npm run build
# Dossier 'build' prêt à servir
```

### 🔧 Étape 4: Configurer Nginx

```bash
sudo cat > /etc/nginx/sites-available/alixco << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /home/app/Alixco-luce/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Images uploads
    location /uploads/ {
        alias /home/app/Alixco-luce/backend/uploads/;
    }
}
EOF

# Activer
sudo ln -s /etc/nginx/sites-available/alixco /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 🔐 Étape 5: Configurer SSL (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 🚀 Étape 6: Démarrer les Services

#### Service Backend (systemd)
```bash
sudo cat > /etc/systemd/system/alixco-backend.service << 'EOF'
[Unit]
Description=Alixco Backend FastAPI
After=network.target

[Service]
User=app
WorkingDirectory=/home/app/Alixco-luce/backend
Environment="PATH=/home/app/Alixco-luce/backend/venv/bin"
ExecStart=/home/app/Alixco-luce/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8000

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable alixco-backend
sudo systemctl start alixco-backend
```

#### Service Frontend (servi par Nginx)
Frontend build est automatiquement servi par Nginx

### ✅ Vérification
```bash
# Vérifier backend
curl http://localhost:8000/api/categories

# Vérifier frontend
# Ouvrir https://your-domain.com

# Voir logs
sudo journalctl -u alixco-backend -f
```

### 💰 Coûts VPS
- **DigitalOcean**: 5-12$/mois (droplet)
- **Domaine**: 10-15$/an
- **Total**: ~15-40$/an

---

## Comparaison des Options

| Critère | Railway | Heroku | VPS |
|---|---|---|---|
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Coût** | 5-10$/mois | 7-15$/mois | 5-12$/mois |
| **Performance** | Excellent | Bon | Excellent |
| **Scalabilité** | Automatique | Automatique | Manuel |
| **Maintenance** | Minimale | Minimale | Manuelle |
| **Support** | Excellent | Bon | N/A |
| **Libre config** | Non | Non | Oui |
| **Démarrage** | 10 min | 20 min | 1 heure |

### 🎯 Recommandation
- **MVP/Prototype**: Railway ⭐ (fastest)
- **Production MVP**: Railway + domaine custom
- **Budget limité**: VPS DigitalOcean
- **Croissance**: Railway → Kubernetes

---

## 🚨 Checklist Avant Déploiement

- [ ] `.env` configuré avec variables production
- [ ] MONGO_URL testée
- [ ] CORS_ORIGINS configuré correctement
- [ ] JWT_SECRET changé (pas la valeur par défaut)
- [ ] Frontend build testé localement
- [ ] Backend tested avec `curl`
- [ ] Domaine pointant correctement (DNS)
- [ ] SSL/HTTPS activé
- [ ] Backups MongoDB configurés
- [ ] Monitoring/Logs configurés

---

## 🔗 Ressources Utiles

- [Railway Docs](https://docs.railway.app)
- [Heroku Docs](https://devcenter.heroku.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Docs](https://vercel.com/docs)
- [Let's Encrypt](https://letsencrypt.org)

---

**Questions?** Contactez l'équipe Alixco Luce ou consultez la documentation officielle.

> 👤 Rédigé par: @hopsyder - Nexus AI Dev Team  
> 📅 Date: Mai 2026
