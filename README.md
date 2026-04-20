# 💰 Mon Budget

Application web personnelle de suivi budgétaire avec logique d'enveloppes, installable comme une vraie app sur ton téléphone (PWA).

**Stack :** Vite + React + Tailwind + Supabase (PostgreSQL + Auth)

---

## ✨ Fonctionnalités

- 🎯 Gestion d'enveloppes budgétaires (budget / dépensé / restant)
- 📊 Dashboard avec **rythme cible vs rythme réel** et projection fin de mois
- ⚠️ Alertes visuelles à 80% et 100% du budget
- 📅 Dépenses avec date + heure, groupées par semaine
- 🔍 Filtres par mois et par catégorie
- 🌙 Mode sombre
- 📥 Export JSON / CSV
- 📱 Installable comme app (PWA)
- 🔐 Multi-utilisateurs sécurisé (RLS Supabase)

---

## 🚀 Installation en 4 étapes

### Prérequis
- **Node.js 18+** → [nodejs.org](https://nodejs.org)
- Un compte **Supabase** (gratuit) → [supabase.com](https://supabase.com)
- Un compte **GitHub** (gratuit)
- Un compte **Vercel** (gratuit) → [vercel.com](https://vercel.com)

---

### Étape 1 — Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) et clique **Start your project**
2. Crée une nouvelle organisation si nécessaire, puis un nouveau projet :
   - **Name** : `mon-budget` (ou ce que tu veux)
   - **Database Password** : génère un mot de passe fort (note-le)
   - **Region** : choisis `Frankfurt (eu-central-1)` ou la plus proche de toi
3. Attends que le projet soit créé (~2 min)
4. Une fois créé, va dans **SQL Editor** (icône base de données à gauche → SQL Editor)
5. Clique **+ New query**, copie-colle le contenu du fichier [`supabase/schema.sql`](./supabase/schema.sql)
6. Clique **Run** (ou Cmd/Ctrl + Enter) → tu dois voir "Success. No rows returned"

### Étape 2 — Récupérer tes clés Supabase

1. Dans ton projet Supabase, va dans **Project Settings** (roue crantée en bas à gauche) → **API**
2. Copie :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** (la clé publique, sous "Project API keys")

### Étape 3 — Tester l'app en local

```bash
# Installer les dépendances
npm install

# Créer le fichier .env à la racine
cp .env.example .env
```

Édite le fichier `.env` et colle tes clés Supabase :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxx
```

Puis lance le serveur de dev :

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

Crée un compte (email + mot de passe) — tu verras tes enveloppes par défaut + les **900 € pré-remplis** dans "Déjà dépensé (à ventiler)".

> **Astuce** : par défaut, Supabase demande une **confirmation par email** à l'inscription. Si tu ne veux pas de ça (juste pour toi), va dans **Authentication → Providers → Email** et décoche **"Confirm email"**.

### Étape 4 — Déployer sur Vercel (avec GitHub)

**4.1 — Pousser le code sur GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
```

Crée un nouveau repo sur [github.com](https://github.com) (peu importe le nom, ex: `budget-app`), puis :

```bash
git remote add origin https://github.com/TON_USERNAME/budget-app.git
git branch -M main
git push -u origin main
```

**4.2 — Déployer sur Vercel**

1. Va sur [vercel.com](https://vercel.com) et connecte-toi avec GitHub
2. Clique **Add New → Project**
3. Sélectionne ton repo `budget-app` → **Import**
4. Vercel détecte Vite automatiquement, laisse les settings par défaut
5. **IMPORTANT** — Dans la section **Environment Variables**, ajoute :
   - `VITE_SUPABASE_URL` → ton URL Supabase
   - `VITE_SUPABASE_ANON_KEY` → ta clé anon Supabase
6. Clique **Deploy** → attends 1-2 min

Tu obtiens une URL type `mon-budget-xxx.vercel.app`. 🎉

### Étape 5 — Installer comme app sur ton téléphone

**Sur iPhone (Safari) :**
1. Ouvre l'URL Vercel dans **Safari**
2. Touche le bouton **Partager** (carré avec flèche)
3. Fais défiler et touche **Sur l'écran d'accueil**
4. Touche **Ajouter**

Tu as maintenant une icône "Budget" sur ton écran d'accueil, qui s'ouvre en plein écran comme une vraie app.

**Sur Android (Chrome) :**
1. Ouvre l'URL dans Chrome
2. Menu (3 points) → **Ajouter à l'écran d'accueil** (ou **Installer l'application**)

---

## 🔄 Mettre à jour l'app

À chaque modification que tu fais (ou que je te fournis) :

```bash
git add .
git commit -m "Description des changements"
git push
```

Vercel redéploie automatiquement. L'app installée sur ton tel se met à jour toute seule à la prochaine ouverture (grâce à la PWA).

---

## 📁 Structure du projet

```
budget-app/
├── src/
│   ├── components/       # UI réutilisable
│   │   ├── Dashboard.jsx
│   │   ├── EnvelopeCard.jsx
│   │   ├── EnvelopesModal.jsx
│   │   ├── ExpenseModal.jsx
│   │   ├── History.jsx
│   │   ├── Login.jsx
│   │   ├── Modal.jsx
│   │   └── SettingsModal.jsx
│   ├── hooks/            # Logique Supabase
│   │   ├── useAuth.js
│   │   ├── useEnvelopes.js
│   │   └── useExpenses.js
│   ├── lib/              # Helpers
│   │   ├── constants.js  # Enveloppes par défaut + 900€
│   │   ├── helpers.js    # Formatage, calculs rythme
│   │   └── supabase.js
│   ├── pages/
│   │   └── Home.jsx      # Page principale
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   ├── favicon.svg
│   └── icons/            # Icônes PWA 192/512
├── supabase/
│   └── schema.sql        # À exécuter dans Supabase
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🛠️ Commandes utiles

```bash
npm run dev        # Dev server (localhost:5173)
npm run build      # Build production → dossier dist/
npm run preview    # Preview du build
```

---

## 🔧 Personnalisation rapide

- **Changer les enveloppes par défaut** : `src/lib/constants.js`
- **Changer le montant pré-rempli** (900€) : `src/lib/constants.js`
- **Changer les couleurs/thème** : `tailwind.config.js`
- **Changer le nom et les icônes** : `vite.config.js` (section `manifest`)

---

## 📝 Notes

- Les données sont stockées dans Supabase (PostgreSQL) avec Row Level Security : chaque utilisateur ne voit que ses données.
- L'app fonctionne hors-ligne pour la lecture après la première connexion (service worker PWA). Les écritures nécessitent la connexion.
- Supabase plan gratuit : 500 MB de DB, largement suffisant pour des années de dépenses perso.
