import { View, Text } from "react-native";
import React from "react";
import useNotificationTabLogic from "@/hooks/use-notificationTab-logic";

const Notification = () => {
  const ctx = useNotificationTabLogic();
  return (
    <View>
      <Text>Notification</Text>
    </View>
  );
};

export default Notification;
