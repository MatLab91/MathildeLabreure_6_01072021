# OpenClassrooms P6 - API sécurisée pour une application d'avis gastronomiques
6ème projet de la formation de développeur web de OpenClassrooms

## Scénario
Développement (Backend) d'une application d'avis gastronomiques So Peckoko sur les sauces pimentées. 

## Contraintes
- L’application exécute toutes les opérations de la base de données et impose des schémas de données stricts.
- Utilisation du framework Express.
- Le projet est hébergé par un serveur Node.JS.
- Le projet utilise une base de données MongoDB.
- L'application utilise un plug-in Mongoose approprié pour garantir que toutes les erreurs de la base de données sont signalées.
- Le mot de passe des utilisateurs est stocké dans la base de données de manière chiffrée.
- Toutes les données personnelles de la base de données sont stockées avec une méthode de masquage.
- L'application applique strictement l'authentification sur tous les routes.
- Il n'y a pas de régression dans l’application frontend.

## Fonctionnalités implémentées
- Création d'utilisateurs (CRUD)
- Les utilisateurs pourront
  - Voir les sauces postées par tous les utilisateurs
  - Publier des sauces
  - Modifier la sauce qu'ils ont postée
  - Supprimer la sauce qu'ils ont postée
- Sur chaque posts, les utilisateurs pourront
  - Liker une sauce
  - Disliker une sauce
- Autres
  - possibilité de se déconnecter

## Technologies utilisées
- Backend
  - Serveur **Node.js** avec Framework **Express**
  - Base de Données **MongoDB** 
  - **API REST**
  - bcrypt
  - Mongoose
  - nodemon
- Frontend
  - Angular
