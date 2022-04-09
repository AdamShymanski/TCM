import React from "react";
import { View, Text } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function WorkInProgress() {
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
        name="hammer-wrench"
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
        Work In Progress
      </Text>
      <Text
        style={{
          fontSize: 15,
          width: "88%",
          color: "#4f4f4f",
          marginBottom: 60,
          textAlign: "center",
        }}
      >
        This site is currently under development or repair. We want you to enjoy
        a bug-free application, so we are trying to catch and fix all of them.
        This may take some time, so thank you for your patience.
      </Text>
    </View>
  );
}
