import type useGlobal from "@/hooks/use-global";
import { createContext, useContext } from "react";

type GlobalContextType = ReturnType<typeof useGlobal>;

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export default GlobalContext;

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used inside GlobalProvider");
  return ctx;
};
