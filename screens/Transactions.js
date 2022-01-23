import React, { useState, useEffect } from "react";

import { db, auth } from "../authContext";

import { View, Text, FlatList } from "react-native";
import TransactionObject from "./../shared/Objects/TransactionObject";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Transactions() {
  const [noTranscation, setNoTranscation] = useState(true);
  useEffect(() => {
    //fetch transactions
    const resolvePromises = async () => {
      const user = auth.currentUser;
      const transactions = await db
        .collection("transactions")
        .where("userId", "==", user.uid)
        .get();
      if (transactions.empty) {
        setNoTranscation(true);
      } else {
        setNoTranscation(false);
      }
    };
  }, []);
  if (noTranscation) {
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
          name="swap-vertical"
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
          What a great deals!
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
          It looks like you don't have any transactions yet. Buying and selling
          cards with PTCG Marketplace is easy. Try it.
        </Text>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1b1b",
      }}
    >
      <FlatList
        data={["a"]}
        renderItem={({ item, index }) => {
          return <TransactionObject />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
