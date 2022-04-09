import React, { useState } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import PayPal from "../assets/paypal_logo.png";

import { db, auth } from "../authContext";

export default function Buy({ route, setCartList }) {
  const navigation = useNavigation();
  const ownerId = route.params.ownerId;
  const [snackbarState, setSnackbarState] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1b1b",
      }}
    >
      <Text
        style={{
          color: "#f4f4f4",
          fontSize: 38,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        Contact with seller!
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
        We don't support in-app purchases yet, but you can contact the seller
        via WhatsApp, Instagram or Discord to buy the card and learn more
        details about it.
      </Text>
      <View
        style={{ width: "80%", flexDirection: "column", alignItems: "center" }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#0082ff",
            width: "100%",
            paddingVertical: 8,
            alignItems: "center",
            borderRadius: 5,
          }}
          onPress={async () => {
            //check if user has already chat with the owner

            let chatExists = false;

            const chatsArray = await db
              .collection("chats")
              .where("members", "array-contains", auth.currentUser.uid)
              .get();

            chatsArray.forEach((doc) => {
              if (doc.data().members.includes(ownerId)) {
                chatExists = { data: doc.data(), uid: ownerId, id: doc.id };
              }
            });

            if (chatExists) {
              console.log(chatExists);
              navigation.navigate("Chat", {
                screen: "ChatScreen",
                params: { data: chatExists },
              });
            } else {
              navigation.navigate("Chat", {
                screen: "StartChat",
                params: { ownerId },
              });
            }
          }}
        >
          <Text style={{ color: "#121212", fontWeight: "700", fontSize: 16 }}>
            Contact With Seller
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginVertical: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#5c5c5c",
              width: "42%",
              height: 3,
              borderRadius: 2,
            }}
          />
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#777" }}>
            or
          </Text>
          <View
            style={{
              backgroundColor: "#5c5c5c",
              width: "42%",
              height: 3,
              borderRadius: 2,
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#997523",
            //#ffc43c default background color
            width: "100%",
            paddingVertical: 8,
            alignItems: "center",
            borderRadius: 5,
          }}
          onPress={() => {
            setSnackbarState(true);
          }}
        >
          <Image
            source={PayPal}
            style={{
              height: 20,
              aspectRatio: 80 / 32,
            }}
          />
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={snackbarState}
        onDismiss={() => setSnackbarState(false)}
        duration={2000}
        action={{
          label: "",
          onPress: () => {},
        }}
      >
        Payments through PayPal aren't yet available
      </Snackbar>
    </View>
  );
}
