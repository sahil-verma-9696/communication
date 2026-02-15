import { SERVER_URL } from "@/app.constatns";
import localSpace from "@/services/local-space";
import React from "react";
import { useSearchParams } from "react-router";

export default function useMain() {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");

  React.useEffect(() => {
    if (!userId) return;
    (async () => {
      const res = await fetch(`${SERVER_URL}/chats?participant=${userId}`, {
        headers: { Authorization: `Bearer ${localSpace.getAccessToken()}` },
      });
    })();
  }, [userId]);

  return {};
}
