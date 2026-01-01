import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import useFriendsTabLogic from "@/hooks/use-friendsTab-logic";

const Friends = () => {
  const ctx = useFriendsTabLogic();
  const { friends } = ctx;

  if (friends && friends.length === 0) return <Text>No friends</Text>;
  if (!friends) return <Text>Loading...</Text>;
  
  return (
    <View>
      <Text>friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return <Text>{item.name}</Text>;
        }}
      />
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({});
