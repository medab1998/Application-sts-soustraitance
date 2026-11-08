import { Role } from './role.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}
