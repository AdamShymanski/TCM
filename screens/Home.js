import React, { useState } from "react";

import { View, Image, Text, TouchableOpacity } from "react-native";

import referral_background from "../assets/images/referral_background.png";
import add_an_offer_background from "../assets/images/add_an_offer_background.png";
import search_card from "../assets/images/search_card.png";

import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1b1b1b",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#121212",
          width: "94%",
          height: "20%",
          borderRadius: 6,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        onPress={() => {
          navigation.navigate("ReferralProgram");
        }}
      >
        <View>
          <Text
            style={{
              marginTop: 8,
              marginLeft: 12,
              flexDirection: "column",

              fontSize: 24,
              color: "#f4f4f4",
              fontWeight: "700",
            }}
          >
            REFERRAL
          </Text>
          <Text
            style={{
              marginLeft: 14,

              fontSize: 14,
              color: "#f4f4f4",
              fontWeight: "700",
            }}
          >
            PROGRAM
          </Text>
          <Text
            style={{
              marginLeft: 14,
              marginTop: 12,
              width: 160,

              fontSize: 12.4,
              color: "#7C7C7C",
              fontFamily: "Roboto_Medium",
            }}
          >
            Earn{" "}
            <Text style={{ color: "#05FD00", fontWeight: "700" }}> 2 USD </Text>{" "}
            for every new user registered with your code.
          </Text>
        </View>

        <Image
          source={referral_background}
          style={{
            aspectRatio: 288 / 220,
            width: undefined,
            height: "100%",
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#121212",
          width: "94%",
          height: "22%",
          borderRadius: 6,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        onPress={() => {
          navigation.navigate("YourOffers");
        }}
      >
        <View>
          <Text
            style={{
              marginTop: 8,
              marginLeft: 12,
              flexDirection: "column",

              fontSize: 24,
              color: "#f4f4f4",
              fontWeight: "700",
            }}
          >
            ADD
          </Text>
          <Text
            style={{
              marginLeft: 14,

              fontSize: 14,
              color: "#f4f4f4",
              fontWeight: "700",
            }}
          >
            <Text
              style={{
                marginLeft: 6,

                fontSize: 14,
                color: "#f4f4f4",
                fontWeight: "700",
              }}
            >
              A
            </Text>{" "}
            CARD
          </Text>
          <Text
            style={{
              marginLeft: 14,
              marginTop: 12,
              width: 140,

              fontSize: 12,
              color: "#7C7C7C",
              fontFamily: "Roboto_Medium",
            }}
          >
            It's very simple, write a description, take photos and publish.
            <Text style={{ color: "#05FD00", fontWeight: "700" }}>
              {" "}
              Welcome!
            </Text>
          </Text>
        </View>

        <Image
          source={add_an_offer_background}
          style={{
            aspectRatio: 471 / 330,
            width: undefined,
            height: "100%",
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#121212",
          width: "94%",
          height: "22%",
          borderRadius: 6,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        onPress={() => {
          navigation.navigate("SearchStack");
        }}
      >
        <View>
          <Text
            style={{
              marginTop: 8,
              marginLeft: 12,
              flexDirection: "column",

              fontSize: 24,
              color: "#f4f4f4",
              fontWeight: "700",
            }}
          >
            SEARCH FOR
          </Text>
          <Text
            style={{
              marginLeft: 14,

              fontSize: 14,
              color: "#f4f4f4",
              fontWeight: "700",
            }}
          >
            A CARD
          </Text>
          <Text
            style={{
              marginLeft: 14,
              marginTop: 12,
              width: 140,
              fontSize: 12,
              color: "#7C7C7C",
              fontFamily: "Roboto_Medium",
            }}
          >
            Filter through{" "}
            <Text style={{ color: "#05FD00", fontWeight: "700" }}>
              thousands of offers
            </Text>{" "}
            and buy the one you want!
          </Text>
        </View>

        <Image
          source={search_card}
          style={{
            aspectRatio: 133 / 110,
            width: undefined,
            height: "100%",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
