import { SERVER_URL } from "@/app.constatns";

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
  try {
    const res = await fetch(`${SERVER_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message ?? "Invalid credentials");
    }

    return data;
  } catch (error) {
    // 🚨 Network / CORS / Server down
    if (error instanceof TypeError) {
      throw new Error("Unable to connect to server. Server is Down.");
    }

    throw error;
  }
}
