import React, { useState, useEffect } from "react";
import { View, FlatList, Image, Text, TouchableOpacity } from "react-native";

import IconM from "react-native-vector-icons/MaterialIcons";

import {
  fetchOwnerData,
  fetchLastMessage,
  db,
  auth,
  checkForUnreadedMessages,
} from "../authContext";
import { useNavigation } from "@react-navigation/native";

const ChatConversations = ({ listenerData }) => {
  const listArray = [{ key: "supportMessage" }, ...listenerData];

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1b1b" }}>
      <FlatList
        data={listArray}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return <SupportConversationBar />;
          } else {
            return <ConversationBar uid={item.uid} data={item} />;
          }
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      {false ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1b1b1b",
          }}
        >
          <IconM
            name="chat-bubble"
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
            Start Texting!
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
            If you find a sale that interests you, you can go to the seller's
            profile and start discussing with them via chat.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const SupportConversationBar = () => {
  const [loading, setLoading] = useState(true);
  const [notificationState, setNotificationState] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const resolvePromises = async () => {
      setNotificationState(await checkForUnreadedMessages());
      setLoading(false);
    };
    resolvePromises();
  }, []);

  if (loading) return null;

  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "#121212",
        marginTop: 12,
        paddingVertical: 12,
        marginHorizontal: 12,

        borderRadius: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: "#1b1b1b",
            padding: 14,
            paddingVertical: 8,
            borderRadius: 3,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 12,
          }}
        >
          <Image
            style={{ width: 26, height: 22 }}
            source={{
              uri: `https://flagcdn.com/128x96/pl.png`,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#f4f4f4",
              marginLeft: 16,
            }}
          >
            PTCGM Support
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 76,
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",

            backgroundColor: "#0082FF",
            borderRadius: 3,

            marginRight: 12,
          }}
          onPress={() => {
            if (notificationState) {
              db.collection("users")
                .doc(auth.currentUser.uid)
                .update({ lastSupportMessageReaded: true });
              setNotificationState(false);
            }
            navigation.navigate("SupportChatScreen");
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#121212",
            }}
          >
            {"Open"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12,
          marginLeft: 36,
        }}
      >
        {notificationState ? (
          <View
            style={{
              backgroundColor: "#ed400b",
              width: 9,
              height: 9,
              borderRadius: 8,
              marginRight: 10,
            }}
          />
        ) : null}

        <Text
          style={{
            fontSize: 11,
            fontWeight: notificationState ? "700" : "500",
            color: notificationState ? "#f4f4f4" : "#5c5c5c",
          }}
        >
          {`16:59   Welcome to PTCG Marketplace...`}
        </Text>
      </View>
    </View>
  );
};
const ConversationBar = ({ uid, data }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "", countryCode: "" });
  const [lastMessage, setLastMessage] = useState();
  const [hour, setHour] = useState();
  const [notificationState, setNotificationState] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    const resolvePromises = async () => {
      setUser(await fetchOwnerData(uid));
      await fetchLastMessage(
        setLastMessage,
        setHour,
        setNotificationState,
        data
      );

      setLoading(false);
    };
    resolvePromises();
  }, []);

  if (loading) return null;

  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "#121212",
        marginTop: 12,
        paddingVertical: 12,
        marginHorizontal: 12,

        borderRadius: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: "#1b1b1b",
            padding: 14,
            paddingVertical: 8,
            borderRadius: 3,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 12,
          }}
        >
          <Image
            style={{ width: 26, height: 22 }}
            source={{
              uri: `https://flagcdn.com/128x96/${user.countryCode}.png`,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#f4f4f4",
              marginLeft: 16,
            }}
          >
            {user.name}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 76,
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",

            backgroundColor: "#0082FF",
            borderRadius: 3,

            marginRight: 12,
          }}
          onPress={() => {
            navigation.navigate("ChatScreen", { data });
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#121212",
            }}
          >
            {"Open"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12,
          marginLeft: 36,
        }}
      >
        {notificationState ? (
          <View
            style={{
              backgroundColor: "#ed400b",
              width: 9,
              height: 9,
              borderRadius: 8,
              marginRight: 10,
            }}
          />
        ) : null}

        <Text
          style={{
            fontSize: 11,
            fontWeight: notificationState ? "700" : "500",
            color: notificationState ? "#f4f4f4" : "#5c5c5c",
          }}
        >
          {`${hour}   ${lastMessage.text}`}
        </Text>
      </View>
    </View>
  );
};

export default ChatConversations;
