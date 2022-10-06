import React, { useState, useEffect, useCallback } from "react";

import { ActivityIndicator, Snackbar } from "react-native-paper";

import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconC from "react-native-vector-icons/MaterialIcons";

import { firebaseObj, db, auth, storage } from "../authContext";
import { useRoute, useNavigation } from "@react-navigation/native";

import ChatBubble from "./../shared/Bubbles/ChatBubble";

export default function Chat() {
  const route = useRoute();
  const navigation = useNavigation();

  const [inputValue, setInputValue] = useState("Type a message...");
  const [showTime, setShowTime] = useState();
  const [photoState, setPhoto] = useState();

  const [messages, setMessages] = useState([]);
  const [firstMessage, setFirstMessage] = useState([]);

  const chatId = route.params.id;

  let isMounted = true;

  useEffect(() => {
    const resolvePromises = async () => {
      await db
        .collection(`chats/${chatId}/messages`)
        .orderBy("sentAt", "desc")
        .limit(20)
        .get()
        .then((doc) => {
          let messages = [];

          doc.forEach((message, index) => {
            if (index === 0) setFirstMessage(message.data());
            messages.push({ ...message.data(), id: message.id });
          });

          setFirstMessage(doc.docs[0].data());

          if (isMounted) setMessages(messages);
        });

      if (firstMessage?.sentAt) {
        db.collection(`chats/${chatId}/messages`)
          .orderBy("sentAt", "desc")
          .where("sentAt", "<", firstMessage.sentAt.toDate())
          .onSnapshot((doc) => {
            let messages = [];

            console.log("vxv");

            doc.forEach((message) => {
              messages.push({ ...message.data(), id: message.id });
            });

            setFirstMessage(doc.docs[0].data());

            if (isMounted) {
              setMessages((prevState) => [...prevState, ...messages]);
              console.log("added message");
            }
          });
      } else {
        db.collection(`chats/${chatId}/messages`)
          .orderBy("sentAt", "desc")
          .onSnapshot((doc) => {
            let messages = [];

            console.log("bmb");

            doc.forEach((message) => {
              messages.push({ ...message.data(), id: message.id });
            });

            setFirstMessage(doc.docs[0].data());

            if (isMounted) {
              setMessages((prevState) => [...prevState, ...messages]);
              console.log("added message");
            }
          });
      }
    };

    resolvePromises();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(async () => {
    if (photoState) sendImage(photoState);
  }, [photoState]);

  const sendMessage = async (text) => {
    if (text.length > 0) {
      try {
        const message = {
          type: "text",
          content: text,
          sender: auth.currentUser.uid,
          sentAt: new Date(),
        };

        setMessages((prevState) => [message, ...prevState]);

        await db.collection(`chats/${chatId}/messages`).add({
          sentAt: new Date(),
          type: "text",
          content: text,
          sender: auth.currentUser.uid,
        });

        setInputValue("Type a message...");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const sendImage = async (photoState) => {
    if (photoState) {
      try {
        const messageLocal = {
          sentAt: new Date(),
          type: "text",
          content: photoState[0].uri,
          sender: auth.currentUser.uid,
        };

        setMessages((prevState) => [messageLocal, ...prevState]);

        await db
          .collection(`chats/${chatId}/messages`)
          .add({
            sentAt: firebaseObj.firestore.FieldValue.serverTimestamp(),
            type: "image",
            sender: auth.currentUser.uid,
          })
          .then(async (docRef) => {
            // sendImage(photoState[0].uri, docRef.id);
            const storageRef = storage.ref(`chats/${chatId}`);
            const response = await fetch(photoState[0].uri);
            const blob = await response.blob();

            await storageRef.child(`/${docRef.id}`).put(blob);
          });
      } catch (e) {
        console.log(e);
      }

      setPhoto(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1b1b" }}>
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
          John Doe
        </Text>
      </View>
      <FlatList
        data={messages}
        inverted={true}
        scrollEventThrottle={2000}
        style={{
          backgroundColor: "#1b1b1b",

          height: "92%",
        }}
        renderItem={({ item, index }) => {
          //detect owner of message
          //if owner is current user, then render right bubble
          //else render left bubble
          //if messages are sent less then 5 minutes ago, redner them in one stack with user image
          //else render them in separate stacks

          //add J when
          //next message is sent by different user
          //next message is sent more then 5 minutes after current message

          item.chatId = chatId;

          // var h = new Date(item.sentAt.getHours).getHours();
          // var m = new Date(item.sentAt).getMinutes();
          let time = null;

          try {
            var h = item.sentAt.toDate().getHours();
            var m = item.sentAt.toDate().getMinutes();

            h = h < 10 ? "0" + h : h;
            m = m < 10 ? "0" + m : m;

            time = h + ":" + m;
          } catch (e) {
            time = item.sentAt.getHours() + ":" + item.sentAt.getMinutes();
          }

          try {
            if (item.sender == auth.currentUser.uid) {
              if (
                (messages[index - 1] &&
                  messages[index - 1].sentAt.toDate() - item.sentAt.toDate() >
                    300000 &&
                  messages[index - 1].sender == auth.currentUser.uid) ||
                (messages[index - 1] &&
                  messages[index - 1].sender != auth.currentUser.uid) ||
                index == 0
              ) {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row-reverse",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",

                      marginBottom: 8,
                    }}
                    onPress={() => {
                      if (showTime === index) {
                        setShowTime();
                      } else {
                        setShowTime(index);
                      }
                    }}
                  >
                    <ChatBubble props={item} index={index} />
                    {showTime == index ? (
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                          marginRight: 10,
                        }}
                      >
                        {time}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row-reverse",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                    }}
                    onPress={() => {
                      if (showTime === index) {
                        setShowTime();
                      } else {
                        setShowTime(index);
                      }
                    }}
                  >
                    <ChatBubble props={item} index={index} />
                    {showTime == index ? (
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                          marginRight: 10,
                        }}
                      >
                        {time}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              }
            } else {
              if (
                (messages[index - 1] &&
                  messages[index - 1].sentAt.toDate() - item.sentAt.toDate() >
                    300000 &&
                  messages[index - 1].sender != auth.currentUser.uid) ||
                (messages[index - 1] &&
                  messages[index - 1].sender == auth.currentUser.uid) ||
                index == 0
              ) {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",

                      marginBottom: 8,
                    }}
                    onPress={() => {
                      if (showTime === index) {
                        setShowTime();
                      } else {
                        setShowTime(index);
                      }
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",

                        marginLeft: 4,
                        marginRight: 8,
                        height: 30,
                        width: 30,
                        marginBottom: 2,

                        borderRadius: 4,
                        backgroundColor: "#0082ff",
                      }}
                    >
                      <Text style={{ fontWeight: "700", color: "#f4f4f4" }}>
                        J
                      </Text>
                    </View>

                    <ChatBubble props={item} index={index} />

                    {showTime == index ? (
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                          marginLeft: 10,
                        }}
                      >
                        {time}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                      marginLeft: 42,
                    }}
                    onPress={() => {
                      if (showTime === index) {
                        setShowTime();
                      } else {
                        setShowTime(index);
                      }
                    }}
                  >
                    <ChatBubble props={item} index={index} />
                    {showTime == index ? (
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                          marginLeft: 10,
                        }}
                      >
                        {time}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              }
            }
          } catch (e) {
            if (item.sender == auth.currentUser.uid) {
              if (
                (messages[index - 1] &&
                  messages[index - 1].sentAt - item.sentAt > 300000 &&
                  messages[index - 1].sender == auth.currentUser.uid) ||
                (messages[index - 1] &&
                  messages[index - 1].sender != auth.currentUser.uid) ||
                index == 0
              ) {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row-reverse",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",

                      marginBottom: 8,
                    }}
                    onPress={() => {
                      if (showTime === index) {
                        setShowTime();
                      } else {
                        setShowTime(index);
                      }
                    }}
                  >
                    <ChatBubble props={item} index={index} />
                    {showTime == index ? (
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                          marginRight: 10,
                        }}
                      >
                        {time}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row-reverse",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                    }}
                    onPress={() => {
                      if (showTime === index) {
                        setShowTime();
                      } else {
                        setShowTime(index);
                      }
                    }}
                  >
                    <ChatBubble props={item} index={index} />
                    {showTime == index ? (
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                          marginRight: 10,
                        }}
                      >
                        {time}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              }
            } else {
              if (
                (messages[index - 1] &&
                  messages[index - 1].sentAt - item.sentAt > 300000 &&
                  messages[index - 1].sender != auth.currentUser.uid) ||
                (messages[index - 1] &&
                  messages[index - 1].sender == auth.currentUser.uid) ||
                index == 0
              ) {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",

                      marginBottom: 8,
                    }}
                    onPress={() => {
                      if (showTime === index) {
                        setShowTime();
                      } else {
                        setShowTime(index);
                      }
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",

                        marginLeft: 4,
                        marginRight: 8,
                        height: 30,
                        width: 30,
                        marginBottom: 2,

                        borderRadius: 4,
                        backgroundColor: "#0082ff",
                      }}
                    >
                      <Text style={{ fontWeight: "700", color: "#f4f4f4" }}>
                        J
                      </Text>
                    </View>

                    <ChatBubble props={item} index={index} />

                    {showTime == index ? (
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                          marginLeft: 10,
                        }}
                      >
                        {time}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                      marginLeft: 42,
                    }}
                    onPress={() => {
                      if (showTime === index) {
                        setShowTime();
                      } else {
                        setShowTime(index);
                      }
                    }}
                  >
                    <ChatBubble props={item} index={index} />
                    {showTime == index ? (
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                          marginLeft: 10,
                        }}
                      >
                        {time}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              }
            }
          }
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
      <View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          paddingVertical: 8,
        }}
      >
        <TextInput
          autoCapitalize="none"
          mode={"flat"}
          value={inputValue}
          onSubmitEditing={({ nativeEvent: { text, eventCount, target } }) => {
            //add object to arr
            sendMessage(text);
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
            width: "70%",
            paddingHorizontal: 16,

            marginRight: 8,
            borderRadius: 30,

            backgroundColor: "#121212",
            color: "#f4f4f4",
            height: 40,
          }}
        />
        <TouchableOpacity
          onPress={() =>
            setMessages((prevState) => [
              ...prevState,
              {
                sentAt: new Date(),
                type: "text",
                content: new Date().toString(),
                sender: "0",
              },
            ])
          }
        >
          <IconC
            name={"emoji-emotions"}
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 12 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("YourOffersStack", {
              params: { setPhoto, max: 1 },
              screen: "ImageBrowser",
            });
          }}
          // onPress={() =>
          //   setMessages((prevState) => [
          //     ...prevState,
          //     {
          //       sentAt: new Date(),
          //       type: "text",
          //       content: new Date().toString(),
          //       sender: "1",
          //     },
          //   ])
          // }
        >
          <Icon
            name={"image"}
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 12 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
