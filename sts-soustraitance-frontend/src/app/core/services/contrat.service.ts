import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contrat } from '../models/contrat.model';

@Injectable({ providedIn: 'root' })
export class ContratService {
  private readonly baseUrl = `${environment.apiUrl}/contrats`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(this.baseUrl);
  }

  getBySousTraitant(idSousTraitant: number): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.baseUrl}/sous-traitant/${idSousTraitant}`);
  }

  create(data: Contrat): Observable<Contrat> {
    return this.http.post<Contrat>(this.baseUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
