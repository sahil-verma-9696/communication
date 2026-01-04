import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import useFriendRequestsTabLogic from "@/hooks/use-friendRequestsTab-logic";

const FriendRequests = () => {
  const ctx = useFriendRequestsTabLogic();
  const { friendRequests, handleFriendRequestAction } = ctx;

  const [activeTab, setActiveTab] = React.useState<"received" | "sent">(
    "received"
  );

  if (!friendRequests) return <Text>Loading...</Text>;

  const filteredRequests = friendRequests.filter((req) =>
    activeTab === "received"
      ? req.status === "pending"
      : req.status === "accepted"
  );

  if (friendRequests.length === 0)
    return <Text style={styles.empty}>No requests</Text>;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab
          label="Requests"
          active={activeTab === "received"}
          onPress={() => setActiveTab("received")}
        />
        <Tab
          label="My Requests"
          active={activeTab === "sent"}
          onPress={() => setActiveTab("sent")}
        />
      </View>

      {/* List */}
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.sender.name}</Text>
              <Text style={styles.email}>{item.sender.email}</Text>
            </View>

            {/* Actions */}
            {activeTab === "received" ? (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.accept}
                  onPress={() => handleFriendRequestAction(item._id, "accept")}
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.reject}
                  onPress={() => handleFriendRequestAction(item._id, "reject")}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.pending}>Pending</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const Tab = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tabContainer, active && styles.activeTabContainer]}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default FriendRequests;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flex: 1, // 🔥 THIS IS KEY
    alignItems: "center",
    paddingVertical: 12,
  },

  activeTabContainer: {
    borderBottomWidth: 2,
    borderColor: "#2563EB",
  },

  tabText: {
    fontSize: 16,
    color: "#6B7280",
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    color: "#6B7280",
  },

  tab: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 12,
    fontSize: 16,
    color: "red",
  },

  activeTab: {
    color: "#111827",
    fontWeight: "600",
    borderBottomWidth: 2,
    borderColor: "#2563EB",
  },

  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activeTabText: {
    color: "#111827",
    fontWeight: "600",
  },

  info: {
    marginBottom: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
  },

  accept: {
    flex: 1,
    backgroundColor: "#22C55E",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  reject: {
    flex: 1,
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  pending: {
    color: "#6B7280",
    fontWeight: "500",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },
});
