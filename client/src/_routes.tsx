import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
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
import PrivateLayout from "./private.layout";
import { SignupPage } from "./pages/signup";

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

export const protectedChilds: RouteObject[] = [
  {
    path: "home",
    element: <HomePage />,
  },
  {
    path: "friends",
    element: <FriendsPage />,
    children: friendChilds,
  },
];

const appChilds: RouteObject[] = [
  {
    index: true,
    element: <LandingPage />,
  },
  {
    path: "/me",
    element: <PrivateLayout/>,
    children: protectedChilds,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
