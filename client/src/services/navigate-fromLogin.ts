import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/app.constatns";

/**
 * 
 * Navigates to the first protected route if the current location is a public route
 */
export default function navigateFromLogin(): void {
  const currentLocation = window.location.href.split("/").pop() || "/";
  if (PUBLIC_ROUTES.includes(currentLocation)) {
    window.location.href = `/me/${PROTECTED_ROUTES[0]}`;
  }
}
