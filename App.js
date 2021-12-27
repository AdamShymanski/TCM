// @refresh reset
import React, { useState, useEffect } from "react";
import * as Updates from "expo-updates";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import Home from "./screens/Home.js";
import SavedOffers from "./screens/SavedOffers.js";
import Settings from "./screens/Settings.js";
import YourOffers from "./screens/YourOffers.js";
import AddCard from "./screens/AddCard.js";
import EditCard from "./screens/EditCard.js";
import Welcome from "./screens/Welcome.js";
import Register from "./screens/Register.js";
import Login from "./screens/Login.js";
import ImageBrowser from "./screens/ImageBrowser";
import Thanks from "./screens/Thanks";
import Orders from "./screens/Orders";
import DeletingAccount from "./screens/DeletingAccount";
import ChatConversations from "./screens/ChatConverstations";
import Chat from "./screens/Chat";
import StartChat from "./screens/StartChat";
import SellerProfile from "./screens/SellerProfile";
import SearchForSeller from "./screens/SearchForSeller";

import Buy from "./screens/NewBuy";

import { db, auth, setChatListeners } from "./authContext.js";

import { AdMobBanner } from "expo-ads-admob";
import FinishGoogleRegister from "./screens/FinishGoogleRegister";

import CustomHeader from "./shared/CustomHeader";
import CustomDrawer from "./shared/CustomDrawer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  const [bigCardsData, setBigCardsData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [pageNumber, setPageNumber] = useState(2);
  const [loadingState, setLoading] = useState(false);
  const [sortingPickerValue, setSortingPickerValue] =
    useState("Rarity Declining");
  const [filteringPickerValue, setFilteringPickerValue] = useState({
    language: [],
    price: { from: null, to: null },
    graded: false,
    condition: { from: null, to: null },
  });
  const [inputFocusState, setInputFocusState] = useState(false);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        children={() => (
          <Home
            bigCardsData={bigCardsData}
            setBigCardsData={setBigCardsData}
            loadingState={loadingState}
            setLoading={setLoading}
            sortingPickerValue={sortingPickerValue}
            setSortingPickerValue={setSortingPickerValue}
            filteringPickerValue={filteringPickerValue}
            setFilteringPickerValue={setFilteringPickerValue}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            nativeInputValue={inputValue}
            inputFocusState={inputFocusState}
          />
        )}
        options={{
          headerTitle: () => (
            <CustomHeader
              version={"drawer"}
              setLoading={setLoading}
              setPageNumber={setPageNumber}
              setInputValue={setInputValue}
              setBigCardsData={setBigCardsData}
              setInputFocusState={setInputFocusState}
              inputValue={inputValue}
              sortingPickerValue={sortingPickerValue}
              filteringPickerValue={filteringPickerValue}
            />
          ),
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
      <Stack.Screen
        name="Buy"
        component={Buy}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#777777",
                }}
              >
                {"Go back"}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
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
        name="SavedOffers"
        component={SavedOffers}
        options={{
          headerTitle: () => <CustomHeader version={"savedOffers"} />,
          headerStyle: {
            backgroundColor: "#121212",
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
        name="Setting"
        component={Settings}
        options={{
          headerTitle: () => <CustomHeader version={"settings"} />,
          headerStyle: {
            backgroundColor: "#121212",
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
        name="Orders"
        component={Orders}
        options={{
          headerTitle: () => <CustomHeader version={"orders"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
    </Stack.Navigator>
  );
}
function ChatStack() {
  const [listenerData, setListenerData] = useState([]);
  const [sellerIdState, setSellerIdState] = useState(null);

  useEffect(() => {
    const resolvePromises = async () => {
      await setChatListeners(setListenerData);
    };
    resolvePromises();
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatConversations"
        children={() => <ChatConversations listenerData={listenerData} />}
        options={{
          headerTitle: () => <CustomHeader version={"chatConversations"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
      <Stack.Screen
        name="ChatScreen"
        children={(props) => (
          <Chat route={props.route} setSellerIdState={setSellerIdState} />
        )}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#777777",
                }}
              >
                {"Go back"}
              </Text>
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <TouchableOpacity
          //     style={{
          //       borderRadius: 3,
          //       marginLeft: 12,

          //       height: 30,
          //       flexDirection: "row",
          //       alignItems: "center",
          //       justifyContent: "center",
          //       backgroundColor: "#0082ff",

          //       paddingHorizontal: 12,
          //     }}
          //     onPress={() =>
          //       navigation.navigate("Sellers", {
          //         screen: "SellerProfile",
          //         params: {
          //           sellerId: sellerIdState,
          //         },
          //       })
          //     }
          //   >
          //     <Text
          //       style={{
          //         fontSize: 16,
          //         fontWeight: "700",
          //         color: "#121212",
          //       }}
          //     >
          //       {"Other offers from this seller"}
          //     </Text>
          //   </TouchableOpacity>
          // ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="StartChat"
        children={(props) => (
          <StartChat route={props.route} setSellerIdState={setSellerIdState} />
        )}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#777777",
                }}
              >
                {"Go back"}
              </Text>
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <TouchableOpacity
          //     style={{
          //       borderRadius: 3,
          //       marginRight: 12,

          //       height: 30,
          //       flexDirection: "row",
          //       alignItems: "center",
          //       justifyContent: "center",
          //       backgroundColor: "#0082ff",

          //       paddingHorizontal: 12,
          //     }}
          //     onPress={() =>
          //       navigation.navigate("SellerProfile", {
          //         sellerId: sellerIdState,
          //       })
          //     }
          //   >
          //     <Text
          //       style={{
          //         fontSize: 16,
          //         fontWeight: "700",
          //         color: "#121212",
          //       }}
          //     >
          //       {"Other offers from this seller"}
          //     </Text>
          //   </TouchableOpacity>
          // ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
    </Stack.Navigator>
  );
}
function YourOffersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="YourOffers"
        component={YourOffers}
        options={{
          headerTitle: () => <CustomHeader version={"yourOffers"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />

      <Stack.Screen
        name="ImageBrowser"
        component={ImageBrowser}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 22,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "YourOffers" }],
                })
              }
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#777777",
                }}
              >
                {"Go back"}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="AddCard"
        component={AddCard}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 22,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "YourOffers" }],
                })
              }
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#777777",
                }}
              >
                {"Go back"}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="EditCard"
        component={EditCard}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 22,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "YourOffers" }],
                })
              }
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#777777",
                }}
              >
                {"Go back"}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="Thanks"
        component={Thanks}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 22,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() => navigation.navigate("AddCard")}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#777777",
                }}
              >
                {"Go back"}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
    </Stack.Navigator>
  );
}
function SellersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchForSeller"
        component={SearchForSeller}
        options={{
          headerTitle: () => <CustomHeader version={"searchForSeller"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
      <Stack.Screen
        name="SellerProfile"
        component={SellerProfile}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#777777",
                }}
              >
                {"Go back"}
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [finishRegisterProcess, setFinishRegisterProcess] = useState(null);
  const [adBanenrState, setAdBannerState] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // await setTestDeviceIDAsync('EMULATOR');
        const usersDoc = await db
          .collection("users")
          .doc(auth.currentUser.uid)
          .get();

        if (!usersDoc.exists) {
          setFinishRegisterProcess(true);
        } else {
          //setListenerOnUsersDoc
        }
      }
      setLoading(false);
      setCurrentUser(user);
    });

    const resolvePromises = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Updates.reloadAsync();
        }
      } catch (e) {
        console.log(e);
      }
    };

    resolvePromises();
    return unsubscribe;
  }, []);

  if (loading) {
    return <View />;
  } else if (currentUser) {
    if (finishRegisterProcess) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="setFinishRegisterProcess"
              children={() => (
                <FinishGoogleRegister
                  callback={setFinishRegisterProcess}
                  name={currentUser.displayName}
                />
              )}
              options={({ navigation, route }) => ({
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      borderRadius: 3,
                      marginLeft: 12,

                      height: 30,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: "#777777",
                      paddingHorizontal: 12,
                    }}
                    onPress={() => auth.signOut()}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#777777",
                      }}
                    >
                      {"Go back"}
                    </Text>
                  </TouchableOpacity>
                ),
                headerTintColor: "#121212",
                headerTitle: "",
                headerStyle: {
                  backgroundColor: "#121212",
                },
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <Drawer.Navigator
            style={{ backgroundColor: "#82ff00" }}
            drawerContent={({ navigation }) => (
              <CustomDrawer navigation={navigation} />
            )}
          >
            <Drawer.Screen name="Home" component={HomeStack} />
            <Drawer.Screen name="Settings" component={SettingsStack} />
            <Drawer.Screen name="YourOffers" component={YourOffersStack} />
            <Drawer.Screen name="Chat" component={ChatStack} />
            <Drawer.Screen name="Orders" component={OrdersStack} />
            <Drawer.Screen name="SavedOffers" component={SavedOffersStack} />
            <Drawer.Screen name="Sellers" component={SellersStack} />
            <Drawer.Screen name="DeletingAccount" component={DeletingAccount} />
          </Drawer.Navigator>
          {adBanenrState ? (
            <AdMobBanner
              bannerSize="smartBannerPortrait"
              adUnitID="ca-app-pub-2637485113454186/2096785031"
              servePersonalizedAds // true or false
              onDidFailToReceiveAdWithError={(error) => {
                console.log(error);
                setAdBannerState(false);
              }}
              //detect when add is loaded
              onAdViewDidReceiveAd={() => {
                setAdBannerState(true);
              }}
            />
          ) : null}
        </NavigationContainer>
      );
    }
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Welcome"
            children={() => <Welcome setUserName={setFinishRegisterProcess} />}
          />
          <Stack.Screen
            options={({ navigation, route }) => ({
              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    borderRadius: 3,
                    marginLeft: 22,

                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#777777",
                    paddingHorizontal: 12,
                  }}
                  onPress={() => navigation.navigate("Welcome")}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#777777",
                    }}
                  >
                    {"Go back"}
                  </Text>
                </TouchableOpacity>
              ),
              headerTintColor: "#121212",
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#121212",
              },
            })}
            // initialParams={{ auth: firebase.auth() }}
            name="Register"
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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#777777",
                    paddingHorizontal: 12,
                  }}
                  onPress={() => navigation.navigate("Welcome")}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#777777",
                    }}
                    onPress={() => navigation.navigate("Welcome")}
                  >
                    {"Go back"}
                  </Text>
                </TouchableOpacity>
              ),
              headerTintColor: "#121212",
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#121212",
              },
            })}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            options={({ navigation, route }) => ({
              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    borderRadius: 3,
                    marginLeft: 22,

                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#777777",
                    paddingHorizontal: 12,
                  }}
                  onPress={() => navigation.navigate("Welcome")}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#777777",
                    }}
                  >
                    {"Go back"}
                  </Text>
                </TouchableOpacity>
              ),
              headerTintColor: "#121212",
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#121212",
              },
            })}
            name="FinishGoogleRegister"
            component={FinishGoogleRegister}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
