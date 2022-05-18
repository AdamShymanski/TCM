import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import PTCGM from '../assets/PTCGM.png';
import GoogleButton from '../assets/google_button.png';

import * as Google from 'expo-google-app-auth';
import { googleSignIn } from '../authContext';

import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
  const navigation = useNavigation();

  useEffect(() => {
    const resolvePromises = async () => {};
    resolvePromises();
  }, []);

  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          '352773112597-2s89t2icc0hfk1tquuvj354s0aig0jq2.apps.googleusercontent.com',
        androidStandaloneAppClientId: `352773112597-2s89t2icc0hfk1tquuvj354s0aig0jq2.apps.googleusercontent.com`,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        await googleSignIn(result);
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      if (e.code == 'auth/email-already-in-use') {
        console.log('Duplicated emails has been detected');
      } else {
        console.log(e);
      }
    }
  }

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
          aspectRatio: 1418 / 546,
          height: undefined,
          width: "70%",
          position: "absolute",
          top: 80,
        }}
      />
      <Text
        style={{
          fontWeight: '700',
          color: '#f4f4f4',
          fontSize: 46,
          marginBottom: 10,

          marginTop: 180,
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

      <TouchableOpacity
        onPress={() => {
          signInWithGoogleAsync();
        }}
        style={{ marginTop: 70 }}>
        <Image
          source={GoogleButton}
          style={{ width: '55%', aspectRatio: 382 / 92, height: undefined }}
        />
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
