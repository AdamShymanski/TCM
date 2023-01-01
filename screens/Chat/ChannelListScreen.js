import React from "react";
import { ChannelList } from "stream-chat-expo"; // Or stream-chat-expo

import { useNavigation } from "@react-navigation/native";
import { chatClient } from "../../authContext";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";
// import { auth } from "../../authContext";

export default function ChannelListScreen() {
  const navigation = useNavigation();

  const filters = {
    members: {
      $in: [chatClient.userID],
    },
  };

  // const sort = {
  //   last_message_at: -1,
  // };

  return (
    <ChannelList
      filters={filters}
      numberOfSkeletons={10}
      EmptyStateIndicator={() => (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1b1b1b",
          }}
        >
          <Icon
            name="message"
            color={"#0082ff"}
            size={58}
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              color: "#f4f4f4",
              fontSize: 28,
              fontWeight: "700",
              marginBottom: 12,
              paddingHorizontal: 20,
              textAlign: "center",
            }}
          >
            Ask | Discuss | Negotiate
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
            With our integrated chat, you can communicate very easily with
            vendors and your customers.
          </Text>
        </View>
      )}
      onSelect={(channel) => {
        navigation.navigate("ChannelScreen", { channel });
      }}
    />
  );
}
