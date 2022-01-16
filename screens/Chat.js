import React, { useState, useEffect, useCallback } from "react";

import { View } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

import { db, auth } from "../authContext";

import { ActivityIndicator } from "react-native-paper";

export default function Chat({ route, setSellerIdState }) {
  const [messages, setMessages] = useState([]);

  const data = route.params.data;
  const ownerId = route.params?.data.uid;

  const chatRef = db.collection(`chats/${data?.id}/messages`);

  useEffect(() => {
    setSellerIdState(ownerId);

    const unsubscribe = chatRef.onSnapshot((querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const message = doc.data();

          return {
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt.toDate(),
            user: {
              _id: message.user._id,
              name: message.user.name,
            },
            sent: true,
            received: message.received,
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      appendMessages(messagesFirestore);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  async function handleSend(messages) {
    const writes = messages.map((m) => {
      m.received = false;
      m.user.name = auth.currentUser.displayName;
      chatRef.add(m);
    });

    await Promise.all(writes);
  }

  return (
    <View
      style={{ backgroundColor: "#1b1b1b", flex: 1, flexDirection: "column" }}
    >
      <GiftedChat
        messages={messages}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: "#f4f4f4",
                },
                left: {
                  color: "#f4f4f4",
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: "#0071db",
                  borderRadius: 4,
                },
                right: {
                  backgroundColor: "#0082ff",
                  borderRadius: 4,
                },
              }}
            />
          );
        }}
        user={{ _id: auth.currentUser.uid, name: auth.currentUser.displayName }}
        onSend={async (messages) => {
          await handleSend(messages);
        }}
        renderLoading={() => <ActivityIndicator size="large" color="#0082ff" />}
      />
    </View>
  );
}
