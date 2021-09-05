import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Orders = ({ route }) => {
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
          marginBottom: 12,
          paddingHorizontal: 20,
          textAlign: 'center',
        }}>
        This feature isn't ready yet!
      </Text>
      <Text
        style={{
          color: '#4f4f4f',
          fontSize: 15,
          width: '88%',
          marginBottom: 60,
          textAlign: 'center',
        }}>
        We are still working on the implementation of in-app card purchasing.
        You'll be able to use it soon, and in the meantime you can support us by
        posting offers in our app.
      </Text>
    </View>
  );
};
export default Orders;
