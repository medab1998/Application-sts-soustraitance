export interface Stock {
  idStock?: number;
  quantiteActuelle: number;
  stockMinimum: number;
  produit: { idProduit: number };
}
