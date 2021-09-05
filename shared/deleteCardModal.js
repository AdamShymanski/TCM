import React, { useEffect } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

import { deleteCard } from '../authContext';

export const DeleteCardModal = ({ setModal, id }) => {
  return (
    <Modal
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      transparent={true}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setModal(null);
        }}>
        <View
          style={{
            width: '80%',

            backgroundColor: '#121212',
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 12,
          }}>
          <Text style={{ color: '#f4f4f4', fontSize: 20, fontWeight: '700' }}>
            Confirm card delete
          </Text>
          <View style={{ flexDirection: 'row-reverse', marginTop: 40 }}>
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
              onPress={async () => {
                await deleteCard(id);
                setModal(false);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#121212',
                }}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 76,
                height: 30,
                marginRight: 16,

                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',

                backgroundColor: '#121212',

                borderWidth: 2,
                borderRadius: 3,
                borderColor: '#5c5c5c',
              }}
              onPress={() => {
                setModal(null);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#5c5c5c',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
