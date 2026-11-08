import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RapportSousTraitant, StatutRapport } from '../models/rapport-sous-traitant.model';

@Injectable({ providedIn: 'root' })
export class RapportSousTraitantService {
  private readonly baseUrl = `${environment.apiUrl}/rapports-sous-traitant`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RapportSousTraitant[]> {
    return this.http.get<RapportSousTraitant[]>(this.baseUrl);
  }

  getByContrat(idContrat: number): Observable<RapportSousTraitant[]> {
    return this.http.get<RapportSousTraitant[]>(`${this.baseUrl}/contrat/${idContrat}`);
  }

  create(data: RapportSousTraitant): Observable<RapportSousTraitant> {
    return this.http.post<RapportSousTraitant>(this.baseUrl, data);
  }

  changerStatut(id: number, statut: StatutRapport): Observable<RapportSousTraitant> {
    return this.http.put<RapportSousTraitant>(`${this.baseUrl}/${id}/statut?statut=${statut}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
