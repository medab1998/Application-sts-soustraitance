import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SousTraitantService } from '../../core/services/sous-traitant.service';
import { SousTraitant } from '../../core/models/sous-traitant.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sous-traitants',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sous-traitants.component.html'
})
export class SousTraitantsComponent implements OnInit {

  items: SousTraitant[] = [];
  loading = true;
  errorMessage = '';
  showForm = false;
  editingId: number | null = null;

  form = this.fb.group({
    raisonSociale: ['', Validators.required],
    telephone: [''],
    email: ['', Validators.email],
    statut: ['ACTIF', Validators.required]
  });

  constructor(
    private service: SousTraitantService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => {
        this.errorMessage = 'Impossible de charger les sous-traitants (acces refuse ou serveur indisponible).';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.editingId = null;
    this.form.reset({ statut: 'ACTIF' });
    this.showForm = true;
  }

  openEditForm(item: SousTraitant): void {
    this.editingId = item.idSousTraitant ?? null;
    this.form.setValue({
      raisonSociale: item.raisonSociale,
      telephone: item.telephone ?? '',
      email: item.email ?? '',
      statut: item.statut
    });
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue() as SousTraitant;

    const request$ = this.editingId
      ? this.service.update(this.editingId, value)
      : this.service.create(value);

    request$.subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: (err) => {
        this.errorMessage = err.status === 403
          ? "Vous n'avez pas la permission d'effectuer cette action."
          : 'Erreur lors de l\'enregistrement.';
      }
    });
  }

  remove(id: number): void {
    if (!confirm('Confirmer la suppression de ce sous-traitant ?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMessage = 'Suppression impossible (permission ou donnees liees).'; }
    });
  }

  badgeClass(statut: string): string {
    switch (statut) {
      case 'ACTIF': return 'badge-success';
      case 'SUSPENDU': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }
}
