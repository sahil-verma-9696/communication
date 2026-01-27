import { Outlet } from "react-router";
import AuthGaurd from "./providers/auth-gaurd";
import GlobalContextProvider from "./providers/global";

export default function App() {
  return (
    <>
      <GlobalContextProvider>
        <AuthGaurd>
          <Outlet />
        </AuthGaurd>
      </GlobalContextProvider>
    </>
  );
}
