import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { View } from 'react-native';

import {
  db,
  auth,
  fetchName,
  sendMessage,
  setMessagesListener,
} from '../authContext.js';

export default function Chat({ route, navigation }) {
  const [messages, setMessages] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  const setUpListener = async () => {
    db.collection('chats')
      .doc(route.params.data.id)
      .onSnapshot((doc) => {
        console.log('hey');

        if (messages == null) {
          doc.data().messages.forEach((message, index) => {
            setMessages([
              {
                _id: index,
                text: message.content,
                createdAt: message.sentAt.toDate(),
                user: {
                  _id: message.uid,
                  name:
                    message.uid == auth.currentUser.uid
                      ? firstName
                      : secondName,
                },
                sent: true,
                received: message.received,
              },
            ]);
          });
        } else {
          if (doc.data().messages.length != messages.length) {
            doc.data().messages.forEach((message, index) => {
              if (index + 1 > messages.length) {
                setMessages((messages) => {
                  [
                    ...messages,
                    {
                      _id: index,
                      text: message.content,
                      createdAt: message.sentAt.toDate(),
                      user: {
                        _id: message.uid,
                        name:
                          message.uid == auth.currentUser.uid
                            ? firstName
                            : secondName,
                      },
                      sent: true,
                      received: message.received,
                    },
                  ];
                });
              }
            });
          }
        }
      });
  };

  useEffect(() => {
    const resolvePromises = async () => {
      setFirstName(await fetchName(auth.currentUser.uid));
      setSecondName(await fetchName(route.params.data.uid));
      await setUpListener();
    };
    return resolvePromises();
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  async function handleSend(message) {
    await sendMessage(route.params.data.id, message);
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
        user={{ _id: auth.currentUser.uid, name: firstName }}
        onSend={(message) => handleSend(message)}
      />
    </View>
  );
}
