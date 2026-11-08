import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaiementSousTraitantService } from '../../core/services/paiement-sous-traitant.service';
import { RapportSousTraitantService } from '../../core/services/rapport-sous-traitant.service';
import { PaiementSousTraitant } from '../../core/models/paiement-sous-traitant.model';
import { RapportSousTraitant } from '../../core/models/rapport-sous-traitant.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paiements.component.html'
})
export class PaiementsComponent implements OnInit {

  items: PaiementSousTraitant[] = [];
  rapports: RapportSousTraitant[] = [];
  loading = true;
  errorMessage = '';
  showForm = false;

  form = this.fb.group({
    datePaiement: [this.today(), Validators.required],
    montantBrut: [0, [Validators.required, Validators.min(0)]],
    retenue: [0, [Validators.required, Validators.min(0)]],
    modePaiement: ['VIREMENT'],
    statut: ['EN_ATTENTE'],
    idRapport: [null as number | null, Validators.required]
  });

  constructor(
    private service: PaiementSousTraitantService,
    private rapportService: RapportSousTraitantService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
    // Seuls les rapports approuves peuvent generer un paiement
    this.rapportService.getAll().subscribe({
      next: d => this.rapports = d.filter(r => r.statut === 'APPROUVE'),
      error: () => {}
    });
  }

  today(): string { return new Date().toISOString().substring(0, 10); }

  get montantNetPrevisionnel(): number {
    const brut = this.form.get('montantBrut')?.value ?? 0;
    const retenue = this.form.get('retenue')?.value ?? 0;
    return Math.max(0, brut - retenue);
  }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger les paiements.'; this.loading = false; }
    });
  }

  rapportLabel(id: number): string {
    const r = this.rapports.find(r => r.idRapport === id);
    return r ? `Rapport #${r.idRapport} — ${r.descriptionTravaux}` : `#${id}`;
  }

  openCreateForm(): void {
    this.form.reset({ datePaiement: this.today(), montantBrut: 0, retenue: 0, modePaiement: 'VIREMENT', statut: 'EN_ATTENTE' });
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    const payload: PaiementSousTraitant = {
      datePaiement: value.datePaiement!,
      montantBrut: value.montantBrut!,
      retenue: value.retenue!,
      modePaiement: value.modePaiement ?? undefined,
      statut: value.statut ?? undefined,
      rapport: { idRapport: value.idRapport! }
    };

    this.service.create(payload).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: (err) => {
        this.errorMessage = err.status === 403
          ? "Vous n'avez pas la permission de creer un paiement."
          : 'Erreur lors de la creation du paiement (un paiement existe peut-etre deja pour ce rapport).';
      }
    });
  }

  remove(id: number): void {
    if (!confirm('Confirmer la suppression de ce paiement ?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMessage = 'Suppression impossible.'; }
    });
  }
}
