import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  GiftedChat,
  Bubble,
  Time,
  MessageImage,
  MessageText,
} from "react-native-gifted-chat";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconC from "react-native-vector-icons/MaterialIcons";

import { useRoute, useNavigation } from "@react-navigation/native";

import { db, auth, storage, firebaseObj } from "../authContext";

export default function Chat() {
  const route = useRoute();
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("Type a message...");

  const [photoState, setPhoto] = useState(null);

  let isMounted = true;
  let xProps = null;

  const chatId = route.params.id;

  // useEffect(() => {
  //   messages.forEach((message) => {
  //     console.log(message);
  //   });
  // }, [messages]);

  useEffect(() => {
    if (photoState) {
      xProps.onSend(
        {
          image: photoState[0].uri,
        },
        true
      );
      setPhoto(null);
    }
  }, [photoState]);

  useEffect(() => {
    let k = false;
    const unsubscribe1 = db
      .collection(`chats/${chatId}/messages`)
      .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
        if (querySnapshot.docs.length == route.params.data.messagesNum || k) {
          let parsedMessages = [];

          // querySnapshot.forEach((message) => {
          //   const messageData = message.data();

          //   parsedMessages.push({
          //     _id: messageData._id,
          //     text: messageData?.text,
          //     image: messageData?.image,
          //     createdAt: messageData.createdAt.toDate(),
          //     user: {
          //       _id: messageData.user._id,
          //       name: messageData.user.name,
          //     },
          //     sent: messageData.sent,
          //     received: messageData.received,
          //     pending: messageData.pending,
          //   });

          //   // console.log("messageType", message.getType());
          // });

          // querySnapshot
          //   .docChanges()
          //   .filter(({ type }) => type === "added")
          //   .forEach((message) => {
          //     console.log("message", message);
          //     const messageData = message.data();

          //     parsedMessages.push({
          //       _id: messageData._id,
          //       text: messageData?.text,
          //       image: messageData?.image,
          //       createdAt: messageData.createdAt.toDate(),
          //       user: {
          //         _id: messageData.user._id,
          //         name: messageData.user.name,
          //       },
          //       sent: messageData.sent,
          //       received: messageData.received,
          //       pending: messageData.pending,
          //     });
          //   });
          querySnapshot.forEach((doc) => {
            // if (change.docChanges().type === "added") {
            // }
            console.log("change", doc.docChanges().type);

            if (doc.docChanges().type === "added") {
              //change.type === "added"
              const messageData = doc.data();
              // const messageData = change.doc.data();

              parsedMessages.push({
                _id: messageData._id,
                text: messageData?.text,
                image: messageData?.image,
                createdAt: messageData.createdAt.toDate(),
                user: {
                  _id: messageData.user._id,
                  name: messageData.user.name,
                },
                sent: messageData.sent,
                received: messageData.received,
                pending: messageData.pending,
              });
            }
          });

          parsedMessages.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
          });
          // if (change.type === "added") {
          //   console.log("New city: ", change.doc.data());
          // }
          // if (change.type === "modified") {
          //   console.log("Modified city: ", change.doc.data());
          // }
          // if (change.type === "removed") {
          //   console.log("Removed city: ", change.doc.data());
          // }
          // });

          // let messagesFirestore = querySnapshot
          //   .docChanges()
          //   .filter(({ type }) => type === "added")
          //   .map(({ doc }) => {
          //     const message = doc.data();

          //     // console.log("message", message._id);

          //     return {
          //       _id: message._id,
          //       text: message?.text,
          //       image: message?.image,
          //       createdAt: message.createdAt.toDate(),
          //       user: {
          //         _id: message.user._id,
          //         name: message.user.name,
          //       },
          //       sent: message.sent,
          //       received: message.received,
          //       pending: message.pending,
          //     };
          //   })
          // .sort((a, b) => {
          //   return b.createdAt.getTime() - a.createdAt.getTime();
          // });

          appendMessages(parsedMessages);
          // appendMessages(messagesFirestore);

          parsedMessages = [];
          k = true;
        }
      });

    const unsubscribe2 = db
      .collection(`chats/${chatId}/messages`)
      .where("received", "==", false)
      .where("user._id", "!=", auth.currentUser.uid)
      .onSnapshot((querySnapshot) => {
        //update every doc
        //received: true
        querySnapshot.forEach(async (doc) => {
          await doc.ref.update({
            received: true,
          });
        });
      });

    return () => {
      unsubscribe1();
      unsubscribe2();
      isMounted = false;
    };
  }, []);

  const appendMessages = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  async function handleSend(messages) {
    const writes = messages.map(async (m) => {
      try {
        m.received = false;
        m.sent = true;
        m.user.name = auth.currentUser.displayName;

        await db
          .collection("chats")
          .doc(chatId)
          .update({
            messagesNum: firebaseObj.firestore.FieldValue.increment(1),
          });

        if (m.image) {
          // const imageUri = m.image;
          m.pending = true;

          // m.image = `https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/chats%2F${chatId}%2F${m._id}?alt=media&token=9203661e-87ec-439e-b7dc-a968edb35c26`;

          db.collection(`chats/${chatId}/messages`)
            .add(m)
            .then(async (doc) => {
              const storageRef = storage.ref(`chats/${chatId}`);
              const response = await fetch(m.image);
              const blob = await response.blob();

              await storageRef.child(`/${m._id}`).put(blob);

              //doc reference
              doc.update({
                image: `https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/chats%2F${chatId}%2F${m._id}?alt=media&token=9203661e-87ec-439e-b7dc-a968edb35c26`,
                pending: false,
              });
            });
        } else {
          db.collection(`chats/${chatId}/messages`).add(m);
        }
      } catch (err) {
        console.log(err);
      }
    });

    await Promise.all(writes);
  }

  return (
    <View
      style={{
        backgroundColor: "#1b1b1b",
        flex: 1,
        flexDirection: "column",
        paddingBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingTop: 38,
          paddingBottom: 10,
          marginBottom: 10,

          backgroundColor: "#121212",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconC
            name={"keyboard-arrow-left"}
            color={"#0082ff"}
            size={38}
            style={{ marginLeft: 12 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 22,
            color: "#f4f4f4",
            fontWeight: "700",
            marginLeft: 16,
          }}
        >
          {route.params.name}
        </Text>
      </View>
      <GiftedChat
        messages={messages}
        renderMessageImage={(props) => {
          return (
            <MessageImage
              {...props}
              imageProps={{
                onError: () => (
                  <Image
                    style={{
                      borderRadius: 6,
                      width: 160,
                      height: 160,
                    }}
                    source={{ uri: "https://i.stack.imgur.com/kOnzy.gif" }}
                  />
                ),
              }}
              imageStyle={{
                borderRadius: 6,
                width: 160,
                height: 160,
              }}
            />
          );
        }}
        renderTicks={(props) => {
          if (props.user._id == auth.currentUser.uid) {
            if (props.received) {
              return <Icon name={"check-all"} color={"#0082ff"} size={14} />;
            } else if (props.sent) {
              return <Icon name={"check"} color={"#0082ff"} size={14} />;
            } else {
              return (
                <Icon
                  name={"checkbox-blank-circle-outline"}
                  color={"#0082ff"}
                  size={14}
                />
              );
            }
          }
        }}
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
              containerStyle={{
                right: { backgroundColor: "#1b1b1b", paddingTop: 5 },
              }}
              bottomContainerStyle={{
                right: { backgroundColor: "#1b1b1b", paddingTop: 5 },
                left: { backgroundColor: "#1b1b1b", paddingTop: 5 },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: props.currentMessage.image
                    ? "transparent"
                    : "#0071db",
                  borderRadius: 4,
                },
                right: {
                  backgroundColor: props.currentMessage.image
                    ? "transparent"
                    : "#353535",
                  borderRadius: 4,
                },
              }}
            />
          );
        }}
        renderInputToolbar={(props) => {
          if (!xProps) {
            xProps = props;
          }

          return (
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                paddingVertical: 8,
                paddingRight: 8,
              }}
            >
              <TextInput
                autoCapitalize="none"
                mode={"flat"}
                value={inputValue}
                onSubmitEditing={({
                  nativeEvent: { text, eventCount, target },
                }) => {
                  //add object to arr
                  // sendMessage(text);
                  props.onSend({ text: text }, true);
                  setInputValue("Type a message...");
                }}
                onChangeText={(text) => {
                  setInputValue(text);
                }}
                onFocus={() => {
                  if (inputValue === "Type a message...") {
                    setInputValue("");
                  }
                }}
                onBlur={() => {
                  if (inputValue === "") {
                    setInputValue("Type a message...");
                  }
                }}
                outlineColor={"#5c5c5c"}
                style={{
                  width: "86%",
                  paddingHorizontal: 16,

                  marginRight: 8,
                  borderRadius: 30,

                  backgroundColor: "#121212",
                  color: "#f4f4f4",
                  height: 40,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("YourOffersStack", {
                    params: { setPhoto, max: 1 },
                    screen: "ImageBrowser",
                  });
                }}
              >
                <Icon
                  name={"image"}
                  color={"#0082ff"}
                  size={30}
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        renderChatEmpty={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                transform: [{ rotateY: "180deg" }, { rotateZ: "180deg" }],
              }}
            >
              <Text
                style={{
                  color: "#f4f4f4",
                  fontFamily: "Roboto_Medium",
                  fontSize: 24,
                }}
              >
                It comes out you'll be the first
              </Text>
              <Text
                style={{
                  color: "#5c5c5c",

                  fontSize: 15,

                  marginTop: 8,
                  marginBottom: 50,
                }}
              >
                Send a message to inquire about an offer.
              </Text>
              <Icon name={"message-processing"} color={"#0082ff"} size={70} />
            </View>
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
