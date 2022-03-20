import React, { useState, useEffect } from "react";

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SectionList,
  FlatList,
  ScrollView,
} from "react-native";

import { useStripe } from "@stripe/stripe-react-native";
import { useNavigation } from "@react-navigation/native";

import { functions, auth, fetchName, fetchCart, db } from "../authContext";

import { ActivityIndicator, TextInput, RadioButton } from "react-native-paper";

import { LogBox } from "react-native";
import SummaryObject from "./../shared/Objects/SummaryObject";
import DHL_logo from "../assets/DHL_logo.png";
import FedExExpress_logo from "../assets/FedEx_Express_logo.png";
import FedEx_logo from "../assets/FedEx_logo.png";
import UPS_logo from "../assets/UPS_logo.png";
import USPS_logo from "../assets/USPS_logo.png";
import Stripe_logo from "../assets/Stripe_logo.png";
import bottom_arrow from "../assets/arrow_right_bottom.png";

import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";
import AddShippingMethod from "./subscreens/Seller/AddShippingMethod";

let transactionId = null;

export default function Checkout({ pageState, setPage, instantBuy }) {
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  ]);

  const [shippingMethod, setShippingMethod] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});

  const [avalibleShippingMethods, setAvalibleShippingMethods] = useState([]);
  const [addressesArray, setAddressesArray] = useState([]);

  const [offersState, setOffersState] = useState([]);

  const [noAvailableShippingMethods, setNoAvailableShippingMethods] =
    useState(false);

  const addEmptyObj = (array) => {
    if (array.length === 0) {
      return [{ empty: true }];
    } else if (array.length === 1) {
      return [...array, { empty: true }];
    } else return array;
  };

  useEffect(() => {
    const resolvePromise = async () => {
      setPage("loadingPage");

      if (instantBuy) {
        //take offer from props - navigation
      } else {
        await fetchCart(setOffersState, () => {});
      }

      // fetch id's of owners of cards in users cart
      const user = await db.collection("users").doc(auth.currentUser.uid).get();

      if (user.data().addresses.length > 0) {
        setAddressesArray(user.data().addresses);
      } else {
        setAddressesArray([]);
      }

      let shippingMethodsArray = [];

      const promise = new Promise((resolve, reject) => {
        user.data().cart.forEach(async (id, index) => {
          const offer = await db.collection("offers").doc(id).get();

          const owner = await db
            .collection("users")
            .doc(offer.data().owner)
            .get();

          // if (owner.data().sellerProfile.shippingMethods.domestic.length > 0) {
          //   shippingMethodsArray.push({
          //     title: owner.data().nick,
          //     uid: offer.data().owner,
          //     data: owner.data().sellerProfile.shippingMethods.domestic,
          //   });
          // }

          // if (
          //   owner.data().sellerProfile.shippingMethods.international.length > 0
          // ) {
          //   shippingMethodsArray.push({
          //     title: owner.data().nick,
          //     uid: offer.data().owner,
          //     data: owner.data().sellerProfile.shippingMethods.international,
          //   });
          // }

          shippingMethodsArray.push({
            title: owner.data().nick,
            uid: offer.data().owner,
            data: owner.data().sellerProfile.shippingMethods.international,
          });

          if (index === user.data().cart.length - 1) {
            resolve();
          }
        });
      });

      promise.then(() => {
        setAvalibleShippingMethods(shippingMethodsArray);
      });

      setPage("shippingPage");
    };
    resolvePromise();
  }, []);

  useEffect(() => {
    if (addressesArray) {
      setAddressesArray((prevState) => addEmptyObj(prevState));
    }
  }, [addressesArray]);

  useEffect(() => {
    if (shippingAddress) {
      setShippingMethod({});
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (avalibleShippingMethods) {
      const outputObj = {};

      avalibleShippingMethods.forEach((item) => {
        outputObj[item.uid] = false;
      });

      setNoAvailableShippingMethods(false);
      setShippingMethod(outputObj);
    } else {
      setNoAvailableShippingMethods(true);
    }
  }, [avalibleShippingMethods]);

  if (pageState === "shippingPage") {
    return (
      <ShippingPage
        setPage={setPage}
        setShippingAddress={setShippingAddress}
        shippingAddress={shippingAddress}
        setShippingMethod={setShippingMethod}
        shippingMethod={shippingMethod}
        addressesArray={addressesArray}
        avalibleShippingMethods={avalibleShippingMethods}
        noAvailableShippingMethods={noAvailableShippingMethods}
      />
    );
  } else if (pageState === "summaryPage") {
    return (
      <SummaryPage
        setPage={setPage}
        shippingAddress={shippingAddress}
        shippingMethod={shippingMethod}
        offersState={offersState}
      />
    );
  } else if (pageState === "endPage") {
    return <EndPage />;
  } else {
    return <LoadingPage />;
  }
}

