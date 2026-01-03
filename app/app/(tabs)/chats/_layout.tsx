import { Stack } from "expo-router";

export default function ChatsLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Chats" }} />
        <Stack.Screen name="[chatId]" options={{ title: "Chat" }} />
      </Stack>
    </>
  );
}
