import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjetService } from '../../core/services/projet.service';
import { Projet } from '../../core/models/projet.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projets.component.html'
})
export class ProjetsComponent implements OnInit {

  items: Projet[] = [];
  loading = true;
  errorMessage = '';
  showForm = false;

  form = this.fb.group({
    nom: ['', Validators.required],
    client: [''],
    dateDebut: [''],
    dateFin: ['']
  });

  constructor(
    private service: ProjetService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger les projets.'; this.loading = false; }
    });
  }

  openCreateForm(): void {
    this.form.reset();
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; }

  submit(): void {
    if (this.form.invalid) return;
    this.service.create(this.form.getRawValue() as Projet).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: () => { this.errorMessage = 'Erreur lors de la creation du projet.'; }
    });
  }

  remove(id: number): void {
    if (!confirm('Confirmer la suppression de ce projet ?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMessage = 'Suppression impossible (permission ou donnees liees).'; }
    });
  }
}
