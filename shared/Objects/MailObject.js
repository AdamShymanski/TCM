import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import {
  auth,
  fetchPhotos,
  fetchCardsName,
  removeFromCart,
} from "../../authContext";

export default function MailObject() {
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
          marginTop: 20,
          marginBottom: 16,
          marginLeft: 16,

          paddingLeft: 6,

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            marginLeft: 12,
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 18 }}>
            Lorem ipsum
            <Text style={{ color: "#7E7E7E", fontSize: 12 }}>
              {"   "}08/08/2020 - 12:00
            </Text>
          </Text>
          <Text
            style={{
              color: "#f4f4f4",
              fontSize: 12,
              marginTop: 12,
              marginLeft: 12,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at
            blandit risus, sit amet lacinia mauris. Morbi venenatis vel nulla
            eget mollis. Suspendisse sit amet aliquet dolor, quis iaculis
            ligula. Praesent at nisl metus. Aenean diam velit, auctor dignissim
            nunc quis, semper fermentum augue.
          </Text>
        </View>
      </View>
    );
  }
}
