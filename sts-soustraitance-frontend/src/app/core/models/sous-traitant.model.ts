export interface SousTraitant {
  idSousTraitant?: number;
  raisonSociale: string;
  telephone?: string;
  email?: string;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
}
