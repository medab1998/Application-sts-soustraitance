export interface Contrat {
  idContrat?: number;
  numeroContrat: string;
  dateDebut?: string;
  dateFin?: string;
  montantTotal?: number;
  retenueGarantie?: number;
  sousTraitant: { idSousTraitant: number };
  projet: { idProjet: number };
}
