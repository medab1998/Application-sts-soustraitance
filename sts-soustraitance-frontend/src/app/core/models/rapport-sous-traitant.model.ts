export type StatutRapport = 'BROUILLON' | 'SOUMIS' | 'APPROUVE' | 'REJETE';

export interface RapportSousTraitant {
  idRapport?: number;
  dateRapport: string;
  descriptionTravaux: string;
  pourcentageAvancement?: number;
  quantiteRealisee?: number;
  statut?: StatutRapport;
  contrat: { idContrat: number };
}
