import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { StyleSheet, TextInput, View, Button } from 'react-native';

import { db, auth, fetchName, sendMessage } from '../authContext.js';

export default function Chat({ route, navigation }) {
  const [messages, setMessages] = useState([]);

  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');

  useEffect(() => {
    const resolvePromises = async () => {
      parseMessages(route.params.data.data.messages);
      setFirstName(await fetchName(auth.currentUser.uid));
      setSecondName(await fetchName(route.params.data.uid));
    };
    resolvePromises();
  }, []);

  const parseMessages = async (messages) => {
    const arr = [];
    messages.forEach((message, index) => {
      arr.push({
        _id: index,
        text: message.content,
        createdAt: message.createdAt.toDate(),
        user: {
          _id: message.uid,
          name: message.uid == auth.currentUser.uid ? firstName : secondName,
        },
        sent: true,
        received: true,
      });
    });
    setMessages(arr);
  };

  // const appendMessages = () => {
  //   db.collection('chats')
  //     .doc(listenerData[0].id)
  //     .update({
  //       regions: db.FieldValue.arrayUnion('greater_virginia'),
  //     });
  // };

  async function handleSend(message) {
    await sendMessage(route.params.data.id, message);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }

  // const onSend = useCallback((messages = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages)
  //   );
  // }, []);

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
        user={{ _id: auth.currentUser.uid, name: firstName }}
        onSend={(message) => handleSend(message)}
      />
    </View>
  );
}
