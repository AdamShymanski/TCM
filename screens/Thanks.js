import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ditto from "../assets/ditto.png";
import signature from "../assets/signature_x.png";

const Thanks = () => {
  const navigator = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1b1b1b",
        paddingTop: 120,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Text
          style={{
            color: "#f4f4f4",
            fontSize: 52,
            fontWeight: "700",
            marginBottom: 6,
          }}
        >
          Success!
        </Text>
        <Text
          style={{
            color: "#4f4f4f",
            fontSize: 15,
            width: "80%",
            marginBottom: 36,
            textAlign: "center",
          }}
        >
          Congrats! You just added a new offer, now our administration have to
          verify it. You will be informed in real time about a purchase or a
          change in the offer status
        </Text>

        <TouchableOpacity
          style={{
            width: "88%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",

            marginBottom: 50,

            paddingVertical: 6,
            paddingHorizontal: 12,

            borderRadius: 3,
            borderColor: "#0082ff",
            backgroundColor: "#0082ff",
          }}
          onPress={() => {
            navigator.reset({
              index: 0,
              routes: [{ name: "YourOffers" }],
            });
            navigator.navigate("YourOffersStack", { screen: "YourOffers" });
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#121212",
            }}
          >
            {"Continue"}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: "88%",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: 60,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            color: "#f4f4f4",
            marginBottom: 12,
            width: "80%",
            fontFamily: "Roboto_Medium",
          }}
        >
          <Text style={{ color: "#a6a6a6" }}>„</Text>Thank you very much for
          your faith. I will do my best to help you sell your goods.
          <Text style={{ color: "#a6a6a6" }}>“</Text>
        </Text>
        <Image
          source={signature}
          style={{
            aspectRatio: 416 / 86,
            width: "40%",
            height: undefined,
            marginTop: 20,
          }}
        />
        <Text
          style={{
            color: "#f4f4f4",
            marginTop: 12,
            color: "#e3e3e3",
            fontFamily: "Roboto_Medium",
            fontSize: 12,
          }}
        >
          Founder of TCM - Adam Szymański
        </Text>
      </View>
    </View>
  );
};

export default Thanks;
