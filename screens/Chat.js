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

import { db, auth } from "../authContext";
import { useRoute, useNavigation } from "@react-navigation/native";

import ChatBubble from "./../shared/Bubbles/ChatBubble";

// export default function Chat({ route, setSellerIdState }) {
//   const [messages, setMessages] = useState([]);

//   const data = route.params.data;
//   const ownerId = route.params?.data.uid;

//   const chatRef = db.collection(`chats/${data?.id}/messages`);

//   useEffect(() => {
//     setSellerIdState(ownerId);

//     const unsubscribe = chatRef.onSnapshot((querySnapshot) => {
//       const messagesFirestore = querySnapshot
//         .docChanges()
//         .filter(({ type }) => type === "added")
//         .map(({ doc }) => {
//           const message = doc.data();

//           return {
//             _id: message._id,
//             text: message.text,
//             createdAt: message.createdAt.toDate(),
//             user: {
//               _id: message.user._id,
//               name: message.user.name,
//             },
//             sent: true,
//             received: message.received,
//           };
//         })
//         .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
//       appendMessages(messagesFirestore);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     console.log(messages);
//   }, [messages]);

//   const appendMessages = useCallback(
//     (messages) => {
//       setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, messages)
//       );
//     },
//     [messages]
//   );

//   async function handleSend(messages) {
//     const writes = messages.map((m) => {
//       m.received = false;
//       m.user.name = auth.currentUser.displayName;
//       chatRef.add(m);
//     });

//     await Promise.all(writes);
//   }

//   return (
//     <View
//       style={{ backgroundColor: "#1b1b1b", flex: 1, flexDirection: "column" }}
//     >
//       <GiftedChat
//         messages={messages}
//         renderBubble={(props) => {
//           return (
//             <Bubble
//               {...props}
//               textStyle={{
//                 right: {
//                   color: "#f4f4f4",
//                 },
//                 left: {
//                   color: "#f4f4f4",
//                 },
//               }}
//               wrapperStyle={{
//                 left: {
//                   backgroundColor: "#0071db",
//                   borderRadius: 4,
//                 },
//                 right: {
//                   backgroundColor: "#0082ff",
//                   borderRadius: 4,
//                 },
//               }}
//             />
//           );
//         }}
//         user={{ _id: auth.currentUser.uid, name: auth.currentUser.displayName }}
//         onSend={async (messages) => {
//           await handleSend(messages);
//         }}
//         renderLoading={() => <ActivityIndicator size="large" color="#0082ff" />}
//       />
//     </View>
//   );
// }

export default function Chat() {
  const route = useRoute();
  const navigation = useNavigation();

  var date1 = new Date("08/05/2015 23:41:20");
  var date2 = new Date("08/05/2015 23:47:30");
  var date3 = new Date("08/05/2015 23:49:32");

  const chatId = route.params.id;
  //Jz2fuJiDSps0P3fTPxhq
  console.log(route.params.id);

  //fetch chat
  useEffect(() => {
    //chat id
    const resolvePromises = async () => {
      // await db.collection("chats").add({
      //   createdAt: new Date(),
      //   participants: [auth.currentUser.uid, "z"],
      //   newMessage: null,
      // });

      db.collection(`chats/${chatId}/messages`)
        .limit(10)
        .orderBy("sentAt", "asc")
        .onSnapshot((doc) => {
          let messages = [];
          doc.forEach((message) => {
            messages.push(message.data());
          });
          setMessages(messages);
        });

      // await db
      //   .collection("chats")
      //   .doc(chatId)
      //   .onSnapshot((doc) => {
      //     let messages = [];
      //     doc.forEach((message) => {
      //       console.log(message.data());
      //       messages.push(message.data());
      //     });
      //     setMessages(messages);
      //   });
    };

    resolvePromises();
  }, []);

  useEffect(() => {
    if (photoState) {
      setMessages((prevState) => [
        ...prevState,
        {
          sentAt: new Date(),
          type: "image",
          content: photoState[0].uri,
          sender: "1",
        },
      ]);
      setPhoto(null);
    }
  }, [photoState]);

  const sendMessage = async (text) => {
    if (text.length > 0) {
      const message = {
        sentAt: new Date(),
        type: "text",
        content: text,
        sender: auth.currentUser.uid,
      };

      setMessages((prevState) => [...prevState, message]);

      await db.collection("chats").doc(chatId).collection("messages").add({
        sentAt: new Date(),
        type: "text",
        content: text,
        sender: auth.currentUser.uid,
      });
      setInputValue("Type a message...");
    }
  };

  const sendImage = () => {
    const storageRef = firebase.storage().ref(`cards/${docRef.id}`);
    photoState.map(async (photo, i) => {
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      await storageRef.child(`/${i}`).put(blob);
    });
  };

  const [inputValue, setInputValue] = useState("Type a message...");
  const [showTime, setShowTime] = useState();
  const [photoState, setPhoto] = useState();

  const [messages, setMessages] = useState([
    // {
    //   sentAt: date1,
    //   type: "text",
    //   content: "Hello",
    //   sender: "1",
    // },
    // {
    //   sentAt: date2,
    //   type: "text",
    //   content: "Hello",
    //   sender: "1",
    // },
    // {
    //   sentAt: date3,
    //   type: "text",
    //   content: "Hello",
    //   sender: "0",
    // },
  ]);

  const docId = {
    createdAt: "date",
    participants: ["x", "z"],
    messages: [
      {
        sentAt: "x",
        type: "image/text",
        content: "url/text",
        sender: "XX",
      },
    ],
    newMessage: "null,x,z",
  };

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1b1b" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingTop: 24,
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

          if (item.sender == auth.currentUser.uid) {
            if (
              (messages[index + 1] && messages[index + 1].sender != "0") ||
              (messages[index + 1] &&
                messages[index + 1].sentAt - messages[index].sentAt > 300000) ||
              messages.length == 1 ||
              messages.length - 1 == index
            ) {
              return (
                <TouchableOpacity
                  style={{ flexDirection: "row-reverse", marginBottom: 8 }}
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
                        bottom: -23,
                        left: 10,
                      }}
                    >
                      {item.sentAt.toISOString().slice(11, 16)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  style={{ flexDirection: "row-reverse" }}
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
                        top: 24,
                        left: 10,
                      }}
                    >
                      {item.sentAt.toISOString().slice(11, 16)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            }
          } else {
            if (
              (messages[index + 1] &&
                messages[index + 1].sender == auth.currentUser.uid) ||
              (messages[index + 1] &&
                messages[index + 1].sentAt - messages[index].sentAt > 300000) ||
              messages.length == 1 ||
              messages.length - 1 == index
            ) {
              return (
                <TouchableOpacity
                  style={{ flexDirection: "row", marginBottom: 8 }}
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
                      position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",

                      marginLeft: 4,
                      marginTop: 8,

                      height: 30,
                      width: 30,

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
                        left: 10,
                        bottom: -23,
                      }}
                    >
                      {item.sentAt.toISOString().slice(11, 16)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
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
                        top: 24,
                        left: 10,
                      }}
                    >
                      {item.sentAt.toISOString().slice(11, 16)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
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
