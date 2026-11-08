import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReclamationService } from '../../core/services/reclamation.service';
import { Reclamation, TypeReclamation, DeclarePar } from '../../core/models/reclamation.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reclamations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reclamations.component.html'
})
export class ReclamationsComponent implements OnInit {

  items: Reclamation[] = [];
  loading = true;
  errorMessage = '';
  showForm = false;

  readonly types: TypeReclamation[] = ['INCIDENT', 'ACCIDENT', 'HSE'];

  form = this.fb.group({
    dateDeclaration: [this.today(), Validators.required],
    type: ['INCIDENT' as TypeReclamation, Validators.required],
    description: ['', Validators.required],
    statut: ['OUVERTE']
  });

  constructor(
    private service: ReclamationService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void { this.load(); }

  today(): string { return new Date().toISOString().substring(0, 10); }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger les reclamations.'; this.loading = false; }
    });
  }

  openCreateForm(): void {
    this.form.reset({ dateDeclaration: this.today(), type: 'INCIDENT', statut: 'OUVERTE' });
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    // declarePar est deduit automatiquement du role de l'utilisateur connecte
    const declarePar: DeclarePar = this.authService.hasRole('SOUS_TRAITANT') ? 'SOUS_TRAITANT' : 'TECHNICIEN';

    const payload: Reclamation = {
      dateDeclaration: value.dateDeclaration!,
      type: value.type!,
      description: value.description!,
      statut: value.statut || 'OUVERTE',
      declarePar
    };

    this.service.create(payload).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: (err) => {
        this.errorMessage = err.status === 403
          ? "Vous n'avez pas la permission de declarer une reclamation."
          : 'Erreur lors de la declaration.';
      }
    });
  }

  remove(id: number): void {
    if (!confirm('Confirmer la suppression de cette reclamation ?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMessage = 'Suppression impossible.'; }
    });
  }

  typeClass(type: TypeReclamation): string {
    switch (type) {
      case 'ACCIDENT': return 'badge-danger';
      case 'HSE': return 'badge-warning';
      default: return 'badge-info';
    }
  }
}
