// @refresh reset
import React, { useState, useEffect, useRef } from "react";
import * as Updates from "expo-updates";

import { Link, NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { LogBox } from "react-native";

import Buy from "./screens/Buy";
import Chat from "./screens/Chat";
import Cart from "./screens/Cart";
import Home from "./screens/Home.js";
import Thanks from "./screens/Thanks";
import Search from "./screens/Search";
import Login from "./screens/Login.js";
import SignOut from "./screens/SignOut";
import Checkout from "./screens/Checkout";
import AddCard from "./screens/AddCard.js";
// import Welcome from "./screens/Welcome.js";
import StartChat from "./screens/StartChat";
import EditCard from "./screens/EditCard.js";
import Settings from "./screens/Settings.js";
import Register from "./screens/Register.js";
import SupportChat from "./screens/SupportChat";
import YourOffers from "./screens/YourOffers.js";
import Transactions from "./screens/Transactions";
import ImageBrowser from "./screens/ImageBrowser";
import SavedOffers from "./screens/SavedOffers.js";
import SellerProfile from "./screens/SellerProfile";
import Rating from "./screens/subscreens/Seller/Rating";
import DeletingAccount from "./screens/DeletingAccount";
import ChatConversations from "./screens/ChatConverstations";
import OtherSellersOffers from "./screens/OtherSellersOffers";
import FinishGoogleRegister from "./screens/FinishGoogleRegister";

import AddShippingMethod from "./screens/subscreens/Seller/AddShippingMethod";
import EditShippingMethod from "./screens/subscreens/Seller/EditShippingMethod";
import TransactionDetails from "./screens/subscreens/Transactions/TransactionDetails";
import Settings_AddAddress from "./screens/subscreens/Settings/Settings_AddAddress";
import Settings_EditAddress from "./screens/subscreens/Settings/Settings_EditAddress";
import Checkout_AddAddress from "./screens/subscreens/Checkout/Checkout_AddAddress";

import History from "./screens/subscreens/Seller/History";
import ReferralProgram from "./screens/ReferralProgram";

import WorkInProgress from "./screens/WorkInProgress";

import CustomHeader from "./shared/CustomHeader";
import CustomDrawer from "./shared/CustomDrawer";

//!import SearchForSeller from "./screens/SearchForSeller";

import { AdMobBanner } from "expo-ads-admob";
import { db, auth, setChatListeners, functions } from "./authContext.js";

import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import * as Font from "expo-font";
import * as Sentry from "sentry-expo";

import * as Device from "expo-device";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import clipboard_text_clock from "./assets/clipboard_text_clock.png";
import opened_box from "./assets/opened_box.png";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const prefix = Linking.makeUrl("/");

if (__DEV__) {
} else {
  Sentry.init({
    dsn: "https://6131440690cd436b8802bd5b1318e1a6@o1133377.ingest.sentry.io/6179878",
    enableInExpoDevelopment: true,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    // alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0082ff",
    });
  }

  return token;
}

