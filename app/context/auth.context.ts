import {
  LoginCredentials,
  RegisterationPayload,
} from "@/types/authentication.types";
import { createContext, useContext } from "react";

export type AuthContextType = {
  isLoggedIn: boolean;  
  loading: boolean;
  logout: () => Promise<void>;
  login: (payload: LoginCredentials) => Promise<void>;
  register: (payload: RegisterationPayload) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
export default AuthContext;
