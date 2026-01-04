import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import color from "@/styles/color";
import getInitials from "@/utils/getInitials";
import { useFriendsPageContext } from "@/context/friendsPage.context";

type Props = {};

const SearchResults = (props: Props) => {
  const ctx = useFriendsPageContext();
  const {
    searchResults,
    query,
    searchResultsLoading,
    startChatLoading,
    handleMessage,
    handleStartChat,
  } = ctx;

  if (searchResultsLoading) {
    return (
      <View
        style={{
          backgroundColor: "#f5f5f5",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Search Results are Loading...</Text>
      </View>
    );
  }

  /**
   * If query is empty, don't render
   */
  if (query.length === 0) return null;
  return (
    <View
      style={{
        backgroundColor: "white",
        paddingLeft: 16,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "500" }}>Search Results</Text>
      {searchResults && searchResults.length === 0 && <Text>No friends</Text>}
      {searchResults && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: 16,
                }}
              >
                {/* Avatar */}
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: color.primaryBackground,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontWeight: "600",
                    }}
                  >
                    {getInitials(item.name!)}
                  </Text>
                </View>

                {/* User Details */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    {item.email}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {/* Friend Request Button */}
                  {!item.isFriend && (
                    <TouchableOpacity
                      onPress={() => {}}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: color.primary,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 22,
                          fontWeight: "600",
                          lineHeight: 22,
                        }}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Message Button */}
                  <TouchableOpacity
                    onPress={
                      typeof item.directChatId === "string"
                        ? handleMessage(item.directChatId)
                        : handleStartChat(item._id)
                    }
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: "#E5E7EB",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {startChatLoading
                        ? "Loading..."
                        : typeof item.directChatId === "string"
                        ? "Message"
                        : "Start Chat"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default SearchResults;
