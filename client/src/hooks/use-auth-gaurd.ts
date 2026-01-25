import checkAuth from "@/services/check-auth";
import { useLayoutEffect, useState } from "react";

import { useLocation } from "react-router";

export default function useAuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const location = useLocation();

  function handleAuthChange() {
    checkAuth(setIsAuthenticated);
  }

  useLayoutEffect(() => {
    
    checkAuth(setIsAuthenticated);

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, [window.location.pathname, location.pathname]);

  return { isAuthenticated };
}
