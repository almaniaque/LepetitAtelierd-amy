-- Exemple DEV uniquement, à adapter avant exécution.
-- A exécuter avec psql comme administrateur postgres, sans conserver de mot de passe dans ce fichier.
-- Exemple : CREATE ROLE lpada_app LOGIN PASSWORD 'mot-de-passe-fort';
--          CREATE DATABASE lpada_dev OWNER lpada_app;
-- Pour ne pas inscrire le secret dans ce fichier, utilise \password lpada_app dans psql.
CREATE ROLE lpada_app LOGIN;
CREATE DATABASE lpada_dev OWNER lpada_app;
