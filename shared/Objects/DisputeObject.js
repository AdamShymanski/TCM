import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import {
  auth,
  fetchPhotos,
  fetchCardsName,
  removeFromCart,
} from "../../authContext";

export default function DisputeObject() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolvePromises = async () => {};

    resolvePromises();
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  } else {
    return (
      <View
        style={{
          width: "90%",
          height: 100,
          marginTop: 20,
          marginBottom: 16,
          marginLeft: 16,

          paddingLeft: 6,

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",

          borderLeftColor: "#0082ff",
          borderLeftWidth: 2,
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}
      >
        <View
          style={{
            marginLeft: 12,
            justifyContent: "space-between",
            flexDirection: "column",
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 18 }}>
            John Doe
          </Text>

          <Text style={{ color: "#777777", fontSize: 12, marginTop: 5 }}>
            Transaction:{" "}
            <Text style={{ color: "#f4f4f4", fontSize: 12 }}>Resolving</Text>
          </Text>
          <Text style={{ color: "#777777", fontSize: 12, marginTop: 4 }}>
            Status:{" "}
            <Text style={{ color: "#f4f4f4", fontSize: 12 }}>Resolving</Text>
          </Text>

          <View
            style={{
              width: "80%",
              height: 1,
              borderRadius: 8,
              marginTop: 8,

              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",

              backgroundColor: "#0082ff",
            }}
          />
          <Text style={{ color: "#f4f4f4", fontSize: 12, marginTop: 12 }}>
            Hi, do you have still Raichu VMAX to sell?
          </Text>
        </View>
        <View
          style={{
            marginLeft: 12,
            height: "100%",

            flexDirection: "column",
            justifyContent: "space-between",
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

          <Text style={{ color: "#d3d3d3", fontSize: 10, marginTop: 10 }}>
            9.28 PM
          </Text>
        </View>
      </View>
    );
  }
}
