import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';

import { CardSavedOffers } from '../shared/cards/cardSavedOffers';
import { globalStyles, images } from '../styles/global';

// import venusaur from './../assets/venusaur.png';
// import reputation_icon from './../assets/reputation_icon.png';
// import collection_icon from './../assets/collection_icon.png';

import { fetchSavedCards, fetchCards } from '../authContext';
import pokemon from 'pokemontcgsdk';
import Condition from 'yup/lib/Condition';

export default function savedOffers({ navigation }) {
  // const [cardState, setCard] = useState(null);
  // const [pokemonId, setPID] = useState('base1-4');
  // const [offerSave, setSaveOffer] = useState(false);
  // const [reputationScore, setReputation] = useState('21');
  // const [collectionSize, setCollection] = useState('64');

  const [cardsData, setCardsData] = useState(null);
  const [loadingState, setLoading] = useState(true);

  useEffect(() => {
    const dowloads = async () => {
      await fetchSavedCards().then((item) => {
        setCardsData(item);

        setLoading(false);
      });
    };

    dowloads();
  }, []);

  return (
    <ScrollView style={globalStyles.container}>
      {!loadingState
        ? cardsData.map((item, i) => {
            return <CardSavedOffers props={item} key={i} />;
          })
        : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  AANFText: {
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
});
