import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import useNotificationTabLogic from "@/hooks/use-notificationTab-logic";

const Notification = () => {
  const ctx = useNotificationTabLogic();
  const { notifications } = ctx;

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!notifications) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (notifications.length === 0) {
    return <Text style={styles.empty}>No notifications</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>

            <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Notification;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 8,
  },

  header: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  textContainer: {
    marginBottom: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  message: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },

  time: {
    fontSize: 12,
    color: "#9CA3AF",
    alignSelf: "flex-end",
  },

  empty: {
    marginTop: 40,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
  },

  loading: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 15,
  },
});
