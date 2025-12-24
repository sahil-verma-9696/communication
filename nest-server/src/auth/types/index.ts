import { UserWithoutPassword } from 'src/users/schema/users.schema';

export interface AuthResponse {
  token: string;
  user: UserWithoutPassword;
  expiresIn: string; // in miliseconds
}
