import React, { useEffect, useState } from 'react';

import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { DeleteCardModal } from '../shared/deleteCardModal';
import { CardCollection } from '../shared/cards/cardCollection';
import { fetchUsersCards, fetchOwnerData, auth } from '../authContext';

import { globalStyles } from '../styles/global';

import { AlertModal } from '../shared/alertModal';

export default function Collection() {
  const navigation = useNavigation();

  const [cardsData, setCardsData] = useState([]);
  const [modalState, setModalState] = useState(null);
  const [alertModal, setAlertModal] = useState(null);
  const [loadingState, setLoadingState] = useState(true);

  const [id, setId] = useState(null);
  const [usersObject, setUsersObject] = useState(null);

  const checkUsersContactInfo = async () => {
    // setUsersObject(await fetchOwnerData(auth.currentUser.uid));
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
    <View style={globalStyles.container}>
      {modalState ? <DeleteCardModal setModal={setModalState} id={id} /> : null}
      {alertModal ? <AlertModal setModal={setAlertModal} /> : null}
      {!loadingState ? (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            backgroundColor: '#121212',
            paddingVertical: 10,
            marginLeft: 10,
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
      ) : null}

      {!loadingState ? (
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
      ) : null}
    </View>
  );
}
