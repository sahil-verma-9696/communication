import { View, Text, Pressable } from "react-native";
import React from "react";
import Avatar from "../Avatar";
import { Chat } from "@/hooks/use-chatPage-logic";
import { useChatPageContext } from "@/context/chatPage.context";
import ChatInfo from "./ChatInfo";

type Props = {
  item: Chat;
};

const ChatListItem = (props: Props) => {
  const { item } = props;
  const ctx = useChatPageContext();
  const { handleChatClick } = ctx;
  return (
    <Pressable
      onPress={handleChatClick(item.chatId)}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#f9f9f9" : "white",
        padding: 16,
        marginBottom: 1,
        flexDirection: "row",
        alignItems: "center",
      })}
    >
      {/* Avatar */}
      <Avatar item={item} />

      {/* Chat Info */}
      <ChatInfo item={item} />
    </Pressable>
  );
};

export default ChatListItem;
