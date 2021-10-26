import React from 'react';
import { Image, View, Text, TouchableOpacity, Clipboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Buy({ route }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1b1b1b',
      }}>
      <Text
        style={{
          color: '#f4f4f4',
          fontSize: 38,
          fontWeight: '700',
          marginBottom: 6,
        }}>
        Contact with seller!
      </Text>
      <Text
        style={{
          color: '#4f4f4f',
          fontSize: 15,
          width: '88%',
          marginBottom: 60,
          textAlign: 'center',
        }}>
        We don't support in-app purchases yet, but you can contact the seller
        via WhatsApp, Instagram or Discord to buy the card and learn more
        details about it.
      </Text>
      <View
        style={{ width: '80%', flexDirection: 'column', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#0082ff',
            width: '100%',
            paddingVertical: 8,
            alignItems: 'center',
            borderRadius: 2,
          }}
          onPress={() => {
            navigation.navigate('Register');
          }}>
          <Text style={{ color: '#121212', fontWeight: '700', fontSize: 16 }}>
            Send Message To Seller
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#5c5c5c',
              width: '42%',
              height: 3,
              borderRadius: 2,
            }}
          />
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#777' }}>
            or
          </Text>
          <View
            style={{
              backgroundColor: '#5c5c5c',
              width: '42%',
              height: 3,
              borderRadius: 2,
            }}
          />
        </View>
      </View>
    </View>
  );
}
