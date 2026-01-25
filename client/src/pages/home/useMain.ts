import { DEFAULT_USER } from "@/app.constatns";
import getNameAsAvtar from "@/services/getNameAsAvtar";
import localSpace from "@/services/local-space";

export default function useMain() {
  const user = localSpace.getUser() || DEFAULT_USER;
  const fallbackAvtar = getNameAsAvtar(user?.name);

  return {
    user,
    fallbackAvtar,
  };
}
