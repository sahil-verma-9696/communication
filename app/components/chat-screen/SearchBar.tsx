import { View, Text, TextInput, TextInputProps } from "react-native";
import React from "react";

type Props = {} & TextInputProps;

const SearchBar = (props: Props) => {
  return (
    <View style={{ backgroundColor: "white", padding: 16, paddingBottom: 12 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          paddingHorizontal: 16,
          height: 48,
        }}
      >
        <Text style={{ fontSize: 18, marginRight: 8, color: "#666" }}>🔍</Text>
        <TextInput
          {...props}
          style={{ flex: 1, fontSize: 16, color: "#333" }}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
};

export default SearchBar;
