import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { useChatPageContext } from "@/context/chatPage.context";

const Filters = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const ctx = useChatPageContext();
  const { filters } = ctx;
  return (
    <View
      style={{
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingBottom: 12,
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              onPress={() => setActiveFilter(filter.id)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  activeFilter === filter.id ? "#007AFF" : "#f0f0f0",
              }}
            >
              <Text
                style={{
                  color: activeFilter === filter.id ? "white" : "#333",
                  fontWeight: activeFilter === filter.id ? "600" : "400",
                  fontSize: 14,
                }}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Filters;
