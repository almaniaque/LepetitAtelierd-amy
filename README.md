# Le Petit Atelier d’Amy — Angular + Spring Boot + Supabase

Boutique artisanale réalisée à la demande (aucun stock). Refonte complète de l’ancien site, DA crème / rose poudré / beige.

## Stack
- `frontend/` : Angular 22 standalone + Bootstrap 5, panier, catalogue, espace client, administration, pages légales.
- `backend/` : Java 21 / Spring Boot 3.5.7, Spring Security, sessions HTTPOnly, bcrypt, CSRF, JPA, Flyway.
- **Supabase PostgreSQL** : base SQL hébergée. **Le frontend ne se connecte jamais directement à Supabase.** Aucune clé `service_role` ou URL de connexion PostgreSQL dans Angular/GitHub.
- Les montants sont des entiers en centimes, les prix sont recalculés dans le backend.

## Configuration Supabase (une fois)
1. Créer un projet dans https://supabase.com/dashboard.
2. Dans **Connect > Session pooler**, copier *host*, *port 5432*, *database*, *user* et mot de passe. Le pooler session est un choix simple en IPv4 pour JDBC. La connexion directe peut être utilisée si l'hébergement supporte IPv6.
3. Définir les variables d'environnement **DB_URL**, **DB_USER**, **DB_PASSWORD** sur la machine où tourne le backend. **Ne jamais valider un vrai `.env` dans Git.** Exemple de structure dans `.env.example` (hôte fictif à remplacer).
4. `DB_URL` est de forme `jdbc:postgresql://HOTE:5432/postgres?sslmode=require`. Ne pas copier directement `postgresql://...` sans le préfixe JDBC.
5. Flyway installe le schéma et le catalogue initial au premier lancement (migration `V1__schema.sql`). **Ne pas exécuter la migration deux fois manuellement.** Un projet Supabase dédié est recommandé.
6. Limiter les connexions (`DB_POOL_SIZE=5` par défaut). En cas d'utilisation du pooler transactionnel (6543), il faut une configuration JDBC adaptée; le mode session 5432 est recommandé pour cette version.

## Développement Windows 11
**Prérequis sur le PC :** JDK 21, Maven 3.9+ et Node 24.15.0+ (ou 22.22.3+) et npm. Les fichiers `package.json`, `pom.xml`, `angular.json` et scripts de démarrage sont déjà présents. Les dépendances ne sont **pas** vendori­sées : elles sont téléchargées lors de `npm install` et `mvn` sur une machine connectée à Internet.

- Définir les variables d’environnement `DB_URL`, `DB_USER`, `DB_PASSWORD` dans le terminal, sans les mettre dans le dépôt.
- Définir `COOKIE_SECURE=false` **uniquement** pour un lancement HTTP local. En production, HTTPS et `COOKIE_SECURE=true` obligatoires.
- Terminal 1 : `cd frontend`, puis `npm install` et `npm start`.
- Terminal 2 : `cd backend`, puis `mvn spring-boot:run` après configuration Supabase et installation de Maven.
- Aucun script `.cmd` n’est nécessaire.
- Le proxy Angular transmet `/api` vers `localhost:8081`. En production, utiliser un reverse proxy HTTPS sur un même domaine pour `/api` et l’interface Angular.

## GitHub (dépôt existant)
Le dépôt cible est **https://github.com/almaniaque/LepetitAtelierd-amy**. Il contient l’ancien site sur `master`. Ne pas forcer le push et préserver l’historique.

```cmd
git clone https://github.com/almaniaque/LepetitAtelierd-amy.git
cd LepetitAtelierd-amy
git checkout -b refonte/angular-spring-supabase
```

Copier **le contenu** de ce ZIP à la racine du clone (ne pas garder le dossier `lpada_v2` en parent), puis :

```cmd
git add .
git commit -m "feat: boutique Angular Spring Boot et Supabase"
git push -u origin refonte/angular-spring-supabase
```

Créer ensuite une pull request vers `master`, vérifier les contrôles GitHub Actions puis fusionner. L'ancien site peut rester versionné pendant la transition.

## Sécurité / limites
- L'utilisateur public peut créer uniquement un rôle CUSTOMER; aucun compte ADMIN par inscription.
- Un administrateur initial doit être inséré par une procédure sécurisée (bcrypt), **jamais** par un mot de passe fixe dans le code.
- Cookies : session `LPADA_SESSION` HttpOnly, Secure en production, SameSite Lax. Le cookie CSRF `XSRF-TOKEN` doit rester lisible par Angular pour l'en-tête CSRF; c'est distinct du cookie de session.
- Pas de paiement CB opérationnel dans ce socle. Les commandes sont des demandes; le chiffre d'affaires encaissé dépend d'une saisie administrative `PAID`.
- Les CGV/CGU/mentions légales/RGPD et les informations sur la rétractation sont des **modèles à compléter et vérifier** avant lancement commercial.
- Avant production : anti-bruteforce, administration renforcée, gestion des photos, sauvegardes Supabase, observabilité, tests d'intégration, protection des données et audit sécurité.

## État des vérifications
Les fichiers de configuration et le workflow CI sont fournis, mais ce ZIP n'inclut pas `node_modules` ni les JAR Maven. L'environnement de génération n'a pas d'accès réseau npm/Maven : **aucun build réussi n'est revendiqué**. La validation complète s'effectuera sur GitHub Actions dès la publication de la branche ou en local connecté.

## Passage à Angular 22 (4 novembre 2026)
- `@angular/*` : versions `^22.2.0` (Angular 22 stable), TypeScript `~6.0.3`, Zone.js `~0.16.2`.
- `frontend/angular.json` : ancienne propriété `defaultProject` supprimée.
- CI GitHub Actions : Node.js `24.15.0`.
- Il faut une version compatible de Node.js (24.15.0+, 22.22.3+ ou 26+). Node 22.16.0 **n'est pas compatible**.
- Dans `frontend`, remplacer l'installation précédente : `npm install`, puis `npm run build` et `npm start`. Si npm conserve un arbre de dépendances incohérent, supprimer le dossier `node_modules` et le `package-lock.json` **uniquement pour régénérer les dépendances**, puis relancer `npm install`.
- Les fichiers source Angular, feuilles de style, photos, composants, fonctionnalités boutique et backend ont été conservés.
- **Validation non effectuée** : le réseau npm est indisponible dans l'environnement de préparation. Aucun succès de compilation Angular 22 n'est revendiqué. Valider `npm run build` localement et dans GitHub Actions.
- Source version Node / TypeScript : https://angular.dev/reference/versions
- Guide de mise à jour : https://angular.dev/update-guide
