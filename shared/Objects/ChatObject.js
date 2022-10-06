import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import {
  db,
  auth,
  fetchPhotos,
  fetchName,
  removeFromCart,
} from "../../authContext";

import { useNavigation } from "@react-navigation/native";

export default function ChatObject({ props }) {
  const [loading, setLoading] = useState(true);
  const navigator = useNavigation();

  const [name, setName] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [unreceived, setUnreceived] = useState(0);

  useEffect(() => {
    //search for the other users name
    const unsubscribe1 = db
      .collection(`chats/${props.id}/messages`)
      .where("user._id", "!=", auth.currentUser.uid)
      .where("received", "==", false)
      .onSnapshot((res) => {
        setUnreceived(res.docs.length);
      });

    const unsubscribe2 = db
      .collection(`chats/${props.id}/messages`)
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot((res) => {
        res.forEach((doc) => {
          var h = doc.data().createdAt.toDate().getHours();
          var m = doc.data().createdAt.toDate().getMinutes();

          h = h < 10 ? "0" + h : h;
          m = m < 10 ? "0" + m : m;

          const time = h + ":" + m;

          setLastMessage({
            text: doc.data().text,
            createdAt: time,
          });
        });
      });

    const resolvePromises = async () => {
      //get last message

      if (props.data.participants[0] !== auth.currentUser.uid) {
        await db
          .collection("users")
          .doc(props.data.participants[0])
          .get()
          .then((doc) => {
            props.name = doc.data().nick;
            setName(props.name);
          });
        setName(await fetchName(props.data.participants[1]));
      } else {
        await db
          .collection("users")
          .doc(props.data.participants[1])
          .get()
          .then((doc) => {
            props.name = doc.data().nick;
            setName(props.name);
          });
      }

      setLoading(false);
    };

    resolvePromises();
    setLoading(false);

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  if (loading) {
    return null;
  } else {
    return (
      <TouchableOpacity
        style={{
          marginTop: 12,
          marginHorizontal: 8,
          paddingVertical: 12,
          paddingHorizontal: 12,

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-start",

          width: "100%",
        }}
        onPress={() => {
          navigator.navigate("ChatScreen", props);
        }}
      >
        <View
          style={{
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0082ff",

            width: 50,
            height: 50,
          }}
        >
          <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 25 }}>
            {name[0]}
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          <View
            style={{
              marginLeft: 12,
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 18 }}>
              {name}
            </Text>
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 12,
                marginTop: 12,
                maxWidth: "90%",
              }}
            >
              {lastMessage.text ? lastMessage.text : "-"}
            </Text>
          </View>
          <View
            style={{
              marginLeft: 12,
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            {unreceived > 0 ? (
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,

                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",

                  backgroundColor: "#FF5C00",
                }}
              >
                <Text
                  style={{
                    color: "#121212",
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {unreceived}
                </Text>
              </View>
            ) : null}

            <Text style={{ color: "#d3d3d3", fontSize: 10, marginTop: 25 }}>
              {lastMessage.createdAt}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
