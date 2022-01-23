import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function SellerRating() {
  return (
    <View
      style={{
        backgroundColor: "#1b1b1b",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#5c5c5c", fontWeight: "700" }}>
        This Seller doesn't have any rates yet
      </Text>
    </View>
  );
}
