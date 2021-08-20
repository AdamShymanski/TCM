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

import { CardHome } from '../shared/cards/cardHome';
import BigCard from '../shared/cards/bigCard';

import { globalStyles, images } from '../styles/global';

// import venusaur from './../assets/venusaur.png';
// import reputation_icon from './../assets/reputation_icon.png';
// import collection_icon from './../assets/collection_icon.png';

import { fetchCards, fetchBigCards } from '../authContext';

export default function Home({ navigation }) {
  // const [cardState, setCard] = useState(null);
  // const [pokemonId, setPID] = useState('base1-4');
  // const [offerSave, setSaveOffer] = useState(false);
  // const [reputationScore, setReputation] = useState('21');
  // const [collectionSize, setCollection] = useState('64');

  const [cardsData, setCardsData] = useState(null);
  const [bigCardsData, setBigCardsData] = useState(null);
  const [loadingState, setLoading] = useState(true);

  useEffect(() => {
    const dowloads = async () => {
      setCardsData(await fetchCards());
      // const a = await fetchBigCards();
      // a.forEach((card) => {
      //   console.log(card.name);
      // });

      // // console.log(a);
      setBigCardsData(await fetchBigCards());
      setLoading(false);
    };

    dowloads();

    // bigCardsData.forEach((card) => {
    //   console.log(card.name);
    // });

    // console.log(bigCardsData[0].name);
  }, []);

  return (
    <ScrollView style={globalStyles.container}>
      {/* <View style={styles.AANF}>
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

      {cardsData.map((item, i) => {
        return <CardHome props={item} />;
      })} */}

      {/* 
      {!loadingState
        ? cardsData.map((item, i) => {
            return <CardHome props={item} key={i} />;
          })
        : null} */}

      {!loadingState
        ? bigCardsData.map((item, i) => {
            return <BigCard props={item} key={i} />;
          })
        : null}

      {/* <BigCard /> */}
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
