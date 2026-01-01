import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

type Props = {};

const Index = (props: Props) => {
  return <Redirect href="/chats" />;
};

export default Index;
