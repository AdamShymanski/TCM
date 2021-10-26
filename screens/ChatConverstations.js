import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { fetchOwnerData } from '../authContext';
import { useNavigation } from '@react-navigation/native';

import { auth } from '../authContext';
import IconM from 'react-native-vector-icons/MaterialIcons';

export const ChatConversations = ({ listenerData }) => {
  console.log(listenerData.length);
  return (
    <View style={{ flex: 1, backgroundColor: '#1b1b1b' }}>
      {listenerData.length !== 0 ? (
        <FlatList
          data={listenerData}
          renderItem={({ item, index }) => {
            let notificationState;
            if (
              listenerData[index].data.notificationFor == auth.currentUser.uid
            ) {
              notificationState = true;
            } else notificationState = false;
            return (
              <ConversationBar
                uid={listenerData[index].uid}
                lastMessage={listenerData[index].data?.messages[0]}
                notificationState={notificationState}
                data={listenerData[index]}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={async () => {
            // console.log('hello');
          }}
          onEndReachedThreshold={4}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1b1b1b',
          }}>
          <IconM
            name='chat-bubble'
            color={'#0082ff'}
            size={58}
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              color: '#f4f4f4',
              fontSize: 38,
              fontWeight: '700',
              marginBottom: 12,
              paddingHorizontal: 20,
              textAlign: 'center',
            }}>
            Start Texting!
          </Text>
          <Text
            style={{
              color: '#4f4f4f',
              fontSize: 15,
              width: '88%',
              marginBottom: 60,
              textAlign: 'center',
            }}>
            If you find a sale that interests you, you can go to the seller's
            profile and start discussing with them via chat.
          </Text>
        </View>
      )}
    </View>
  );
};

const ConversationBar = ({ uid, lastMessage, notificationState, data }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: '', countryCode: '' });

  const navigation = useNavigation();

  const hour = lastMessage.createdAt
    .toDate()
    .toLocaleTimeString('en-US')
    .substring(0, 5);

  useEffect(() => {
    const resolvePromises = async () => {
      setUser(await fetchOwnerData(uid));
      setLoading(false);
    };
    resolvePromises();
  }, []);

  if (loading) return <View />;
  return (
    <View
      style={{
        flexDirection: 'column',
        backgroundColor: '#121212',
        marginTop: 12,
        paddingVertical: 12,
        marginHorizontal: 12,

        borderRadius: 8,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: '#1b1b1b',
            padding: 14,
            paddingVertical: 8,
            borderRadius: 3,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 12,
          }}>
          <Image
            style={{ width: 26, height: 22 }}
            source={{
              uri: `https://flagcdn.com/128x96/${user.countryCode}.png`,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#f4f4f4',
              marginLeft: 16,
            }}>
            {user.name}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 76,
            height: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',

            backgroundColor: '#0082FF',
            borderRadius: 3,

            marginRight: 12,
          }}
          onPress={() => navigation.navigate('Chat', { data })}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#121212',
            }}>
            {'Open'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          marginTop: 12,
          marginLeft: 36,
          fontSize: 11,
          fontWeight: notificationState ? '700' : '500',
          color: notificationState ? '#f4f4f4' : '#5c5c5c',
        }}>
        {`${hour}   ${lastMessage.content}`}
      </Text>
    </View>
  );
};