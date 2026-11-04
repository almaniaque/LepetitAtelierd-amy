# LPADA — Patch : Supabase → PostgreSQL local + VPS

**À copier à la racine de `lpada_v2`**, en remplaçant les fichiers de même chemin. Cette archive ne contient que les fichiers modifiés/ajoutés (pas le frontend complet, pas de JAR). Sauvegarder ou committer les changements locaux avant remplacement.

## Changements

- `application.yml` : configuration commune sans URL de secours trompeuse.
- `application-local.yml` : PostgreSQL local `127.0.0.1:5432/lpada_dev`, SSL désactivé **uniquement en local**, cookies non-Secure pour `http://localhost`.
- `application-prod.yml` : URL, utilisateur et secret obligatoires en variables d'environnement ; cookie Secure.
- `.env.example` : retiré tout paramètre Supabase.
- `.gitignore` : exclut les fichiers sensibles et dumps.
- `Requests.java` : import `jakarta.validation.Valid` absent du ZIP de référence, déjà corrigé chez toi ; même correction conservée.
- `deployment/` : gabarits SQL, Nginx, systemd, sauvegarde chiffrée Restic et instructions VPS.
- **Migration Flyway `V1__schema.sql` inchangée** : aucune table ni donnée métier supprimée. Angular et `pom.xml` inchangés.

## En local (PowerShell dans VS Code, depuis `backend`)

Créer d'abord la base et le rôle via `deployment/postgresql/create-local.sql` (voir les notes dans ce fichier). Pour le compte SQL, ouvrir `psql` en administrateur et taper `\password lpada_app`, puis entrer le secret sans l'afficher.

Dans **le même terminal** que Maven :

```powershell
$env:SPRING_PROFILES_ACTIVE="local"
$env:DB_URL="jdbc:postgresql://127.0.0.1:5432/lpada_dev?sslmode=disable"
$env:DB_USER="lpada_app"
$env:DB_PASSWORD=[System.Net.NetworkCredential]::new("", (Read-Host "Mot de passe PostgreSQL local" -AsSecureString)).Password
$env:COOKIE_SECURE="false"
mvn clean verify
mvn spring-boot:run
```

`postgres` doit être lancé sur ton PC (port 5432) et `lpada_app` doit disposer des droits nécessaires pour que Flyway crée les tables dans `lpada_dev`. Aucun accès à Supabase n'est requis.

Si tu as encore les anciennes variables Supabase dans ton terminal, les commandes ci-dessus les remplacent. Attention : elles ne sont disponibles que dans la session PowerShell courante.

## Production

Lire `deployment/README_DEPLOIEMENT.md`. **Ne jamais pousser `backend.env`, de vrais mots de passe, des exports clients ou dumps sur GitHub**. Les fichiers `*.example` sont des gabarits. Ne pas lancer les scripts de sauvegarde Linux sur Windows.

## État de validation

Vérification statique des fichiers et des chemins réalisée. Compilation Maven, connexion à ta base locale, déploiement VPS et restauration distante **non exécutés** dans l'environnement de préparation. Réaliser `mvn clean verify`, puis un démarrage contrôlé et une restauration de test avant ouverture publique.
