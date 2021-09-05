import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';

import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';

import { CardSavedOffers } from '../shared/cards/cardSavedOffers';
import { globalStyles, images } from '../styles/global';

// import venusaur from './../assets/venusaur.png';
// import reputation_icon from './../assets/reputation_icon.png';
// import collection_icon from './../assets/collection_icon.png';

import { fetchSavedCards } from '../authContext';
import pokemon from 'pokemontcgsdk';
import Condition from 'yup/lib/Condition';

export default function SavedOffers({ navigation }) {
  const [cardsData, setCardsData] = useState(null);
  const [loadingState, setLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setCardsData(null);
      setLoading(true);
    }
    if (isFocused) {
      fetchSavedCards(setCardsData, setLoading);
    }
  }, [isFocused]);

  return (
    <View style={globalStyles.container}>
      {!loadingState ? (
        <FlatList
          data={cardsData}
          renderItem={({ item, index }) => {
            return (
              <CardSavedOffers
                props={item}
                setCardsData={setCardsData}
                cardsData={cardsData}
                index={index}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : null}
    </View>
  );
}
