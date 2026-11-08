# STS-LINK — Frontend Angular 17 (Module Sous-traitance)

Frontend **standalone components** (Angular 17) couvrant l'intégralité des endpoints du backend `sts-soustraitance`, avec authentification JWT et gestion des droits par rôle.

## Prérequis

- Node.js 18+ et npm
- Le backend `sts-soustraitance` lancé sur `http://localhost:8080` (voir son propre README)

## Installation

```bash
cd sts-soustraitance-frontend
npm install
npm start
```

L'application s'ouvre sur `http://localhost:4200`.

Si le port 8080 du backend est différent, modifier `src/environments/environment.ts` :
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Structure du projet

```
src/app/
├── core/
│   ├── models/         (10 interfaces TypeScript, miroir des entités backend)
│   ├── services/       (10 services HTTP, un par entité + AuthService)
│   ├── interceptors/    auth.interceptor.ts   -> ajoute le token JWT a chaque requete
│   └── guards/          auth.guard.ts, role.guard.ts
├── layout/
│   └── navbar/           Sidebar de navigation (filtree par role)
├── features/
│   ├── auth/            login, register
│   ├── dashboard/       KPIs (sous-traitants, projets, alertes stock, rapports en attente...)
│   ├── sous-traitants/  CRUD complet (creer/modifier reserve a ADMINISTRATEUR)
│   ├── projets/         Creation / liste / suppression
│   ├── contrats/        Lie un Sous-traitant a un Projet
│   ├── produits/        Catalogue produits
│   ├── stocks/          Etat du stock avec alerte visuelle si quantite <= seuil
│   ├── mouvements-stock/  <-- Coeur de la gestion de stock (AFFECTATION/CONSOMMATION/RETOUR)
│   ├── rapports/        Rapports d'avancement + workflow Approuver/Rejeter
│   ├── reclamations/    Declarations INCIDENT/ACCIDENT/HSE
│   └── paiements/       Paiements sous-traitant (montant net calcule par le backend)
└── app.routes.ts        Toutes les routes protegees par authGuard (sauf login/register)
```

## Authentification

1. `/login` — se connecter avec un compte existant (ex: `admin` / `Admin@123`, cree automatiquement par le backend)
2. `/register` — creer un compte en choisissant un role parmi les 9 acteurs du diagramme de cas d'utilisation
3. Le token JWT est stocke dans `localStorage` et injecte automatiquement dans chaque requete HTTP via `authInterceptor`
4. Si le token expire ou est invalide (401), redirection automatique vers `/login`
5. La sidebar masque les sections non autorisees selon le role connecte (ex: un `SOUS_TRAITANT` ne voit pas "Sous-traitants" ni "Stocks")

## Module Gestion de Stock — a tester en premier

C'est le module demande en priorite. Parcours recommande :
1. Se connecter en `admin`
2. Aller dans **Produits** → creer un produit (ex: "Cable fibre optique")
3. Aller dans **Stocks** → initialiser un stock pour ce produit (quantite actuelle + seuil minimum)
4. Aller dans **Mouvements de stock** → creer un mouvement `AFFECTATION` pour un sous-traitant → observer que la quantite dans **Stocks** a augmente automatiquement
5. Creer un mouvement `CONSOMMATION` superieur a la quantite disponible → le formulaire affiche l'erreur renvoyee par le backend ("Quantite insuffisante en stock")

## Notes techniques

- **Formulaires** : Reactive Forms partout (`FormBuilder`), validation cote client + affichage des erreurs serveur (403, 400, messages texte bruts du backend)
- **Style** : design "chantier/telecom" (voir `src/styles.css`) — sidebar ardoise, accent orange balise, police Barlow Condensed pour les titres, JetBrains Mono pour les identifiants/montants
- **Lazy loading** : chaque route charge son composant a la demande (`loadComponent`)
- **Pas de NgModules** : 100% standalone components (Angular 17)

## Limites connues / a completer

- Pas de pagination sur les listes (le backend ne l'implemente pas non plus actuellement)
- `PieceJointe` (upload de photos/documents) n'a pas d'interface dediee — a ajouter si besoin
- Pas de refresh token : l'utilisateur doit se reconnecter apres expiration (24h)
- Les selects de liaison (ex: choisir un Sous-traitant dans Contrats) chargent la liste complete a chaque fois — envisager un debounce/recherche si le nombre d'enregistrements devient important
