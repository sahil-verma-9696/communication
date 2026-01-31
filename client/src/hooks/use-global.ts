import { DEFAULT_USER } from "@/app.constatns";
import { useAuthContext } from "@/contexts/auth.contex";
import getNameAsAvtar from "@/services/getNameAsAvtar";
import localSpace from "@/services/local-space";
import type { User } from "@/services/auth";
import { useEffect, useState } from "react";

export default function useGlobal() {
  const { isAuthenticated } = useAuthContext();

  const [user, setUser] = useState<User>(DEFAULT_USER);
  const fallbackAvtar = getNameAsAvtar(user?.name);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(localSpace.getUser() || DEFAULT_USER);
  }, [isAuthenticated]);

  return {
    user,
    fallbackAvtar,
  };
}
