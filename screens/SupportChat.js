import React, { useState, useEffect, useCallback } from "react";

import { View } from "react-native";
import { Snackbar } from "react-native-paper";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

import { auth } from "../authContext";

import { ActivityIndicator } from "react-native-paper";

export default function SupportChat() {
  const [messages, setMessages] = useState([
    {
      _id: "791464d0-011d-4597-a2d8-f4c9a4757f04",
      createdAt: "2022-01-09T15:59:24+00:00",
      received: true,
      sent: true,
      text: "Welcome to PTCGM, I'm happy to create this marketplace for you. I really appreciate the installation. I know you can't do much here yet but it should improve soon. In the meantime if you notice any strange behavior of the app you can report it by writing to me on Discord -Adam-#4171, thanks in advance.",
      user: {
        _id: "82x",
        name: "Adam Szymański",
      },
    },
  ]);
  const [snackbarState, setSnackbarState] = useState(false);

  //   Array [
  //     Object {
  //       "_id": "791464d0-011d-4597-a2d8-f4c9a4757f04",
  //       "createdAt": 2021-12-15T21:40:12.503Z,
  //       "received": undefined,
  //       "sent": true,
  //       "text": "Google Review - Chat",
  //       "user": Object {
  //         "_id": "982ys5WQ8uYqADiUFtmLzNwiqzn1",
  //         "name": "Adam Szymański",
  //       },
  //     },
  //   ]

  //   Welcome to PTCGM, I'm happy to create this marketplace for you. I really appreciate the installation. I know you can't do much here yet but it should improve soon. In the meantime if you notice any strange behavior of the app you can report it on szymanskiadam111@gmail.com or write to me on Discord -Adam-#4171, thanks in advance.

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
          setSnackbarState(true);
        }}
        renderLoading={() => <ActivityIndicator size="large" color="#0082ff" />}
      />
      <Snackbar
        visible={snackbarState}
        duration={2000}
        onDismiss={() => setSnackbarState(false)}
        action={{
          label: "",
          onPress: () => {},
        }}
      >
        {"You can't reply to support."}
      </Snackbar>
    </View>
  );
}
