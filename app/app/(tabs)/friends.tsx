import { StyleSheet, Text, View, FlatList, TextInput } from "react-native";
import React from "react";
import useFriendsTabLogic from "@/hooks/use-friendsTab-logic";

const Friends = () => {
  const ctx = useFriendsTabLogic();
  const { friends, query, handleQueryChange, searchResults } = ctx;

  if (friends && friends.length === 0) return <Text>No friends</Text>;
  if (!friends) return <Text>Loading...</Text>;

  return (
    <View>
      <TextInput
        placeholder="Enter user name or email"
        value={query}
        onChangeText={handleQueryChange}
      />
      <Text>users</Text>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <Text>
              {item.name}({item.email})
            </Text>
          );
        }}
      />
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
