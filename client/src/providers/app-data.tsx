import AppContext from "@/contexts/app.context";
import useAppData from "@/hooks/use-app-data";

export default function AppDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppContext.Provider value={useAppData()}>{children}</AppContext.Provider>
  );
}

AppDataProvider.displayName = "AppDataProvider";
