import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContratService } from '../../core/services/contrat.service';
import { SousTraitantService } from '../../core/services/sous-traitant.service';
import { ProjetService } from '../../core/services/projet.service';
import { Contrat } from '../../core/models/contrat.model';
import { SousTraitant } from '../../core/models/sous-traitant.model';
import { Projet } from '../../core/models/projet.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contrats.component.html'
})
export class ContratsComponent implements OnInit {

  items: Contrat[] = [];
  sousTraitants: SousTraitant[] = [];
  projets: Projet[] = [];
  loading = true;
  errorMessage = '';
  showForm = false;

  form = this.fb.group({
    numeroContrat: ['', Validators.required],
    dateDebut: [''],
    dateFin: [''],
    montantTotal: [0, [Validators.required, Validators.min(0)]],
    retenueGarantie: [0, [Validators.required, Validators.min(0)]],
    idSousTraitant: [null as number | null, Validators.required],
    idProjet: [null as number | null, Validators.required]
  });

  constructor(
    private service: ContratService,
    private sousTraitantService: SousTraitantService,
    private projetService: ProjetService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
    this.sousTraitantService.getAll().subscribe({ next: d => this.sousTraitants = d, error: () => {} });
    this.projetService.getAll().subscribe(d => this.projets = d);
  }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger les contrats.'; this.loading = false; }
    });
  }

  sousTraitantNom(id: number): string {
    return this.sousTraitants.find(s => s.idSousTraitant === id)?.raisonSociale ?? `#${id}`;
  }

  projetNom(id: number): string {
    return this.projets.find(p => p.idProjet === id)?.nom ?? `#${id}`;
  }

  openCreateForm(): void {
    this.form.reset({ montantTotal: 0, retenueGarantie: 0 });
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    const payload: Contrat = {
      numeroContrat: value.numeroContrat!,
      dateDebut: value.dateDebut || undefined,
      dateFin: value.dateFin || undefined,
      montantTotal: value.montantTotal!,
      retenueGarantie: value.retenueGarantie!,
      sousTraitant: { idSousTraitant: value.idSousTraitant! },
      projet: { idProjet: value.idProjet! }
    };

    this.service.create(payload).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: (err) => {
        this.errorMessage = err.status === 403
          ? "Vous n'avez pas la permission d'effectuer cette action."
          : 'Erreur lors de la creation du contrat.';
      }
    });
  }

  remove(id: number): void {
    if (!confirm('Confirmer la suppression de ce contrat ?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMessage = 'Suppression impossible (rapports lies existants).'; }
    });
  }
}
