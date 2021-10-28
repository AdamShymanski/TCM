import React, { useState, useEffect, useCallback } from 'react';

import { View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

import { db, fetchName, auth } from '../authContext';

export default function Chat({ docId }) {
  const [messages, setMessages] = useState([]);

  const [userName, setUserName] = useState('Adam');
  const [callersName, setCallersName] = useState('Ala');

  const chatsRef = db.collection(`chats/8eRqz6gNNgeHMloiDbtf/messages`);
  // const chatsRef = db.collection(`chats/${docId}/messages`);

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
              name:
                message.uid == auth.currentUser.uid ? userName : callersName,
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
      delete m.user;
      chatsRef.add(m);
    });
    console.log(messages);

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
        user={{ _id: auth.currentUser.uid, name: userName }}
        onSend={(messages) => handleSend(messages)}
      />
    </View>
  );
}
