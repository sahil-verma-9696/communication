import navigateFromLogin from "@/services/navigate-fromLogin";
import navigateToLogin from "@/services/navigate-toLogin";
import validateToken from "@/services/validate-token";
import localSpace from "@/services/local-space";

export default function checkAuth(
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const token = localSpace.getAccessToken();
  const expiresAt = localSpace.getExpiresAt();
  const isValid = validateToken({ token, expiresAt });

  if (isValid) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(true);
    navigateFromLogin();
  } else {
    setIsAuthenticated(false);
    navigateToLogin();
  }
}
