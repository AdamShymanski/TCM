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

import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";
import { auth, fetchCardsName } from "../../authContext";

export default function TransactionObject({ props }) {
  const [cardReceived, setCardReceived] = useState(false);
  const [offersArray, setOffersArray] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [disputeButtonState, setDisputeButtonState] = useState(true);
  const [type, setType] = useState(null);

  const handleShippingField = (prop) => {
    
    {
      /* <IconMCI name={"check-circle"} size={14} color={"#25DD21"} />
              <Text
                style={{
                  fontFamily: "Roboto_Medium",
                  color: "#f4f4f4",
                  marginLeft: 8,
                }}
              >
                Delivered
              </Text> */
    }

    {
      /* <IconMCI
                name={"chevron-right-circle"}
                size={14}
                color={"#25DD21"}
              />
              <Text
                style={{
                  fontFamily: "Roboto_Medium",
                  color: "#f4f4f4",
                  marginLeft: 8,
                }}
              >
                Parcel sent
              </Text> */
    }

    {
      /* <IconMCI name={"clock"} size={14} color={"#FFE600"} />
              <Text
                style={{
                  fontFamily: "Roboto_Medium",
                  color: "#f4f4f4",
                  marginLeft: 8,
                }}
              >
                Awaiting shipment
              </Text> */
    }

    if (prop === "sold") {
      if (props.shipping.method.tracking) {
        return {
          top: (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <IconMCI name={"clock"} size={14} color={"#FFE600"} />
              <Text
                style={{
                  fontFamily: "Roboto_Medium",
                  color: "#f4f4f4",
                  marginLeft: 8,
                }}
              >
                Awaiting shipment
              </Text>
            </View>
          ),
          bottom: (
            <TouchableOpacity
              style={{
                marginTop: 10,
                width: "80%",
                paddingVertical: 5,

                borderRadius: 3,
                backgroundColor: "#25DD21",

                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#121212", fontWeight: "700", fontSize: 11 }}
              >
                Add Tracking Number
              </Text>
            </TouchableOpacity>
          ),
        };
      } else {
        return (
          <TouchableOpacity
            style={{
              marginTop: 10,
              width: "60%",
              paddingVertical: 5,

              borderRadius: 3,
              backgroundColor: "#25DD21",

              alignItems: "center",
            }}
          >
            <Text style={{ color: "#121212", fontWeight: "700", fontSize: 13 }}>
              Parcel Sent
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      if (!props.shipping.sent) {
        return {
          top: "Awaiting shipment",
          bottom: "Seller has 3 days to sent parcel, from date of purchase.",
        };
      } else if (props.shipping.delivered) {
        return {
          top: "Delivered",
          bottom: "",
        };
      } else {
        if (props.shipping.sent && props.shipping.method.tracking) {
          return {
            top: props.shipping.trackingNumber,
            bottom: "Tap on the tracking number to copy it to clipboard.",
          };
        }
        if (props.shipping.sent && !props.shipping.method.tracking) {
          return {
            top: "Parcel sent",
            bottom: `Package should arrive within ${props.shipping.method.from} to ${props.shipping.method.to} days.`,
          };
        }
        return;

        // if (props.shipping.method.tracking) {
        //   if (props.shipping.trackingNumber) {
        //   }
        // } else {
        //   return `Average delivery time: ${props.shipping.method.from} - ${props.shipping.method.t}`;
        // }
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
        props.offers.forEach(async (offer, index) => {
          const outArray = [];

          fetchCardsName(offer.cardId).then((name) => {
            let offerObj = offer;
            offerObj.cardName = name;
            outArray.push(offerObj);

            if (props.offers.length === index + 1) resolve(outArray);
          });
        });
      });

      promise.then((res) => {
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

  if (type === null) {
    return (
      <View
        style={{
          width: "94%",

          backgroundColor: "#121212",

          marginLeft: "3%",
          marginTop: 10,
          borderRadius: 6,

          padding: 16,

          height: 200,
        }}
      />
    );
  }

  if (type === "sold") {
    return (
      <View
        style={{
          width: "94%",

          backgroundColor: "#121212",

          marginLeft: "3%",
          marginTop: 10,
          borderRadius: 6,

          padding: 16,
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "50%",
              }}
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

            {handleShippingField("sold").top}
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
            {handleShippingField("sold").bottom}
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
              data={offersArray}
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
                        {item.cardName}
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
          You have 7 days to send the parcel after receiving the funds
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#0082ff",
            borderRadius: 4,
            alignItems: "center",
            paddingVertical: 5,

            marginTop: 10,
          }}
        >
          <Text style={{ color: "#121212", fontWeight: "700" }}>
            Contact Support
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View
      style={{
        width: "94%",

        backgroundColor: "#121212",

        marginLeft: "3%",
        marginTop: 10,
        borderRadius: 6,

        padding: 16,
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
              Cards Received
            </Text>
          </View>
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
                {handleShippingField("bought").top}
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
            data={offersArray}
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
                      {item.cardName}
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
        {handleShippingField("bought").bottom}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#0082ff",
          borderRadius: 4,
          alignItems: "center",
          paddingVertical: 5,

          marginTop: 16,
        }}
      >
        <Text style={{ color: "#121212", fontWeight: "700" }}>
          Contact Support
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{
            borderRadius: 4,
            backgroundColor: disputeButtonState ? "#c21313" : "#390e0e",
            paddingVertical: 5,

            width: "40%",
            marginTop: 10,

            alignItems: "center",
          }}
          disabled={disputeButtonState}
        >
          <Text
            style={{
              color: disputeButtonState ? "#fff" : "#613e3e",
              fontWeight: "700",
            }}
          >
            Open Dispute
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderRadius: 4,
            borderWidth: cardReceived ? 0 : 2.2,

            backgroundColor: cardReceived ? "#2fbd22" : "transparent",
            borderColor: "#5c5c5c",

            width: "57%",
            marginTop: 10,
            paddingVertical: cardReceived ? 5 : 3,

            alignItems: "center",
          }}
          onPress={() => setCardReceived((prevState) => !prevState)}
        >
          <Text
            style={{
              color: cardReceived ? "#121212" : "#5c5c5c",
              fontWeight: "700",
            }}
          >
            {cardReceived ? "Card Has Been Received" : "Confirm Cards Received"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
