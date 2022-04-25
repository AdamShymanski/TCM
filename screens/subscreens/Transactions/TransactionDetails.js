import React, { useState, useEffect } from "react";

import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";
import IconMI from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Octicons";

import cart_down_icon from "../../../assets/cart_down.png";
import cart_up_icon from "../../../assets/cart_up.png";

import { auth, fetchOwnerData, fetchPhotos } from "../../../authContext";
import { Snackbar } from "react-native-paper";

export default function TransactionDetails({ route }) {
  const { props, offersArray, totalAmount } = route.params;

  const [vendor, setVendor] = useState({
    nick: "",
    sellerProfile: {
      statistics: {
        sales: 0,
        visits: 0,
        purchases: 0,
        numberOfOffers: 0,
      },
    },
  });

  const [loading, setLoading] = useState(true);
  const [snackbarState, setSnackbarState] = useState(false);

  const phsm = {
    from: props.shipping.method.from,
    to: props.shipping.method.to,
    price: props.shipping.method.price,
    carrier: props.shipping.method.carrier,
    name: props.shipping.method.name,
    tracking: props.shipping.method.tracking,
  };

  const fillPhotosArray = (array) => {
    let outArray = [];

    array.forEach((item) => {
      outArray.push({ url: item });
    });

    return outArray;
  };

  useEffect(() => {
    const resolvePromises = async () => {
      // await db
      //   .collection("users")
      //   .doc(props.seller === auth.currentUser.uid ? props.buyer : props.seller)
      //   .get()
      //   .then((doc) => {
      //     setVendor(doc.data());
      //   });

      setVendor(
        await fetchOwnerData(
          props.seller === auth.currentUser.uid ? props.buyer : props.seller
        )
      );

      const promise = new Promise((resolve, reject) => {
        offersArray.forEach(async (item, index) => {
          const cardPhotos = await fetchPhotos(item.id);
          offersArray[index].cardPhotos = [...fillPhotosArray(cardPhotos)];

          if (index === offersArray.length - 1) resolve();
        });
      });

      promise.then(() => {
        setLoading(false);
      });
    };

    resolvePromises();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#1b1b1b",
        paddingLeft: 12,
        paddingBottom: 22,
      }}
    >
      {props.buyer === auth.currentUser.uid ? (
        <View>
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 24,
              marginVertical: 12,
            }}
          >
            Vendor
          </Text>
          <View
            style={{
              height: 100,
              marginBottom: 18,
              borderRadius: 3,
              flexDirection: "row",
              backgroundColor: "#121212",

              paddingLeft: 12,
              marginRight: 12,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Image
                  style={{ width: 28, height: 21, marginRight: 12 }}
                  source={{
                    uri: `https://flagcdn.com/160x120/${vendor.countryCode}.png`,
                  }}
                />
                <Text
                  style={{
                    color: "#f4f4f4",
                    marginBottom: 12,
                    fontWeight: "700",
                    fontSize: 15,
                  }}
                >
                  {vendor.nick}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <IconMI
                  name={"star-outline"}
                  size={15}
                  style={{ color: "#f4f4f4" }}
                />
                <IconMI
                  name={"star-outline"}
                  size={15}
                  style={{ color: "#f4f4f4" }}
                />
                <IconMI
                  name={"star-outline"}
                  size={15}
                  style={{ color: "#f4f4f4" }}
                />
                <IconMI
                  name={"star-outline"}
                  size={15}
                  style={{ color: "#f4f4f4" }}
                />
                <IconMI
                  name={"star-outline"}
                  size={15}
                  style={{ color: "#f4f4f4" }}
                />
                {/* <Text
              style={{
                color: "#f4f4f4",
                fontSize: 13,
                marginLeft: 5,
                fontFamily: "Roboto_Medium",
              }}
            >
              0
            </Text> */}
              </View>
              <Text
                style={{ color: "#9C9C9C", fontSize: 10, fontWeight: "700" }}
              >
                No rating yet
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                marginLeft: 42,
                marginRight: 54,
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: 22 }}>
                <IconMCI
                  name="eye"
                  size={16}
                  style={{ color: "#0082ff", marginRight: 4 }}
                />
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontSize: 13,
                    fontWeight: "700",
                    marginRight: 12,
                  }}
                >
                  {loading ? 0 : vendor.sellerProfile.statistics.visits}
                </Text>
                <IconMCI
                  name="cards-outline"
                  size={17}
                  style={{ color: "#0082ff", marginRight: 4 }}
                />
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  {loading ? 0 : vendor.sellerProfile.statistics.numberOfOffers}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={cart_up_icon}
                  style={{
                    height: undefined,
                    aspectRatio: 23 / 26,
                    width: 16,
                    marginRight: 4,
                  }}
                />
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontSize: 13,
                    fontWeight: "700",
                    marginRight: 12,
                  }}
                >
                  {loading ? 0 : vendor.sellerProfile.statistics.sales}
                </Text>
                <Image
                  source={cart_down_icon}
                  style={{
                    height: undefined,
                    aspectRatio: 23 / 26,
                    width: 16,
                    marginRight: 4,
                  }}
                />
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  {loading ? 0 : vendor.sellerProfile.statistics.purchases}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",

                  borderWidth: 2,
                  borderRadius: 3,
                  borderColor: "#5c5c5c",
                  paddingVertical: 3,
                  paddingHorizontal: 8,
                }}
              >
                <Text
                  style={{
                    color: "#5c5c5c",

                    fontSize: 13,
                    fontWeight: "700",

                    marginRight: 4,
                  }}
                >
                  Report
                </Text>
                <IconMCI
                  name={"flag-plus-outline"}
                  size={17}
                  style={{ color: "#5c5c5c" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",

                  borderRadius: 3,

                  marginTop: 12,
                  paddingVertical: 4.5,
                  paddingHorizontal: 12,

                  backgroundColor: "#0082ff",
                }}
              >
                <Text
                  style={{
                    color: "#121212",

                    fontSize: 13,
                    fontWeight: "700",

                    marginRight: 4,
                  }}
                >
                  All Offers
                </Text>
                <IconMCI
                  name={"cards-outline"}
                  size={17}
                  style={{ color: "#121212" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}

      <Text
        style={{
          color: "#f4f4f4",
          fontWeight: "700",
          fontSize: 24,
          marginVertical: 12,
        }}
      >
        Cards
      </Text>
      <FlatList
        data={loading ? [] : offersArray}
        style={{ flex: 1 }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 12,

                marginRight: 12,
                marginVertical: 8,

                // alignItems: "center",
                // flexDirection: "row",

                backgroundColor: "#121212",
                borderRadius: 5,
              }}
            >
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <Image
                  source={{
                    uri: item?.cardPhotos[0] ? item.cardPhotos[0].url : "",
                  }}
                  style={{
                    aspectRatio: 105 / 140,
                    width: undefined,
                    height: 90,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      height: 90,
                      marginLeft: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: "#f4f4f4",
                        fontFamily: "Roboto_Medium",
                        fontSize: 15,
                      }}
                    >
                      {item.cardName}
                    </Text>
                    <View style={{ flexDirection: "row", marginTop: 6 }}>
                      <Text
                        style={{
                          color: "#585858",
                          fontFamily: "Roboto_Medium",
                          fontSize: 11,
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontFamily: "Roboto_Medium",
                          fontSize: 11,
                          marginLeft: 4,
                        }}
                      >
                        {`${item.price.toFixed(2)} USD`}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "#585858",
                          fontFamily: "Roboto_Medium",
                          fontSize: 11,
                        }}
                      >
                        Graded
                      </Text>
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontFamily: "Roboto_Medium",
                          fontSize: 11,
                          marginLeft: 4,
                        }}
                      >
                        {item.isGraded ? (
                          <Icon name="check" color={"#0dff25"} size={14} />
                        ) : (
                          <Text style={{ fontSize: 11, color: "#CD0000" }}>
                            X
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "#585858",
                          fontFamily: "Roboto_Medium",
                          fontSize: 11,
                        }}
                      >
                        Condition
                      </Text>
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontFamily: "Roboto_Medium",
                          fontSize: 11,
                          marginLeft: 4,
                        }}
                      >
                        {item.condition}
                        <Text
                          style={{
                            color: "#7c7c7c",
                            fontFamily: "Roboto_Medium",
                            fontSize: 8,
                            marginLeft: 4,
                          }}
                        >
                          /10
                        </Text>
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "#585858",
                          fontFamily: "Roboto_Medium",
                          fontSize: 11,
                        }}
                      >
                        Language
                      </Text>
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontFamily: "Roboto_Medium",
                          fontSize: 11,
                          marginLeft: 4,
                        }}
                      >
                        {item.languageVersion}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ marginVertical: 20 }}>
            <ActivityIndicator color={"#0082ff"} size={"large"} />
          </View>
        }
        keyExtractor={(item, index) => index.toString()}
      />
      <Text
        style={{
          color: "#f4f4f4",
          fontWeight: "700",
          fontSize: 24,
          marginVertical: 12,
        }}
      >
        Shipping
      </Text>
      <View
        style={{
          backgroundColor: "#121212",
          borderRadius: 3,

          marginRight: 12,
          padding: 12,
        }}
      >
        <View>{/* SPACE FOR SHIPPING STATUS */}</View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "44%" }}>
            <Text
              style={{
                color: "#565656",
                fontFamily: "Roboto_Medium",
                fontSize: 12,

                marginBottom: 4,
              }}
            >
              ADDRESS
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {props.shipping.address.firstName}{" "}
              {props.shipping.address.lastName}
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {props.shipping.address.streetAddress1}
            </Text>
            {props.shipping.address.streetAddress2 ? (
              <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
                {props.shipping.address.streetAddress2}
              </Text>
            ) : null}
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {props.shipping.address.city}, {props.shipping.address.zipCode}
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {props.shipping.address.country}
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {props.shipping.address.phoneNumber}
            </Text>
          </View>
          <View style={{ width: "50%", marginLeft: "6%" }}>
            <Text
              style={{
                color: "#565656",
                fontFamily: "Roboto_Medium",
                fontSize: 12,

                marginBottom: 4,
              }}
            >
              TRACKING NUMBER
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6, marginBottom: 6 }}>
              {props.shipping.trackingNumber
                ? props.shipping.trackingNumber
                : "-"}
            </Text>
            <Text
              style={{
                color: "#565656",
                fontFamily: "Roboto_Medium",
                fontSize: 12,

                marginBottom: 4,
              }}
            >
              SENT
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6, marginBottom: 6 }}>
              {props.shipping.sent ? props.shipping.sent : "-"}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",

          marginTop: 6,
          marginBottom: 18,
          marginRight: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,

          borderRadius: 3,
          backgroundColor: "#121212",
        }}
      >
        {phsm.tracking ? (
          <IconMCI name={"radar"} size={16} color={"#24FF00"} />
        ) : null}
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
            fontWeight: "700",
          }}
        >
          {phsm.carrier}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#939393",
          }}
        >
          {phsm.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
          }}
        >
          {phsm.from} - {phsm.to} days
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
            fontWeight: "700",
          }}
        >
          {phsm.price.toFixed(2)} USD
        </Text>
      </View>
      <Text
        style={{
          color: "#f4f4f4",
          fontWeight: "700",
          fontSize: 24,
          marginVertical: 12,
        }}
      >
        Final Cost
      </Text>
      <View
        style={{
          marginRight: 12,

          paddingHorizontal: 12,
          paddingVertical: 10,

          borderRadius: 3,
          backgroundColor: "#121212",
        }}
      >
        {/* <View
          style={{
            flexDirection: "row",
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#565656",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
            }}
          >
            CARDS
          </Text>
          <Text
            style={{
              color: "#f4f4f4",
              marginLeft: 16,
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            + 121 <Text style={{ color: "#0082ff" }}>USD</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 4,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#565656",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
            }}
          >
            SHIPPING
          </Text>
          <Text
            style={{
              color: "#f4f4f4",
              marginLeft: 16,
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            + 8.50 <Text style={{ color: "#0082ff" }}>USD</Text>
          </Text>
        </View> */}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: "#565656",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
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
            {`+ ${totalAmount.toFixed(2)} USD`}
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
            {`+ ${props.shipping.method.price.toFixed(2)} USD`}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            width: "10%",
            height: 3,
            borderRadius: 3,
            marginTop: 20,
            marginBottom: 8,
          }}
        />
        <Text
          style={{
            color: "#05FD00",

            fontWeight: "700",
            fontSize: 19,
          }}
        >
          {(props.shipping.method.price + totalAmount).toFixed(2)}{" "}
          <Text style={{ color: "#05FD00" }}>USD</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          paddingVertical: 6,
          backgroundColor: "#D80000",
          borderRadius: 3,

          marginRight: 12,
          marginBottom: 24,
          marginTop: 26,
        }}
        onPress={() => {
          setSnackbarState("You need to wait 32H before opening dispute");
        }}
      >
        <Text style={{ color: "#FAFAFA", fontWeight: "700" }}>
          Open Dispute
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          paddingVertical: 6,
          backgroundColor: "#25DD21",
          borderRadius: 3,

          marginRight: 12,
          marginBottom: 24,
        }}
        onPress={() => {
          setSnackbarState("Now you have 48H to open dispute if need");
        }}
      >
        <Text style={{ color: "#121212", fontWeight: "700" }}>
          Confirm Cards Received
        </Text>
      </TouchableOpacity>
      <Snackbar
        visible={snackbarState}
        duration={3000}
        onDismiss={() => setSnackbarState(false)}
        action={{
          label: "",
          onPress: () => {},
        }}
      >
        {snackbarState}
      </Snackbar>
    </ScrollView>
  );
}
