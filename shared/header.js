import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/Feather';

import { fetchBigCards } from '../authContext';

export default function CustomHeader({
  version,
  setBigCardsData,
  setPageNumber,
  setInputValue,
  inputValue,
  pickerValue,
  setLoading,
}) {
  const [inputState, setInput] = useState(
    version == 'sellers' ? 'Search for a seller' : 'Search for a card'
  );

  const searchForCard = async () => {
    setBigCardsData(null);
    setBigCardsData(await fetchBigCards(inputValue, pickerValue, setLoading));
    setPageNumber(2);
  };

  const navigation = useNavigation();

  const openMenu = () => {
    navigation.openDrawer();
  };

  if (version == 'savedOffers') {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <MaterialIcons
          name='menu'
          size={28}
          color={'#f4f4f4'}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: '#f4f4f4',
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#f4f4f4',
              fontWeight: '700',
              fontSize: 21,
              marginRight: 4,
            }}>
            {'Saved Offers'}
          </Text>
          <Icon
            name='bookmark'
            color={'#0082ff'}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }

  if (version == 'settings') {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <MaterialIcons
          name='menu'
          size={28}
          color={'#f4f4f4'}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: '#f4f4f4',
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#f4f4f4',
              fontWeight: '700',
              fontSize: 21,
              marginRight: 8,
            }}>
            {'Settings'}
          </Text>
          <IconF
            name='settings'
            color={'#0082ff'}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }

  if (version == 'orders') {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <MaterialIcons
          name='menu'
          size={28}
          color={'#f4f4f4'}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: '#f4f4f4',
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#f4f4f4',
              fontWeight: '700',
              fontSize: 21,
              marginRight: 8,
            }}>
            {'Orders'}
          </Text>
          <Icon
            name='cart-outline'
            color={'#0082ff'}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }

  if (version == 'chatConversations') {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <MaterialIcons
          name='menu'
          size={28}
          color={'#f4f4f4'}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: '#f4f4f4',
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#f4f4f4',
              fontWeight: '700',
              fontSize: 21,
              marginRight: 8,
            }}>
            {'Chat'}
          </Text>
          <IconM
            name='chat-bubble'
            color={'#0082ff'}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }

  if (version == 'chat') {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <MaterialIcons
          name='menu'
          size={28}
          color={'#f4f4f4'}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: '#f4f4f4',
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#f4f4f4',
              fontWeight: '700',
              fontSize: 21,
              marginRight: 8,
            }}>
            {'Chat'}
          </Text>
          <IconM
            name='chat-bubble-outline'
            color={'#0082ff'}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }

  if (version == 'yourOffers') {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <MaterialIcons
          name='menu'
          size={28}
          color={'#f4f4f4'}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: '#f4f4f4',
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#f4f4f4',
              fontWeight: '700',
              fontSize: 21,
              marginRight: 8,
            }}>
            {'Your Offers'}
          </Text>
          <Icon name='cards' color={'#0082ff'} size={30} />
        </View>
      </View>
    );
  }

  if (version == 'sellers') {
    return (
      <View style={styles.header}>
        <MaterialIcons
          name='menu'
          size={28}
          color={'#f4f4f4'}
          onPress={() => {
            openMenu();
          }}
          style={styles.icon}
        />
        <View style={styles.headerTitle}>
          <TextInput
            mode='outlined'
            placeholderTextColor={'#5c5c5c'}
            outlineColor={'#121212'}
            onEndEditing={() => {
              searchForCard();
            }}
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
            placeholder={inputState}
            onFocus={() => setInput('')}
            onBlur={() => setInput('Seach for a card')}
            style={{
              width: 260,
              height: 40,
              marginBottom: 5,
              borderColor: '#121212',
              backgroundColor: '#1b1b1b',
              borderWidth: 2,
              borderRadius: 5,
              paddingLeft: 10,
              color: '#f4f4f4',
            }}
          />
          <MaterialIcons
            name='search'
            size={26}
            color={'#f4f4f4'}
            style={{ position: 'absolute', right: 14, top: 8 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <MaterialIcons
        name='menu'
        size={28}
        color={'#f4f4f4'}
        onPress={() => {
          openMenu();
        }}
        style={styles.icon}
      />
      <View style={styles.headerTitle}>
        <TextInput
          mode='outlined'
          placeholderTextColor={'#5c5c5c'}
          outlineColor={'#121212'}
          onEndEditing={() => {
            searchForCard();
          }}
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          placeholder={inputState}
          onFocus={() => setInput('')}
          onBlur={() => setInput('Seach for a card')}
          style={{
            width: 260,
            height: 40,
            marginBottom: 5,
            borderColor: '#121212',
            backgroundColor: '#1b1b1b',
            borderWidth: 2,
            borderRadius: 5,
            paddingLeft: 10,
            color: '#f4f4f4',
          }}
        />
        <MaterialIcons
          name='search'
          size={26}
          color={'#f4f4f4'}
          style={{ position: 'absolute', right: 14, top: 8 }}
        />
      </View>
    </View>
  );
}

// export default withNavigation(Header);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },
  icon: {
    position: 'absolute',
    left: 16,
    color: '#f4f4f4',
  },
  headerTitle: {
    position: 'absolute',
    right: 16,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 26,
    height: 26,
    marginHorizontal: 10,
  },
});
