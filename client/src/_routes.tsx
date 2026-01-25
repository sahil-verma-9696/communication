import { createBrowserRouter } from "react-router";
import SignUp from "@/pages/signup/page";
import { HomePage } from "./pages/home";
import { LandingPage } from "./pages/landing";
import App from "./App";
import { LoginPage } from "./pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);

export default router;
