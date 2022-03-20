import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
  SafeAreaView,
} from "react-native";

import Stripe_logo from "../assets/Stripe_logo.png";

import IconI from "react-native-vector-icons/Ionicons";
import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import cart_white_down_icon from "./../assets/cart_white_down.png";
import cart_white_up_icon from "./../assets/cart_white_up.png";

import { useNavigation } from "@react-navigation/native";
import { db, auth, functions } from "../authContext";

import clipboard_text_clock from "./../assets/clipboard_text_clock.png";

import { useIsFocused } from "@react-navigation/native";

export default function SellerProfile() {
  const navigation = useNavigation();

  const [loadingState, setLoadingState] = useState(true);
  const [vendorId, setVendorId] = useState(undefined);

  const [accountData, setAccountData] = useState(null);
  const [userData, setUserData] = useState(null);

  const [rating, setRating] = useState([]);
  const [shippingMethods, setShippingMethods] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const [noStripe, setNoStripe] = useState(false);
  const [pending, setPending] = useState(false);
  const [requirements, setRequirements] = useState(false);

  const isFocused = useIsFocused();

  const renderShippingMethods = () => {
    if (shippingMethods?.domestic?.length > 0) {
      return true;
    } else if (shippingMethods?.international?.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(async () => {
    if (!isFocused) {
      setLoadingState(true);
      setShippingMethods(null);
    }
    if (isFocused) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .onSnapshot((doc) => {
          setUserData(doc.data());

          setRating(doc.data().sellerProfile.rating);
          setStatistics(doc.data().sellerProfile.statistics);
          setShippingMethods(doc.data().sellerProfile.shippingMethods);

          const requirementsCheck = (props) => {
            if (props.requirements !== undefined) {
              if (props.requirements.currently_due.length > 0) {
                setRequirements(true);
                return true;
              }
            }

            // else if (props.verification.status === "pending") {
            //   setPending(true);
            //   return true;
            // }
            return false;
          };

          if (doc.data().stripe.vendorId === null || undefined) {
            setNoStripe(true);
          } else {
            const query = functions.httpsCallable("fetchStripeAccount");

            query()
              .then((result) => {
                if (!requirementsCheck(result.data)) {
                  setAccountData(result.data);
                }
              })
              .catch((e) => {
                console.log(e);
                setNoStripe(true);
              });
          }

          setLoadingState(false);
        });
    }
  }, [isFocused]);

  if (loadingState) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1b1b1b",
        }}
      >
        <ActivityIndicator size="large" color="#0082ff" />
      </View>
    );
  } else {
    if (noStripe || requirements) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#1b1b1b",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconMCI
            name="shield-check"
            color={"#0082ff"}
            size={58}
            style={{ marginBottom: 12, marginTop: 20 }}
          />
          <Text
            style={{
              color: "#f4f4f4",
              fontSize: 38,
              fontWeight: "700",
              marginBottom: 12,
              paddingHorizontal: 20,
              textAlign: "center",
            }}
          >
            Let us know you!
          </Text>
          <Text
            style={{
              fontSize: 15,
              width: "80%",
              color: "#4f4f4f",
              marginBottom: 60,
              textAlign: "center",
            }}
          >
            Before we allow you to post your offer, we need to verify your
            identity for safety reasons. Therefore, you must create Stripe
            account. It's really easy and don't take more then 5 minutes to set
            up.
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
              marginTop: 10,
              marginBottom: 6,
              borderRadius: 4,
            }}
            onPress={() => {
              let query;

              if (userData.stripe.vendorId === null || undefined) {
                query = functions.httpsCallable("createStripeAccount");
              } else {
                query = functions.httpsCallable("linkStripeAccount");
              }

              query()
                .then((result) => {
                  // console.error(result);
                  // Linking.openURL(result.data);
                })
                .catch((err) => console.log(err));
            }}
          >
            <Text
              style={{
                color: "#121212",
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              {"Add Vendor Details"}
            </Text>
          </TouchableOpacity>
          {pending ? (
            <View
              style={{
                flexDirection: "row",
                marginTop: 40,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto_Medium",
                  color: "#f4f4f4",
                  marginRight: 12,
                }}
              >
                The request is verified
              </Text>
              <ActivityIndicator size={"large"} color={"#0082ff"} />
            </View>
          ) : (
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <Text style={{ fontFamily: "Roboto_Medium", color: "#555555" }}>
                Powered by{"  "}
              </Text>
              <Image
                source={Stripe_logo}
                style={{
                  aspectRatio: 282 / 117,
                  width: undefined,
                  height: 20,
                }}
              />
            </View>
          )}
        </View>
      );
    } else {
      return (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#1b1b1b",
            paddingLeft: 12,
            paddingVertical: 16,
          }}
        >
          <View
            style={{
              width: "96%",

              paddingVertical: 14,

              backgroundColor: "#121212",
              borderRadius: 6,

              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ width: "50%", paddingLeft: 12 }}>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                }}
              >
                BALANCE
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 12,

                  fontSize: 22,
                  color: "#f4f4f4",
                  fontWeight: "700",
                }}
              >
                {accountData
                  ? parseFloat(accountData.balance.available[0].amount / 100)
                  : 0}{" "}
                USD
              </Text>
              <TouchableOpacity
                style={{
                  alignItems: "center",

                  marginTop: 10,
                  marginLeft: 12,
                  paddingVertical: 5,
                  width: "60%",

                  borderRadius: 4,
                  backgroundColor: "#0082ff",
                }}
              >
                <Text style={{ color: "#121212", fontWeight: "700" }}>
                  Withdraw
                </Text>
              </TouchableOpacity>
              {/* <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                  marginTop: 24,
                  marginBottom: 10,
                }}
              >
                RECIPIENT'S DETAILS
              </Text>
              {accountData ? (
                <View>
                  <Text
                    style={{
                      marginLeft: 12,

                      fontSize: 12,
                      color: "#f4f4f4",
                    }}
                  >
                    {accountData ? accountData.individual.first_name : ""}{" "}
                    {accountData ? accountData.individual.last_name : ""}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      marginLeft: 12,

                      fontSize: 12,
                      color: "#f4f4f4",
                    }}
                  >
                    {accountData ? accountData.individual.address.city : ""},{" "}
                    {accountData ? accountData.individual.address.line1 : ""}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      marginLeft: 12,
                      display: accountData?.individual?.address.line2
                        ? "flex"
                        : "none",

                      fontSize: 12,
                      color: "#f4f4f4",
                    }}
                  >
                    {accountData ? accountData.individual.address.line2 : ""}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      marginLeft: 12,

                      fontSize: 12,
                      color: "#f4f4f4",
                    }}
                  >
                    {accountData
                      ? accountData.individual.address.postal_code
                      : ""}
                  </Text>
                  <Text
                    style={{
                      marginTop: 10,
                      marginLeft: 12,

                      fontSize: 12,
                      color: "#f4f4f4",
                    }}
                  >
                    {accountData ? accountData.individual.phone : ""}
                  </Text>
                </View>
              ) : (
                <View style={{ height: 60 }}>
                  <ActivityIndicator size="large" color="#0082ff" />
                </View>
              )} */}
            </View>
            <View style={{ width: "50%" }}>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                HISTORY
              </Text>
              <FlatList
                data={accountData ? accountData.transactions : null}
                renderItem={({ item }) => {
                  if (item == "empty") {
                    return null;
                  }
                  function timeConverter(unix_timestamp) {
                    const a = new Date(unix_timestamp * 1000);
                    const months = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];

                    const time = {
                      year: a.getFullYear(),
                      month: months[a.getMonth()],
                      date: a.getDate(),
                      hour: a.getHours(),
                      min: a.getMinutes(),
                      sec: a.getSeconds(),
                    };

                    return time;
                  }
                  item.created = timeConverter(item.created);
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        paddingVertical: 3,
                        alignItems: "center",
                        justifyContent: "space-between",

                        paddingRight: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 3,
                          height: 20,

                          borderRadius: 3,

                          backgroundColor:
                            item.amount > 0 ? "#04BC00" : "#E50000",
                        }}
                      />
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 12,
                        }}
                      >
                        {item.amount > 0 ? "+" : "-"}{" "}
                        {item.amount > 0
                          ? item.amount / 100
                          : Math.abs(item.amount / 100)}{" "}
                        USD
                      </Text>
                      <Text
                        style={{
                          color: item.amount > 0 ? "#04BC00" : "#E50000",
                          fontSize: 14,
                          fontWeight: "700",
                        }}
                      >
                        {item.amount > 0 ? "SALE" : "PAYOUT"}
                      </Text>
                      <Text
                        style={{
                          color: "#939393",
                          fontSize: 12,
                        }}
                      >
                        {item.created.date} {item.created.month}
                      </Text>
                    </View>
                  );
                }}
                ListFooterComponent={() => {
                  if (accountData?.transactions) {
                    if (accountData?.transactions.length > 0) {
                      return (
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 8,
                          }}
                          onPress={() =>
                            navigation.navigate("History", {
                              data: { accountData },
                            })
                          }
                        >
                          <Text
                            style={{
                              fontFamily: "Roboto_Medium",
                              fontSize: 14,
                              color: "#0082ff",
                            }}
                          >
                            Details
                          </Text>
                          <IconMI
                            name="arrow-right-alt"
                            size={24}
                            color="#0082ff"
                            style={{ marginLeft: 4 }}
                          />
                        </TouchableOpacity>
                      );
                    }
                  }

                  if (accountData) {
                    return (
                      <View style={{ marginLeft: 12 }}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            source={clipboard_text_clock}
                            style={{
                              aspectRatio: 42 / 46,
                              height: undefined,
                              width: 28,

                              marginRight: 16,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 15,
                              color: "#f4f4f4",
                              fontWeight: "700",
                            }}
                          >
                            Track your funds
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#5c5c5c",
                            paddingTop: 8,
                            paddingRight: 7,
                          }}
                        >
                          - Make payout or sell your card to see any actions in
                          History tab
                        </Text>
                      </View>
                    );
                  }
                  return null;
                }}
                ListEmptyComponent={() => {
                  if (!accountData) {
                    return (
                      <View
                        style={{
                          width: "100%",
                          height: 40,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ActivityIndicator size="large" color="#0082ff" />
                      </View>
                    );
                  }
                  return null;
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 38,
            }}
          >
            <Text
              style={{
                color: "#f4f4f4",
                fontWeight: "700",
                fontSize: 24,
                marginRight: 12,
              }}
            >
              Shipping
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#0082ff",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 14,
                paddingVertical: 4,

                borderRadius: 3,
              }}
              onPress={() => navigation.navigate("AddShippingMethod")}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: "#121212",
                }}
              >
                Add New
              </Text>
            </TouchableOpacity>
          </View>
          {renderShippingMethods() ? (
            <View>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontSize: 12,
                  fontFamily: "Roboto_Medium",
                  marginTop: 20,
                  marginLeft: 12,
                }}
              >
                DOMESTIC
              </Text>
              <FlatList
                data={shippingMethods.domestic}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        width: "90%",

                        marginTop: 6,
                        marginLeft: 12,
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
                        {item.price.toFixed(2)} USD
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("EditShippingMethod", {
                            shippingMethod: shippingMethods.domestic[index],
                            shippingRange: "domestic",
                          });
                        }}
                      >
                        <IconMI name={"edit"} color={"#0082ff"} size={17} />
                      </TouchableOpacity>
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <View
                    style={{
                      width: "90%",
                      marginTop: 12,
                      marginLeft: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333", fontWeight: "700" }}>
                      - INTERNATIONAL SHIPPING ONLY AVAILABLE -
                    </Text>
                  </View>
                }
                keyExtractor={(item, index) => index.toString()}
              />
              <Text
                style={{
                  color: "#5c5c5c",
                  fontSize: 12,
                  fontFamily: "Roboto_Medium",
                  marginTop: 20,
                  marginLeft: 12,
                }}
              >
                INTERNATIONAL
              </Text>
              <FlatList
                data={shippingMethods?.international}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        width: "90%",

                        marginTop: 6,
                        marginLeft: 12,
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
                        {item.price.toFixed(2)} USD
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("EditShippingMethod", {
                            shippingMethod:
                              shippingMethods.international[index],
                            shippingRange: "international",
                          });
                        }}
                      >
                        <IconMI name={"edit"} color={"#0082ff"} size={17} />
                      </TouchableOpacity>
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <View
                    style={{
                      width: "90%",
                      marginTop: 12,
                      marginLeft: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333", fontWeight: "700" }}>
                      - DOMESTIC SHIPPING ONLY AVAILABLE -
                    </Text>
                  </View>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginTop: 20,
                width: "90%",
              }}
            >
              <IconI name={"warning"} color={"yellow"} size={50} />
              <View style={{ marginLeft: 12 }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#888" }}
                >
                  No shipping methods available
                </Text>
                <Text style={{ fontSize: 12, color: "#888", marginRight: 28 }}>
                  Any buyer cannot purchase your products without shipping
                  method. Required immediate modification.
                </Text>
              </View>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 38,
            }}
          >
            <Text
              style={{
                color: "#f4f4f4",
                fontWeight: "700",
                fontSize: 24,
                marginRight: 12,
              }}
            >
              Rating
            </Text>

            {rating?.lenght > 1 ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "#0082ff",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 14,
                  paddingVertical: 4,

                  borderRadius: 3,
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: "#121212",
                  }}
                >
                  See all
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {rating?.lenght > 1 ? (
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",

                  marginTop: 20,
                  marginLeft: 12,
                }}
              >
                AVERAGE FROM {rating?.lenght} BUYERS
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",

                  marginLeft: 12,
                  marginTop: 8,
                }}
              >
                <IconMI name={"star"} size={18} color={"#f4f4f4"} />
                <IconMI name={"star"} size={18} color={"#f4f4f4"} />
                <IconMI name={"star"} size={18} color={"#f4f4f4"} />
                <IconMI name={"star"} size={18} color={"#f4f4f4"} />
                <IconMI name={"star-half"} size={18} color={"#f4f4f4"} />
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontWeight: "700",
                    marginLeft: 6,
                  }}
                >
                  4.2
                </Text>
              </View>
            </View>
          ) : null}

          {rating?.lenght > 1 ? (
            <Text
              style={{
                fontSize: 12,
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",

                marginTop: 12,
                marginLeft: 12,
              }}
            >
              MOST RECENT
            </Text>
          ) : null}
          {rating?.lenght > 0 ? (
            <Text
              style={{
                fontSize: 12,
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",

                marginTop: 12,
                marginLeft: 12,
              }}
            >
              ONE RATING AVAILABLE ONLY
            </Text>
          ) : null}

          {rating?.lenght > 0 ? (
            <View
              style={{
                width: "90%",

                marginTop: 8,
                marginLeft: 12,

                paddingVertical: 12,
                paddingHorizontal: 14,

                borderRadius: 6,
                backgroundColor: "#121212",
                position: "relative",
              }}
            >
              <Text
                style={{
                  position: "absolute",
                  right: 14,
                  top: 12,
                  color: "#5c5c5c",
                }}
              >
                12/12/2020
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "#f4f4f4",
                    fontWeight: "700",

                    marginRight: 12,
                  }}
                >
                  Adam
                </Text>
                <IconMI name={"star"} size={18} color={"#0082ff"} />
                <IconMI name={"star"} size={18} color={"#0082ff"} />
                <IconMI name={"star"} size={18} color={"#0082ff"} />
                <IconMI name={"star"} size={18} color={"#0082ff"} />
                <IconMI name={"star-half"} size={18} color={"#0082ff"} />
              </View>
              <Text style={{ marginTop: 8, color: "#f4f4f4", fontSize: 12 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                nec libero quam. Nulla blandit bibendum bibendum. Etiam eros
                libero, tempus ac posuere blandit, congue sit amet ligula. Proin
                venenatis tortor vitae purus ornare feugiat. Praesent mi sapien,
                imperdiet sed eros eget, condimentum varius lectus.
              </Text>
            </View>
          ) : null}

          {!rating?.lenght ? (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginTop: 12,
              }}
            >
              <IconMCI name={"timer-sand"} color={"#0082ff"} size={50} />
              <View style={{ marginLeft: 12 }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#888" }}
                >
                  Just sell and wait
                </Text>
                <Text style={{ fontSize: 12, color: "#888", marginRight: 28 }}>
                  Don't worry rating will increase over time.
                </Text>
              </View>
            </View>
          ) : null}
          {/* <View
            style={{
              width: "90%",
              marginTop: 12,
              marginLeft: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#970000", fontWeight: "700" }}>
              - NO RATING -
            </Text>
          </View> */}

          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 24,
              marginTop: 38,

              marginRight: 12,
            }}
          >
            Statistics
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",

                marginLeft: 12,
              }}
            >
              TOTAL SALES
            </Text>
            <Image
              source={cart_white_up_icon}
              style={{
                height: undefined,
                aspectRatio: 23 / 26,
                width: 16,
                marginRight: 8,
                marginLeft: 12,
              }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {statistics.sales}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",

                marginLeft: 12,
              }}
            >
              TOTAL PURCHASES
            </Text>
            <Image
              source={cart_white_down_icon}
              style={{
                height: undefined,
                aspectRatio: 23 / 26,
                width: 16,
                marginRight: 8,
                marginLeft: 12,
              }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {statistics.purchases}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",
                marginLeft: 12,
              }}
            >
              NUMBER OF OFFERS
            </Text>
            <IconMCI
              name="cards-outline"
              size={17}
              style={{ color: "#f4f4f4", marginLeft: 12, marginRight: 8 }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {statistics.numberOfOffers}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",

                marginLeft: 12,
              }}
            >
              TOTAL ACCOUNT VISITS
            </Text>
            <IconMCI
              name="eye"
              size={16}
              style={{ color: "#f4f4f4", marginLeft: 12, marginRight: 8 }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {statistics.views}
            </Text>
          </View>

          <View style={{ marginBottom: 38 }} />
        </ScrollView>
      );
    }
  }
}
