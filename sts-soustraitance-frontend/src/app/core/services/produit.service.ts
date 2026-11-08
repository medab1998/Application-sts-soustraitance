import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produit } from '../models/produit.model';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private readonly baseUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.baseUrl);
  }

  create(data: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.baseUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
