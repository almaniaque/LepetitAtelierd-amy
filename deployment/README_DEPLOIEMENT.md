# Déploiement VPS — LPADA

Ces fichiers sont des **gabarits**, pas un déploiement exécuté. Aucun mot de passe n'est fourni. Le VPS doit être une instance séparée d'Accord.

## Architecture

- Nginx publie Angular en HTTPS et transfère `/api/` à Spring Boot sur `127.0.0.1:8081`.
- PostgreSQL reste sur `127.0.0.1:5432` et **ne doit jamais être exposé** dans le pare-feu public.
- Spring Boot tourne sous un utilisateur Linux non privilégié `lpada` ; les migrations Flyway sont appliquées au démarrage. Dans ce socle, le même rôle SQL possède son schéma : envisager un rôle de migration séparé avant production.
- Sessions HTTPOnly et Secure en production. Certificat TLS requis. Pas de paiement CB intégré dans ce socle.

## Préparation manuelle (Ubuntu/Debian)

1. Provisionner le VPS et installer Java 21, PostgreSQL 18, Nginx et un outil TLS (Certbot). Vérifier la compatibilité exacte des versions avec la distribution.
2. Activer un pare-feu : 22/TCP (administration restreinte), 80/TCP, 443/TCP. **Ne pas ouvrir 5432 ni 8081**.
3. Configurer PostgreSQL avec `listen_addresses = 'localhost'` et `pg_hba.conf` restrictif. Depuis `sudo -u postgres psql`, utiliser `deployment/postgresql/create-prod.sql` puis `\password lpada_app` pour créer un secret fort. Vérifier les permissions du schéma `public` pour le rôle de migration.
4. Créer un utilisateur système `lpada` sans accès SSH interactif, et `/srv/lpada/current` (propriétaire `lpada`) ; créer `/etc/lpada/backend.env`, propriété root, mode `0600` :

```dotenv
DB_URL=jdbc:postgresql://127.0.0.1:5432/lpada_prod?sslmode=disable
DB_USER=lpada_app
DB_PASSWORD=SECRET_NON_COMMITE
DB_POOL_SIZE=5
SERVER_PORT=8081
COOKIE_SECURE=true
```

5. Compiler sur une machine autorisée ou dans GitHub Actions : `cd backend && mvn clean verify && mvn -DskipTests package` ; compiler Angular : `cd frontend && npm ci && npm run build`. Le résultat dépend de la configuration Angular `outputPath` : choisir **le dossier qui contient `index.html`**, souvent `frontend/dist/lpada/browser/`.
6. Copier le jar sous `/srv/lpada/current/backend.jar` et les fichiers Angular dans `/var/www/lpada/current/`. Installer et adapter `deployment/systemd/lpada-api.service.example` (remplacer l'extension `.example`), activer le service. Adapter le domaine Nginx dans `deployment/nginx/lpada.conf.example`, installer et activer le site. Mettre en place TLS avec certificat valide et redirection HTTP → HTTPS **avant production**.
7. Lancer `systemctl status lpada-api`, consulter `journalctl -u lpada-api` et confirmer que Flyway a migré `lpada_prod`. Tester catalogue, connexion, CSRF, panier et commande depuis le domaine HTTPS.

## Déploiement GitHub / retours arrière

`deployment` fournit l'architecture et la CI existante vérifie les compilations. **Aucun déploiement automatique SSH n'est activé** tant que les identifiants, les chemins, les sauvegardes et la procédure de restauration n'ont pas été validés. Ne jamais déployer un `git push --force` automatiquement en production.

Pour un déploiement prudent : construire dans CI ; déposer chaque version jar+frontend sous un dossier horodaté `releases/`; vérifier la santé ; faire pointer `current` vers cette version par lien symbolique ; relancer le service. Pour revenir en arrière, restaurer le lien précédent. **Attention : revenir à un ancien jar n'annule pas une migration SQL Flyway**. Les modifications destructrices nécessitent un plan SQL dédié, un test de restauration et une fenêtre de maintenance.

## Sauvegardes externalisées chiffrées

Le script `deployment/backups/backup-postgres.sh` est prévu pour un **VPS Linux seulement**. Installer et initialiser **Restic** avec un stockage réellement extérieur au VPS (SFTP/stockage objet, compte distinct) ; protéger `RESTIC_PASSWORD_FILE` (0600). Exécuter le script avec un compte ayant lecture SQL sur la base, par exemple `postgres` sur le VPS :

```bash
export RESTIC_REPOSITORY='sftp:backup@serveur-externe:/sauvegardes/lpada'
export RESTIC_PASSWORD_FILE='/etc/lpada/restic-password'
export PGDATABASE='lpada_prod'
export PGUSER='postgres'
sudo -E -u postgres bash /srv/lpada/deployment/backups/backup-postgres.sh
```

**Note** : le dépôt distant SFTP est un exemple, à configurer ; l'utilisateur `postgres` doit avoir accès à la clé SSH et au fichier de mot de passe Restic, ou utiliser un compte de sauvegarde dédié. Sans cible distante prête et testée, la sauvegarde n'est **pas opérationnelle**. Éviter les secrets en variables d'environnement si le contexte ne les protège pas.

Planifier une exécution quotidienne via systemd timer ou cron après un premier essai validé. Vérifier les alertes d'échec et définir la rétention. Faire au moins une restauration sur **une base de test isolée** : `restic restore latest --target /tmp/restauration`, puis `pg_restore --list` et restauration sur une base distincte avec `pg_restore --no-owner --no-acl`. Ne jamais écraser directement `lpada_prod` pour un test.

## Contrôles indispensables avant vente

Test de bout en bout, permissions admin, protection contre les tentatives de connexion répétées, sécurité des formulaires, paiement sécurisé, information clients, sauvegarde hors site restaurée, surveillance/alertes. Ce patch ne prouve aucun de ces contrôles.
