import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Projet } from '../models/projet.model';

@Injectable({ providedIn: 'root' })
export class ProjetService {
  private readonly baseUrl = `${environment.apiUrl}/projets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.baseUrl);
  }

  create(data: Projet): Observable<Projet> {
    return this.http.post<Projet>(this.baseUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
