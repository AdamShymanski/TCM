import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import CartObecjt from "../shared/CartObject";

export default function Cart({ route }) {
  const cartList = ["test"];
  if (cartList.lenght === 0) {
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
          Add cards to your cart!
        </Text>

        <Text
          style={{
            color: "#4f4f4f",
            fontSize: 15,
            width: "88%",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          Here you can place orders for cards you want to buy.
        </Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#1B1B1B" }}>
      <FlatList
        data={cartList}
        renderItem={({ item }) => {
          return <CartObecjt />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        style={{
          width: "100%",
          backgroundColor: "#121212",
          height: 120,
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
          12.50 USD{" "}
          <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
            for
          </Text>{" "}
          2 cards{" "}
          <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
            from
          </Text>{" "}
          1 seller
        </Text>
        <TouchableOpacity
          style={{
            marginHorizontal: 12,
            paddingVertical: 5,
            paddingHorizontal: 12,

            borderRadius: 3,
            backgroundColor: "#0082ff",

            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#121212",
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            Go to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
