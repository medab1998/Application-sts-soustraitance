# STS-LINK — Module Gestion Sous-traitance

Backend Spring Boot basé sur le diagramme de classe corrigé du module Sous-traitant.

## Structure du projet

```
sts-soustraitance/
├── pom.xml
├── src/main/java/com/stsgroupe/soustraitance/
│   ├── StsSoustraitanceApplication.java
│   ├── entity/          (10 entités JPA)
│   ├── repository/      (10 interfaces Spring Data JPA)
│   ├── service/         (logique métier : mise à jour du stock)
│   └── controller/      (9 contrôleurs REST + gestion globale des erreurs)
└── src/main/resources/
    └── application.properties
```

## Entités générées (d'après le diagramme corrigé)

| Entité | Rôle |
|---|---|
| `SousTraitant` | Sous-traitant travaillant sur les chantiers |
| `Projet` | Projet auquel un contrat est rattaché |
| `Contrat` | Contrat liant un sous-traitant à un projet |
| `Produit` | Catalogue des matériels/produits |
| `Stock` | Quantités disponibles par produit |
| `MouvementStock` | Affectation / Consommation / Retour de matériel |
| `RapportSousTraitant` | Rapport d'avancement soumis par le sous-traitant |
| `PieceJointe` | Photo / PDF / Document justificatif d'un rapport |
| `Reclamation` | Incident / Accident / HSE (déclaré par Technicien ou Sous-traitant) |
| `PaiementSousTraitant` | Paiement lié à un rapport (montant net calculé automatiquement) |

## Ouvrir le projet dans IntelliJ IDEA

1. **File > Open** → sélectionner le dossier `sts-soustraitance` (celui contenant `pom.xml`)
2. IntelliJ détecte automatiquement le projet Maven → cliquer sur **"Load Maven Project"** si demandé
3. Attendre le téléchargement des dépendances (barre de progression en bas)
4. Vérifier le SDK : **File > Project Structure > Project SDK** → sélectionner Java 17 (ou supérieur)
5. Si vous utilisez Lombok : installer le plugin **"Lombok"** via **File > Settings > Plugins**, puis activer **"Enable annotation processing"** dans **Settings > Build, Execution, Deployment > Compiler > Annotation Processors**
6. Lancer l'application : clic droit sur `StsSoustraitanceApplication.java` → **Run**

## Tester l'API

L'application démarre sur `http://localhost:8080` avec une base **H2 en mémoire** (aucune installation nécessaire).

Console H2 (pour visualiser les données) : `http://localhost:8080/h2-console`
- JDBC URL : `jdbc:h2:mem:stsdb`
- User : `sa` / Password : *(vide)*

### Exemples de requêtes (via Postman, curl ou IntelliJ HTTP Client)

**Créer un sous-traitant :**
```http
POST http://localhost:8080/api/sous-traitants
Content-Type: application/json

{
  "raisonSociale": "SousTraitant SARL",
  "telephone": "20123456",
  "email": "contact@soustraitant.tn",
  "statut": "ACTIF"
}
```

**Créer un projet :**
```http
POST http://localhost:8080/api/projets
Content-Type: application/json

{
  "nom": "Extension réseau fibre - Sfax",
  "client": "SOTELSUD",
  "dateDebut": "2026-07-01",
  "dateFin": "2026-12-31"
}
```

**Créer un contrat (lier sous-traitant + projet, ids déjà créés) :**
```http
POST http://localhost:8080/api/contrats
Content-Type: application/json

{
  "numeroContrat": "CT-2026-001",
  "dateDebut": "2026-07-01",
  "dateFin": "2026-12-31",
  "montantTotal": 50000,
  "retenueGarantie": 5000,
  "sousTraitant": { "idSousTraitant": 1 },
  "projet": { "idProjet": 1 }
}
```

**Enregistrer un mouvement de stock (met à jour la quantité automatiquement) :**
```http
POST http://localhost:8080/api/mouvements-stock
Content-Type: application/json

{
  "dateMouvement": "2026-07-03",
  "type": "CONSOMMATION",
  "quantite": 10,
  "sousTraitant": { "idSousTraitant": 1 },
  "produit": { "idProduit": 1 },
  "stock": { "idStock": 1 }
}
```

**Soumettre un rapport de sous-traitant :**
```http
POST http://localhost:8080/api/rapports-sous-traitant
Content-Type: application/json

{
  "dateRapport": "2026-07-03",
  "descriptionTravaux": "Pose de fibre - tronçon A",
  "pourcentageAvancement": 45.5,
  "quantiteRealisee": 200,
  "contrat": { "idContrat": 1 }
}
```

