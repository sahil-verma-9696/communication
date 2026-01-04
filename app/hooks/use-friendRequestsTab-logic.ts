import { useGlobalContext } from "@/context/global.context";
import { useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { User } from "@/types/authentication.types";

export type FriendRequest = {
  _id: string;
  sender: User;
  receiver: User;
  status: "pending" | "accepted" | "rejected";
};
export default function useFriendRequestsTabLogic() {
  /********************************************************
   * ********************** Local States *********************
   *************************************************************/
  const [friendRequests, setFriendRequests] = useState<FriendRequest[] | null>(
    null
  );
  const [sendedRequests, setSentRequests] = useState<FriendRequest[] | null>(
    null
  );
  const [receivedRequests, setReceivedRequests] = useState<
    FriendRequest[] | null
  >();
  const [actionResLoading, setActionLoading] = useState(false);

  /********************************************************
   * ********************** Other Hooks *********************
   *************************************************************/
  const { accessToken } = useGlobalContext();

  /********************************************************
   * ********************** Handlers *********************
   *************************************************************/

  /**
   * handle friend request action ACCEPT | REJECT
   * ---------------------------------
   * @param friendRequestId
   * @param action
   * @returns
   */
  const handleFriendRequestAction =
    (friendRequestId: string, action: "accept" | "reject") => () => {
      respondToFriendRequest(friendRequestId, action);
    };

  /********************************************************
   * ********************** Functions *********************
   *************************************************************/

  /**
   * Responde to friend request action ACCEPT | REJECT
   * ---------------------------------------------------
   * @param friendRequestId
   * @param action "accept" | "reject"
   */
  async function respondToFriendRequest(
    friendRequestId: string,
    action: "accept" | "reject"
  ) {
    try {
      if (!friendRequestId) {
        throw new Error("Friend request id is required");
      }
      setActionLoading(true);
      const res = await fetch(
        `${SERVER_BASE_URL}/friendrequests/${friendRequestId}?action=${action}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      setActionLoading(false);
      console.log(data, "accept friend request");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setActionLoading(false);
    }
  }

  /********************************************************
   * ********************** Effects *********************
   *************************************************************/

  /** Fetching */
  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(`${SERVER_BASE_URL}/friendrequests`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const resData = await res.json();
        console.log("friend requests ::: ", resData);
        setFriendRequests(resData);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setFriendRequests(null);
      }
    })();
  }, [accessToken]);

  /**
   * fetching sent requests
   * ---------------------
   */
  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(`${SERVER_BASE_URL}/friendrequests?type=send`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const resData = await res.json();
        console.log("sent requests ::: ", resData);
        setSentRequests(resData);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setSentRequests(null);
      }
    })();
  }, [accessToken]);

  /**
   * fetching received requests
   * ---------------------
   */
  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(
          `${SERVER_BASE_URL}/friendrequests?type=receive`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const resData = await res.json();
        console.log("received requests ::: ", resData);
        setReceivedRequests(resData);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setReceivedRequests(null);
      }
    })();
  }, [accessToken]);

  /********************************************************
   * ********************** Returns *********************
   *************************************************************/
  return {
    friendRequests,
    receivedRequests,
    sendedRequests,
    actionResLoading,
    handleFriendRequestAction,
  };
}
