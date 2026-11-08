import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RapportSousTraitantService } from '../../core/services/rapport-sous-traitant.service';
import { ContratService } from '../../core/services/contrat.service';
import { RapportSousTraitant, StatutRapport } from '../../core/models/rapport-sous-traitant.model';
import { Contrat } from '../../core/models/contrat.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rapports.component.html'
})
export class RapportsComponent implements OnInit {

  items: RapportSousTraitant[] = [];
  contrats: Contrat[] = [];
  loading = true;
  errorMessage = '';
  showForm = false;

  form = this.fb.group({
    dateRapport: [this.today(), Validators.required],
    descriptionTravaux: ['', Validators.required],
    pourcentageAvancement: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    quantiteRealisee: [0, Validators.required],
    idContrat: [null as number | null, Validators.required]
  });

  constructor(
    private service: RapportSousTraitantService,
    private contratService: ContratService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
    this.contratService.getAll().subscribe({ next: d => this.contrats = d, error: () => {} });
  }

  today(): string {
    return new Date().toISOString().substring(0, 10);
  }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger les rapports.'; this.loading = false; }
    });
  }

  contratNom(id: number): string {
    return this.contrats.find(c => c.idContrat === id)?.numeroContrat ?? `#${id}`;
  }

  openCreateForm(): void {
    this.form.reset({ dateRapport: this.today(), pourcentageAvancement: 0, quantiteRealisee: 0 });
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    const payload: RapportSousTraitant = {
      dateRapport: value.dateRapport!,
      descriptionTravaux: value.descriptionTravaux!,
      pourcentageAvancement: value.pourcentageAvancement!,
      quantiteRealisee: value.quantiteRealisee!,
      contrat: { idContrat: value.idContrat! }
    };

    this.service.create(payload).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: (err) => {
        this.errorMessage = err.status === 403
          ? "Vous n'avez pas la permission de creer un rapport."
          : 'Erreur lors de la creation du rapport.';
      }
    });
  }

  changerStatut(rapport: RapportSousTraitant, statut: StatutRapport): void {
    this.service.changerStatut(rapport.idRapport!, statut).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.errorMessage = err.status === 403
          ? "Vous n'avez pas la permission de valider ce rapport."
          : 'Erreur lors du changement de statut.';
      }
    });
  }

  badgeClass(statut?: StatutRapport): string {
    switch (statut) {
      case 'APPROUVE': return 'badge-success';
      case 'REJETE': return 'badge-danger';
      case 'SOUMIS': return 'badge-warning';
      default: return 'badge-neutral';
    }
  }
}
