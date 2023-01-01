import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import red_arrow from "../../assets/red_arrow.png";
import green_arrow from "../../assets/green_arrow.png";
import question_mark from "../../assets/question_mark.png";
import parcel_received from "../../assets/parcel_received.png";
import parcel_in_transit from "../../assets/parcel_in_transit.png";

import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";
import {
  db,
  auth,
  functions,
  firebaseObj,
  pokemonAPI,
} from "../../authContext";

export default function TransactionObject({ props, setATN, setCS }) {
  const [offersArray, setOffersArray] = useState([]);
  const [parcelReceived, setParcelReceived] = useState(
    props.shipping.delivered
  );

  const [type, setType] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleShippingField = () => {
    if (type === "bought") {
      if (props.shipping.delivered) {
        return {
          top: props.shipping.trackingNumber
            ? props.shipping.trackingNumber
            : "NO TRACKING",
          bottom: `Parcell has been delivered.`,
        };
      } else if (props.shipping.sent) {
        if (props.shipping.method.tracking) {
          return {
            top: props.shipping.trackingNumber,
            bottom: "Tap on the tracking number to copy it to clipboard.",
          };
        } else if (!props.shipping.method.tracking) {
          function timeConverter(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 888);
            var months = [
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
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time =
              date +
              "/" +
              a.getMonth() +
              "/" +
              year +
              " " +
              hour +
              ":" +
              min +
              ":" +
              sec;
            return time;
          }
          // const s = new Date(1504095567183).toLocaleDateString("en-US");

          return {
            top: "NO TRACKING",
            bottom: `Parcel should arrive within ${props.shipping.method.from} to ${props.shipping.method.to} days, from purchase date.`,
          };
        }
      } else {
        return {
          top: "Awaiting shipment",
          bottom: "Seller has 7 days to sent parcel, from purchase date.",
        };
      }
    } else {
      if (props.shipping.delivered) {
        return {
          top: props.shipping.trackingNumber
            ? props.shipping.trackingNumber
            : "NO TRACKING",
          bottom: `Parcel has been delivered.`,
        };
      } else if (props.shipping.sent) {
        if (props.shipping.method.tracking) {
          return {
            top: props.shipping.trackingNumber,
            bottom: `Parcel should arrive within ${props.shipping.method.from} to ${props.shipping.method.to} days, from purchase date.`,
          };
        } else if (!props.shipping.method.tracking) {
          return {
            top: "NO TRACKING",
            bottom: `Parcel should arrive within ${props.shipping.method.from} to ${props.shipping.method.to} days, from purchase date.`,
          };
        }
      } else {
        return {
          top: "Awaiting shipment",
          bottom: "You have 7 days to send the parcel",
        };
      }
    }
  };

  const handleUpperStatus = () => {
    // if (props.status === "cancelled")
    // if (props.status === "returned")
    if (type == "bought") {
      if (props.status === "disputed") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image
              source={question_mark}
              style={{ aspectRatio: 1 / 1, width: 20, height: undefined }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 18,
                marginLeft: 10,
                fontWeight: "700",
              }}
            >
              Disputed
            </Text>
          </View>
        );
        // || parcelReceived
      } else if (props.status === "delivered" || props.status === "completed") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image
              source={parcel_received}
              style={{ aspectRatio: 1 / 1, width: 20, height: undefined }}
            />

            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 18,
                marginLeft: 10,
                fontWeight: "700",
              }}
            >
              Delivered
            </Text>
          </View>
        );
      } else if (props.status === "sent") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image
              source={parcel_in_transit}
              style={{ aspectRatio: 1 / 1, width: 20, height: undefined }}
            />

            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 18,
                marginLeft: 10,
                fontWeight: "700",
              }}
            >
              In Transit
            </Text>
          </View>
        );
      } else {
        return (
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "50%" }}
          >
            <Image
              source={green_arrow}
              style={{ aspectRatio: 1 / 1, width: 20, height: undefined }}
            />

            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 18,
                marginLeft: 10,
                fontWeight: "700",
              }}
            >
              Bought
            </Text>
          </View>
        );
      }
    } else {
      if (props.status === "disputed") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image
              source={question_mark}
              style={{ aspectRatio: 1 / 1, width: 20, height: undefined }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 18,
                marginLeft: 10,
                fontWeight: "700",
              }}
            >
              Disputed
            </Text>
          </View>
        );
      } else if (props.status === "delivered" || props.status === "completed") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image
              source={parcel_received}
              style={{ aspectRatio: 1 / 1, width: 20, height: undefined }}
            />

            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 18,
                marginLeft: 10,
                fontWeight: "700",
              }}
            >
              Delivered
            </Text>
          </View>
        );
      } else if (props.status === "sent") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image
              source={parcel_in_transit}
              style={{ aspectRatio: 1 / 1, width: 20, height: undefined }}
            />

            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 18,
                marginLeft: 10,
                fontWeight: "700",
              }}
            >
              In Transit
            </Text>
          </View>
        );
      } else {
        return (
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "50%" }}
          >
            <Image
              source={red_arrow}
              style={{ aspectRatio: 1 / 1, width: 20, height: undefined }}
            />

            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 18,
                marginLeft: 10,
                fontWeight: "700",
              }}
            >
              Sold
            </Text>
          </View>
        );
      }
    }
  };

  const handleBottomStatus = () => {
    // if (props.status === "cancelled")
    // if (props.status === "returned")

    if (type == "bought") {
      if (props.status === "disputed") {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#BC2EFF",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontFamily: "Roboto_Medium", color: "#f4f4f4" }}>
              Dispute in progress
            </Text>
          </View>
        );
      } else if (props.status === "delivered" || props.status === "completed") {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#0082ff",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontFamily: "Roboto_Medium", color: "#f4f4f4" }}>
              Parcel Received
            </Text>
          </View>
        );
      } else if (props.status === "sent") {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#FFD400",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontFamily: "Roboto_Medium", color: "#f4f4f4" }}>
              Parcel on the way
            </Text>
          </View>
        );
      } else {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#05FD00",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontFamily: "Roboto_Medium", color: "#f4f4f4" }}>
              Payment accepted
            </Text>
          </View>
        );
      }
    } else {
      if (props.status === "disputed") {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#BC2EFF",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontFamily: "Roboto_Medium", color: "#f4f4f4" }}>
              Dispute in progress
            </Text>
          </View>
        );
      } else if (props.status === "delivered" || props.status === "completed") {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#0082ff",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontFamily: "Roboto_Medium", color: "#f4f4f4" }}>
              Parcel Received
            </Text>
          </View>
        );
      } else if (props.status === "sent") {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#FFD400",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontFamily: "Roboto_Medium", color: "#f4f4f4" }}>
              Parcel on the way
            </Text>
          </View>
        );
      } else {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#D80000",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ fontFamily: "Roboto_Medium", color: "#f4f4f4" }}>
              Awaiting shipment
            </Text>
          </View>
        );
      }
    }
  };

  useEffect(() => {
    const resolvePromises = async () => {
      if (props.buyer === auth.currentUser.uid) {
        setType("bought");
      } else {
        setType("sold");
      }

      const promise = new Promise((resolve, reject) => {
        try {
          props.offers.forEach(async (offer, index) => {
            await pokemonAPI.card
              .find(offer.cardId)
              .then((card) => {
                props.offers[index].cardObject = { ...card };
              })
              .catch((error) => {
                console.log(error);
              });

            setTimeout(() => {
              resolve(props.offers);
            }, 100);
          });
        } catch (e) {
          console.log(e);
        }
      });

      await promise.then((res) => {
        setOffersArray(res);

        let total = 0;
        res.forEach((item) => {
          total += item.price;
        });
        setTotalAmount(total);
      });
    };

    resolvePromises();
  }, []);

  const navigation = useNavigation();

  if (type === "sold") {
    return (
      <View
        style={{ alignItems: "flex-start", marginLeft: "3%", marginTop: 10 }}
      >
        <View
          style={{
            width: "94%",

            backgroundColor: "#121212",

            borderRadius: 6,

            padding: 16,
            zIndex: 1,
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "50%" }}>
              {handleUpperStatus()}
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                  marginTop: 18,
                }}
              >
                STATUS
              </Text>
              {handleBottomStatus()}
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                  marginTop: 18,
                }}
              >
                SHIPPING
              </Text>
              {props.shipping.sent ? (
                <View style={{ flexDirection: "row", marginTop: 6 }}>
                  <View
                    style={{
                      padding: 2,
                      paddingHorizontal: 8,
                      borderTopLeftRadius: 2,
                      borderBottomLeftRadius: 2,
                      backgroundColor: "#302c2c",
                    }}
                  >
                    <Text style={{ color: "#f4f4f4", fontWeight: "700" }}>
                      {props.shipping.method.carrier}
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: 2,
                      paddingHorizontal: 8,
                      borderTopRightRadius: 2,
                      borderBottomRightRadius: 2,
                      backgroundColor: "#252525",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                      }}
                    >
                      {handleShippingField().top}
                    </Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 12,

                    borderRadius: 3.5,
                    backgroundColor: "#25DD21",

                    alignSelf: "flex-start",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    if (props.shipping.method.tracking) {
                      setATN(props.id);
                    } else {
                      setCS(props.id);
                    }
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: "#121212",
                        fontWeight: "700",
                        fontSize: 11,
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        marginRight: 6,
                      }}
                    >
                      {props.shipping.method.tracking
                        ? "Add Tracking Number"
                        : "Parcel Sent"}
                    </Text>
                    <IconMI name="double-arrow" size={14} color="#121212" />
                  </View>
                </TouchableOpacity>
              )}
              {/* <View style={{ flexDirection: "row", marginTop: 6 }}>
              <View
                style={{
                  padding: 2,
                  paddingHorizontal: 8,
                  borderTopLeftRadius: 2,
                  borderBottomLeftRadius: 2,
                  backgroundColor: "#302c2c",
                }}
              >
                <Text style={{ color: "#f4f4f4", fontWeight: "700" }}>
                  {props.shipping.method.carrier}
                </Text>
              </View>
              <View
                style={{
                  padding: 2,
                  paddingHorizontal: 8,
                  borderTopRightRadius: 2,
                  borderBottomRightRadius: 2,
                  backgroundColor: "#252525",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                  }}
                >
                  {handleShippingField().top}
                </Text>
              </View>
            </View> */}
            </View>

            <View style={{ width: "50%" }}>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <Text
                  style={{
                    color: "#5c5c5c",
                    fontFamily: "Roboto_Medium",
                    fontSize: 12,
                  }}
                >
                  ORDER AMOUNT
                </Text>
                <Text
                  style={{
                    color: "#0082FF",
                    fontFamily: "Roboto_Medium",
                    fontSize: 12,
                    marginLeft: 10,
                  }}
                >
                  {`${totalAmount.toFixed(2)} USD`}
                </Text>
              </View>
              <FlatList
                data={offersArray[0]?.price ? [offersArray[0]] : []}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ marginBottom: 8 }}>
                      <View
                        style={{ flexDirection: "row", alignItems: "flex-end" }}
                      >
                        <Text
                          style={{
                            color: "#f4f4f4",
                            fontWeight: "700",
                            fontSize: 15,
                          }}
                        >
                          {item.cardObject.name}
                        </Text>
                        <Text
                          style={{
                            color: "#5c5c5c",
                            fontFamily: "Roboto_Medium",
                            fontSize: 10,
                            marginLeft: 10,
                          }}
                        >
                          X1
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: "#5c5c5c",
                          fontFamily: "Roboto_Medium",
                          fontSize: 12,
                          marginLeft: 10,
                          marginTop: 2,
                        }}
                      >
                        {item.price.toFixed(2)} USD
                      </Text>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => {
                  if (offersArray.length > 1) {
                    return (
                      <View
                        style={{
                          marginBottom: 4,
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#383838",
                            fontFamily: "Roboto_Medium",
                          }}
                        >
                          And {offersArray.length - 1} more ...
                        </Text>
                      </View>
                    );
                  }
                  return null;
                }}
                ListEmptyComponent={
                  <View style={{ marginVertical: 20, marginTop: 14 }}>
                    <ActivityIndicator color={"#0082ff"} size={"large"} />
                  </View>
                }
              />
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => {
                  navigation.navigate("TransactionDetails", {
                    props: props,
                    offersArray: offersArray,
                    totalAmount: totalAmount,
                  });
                }}
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
            </View>
          </View>
          <Text style={{ color: "#5c5c5c", fontSize: 11, marginTop: 10 }}>
            {handleShippingField().bottom}
          </Text>
        </View>
        <View
          style={{
            flexGrow: 0,
            top: -6,
            zIndex: 0,
            paddingVertical: 5,
            paddingTop: 11,
            paddingHorizontal: 12,
            position: "relative",

            borderRadius: 6,

            backgroundColor: "#404040",
            borderTopLeftRadius: 0,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto_Medium",
              color: "#ffffff",
            }}
          >
            ID: {props.id}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={{ alignItems: "flex-start", marginLeft: "3%", marginTop: 10 }}>
      <View
        style={{
          width: "94%",

          backgroundColor: "#121212",

          borderRadius: 6,

          padding: 16,
          zIndex: 1,
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "50%" }}>
            {handleUpperStatus()}
            <Text
              style={{
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",
                fontSize: 12,
                marginTop: 18,
              }}
            >
              STATUS
            </Text>
            {handleBottomStatus()}
            <Text
              style={{
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",
                fontSize: 12,
                marginTop: 18,
              }}
            >
              SHIPPING
            </Text>

            <View style={{ flexDirection: "row", marginTop: 6 }}>
              <View
                style={{
                  padding: 2,
                  paddingHorizontal: 8,
                  borderTopLeftRadius: 2,
                  borderBottomLeftRadius: 2,
                  backgroundColor: "#302c2c",
                }}
              >
                <Text style={{ color: "#f4f4f4", fontWeight: "700" }}>
                  {props.shipping.method.carrier}
                </Text>
              </View>
              <View
                style={{
                  padding: 2,
                  paddingHorizontal: 8,
                  borderTopRightRadius: 2,
                  borderBottomRightRadius: 2,
                  backgroundColor: "#252525",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                  }}
                >
                  {handleShippingField().top}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ width: "50%" }}>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                }}
              >
                ORDER AMOUNT
              </Text>
              <Text
                style={{
                  color: "#0082FF",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                  marginLeft: 10,
                }}
              >
                {`${totalAmount.toFixed(2)} USD`}
              </Text>
            </View>
            <FlatList
              data={offersArray[0]?.price ? [offersArray[0]] : []}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ marginBottom: 8 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "flex-end" }}
                    >
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontWeight: "700",
                          fontSize: 15,
                        }}
                      >
                        {item.cardObject.name}
                      </Text>
                      <Text
                        style={{
                          color: "#5c5c5c",
                          fontFamily: "Roboto_Medium",
                          fontSize: 10,
                          marginLeft: 10,
                        }}
                      >
                        X1
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "#5c5c5c",
                        fontFamily: "Roboto_Medium",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 2,
                      }}
                    >
                      {item.price.toFixed(2)} USD
                    </Text>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => {
                if (offersArray.length > 1) {
                  return (
                    <View
                      style={{
                        marginBottom: 4,
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#383838",
                          fontFamily: "Roboto_Medium",
                        }}
                      >
                        And {offersArray.length - 1} more ...
                      </Text>
                    </View>
                  );
                }
                return null;
              }}
              ListEmptyComponent={
                <View style={{ marginBottom: 10, marginTop: 3 }}>
                  <ActivityIndicator color={"#0082ff"} size={"large"} />
                </View>
              }
            />
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                navigation.navigate("TransactionDetails", {
                  props: props,
                  offersArray: offersArray,
                  totalAmount: totalAmount,
                });
              }}
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
          </View>
        </View>
        <Text style={{ color: "#5c5c5c", fontSize: 11, marginTop: 10 }}>
          {handleShippingField().bottom}
        </Text>
        {!parcelReceived && props.shipping.sent ? (
          <TouchableOpacity
            style={{
              // borderRadius: 4,

              // backgroundColor: "#2fbd22",
              // borderColor: "#5c5c5c",

              // width: "55%",
              // marginTop: 10,
              // paddingVertical: 4.5,

              // alignItems: "center",

              marginTop: 10,
              paddingVertical: 5,
              paddingHorizontal: 12,

              borderRadius: 3.5,
              backgroundColor: "#25DD21",

              alignSelf: "flex-start",
              alignItems: "center",
            }}
            onPress={async () => {
              setParcelReceived(true);
              props.shipping.delivered =
                firebaseObj.firestore.FieldValue.serverTimestamp();

              await db
                .collection("transactions")
                .doc(props.id)
                .update({
                  ["shipping.delivered"]:
                    firebaseObj.firestore.FieldValue.serverTimestamp(),
                  ["status"]: "delivered",
                });

              await db
                .collection("transactions")
                .doc(props.id)
                .get()
                .then((doc) => {
                  const notificationQuery =
                    functions.httpsCallable("sendNotification");

                  notificationQuery({
                    payload: {
                      notification: {
                        title: "Shipment Received",
                        body: "The shipment has been received by buyer 📬",
                      },
                      data: {
                        channelId: "transactions-notifications",
                      },
                    },
                    uid: doc.data().seller,
                  });

                  const mailQuery = functions.httpsCallable("sendMail");

                  mailQuery({
                    to: doc.data().seller,
                    from: {
                      email: "sales@tcmarket.place",
                      name: "TCM",
                    },
                    templateId: "d-6e89f378033e4b19b0d5e93e133f8c4e",
                    subject: "Shipment Received",
                    dynamicTemplateData: {
                      order_id: props.id,
                    },
                  });
                });
            }}
          >
            <Text
              style={{
                color: "#121212",
                fontWeight: "700",
                fontSize: 11,
              }}
            >
              Confirm parcel receive
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View
        style={{
          flexGrow: 0,
          top: -6,
          zIndex: 0,
          paddingVertical: 5,
          paddingTop: 11,
          paddingHorizontal: 12,
          position: "relative",

          borderRadius: 6,
          borderTopLeftRadius: 0,

          backgroundColor: "#404040",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Roboto_Medium",
            color: "#ffffff",
          }}
        >
          ID: {props.id}
        </Text>
      </View>
    </View>
  );
}
