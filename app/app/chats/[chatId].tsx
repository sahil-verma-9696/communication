import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CURRENT_USER_ID = "userA";

interface Message {
  _id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

const initialMessages: Message[] = [
  {
    _id: "1",
    text: "Hey 👋",
    senderId: "userB",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    text: "Hi! How are you?",
    senderId: "userA",
    createdAt: new Date().toISOString(),
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        text,
        senderId: CURRENT_USER_ID,
        createdAt: new Date().toISOString(),
      },
    ]);
    setText("");
  };

  return (
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
          const isMe = item.senderId === CURRENT_USER_ID;
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
          onPress={handleSend}
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
  );
}