const ShippingPage = ({
  setPage,
  setShippingAddress,
  shippingAddress,
  setShippingMethod,
  shippingMethod,
  addressesArray,
  avalibleShippingMethods,
  noAvailableShippingMethods,
}) => {
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [errorState, setError] = useState(false);

  const validateForm = () => {
    let error = false;
    setLoadingIndicator(true);

    //check if user selected shipping method
    for (const [key, value] of Object.entries(shippingMethod)) {
      if (value === false) {
        error = `Select shipping method for every vendor`;
      }
    }

    //check if user selected address
    if (!shippingAddress) {
      error = `Select shipping address`;
    }

    setLoadingIndicator(false);

    if (error) {
      setError(error);
    } else {
      setError(false);
      setPage("summaryPage");
    }
  };

  useEffect(() => {
    if (addressesArray.length === 2 && addressesArray[1].empty === true) {
      setShippingAddress(addressesArray[0]);
    }
  }, [addressesArray]);

  const navigation = useNavigation();

  return (
    <FlatList
      numColumns={2}
      data={addressesArray}
      style={{
        paddingLeft: "5%",
        paddingRight: "5%",
        backgroundColor: "#1b1b1b",

        flex: 1,
      }}
      renderItem={({ item, index }) => {
        if (item.empty) {
          return (
            <TouchableOpacity
              style={{
                width: "48%",
                marginRight: index === 0 || 2 || 4 ? "4%" : "0%",

                padding: 8,
                borderWidth: 2,
                borderRadius: 6,
                borderColor: "#5c5c5c",
                borderStyle: "dashed",
                justifyContent: "center",

                aspectRatio: addressesArray.length > 1 ? undefined : 1 / 1,
              }}
              onPress={() => {
                navigation.navigate("AddAddress");
              }}
            >
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 16,
                  alignSelf: "center",
                }}
              >
                Add
              </Text>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 16,
                  alignSelf: "center",
                }}
              >
                Address
              </Text>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            style={{
              width: "48%",
              marginRight: index === 0 || 2 || 4 ? "4%" : "0%",

              padding: 10,
              borderWidth:
                JSON.stringify(shippingAddress) === JSON.stringify(item)
                  ? 2.5
                  : 1.5,
              borderRadius: 6,
              borderColor:
                JSON.stringify(shippingAddress) === JSON.stringify(item)
                  ? "#0082ff"
                  : "#5c5c5c",
            }}
            onPress={() => {
              setShippingAddress(item);
            }}
          >
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {`${item.firstName} ${item.lastName}`}
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {item.streetAddress1}
            </Text>
            {item.streetAddress2 ? (
              <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
                {item.streetAddress2}
              </Text>
            ) : null}
            <Text
              style={{ color: "#f4f4f4", marginLeft: 6 }}
            >{`${item.city}, ${item.zipCode}`}</Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {item.country}
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6, marginTop: 8 }}>
              {item.phoneNumber}
            </Text>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={() => {
        return (
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 22,
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            Addresses
          </Text>
        );
      }}
      ListFooterComponent={() => {
        return (
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 22,
                color: "#f4f4f4",
                fontWeight: "700",

                marginTop: 26,
                marginBottom: 12,
              }}
            >
              Shipping Methods
            </Text>

            {noAvailableShippingMethods ? (
              <View>
                <Text>Seller doesn't provide</Text>
              </View>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 6,
                    marginLeft: 12,
                  }}
                >
                  <IconMCI name={"radar"} size={16} color={"#24FF00"} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#5c5c5c",
                    }}
                  >
                    {"  - Shipping method with parcel tracking"}
                  </Text>
                </View>
                <SectionList
                  style={{ width: "100%", flexGrow: 0 }}
                  sections={avalibleShippingMethods}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item, index, section }) => {
                    return (
                      <View
                        style={{
                          width: "100%",

                          marginTop: 6,
                          paddingHorizontal: 12,
                          paddingVertical: 8,

                          borderRadius: 3,
                          backgroundColor: "#121212",

                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {item.tracking ? (
                          <IconMCI name={"radar"} size={16} color={"#24FF00"} />
                        ) : null}
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#f4f4f4",
                            fontWeight: "700",
                          }}
                        >
                          {item.carrier}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#939393",
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#f4f4f4",
                          }}
                        >
                          {item.from} - {item.to} days
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#f4f4f4",
                            fontWeight: "700",
                          }}
                        >
                          {item.price} USD
                        </Text>
                        <RadioButton
                          value="first"
                          status={
                            JSON.stringify(shippingMethod[section.uid]) ===
                            JSON.stringify(item)
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => {
                            setShippingMethod((prevState) => ({
                              ...prevState,
                              [section.uid]: item,
                            }));
                          }}
                          uncheckedColor="#f4f4f4"
                          color="#0082ff"
                        />
                      </View>
                    );
                  }}
                  renderSectionHeader={({ section: { title } }) => (
                    <View>
                      <Text
                        style={{
                          color: "#7c7c7c",
                          fontSize: 12,
                          marginTop: 16,
                        }}
                      >
                        from{"  "}
                        <Text
                          style={{
                            color: "#bbbbbb",
                            fontSize: 17,
                            fontFamily: "Roboto_Medium",
                          }}
                        >
                          {title}
                        </Text>
                      </Text>
                    </View>
                  )}
                  ListEmptyComponent={() => {
                    return (
                      <View
                        style={{
                          felx: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 20,
                        }}
                      >
                        <ActivityIndicator
                          size="large"
                          color="#0082ff"
                          style={{ marginTop: 20 }}
                        />
                      </View>
                    );
                  }}
                />
              </View>
            )}

            <View
              style={{
                width: "90%",
                marginTop: 38,
                marginBottom: 22,

                alignItems: "center",
                flexDirection: "row-reverse",
              }}
            >
              <TouchableOpacity
                style={{
                  width: "30%",
                  alignItems: "center",

                  borderRadius: 4,
                  backgroundColor: "#0082ff",

                  paddingVertical: 6,
                  marginLeft: 22,
                }}
                onPress={() => {
                  validateForm();
                }}
              >
                <Text
                  style={{
                    color: "#121212",
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>

              {loadingIndicator ? (
                <ActivityIndicator size="small" color="#0082ff" />
              ) : null}
              {errorState && !loadingIndicator ? (
                <Text
                  style={{
                    color: "#b40424",
                    fontWeight: "700",
                    width: "63%",
                    textAlign: "left",
                  }}
                >
                  {errorState}
                </Text>
              ) : null}
            </View>
          </View>
        );
      }}
      ListEmptyComponent={
        <View
          style={{
            felx: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0082ff" />
        </View>
      }
    />
  );
};

