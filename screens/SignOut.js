import React, { useEffect, useState } from "react";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import { auth, chatClient } from "../authContext";
import { View, Text, ActivityIndicator } from "react-native";

import { useNavigation, CommonActions } from "@react-navigation/native";

export default function SignOut() {
  const navigation = useNavigation();

  useEffect(() => {
    auth.signOut();
    chatClient.disconnectUser();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "HomeStack" }] })
    );
    // navigation.popToTop();
    // navigation.navigate("HomeStack");
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
          fontSize: 38,
          fontWeight: "700",
          marginBottom: 12,
          paddingHorizontal: 20,
          textAlign: "center",
        }}
      >
        Signing Out
      </Text>
      <ActivityIndicator size={"large"} color={"#0082ff"} />
      {/* <Text
        style={{
          fontSize: 15,
          width: "80%",
          color: "#4f4f4f",
          marginBottom: 60,
          textAlign: "center",
        }}
      >
        In order to preserve the quality of the published offers, only signed in
        users can publish sales offers.
      </Text> */}
    </View>
  );
}
