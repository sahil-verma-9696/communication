import { PROTECTED_ROUTES } from "@/app.constatns";

export default function navigateToLogin(): void {
  const currentLocation = window.location.href.split("/").pop() || "/";
  if (PROTECTED_ROUTES.includes(currentLocation)) {
    window.location.href = "/login";
  }
}
