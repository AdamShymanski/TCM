import React, { useState, useEffect } from "react";

import { db, auth, fetchCardsName } from "../authContext";

import { View, Text, FlatList, ActivityIndicator } from "react-native";
import TransactionObject from "./../shared/Objects/TransactionObject";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Transactions() {
  const [transcations, setTranscations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            let obj = doc.data();
            obj.id = doc.id;
            outArray.push(obj);
          });
        });

      //sort objects in array by timestamp
      outArray.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });

      setTranscations(outArray);
      setLoading(false);
    };

    resolvePromises();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1b1b1b",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"large"} color={"#0082ff"} />
      </View>
    );
  } else {
    if (transcations.length > 0) {
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
            renderItem={({ item, index, array }) => {
              return <TransactionObject props={item} />;
            }}
            keyExtractor={(item, index) => index.toString()}
          />
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
            It looks like you don't have any transactions yet. Buying and
            selling cards with PTCG Marketplace is easy. Try it.
          </Text>
        </View>
      );
    }
  }
}
