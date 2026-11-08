export type TypeMouvement = 'AFFECTATION' | 'CONSOMMATION' | 'RETOUR';

export interface MouvementStock {
  idMouvement?: number;
  dateMouvement: string;
  type: TypeMouvement;
  quantite: number;
  sousTraitant: { idSousTraitant: number };
  produit: { idProduit: number };
  stock: { idStock: number };
}
