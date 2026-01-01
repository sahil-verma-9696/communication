export type User = {
  _id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
  expiresIn: string;
};

export enum STORAGE_KEYS {
  ACCESS_TOKEN = "access_token",
  EXPIRES_AT = "expires_at",
  USER = "user",
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterationPayload = {
  name: string;
  email: string;
  password: string;
};
