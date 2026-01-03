import { View, Text } from "react-native";
import React from "react";
import { Chat } from "@/hooks/use-chatPage-logic";

type Props = {
  item: Chat;
};

const ChatInfo = (props: Props) => {
  const { item } = props;
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#000",
            flex: 1,
          }}
        >
          {item.name}
        </Text>
        <Text style={{ fontSize: 13, color: "#999", marginLeft: 8 }}>
          {item.joinedAt}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 14, color: "#666", flex: 1 }}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
        {item.unreadCount > 0 && (
          <View
            style={{
              backgroundColor: "#007AFF",
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 6,
              marginLeft: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ChatInfo;
