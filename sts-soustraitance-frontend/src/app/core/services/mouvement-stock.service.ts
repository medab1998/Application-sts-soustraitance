import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MouvementStock } from '../models/mouvement-stock.model';

@Injectable({ providedIn: 'root' })
export class MouvementStockService {
  private readonly baseUrl = `${environment.apiUrl}/mouvements-stock`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(this.baseUrl);
  }

  getBySousTraitant(idSousTraitant: number): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(`${this.baseUrl}/sous-traitant/${idSousTraitant}`);
  }

  // Le backend met a jour automatiquement la quantite du Stock associe
  create(data: MouvementStock): Observable<MouvementStock> {
    return this.http.post<MouvementStock>(this.baseUrl, data);
  }
}
