import React, { useState, useEffect } from "react";

import { db, auth, fetchCardsName, functions } from "../authContext";

import TransactionObject from "./../shared/Objects/TransactionObject";
import ConfirmSendingModal from "./../shared/Modals/ConfirmSendingModal";
import AddTrackigNumberModal from "./../shared/Modals/AddTrackigNumberModal";

import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

export default function Transactions() {
  const [loading, setLoading] = useState(true);
  const [transcationsBought, setTransactionBought] = useState([]);
  const [transcationsSold, setTransactionsSold] = useState([]);

  const [callCounter, setCallCounter] = useState([0, 0]);

  const [ATN, setATN] = useState(false);
  const [CS, setCS] = useState(false);

  const isFocused = useIsFocused();

  useEffect(async () => {
    if (!isFocused) {
      setTransactionsSold([]);
      setTransactionBought([]);
      setLoading(true);
    }
    if (isFocused) {
      db.collection("transactions")
        .where("buyer", "==", auth.currentUser.uid)
        .onSnapshot((snapshot) => {
          setTransactionBought([]);

          snapshot.forEach((doc) => {
            if (doc.data().status !== "unpaid") {
              let obj = doc.data();
              obj.id = doc.id;

              setTransactionBought((prevStat) => {
                return [...prevStat, obj];
              });
            }
          });
        });

      db.collection("transactions")
        .where("seller", "==", auth.currentUser.uid)
        .onSnapshot((snapshot) => {
          setTransactionsSold([]);

          snapshot.forEach((doc) => {
            if (doc.data().status !== "unpaid") {
              let obj = doc.data();
              obj.id = doc.id;

              setTransactionsSold((prevStat) => {
                return [...prevStat, obj];
              });
            }
          });
          setLoading(false);
        });
    }
  }, [isFocused]);

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
    if (transcationsBought.length > 0 || transcationsSold.length > 0) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1b1b1b",
          }}
        >
          {ATN ? (
            <AddTrackigNumberModal
              id={ATN}
              setModal={setATN}
              setLoading={setLoading}
            />
          ) : null}

          {CS ? (
            <ConfirmSendingModal
              id={CS}
              setModal={setCS}
              setLoading={setLoading}
            />
          ) : null}
          <FlatList
            data={[...transcationsBought, ...transcationsSold].sort((a, b) => {
              return b.timestamp - a.timestamp;
            })}
            style={{ flex: 1, width: "100%" }}
            renderItem={({ item, index, array }) => {
              return (
                <TransactionObject props={item} setCS={setCS} setATN={setATN} />
              );
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
