import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SousTraitant } from '../models/sous-traitant.model';

@Injectable({ providedIn: 'root' })
export class SousTraitantService {
  private readonly baseUrl = `${environment.apiUrl}/sous-traitants`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SousTraitant[]> {
    return this.http.get<SousTraitant[]>(this.baseUrl);
  }

  getById(id: number): Observable<SousTraitant> {
    return this.http.get<SousTraitant>(`${this.baseUrl}/${id}`);
  }

  create(data: SousTraitant): Observable<SousTraitant> {
    return this.http.post<SousTraitant>(this.baseUrl, data);
  }

  update(id: number, data: SousTraitant): Observable<SousTraitant> {
    return this.http.put<SousTraitant>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
