import React, { useState, useEffect } from 'react';

import { Button, View, Text, TouchableOpacity, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CustomDrawer from './shared/customDrawer';
import CustomHeader from './shared/header';

import { createStackNavigator } from '@react-navigation/stack';

import { LogBox } from 'react-native';

// import HomeStack from './routes/homeStack';
import Home from './screens/home.js';
import SavedOffers from './screens/savedOffers.js';
import AddOffer from './screens/addOffer.js';
import Settings from './screens/settings.js';
import Collection from './screens/collection.js';
import AddCard from './screens/addCard.js';
import Welcome from './screens/welcome.js';
import Register from './screens/register.js';
import Login from './screens/login.js';
import ImageBrowser from './screens/imageBrowser';

import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';

import globalState from './global.js';
import { auth, fetchGlobalData } from './authContext.js';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          headerTitle: () => <CustomHeader version={'drawer'} />,
          headerStyle: {
            backgroundColor: '#121212',
          },
        }}
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
          headerTitle: () => <CustomHeader version={'noSearchBar'} />,
          headerStyle: {
            backgroundColor: '#121212',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function CollectionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Collection'
        component={Collection}
        options={{
          headerTitle: () => <CustomHeader version={'drawer'} />,
          headerStyle: {
            backgroundColor: '#121212',
          },
        }}
      />
      <Stack.Screen
        name='ImageBrowser'
        component={ImageBrowser}
        // options={{
        //   title: 'Selected 0 files',
        // }}
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
              onPress={() => navigation.navigate('Collection')}>
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
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      globalState.userObject = currentUser;

      if (user) {
        await fetchGlobalData();
        // globalState.globalData = await fetchGlobalData();
        // globalState.userData = await fetchUserData(user.uid);
      }
      setLoading(false);
    });

    // LogBox.ignoreLogs(['Setting a timer for a long period of time']);

    return unsubscribe;
  }, []);

  // useEffect(() => {}, []);

  if (loading)
    return (
      <View>
        <Image />
      </View>
    );

  if (currentUser)
    //! Home component
    return (
      <NavigationContainer>
        <Drawer.Navigator
          style={{ backgroundColor: '#82ff00' }}
          drawerContent={({ navigation }) => (
            <CustomDrawer navigation={navigation} />
          )}>
          <Drawer.Screen name='Home' component={HomeStack} />
          <Drawer.Screen name='Settings' component={Settings} />
          <Drawer.Screen name='Collection' component={CollectionStack} />
          <Drawer.Screen name='SavedOffers' component={SavedOffersStack} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

  return (
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
                <IconMI
                  name={'arrow-left-thick'}
                  size={18}
                  color='#777777'
                  style={{ marginRight: 8 }}
                />
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
                <IconMI
                  name={'arrow-left-thick'}
                  size={18}
                  color='#777777'
                  style={{ marginRight: 8 }}
                  onPress={() => navigation.navigate('Welcome')}
                />
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
  );

  //   )

  // return userToken == true ? (

  // ) : (
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       <Stack.Screen
  //         options={{
  //           headerShown: false,
  //         }}
  //         name='Welcome'
  //         component={Welcome}
  //       />
  //       <Stack.Screen
  //         options={({ navigation, route }) => ({
  //           headerLeft: () => (
  //             <TouchableOpacity
  //               style={{
  //                 borderRadius: 3,
  //                 marginLeft: 22,

  //                 height: 30,
  //                 flexDirection: 'row',
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //                 borderWidth: 2,
  //                 borderColor: '#777777',
  //                 paddingHorizontal: 12,
  //                 paddingVertical: 8,
  //               }}
  //               onPress={() => navigation.navigate('Welcome')}>
  //               <IconMI
  //                 name={'arrow-left-thick'}
  //                 size={18}
  //                 color='#777777'
  //                 style={{ marginRight: 8 }}
  //               />
  //               <Text
  //                 style={{
  //                   fontSize: 16,
  //                   fontWeight: '700',
  //                   color: '#777777',
  //                 }}>
  //                 {'Go back'}
  //               </Text>
  //             </TouchableOpacity>
  //           ),
  //           headerTintColor: '#121212',
  //           headerTitle: '',
  //           headerStyle: {
  //             backgroundColor: '#121212',
  //           },
  //         })}
  //         initialParams={{ auth: firebase.auth() }}
  //         name='Register'
  //         component={Register}
  //       />
  //       <Stack.Screen
  //         options={({ navigation, route }) => ({
  //           headerLeft: () => (
  //             <TouchableOpacity
  //               style={{
  //                 borderRadius: 3,
  //                 marginLeft: 22,

  //                 height: 30,
  //                 flexDirection: 'row',
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //                 borderWidth: 2,
  //                 borderColor: '#777777',
  //                 paddingHorizontal: 12,
  //                 paddingVertical: 8,
  //               }}
  //               onPress={() => navigation.navigate('Welcome')}>
  //               <IconMI
  //                 name={'arrow-left-thick'}
  //                 size={18}
  //                 color='#777777'
  //                 style={{ marginRight: 8 }}
  //                 onPress={() => navigation.navigate('Welcome')}
  //               />
  //               <Text
  //                 style={{
  //                   fontSize: 16,
  //                   fontWeight: '700',
  //                   color: '#777777',
  //                 }}
  //                 onPress={() => navigation.navigate('Welcome')}>
  //                 {'Go back'}
  //               </Text>
  //             </TouchableOpacity>
  //           ),
  //           headerTintColor: '#121212',
  //           headerTitle: '',
  //           headerStyle: {
  //             backgroundColor: '#121212',
  //           },
  //         })}
  //         name='Login'
  //         component={Login}
  //       />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}
