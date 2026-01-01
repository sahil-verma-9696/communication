import { AuthContextType } from "@/context/auth.context";
import {
  AuthResponse,
  LoginCredentials,
  RegisterationPayload,
  STORAGE_KEYS,
} from "@/types/authentication.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import React, { useState } from "react";

export const SERVER_BASE_URL = "https://communication-ud8n.onrender.com"; // change for prod
export const useCheckAuthenticity = (): AuthContextType => {
  /********************************************************
   * ********************** Local States *********************
   *************************************************************/
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  /********************************************************
   * ********************** Reference Variables *********************
   *************************************************************/

  /********************************************************
   * ********************** FUNCTIONS *********************
   *************************************************************/
  async function login(payload: LoginCredentials) {
    setLoading(true);
    const res = await fetch(`${SERVER_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setLoading(false);
      const err = await res.json();
      throw new Error(err.message);
    }

    const resData: AuthResponse = await res.json(); // { accessToken, user }

    const expiresAt: string = String(
      Date.now() + Number(resData.expiresIn) * 1000
    );

    // store token and expiration date in AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, resData.token);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(resData.user));

    setLoading(false);
    if (pathname === "/login") router.push("/");
  }

  async function register(payload: RegisterationPayload) {
    setLoading(true);
    const res = await fetch(`${SERVER_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setLoading(false);
      const err = await res.json();
      throw new Error(err.message);
    }

    const resData: AuthResponse = await res.json(); // { accessToken, user }

    const expiresAt: string = String(
      Date.now() + Number(resData.expiresIn) * 1000
    );

    // store token and expiration date in AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, resData.token);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(resData.user));

    setLoading(false);
    if (pathname === "/login") router.push("/");
  }

  async function logout() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.EXPIRES_AT,
      STORAGE_KEYS.USER,
    ]);
    if (pathname !== "/login") router.push("/login");
  }

  /********************************************************
   * ********************** useEffects *********************
   *************************************************************/
  React.useEffect(() => {
    // bootstrap auth
    (async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const expiresAt = await AsyncStorage.getItem(STORAGE_KEYS.EXPIRES_AT);

      if (!token || !expiresAt || Date.now() > Number(expiresAt)) {
        if (pathname !== "/login") router.push("/login");
        setLoading(false);
      } else {
        if (pathname === "/login") router.push("/");
        setLoading(false);
      }
    })();
  }, [pathname, setLoading]);

  return {
    loading,
    logout,
    login,
    register,
  };
};