const SummaryPage = ({
  setPage,
  shippingAddress,
  shippingMethod,
  offersState,
}) => {
  return (
    <View style={{ backgroundColor: "#1b1b1b", flex: 1 }}>
      <SectionList
        style={{ width: "100%" }}
        sections={offersState}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index, section }) => {
          if (section.data.length === index + 1) {
            return (
              <View style={{ alignItems: "flex-end" }}>
                <SummaryObject
                  props={item}
                  last={section.data.length === index + 1}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "95%",
                  }}
                >
                  <Image
                    style={{
                      aspectRatio: 1 / 1,
                      height: undefined,
                      width: 30,
                      marginBottom: 4,
                    }}
                    source={bottom_arrow}
                  />
                  <View
                    style={{
                      width: "84%",

                      marginTop: 10,
                      marginBottom: 12,

                      paddingHorizontal: 12,
                      paddingVertical: 8,

                      borderRadius: 3,
                      backgroundColor: "#121212",

                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",

                      marginRight: "5%",
                    }}
                  >
                    {shippingMethod[section.uid].tracking ? (
                      <IconMCI name={"radar"} size={16} color={"#24FF00"} />
                    ) : null}
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#f4f4f4",
                        fontWeight: "700",
                      }}
                    >
                      {shippingMethod[section.uid].carrier}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#939393",
                      }}
                    >
                      {shippingMethod[section.uid].name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#f4f4f4",
                      }}
                    >
                      {shippingMethod[section.uid].from} -{" "}
                      {shippingMethod[section.uid].to} days
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#f4f4f4",
                        fontWeight: "700",
                      }}
                    >
                      {shippingMethod[section.uid].price} USD
                    </Text>
                  </View>
                </View>
              </View>
            );
          }
          return <SummaryObject props={item} />;
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <Text
              style={{
                color: "#7c7c7c",
                fontSize: 12,
                marginTop: 10,
                marginLeft: 18,
              }}
            >
              from{"  "}
              <Text
                style={{
                  color: "#bbbbbb",
                  fontSize: 17,
                  fontFamily: "Roboto_Medium",
                }}
              >
                {title}
              </Text>
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ paddingVertical: 18, marginTop: 20 }}>
            <ActivityIndicator size={"small"} color={"#0082ff"} />
          </View>
        }
        ListHeaderComponent={getHeader}
        ListFooterComponent={getFooter(
          setPage,
          shippingMethod,
          shippingAddress,
          offersState
        )}
      />
    </View>
  );
};
const LoadingPage = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1b1b",
      }}
    >
      <ActivityIndicator size={"large"} color="#0082ff" />
    </View>
  );
};
const EndPage = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1b1b",
        paddingBottom: 20,
      }}
    >
      <IconMCI name={"flag-checkered"} color={"#0082ff"} size={220} />
      <Text
        style={{
          color: "#f4f4f4",
          fontWeight: "700",
          fontSize: 38,
          marginTop: 10,
        }}
      >
        Congratulations!
      </Text>
      <Text
        style={{
          color: "#5c5c5c",
          textAlign: "center",
          fontSize: 14,
          marginTop: 10,
          width: "90%",
        }}
      >
        The order has been successfully placed. The vendor has 48 hours to ship
        your cards. You can track your shipment in the Transactions Tab.
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "90%",
          backgroundColor: "#0082ff",
          paddingVertical: 8,
          marginLeft: "2%",
          marginTop: 80,
          marginBottom: 6,
          borderRadius: 4,
        }}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Transactions", screen: "TransactionDetails" }],
          });
        }}
      >
        <Text
          style={{
            color: "#121212",
            fontWeight: "700",
            fontSize: 17,
            marginRight: 8,
          }}
        >
          {"Go to Transactions"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getHeader = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text
          style={{
            fontWeight: "700",
            color: "#f4f4f4",
            fontSize: 40,
            marginTop: 20,

            marginBottom: 10,
          }}
        >
          Summary
        </Text>
        <Text
          style={{
            fontWeight: "600",
            color: "#939393",
            fontSize: 12,
            textAlign: "center",
            width: "80%",
            marginBottom: 20,
          }}
        >
          {"Take one last look at what you will pay for."}
        </Text>
      </View>
    </View>
  );
};
const getFooter = (setPage, shippingMethod, shippingAddress, offersState) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [totals, setTotals] = useState({
    cards: 0,
    shipping: 0,
    discount: 0,
    final: 0,
  });

  useEffect(() => {
    const resolvePromise = async () => {
      // const query = functions.httpsCallable("paymentSheet");
      // query()
      //   .then((result) => {
      //     initializePaymentSheet(result.data);
      //   })
      //   .catch((err) => console.log(err));
    };

    resolvePromise();
  }, []);

  useEffect(async () => {
    if (offersState) {
      let cards = 0;
      let discount = 0;
      let shipping = 0;

      offersState.forEach((object) => {
        object.data.forEach((offer) => {
          cards += offer.price;
        });
      });

      const doc = await db.collection("users").doc(auth.currentUser.uid).get();

      doc.data()?.discounts.referralProgram.forEach((item) => {
        // discount += 2;

        //? check if user already has made a purchase

        db.collection("users")
          .doc(item.uid)
          .get()
          .then((doc) => {
            if (
              doc.data()?.sellerProfile?.statistics?.purchases > 0 &&
              item.used === false
            ) {
              discount += 2;
            }
          });
      });

      for (const [key, value] of Object.entries(shippingMethod)) {
        shipping += value.price;
      }

      setTotals({
        cards: cards.toFixed(2),
        discount: discount.toFixed(2),
        shipping: shipping.toFixed(2),
        final: (cards + shipping - discount).toFixed(2),
      });
    }
  }, [offersState]);

  const initializePaymentSheet = async (data) => {
    const { paymentIntent, ephemeralKey, customer } = data;

    let merchantName = auth.currentUser.displayName;

    if (merchantName == null) {
      merchantName = await fetchName();
    }

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      googlePay: true,
      merchantDisplayName: merchantName,
    });
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      console.log("Success", "Your order is confirmed!");
      setPage("endPage");
      navigation.addListener("beforeRemove", (e) => {
        if (pageState === "endPage") {
          e.preventDefault();
        } else {
          return;
        }
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 12,
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginTop: 34,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            height: "100%",
          }}
        >
          <Text
            style={{
              color: "#565656",
              fontFamily: "Roboto_Medium",
              fontSize: 12,

              marginBottom: 8,
            }}
          >
            SHIPPING ADDRESS
          </Text>
          <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
            {`${shippingAddress.firstName} ${shippingAddress.lastName}`}
          </Text>
          <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
            {shippingAddress.streetAddress1}
          </Text>
          {shippingAddress.streetAddress2 ? (
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {shippingAddress.streetAddress2}
            </Text>
          ) : null}
          <Text
            style={{ color: "#f4f4f4", marginLeft: 6 }}
          >{`${shippingAddress.city}, ${shippingAddress.zipCode}`}</Text>
          <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
            {shippingAddress.country}
          </Text>
          <Text style={{ color: "#f4f4f4", marginLeft: 6, marginTop: 8 }}>
            {shippingAddress.phoneNumber}
          </Text>
        </View>
        <View
          style={{
            flex: 1.3,
            flexDirection: "column",
            height: "100%",
            marginLeft: 20,
          }}
        >
          <Text
            style={{
              marginLeft: 12,

              fontSize: 18,
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
            }}
          >
            Final Cost
          </Text>

          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          >
            <Text
              style={{
                color: "#565656",
                fontFamily: "Roboto_Medium",
                fontSize: 12,
                marginLeft: 18,
              }}
            >
              CARDS
            </Text>
            <Text
              style={{
                fontFamily: "Roboto_Medium",
                color: "#0bb31b",
                fontSize: 12,
                marginLeft: 8,
              }}
            >
              {`+ ${totals.cards} USD`}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
          >
            <Text
              style={{
                color: "#565656",
                fontFamily: "Roboto_Medium",
                fontSize: 12,
                marginLeft: 18,
              }}
            >
              SHIPPING
            </Text>
            <Text
              style={{
                fontFamily: "Roboto_Medium",
                color: "#0bb31b",
                fontSize: 12,
                marginLeft: 8,
              }}
            >
              {`+ ${totals.shipping} USD`}
            </Text>
          </View>

          {totals.discount > 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 3,
              }}
            >
              <Text
                style={{
                  color: "#565656",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                  marginLeft: 18,
                }}
              >
                DISCOUNT
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto_Medium",
                  color: "#D80000",
                  fontSize: 12,
                  marginLeft: 8,
                }}
              >
                {`- ${totals.discount} USD`}
              </Text>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 18,
            }}
          >
            <View
              style={{
                width: 20,
                height: 2,
                backgroundColor: "#f4f4f4",
                marginLeft: 12,
                borderRadius: 3,
              }}
            />
            <Text
              style={{
                fontWeight: "700",
                color: "#0dff25",
                fontSize: 18,
                marginLeft: 8,
              }}
            >
              {totals.final} <Text style={{ color: "#0dff25" }}>USD</Text>
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#0082ff",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            paddingVertical: 7,
            marginTop: 50,

            width: "90%",
          }}
          onPress={() => {
            // setPage("endPage");

            let outObj = {};

            offersState.forEach((item) => {
              outObj.seller = item.uid;
              outObj.offers = item.data;

              outObj.shipping = {
                method: shippingMethod[item.uid],
                address: shippingAddress,
              };
              outObj.paymentId = "paymentId -- null";
            });

            //! ONLY FOR DEMO PURPOSE || 1 SELLER ONLY
            const query = functions.httpsCallable("createTransaction");

            query(outObj)
              .then((result) => {
                console.log(result);
                // transactionId = result.data.id;
                // setPage("endPage");
              })
              .catch((err) => console.log(err));
          }}
        >
          <Text style={{ fontWeight: "700", color: "#121212", fontSize: 18 }}>
            Purchase
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Text style={{ fontFamily: "Roboto_Medium", color: "#555555" }}>
            Powered by{"  "}
          </Text>
          <Image
            source={Stripe_logo}
            style={{ aspectRatio: 282 / 117, width: undefined, height: 20 }}
          />
        </View>
      </View>
    </View>
  );
};

