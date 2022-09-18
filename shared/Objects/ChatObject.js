import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import {
  auth,
  fetchPhotos,
  fetchCardsName,
  removeFromCart,
} from "../../authContext";

import { useNavigation } from "@react-navigation/native";

export default function ChatObject({ props }) {
  const [loading, setLoading] = useState(true);
  const navigator = useNavigation();

  useEffect(() => {
    //search for the other users name
    const resolvePromises = async () => {};

    resolvePromises();
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  } else {
    return (
      <TouchableOpacity
        style={{
          marginTop: 12,
          marginHorizontal: 8,
          paddingVertical: 12,
          paddingHorizontal: 12,

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
        onPress={() => {
          navigator.navigate("ChatScreen", props);
        }}
      >
        <View
          style={{
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0082ff",
            width: 50,
            height: 50,
          }}
        >
          <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 25 }}>
            J
          </Text>
        </View>
        <View
          style={{
            marginLeft: 12,
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 18 }}>
            John Doe
          </Text>
          <Text style={{ color: "#f4f4f4", fontSize: 12, marginTop: 12 }}>
            Hi, do you have still Raichu VMAX to sell?
          </Text>
        </View>
        <View
          style={{
            marginLeft: 12,
            justifyContent: "space-between",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,

              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",

              backgroundColor: "#FF5C00",
            }}
          >
            <Text
              style={{
                color: "#121212",
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              1
            </Text>
          </View>

          <Text style={{ color: "#d3d3d3", fontSize: 10, marginTop: 25 }}>
            9.28 PM
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
