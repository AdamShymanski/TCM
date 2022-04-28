import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import CartObject from "../shared/Objects/CartObject";
const { width } = Dimensions.get("window");

import { fetchCart } from "../authContext";

import ZigzagLines from "react-native-zigzag-lines";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation, useIsFocused } from "@react-navigation/native";

export default function Cart({ route }) {
  const [offersState, setOffersState] = useState([]);
  const [totalState, setTotalState] = useState({
    price: 0,
    sellers: 0,
    cards: 0,
  });
  const [loading, setLoading] = useState(true);

  const calculateTotal = () => {
    let result = {
      price: 0,
      sellers: 0,
      cards: 0,
    };

    try {
      offersState?.forEach((item) => {
        result.sellers += 1;
        if (item?.data.length > 0) {
          item.data.forEach((offer) => {
            result.cards += 1;
            result.price += offer.price;
          });
        }
      });

      setTotalState(result);
    } catch (e) {
      console.log(e);
    }
  };

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(async () => {
    if (!isFocused) {
      setOffersState([]);
      setLoading(true);
    }
    if (isFocused) {
      await fetchCart(setOffersState, setLoading);
    }
  }, [isFocused]);

  useEffect(() => {
    calculateTotal();
  }, [offersState]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1B1B1B",
        }}
      >
        <ActivityIndicator color={"#0082ff"} size={"large"} />
      </View>
    );
  } else if (offersState.length > 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1B1B1B" }}>
        <SectionList
          style={{ width: "100%" }}
          sections={offersState}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <CartObject props={item} setOffers={setOffersState} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View>
              <Text
                style={{
                  color: "#7c7c7c",
                  fontSize: 12,
                  marginTop: 10,
                  marginLeft: 12,
                }}
              >
                from{"  "}
                <Text
                  style={{
                    color: "#bbbbbb",
                    fontSize: 17,
                    fontFamily: "Roboto_Medium",
                  }}
                >
                  {title}
                </Text>
              </Text>
            </View>
          )}
        />
        <ZigzagLines
          width={width}
          backgroundColor="transparent"
          color="#121212"
        />
        <View
          style={{
            width: "100%",
            backgroundColor: "#121212",
            height: 130,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 20,
              color: "#7C7C7C",
              marginTop: 12,
              marginLeft: 12,
            }}
          >
            In Total
          </Text>
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "600",
              fontFamily: "Roboto_Medium",

              marginVertical: 12,
              marginLeft: 12,
            }}
          >
            {totalState.price.toFixed(2)} USD{" "}
            <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
              for
            </Text>{" "}
            {totalState.cards} cards{" "}
            <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
              from
            </Text>{" "}
            {totalState.sellers} seller
          </Text>
          <TouchableOpacity
            style={{
              marginHorizontal: 12,

              paddingHorizontal: 12,

              // borderRadius: 4,

              flexDirection: "row",

              backgroundColor: "#0082ff",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              paddingVertical: 7,
            }}
            onPress={() => {
              navigation.navigate("Checkout");
            }}
          >
            <Text
              style={{
                color: "#121212",
                fontWeight: "700",
                fontSize: 18,
              }}
            >
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1b1b1b",
        }}
      >
        <Icon
          name="cart"
          color={"#0082ff"}
          size={58}
          style={{ marginBottom: 12 }}
        />
        <Text
          style={{
            color: "#f4f4f4",
            fontSize: 38,
            fontWeight: "700",
            marginBottom: 12,
            paddingHorizontal: 20,
            textAlign: "center",
          }}
        >
          Quite Empty Here!
        </Text>
        <Text
          style={{
            fontSize: 15,
            width: "80%",
            color: "#4f4f4f",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          Search for a card and add it to your cart. Then You will be able to
          place an order and finally buy them.
        </Text>
      </View>
    );
  }
}
