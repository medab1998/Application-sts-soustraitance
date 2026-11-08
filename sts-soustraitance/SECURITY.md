# Sécurité — Guide d'utilisation (Spring Security + JWT)

## Ce qui a été ajouté

| Fichier | Rôle |
|---|---|
| `entity/AppUser.java` | Compte de connexion (username, email, password encodé, role, actif) |
| `entity/Role.java` | Enum des rôles (ADMINISTRATEUR, CHEF_PROJET, TECHNICIEN, SOUS_TRAITANT, etc.) |
| `repository/AppUserRepository.java` | Accès aux comptes utilisateurs |
| `security/JwtUtil.java` | Génère et valide les tokens JWT |
| `security/JwtAuthFilter.java` | Intercepte chaque requête, lit le token et authentifie l'utilisateur |
| `security/AppUserDetailsService.java` | Charge un utilisateur depuis la base pour Spring Security |
| `security/SecurityConfig.java` | Règles d'accès par rôle + activation du filtre JWT |
| `controller/AuthController.java` | Endpoints `/api/auth/register` et `/api/auth/login` |
| `controller/AppUserController.java` | Gestion des comptes (réservé à l'Administrateur) |
| `config/DataSeeder.java` | Crée un compte admin par défaut au premier démarrage |

## Où se trouve le compte admin par défaut ?

Au premier démarrage de l'application, un compte est créé automatiquement (visible dans la console au démarrage) :

```
username : admin
password : Admin@123
```

Vous pouvez ensuite créer d'autres comptes via `/api/auth/register`.

## Comment ça marche

1. L'utilisateur s'inscrit (`/api/auth/register`) ou se connecte (`/api/auth/login`)
2. Le serveur renvoie un **token JWT**
3. Pour chaque requête vers un endpoint protégé, le client doit envoyer ce token dans l'en-tête HTTP :
   ```
   Authorization: Bearer <le_token>
   ```
4. `JwtAuthFilter` vérifie le token à chaque requête et authentifie automatiquement l'utilisateur
5. `SecurityConfig` vérifie ensuite si le **rôle** de l'utilisateur a le droit d'accéder à l'endpoint demandé

## Tester avec IntelliJ HTTP Client / Postman

### 1. Créer un compte sous-traitant (exemple)
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "soustraitant1",
  "email": "soustraitant1@example.tn",
  "password": "motdepasse123",
  "role": "SOUS_TRAITANT"
}
```
Réponse :
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "soustraitant1",
  "role": "SOUS_TRAITANT"
}
```

### 2. Se connecter (si le compte existe déjà)
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}
```

### 3. Utiliser le token pour accéder à un endpoint protégé
```http
GET http://localhost:8080/api/sous-traitants
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

Sans ce header, ou avec un token invalide/expiré, vous recevrez une erreur **401 Unauthorized**.
Avec un token valide mais un rôle non autorisé pour cet endpoint, vous recevrez **403 Forbidden**.

## Règles d'accès actuellement configurées

| Endpoint | Rôles autorisés |
|---|---|
| `POST /api/auth/**` | Public (pas de token requis) |
| `/api/users/**` | ADMINISTRATEUR uniquement |
| `GET /api/sous-traitants/**` | ADMINISTRATEUR, CHEF_PROJET, RESPONSABLE_ACHAT |
| `POST/PUT/DELETE /api/sous-traitants/**` | ADMINISTRATEUR uniquement |
| `/api/contrats/**` | ADMINISTRATEUR, CHEF_PROJET, RESPONSABLE_ACHAT |
| `POST /api/mouvements-stock/**` | SOUS_TRAITANT, RESPONSABLE_ACHAT, ADMINISTRATEUR |
| `POST /api/rapports-sous-traitant/**` | SOUS_TRAITANT, ADMINISTRATEUR |
| `PUT /api/rapports-sous-traitant/{id}/statut` | CHEF_PROJET, ADMINISTRATEUR (validation du rapport) |
| `/api/paiements-sous-traitant/**` | RESPONSABLE_FACTURATION, RESPONSABLE_REGLEMENT, ADMINISTRATEUR |
| `POST /api/reclamations/**` | TECHNICIEN, SOUS_TRAITANT, ADMINISTRATEUR |
| Tout le reste | N'importe quel utilisateur authentifié |

Ces règles sont modifiables dans `SecurityConfig.java`, méthode `securityFilterChain()`.

## Modifier ou ajouter une règle

Dans `SecurityConfig.java`, ajouter une ligne dans `.authorizeHttpRequests(...)` avant `.anyRequest().authenticated()` :

```java
.requestMatchers("GET", "/api/produits/**").hasAnyRole("RESPONSABLE_ACHAT", "ADMINISTRATEUR")
```

## Console H2 (base de données, profil `h2` uniquement)

Depuis le passage à PostgreSQL, la console H2 n'est plus utilisée par défaut. Elle reste accessible sans authentification à `http://localhost:8080/h2-console` **uniquement** quand l'application est lancée avec `--spring.profiles.active=h2` (voir le README pour PostgreSQL/pgAdmin en usage normal).
**À retirer de `permitAll()`** si vous conservez ce profil actif en production.

## Points à adapter avant la mise en production

- Déplacer `jwt.secret` dans une variable d'environnement plutôt que dans `application.properties` (ne jamais committer une clé secrète en clair sur Git)
- Réduire `jwt.expiration` (24h actuellement) et envisager un mécanisme de refresh token
- Restreindre `CorsConfiguration` aux domaines réels du frontend (actuellement `*` pour faciliter les tests)
- Retirer le compte admin par défaut ou changer son mot de passe dès le premier démarrage
- Ajouter du rate-limiting sur `/api/auth/login` pour se protéger du brute-force
