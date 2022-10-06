import React from "react";
import { ChannelList } from "stream-chat-expo"; // Or stream-chat-expo
import { View } from "react-native";

import { chatUserId } from "./chatConfig";
import { useNavigation } from "@react-navigation/native";

const filters = {
  members: {
    $in: [chatUserId],
  },
};

const sort = {
  last_message_at: -1,
};

export default function ChannelListScreen({ setChannel }) {
  const navigation = useNavigation();

  return (
    <ChannelList
      onSelect={(channel) => {
        setChannel(channel);
        navigation.navigate("ChannelScreen");
      }}
      filters={filters}
      sort={sort}
    />
  );
}
