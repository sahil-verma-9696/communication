import { Stack } from "expo-router";

export default function ChatsLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Chats" }} />
        <Stack.Screen name="[chatId]" options={{ title: "Chat" }} />
      </Stack>
    </>
  );
}
