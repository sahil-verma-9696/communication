import ChatWindowContext from "@/context/chatWindow.context";
import { useGlobalContext } from "@/context/global.context";
import useChatWindowLogic from "@/hooks/use-chatWindow-logic";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  const ctx = useChatWindowLogic();
  const { userId: CURRENT_USER_ID } = useGlobalContext();
  const { messages, text, setText, handleSendMessage } = ctx;

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  return (
    <ChatWindowContext.Provider value={ctx}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: 12,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => {
            const isMe = item.sender?._id === CURRENT_USER_ID;
            return (
              <View
                style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "#DCF8C6" : "#F1F1F1",
                  padding: 10,
                  borderRadius: 14,
                  marginVertical: 4,
                  maxWidth: "75%",
                }}
              >
                <Text>{item.text}</Text>
              </View>
            );
          }}
        />

        {/* Input bar */}
        <View
          style={{
            flexDirection: "row",
            padding: 8,
            paddingBottom: 50 + insets.bottom,
            borderTopWidth: 1,
            borderColor: "#eee",
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            multiline
            style={{
              flex: 1,
              backgroundColor: "#f5f5f5",
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 10,
              maxHeight: 100,
            }}
          />

          <TouchableOpacity
            onPress={handleSendMessage()}
            style={{
              marginLeft: 8,
              backgroundColor: "#0A84FF",
              borderRadius: 20,
              paddingHorizontal: 16,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ChatWindowContext.Provider>
  );
}
