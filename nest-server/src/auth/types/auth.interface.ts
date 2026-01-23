import { AuthResponse } from './index';

export type Credentials = {};

export interface AuthService {
  login(credentials: Credentials): AuthResponse;
  register(credentials: Credentials): AuthResponse;
  logout(): AuthResponse;
  me(): AuthResponse;
  refresh(): AuthResponse;
}
