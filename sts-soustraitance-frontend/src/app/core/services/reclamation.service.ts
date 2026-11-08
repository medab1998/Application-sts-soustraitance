import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reclamation } from '../models/reclamation.model';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private readonly baseUrl = `${environment.apiUrl}/reclamations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.baseUrl);
  }

  create(data: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.baseUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
