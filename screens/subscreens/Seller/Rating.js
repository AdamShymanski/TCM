import React, { useState } from "react";

import { View, TouchableOpacity, Text } from "react-native";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

export default function Rating() {
  return (
    <View style={{ flex: 1, backgroundColor: "#1b1b1b", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: "#121212",
          width: "96%",
          padding: 10,
          marginTop: 12,
          borderRadius: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: "#f4f4f4",
              fontSize: 18,
              fontWeight: "700",
              marginRight: 12,
            }}
          >
            Adam
          </Text>
          <IconMCI name={"star"} size={18} color={"#0082ff"} />
          <IconMCI name={"star"} size={18} color={"#0082ff"} />
          <IconMCI name={"star"} size={18} color={"#0082ff"} />
          <IconMCI name={"star"} size={18} color={"#0082ff"} />
          <IconMCI name={"star"} size={18} color={"#0082ff"} />
        </View>
        <Text style={{ color: "#f4f4f4", fontSize: 12, marginTop: 4 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec
          libero quam. Nulla blandit bibendum bibendum. Etiam eros libero,
          tempus ac posuere blandit, congue sit amet ligula. Proin venenatis
          tortor vitae purus ornare feugiat.
        </Text>
        <View
          style={{ flexDirection: "row", marginTop: 12, alignItems: "center" }}
        >
          <TouchableOpacity>
            <IconMCI name={"arrow-down-box"} color={"#05FF00"} size={30} />
          </TouchableOpacity>
          <Text
            style={{
              color: "#f4f4f4",
              fontSize: 16,
              fontWeight: "700",
              marginHorizontal: 6,
            }}
          >
            {"4"}
          </Text>
          <TouchableOpacity>
            <IconMCI name={"arrow-up-box"} color={"#F10000"} size={30} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
