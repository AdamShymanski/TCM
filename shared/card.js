import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';

import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';

import reputation_icon from './../assets/reputation_icon.png';
import collection_icon from './../assets/collection_icon.png';

export function CardHome(props) {
  const {
    owner,
    cardName,
    reputationScore,
    collectionSize,
    condition,
    rarity,
    set,
    number,
    cardPicture,
  } = props;

  const cardDetails = { condition, rarity, set, number };

  const [offerSave, setSaveOffer] = useState(false);

  function onPress() {
    console.log('no elo kurwa');
  }

  function clickSave() {
    setSaveOffer(!offerSave);
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={stylesCard.top}>
          <View
            style={{
              backgroundColor: '#404040',
              height: '100%',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3,
              marginRight: 10,
            }}>
            <Image
              style={{ width: 28, height: 21 }}
              source={{ uri: 'https://flagcdn.com/160x120/es.png' }}
            />
          </View>
          <Text style={[globalStyles.titleText, { color: 'white' }]}>
            {owner}
          </Text>
          <View style={stylesCard.profileParams}>
            <Image
              source={reputation_icon}
              style={{ height: 26, width: 22.9, marginRight: 6 }}
            />
            <Text
              style={{
                color: '#f4f4f4',
                fontSize: 18,
                fontWeight: '700',
                marginRight: 20,
              }}>
              {reputationScore}
            </Text>
            <Image
              source={collection_icon}
              style={{ height: 26, width: 22, marginRight: 6 }}
            />
            <Text style={{ color: '#f4f4f4', fontWeight: '700', fontSize: 18 }}>
              {collectionSize}
            </Text>
          </View>
        </View>

        <View style={stylesCard.body}>
          <Image
            style={{ width: 100, height: 139.5 }}
            source={cardPicture}
            // source={{ uri: cardState }}
            // source={{ uri: 'https://images.pokemontcg.io/sm10/35.png' }}
          />

          <View style={stylesCard.description}>
            <Text style={stylesCard.cardName}>{cardName}</Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View
                style={{
                  paddingRight: 10,
                  borderRightWidth: 2,
                  borderRadius: 2,
                  borderRightColor: '#5c5c5c',
                  marginRight: 10,
                }}>
                <Text style={stylesCard.leftText}>{'Set'}</Text>
                <Text style={stylesCard.leftText}>{'Rarity'}</Text>
                <Text style={stylesCard.leftText}>{'Number'}</Text>
                <Text style={stylesCard.leftText}>{'Condition'}</Text>
              </View>
              <View>
                <Text style={stylesCard.rightText}>{cardDetails.set}</Text>
                <Text style={stylesCard.rightText}>{cardDetails.rarity}</Text>
                <Text style={stylesCard.rightText}>{cardDetails.number}</Text>
                <Text style={stylesCard.rightText}>
                  {cardDetails.condition}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={stylesCard.bottom}>
          <TouchableOpacity
            style={{
              width: 76,
              height: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',

              backgroundColor: '#0082FF',
              borderRadius: 3,
            }}
            onPress={onPress}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#121212' }}>
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                borderRadius: 3,
                marginRight: 16,

                height: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              },
              offerSave
                ? {
                    backgroundColor: '#0082FF',
                    width: 90,
                  }
                : {
                    width: 76,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    borderColor: '#5c5c5c',
                  },
            ]}
            onPress={clickSave}>
            <Text
              style={[
                {
                  fontSize: 16,
                  fontWeight: '700',
                },
                offerSave
                  ? {
                      color: '#121212',
                    }
                  : {
                      color: '#5c5c5c',
                    },
              ]}>{`${offerSave ? 'Saved' : 'Save'}`}</Text>
            {offerSave ? (
              <IconMI
                name={'check-bold'}
                size={18}
                color='#121212'
                style={{ marginLeft: 6, bottom: 1 }}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    marginHorizontal: 4,
    marginVertical: 6,
  },
  cardContent: {
    marginVertical: 20,
  },
});

const stylesCard = StyleSheet.create({
  top: {
    position: 'relative',

    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 3,
    backgroundColor: '#121212',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 130,
    borderRadius: 6,
    width: '100%',
  },
  description: {
    backgroundColor: '#121212',
    width: '80%',
    marginLeft: 10,
    height: '106%',
    paddingLeft: 12,
    paddingTop: 10,
    borderRadius: 5,
  },
  rightText: {
    color: '#0082ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  leftText: {
    color: '#f4f4f4',
    fontWeight: '400',
    fontSize: 16,
  },
  cardName: {
    color: '#f4f4f4',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 8,
  },
  bottom: {
    marginTop: 18,
    flexDirection: 'row-reverse',
  },
  profileParams: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
});
