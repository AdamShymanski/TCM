import React, { useCallback, useEffect, useState, useMemo } from "react";

import { Channel, MessageList, MessageInput } from "stream-chat-expo"; // Or stream-chat-expo

import { useRoute } from "@react-navigation/native";

export default function ChannelScreen() {
  const route = useRoute();
  const channel = route.params.channel;

  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}
