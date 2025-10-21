# Netflix Clone - Application de Streaming

## Description
Clone Netflix est une application de streaming moderne développée avec React, TypeScript et Node.js. Cette application permet de regarder des films et séries avec une interface utilisateur intuitive et des fonctionnalités de sécurité avancées.

## Fonctionnalités

### 🎬 Streaming Vidéo
- Lecture de vidéos avec support audio
- Interface de lecture moderne et responsive
- Navigation fluide entre les contenus

### 🔒 Sécurité Avancée
- Protection des médias contre le téléchargement non autorisé
- Tokens HMAC sécurisés avec expiration
- Détection automatique des téléchargeurs (IDM, wget, curl)
- Corruption automatique des fichiers pour les accès non autorisés

### 👤 Gestion des Utilisateurs
- Authentification sécurisée
- Gestion des profils utilisateurs
- Système d'abonnement

### 🎯 Interface Utilisateur
- Design moderne inspiré de Netflix
- Navigation intuitive
- Recherche de contenu
- Catégories et genres

## Technologies Utilisées

### Frontend
- **React** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants UI

### Backend
- **Node.js** avec Express
- **MongoDB** pour la base de données
- **JWT** pour l'authentification
- **Stripe** pour les paiements

## Installation et Démarrage

### Prérequis
- Node.js 18+
- MongoDB
- Bun (optionnel)

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/Armando0151/Clone-Netflix.git
cd Clone-Netflix
```

2. **Installer les dépendances Backend**
```bash
cd backend
npm install
```

3. **Installer les dépendances Frontend**
```bash
cd ../frontend
npm install
```

4. **Configuration**
- Copier `.env.example` vers `.env` dans le dossier backend
- Configurer les variables d'environnement

5. **Démarrer l'application**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Structure du Projet

```
Clone-Netflix/
├── backend/          # API Node.js
│   ├── routes/       # Routes API
│   ├── models/       # Modèles MongoDB
│   ├── middlewares/  # Middlewares de sécurité
│   └── services/     # Services métier
├── frontend/         # Application React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   └── store/       # State management
│   └── public/       # Assets statiques
```

## Sécurité

L'application inclut plusieurs couches de sécurité :

- **Protection des Médias** : Les vidéos et images sont uniquement accessibles dans l'application
- **Tokens HMAC** : Authentification cryptographique avec expiration
- **Détection de Téléchargeurs** : Blocage automatique des outils de téléchargement
- **CSP** : Content Security Policy pour protéger contre les attaques XSS

## Développement

### Scripts Disponibles

**Backend**
```bash
npm start      # Démarrer le serveur
npm run dev    # Mode développement
```

**Frontend**
```bash
npm run dev    # Démarrer le serveur de développement
npm run build  # Build de production
npm run preview # Prévisualiser le build
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## Licence

Ce projet est développé pour un usage éducatif et démonstratif.