function SearchStack() {
  const [headerProps, setHeaderProps] = useState({
    pageNumber: 2,
    mroPageNumber: 2,
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
      <Stack.Screen
        name="Settings_AddAddress"
        component={Settings_AddAddress}
        options={({ navigation, route }) => ({
          headerLeft: () => {
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
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#777777",
                  }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
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
        name="Settings_EditAddress"
        component={Settings_EditAddress}
        options={({ navigation, route }) => ({
          headerLeft: () => {
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
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#777777",
                  }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
            );
          },

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
function CartStack() {
  const [checkoutPageState, setCheckoutPageState] = useState("shippingPage");
  //"shippingPage"
  //"summaryPage"
  //"endPage"
  // start - "loadingPage"

  return (
    <Stack.Navigator>
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
                  onPress={() => {
                    if (checkoutPageState === "summaryPage") {
                      setCheckoutPageState("shippingPage");
                    } else {
                      navigation.goBack();
                    }
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#777777",
                    }}
                  >
                    {checkoutPageState === "shippingPage"
                      ? "Cancel"
                      : "Go Back"}
                  </Text>
                </TouchableOpacity>
              );
            } else return null;
          },
          headerRight: () => {
            if (checkoutPageState === "loadingPage") {
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
                    color={"#5c5c5c"}
                    size={26}
                  />
                  <View
                    style={{
                      width: 38,
                      height: 2,
                      backgroundColor: "#3d3d3d",
                      marginHorizontal: 10,
                      borderRadius: 3,
                    }}
                  />
                  <IconMCI name={"cash-register"} color={"#5c5c5c"} size={26} />
                  <View
                    style={{
                      width: 38,
                      height: 2,
                      backgroundColor: "#3d3d3d",
                      marginHorizontal: 10,
                      borderRadius: 3,
                    }}
                  />
                  <IconMCI
                    name={"flag-checkered"}
                    color={"#5c5c5c"}
                    size={26}
                  />
                </View>
              );
            }
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
                      checkoutPageState !== "shippingPage"
                        ? "#0560b7"
                        : "#3d3d3d",
                    marginHorizontal: 10,
                    borderRadius: 3,
                  }}
                />
                <IconMCI
                  name={"cash-register"}
                  color={
                    checkoutPageState !== "shippingPage" ? "#0082ff" : "#5c5c5c"
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
        name="Checkout_AddAddress"
        component={Checkout_AddAddress}
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
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#777777",
                    }}
                  >
                    Go Back
                  </Text>
                </TouchableOpacity>
              );
            } else return null;
          },

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
          headerTitle: () => <CustomHeader version={"yourOffers"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
      <Stack.Screen
        name="WorkInProgress"
        component={WorkInProgress}
        options={{
          headerTitle: () => <CustomHeader version={"workInProgress"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
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
              onPress={() =>
                navigation.navigate("YourOffersStack", {
                  screen: "YourOffers",
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
    </Stack.Navigator>
  );
}
function SellerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SellerProfile"
        component={SellerProfile}
        options={{
          headerTitle: () => <CustomHeader version={"sellerProfile"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
      <Stack.Screen
        name="WorkInProgress"
        component={WorkInProgress}
        options={{
          headerTitle: () => <CustomHeader version={"workInProgress"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
      <Stack.Screen
        name="History"
        component={History}
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
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#f4f4f4",
                  fontWeight: "700",
                  fontSize: 21,
                  marginRight: 16,
                }}
              >
                {"History"}
              </Text>
              <Image
                source={clipboard_text_clock}
                style={{
                  aspectRatio: 42 / 46,
                  height: undefined,
                  width: 28,
                  marginRight: 16,
                }}
              />
            </View>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="AddShippingMethod"
        component={AddShippingMethod}
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
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#f4f4f4",
                  fontWeight: "700",
                  fontSize: 21,
                  marginRight: 8,
                }}
              >
                {"New Shipping Method"}
              </Text>
              <IconMI
                name="local-shipping"
                color={"#0082ff"}
                size={30}
                style={{ marginRight: 12 }}
              />
            </View>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="EditShippingMethod"
        component={EditShippingMethod}
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
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#f4f4f4",
                  fontWeight: "700",
                  fontSize: 21,
                  marginRight: 8,
                }}
              >
                {"Edit Shipping Method"}
              </Text>
              <IconMI
                name="local-shipping"
                color={"#0082ff"}
                size={30}
                style={{ marginRight: 12 }}
              />
            </View>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="Rating"
        component={Rating}
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
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#f4f4f4",
                  fontWeight: "700",
                  fontSize: 21,
                  marginRight: 8,
                }}
              >
                {"Rating"}
              </Text>
              <IconMI name="star" color={"#0082ff"} size={30} />
            </View>
          ),
          headerTintColor: "#121212",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#121212",
          },
        })}
      />
      <Stack.Screen
        name="OtherSellersOffers"
        component={OtherSellersOffers}
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
function ReferralProgramStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WorkInProgress"
        component={WorkInProgress}
        options={{
          headerTitle: () => <CustomHeader version={"workInProgress"} />,
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
      <Stack.Screen
        name="ReferralProgram"
        component={ReferralProgram}
        options={{
          headerTitle: () => <CustomHeader version={"referralProgram"} />,
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
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetails}
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
              onPress={() => navigation.navigate("Transactions")}
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
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#f4f4f4",
                  fontWeight: "700",
                  fontSize: 21,
                  marginRight: 16,
                }}
              >
                {"Details"}
              </Text>
              <Image
                source={opened_box}
                style={{
                  aspectRatio: 82 / 78,
                  height: undefined,
                  width: 28,
                  marginRight: 16,
                }}
              />
            </View>
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
  const [finishRegisterProcess, setFinishRegisterProcess] = useState(null);

  const responseListener = useRef();
  const notificationListener = useRef();

  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(false);

  LogBox.ignoreLogs([
    "Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground. See https://github.com/facebook/react-native/issues/12981 for more info.",
  ]);
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  ]);

  const handleDeepLink = async (event) => {
    let data = Linking.parse(event.url);
    // setDeepLinkData(data);
  };

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        YourOffers: "yourOffers",
      },
    },
  };

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
          setFinishRegisterProcess(false);
          registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);

            if (
              token &&
              (!usersDoc.data()?.notificationToken ||
                usersDoc.data()?.notificationToken !== token)
            ) {
              db.collection("users").doc(auth.currentUser.uid).update({
                notificationToken: token,
              });
            }
          });

          // This listener is fired whenever a notification is received while the app is foregrounded
        }
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });

      setLoading(false);
    });

    const resolvePromises = async () => {
      try {
        Linking.addEventListener("url", handleDeepLink);

        await Font.loadAsync({
          Roboto_Thin: require("./assets/fonts/Roboto-Thin.ttf"),
          Roboto_Light: require("./assets/fonts/Roboto-Light.ttf"),
          Roboto_Regular: require("./assets/fonts/Roboto-Regular.ttf"),
          Roboto_Medium: require("./assets/fonts/Roboto-Medium.ttf"),
        });

        if (__DEV__) {
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

    return () => {
      Linking.removeEventListener("url");
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      unsubscribe();
    };
  }, []);

  function WelcomeStack() {
    return (
      <Stack.Navigator>
        {/* <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Welcome"
          children={() => <Welcome setUserName={setFinishRegisterProcess} />}
        /> */}
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
          name="FinishGoogleRegister"
          children={() => (
            <FinishGoogleRegister
              setFinishRegisterProcess={setFinishRegisterProcess}
            />
          )}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SignOut"
          component={SignOut}
        />
      </Stack.Navigator>
    );
  }

  if (loading) {
    return <View />;
  } else if (true) {
    if (finishRegisterProcess) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="FinishGoogleRegister"
              children={() => (
                <FinishGoogleRegister
                  setFinishRegisterProcess={setFinishRegisterProcess}
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
                    onPress={() => {
                      auth.signOut();
                    }}
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
      //! pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX
      //! pk_live_51KDXfNCVH1iPNeBrTGAw1ZFwnNCTNO3rJ23zBni3ohGDWO8zuby2xDw3dYiHabs2furS1EAgQKq3hdtR2PP2jPZr00JCFvS9h8
      return (
        <StripeProvider publishableKey="pk_live_51KDXfNCVH1iPNeBrTGAw1ZFwnNCTNO3rJ23zBni3ohGDWO8zuby2xDw3dYiHabs2furS1EAgQKq3hdtR2PP2jPZr00JCFvS9h8">
          <NavigationContainer linking={linking}>
            <Drawer.Navigator
              style={{ backgroundColor: "#82ff00" }}
              drawerContent={({ navigation }) => (
                <CustomDrawer navigation={navigation} />
              )}
            >
              <Drawer.Screen name="HomeStack" component={HomeStack} />
              <Drawer.Screen name="SettingsStack" component={SettingsStack} />
              <Drawer.Screen name="CartStack" component={CartStack} />
              <Drawer.Screen name="SellerStack" component={SellerStack} />
              <Drawer.Screen name="SearchStack" component={SearchStack} />
              <Drawer.Screen
                name="TransactionsStack"
                component={TransactionsStack}
              />
              <Drawer.Screen
                name="YourOffersStack"
                component={YourOffersStack}
              />
              <Drawer.Screen
                name="ReferralProgramStack"
                component={ReferralProgramStack}
              />
              <Drawer.Screen
                name="SavedOffersStack"
                component={SavedOffersStack}
              />
              <Drawer.Screen name="ChatStack" component={ChatStack} />
              <Drawer.Screen
                name="DeletingAccount"
                component={DeletingAccount}
              />
              <Drawer.Screen name="WelcomeStack" component={WelcomeStack} />
            </Drawer.Navigator>
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
            name="FinishGoogleRegister"
            children={() => (
              <FinishGoogleRegister
                setFinishRegisterProcess={setFinishRegisterProcess}
              />
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
