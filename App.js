// @refresh reset
// "@react-native-google-signin/google-signin": "^7.0.1",
// "expo-google-app-auth": "~8.3.0",
// import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-gesture-handler";

import React, { useState, useEffect, useRef } from "react";
import * as Updates from "expo-updates";

import {
  Link,
  NavigationContainer,
  CommonActions,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator, useNavigation } from "@react-navigation/stack";

import {
  Text,
  View,
  Image,
  LogBox,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  AsyncStorage,
} from "react-native";

import { StripeProvider } from "@stripe/stripe-react-native";

import { OverlayProvider, Chat } from "stream-chat-expo";

import Buy from "./screens/Buy";
import Cart from "./screens/Cart";
import Home from "./screens/Home.js";
import Thanks from "./screens/Thanks";
import Search from "./screens/Search";
import Login from "./screens/Login.js";
import SignOut from "./screens/SignOut";
import Checkout from "./screens/Checkout";
import AddCard from "./screens/AddCard.js";
// import Welcome from "./screens/Welcome.js";
import EditCard from "./screens/EditCard.js";
import Settings from "./screens/Settings.js";
import Register from "./screens/Register.js";
import YourOffers from "./screens/YourOffers.js";
import Transactions from "./screens/Transactions";
import ImageBrowser from "./screens/ImageBrowser";
import SavedOffers from "./screens/SavedOffers.js";
import SellerProfile from "./screens/SellerProfile";
import Rating from "./screens/subscreens/Seller/Rating";
import DeletingAccount from "./screens/DeletingAccount";
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

import { StreamChat } from "stream-chat";
import ChannelScreen from "./screens/Chat/ChannelScreen";
import ChannelListScreen from "./screens/Chat/ChannelListScreen";
import useChatClient from "./screens/Chat/useChatClient";

//!import SearchForSeller from "./screens/SearchForSeller";

import { db, auth, functions } from "./authContext.js";
import messaging from "@react-native-firebase/messaging";

import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import * as Font from "expo-font";
import * as Sentry from "sentry-expo";

import * as Linking from "expo-linking";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import * as Permissions from "expo-permissions";

import clipboard_text_clock from "./assets/clipboard_text_clock.png";
import opened_box from "./assets/opened_box.png";

import notifee, { EventType, AndroidImportance } from "@notifee/react-native";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const prefix = Linking.makeUrl("/");
const chatApiKey = "nfnwsdq54g3b";

// const navigationContainerRef = React.createRef();

if (!__DEV__) {
  Sentry.init({
    dsn: "https://6131440690cd436b8802bd5b1318e1a6@o1133377.ingest.sentry.io/6179878",
    enableInExpoDevelopment: true,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  });
  console.log("Sentry initialized");
}

const ignoreWarns = [
  "Setting a timer for a long period of time",
  "AsyncStorage has been extracted from react-native",
  "Non-serializable values were found in the navigation state.",
  "VirtualizedLists should never be nested inside plain ScrollViews",
  "You are overriding the original host.",
];

