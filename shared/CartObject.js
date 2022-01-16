import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function CartObecjt({ route }) {
  return (
    <View
      style={{
        marginVertical: 8,
        marginHorizontal: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,

        alignItems: "center",
        flexDirection: "row",

        backgroundColor: "#121212",
        borderRadius: 5,
      }}
    >
      <Image
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2FT4rdYfdAn5rTNDhgqavy%2F0?alt=media&token=46cfacab-e38d-4027-8c25-1f7d72824539",
        }}
        style={{ aspectRatio: 105 / 140, width: undefined, height: 70 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            height: 70,
            marginLeft: 12,
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
              fontSize: 15,
            }}
          >
            Umbreon GX
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#585858",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
              }}
            >
              Price
            </Text>
            <Text
              style={{
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              6.25 USD
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#585858",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
              }}
            >
              Graded
            </Text>
            <Text
              style={{
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              Graded
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#585858",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
              }}
            >
              Condition
            </Text>
            <Text
              style={{
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              10/10
            </Text>
          </View>
        </View>
        <View style={{ justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#CD0000",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 3,
            }}
          >
            <Text
              style={{
                color: "#f4f4f4",
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
