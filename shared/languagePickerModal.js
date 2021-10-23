import React, { useEffect } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

export const LanguagePickerModal = ({ setValue, setVisible }) => {
  const countryCodes = [
    { Code: 'PL', Name: 'Polish' },
    { Code: 'JP', Name: 'Japanese' },
    { Code: 'GB', Name: 'English' },
    { Code: 'BE', Name: 'Dutch' },
    { Code: 'DE', Name: 'German' },
    { Code: 'FR', Name: 'French' },
    { Code: 'IT', Name: 'Italian' },
    { Code: 'ES', Name: 'Spanish ' },
    { Code: 'PT', Name: 'Portuguese ' },
    { Code: 'KR', Name: 'Korean' },
    { Code: 'CN', Name: 'Traditional Chinese' },
    { Code: 'RU', Name: 'Russian' },
  ];

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
          setVisible(false);
        }}>
        <View
          style={{
            width: '90%',
            height: '80%',
            backgroundColor: '#121212',
            borderRadius: 8,
            paddingVertical: 10,
          }}>
          <FlatList
            style={{
              paddingHorizontal: 8,
            }}
            data={countryCodes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => {
                    setVisible(false);
                    setValue(item.Name);
                  }}>
                  <View
                    style={{
                      width: '90%',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{ width: 28, height: 21, marginRight: 8 }}
                      source={{
                        uri: `https://flagcdn.com/160x120/${item.Code.toLowerCase()}.png`,
                      }}
                    />
                    <Text
                      style={{
                        color: '#f4f4f4',
                        fontWeight: '700',
                        fontSize: 16,
                        textAlign: 'right',
                      }}>
                      {item.Name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