// setAvalibleShippingMethods((prevState) => [
//   ...prevState,
//   {
//     title: "Nick",
//     uid: offer.data().owner,
//     data: [
//       {
//         range: "Domestic",
//         tracking: false,
//         carrier: "FedEx",
//         name: "First Class",
//         from: 2,
//         to: 3,
//         price: 5.99,
//       },
//       {
//         range: "Domestic",
//         tracking: true,
//         carrier: "USPS",
//         name: "First Class",
//         from: 2,
//         to: 3,
//         price: 5.99,
//       },
//     ],
//   },
// ]);

// const doc = await db.collection("users").doc(auth.currentUser.uid).get();
// if (doc.data().shippingAddresses) {
//   setAddressesArray(doc.data().shippingAddresses);
// }

// setAvalibleShippingMethods([
//   {
//     title: "Rig",
//     uid: "fjk8iEmFHohqau0Pp0JCvAQBNuH2",
//     data: [
//       {
//         range: "Domestic",
//         tracking: false,
//         carrier: "FedEx",
//         name: "First Class",
//         from: 2,
//         to: 3,
//         price: 5.99,
//       },
//       {
//         range: "Domestic",
//         tracking: true,
//         carrier: "USPS",
//         name: "First Class",
//         from: 2,
//         to: 3,
//         price: 5.99,
//       },
//     ],
//   },
//   {
//     title: "Tommy",
//     uid: "1wHQ7P6haMb0lGXqYGH8kjhIfcv1",
//     data: [
//       {
//         range: "Domestic",
//         tracking: true,
//         carrier: "DHL",
//         name: "First Class",
//         from: 2,
//         to: 3,
//         price: 5.99,
//       },
//       {
//         range: "Domestic",
//         tracking: false,
//         carrier: "UPS",
//         name: "First Class",
//         from: 2,
//         to: 3,
//         price: 5.99,
//       },
//     ],
//   },
// ]);

