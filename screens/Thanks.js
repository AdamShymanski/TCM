import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ditto from "../assets/ditto.png";

const Thanks = () => {
  const navigator = useNavigation();
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
          fontSize: 52,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        Success!
      </Text>
      <Text
        style={{
          color: "#4f4f4f",
          fontSize: 15,
          width: 240,
          marginBottom: 36,
          textAlign: "center",
        }}
      >
        Congrats! You just added card to your collection.
      </Text>
      <TouchableOpacity
        style={{
          height: 30,
          width: "88%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",

          marginBottom: 50,

          paddingHorizontal: 12,

          borderColor: "#0082ff",
          borderRadius: 3,
          backgroundColor: "#0082ff",
        }}
        onPress={() => {
          navigator.reset({
            index: 0,
            routes: [{ name: "YourOffers" }],
          });
          navigator.navigate("Home", { screen: "Home" });
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#121212",
          }}
        >
          {"Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Thanks;
