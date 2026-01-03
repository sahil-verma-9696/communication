import { View, Text, FlatList } from "react-native";
import React from "react";
import color from "@/styles/color";
import getInitials from "@/utils/getInitials";
import { useFriendsPageContext } from "@/context/friendsPage.context";

type Props = {};

const SearchResults = (props: Props) => {
  const ctx = useFriendsPageContext();
  const { searchResults, query, searchResultsLoading } = ctx;

  if (searchResultsLoading)
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
                  alignItems: "start",
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
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {item.name}
                  </Text>

                  <Text style={{ fontSize: 14, fontWeight: "300" }}>
                    {item.email}
                  </Text>
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
