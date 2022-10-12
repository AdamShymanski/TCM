import React from "react";
import { ChannelList } from "stream-chat-expo"; // Or stream-chat-expo
import { View } from "react-native";

import { chatUserId } from "./chatConfig";
import { useNavigation } from "@react-navigation/native";
// import { auth } from "../../authContext";

export default function ChannelListScreen({ setChannel, chatClient }) {
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
      onSelect={(channel) => {
        setChannel(channel);
        navigation.navigate("ChannelScreen");
      }}
    />
  );
}
