import { View, Text, FlatList } from "react-native";
import React from "react";
import useNotificationTabLogic from "@/hooks/use-notificationTab-logic";

const Notification = () => {
  const ctx = useNotificationTabLogic();
  const { notifications } = ctx;
  return (
    <View>
      <Text>Notification</Text>
      {notifications && notifications.length === 0 && <Text>No friends</Text>}
      {notifications && notifications.length > 0 && (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <>
                <Text>{item.title}</Text>
                <Text>{item.message}</Text>
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default Notification;
