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

export default function Header({ version }) {
  const [inputState, setInput] = useState('Seach for a card');

  const navigation = useNavigation();

  const openMenu = () => {
    navigation.openDrawer();
  };

  if (version == 'noSearchBar') {
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
          placeholder={inputState}
          placeholderTextColor={'#5c5c5c'}
          onFocus={() => setInput('')}
          onBlur={() => setInput('Seach for a card')}
          style={{
            width: 280,
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
