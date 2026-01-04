import AuthProvider from "@/provider/auth.provider";
import GlobalContextProvider from "@/provider/globalContext.provider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <GlobalContextProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="chats" />
            <Stack.Screen
              name="chats/[chatId]"
              options={{ title: "Chat", headerShown: true }}
            />
            <Stack.Screen name="login" />
          </Stack>
        </GlobalContextProvider>
      </AuthProvider>
    </>
  );
}
