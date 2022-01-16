import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { requestApi } from "../authContext";

export default function Test() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#997523",

          width: "100%",
          paddingVertical: 8,
          alignItems: "center",
          borderRadius: 5,
        }}
        onPress={() => requestApi()}
      >
        <Text>Test</Text>
      </TouchableOpacity>
    </View>
  );
}
