import useChatWindowLogic from "@/hooks/use-chatWindow-logic";
import React from "react";
import { Button, FlatList, Text, View } from "react-native";

export default function ChatWindow() {
  const ctx = useChatWindowLogic();

  const { messages } = ctx;

  if (messages && messages.length === 0) return <Text>No messages</Text>;
  if (!messages) return <Text>Loading...</Text>;

  return (
    <>
      <View style={{ padding: 32 }}>
        <Text>Chat Window </Text>

        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return <Text>{item.text}</Text>;
          }}
        />
        <Button title="Send" onPress={() => {}} />
      </View>
    </>
  );
}