LogBox.ignoreLogs(ignoreWarns);
LogBox.ignoreAllLogs(true);

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
            if (checkoutPageState != "endPage") {
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
                      navigation.navigate("CartStack", { screen: "Cart" });

                      // navigation.reset({
                      //   index: 0,
                      //   routes: [{ name: "Cart" }],
                      // });
                      // navigation.dispatch(
                      // CommonActions.reset({
                      //   index: 0,
                      //   routes: [{ name: "Cart" }],
                      // })
                      // );
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
                    {checkoutPageState === "summaryPage" ? "Go Back" : "Cancel"}
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
function WelcomeStack() {
  return (
    <Stack.Navigator>
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

// notifee.onBackgroundEvent(async ({ detail, type }) => {
//   if (type == 3) {
// user press on notification detected while app was on background on Android
// const channel = detail.notification?.data;
// console.log("channelId", detail.notification?.data);

// await navigationContainerRef.current?.navigate("ChatStack", {
//   screen: "ChannelScreen",
//   params: channel,
// });

//     await Promise.resolve();
//   }
// });

export default function App() {
  const [loading, setLoading] = useState(true);
  const [finishRegisterProcess, setFinishRegisterProcess] = useState(null);

  const chatClient = StreamChat.getInstance(chatApiKey);
  const [clientIsReady, setClientIsReady] = useState(false);

  // const handleDeepLink = async (event) => {
  //   let data = Linking.parse(event.url);
  // setDeepLinkData(data);
  // };

  const linking = {
    prefixes: [Linking.createURL("/"), "https://tcmarket.place"],
    config: {
      screens: {
        YourOffers: "yourOffers",
        Home: "home",
      },
    },
  };
  const theme = {
    messageList: {
      container: { backgroundColor: "#1b1b1b" },
      listContainer: { backgroundColor: "#1b1b1b" },
    },
    channelListSkeleton: {
      background: {
        color: "#1b1b1b",
      },
      container: {
        backgroundColor: "#1b1b1b",
      },
    },
    channelList: {
      container: {
        backgroundColor: "#1b1b1b",
      },
    },
    channelPreview: {
      container: {
        backgroundColor: "#1b1b1b",
      },
      title: {
        color: "#f4f4f4",
      },
    },
    channelListMessenger: {
      flatListContent: {
        backgroundColor: "#1b1b1b",
      },
    },
    loadingErrorIndicator: {
      container: {
        backgroundColor: "#1b1b1b",
      },
      errorText: {
        color: "red",
      },
      retryText: {
        color: "red",
      },
    },
    listItem: {
      backgroundColor: "#1b1b1b",
    },
    emptyStateIndicator: {
      channelContainer: {
        backgroundColor: "#1b1b1b",
        color: "#f4f4f4",
      },
      channelTitle: {
        color: "#f4f4f4",
      },
    },
    messageInput: {
      container: {
        backgroundColor: "#121212",
        color: "#f4f4f4",
      },
      inputBoxContainer: {
        backgroundColor: "#121212",
        color: "#f4f4f4",
      },
      autoCompleteInputContainer: {
        color: "#f4f4f4",
      },
      inputBox: {
        color: "#f4f4f4",
      },
    },
  };

  useEffect(() => {
    let unsubscribeTokenRefreshListener;

    const notificationUnsubscribe = messaging().onMessage(
      async (remoteMessage) => {
        try {
          let channelId;
          // if (remoteMessage.data.channelId == "vendor-notifications") {
          // }
          channelId = await notifee.createChannel({
            id: "vendor-notifications",
            name: "Vendor Notifications",
          });

          try {
            await notifee.displayNotification({
              title: remoteMessage.notification.title,
              body: remoteMessage.notification.body,
              android: {
                channelId,
                smallIcon: "notification_icon",
                color: "#0082ff",
              },
            });
          } catch (e) {
            console.log(e);
          }

          // android: {
          //   largeIcon: remoteMessage.notification.android.imageUrl;
          // }
        } catch (e) {
          console.log(e);
        }
      }
    );

    const registerPushToken = async () => {
      const token = await messaging().getToken({
        vapidKey:
          "BBGS4skwQmR3XTpi98N79O10BE1Xc1Z7h2JFVltSut-4Dy9w2XXf2uhQgzzcZoHXg69EsQoF8sskFGeJD2IsIWk",
      });

      const push_provider = "firebase";
      const push_provider_name = "TCM";

      // name an alias for your push provider (optional)
      // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle

      chatClient.setLocalDevice({
        id: token,
        push_provider,
        push_provider_name,
      });

      await AsyncStorage.setItem("@current_push_token", token);
      await AsyncStorage.setItem("@current_user_id", auth.currentUser.uid);

      const removeOldToken = async () => {
        const oldToken = await AsyncStorage.getItem("@current_push_token");
        if (oldToken !== null) {
          await chatClient.removeDevice(oldToken);
        }
      };

      unsubscribeTokenRefreshListener = messaging().onTokenRefresh(
        async (newToken) => {
          await Promise.all([
            removeOldToken(),
            chatClient.addDevice(
              newToken,
              push_provider,
              auth.currentUser.uid,
              push_provider_name
            ),
            AsyncStorage.setItem("@current_push_token", newToken),
          ]);
        }
      );

      return token;
    };
    const resolvePromises = async () => {
      try {
        // Linking.addEventListener("url", handleDeepLink);
        Linking.addEventListener("url", () => {});

        await Font.loadAsync({
          Roboto_Thin: require("./assets/fonts/Roboto-Thin.ttf"),
          Roboto_Light: require("./assets/fonts/Roboto-Light.ttf"),
          Roboto_Regular: require("./assets/fonts/Roboto-Regular.ttf"),
          Roboto_Medium: require("./assets/fonts/Roboto-Medium.ttf"),
        });

        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Updates.reloadAsync();
        }
      } catch (e) {
        console.log(e);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const usersDoc = await db
          .collection("users")
          .doc(auth.currentUser.uid)
          .get();

        const userObject = {
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName,
        };

        if (usersDoc.exists) {
          const enabled = await messaging().hasPermission();

          if (!enabled) {
            console.log("not enabled");
            await messaging().requestPermission();
            console.log(await messaging().hasPermission());
          } else {
            console.log("enabled");
          }

          const token = await registerPushToken();

          if (!chatClient.userID && usersDoc.data().chatToken) {
            await chatClient.connectUser(userObject, usersDoc.data().chatToken);
          } else if (!chatClient.userID) {
            const query = functions.httpsCallable("createChatToken");

            await query()
              .then(async (result) => {
                try {
                  await chatClient.connectUser(userObject, result.data);
                } catch (e) {
                  console.log(e);
                }
              })
              .catch((err) => console.log(err));
          }

          if (
            !usersDoc.data().notificationToken ||
            usersDoc.data().notificationToken != token
          ) {
            db.collection("users").doc(auth.currentUser.uid).update({
              notificationToken: token,
            });
          }
          setClientIsReady(true);
          setFinishRegisterProcess(false);
        } else {
          setFinishRegisterProcess(true);
        }
      } else {
        await chatClient?.disconnectUser();
      }

      setLoading(false);
    });

    resolvePromises();

    return async () => {
      Linking.removeEventListener("url");

      await chatClient?.disconnectUser();
      unsubscribe();
      unsubscribeTokenRefreshListener?.();
      notificationUnsubscribe();
    };
  }, [, finishRegisterProcess]);

  function ChatStack() {
    // const [channel, setChannel] = useState();
    // const [thread, setThread] = useState();

    if (!clientIsReady) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="Loading..."
            children={() => (
              <View
                style={{
                  backgroundColor: "#1b1b1b",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={"large"} color={"#0082ff"} />
              </View>
            )}
            options={{
              headerTitle: () => <CustomHeader version={"messages"} />,
              headerStyle: {
                backgroundColor: "#121212",
              },
            }}
          />
        </Stack.Navigator>
      );
    }

    return (
      <Chat client={chatClient}>
        <Stack.Navigator>
          <Stack.Screen
            name="ChannelListScreen"
            children={() => <ChannelListScreen chatClient={chatClient} />}
            options={{
              headerTitle: () => <CustomHeader version={"messages"} />,
              headerStyle: {
                backgroundColor: "#121212",
              },
            }}
          />
          <Stack.Screen
            name="ChannelScreen"
            component={ChannelScreen}
            options={({ navigation, route }) => ({
              headerShown: false,
            })}
          />
        </Stack.Navigator>
      </Chat>
    );
  }

  if (loading) {
    return <View />;
  } else {
    if (finishRegisterProcess) {
      return (
        <StripeProvider publishableKey="pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX">
          <OverlayProvider value={{ style: theme }}>
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
                          setFinishRegisterProcess(false);
                        }}
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
          </OverlayProvider>
        </StripeProvider>
      );
    } else {
      //! pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX
      //! pk_live_51KDXfNCVH1iPNeBrTGAw1ZFwnNCTNO3rJ23zBni3ohGDWO8zuby2xDw3dYiHabs2furS1EAgQKq3hdtR2PP2jPZr00JCFvS9h8
      return (
        <StripeProvider publishableKey="pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX">
          <OverlayProvider value={{ style: theme }}>
            <NavigationContainer linking={linking}>
              <Drawer.Navigator
                style={{ backgroundColor: "#82ff00" }}
                drawerContent={({ navigation }) => (
                  <CustomDrawer navigation={navigation} />
                )}
              >
                <Drawer.Screen
                  name="TransactionsStack"
                  component={TransactionsStack}
                />
                <Drawer.Screen name="HomeStack" component={HomeStack} />
                <Drawer.Screen name="ChatStack" component={ChatStack} />
                <Drawer.Screen name="SettingsStack" component={SettingsStack} />
                <Drawer.Screen name="CartStack" component={CartStack} />
                <Drawer.Screen name="SellerStack" component={SellerStack} />
                <Drawer.Screen name="SearchStack" component={SearchStack} />

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
                <Drawer.Screen
                  name="DeletingAccount"
                  component={DeletingAccount}
                />
                <Drawer.Screen name="WelcomeStack" component={WelcomeStack} />
              </Drawer.Navigator>
            </NavigationContainer>
          </OverlayProvider>
        </StripeProvider>
      );
    }
  }
}

