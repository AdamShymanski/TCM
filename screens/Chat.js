import React, { useState, useEffect, useCallback } from 'react';

import { View, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

import { db, auth, createChat } from '../authContext';

import { ActivityIndicator } from 'react-native-paper';

export default function Chat({ route }) {
  const data = route.params;
  const ownerId = route.params?.ownerId;

  const [messages, setMessages] = useState([]);

  const chatsRef = db.collection(`chats/${data?.id}/messages`);

  useEffect(() => {
    const unsubscribe = chatsRef.onSnapshot((querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === 'added')
        .map(({ doc }) => {
          const message = doc.data();
          return {
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt.toDate(),
            user: {
              _id: message.uid,
              name: message.name,
            },
            sent: true,
            received: message.received,
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      appendMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  async function handleSend(messages) {
    const writes = messages.map((m) => {
      m.received = false;
      m.uid = m.user._id;
      m.name = m.user.name;
      delete m.user;
      chatsRef.add(m);
    });

    await Promise.all(writes);
  }

  return (
    <View style={{ backgroundColor: '#1b1b1b', flex: 1 }}>
      <GiftedChat
        messages={messages}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: '#f4f4f4',
                },
                left: {
                  color: '#f4f4f4',
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: '#0071db',
                  borderRadius: 4,
                },
                right: {
                  backgroundColor: '#0082ff',
                  borderRadius: 4,
                },
              }}
            />
          );
        }}
        user={{ _id: auth.currentUser.uid }}
        onSend={(messages) => {
          if (messages.length == 0) {
            handleSend(messages);
          } else {
            createChat(messages, ownerId);
          }
        }}
      />
    </View>
  );
}
