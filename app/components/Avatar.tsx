import { View, Text } from "react-native";
import React from "react";
import { Chat } from "@/hooks/use-chatPage-logic";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
  item: Chat;
};

const Avatar = (props: Props) => {
  const { item } = props;
  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: item.type === "group" ? "#FF9500" : "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
      }}
    >
      <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
        {item.type === "group" ? (
          <FontAwesome size={28} name="users" color={"white"} />
        ) : (
          <FontAwesome size={28} name="user" color={"white"} />
        )}
      </Text>
    </View>
  );
};

export default Avatar;
