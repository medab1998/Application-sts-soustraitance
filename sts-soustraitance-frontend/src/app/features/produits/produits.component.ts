import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProduitService } from '../../core/services/produit.service';
import { Produit } from '../../core/models/produit.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produits.component.html'
})
export class ProduitsComponent implements OnInit {

  items: Produit[] = [];
  loading = true;
  errorMessage = '';
  showForm = false;

  form = this.fb.group({
    designation: ['', Validators.required],
    prixUnitaire: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private service: ProduitService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger les produits.'; this.loading = false; }
    });
  }

  openCreateForm(): void {
    this.form.reset({ prixUnitaire: 0 });
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; }

  submit(): void {
    if (this.form.invalid) return;
    this.service.create(this.form.getRawValue() as Produit).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: () => { this.errorMessage = 'Erreur lors de la creation du produit.'; }
    });
  }

  remove(id: number): void {
    if (!confirm('Confirmer la suppression de ce produit ?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMessage = 'Suppression impossible (produit lie a un stock existant).'; }
    });
  }
}
