export interface PaiementSousTraitant {
  idPaiement?: number;
  datePaiement: string;
  montantBrut: number;
  retenue: number;
  montantNet?: number;
  modePaiement?: string;
  statut?: string;
  rapport: { idRapport: number };
}
