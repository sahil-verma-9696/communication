import { User } from "@/types/authentication.types";
import { createContext, useContext } from "react";

export type GlobalContextType = {
  user: User | null;
  accessToken: string | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function useGlobalContext() {
  const ctx = useContext(GlobalContext);
  if (!ctx)
    throw new Error(
      "useGlobalContext must be used inside GlobalContextProvider"
    );
  return ctx;
}
export default GlobalContext;
