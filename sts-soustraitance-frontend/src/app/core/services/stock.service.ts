import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Stock } from '../models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly baseUrl = `${environment.apiUrl}/stocks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.baseUrl);
  }

  create(data: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.baseUrl, data);
  }
}