// setAddressesArray([
//   {
//     firstName: "Adam",
//     lastName: "Szymański",
//     zipCode: "92-446",
//     country: "Poland",
//     state: "Łódzkie",
//     city: "Łódź",
//     streetAddress1: "Wacława Wojewódzkiego 1 m2",
//     streetAddress2: "",
//     phoneNumber: "+48 606417902",
//   },
// ]);

{
  /* <View
          style={{
            flex: 1.3,
            flexDirection: "column",
            height: "100%",
          }}
        >
        <View
          style={{
            flex: 1.3,
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Text
            style={{
              color: "#565656",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
              marginLeft: 12,
              marginBottom: 8,
            }}
          >
            CARRIER
          </Text>

          {shippingServiceProvider == "DHL" ? (
            <Image
              source={DHL_logo}
              style={{
                aspectRatio: 675 / 260,
                height: 50,
                width: undefined,
                marginLeft: 18,
              }}
            />
          ) : null}
          {shippingServiceProvider == "FedExExpress" ? (
            <Image
              source={FedExExpress_logo}
              style={{
                aspectRatio: 5000 / 2281,
                height: 50,
                width: undefined,
                marginLeft: 20,
              }}
            />
          ) : null}
          {shippingServiceProvider == "FedEx" ? (
            <Image
              source={FedEx_logo}
              style={{
                aspectRatio: 5000 / 1400,
                height: 40,
                width: undefined,
                marginLeft: 18,
              }}
            />
          ) : null}
          {shippingServiceProvider == "USPS" ? (
            <Image
              source={USPS_logo}
              style={{
                aspectRatio: 736 / 168,
                height: 34,
                width: undefined,
                marginLeft: 18,
              }}
            />
          ) : null}
          {shippingServiceProvider == "UPS" ? (
            <Image
              source={UPS_logo}
              style={{
                aspectRatio: 478 / 570,
                height: 50,
                width: undefined,
                marginLeft: 18,
              }}
            />
          ) : null}
          <Text
            style={{
              fontSize: 12,
              color: "#B6B6B6",
              marginLeft: 18,
              marginTop: 8,
            }}
          >
            Est. delivery: Feb 2 -- Feb 21
          </Text>
          <Text
            style={{
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
              marginLeft: 18,
              marginTop: 10,
            }}
          >
            Total Shipping Cost{"  "}
            <Text
              style={{
                fontSize: 14,
                color: "#0082ff",
                fontWeight: "700",
                fontFamily: "Roboto_Regular",
              }}
            >
              {`${totals.shipping} USD`}
            </Text>
          </Text>
        </View>
      </View> */
}
