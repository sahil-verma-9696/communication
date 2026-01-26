import GlobalContext from "@/contexts/global.context";
import useGlobal from "@/hooks/use-global";

export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalContext.Provider value={useGlobal()}>
      {children}
    </GlobalContext.Provider>
  );
}
