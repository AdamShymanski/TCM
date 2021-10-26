import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { DeleteCardModal } from '../shared/DeleteCardModal';
import { CardCollection } from '../shared/cards/CardCollection';
import { fetchUsersCards, fetchOwnerData, auth } from '../authContext';

import { AlertModal } from '../shared/AlertModal';

export default function YourOffers() {
  const navigation = useNavigation();

  const [cardsData, setCardsData] = useState([]);
  const [modalState, setModalState] = useState(null);
  const [alertModal, setAlertModal] = useState(null);
  const [loadingState, setLoadingState] = useState(true);

  const [id, setId] = useState(null);

  const checkUsersContactInfo = async () => {
    const usersObject = await fetchOwnerData(auth.currentUser.uid);
    if (
      usersObject?.whatsAppContact ||
      usersObject?.discordContact ||
      usersObject?.instagramContact
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const resolvePromises = async () => {
      setCardsData(await fetchUsersCards());
      setLoadingState(false);
    };

    resolvePromises();
  }, []);

  useEffect(() => {
    const resolvePromises = async () => {
      if (modalState === false) {
        setLoadingState(true);
        setCardsData(await fetchUsersCards());
        setModalState(null);
        setLoadingState(false);
      }
    };

    resolvePromises();
  }, [modalState]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1b1b1b',
        flexDirection: 'column',
      }}>
      {modalState ? <DeleteCardModal setModal={setModalState} id={id} /> : null}
      {alertModal ? <AlertModal setModal={setAlertModal} /> : null}
      {!loadingState ? (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '96%',
            backgroundColor: '#121212',
            paddingVertical: 10,
            marginLeft: '2%',
            marginTop: 10,
            marginBottom: 6,
            borderRadius: 4,
          }}
          onPress={async () => {
            if (await checkUsersContactInfo()) {
              navigation.navigate('AddCard');
            } else {
              setAlertModal(true);
            }
          }}>
          <MaterialIcons
            name='add'
            size={24}
            color='#f4f4f4'
            style={{ position: 'absolute', left: '25%' }}
            onPress={() => setAlertModal(true)}
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
      ) : null}

      {cardsData?.length > 0 ? (
        !loadingState ? (
          <FlatList
            data={cardsData}
            renderItem={({ item, index }) => {
              if (index == 0) {
                return (
                  <CardCollection
                    props={item}
                    setModal={setModalState}
                    setId={setId}
                  />
                );
              }
              return (
                <CardCollection
                  props={item}
                  setModal={setModalState}
                  setId={setId}
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
            name='cards'
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
            Add New Offers!
          </Text>
          <Text
            style={{
              fontSize: 15,
              width: '80%',
              color: '#4f4f4f',
              marginBottom: 60,
              textAlign: 'center',
            }}>
            Add photos, description, price and condition of the card and sell
            it. It's really easy with PTCG Marketplace.
          </Text>
        </View>
      )}
    </View>
  );
}
