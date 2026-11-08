import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MouvementStockService } from '../../core/services/mouvement-stock.service';
import { SousTraitantService } from '../../core/services/sous-traitant.service';
import { ProduitService } from '../../core/services/produit.service';
import { StockService } from '../../core/services/stock.service';
import { MouvementStock, TypeMouvement } from '../../core/models/mouvement-stock.model';
import { SousTraitant } from '../../core/models/sous-traitant.model';
import { Produit } from '../../core/models/produit.model';
import { Stock } from '../../core/models/stock.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mouvements-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mouvements-stock.component.html'
})
export class MouvementsStockComponent implements OnInit {

  items: MouvementStock[] = [];
  sousTraitants: SousTraitant[] = [];
  produits: Produit[] = [];
  stocks: Stock[] = [];

  loading = true;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  readonly types: TypeMouvement[] = ['AFFECTATION', 'CONSOMMATION', 'RETOUR'];

  form = this.fb.group({
    dateMouvement: [this.today(), Validators.required],
    type: ['AFFECTATION' as TypeMouvement, Validators.required],
    quantite: [1, [Validators.required, Validators.min(1)]],
    idSousTraitant: [null as number | null, Validators.required],
    idProduit: [null as number | null, Validators.required],
    idStock: [null as number | null, Validators.required]
  });

  constructor(
    private service: MouvementStockService,
    private sousTraitantService: SousTraitantService,
    private produitService: ProduitService,
    private stockService: StockService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
    this.sousTraitantService.getAll().subscribe({ next: d => this.sousTraitants = d, error: () => {} });
    this.produitService.getAll().subscribe(d => this.produits = d);
    this.stockService.getAll().subscribe(d => this.stocks = d);
  }

  today(): string {
    return new Date().toISOString().substring(0, 10);
  }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger les mouvements de stock.'; this.loading = false; }
    });
  }

  sousTraitantNom(id: number): string {
    return this.sousTraitants.find(s => s.idSousTraitant === id)?.raisonSociale ?? `#${id}`;
  }

  produitNom(id: number): string {
    return this.produits.find(p => p.idProduit === id)?.designation ?? `#${id}`;
  }

  openCreateForm(): void {
    this.form.reset({ dateMouvement: this.today(), type: 'AFFECTATION', quantite: 1 });
    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    const payload: MouvementStock = {
      dateMouvement: value.dateMouvement!,
      type: value.type!,
      quantite: value.quantite!,
      sousTraitant: { idSousTraitant: value.idSousTraitant! },
      produit: { idProduit: value.idProduit! },
      stock: { idStock: value.idStock! }
    };

    this.errorMessage = '';
    this.service.create(payload).subscribe({
      next: () => {
        this.showForm = false;
        this.successMessage = 'Mouvement enregistre, le stock a ete mis a jour.';
        this.load();
        this.stockService.getAll().subscribe(d => this.stocks = d);
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        // Le backend renvoie un texte brut (ex: "Quantite insuffisante en stock")
        this.errorMessage = typeof err.error === 'string' && err.error
          ? err.error
          : (err.status === 403 ? "Vous n'avez pas la permission d'effectuer cette action." : 'Erreur lors de l\'enregistrement du mouvement.');
      }
    });
  }

  typeClass(type: TypeMouvement): string {
    switch (type) {
      case 'AFFECTATION': return 'badge-info';
      case 'CONSOMMATION': return 'badge-warning';
      case 'RETOUR': return 'badge-success';
    }
  }
}
