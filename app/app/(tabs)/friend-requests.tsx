import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import useFriendRequestsTabLogic from "@/hooks/use-friendRequestsTab-logic";

const FriendRequests = () => {
  const ctx = useFriendRequestsTabLogic();
  const { friendRequests } = ctx;

  if (friendRequests && friendRequests.length === 0)
    return <Text>No friend requests</Text>;
  if (!friendRequests) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>friend requests</Text>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return <Text>{item.sender.name}</Text>;
        }}
      />
    </View>
  );
};

export default FriendRequests;

const styles = StyleSheet.create({});
