import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";

export type User = {
  avatar: string | null;
  createdAt: string;
  email: string;
  name: string;
  updatedAt: string;
  verified_email: boolean;
  __v: number;
  _id: string;
};

export type LoginParams = {
  payload: {
    email: string;
    password: string;
  };
};

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * login user
 * -----------
 */
export async function login({
  payload,
}: LoginParams): Promise<AuthResponse> {
  return apiFetch<AuthResponse, LoginParams["payload"]>({
    url: `${SERVER_URL}/auth/login`,
    method: "POST",
    body: payload,
  });
}

export type RegisterParams = {
  payload: {
    name: string;
    email: string;
    password: string;
  };
};

/**
 * Register user
 * -----------
 */
export async function register({
  payload,
}: RegisterParams): Promise<AuthResponse> {
  return apiFetch<AuthResponse, RegisterParams["payload"]>({
    url: `${SERVER_URL}/auth/register`,
    method: "POST",
    body: payload,
  });
}