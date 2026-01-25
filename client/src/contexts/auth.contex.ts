import { createContext, useContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