## Liste complète des endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/sous-traitants` | Liste / Création |
| GET/PUT/DELETE | `/api/sous-traitants/{id}` | Détail / Modif / Suppr |
| GET/POST | `/api/projets` | Liste / Création |
| GET/POST | `/api/contrats` | Liste / Création |
| GET | `/api/contrats/sous-traitant/{id}` | Contrats d'un sous-traitant |
| GET | `/api/contrats/projet/{id}` | Contrats d'un projet |
| GET/POST | `/api/produits` | Liste / Création |
| GET/PUT | `/api/stocks/{id}` | Détail / Mise à jour manuelle |
| GET/POST | `/api/mouvements-stock` | Liste / Enregistrement (met à jour le stock) |
| GET | `/api/mouvements-stock/sous-traitant/{id}` | Mouvements d'un sous-traitant |
| GET/POST | `/api/rapports-sous-traitant` | Liste / Création |
| PUT | `/api/rapports-sous-traitant/{id}/statut?statut=APPROUVE` | Changer le statut |
| GET/POST | `/api/pieces-jointes` | Liste / Ajout |
| GET/POST | `/api/reclamations` | Liste / Déclaration |
| GET/POST | `/api/paiements-sous-traitant` | Liste / Création (montant net auto-calculé) |

## Sécurité (Spring Security + JWT)

L'authentification par token JWT a été ajoutée. Voir le fichier **`SECURITY.md`** pour :
- la liste des fichiers ajoutés,
- les identifiants du compte admin par défaut,
- des exemples de requêtes `register` / `login`,
- le tableau des règles d'accès par rôle,
- comment modifier ces règles.

En résumé : tous les endpoints `/api/**` (sauf `/api/auth/**`) nécessitent maintenant un header `Authorization: Bearer <token>`.

## Base de données : PostgreSQL

L'application utilise **PostgreSQL** par défaut. Deux façons de l'installer :

### Option A — Avec Docker (recommandé, le plus simple)

Un fichier `docker-compose.yml` est fourni à la racine du projet.

```bash
docker compose up -d
```

Cela démarre :
- **PostgreSQL** sur `localhost:5432` (base `sts_soustraitance`, utilisateur `sts_user`, mot de passe `sts_password`)
- **pgAdmin** (interface web pour visualiser les données) sur `http://localhost:5050`
  - Email : `admin@stsgroupe.tn` / Mot de passe : `admin123`
  - Une fois connecté à pgAdmin, ajouter un serveur avec host `postgres`, port `5432`, user `sts_user`, password `sts_password`

Pour arrêter : `docker compose down`
Pour tout réinitialiser (effacer les données) : `docker compose down -v`

### Option B — Installation locale de PostgreSQL (sans Docker)

1. Installer PostgreSQL (Ubuntu : `sudo apt install postgresql`, Windows/Mac : installeur officiel sur postgresql.org)
2. Exécuter le script fourni `init-postgres.sql` avec un compte administrateur :
   ```bash
   sudo -u postgres psql -f init-postgres.sql
   ```
   (sur Windows/Mac, adapter selon votre installation, ou copier-coller le contenu du fichier dans pgAdmin/DBeaver)

### Lancer l'application

Rien à changer : `application.properties` pointe déjà vers PostgreSQL. Démarrer normalement dans IntelliJ (`Run` sur `StsSoustraitanceApplication`).

**✅ Si la connexion réussit**, la console affiche :
```
HikariPool-1 - Start completed.
...
Started StsSoustraitanceApplication in X.XXX seconds
```

Hibernate crée automatiquement toutes les tables au premier démarrage (`spring.jpa.hibernate.ddl-auto=update`).

### Revenir à H2 (tests rapides sans base externe)

Un profil `h2` reste disponible (`application-h2.properties`), utile pour tester vite fait sans dépendre de PostgreSQL.

Dans IntelliJ : **Run > Edit Configurations** → champ **VM options** ou **Program arguments**, ajouter :
```
--spring.profiles.active=h2
```
La console H2 redevient alors accessible sur `/h2-console`.

### Problèmes fréquents

| Erreur | Cause | Solution |
|---|---|---|
| `Connection to localhost:5432 refused` | PostgreSQL n'est pas démarré | `docker compose up -d`, ou vérifier le service PostgreSQL local |
| `FATAL: password authentication failed for user "sts_user"` | Mauvais identifiants ou utilisateur non créé | Relancer `init-postgres.sql`, ou vérifier `docker-compose.yml` |
| `FATAL: database "sts_soustraitance" does not exist` | Base non créée | Relancer `init-postgres.sql`, ou `docker compose down -v && docker compose up -d` pour repartir de zéro |
| `Driver org.postgresql.Driver claims to not accept jdbcUrl` | URL JDBC mal formée | Vérifier `spring.datasource.url=jdbc:postgresql://localhost:5432/sts_soustraitance` (pas de faute de frappe) |

## Passer à MySQL (alternative à PostgreSQL)

Si vous préférez MySQL plutôt que PostgreSQL : dans `pom.xml`, remplacer la dépendance `postgresql` par `mysql-connector-j`, puis dans `application.properties` :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sts_soustraitance?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

## Points à compléter selon vos besoins

- DTOs / Mapper (actuellement les entités sont exposées directement dans l'API)
- Pagination sur les listes (`Pageable`)
- Upload réel de fichiers pour `PieceJointe` (actuellement seul le chemin est stocké)
- Migrations versionnées (Flyway/Liquibase) plutôt que `ddl-auto=update`, recommandé avant la mise en production
