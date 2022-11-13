import React, { useState, useEffect } from "react";

import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import {
  fetchMoreMostRecentOffers,
  fetchMostRecentOffers,
} from "../authContext";

import referral_background from "../assets/images/referral.png";
import add_an_offer_background from "../assets/images/add.png";
import search_card from "../assets/images/search.png";

import { useNavigation } from "@react-navigation/native";

import CardMostRecent from "./../shared/Cards/CardMostRecent";

export default function Home() {
  const navigation = useNavigation();

  const [mostRecentOffers, setMostRecentOffers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const resolvePromises = async () => {
      if (mounted) {
        await fetchMostRecentOffers(setMostRecentOffers);
      }
    };
    resolvePromises();

    return () => {
      mounted = false;
    };
  }, []);


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
          width: "94%",
          borderRadius: 6,
          backgroundColor: "#121212",

          flexShrink: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 8,
        }}
        onPress={() => {
          navigation.navigate("ReferralProgramStack", {
            screen: "WorkInProgress",
          });
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
            aspectRatio: 260 / 198,
            width: "48%",
            height: undefined,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "94%",
          borderRadius: 6,
          backgroundColor: "#121212",

          flexShrink: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 8,
        }}
        onPress={() => {
          navigation.navigate("YourOffersStack", { screen: "YourOffers" });
        }}
      >
        <View>
          <Text
            style={{
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
            aspectRatio: 257 / 203,
            width: "40%",
            height: undefined,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "94%",
          borderRadius: 6,
          backgroundColor: "#121212",

          flexShrink: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 8,
        }}
        onPress={() => {
          navigation.navigate("SearchStack", { screen: "Search" });
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
            aspectRatio: 234 / 218,
            width: "38%",
            height: undefined,
          }}
        />
      </TouchableOpacity>
      <View style={{ height: "30%", width: "94%" }}>
        <Text
          style={{
            fontWeight: "700",
            color: "#747474",
            fontSize: 14,
            marginTop: 10,
          }}
        >
          RECENT OFFERS
        </Text>
        <FlatList
          data={mostRecentOffers}
          scrollEventThrottle={2000}
          legacyImplementation={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 8 }}
          renderItem={({ item }) => {
            return <CardMostRecent props={item} />;
          }}
          onEndReachedThreshold={0.8}
          onEndReached={async ({ distanceFromEnd }) => {
            if (distanceFromEnd >= 0) {
              await fetchMoreMostRecentOffers(
                mostRecentOffers,
                setMostRecentOffers
              );
            }
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}
