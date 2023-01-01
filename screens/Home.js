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
  db,
  auth,
  fetchMoreMostRecentOffers,
  fetchMostRecentOffers,
} from "../authContext";

import add_offer from "../assets/home_add.png";
import search_offer from "../assets/home_search.png";
import pokemon_logo from "../assets/pokemon_logo.png";
import sport_cards_logo from "../assets/sport_cards_logo.png";
import yugioh_logo from "../assets/yugioh_logo.png";

import { useNavigation } from "@react-navigation/native";

import CardMostRecent from "./../shared/Cards/CardMostRecent";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Home() {
  const navigation = useNavigation();

  const [mostRecentOffers, setMostRecentOffers] = useState([]);
  const [vendorAccount, setVendorAccount] = useState(true);
  const [userCountry, setUserCountry] = useState("US");
  const [cartArray, setCartArray] = useState(true);

  useEffect(() => {
    let mounted = true;

    const resolvePromises = async () => {
      if (mounted) {
        try {
          await fetchMostRecentOffers(setMostRecentOffers);
          db.collection("users")
            .doc(auth.currentUser.uid)
            .get()
            .then((doc) => {
              setUserCountry(doc.data().country);
              setVendorAccount(doc.data().stripe.vendorId);
              setCartArray(doc.data().cart);
            });
        } catch (e) {
          console.log(e);
        }
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
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          width: "94%",
          borderRadius: 6,
          backgroundColor: "#121212",
          marginTop: 20,
          marginBottom: 20,
        }}
        onPress={() => {
          navigation.navigate("YourOffersStack", { screen: "YourOffers" });
        }}
      >
        <View
          style={{
            flexShrink: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingVertical: 18,
            alignItems: "center",
          }}
        >
          <Image
            source={add_offer}
            style={{
              aspectRatio: 185 / 241,
              width: "16%",
              height: undefined,
            }}
          />
          <View>
            <Text
              style={{
                marginLeft: 12,
                flexDirection: "column",

                fontSize: 24,
                color: "#f4f4f4",
                fontWeight: "700",
                alignItems: "center",
              }}
            >
              Add Offers
            </Text>

            <Text
              style={{
                marginLeft: 14,
                marginTop: 12,
                width: 200,

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
        </View>
        {vendorAccount ? null : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#2E1710",
              paddingVertical: 2,
              justifyContent: "space-between",
              paddingHorizontal: 10,

              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name={"lock"} color={"#FF4408"} size={16} />
              <Text
                style={{ fontWeight: "700", color: "#FF4408", marginLeft: 5 }}
              >
                VENDOR ACCOUNT REQUIRED
              </Text>
            </View>

            <Icon name={"arrow-right-bold-box"} color={"#FF4408"} size={22} />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "94%",
          borderRadius: 6,
          backgroundColor: "#121212",
          flexShrink: 1,
        }}
        onPress={() => {
          navigation.navigate("SearchStack", { screen: "Search" });
        }}
      >
        <View
          style={{
            flexShrink: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingVertical: 18,
          }}
        >
          <Image
            source={search_offer}
            style={{
              aspectRatio: 202 / 202,
              width: "18%",
              height: undefined,
            }}
          />
          <View>
            <Text
              style={{
                marginLeft: 12,
                flexDirection: "column",

                fontSize: 24,
                color: "#f4f4f4",
                fontWeight: "700",
                alignItems: "center",
              }}
            >
              Search Offers
            </Text>

            <Text
              style={{
                marginLeft: 14,
                marginTop: 12,
                width: 200,
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
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#0B3A67",
            paddingVertical: 2,
            justifyContent: "space-between",
            paddingHorizontal: 10,

            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontWeight: "700", color: "#0082ff" }}>
              + NEW OFFERS EVERY DAY
            </Text>
          </View>

          <Icon name={"arrow-right-bold-box"} color={"#0082ff"} size={22} />
        </View>
      </TouchableOpacity>
      <View style={{ height: 120, marginTop: 20 }}>
        <FlatList
          data={[1, 2, 3]}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          renderItem={({ item }) => {
            <View></View>;
            if (item == 1) {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#121212",
                    paddingHorizontal: 20,
                    marginHorizontal: 10,
                    paddingVertical: 8,

                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexGrow: 0,
                    flexShrink: 1,

                    width: 250,
                    height: 110,
                  }}
                  onPress={() => {
                    navigation.navigate("SearchStack", { screen: "NewSearch" });
                  }}
                >
                  <Image
                    source={pokemon_logo}
                    style={{
                      aspectRatio: 417 / 154,
                      width: "90%",
                      height: undefined,
                    }}
                  />
                  <Text style={{ color: "#BBBBBB" }}>
                    Over{" "}
                    <Text style={{ color: "#ffffff", fontWeight: "700" }}>
                      +2000
                    </Text>{" "}
                    offers
                  </Text>
                </TouchableOpacity>
              );
            } else if (item == 2) {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#121212",

                    marginHorizontal: 10,

                    width: 250,
                    height: 110,

                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={sport_cards_logo}
                    style={{
                      aspectRatio: 750 / 330,
                      width: "100%",
                      height: undefined,
                    }}
                  />
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#121212",

                    marginHorizontal: 10,

                    width: 250,
                    height: 110,

                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={yugioh_logo}
                    style={{
                      aspectRatio: 750 / 330,
                      width: "100%",
                      height: undefined,
                    }}
                  />
                </TouchableOpacity>
              );
            }
          }}
        />
      </View>

      <Text
        style={{
          fontFamily: "Roboto_Medium",
          color: "#747474",
          fontSize: 14,
          marginTop: 10,
          width: "94%",
        }}
      >
        RECENT OFFERS
      </Text>
      <FlatList
        data={mostRecentOffers}
        scrollEventThrottle={2000}
        legacyImplementation={false}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 8, flex: 1, width: "94%" }}
        renderItem={({ item }) => {
          return (
            <CardMostRecent
              props={item}
              userCountry={userCountry}
              cartArray={cartArray}
            />
          );
        }}
        initialNumToRender={5}
        onEndReachedThreshold={2}
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
  );
}
