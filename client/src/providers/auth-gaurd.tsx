import AuthContext from "@/contexts/auth.contex";
import useAuthGuard from "@/hooks/use-auth-gaurd";

export default function AuthGaurd({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={useAuthGuard()}>
      {children}
    </AuthContext.Provider>
  );
}
