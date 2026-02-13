import type { User } from "./services/auth";

export const APP_NAME = "Communication";

export const PROTECTED_ROUTES = ["home", "profile", "me", "friends"];

export const PUBLIC_ROUTES = ["login"];

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const DEFAULT_USER: User = {
  name: "Fallback User",
  email: "fallback@dummy.com",
  avatar:
    "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  createdAt: "",
  updatedAt: "",
  __v: 0,
  _id: "",
};
