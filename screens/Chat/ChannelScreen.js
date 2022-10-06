import React, { useCallback, useEffect, useState, useMemo } from "react";

import { Channel, MessageList, MessageInput } from "stream-chat-expo"; // Or stream-chat-expo

export default function ChannelScreen({ channel }) {
  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}
