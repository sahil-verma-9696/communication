import ChatPageContext from "@/context/chatPage.context";
import { useGlobalContext } from "@/context/global.context";
import useChatPageLogic from "@/hooks/use-chatPage-logic";
import { router } from "expo-router";
import React from "react";
import { Button, FlatList, Pressable, Text, View } from "react-native";

export default function Chats() {
  const ctx = useChatPageLogic();
  const globalCtx = useGlobalContext();
  const { chats } = ctx;
  const { userName, userEmail,userId } = globalCtx;


  const handleChatPress = (chatId: string) => {
    return () => {
      ctx.setSelectedChatId(chatId);
      router.push({
        pathname: "/chats/[chatId]",
        params: { chatId: chatId },
      });
    };
  };

  if (!chats) return <Text>Loading...</Text>;
  return (
    <>
      <ChatPageContext.Provider value={ctx}>
        <View style={{ padding: 32 }}>
          <Text>Welcome</Text>
          <Text>name : {userName}</Text>
          <Text>email : {userEmail}</Text>
          <Text>_id : {userId}</Text>
          <Text>Your Chats :::::: </Text>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.chatId}
            renderItem={({ item }) => {
              return (
                <Pressable
                  key={item.chatId}
                  style={{ padding: 16 }}
                  onPress={handleChatPress(item.chatId)}
                >
                  <Text>{item.name || "Direct Chat"}</Text>
                  <Text>{item.type}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </ChatPageContext.Provider>
    </>
  );
}
