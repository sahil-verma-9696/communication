import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import SignUp from "@/pages/signup/page";
import { HomePage } from "./pages/home";
import { LandingPage } from "./pages/landing";
import App from "./App";
import { LoginPage } from "./pages/login";
import {
  AllFriends,
  FriendRequests,
  FriendsPage,
  OnlineFriends,
  PendingFriends,
} from "./pages/friends";

export const friendChilds: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="all" replace />,
  },
  {
    path: "all",
    element: <AllFriends />,
  },
  {
    path: "online",
    element: <OnlineFriends />,
  },
  {
    path: "pending",
    element: <PendingFriends />,
  },
  {
    path: "friend-requests",
    element: <FriendRequests />,
  },
];

const appChilds: RouteObject[] = [
  {
    index: true,
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/friends",
    element: <FriendsPage />,
    children: friendChilds,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: appChilds,
  },
]);

export default router;
