import ChatListItem from "@/components/chat-screen/ChatListItem";
import Filters from "@/components/chat-screen/Filters";
import ChatPageContext from "@/context/chatPage.context";
import useChatPageLogic from "@/hooks/use-chatPage-logic";
import React from "react";
import { View, Text, FlatList } from "react-native";

export default function ChatsScreen() {
  const ctx = useChatPageLogic();
  const { chats, isLoading } = ctx;

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: "#f5f5f5",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Chats are Loading...</Text>
      </View>
    );
  }

  return (
    <ChatPageContext.Provider value={ctx}>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {/* Search Bar */}
        {/* <SearchBar /> */}

        {/* Filters */}
        {/* <Filters /> */}

        {/* Chat List */}
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          renderItem={({ item }) => {
            return <ChatListItem item={item} />;
          }}
          ListEmptyComponent={
            <View style={{ padding: 32, alignItems: "center" }}>
              <Text style={{ fontSize: 18, color: "#999" }}>
                No chats found
              </Text>
            </View>
          }
        />
      </View>
    </ChatPageContext.Provider>
  );
}
