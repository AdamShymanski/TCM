import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import PTCGM from '../assets/PTCGM.png';

import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        flexDirectionL: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1b1b1b',
      }}>
      <Image
        source={PTCGM}
        style={{
          aspectRatio: 568.78 / 292.37,

          // height: 292.37,
          // width: 538.78,
          height: undefined,
          width: '85%',

          position: 'absolute',
          top: 40,
        }}
      />
      <Text
        style={{
          fontWeight: '700',
          color: '#f4f4f4',
          fontSize: 46,
          marginBottom: 10,
          marginTop: 30,
          marginTop: 120,
        }}>
        {'Welcome'}
      </Text>
      <Text
        style={{
          fontWeight: '600',
          color: '#939393',
          fontSize: 12,
          textAlign: 'center',
          width: 280,
          marginBottom: 40,
        }}>
        {'to PTCG Marketplace. Let’s start, and remember. Catch them all!'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '75%',
          marginVertical: 10,
        }}>
        <View
          style={{
            backgroundColor: '#5c5c5c',
            width: '40%',
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
            width: '40%',
            height: 3,
            borderRadius: 2,
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Register');
        }}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0082ff',
    width: '75%',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#121212',
    fontWeight: '700',
  },
});
