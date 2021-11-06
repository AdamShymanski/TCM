import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { globalStyles } from '../styles/global';

import {
  fetchCards,
  fetchSavedOffersId,
  fetchMoreBigCards,
} from '../authContext';

import { useIsFocused, useNavigation } from '@react-navigation/native';

import pikachu from '../assets/pikachu.png';

import BigCardHome from '../shared/cards/BigCardHome';
import { CardHome } from '../shared/cards/CardHome';

export default function Sellers() {
  return (
    <View style={[globalStyles.container, { paddingLeft: 0 }]}>
      <View style={{ flex: 1, backgroundColor: '#1b1b1b' }}></View>
    </View>
  );
}
