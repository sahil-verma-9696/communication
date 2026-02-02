import { useGlobalContext } from "@/contexts/global.context";
import useAsyncState from "@/hooks/use-async-state";
import { getUserProfile, type UserProfileResponse } from "@/services/get-userProfile";
import { useEffect } from "react";

export default function useMain() {
  const { user } = useGlobalContext();
  const {
    data: userProfile,
    setData: setUserProfile,
    error: userProfileError,
    setError: setUserProfileError,
    loading: userProfileLoading,
    setLoading: setUserProfileLoading,
  } = useAsyncState<UserProfileResponse>();

  // GET ALL FRIENDS
  useEffect(() => {
    if (!user._id) return;
    (async () => {
      try {
        setUserProfileLoading(true);
        const userProfile = await getUserProfile(user._id);
        console.log(userProfile);

        setUserProfile(userProfile);

        setUserProfileLoading(false);
      } catch (error) {
        setUserProfileError((error as Error).message);
        setUserProfileLoading(false);
      } finally {
        setUserProfileLoading(false);
      }
    })();
  }, [user._id]);

  return {
    userProfile,
    userProfileError,
    userProfileLoading,
  };
}
