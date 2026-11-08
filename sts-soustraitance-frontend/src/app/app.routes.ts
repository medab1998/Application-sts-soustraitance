import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'accueil' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: 'accueil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'sous-traitants',
    canActivate: [authGuard],
    loadComponent: () => import('./features/sous-traitants/sous-traitants.component').then(m => m.SousTraitantsComponent)
  },
  {
    path: 'projets',
    canActivate: [authGuard],
    loadComponent: () => import('./features/projets/projets.component').then(m => m.ProjetsComponent)
  },
  {
    path: 'contrats',
    canActivate: [authGuard],
    loadComponent: () => import('./features/contrats/contrats.component').then(m => m.ContratsComponent)
  },
  {
    path: 'produits',
    canActivate: [authGuard],
    loadComponent: () => import('./features/produits/produits.component').then(m => m.ProduitsComponent)
  },
  {
    path: 'stocks',
    canActivate: [authGuard],
    loadComponent: () => import('./features/stocks/stocks.component').then(m => m.StocksComponent)
  },
  {
    path: 'mouvements-stock',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mouvements-stock/mouvements-stock.component').then(m => m.MouvementsStockComponent)
  },
  {
    path: 'rapports',
    canActivate: [authGuard],
    loadComponent: () => import('./features/rapports/rapports.component').then(m => m.RapportsComponent)
  },
  {
    path: 'reclamations',
    canActivate: [authGuard],
    loadComponent: () => import('./features/reclamations/reclamations.component').then(m => m.ReclamationsComponent)
  },
  {
    path: 'paiements',
    canActivate: [authGuard],
    loadComponent: () => import('./features/paiements/paiements.component').then(m => m.PaiementsComponent)
  },

  { path: '**', redirectTo: 'accueil' }
];
