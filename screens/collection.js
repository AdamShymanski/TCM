import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

export default function Collection() {
  const navigation = useNavigation();
  return (
    <View style={globalStyles.container}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: '#121212',
          paddingVertical: 10,
          marginBottom: 6,
        }}
        onPress={() => navigation.navigate('AddCard')}>
        <MaterialIcons
          name='add'
          size={24}
          color='#f4f4f4'
          style={{ position: 'absolute', left: '25%' }}
          onPress={() => setModalOpen(true)}
        />
        <Text
          style={{
            color: '#f4f4f4',
            fontWeight: '700',
            fontSize: 15,
            marginRight: 8,
          }}>
          {'Add a new Card'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
