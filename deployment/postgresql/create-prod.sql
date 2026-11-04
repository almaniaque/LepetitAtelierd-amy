-- Exemple VPS : exécuter avec psql en tant que postgres.
-- Le mot de passe du rôle doit être défini ensuite avec \password lpada_app.
-- Vérifier que listen_addresses='localhost', pg_hba.conf, et pare-feu.
CREATE ROLE lpada_app LOGIN;
CREATE DATABASE lpada_prod OWNER lpada_app;
