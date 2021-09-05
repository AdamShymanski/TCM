import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ditto from '../assets/ditto.png';

const Thanks = () => {
  const navigator = useNavigation();
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
          fontSize: 52,
          fontWeight: '700',
          marginBottom: 6,
        }}>
        Success!
      </Text>
      <Text
        style={{
          color: '#4f4f4f',
          fontSize: 15,
          width: 240,
          marginBottom: 36,
          textAlign: 'center',
        }}>
        Congrats! You just added card to your collection.
      </Text>
      <TouchableOpacity
        style={{
          height: 30,
          width: '88%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',

          marginBottom: 50,
          paddingVertical: 12,
          paddingHorizontal: 12,

          borderColor: '#0082ff',
          borderRadius: 3,
          backgroundColor: '#0082ff',
        }}
        onPress={() => {
          navigator.navigate('Home', { screen: 'Home' });
          navigator.reset({
            index: 0,
            routes: [{ name: 'Collection' }],
          });
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#121212',
          }}>
          {'Go to home'}
        </Text>
      </TouchableOpacity>
      <Image
        // source={{
        //   uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ftenor.com%2Fview%2Fpokemon-kyogre-smile-awkward-uncomfortable-gif-19040972&psig=AOvVaw1tjEwfomuxSRzO6BcLX7tB&ust=1629726348614000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCICHtvThxPICFQAAAAAdAAAAABAK',
        // }}
        source={ditto}
        style={{ aspectRatio: 565 / 505, height: undefined, width: '90%' }}
      />
    </View>
  );
};

export default Thanks;
