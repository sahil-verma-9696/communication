import { StyleSheet, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/partial-react-logo.png")}
        style={styles.logo}
        contentFit="contain"
      />

      {/* Title */}
      <ThemedText type="title" style={styles.title}>
        Communication
      </ThemedText>

      {/* Subtitle */}
      <ThemedText type="subtitle" style={styles.subtitle}>
        Chat instantly. Securely. Anywhere.
      </ThemedText>

      {/* Actions */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <ThemedText style={styles.primaryText}>Login</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(auth)/register")}
        >
          <ThemedText style={styles.secondaryText}>Create Account</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(home)/home")}
        >
          <ThemedText style={styles.secondaryText}>Home</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },

  title: {
    marginBottom: 8,
    fontWeight: "700",
  },

  subtitle: {
    color: "#777",
    textAlign: "center",
    marginBottom: 40,
  },

  buttonGroup: {
    width: "100%",
  },

  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  secondaryText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 16,
  },
});
