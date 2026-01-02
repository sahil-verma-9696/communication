import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import React from "react";
import useFriendRequestsTabLogic from "@/hooks/use-friendRequestsTab-logic";

const FriendRequests = () => {
  const ctx = useFriendRequestsTabLogic();
  const { friendRequests, handleFriendRequestAction } = ctx;

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
          return (
            <View>
              <View>
                <Text>{item.sender.name}</Text>
                <Text>{item.sender.email}</Text>
                <Text>{item.status}</Text>
              </View>
              <Button
                title="Accept"
                onPress={handleFriendRequestAction(item._id, "accept")}
              />
              <Button
                title="Reject"
                onPress={handleFriendRequestAction(item._id, "reject")}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default FriendRequests;

const styles = StyleSheet.create({});
