import React, { useState } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import IconM from "react-native-vector-icons/MaterialIcons";
import IconMI from "react-native-vector-icons/MaterialCommunityIcons";

import cart_down_icon from "./../assets/cart_down.png";
import cart_up_icon from "./../assets/cart_up.png";

import { useNavigation } from "@react-navigation/native";

import { db, auth, createChat } from "../authContext";

import useChatClient from "../screens/Chat/useChatClient";

export default function SellerDetailsBar({ props }) {
  const navigation = useNavigation();

  const [startChatLoading, setStartChatLoading] = useState(false);

  const { clientIsReady, chatClient } = useChatClient();

  if (!props.hide)
    return (
      <LinearGradient
        colors={["#121212", "#212121"]}
        style={{
          height: 90,
          marginBottom: 18,
          borderBottomRightRadius: 3,
          borderBottomLeftRadius: 3,
          flexDirection: "row",

          paddingLeft: 8,
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <IconM
              name={"star-outline"}
              size={15}
              style={{ color: "#f4f4f4" }}
            />
            <IconM
              name={"star-outline"}
              size={15}
              style={{ color: "#f4f4f4" }}
            />
            <IconM
              name={"star-outline"}
              size={15}
              style={{ color: "#f4f4f4" }}
            />
            <IconM
              name={"star-outline"}
              size={15}
              style={{ color: "#f4f4f4" }}
            />
            <IconM
              name={"star-outline"}
              size={15}
              style={{ color: "#f4f4f4" }}
            />
            {/* <Text
              style={{
                color: "#f4f4f4",
                fontSize: 13,
                marginLeft: 5,
                fontFamily: "Roboto_Medium",
              }}
            >
              0
            </Text> */}
          </View>
          <Text style={{ color: "#9C9C9C", fontSize: 10, fontWeight: "700" }}>
            No rating yet
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            marginLeft: 42,
            marginRight: 54,
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <IconMI
              name="eye"
              size={16}
              style={{ color: "#0082ff", marginRight: 4 }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 13,
                fontWeight: "700",
                marginRight: 12,
              }}
            >
              0
            </Text>
            <IconMI
              name="cards-outline"
              size={17}
              style={{ color: "#0082ff", marginRight: 4 }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              {props.sellerProfile.statistics.numberOfOffers}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={cart_up_icon}
              style={{
                height: undefined,
                aspectRatio: 23 / 26,
                width: 16,
                marginRight: 4,
              }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 13,
                fontWeight: "700",
                marginRight: 12,
              }}
            >
              0
            </Text>
            <Image
              source={cart_down_icon}
              style={{
                height: undefined,
                aspectRatio: 23 / 26,
                width: 16,
                marginRight: 4,
              }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              0
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",

              borderWidth: 2,
              borderRadius: 3,
              borderColor: "#5c5c5c",
              paddingVertical: 3,
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={{
                color: "#5c5c5c",

                fontSize: 13,
                fontWeight: "700",

                marginRight: 4,
              }}
            >
              Report
            </Text>
            <IconMI
              name={"flag-plus-outline"}
              size={17}
              style={{ color: "#5c5c5c" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              setStartChatLoading(true);

              try {
                // db.collection("chats")
                //   .where("participants", "array-contains", auth.currentUser.uid)
                //   .onSnapshot(async (snapshot) => {
                //     let chatExists = false;
                //     snapshot.forEach(async (doc) => {
                //       if (
                //         doc
                //           .data()
                //           .participants.includes(props.sellerProfile.uid)
                //       ) {
                //         chatExists = true;

                //         navigation.navigate("ChatStack", {
                //           screen: "ChatScreen",
                //           params: {
                //             id: doc.id,
                //             name: props.sellerProfile.name,
                //           },
                //         });
                //       }
                //     });

                //     if (!chatExists) {
                //       const id = await createChat(props.sellerProfile.uid);
                // navigation.navigate("ChatStack", {
                //   screen: "ChatScreen",
                //   params: {
                //     id: id,
                //     name: props.sellerProfile.name,
                //   },
                // });
                //     }
                //   });
                
                // console.log(auth.currentUser.uid);
                // console.log(props.sellerProfile.uid);

                const channel = chatClient.channel("messaging", {
                  members: [props.sellerProfile.uid, auth.currentUser.uid],
                  created_by_id: auth.currentUser.uid,
                });

                await channel.create();

                navigation.navigate("ChatStack", {
                  screen: "ChannelListScreen",
                });
              } catch (e) {
                console.log(e);
              }
              setStartChatLoading(false);
            }}
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",

              borderRadius: 3,

              paddingVertical: 5,
              paddingHorizontal: 8,

              backgroundColor: "#0082ff",

              marginTop: 8,
            }}
          >
            <Text
              style={{
                color: "#121212",

                fontSize: 13,
                fontWeight: "700",

                marginRight: 4,
              }}
            >
              Start Chat
            </Text>
            {startChatLoading ? (
              <ActivityIndicator size={17} color={"#121212"} />
            ) : (
              <IconMI
                name={"message-arrow-right"}
                size={17}
                style={{ color: "#121212" }}
              />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  else return null;
}
