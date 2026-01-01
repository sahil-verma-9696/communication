import { GlobalContextType } from "@/context/global.context";
import { STORAGE_KEYS, User } from "@/types/authentication.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";

export default function useGlobalContextLogic(): GlobalContextType {
  const pathname = usePathname();

  const [storageValue, setStorageValue] = useState<GlobalContextType>({
    user: null,
    accessToken: null,
    userId: null,
    userEmail: null,
    userName: null,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        const storedAccessToken = await AsyncStorage.getItem(
          STORAGE_KEYS.ACCESS_TOKEN
        );
        if (storedUser && storedAccessToken) {
          const parsedUser: User = JSON.parse(storedUser);
          setStorageValue({
            user: parsedUser,
            accessToken: storedAccessToken,
            userId: parsedUser._id,
            userEmail: parsedUser.email,
            userName: parsedUser.name,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [pathname]);

  return storageValue;
}
