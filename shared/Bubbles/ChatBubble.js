import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { auth } from "../../authContext";

import Icon from "react-native-vector-icons/Octicons";

export default function ChatBubble({ props, index }) {
  if (props.sender !== auth.currentUser.uid) {
    if (props.type === "text") {
      return (
        <View
          style={{
            borderRadius: 6,
            borderBottomLeftRadius: 0,
            backgroundColor: "#353535",

            flexShrink: 1,
            marginVertical: 2,

            marginLeft: 38,
            paddingVertical: 8,
            paddingHorizontal: 12,
            maxWidth: "80%",

            alignSelf: "flex-end",
          }}
        >
          <Text style={{ color: "#f4f4f4" }}>{props.content}</Text>
        </View>
      );
    }
    return (
      <View
        style={{
          borderRadius: 6,
          borderBottomLeftRadius: 0,

          marginVertical: 2,

          marginLeft: 38,
          paddingVertical: 8,
          paddingHorizontal: 12,

          alignSelf: "flex-end",
        }}
      >
        <Image
          style={{
            aspectRatio: 3 / 4,
            width: "60%",
            height: undefined,
            marginTop: 20,
            marginRight: 20,
            borderRadius: 4,
          }}
          source={{ uri: props.content }}
        />
      </View>
    );
  } else {
    return (
      <View
        style={{
          borderRadius: 6,
          borderBottomRightRadius: 0,
          backgroundColor: "#003C75",

          flexShrink: 1,
          marginVertical: 2,

          marginRight: 8,
          paddingVertical: 8,
          paddingHorizontal: 12,
          maxWidth: "80%",

          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#f4f4f4" }}>{props.content}</Text>
      </View>
    );
  }
}
