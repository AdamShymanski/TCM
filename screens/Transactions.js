import React, { useState, useEffect } from "react";

import { db, auth } from "../authContext";

import { View, Text, FlatList } from "react-native";
import TransactionObject from "./../shared/Objects/TransactionObject";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Transactions() {
  const [transcations, setTranscations] = useState([]);
  useEffect(() => {
    //fetch transactions
    const resolvePromises = async () => {
      let outArray = [];

      await db
        .collection("transactions")
        .where("buyer", "==", auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let obj = doc.data();
            obj.id = doc.id;
            outArray.push(obj);
          });
        });

      await db
        .collection("transactions")
        .where("seller", "==", auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            outArray.push(doc.data());
          });
        });

      if (outArray.length > 0) {
        setTranscations(outArray);
      }
    };
    resolvePromises();
  }, []);
  if (transcations.lenght === 0) {
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
        data={transcations}
        style={{ flex: 1, width: "100%" }}
        renderItem={({ item, index }) => {
          return <TransactionObject props={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
