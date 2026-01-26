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
  expiresIn: string; // in miliseconds
}

/**
 * login user
 * -----------
 */
export default async function login({
  payload,
}: LoginParams): Promise<AuthResponse> {
  return apiFetch<AuthResponse, LoginParams["payload"]>({
    url: `${SERVER_URL}/auth/login`,
    method: "POST",
    body: payload,
  });
}