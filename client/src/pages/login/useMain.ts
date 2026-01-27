import localSpace from "@/services/local-space";
import login, { type AuthResponse } from "@/services/login";
import loginWithGoogle from "@/services/login-with-google";
import getCodeFromUrl from "@/services/get-code-from-url";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { SERVER_URL } from "@/app.constatns";

export default function useMain() {
  const navigate = useNavigate();

  /****************************************************
   * ****************** States ************************
   * *****************************************************/
  const [response, setResponse] = React.useState<AuthResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  /**
   * Handle form submit
   * -------------------------
   * Take data from form's entries and send to server.
   * handle loading, response and errors states
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.currentTarget));

    setLoading(true);

    try {
      const res = await login({
        payload: {
          email: formData.email as string,
          password: formData.password as string,
        },
      });

      localSpace.setUser(res.user);
      localSpace.setAccessToken(res.token);
      localSpace.setExpiresAt(res.expiresIn);

      setResponse(res);
      setError(null);
      setLoading(false);

      // 🚀 navigate only AFTER success
      navigate("/home", { replace: true });
    } catch (error) {
      console.log(error);
      setError((error as Error).message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle login with google
   * -------------------------
   */
  function handleLoginWithGoogle() {
    window.open(`${SERVER_URL}/auth/login?type=google`, "_self");
  }

  useEffect(() => {
    const code = getCodeFromUrl(window.location.search);

    console.log("code = ",code);

    if (code) {
      (async function () {
        try {
          const res = await loginWithGoogle(code);

          localSpace.setUser(res.user);
          localSpace.setAccessToken(res.token);
          localSpace.setExpiresAt(res.expiresIn);

          setResponse(res);
          setError(null);
          setLoading(false);

          // 🚀 navigate only AFTER success
          navigate("/me/home", { replace: true });
        } catch (error) {
          console.log(error);
          setError((error as Error).message);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  return {
    handleSubmit,
    handleLoginWithGoogle,
    loading,
    error,
    response,
  };
}
