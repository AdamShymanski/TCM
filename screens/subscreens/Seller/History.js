import React, { useState } from "react";

import { View, TouchableOpacity, Text, Image } from "react-native";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import arrow_up_box from "../../../assets/arrow_up_box.png";
import arrow_down_box from "../../../assets/arrow_down_box.png";

export default function History() {
  return (
    <View style={{ flex: 1, backgroundColor: "#1b1b1b", alignItems: "center" }}>
      <View
        style={{
          width: "96%",
          padding: 10,
          marginTop: 12,

          flexDirection: "row",
          alignItems: "center",

          borderRadius: 6,
          backgroundColor: "#121212",
          height: 150,
        }}
      >
        <Image
          style={{
            aspectRatio: 438 / 486,
            width: undefined,
            height: 100,
            marginLeft: 10,
            marginRight: "8%",
          }}
          source={arrow_down_box}
        />
        <View
          style={{
            height: 100,
            justifyContent: "space-between",
            marginRight: "8%",
          }}
        >
          <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
            John Doe
          </Text>
          <Text
            style={{
              marginTop: 3,
              marginLeft: 6,

              color: "#f4f4f4",
              fontSize: 12,
            }}
          >
            Sell
          </Text>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              fontFamily: "Roboto_Medium",
              marginTop: 12,
            }}
          >
            DATE
          </Text>
          <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
            June 5, 2022
          </Text>
          <Text
            style={{
              marginTop: 3,
              marginLeft: 6,

              color: "#f4f4f4",
              fontSize: 12,
            }}
          >
            06:12:43 AM
          </Text>
        </View>
        <View style={{ height: 100, justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              AMOUNT
            </Text>
            <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
              + 125.00 <Text style={{ color: "#0082ff" }}>USD</Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              STATUS
            </Text>
            <Text style={{ color: "#05FD00", fontSize: 16, fontWeight: "700" }}>
              Completed
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "96%",
          padding: 10,
          marginTop: 12,

          flexDirection: "row",
          alignItems: "center",

          borderRadius: 6,
          backgroundColor: "#121212",
          height: 150,
        }}
      >
        <Image
          style={{
            aspectRatio: 411 / 558,
            width: undefined,
            height: 120,
            marginLeft: 10,
            marginRight: "8%",
          }}
          source={arrow_up_box}
        />
        <View
          style={{
            height: 100,
            justifyContent: "space-between",
            marginRight: "8%",
          }}
        >
          <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
            Adam Szymański
          </Text>
          <Text
            style={{
              marginTop: 3,
              marginLeft: 6,

              color: "#f4f4f4",
              fontSize: 12,
            }}
          >
            Withdraw
          </Text>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              fontFamily: "Roboto_Medium",
              marginTop: 12,
            }}
          >
            DATE
          </Text>
          <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
            June 5, 2022
          </Text>
          <Text
            style={{
              marginTop: 3,
              marginLeft: 6,

              color: "#f4f4f4",
              fontSize: 12,
            }}
          >
            06:12:43 AM
          </Text>
        </View>
        <View style={{ height: 100, justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              AMOUNT
            </Text>
            <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
              - 125.00 <Text style={{ color: "#0082ff" }}>USD</Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              STATUS
            </Text>
            <Text style={{ color: "#05FD00", fontSize: 16, fontWeight: "700" }}>
              Completed
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
