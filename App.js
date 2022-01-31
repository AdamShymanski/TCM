// @refresh reset
import React, { useState, useEffect } from "react";
import * as Updates from "expo-updates";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { LogBox } from "react-native";

import Buy from "./screens/Buy";
import Chat from "./screens/Chat";
import Home from "./screens/Home.js";
import Thanks from "./screens/Thanks";
import Cart from "./screens/Cart";
import Login from "./screens/Login.js";
import Welcome from "./screens/Welcome.js";
import AddCard from "./screens/AddCard.js";
import StartChat from "./screens/StartChat";
import EditCard from "./screens/EditCard.js";
import Settings from "./screens/Settings.js";
import Register from "./screens/Register.js";
import SupportChat from "./screens/SupportChat";
import YourOffers from "./screens/YourOffers.js";
import ImageBrowser from "./screens/ImageBrowser";
import SavedOffers from "./screens/SavedOffers.js";
import SellerProfile from "./screens/SellerProfile";
import DeletingAccount from "./screens/DeletingAccount";
import SearchForSeller from "./screens/SearchForSeller";
import ChatConversations from "./screens/ChatConverstations";
import FinishGoogleRegister from "./screens/FinishGoogleRegister";
import Search from "./screens/Search";
import SellerRating from "./screens/SellerRating";
import Checkout from "./screens/Checkout";
import Transactions from "./screens/Transactions";

import StripeCheckout from "./screens/StripeCheckout";

import * as Font from "expo-font";

import { db, auth, setChatListeners, createChat } from "./authContext.js";

import { AdMobBanner } from "expo-ads-admob";

