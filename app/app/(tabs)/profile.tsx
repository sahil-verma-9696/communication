import { View, Text, Button } from "react-native";
import React from "react";
import { useAuthContext } from "@/context/auth.context";

const Profile = () => {
  const { logout } = useAuthContext();

  const handleLogoutPress = () => logout();

  return (
    <View>
      <Text>Profile</Text>
      <Button title={`Logout`} onPress={handleLogoutPress} />
    </View>
  );
};

export default Profile;
