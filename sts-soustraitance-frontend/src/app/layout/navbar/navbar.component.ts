import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles?: string[]; // si absent : visible par tous les roles connectes
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class SidebarComponent {

  readonly navItems: NavItem[] = [
    { path: '/accueil', label: 'Tableau de bord', icon: '◆' },
    { path: '/sous-traitants', label: 'Sous-traitants', icon: '👷', roles: ['ADMINISTRATEUR', 'CHEF_PROJET', 'RESPONSABLE_ACHAT'] },
    { path: '/projets', label: 'Projets', icon: '📁' },
    { path: '/contrats', label: 'Contrats', icon: '📄', roles: ['ADMINISTRATEUR', 'CHEF_PROJET', 'RESPONSABLE_ACHAT'] },
    { path: '/produits', label: 'Produits', icon: '📦', roles: ['ADMINISTRATEUR', 'RESPONSABLE_ACHAT'] },
    { path: '/stocks', label: 'Stocks', icon: '🏭', roles: ['ADMINISTRATEUR', 'RESPONSABLE_ACHAT'] },
    { path: '/mouvements-stock', label: 'Mouvements de stock', icon: '↔' },
    { path: '/rapports', label: 'Rapports sous-traitant', icon: '📊' },
    { path: '/reclamations', label: 'Reclamations HSE', icon: '⚠' },
    { path: '/paiements', label: 'Paiements', icon: '€', roles: ['ADMINISTRATEUR', 'RESPONSABLE_FACTURATION', 'RESPONSABLE_REGLEMENT'] },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  get visibleItems(): NavItem[] {
    return this.navItems.filter(item => !item.roles || this.authService.hasRole(...item.roles));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