import CustomHeader from "./shared/CustomHeader";
import CustomDrawer from "./shared/CustomDrawer";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function SearchStack() {
  const [headerProps, setHeaderProps] = useState({
    pageNumber: 2,
    cardsData: [],
    loadingState: false,
    inputValue: "",
    inputFocusState: false,
    sorterParams: "Rarity Declining",
    screen: "mostRecentOffers",
    filterParams: {
      language: [],
      price: { from: null, to: null },
      graded: null,
      condition: null,
    },
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        children={() => (
          <Search props={headerProps} setProps={setHeaderProps} />
        )}
        options={{
          headerTitle: () => (
            <CustomHeader
              version={"search"}
              props={headerProps}
              setProps={setHeaderProps}
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
function CartStack() {
  const [checkoutPageState, setCheckoutPageState] = useState(
    "shippingAddressPage"
  );
  //"shippingAddressPage"
  //"summaryPage"
  //"endPage"
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Checkout"
        children={() => (
          <Checkout
            pageState={checkoutPageState}
            setPage={setCheckoutPageState}
          />
        )}
        options={({ navigation, route }) => ({
          headerLeft: () => {
            if (checkoutPageState !== "endPage") {
              return (
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
                    {"Cancel"}
                  </Text>
                </TouchableOpacity>
              );
            } else return null;
          },

          headerRight: () => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <IconMCI
                  name={"truck-delivery-outline"}
                  color={"#0082ff"}
                  size={26}
                />
                <View
                  style={{
                    width: 38,
                    height: 2,
                    backgroundColor:
                      checkoutPageState !== "shippingAddressPage"
                        ? "#0560b7"
                        : "#3d3d3d",
                    marginHorizontal: 10,
                    borderRadius: 3,
                  }}
                />
                <IconMCI
                  name={"cash-register"}
                  color={
                    checkoutPageState !== "shippingAddressPage"
                      ? "#0082ff"
                      : "#5c5c5c"
                  }
                  size={26}
                />
                <View
                  style={{
                    width: 38,
                    height: 2,
                    backgroundColor:
                      checkoutPageState === "endPage" ? "#0560b7" : "#3d3d3d",
                    marginHorizontal: 10,
                    borderRadius: 3,
                  }}
                />
                <IconMCI
                  name={"flag-checkered"}
                  color={
                    checkoutPageState === "endPage" ? "#0082ff" : "#5c5c5c"
                  }
                  size={26}
                />
              </View>
            );
          },
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerTitle: () => <CustomHeader version={"cart"} />,
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
  const [isFirstMessage, setIsFirstMessage] = useState(false);

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
        component={Chat}
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
      <Stack.Screen
        name="SupportChatScreen"
        component={SupportChat}
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
  const [bigCardsData, setBigCardsData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [pageNumber, setPageNumber] = useState(2);
  const [loadingState, setLoading] = useState(false);
  const [pickerValue, setPickerValue] = useState("Rarity Declining");

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="YourOffers"
        component={YourOffers}
        options={{
          headerTitle: () => (
            <CustomHeader
              version={"yourOffers"}
              setCardsData={setBigCardsData}
              setPageNumber={setPageNumber}
              setInputValue={setInputValue}
              inputValue={inputValue}
              pickerValue={pickerValue}
              setLoading={setLoading}
            />
          ),
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
      <Stack.Screen
        name="SellerRating"
        component={SellerRating}
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
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => <CustomHeader version={"home"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
    </Stack.Navigator>
  );
}
function TransactionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Transactions"
        component={Transactions}
        options={{
          headerTitle: () => <CustomHeader version={"transactions"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [finishRegisterProcess, setFinishRegisterProcess] = useState(null);
  const [adBanerState, setAdBannerState] = useState(true);

  LogBox.ignoreLogs([
    "Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue",
  ]);
  LogBox.ignoreLogs([
    "[Unhandled promise rejection: Invariant Violation: expo-google-sign-in is not supported in the Expo Client because a custom URL scheme is required at build time. Please refer to the docs for usage outside of Expo www.npmjs.com/package/expo-google-sign-in]",
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("user", user.displayName);
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
        await Font.loadAsync({
          Roboto_Thin: require("./assets/fonts/Roboto-Thin.ttf"),
          Roboto_Light: require("./assets/fonts/Roboto-Light.ttf"),
          Roboto_Regular: require("./assets/fonts/Roboto-Regular.ttf"),
          Roboto_Medium: require("./assets/fonts/Roboto-Medium.ttf"),
        });

        if (__DEV__) {
          // do dev stuff 🤘
        } else {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            Updates.reloadAsync();
          }
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
        <StripeProvider publishableKey="pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX">
          <NavigationContainer>
            <Drawer.Navigator
              style={{ backgroundColor: "#82ff00" }}
              drawerContent={({ navigation }) => (
                <CustomDrawer navigation={navigation} />
              )}
            >
              <Drawer.Screen name="Cart" component={CartStack} />
              <Drawer.Screen name="StripeCheckout" component={StripeCheckout} />
              <Drawer.Screen name="Search" component={SearchStack} />
              <Drawer.Screen name="Home" component={HomeStack} />
              <Drawer.Screen
                name="Transactions"
                component={TransactionsStack}
              />
              <Drawer.Screen name="Settings" component={SettingsStack} />
              <Drawer.Screen name="Chat" component={ChatStack} />
              <Drawer.Screen name="Sellers" component={SellersStack} />
              <Drawer.Screen name="SavedOffers" component={SavedOffersStack} />
              <Drawer.Screen name="YourOffers" component={YourOffersStack} />
              <Drawer.Screen
                name="DeletingAccount"
                component={DeletingAccount}
              />
            </Drawer.Navigator>
            {adBanerState ? (
              <AdMobBanner
                bannerSize="smartBannerPortrait"
                adUnitID="ca-app-pub-2637485113454186/2096785031"
                servePersonalizedAds // true or false
                onAdViewDidReceiveAd={() => {
                  setAdBannerState(true);
                }}
                onDidFailToReceiveAdWithError={(error) => {
                  setAdBannerState(false);
                }}
                //detect when add is loaded
              />
            ) : null}
          </NavigationContainer>
        </StripeProvider>
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
