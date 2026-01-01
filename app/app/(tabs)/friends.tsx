import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import React from "react";
import useFriendsTabLogic from "@/hooks/use-friendsTab-logic";

const Friends = () => {
  const ctx = useFriendsTabLogic();
  const {
    friends,
    query,
    handleQueryChange,
    handleAddFriendClick,
    searchResults,
  } = ctx;

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
            <View>
              <View>
                <Text>{item.name}</Text>
                {!item.isFriend && (
                  <Button
                    onPress={handleAddFriendClick(item._id)}
                    title="Add Friend"
                  />
                )}
              </View>
              <Text>({item.email})</Text>
            </View>
          );
        }}
      />
      <Text>friends</Text>
      {friends && friends.length === 0 && <Text>No friends</Text>}
      {friends && friends.length > 0 && (
        <FlatList
          data={friends}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return <Text>{item.name}</Text>;
          }}
        />
      )}
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({});
