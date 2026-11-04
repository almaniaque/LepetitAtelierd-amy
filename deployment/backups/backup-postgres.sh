#!/usr/bin/env bash
# A exécuter uniquement SUR LE VPS Linux, avec un dépôt Restic distant configuré.
set -Eeuo pipefail
umask 077
: "${RESTIC_REPOSITORY:?Définir RESTIC_REPOSITORY vers un stockage HORS du VPS}"
: "${RESTIC_PASSWORD_FILE:?Définir RESTIC_PASSWORD_FILE (fichier root 0600)}"
: "${PGDATABASE:=lpada_prod}"
: "${PGUSER:=lpada_backup}"
# La commande est prévue pour être exécutée comme utilisateur système postgres
# via sudo -u postgres (authentification peer), d'où PGUSER=postgres dans la procédure.
tmpdir="$(mktemp -d /tmp/lpada-backup.XXXXXXXX)"
trap 'rm -rf "$tmpdir"' EXIT
pg_dump --no-owner --no-acl --format=custom --file "$tmpdir/lpada_prod.dump" --dbname "$PGDATABASE"
restic backup --tag lpada-postgres "$tmpdir/lpada_prod.dump"
restic snapshots --tag lpada-postgres --latest 1
# La rétention et la purge doivent être configurées séparément et testées.
