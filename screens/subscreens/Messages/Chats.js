import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Clipboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from "react-native";

import { db, auth } from "../../../authContext";

import { TextInput } from "react-native-paper";
import ChatObject from "../../../shared/Objects/ChatObject";

export default function Chats() {
  const [loading, setLoading] = useState(true);
  const [objectsArray, setObjectsArray] = useState([]);

  useEffect(async () => {
    const resolvePromise = async () => {
      db.collection("chats")
        .where("participants", "array-contains", auth.currentUser.uid)
        .onSnapshot((doc) => {
          const array = [];

          doc.forEach((doc) => {
            array.push({
              data: doc.data(),
              uid: "lDKpPeBYaUXT2t6JFHOPv3Xd6FE3",
              id: doc.id,
            });
          });

          setObjectsArray(array);
        });
    };
    resolvePromise();
  }, []);

  return (
    <FlatList
      data={objectsArray}
      scrollEventThrottle={2000}
      renderItem={({ item }) => {
        return <ChatObject props={item} />;
      }}
      ListEmptyComponent={
        <View
          style={{
            width: "100%",
            height: 600,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0082ff" />
        </View>
      }
      onEndReachedThreshold={0.8}
      onEndReached={async ({ distanceFromEnd }) => {
        if (distanceFromEnd >= 0) {
          // setProps((prevState) => ({
          //   ...prevState,
          //   mroTimestamp:
          //     mostRecentOffers[mostRecentOffers.length - 1].timestamp,
          // }));
        }
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
