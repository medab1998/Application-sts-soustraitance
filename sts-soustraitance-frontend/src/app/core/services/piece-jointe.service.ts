import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PieceJointe } from '../models/piece-jointe.model';

@Injectable({ providedIn: 'root' })
export class PieceJointeService {
  private readonly baseUrl = `${environment.apiUrl}/pieces-jointes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PieceJointe[]> {
    return this.http.get<PieceJointe[]>(this.baseUrl);
  }

  create(data: PieceJointe): Observable<PieceJointe> {
    return this.http.post<PieceJointe>(this.baseUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
