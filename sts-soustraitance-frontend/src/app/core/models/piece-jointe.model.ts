export type TypePiece = 'PHOTO' | 'PDF' | 'DOCUMENT';

export interface PieceJointe {
  idPiece?: number;
  dateCapture: string;
  cheminFichier: string;
  type: TypePiece;
  rapport: { idRapport: number };
}
