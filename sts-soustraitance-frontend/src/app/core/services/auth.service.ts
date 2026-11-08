import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'sts_token';
const USERNAME_KEY = 'sts_username';
const ROLE_KEY = 'sts_role';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // signal reactif utilise par la navbar / les gardes pour savoir si on est connecte
  readonly currentUsername = signal<string | null>(localStorage.getItem(USERNAME_KEY));
  readonly currentRole = signal<string | null>(localStorage.getItem(ROLE_KEY));

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap(res => this.storeSession(res)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(tap(res => this.storeSession(res)));
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USERNAME_KEY, res.username);
    localStorage.setItem(ROLE_KEY, res.role);
    this.currentUsername.set(res.username);
    this.currentRole.set(res.role);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.currentUsername.set(null);
    this.currentRole.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(...roles: string[]): boolean {
    const role = this.currentRole();
    return !!role && roles.includes(role);
  }
}
