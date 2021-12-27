import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Orders({ route }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1b1b",
      }}
    >
      <Icon
        name="cart"
        color={"#0082ff"}
        size={58}
        style={{ marginBottom: 12 }}
      />
      <Text
        style={{
          color: "#f4f4f4",
          fontSize: 38,
          fontWeight: "700",
          marginBottom: 12,
          paddingHorizontal: 20,
          textAlign: "center",
        }}
      >
        This feature isn't ready yet!
      </Text>
      <Text
        style={{
          color: "#4f4f4f",
          fontSize: 15,
          width: "88%",
          marginBottom: 60,
          textAlign: "center",
        }}
      >
        We are still working on the implementation of in-app card purchasing.
        You'll be able to use it soon, and in the meantime you can support us by
        posting offers in our app.
      </Text>
    </View>
  );
}
