import localSpace from "@/services/local-space";
import { register, type AuthResponse } from "@/services/auth";
import React from "react";
import { useNavigate } from "react-router";

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
      const res = await register({
        payload: {
          email: formData.email as string,
          name: formData.name as string,
          password: formData.password as string,
        },
      });

      localSpace.setUser(res.user);
      localSpace.setAccessToken(res.token);
      localSpace.setExpiresAt(res.token);

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
  }

  return {
    handleSubmit,
    loading,
    error,
    response,
  };
}
