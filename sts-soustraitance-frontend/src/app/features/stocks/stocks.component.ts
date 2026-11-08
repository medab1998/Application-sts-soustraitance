import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from '../../core/services/stock.service';
import { ProduitService } from '../../core/services/produit.service';
import { Stock } from '../../core/models/stock.model';
import { Produit } from '../../core/models/produit.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stocks.component.html'
})
export class StocksComponent implements OnInit {

  items: Stock[] = [];
  produits: Produit[] = [];
  loading = true;
  errorMessage = '';
  showForm = false;

  form = this.fb.group({
    idProduit: [null as number | null, Validators.required],
    quantiteActuelle: [0, [Validators.required, Validators.min(0)]],
    stockMinimum: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private service: StockService,
    private produitService: ProduitService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
    this.produitService.getAll().subscribe(data => this.produits = data);
  }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger les stocks.'; this.loading = false; }
    });
  }

  produitNom(idProduit: number): string {
    return this.produits.find(p => p.idProduit === idProduit)?.designation ?? `Produit #${idProduit}`;
  }

  openCreateForm(): void {
    this.form.reset({ quantiteActuelle: 0, stockMinimum: 0 });
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    const payload: Stock = {
      quantiteActuelle: value.quantiteActuelle!,
      stockMinimum: value.stockMinimum!,
      produit: { idProduit: value.idProduit! }
    };

    this.service.create(payload).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: () => { this.errorMessage = 'Erreur lors de la creation du stock.'; }
    });
  }

  isAlerte(stock: Stock): boolean {
    return stock.quantiteActuelle <= stock.stockMinimum;
  }
}
