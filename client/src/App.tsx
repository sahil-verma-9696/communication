import { Outlet } from "react-router";
import AuthGaurd from "./providers/auth-gaurd";

export default function App() {
  return (
    <>
      <AuthGaurd>
        <Outlet />
      </AuthGaurd>
    </>
  );
}
