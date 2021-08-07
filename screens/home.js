import React, { useState } from 'react';
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

import { CardHome } from '../shared/card';
import { globalStyles, images } from '../styles/global';

import venusaur from './../assets/venusaur.png';
import reputation_icon from './../assets/reputation_icon.png';
import collection_icon from './../assets/collection_icon.png';

import pokemon from 'pokemontcgsdk';

pokemon.configure({ apiKey: '6aa1ef65-fa80-4ea4-b35f-9466d2add1a6' });

export default function Home({ navigation }) {
  // if (card == null || undefined) return <View />;

  // const card = await pokemon.card.where({
  //   q: 'name:blastoise',
  //   pageSize: 10,
  //   page: 3,
  // });

  // console.log(card.data[0].name);

  const [cardState, setCard] = useState(null);
  const [loadingState, setLoading] = useState(true);
  const [pokemonId, setPID] = useState('base1-4');
  const [offerSave, setSaveOffer] = useState(false);

  const [reputationScore, setReputation] = useState('21');
  const [collectionSize, setCollection] = useState('64');

  function clickSave() {
    setSaveOffer(!offerSave);
  }

  async function fetchCard() {
    const card = await pokemon.card.find(pokemonId);
    setCard(card.images.large);
  }

  function onPress() {
    console.log('no elo kurwa');
  }

  fetchCard();

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.AANF}>
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
          {'Add a new Offer'}
        </Text>
      </View>

      <CardHome
        owner='Adam'
        cardName='Bulba'
        reputationScore='420'
        collectionSize='420'
        condition='10'
        rarity='10'
        set='10'
        number='10'
        cardPicture={venusaur}
      />
      <CardHome
        owner='Adam'
        cardName='Bulba'
        reputationScore='420'
        collectionSize='420'
        condition='10'
        rarity='10'
        set='10'
        number='10'
        cardPicture={venusaur}
      />
      <CardHome
        owner='Adam'
        cardName='Bulba'
        reputationScore='420'
        collectionSize='420'
        condition='10'
        rarity='10'
        set='10'
        number='10'
        cardPicture={venusaur}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  AANF: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#121212',
    paddingVertical: 10,
    marginBottom: 6,
  },
  AANFText: {
    fontWeight: '600',
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
  },
});
