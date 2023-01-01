import React, { useEffect } from "react";
import { View, Text } from "react-native";

import { ActivityIndicator } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

export default function DeletingAccount() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("HomeStack");
    }, 4000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1b1b",
      }}
    >
      <Text
        style={{
          color: "#f4f4f4",
          fontSize: 36,
          fontWeight: "700",
          marginBottom: 18,
        }}
      >
        Deleting Account
      </Text>
      <Text
        style={{
          color: "#4f4f4f",
          fontSize: 12,
          width: 240,
          marginBottom: 70,
          textAlign: "center",
        }}
      >
        Thank you for using my app, I really appreciate it. Bye!
      </Text>
      <ActivityIndicator size="large" color="#0082ff" />
    </View>
  );
}
