export type TypeReclamation = 'INCIDENT' | 'ACCIDENT' | 'HSE';
export type DeclarePar = 'TECHNICIEN' | 'SOUS_TRAITANT';

export interface Reclamation {
  idReclamation?: number;
  dateDeclaration: string;
  type: TypeReclamation;
  description: string;
  statut?: string;
  declarePar: DeclarePar;
  rapport?: { idRapport: number } | null;
}
