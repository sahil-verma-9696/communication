import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "49372546697-omu3h9a0pgseorkmud3i1kped77etkap.apps.googleusercontent.com",
    webClientId:
      "49372546697-mvqd9e45et3m9gjdnd2hips38iqmhdot.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication!;
      loginWithBackend(id_token);
    }
  }, [response]);

  async function loginWithBackend(idToken: string) {
    await fetch(`${SERVER_BASE_URL}/auth/google/mobile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  }

  return {
    signInWithGoogle: () => promptAsync(),
    disabled: !request,
  };
}
