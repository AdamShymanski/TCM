import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button, View, Text, TouchableOpacity, Image } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';

import CustomHeader from './shared/header';
import CustomDrawer from './shared/customDrawer';

import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/home.js';
import SavedOffers from './screens/savedOffers.js';
import Settings from './screens/settings.js';
import Collection from './screens/collection.js';
import AddCard from './screens/addCard.js';
import EditCard from './screens/editCard.js';
import Welcome from './screens/welcome.js';
import Register from './screens/register.js';
import Login from './screens/login.js';
import ImageBrowser from './screens/imageBrowser';
import Thanks from './screens/thanks';
import Orders from './screens/orders';
import { ContactInfo } from './screens/contactInfo';

import globalState from './global.js';
import { auth } from './authContext.js';

import {
  AdMobBanner,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  const [bigCardsData, setBigCardsData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [pageNumber, setPageNumber] = useState(2);
  const [loadingState, setLoading] = useState(false);
  const [pickerValue, setPickerValue] = useState('Rarity Declining');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        children={() => (
          <Home
            bigCardsData={bigCardsData}
            loadingState={loadingState}
            setPickerValue={setPickerValue}
            setLoading={setLoading}
            pickerValue={pickerValue}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            nativeInputValue={inputValue}
            setBigCardsData={setBigCardsData}
          />
        )}
        options={{
          headerTitle: () => (
            <CustomHeader
              version={'drawer'}
              setBigCardsData={setBigCardsData}
              setPageNumber={setPageNumber}
              setInputValue={setInputValue}
              inputValue={inputValue}
              pickerValue={pickerValue}
              setLoading={setLoading}
            />
          ),
          headerStyle: {
            backgroundColor: '#121212',
          },
        }}
      />
      <Stack.Screen
        name='ContactInfo'
        component={ContactInfo}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,

                height: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#777777',
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              onPress={() => navigation.goBack()}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#777777',
                }}>
                {'Go back'}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: '#121212',
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#121212',
          },
        })}
      />
    </Stack.Navigator>
  );
}

function SavedOffersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='SavedOffers'
        component={SavedOffers}
        options={{
          headerTitle: () => <CustomHeader version={'savedOffers'} />,
          headerStyle: {
            backgroundColor: '#121212',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Setting'
        component={Settings}
        options={{
          headerTitle: () => <CustomHeader version={'settings'} />,
          headerStyle: {
            backgroundColor: '#121212',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Orders'
        component={Orders}
        options={{
          headerTitle: () => <CustomHeader version={'orders'} />,
          headerStyle: {
            backgroundColor: '#121212',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function CollectionStack() {
  const [bigCardsData, setBigCardsData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [pageNumber, setPageNumber] = useState(2);
  const [loadingState, setLoading] = useState(false);
  const [pickerValue, setPickerValue] = useState('Rarity Declining');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Collection'
        component={Collection}
        options={{
          headerTitle: () => (
            <CustomHeader
              version={'collection'}
              setCardsData={setBigCardsData}
              setPageNumber={setPageNumber}
              setInputValue={setInputValue}
              inputValue={inputValue}
              pickerValue={pickerValue}
              setLoading={setLoading}
            />
          ),
          headerStyle: {
            backgroundColor: '#121212',
          },
        }}
      />
      <Stack.Screen
        name='ImageBrowser'
        component={ImageBrowser}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,

                height: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#777777',
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              onPress={() => navigation.goBack()}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#777777',
                }}>
                {'Go back'}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: '#121212',
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#121212',
          },
        })}
      />
      <Stack.Screen
        name='AddCard'
        component={AddCard}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 22,

                height: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#777777',
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Collection' }],
                })
              }>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#777777',
                }}>
                {'Go back'}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: '#121212',
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#121212',
          },
        })}
      />
      <Stack.Screen
        name='EditCard'
        component={EditCard}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 22,

                height: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#777777',
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Collection' }],
                })
              }>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#777777',
                }}>
                {'Go back'}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: '#121212',
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#121212',
          },
        })}
      />
      <Stack.Screen
        name='Thanks'
        component={Thanks}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 22,

                height: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#777777',
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              onPress={() => navigation.navigate('AddCard')}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#777777',
                }}>
                {'Go back'}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: '#121212',
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#121212',
          },
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      globalState.userObject = currentUser;

      if (user) {
        await setTestDeviceIDAsync('EMULATOR');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View>
        <View />
      </View>
    );
  }

  if (currentUser) {
    return (
      <AppearanceProvider>
        <NavigationContainer>
          <Drawer.Navigator
            style={{ backgroundColor: '#82ff00' }}
            drawerContent={({ navigation }) => (
              <CustomDrawer navigation={navigation} />
            )}>
            <Drawer.Screen name='Home' component={HomeStack} />
            <Drawer.Screen name='Settings' component={SettingsStack} />
            <Drawer.Screen name='Collection' component={CollectionStack} />
            <Drawer.Screen name='Orders' component={OrdersStack} />
            <Drawer.Screen name='SavedOffers' component={SavedOffersStack} />
          </Drawer.Navigator>
          <AdMobBanner
            bannerSize='smartBannerPortrait'
            adUnitID='ca-app-pub-2637485113454186/2096785031'
            //ca-app-pub-3940256099942544/6300978111
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={(error) => {
              console.log(error);
            }}
          />
        </NavigationContainer>
      </AppearanceProvider>
    );
  }

  return (
    <AppearanceProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name='Welcome'
            component={Welcome}
          />
          <Stack.Screen
            options={({ navigation, route }) => ({
              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    borderRadius: 3,
                    marginLeft: 22,

                    height: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#777777',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                  onPress={() => navigation.navigate('Welcome')}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#777777',
                    }}>
                    {'Go back'}
                  </Text>
                </TouchableOpacity>
              ),
              headerTintColor: '#121212',
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#121212',
              },
            })}
            // initialParams={{ auth: firebase.auth() }}
            name='Register'
            component={Register}
          />
          <Stack.Screen
            options={({ navigation, route }) => ({
              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    borderRadius: 3,
                    marginLeft: 22,

                    height: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#777777',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                  onPress={() => navigation.navigate('Welcome')}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#777777',
                    }}
                    onPress={() => navigation.navigate('Welcome')}>
                    {'Go back'}
                  </Text>
                </TouchableOpacity>
              ),
              headerTintColor: '#121212',
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#121212',
              },
            })}
            name='Login'
            component={Login}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}
