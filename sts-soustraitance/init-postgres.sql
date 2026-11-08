-- ============================================================
-- Script de creation de la base et de l'utilisateur PostgreSQL
-- A executer UNE SEULE FOIS, avec un compte administrateur (ex: postgres)
--
-- Utilisation (terminal) :
--   psql -U postgres -f init-postgres.sql
--
-- Ou depuis pgAdmin / DBeaver : ouvrir ce fichier et l'executer.
-- ============================================================

-- Creer l'utilisateur applicatif
CREATE USER sts_user WITH PASSWORD 'sts_password';

-- Creer la base de donnees
CREATE DATABASE sts_soustraitance OWNER sts_user;

-- Donner tous les droits necessaires
GRANT ALL PRIVILEGES ON DATABASE sts_soustraitance TO sts_user;

-- Les tables seront creees automatiquement par Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- au premier demarrage de l'application Spring Boot. Aucune autre action n'est necessaire ici.
