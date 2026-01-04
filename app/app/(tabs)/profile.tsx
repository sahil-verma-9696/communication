import { View, Text, Button } from "react-native";
import React from "react";
import { useAuthContext } from "@/context/auth.context";
import { useGlobalContext } from "@/context/global.context";

const Profile = () => {
  const { logout } = useAuthContext();
  const globCtx = useGlobalContext();
  const { userName, userEmail, userId } = globCtx;

  const handleLogoutPress = () => logout();

  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>
        {userName?.toUpperCase()}
      </Text>
      <Text>{userEmail}</Text>
      <Text>{userId}</Text>
      <Button title={`Logout`} onPress={handleLogoutPress} />
    </View>
  );
};

export default Profile;
