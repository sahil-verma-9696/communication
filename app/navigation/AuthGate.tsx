import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuthContext } from "../context/auth.context";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAppGroup = segments[0] === "(app)";

    if (!isAuthenticated && inAppGroup) {
      router.replace("/");
    }

    if (isAuthenticated && !inAppGroup) {
      router.replace("/(app)/home");
    }
  }, [isAuthenticated, loading, segments]);

  return <>{children}</>;
}
