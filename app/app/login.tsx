import { useAuthContext } from "@/context/auth.context";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useAuthContext();

  const handleRegister = async () => {
    try {
      await login({ email, password });
    } catch (err: any) {
      alert(err.message || "Registration failed");
    }
  };
  return (
    <View style={{ padding: 32 }}>
      <Text>Login Screen</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={`${loading ? "Loading..." : "Login"}`}
        onPress={handleRegister}
      />
    </View>
  );
}
