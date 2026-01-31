import { UserJSON } from 'src/users/schema/users.schema';

export interface AuthResponse {
  token: string;
  user: UserJSON;
}
