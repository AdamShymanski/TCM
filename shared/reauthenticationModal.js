import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

import { TextInput } from 'react-native-paper';
import { reauthenticate } from '../authContext';

const ReauthenticationModal = ({ setReauthenticationResult, setModal }) => {
  const [passwordState, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <Modal
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '84%',
            backgroundColor: '#121212',
            borderRadius: 8,
            paddingVertical: 18,
            paddingLeft: 16,
          }}>
          <Text style={{ color: '#f4f4f4', fontSize: 26, fontWeight: '700' }}>
            Reauthentication
          </Text>
          <TextInput
            mode={'outlined'}
            value={passwordState}
            secureTextEntry={true}
            onChangeText={(value) => {
              setPassword(value);
            }}
            label='Password'
            outlineColor={'#5c5c5c'}
            error={false}
            style={{
              width: '90%',
              backgroundColor: '#121212',
              color: '#f4f4f4',
              marginTop: 20,
            }}
            theme={{
              colors: {
                primary: '#0082ff',
                placeholder: '#5c5c5c',
                background: 'transparent',
                text: '#f4f4f4',
              },
            }}
          />
          {error ? (
            <Text
              style={{
                color: '#b40424',
                fontWeight: '700',
                marginTop: 8,
                marginRight: 16,
              }}>
              {error}
            </Text>
          ) : null}

          <View
            style={{
              width: '90%',
              flexDirection: 'row-reverse',
              marginBottom: 8,
              paddingTop: error ? 16 : 20,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: 30,

                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',

                backgroundColor: '#0082FF',
                borderRadius: 3,
                paddingHorizontal: 20,
              }}
              onPress={async () => {
                try {
                  if (await reauthenticate(passwordState)) {
                    setReauthenticationResult(true);
                  } else {
                    setError('Wrong password!');
                  }
                } catch (error) {
                  console.log(error);
                }
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#121212',
                }}>
                Submit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 30,

                marginRight: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',

                borderColor: '#5c5c5c',
                borderWidth: 2,

                borderRadius: 3,
                paddingHorizontal: 20,
              }}
              onPress={() => {
                setModal(false);
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
      </View>
    </Modal>
  );
};

export default ReauthenticationModal;