// else {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           options={{
//             headerShown: false,
//           }}
//           name="Welcome"
//           children={() => <Welcome setUserName={setFinishRegisterProcess} />}
//         />
//         <Stack.Screen
//           options={({ navigation, route }) => ({
//             headerLeft: () => (
//               <TouchableOpacity
//                 style={{
//                   borderRadius: 3,
//                   marginLeft: 22,

//                   height: 30,
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderWidth: 2,
//                   borderColor: "#777777",
//                   paddingHorizontal: 12,
//                 }}
//                 onPress={() => navigation.navigate("Welcome")}
//               >
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "700",
//                     color: "#777777",
//                   }}
//                 >
//                   {"Go back"}
//                 </Text>
//               </TouchableOpacity>
//             ),
//             headerTintColor: "#121212",
//             headerTitle: "",
//             headerStyle: {
//               backgroundColor: "#121212",
//             },
//           })}
//           name="Register"
//           component={Register}
//         />
//         <Stack.Screen
//           options={({ navigation, route }) => ({
//             headerLeft: () => (
//               <TouchableOpacity
//                 style={{
//                   borderRadius: 3,
//                   marginLeft: 22,

//                   height: 30,
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderWidth: 2,
//                   borderColor: "#777777",
//                   paddingHorizontal: 12,
//                 }}
//                 onPress={() => navigation.navigate("Welcome")}
//               >
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "700",
//                     color: "#777777",
//                   }}
//                 >
//                   {"Go back"}
//                 </Text>
//               </TouchableOpacity>
//             ),
//             headerTintColor: "#121212",
//             headerTitle: "",
//             headerStyle: {
//               backgroundColor: "#121212",
//             },
//           })}
//           name="Login"
//           component={Login}
//         />
//         <Stack.Screen
//           options={({ navigation, route }) => ({
//             headerLeft: () => (
//               <TouchableOpacity
//                 style={{
//                   borderRadius: 3,
//                   marginLeft: 22,

//                   height: 30,
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderWidth: 2,
//                   borderColor: "#777777",
//                   paddingHorizontal: 12,
//                 }}
//                 onPress={() => auth.signOut()}
//               >
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "700",
//                     color: "#777777",
//                   }}
//                 >
//                   {"Go back"}
//                 </Text>
//               </TouchableOpacity>
//             ),
//             headerTintColor: "#121212",
//             headerTitle: "",
//             headerStyle: {
//               backgroundColor: "#121212",
//             },
//           })}
//           name="FinishGoogleRegister"
//           children={() => (
//             <FinishGoogleRegister
//               setFinishRegisterProcess={setFinishRegisterProcess}
//             />
//           )}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
