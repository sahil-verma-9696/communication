import { SERVER_URL } from "@/app.constatns";
/**
 * Login with google
 * ------------------
 * It will open a new tab and redirect to the google login page.
 * via window.open(url, '_self')
 */
export default async function loginWithGoogle(code: string) {
  if (!code) {
    throw new Error("No code found");
  }

  try {
    const res = await fetch(
      `${SERVER_URL}/auth/google/oauth2callback?code=${encodeURI(code)}`,
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message ?? "Invalid credentials");
    }

    return data;
  } catch (error) {
    // 🚨 Network / CORS / Server down
    if (error instanceof TypeError) {
      throw new Error("Unable to connect to server. Server is Down.");
    }

    throw error;
  }
}
