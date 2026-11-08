import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaiementSousTraitant } from '../models/paiement-sous-traitant.model';

@Injectable({ providedIn: 'root' })
export class PaiementSousTraitantService {
  private readonly baseUrl = `${environment.apiUrl}/paiements-sous-traitant`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PaiementSousTraitant[]> {
    return this.http.get<PaiementSousTraitant[]>(this.baseUrl);
  }

  // montantNet est calcule automatiquement par le backend (montantBrut - retenue)
  create(data: PaiementSousTraitant): Observable<PaiementSousTraitant> {
    return this.http.post<PaiementSousTraitant>(this.baseUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
