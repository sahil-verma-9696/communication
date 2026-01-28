import type useAppData from "@/hooks/use-app-data";
import { createContext, useContext } from "react";

type ContextType = ReturnType<typeof useAppData>;

const Context = createContext<ContextType | undefined>(undefined);

export default Context;

export const useAppContext = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useAppContext must be used inside AppDataProvider");
  return ctx;
};
