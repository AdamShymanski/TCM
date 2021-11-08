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

import PickerModal from '../shared/PickerModal';
import pikachu from '../assets/pikachu.png';

import BigCardHome from '../shared/cards/BigCardHome';
import { CardHome } from '../shared/cards/CardHome';

export default function Home({
  bigCardsData,
  loadingState,
  setPickerValue,
  setLoading,
  pickerValue,
  pageNumber,
  setPageNumber,
  nativeInputValue,
  setBigCardsData,
}) {
  const [id, setId] = useState(null);
  const [cardsData, setCardsData] = useState([]);

  const isFocused = useIsFocused();
  const [savedOffersId, setSavedOffersId] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const dowloads = async () => {
      setCardsData(await fetchCards());
    };

    dowloads();
  }, []);

  useEffect(() => {
    if (cardsData.length >= 1) setCardsData([]);
  }, [bigCardsData]);

  useEffect(() => {
    if (!isFocused) {
      setSavedOffersId(null);
      setLoading(true);
    }
    if (isFocused) {
      fetchSavedOffersId(setSavedOffersId, setLoading);
    }
  }, [isFocused]);

  useEffect(() => {
    const resolvePromises = async () => {
      if (id !== undefined || null || []) {
        setCardsData(await fetchCards(id));
      }
    };
    resolvePromises();
  }, [id]);

  const stateHandler = (variant) => {
    if (variant == 'pikachu') {
      if (loadingState) return false;
      if (cardsData === null || undefined) return true;
      if (bigCardsData === null || undefined) return true;
      if (cardsData.length > 1) return false;
      if (bigCardsData.length > 1) return false;
      return true;
    }
    if (variant == 'list') {
      if (loadingState) return false;
      if (cardsData === null || undefined) return false;
      if (bigCardsData === null || undefined) return false;
      if (cardsData.length >= 1) return false;
      if (bigCardsData.length < 1) return false;
      return true;
    }
    if (variant == 'secondList') {
      if (loadingState) return false;
      if (cardsData === null || undefined) return false;
      if (cardsData.length >= 1) return true;
    }
    if (variant == 'indicator') {
      if (loadingState) return true;
      return false;
    }
    if (variant == 'topBar') {
      if (loadingState) return false;
      if (cardsData.length >= 1) return false;
      return true;
    }
    if (variant == 'goBackBar') {
      if (cardsData.length >= 1) return true;
      return false;
    }
  };

  return (
    <View style={[globalStyles.container, { paddingLeft: 0 }]}>
      <PickerModal
        setValue={setPickerValue}
        propsArry={[
          // 'Price Ascending',
          // 'Price Declining',
          'Rarity Ascending',
          'Rarity Declining',
        ]}
        visible={pickerModal}
        setVisible={setPickerModal}
      />
      <View style={{ flex: 1, backgroundColor: '#1b1b1b' }}>
        <View
          style={{
            backgroundColor: '#121212',

            // borderTopColor: '#5c5c5c',
            // borderTopWidth: 1.5,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          {stateHandler('topBar') ? (
            <View style={{ flexDirection: 'row', marginVertical: 12 }}>
              <TouchableOpacity
                style={{
                  borderRadius: 4,

                  marginLeft: 8,
                  marginTop: 4,

                  height: 32,
                  paddingHorizontal: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1b1b1b',
                }}
                onPress={() => setPickerModal(true)}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#f4f4f4',
                  }}>
                  {' Sort by :  '}
                  <Text style={{ color: '#0082ff' }}>{pickerValue}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {stateHandler('goBackBar') ? (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,
                marginVertical: 12,

                height: 30,
                width: 120,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#777777',
                paddingHorizontal: 12,
              }}
              onPress={() => setCardsData([])}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#777777',
                }}>
                {'Go back'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {stateHandler('pikachu') ? (
          <View
            style={{
              flex: 1,

              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 30,
            }}>
            <Image
              source={pikachu}
              style={{
                aspectRatio: 651 / 522,
                width: '64%',
                height: undefined,
              }}
            />
            <Text
              style={{
                color: '#434343',
                fontSize: 20,
                fontWeight: '600',
                marginTop: 30,
                fontWeight: '700',
              }}>
              {'Search for a card'}
            </Text>
          </View>
        ) : null}

        {stateHandler('list') ? (
          <FlatList
            style={{ paddingHorizontal: 8 }}
            data={bigCardsData}
            numColumns={2}
            renderItem={({ item }) => {
              return <BigCardHome props={item} setId={setId} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={async () => {
              await fetchMoreBigCards(
                nativeInputValue,
                pickerValue,
                pageNumber,
                bigCardsData,
                setBigCardsData
              );
              setPageNumber(pageNumber + 1);
            }}
            onEndReachedThreshold={4}
          />
        ) : null}

        {stateHandler('secondList') ? (
          <FlatList
            data={cardsData}
            renderItem={({ item }) => {
              return <CardHome props={item} isSavedState={savedOffersId} />;
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : null}

        {stateHandler('indicator') ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size='large' color='#0082ff' />
          </View>
        ) : null}
      </View>
    </View>
  );
}
