import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import React from "react";
import useFriendsTabLogic from "@/hooks/use-friendsTab-logic";
import SearchBar from "@/components/chat-screen/SearchBar";
import getInitials from "@/utils/getInitials";
import color from "@/styles/color";
import FriendsPageContext from "@/context/friendsPage.context";
import FriendsList from "@/components/friends-screen/FriendsList";
import SearchResults from "@/components/friends-screen/SearchResults";

const Friends = () => {
  const ctx = useFriendsTabLogic();
  const { friends, query, handleQueryChange, friendsLoading } = ctx;

  if (friendsLoading)
    return (
      <View
        style={{
          backgroundColor: "#f5f5f5",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Friends are Loading...</Text>
      </View>
    );

  return (
    <FriendsPageContext.Provider value={ctx}>
      <View>
        <SearchBar
          placeholder="Search User"
          value={query}
          onChangeText={handleQueryChange}
        />

        {/* Search Results */}
        <SearchResults />

        {/* Friends list */}
        <FriendsList />
      </View>
    </FriendsPageContext.Provider>
  );
};

export default Friends;

const styles = StyleSheet.create({});
