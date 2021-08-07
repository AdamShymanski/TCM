import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  useTheme,
  Title,
  Caption,
  Paragraph,
  Drawer,
} from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';

import { auth } from '../authContext';

export default function CustomDrawer({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <DrawerContentScrollView style={{ backgroundColor: '#121212' }}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <View
                style={{
                  backgroundColor: '#1b1b1b',
                  padding: 14,
                  paddingVertical: 8,
                  borderRadius: 3,
                }}>
                <Image
                  style={{ width: 26, height: 22 }}
                  source={{ uri: 'https://flagcdn.com/32x24/es.png' }}
                />
              </View>
              <Title style={styles.title}>John Doe</Title>
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  80
                </Paragraph>
                <Caption style={styles.caption}>Reputation</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  100
                </Paragraph>
                <Caption style={styles.caption}>Cards</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='home-outline' color={'#f4f4f4'} size={size} />
              )}
              labelStyle={{ color: '#f4f4f4' }}
              label='Home'
              onPress={() => {
                navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='cart-outline' color={'#f4f4f4'} size={size} />
              )}
              labelStyle={{ color: '#f4f4f4' }}
              label='Orders'
              onPress={() => {
                // navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='bookmark-outline' color={'#f4f4f4'} size={size} />
              )}
              labelStyle={{ color: '#f4f4f4' }}
              label='Saved Offers'
              onPress={() => {
                // props.navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='cards-outline' color={'#f4f4f4'} size={size} />
              )}
              labelStyle={{ color: '#f4f4f4' }}
              label='Your Collection'
              onPress={() => {
                navigation.navigate('Collection');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='plus-box-outline' color={'#f4f4f4'} size={size} />
              )}
              labelStyle={{ color: '#f4f4f4' }}
              label='Add Ofer'
              onPress={() => {
                //! navigation.navigate('addOffer');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <IconF name='settings' color={'#f4f4f4'} size={size - 4} />
              )}
              labelStyle={{ color: '#f4f4f4' }}
              label='Settings'
              onPress={() => {
                //! navigation.navigate('Settings');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name='account-check-outline'
                  color={'#f4f4f4'}
                  size={size}
                />
              )}
              labelStyle={{ color: '#f4f4f4' }}
              label='Support'
              onPress={() => {
                // props.navigation.navigate('SupportScreen');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name='exit-to-app' color={'#f4f4f4'} size={size} />
          )}
          labelStyle={{ color: '#121212' }}
          label='Sign Out'
          labelStyle={{ color: '#f4f4f4' }}
          onPress={() => {
            auth.signOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    color: '#121212',
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 18,
    marginTop: 3,
    fontWeight: 'bold',
    color: '#f4f4f4',
    paddingLeft: 16,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: '#5c5c5c',
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
    color: '#f4f4f4',
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#5c5c5c',
    borderTopWidth: 2,
    backgroundColor: '#121212',
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
