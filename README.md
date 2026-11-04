# Le Petit Atelier d’Amy — Angular 22 / Spring Boot 4.1.2 / PostgreSQL VPS

Boutique artisanale de créations à la demande : oursons, bouquets, fragrances, fondants, compositions personnalisées. Direction artistique de l'atelier conservée. Aucune gestion de stock n'est prévue.

## Stack

- `frontend/` : Angular 22 + Bootstrap, vitrine et espaces client/admin.
- `backend/` : Java 21, Spring Boot 4.1.2, Spring Security, sessions serveur, bcrypt, protection CSRF, Flyway, JPA.
- PostgreSQL 18 : base locale de développement ou PostgreSQL privé hébergé sur le VPS. **Supabase n'est plus utilisé.**
- Les montants sont enregistrés en centimes ; les commandes doivent être distinguées des encaissements. Aucun paiement CB opérationnel n'est inclus dans ce socle.

## Installation / lancement sur Windows dans VS Code

1. Disposer de Java 21, Maven, Node.js compatible Angular 22, npm, et PostgreSQL local.
2. Préparer une base `lpada_dev` et un rôle `lpada_app` : voir `deployment/postgresql/create-local.sql`.
3. Ouvrir `README_PATCH_VPS.md` et configurer les variables d'environnement **dans le terminal backend**. Ne pas mettre de secrets dans Git.
4. Depuis `frontend` : `npm install` puis `npm start` ; boutique sur `http://localhost:4300/`.
5. Depuis `backend` : `mvn clean verify` puis `mvn spring-boot:run` ; API sur `http://localhost:8081/`. Angular transmet `/api` via son proxy en développement.

Le profil `local` est sélectionné par défaut. Il vise `127.0.0.1:5432/lpada_dev` et ne requiert pas SSL sur loopback. Le profil `prod` demande explicitement `DB_URL`, `DB_USER` et `DB_PASSWORD` ; aucun retour automatique vers une autre base n'est prévu. Les migrations SQL sont dans `backend/src/main/resources/db/migration/` : `V1__schema.sql` est **inchangée** dans ce patch.

## Déploiement VPS

Voir `deployment/README_DEPLOIEMENT.md` : Nginx+HTTPS devant Angular et Spring Boot, PostgreSQL non accessible depuis Internet, service systemd non privilégié, sauvegardes externalisées chiffrées via Restic et stratégie de restauration.

Les fichiers sous `deployment/` sont des **gabarits**, pas une infrastructure déjà opérationnelle. GitHub Actions compile et teste mais ne déploie pas automatiquement. Les sauvegardes doivent être réellement configurées, surveillées et restaurées en test avant ouverture commerciale.

## Sécurité et conformité

Session `HttpOnly`, `Secure` en production et `SameSite=Lax`; cookie CSRF distinct ; droits admin contrôlés côté backend. Le compte ADMIN initial doit être créé par une procédure sécurisée et non par un mot de passe inscrit dans le code. Les pages juridiques constituent des modèles à compléter avant lancement. Audit sécurité, tests fonctionnels, protections anti-bruteforce, solution de paiement, et sauvegardes restent à valider.

## Validation

Ce patch a été vérifié statiquement (fichiers de configuration YAML, syntaxe Bash et archive ZIP). Il n'a pas été compilé ni testé contre ton PostgreSQL ou un VPS dans cet environnement. Les versions source Angular et Java de la livraison précédente sont conservées.
