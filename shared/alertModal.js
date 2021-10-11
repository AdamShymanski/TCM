import React, { useEffect } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

export const AlertModal = ({ setModal }) => {
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
          <Text style={{ color: '#f4f4f4', fontSize: 26, fontWeight: '700' }}>
            Alert!
          </Text>
          <Text
            style={{
              color: '#5c5c5c',
              fontSize: 12,
              width: '60%',
              marginTop: 12,
              marginLeft: 10,
            }}>
            You must firstly add contact info for buyers in Settings Tab.
          </Text>
          <View style={{ flexDirection: 'row-reverse', marginTop: 20 }}>
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
              onPress={() => {
                setModal(false);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#121212',
                }}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
