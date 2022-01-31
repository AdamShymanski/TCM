import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fetchSavedCards, db, auth } from "../authContext";
import { useIsFocused } from "@react-navigation/native";
import { CardSavedOffers } from "../shared/Cards/CardSavedOffers";

export default function SavedOffers({ navigation }) {
  const [cardsData, setCardsData] = useState([]);
  const [loadingState, setLoading] = useState(true);
  const [cartState, setCartState] = useState([]);

  const isFocused = useIsFocused();

  useEffect(async () => {
    if (!isFocused) {
      setCardsData([]);
      setLoading(true);
    }
    if (isFocused) {
      fetchSavedCards(setCardsData, setLoading);
      const doc = await db.collection("users").doc(auth.currentUser.uid).get();
      setCartState(doc.data().cart);
    }
  }, [isFocused]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1b1b1b',
        flexDirection: 'column',
      }}>
      {cardsData !== null || cardsData.length > 0 ? (
        !loadingState ? (
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
        ) : null
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1b1b1b',
          }}>
          <Icon
            name='bookmark'
            color={'#0082ff'}
            size={58}
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              color: '#f4f4f4',
              fontSize: 38,
              fontWeight: '700',
              marginBottom: 12,
              paddingHorizontal: 20,
              textAlign: 'center',
            }}>
            Save For Later!
          </Text>
          <Text
            style={{
              fontSize: 15,
              width: '80%',
              color: '#4f4f4f',
              marginBottom: 60,
              textAlign: 'center',
            }}>
            You can save the offers you like and review them again later. This
            will help you make a good decision.
          </Text>
        </View>
      ) : !loadingState ? (
        <FlatList
          data={cardsData}
          renderItem={({ item, index }) => {
            if (item.status === "published") {
              return <CardSavedOffers props={item} cartArray={cartState} />;
            }
            return null;
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : null}
    </View>
  );
}
