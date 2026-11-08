import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { SousTraitantService } from '../../core/services/sous-traitant.service';
import { ProjetService } from '../../core/services/projet.service';
import { StockService } from '../../core/services/stock.service';
import { RapportSousTraitantService } from '../../core/services/rapport-sous-traitant.service';
import { ReclamationService } from '../../core/services/reclamation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  loading = true;

  kpis = {
    sousTraitants: 0,
    projets: 0,
    produitsEnAlerte: 0,
    rapportsEnAttente: 0,
    reclamationsOuvertes: 0
  };

  constructor(
    public authService: AuthService,
    private sousTraitantService: SousTraitantService,
    private projetService: ProjetService,
    private stockService: StockService,
    private rapportService: RapportSousTraitantService,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    forkJoin({
      sousTraitants: this.sousTraitantService.getAll().pipe(catchError(() => of([]))),
      projets: this.projetService.getAll().pipe(catchError(() => of([]))),
      stocks: this.stockService.getAll().pipe(catchError(() => of([]))),
      rapports: this.rapportService.getAll().pipe(catchError(() => of([]))),
      reclamations: this.reclamationService.getAll().pipe(catchError(() => of([])))
    }).subscribe(res => {
      this.kpis.sousTraitants = res.sousTraitants.length;
      this.kpis.projets = res.projets.length;
      this.kpis.produitsEnAlerte = res.stocks.filter(s => s.quantiteActuelle <= s.stockMinimum).length;
      this.kpis.rapportsEnAttente = res.rapports.filter(r => r.statut === 'SOUMIS').length;
      this.kpis.reclamationsOuvertes = res.reclamations.length;
      this.loading = false;
    });
  }
}
