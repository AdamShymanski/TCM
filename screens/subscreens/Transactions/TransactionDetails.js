import React, { useState, useEffect } from "react";

import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";
import IconMI from "react-native-vector-icons/MaterialIcons";
import IconI from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Octicons";

import cart_down_icon from "../../../assets/cart_down.png";
import cart_up_icon from "../../../assets/cart_up.png";

import {
  auth,
  fetchOwnerData,
  fetchPhotos,
  db,
  functions,
  firebaseObj,
} from "../../../authContext";
import { Snackbar } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

export default function TransactionDetails({ route }) {
  const { props, offersArray, totalAmount } = route.params;
  const phsm = {
    from: props.shipping.method.from,
    to: props.shipping.method.to,
    price: props.shipping.method.price,
    carrier: props.shipping.method.carrier,
    name: props.shipping.method.name,
    tracking: props.shipping.method.tracking,
  };

  const [vendor, setVendor] = useState({ nick: "" });

  const [loading, setLoading] = useState(true);
  const [snackbarState, setSnackbarState] = useState(false);

  const [sentDate, setSentDate] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(false);

  const [showDisputeButton, setShowDisputeButton] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [activityIndicator, setActivityIndicator] = useState(false);

  const fillPhotosArray = (array) => {
    let outArray = [];

    array.forEach((item) => {
      outArray.push({ url: item });
    });

    return outArray;
  };

  useEffect(() => {
    const resolvePromises = async () => {
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

      if (props.shipping.sent) {
        const x = new Date(props.shipping.sent.seconds * 1000);

        setSentDate(
          [x.getDate(), x.getMonth() + 1, x.getFullYear()].join("/") +
            " " +
            [
              x.getHours(),
              `${
                parseInt(x.getMinutes()) <= 9
                  ? "0" + x.getMinutes()
                  : x.getMinutes()
              }`,
            ].join(":")
        );
      }

      if (props.shipping.delivered) {
        const x = new Date(props.shipping.delivered.seconds * 1000);

        setDeliveryDate(
          [x.getDate(), x.getMonth() + 1, x.getFullYear()].join("/") +
            " " +
            [
              x.getHours(),
              `${
                parseInt(x.getMinutes()) <= 9
                  ? "0" + x.getMinutes()
                  : x.getMinutes()
              }`,
            ].join(":")
        );

        const t2 = new Date();
        const t1 = new Date(props.shipping.delivered.seconds * 1000);

        //time difference in minutes
        const diff = Math.ceil((t2 - t1) / (1000 * 60));

        if (diff < 60 * 24 * 3 && props.status !== "disputed") {
          setShowDisputeButton(true);
        }
      }
    };

    resolvePromises();
  }, []);

  const disputeModal = () => {
    return (
      <Modal
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "87%",

              backgroundColor: "#121212",
              borderRadius: 8,
              paddingVertical: 18,
              paddingHorizontal: 18,
            }}
          >
            <Text style={{ color: "#f4f4f4", fontSize: 26, fontWeight: "700" }}>
              Are you sure?
            </Text>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                width: "90%",
                marginTop: 10,
              }}
            >
              Initiate a dispute only when the card is actually damaged, doesn't
              meet the description or the order is incomplete. Aspects such as
              late shipment can be expressed in the seller's feedback.
            </Text>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                width: "90%",
                marginTop: 10,
              }}
            >
              If you initiate a dispute, a support representative will contact
              you by email as soon as possible, and then help resolve the issue.
            </Text>
            <View
              style={{
                flexDirection: "row-reverse",
                marginTop: 32,
                alignItems: "center",
              }}
            >
              {!activityIndicator ? (
                <TouchableOpacity
                  style={{
                    width: 84,
                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: "#D80000",
                    borderRadius: 3,
                  }}
                  onPress={async () => {
                    setActivityIndicator(true);
                    setShowDisputeButton(false);

                    await db.collection("transactions").doc(props.id).update({
                      status: "disputed",
                      disputeDate:
                        firebaseObj.firestore.FieldValue.serverTimestamp(),
                    });

                    const notificationQuery =
                      functions.httpsCallable("sendNotification");

                    await notificationQuery({
                      payload: {
                        notification: {
                          title: "Dispute Initiated",
                          body: "Buyer initiated a dispute, check your email ⚠",
                        },
                        data: {
                          channelId: "transactions-notifications",
                        },
                      },
                      uid: props.seller,
                    });

                    const mailQueryV = functions.httpsCallable("sendMail");

                    await mailQueryV({
                      to: props.seller,
                      from: {
                        email: "sales@tcmarket.place",
                        name: "TCM",
                      },
                      templateId: "d-aa2838060fa344439c2a24e301e34420",
                      subject: "Dispute Initiated",
                      dynamicTemplateData: {
                        order_id: props.id,
                      },
                    });
                    const mailQueryB = functions.httpsCallable("sendMail");

                    await mailQueryB({
                      to: props.buyer,
                      from: {
                        email: "sales@tcmarket.place",
                        name: "TCM",
                      },
                      templateId: "d-6ee0863df5574ba8a9fd46def9d44c10",
                      subject: "Dispute Initiated",
                      dynamicTemplateData: {
                        order_id: props.id,
                      },
                    });

                    setActivityIndicator(false);
                    setShowModal(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#FAFAFA",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              ) : null}

              {activityIndicator ? (
                <ActivityIndicator
                  size={30}
                  color="#0082ff"
                  animating={activityIndicator}
                  style={{
                    marginRight: 14,
                    marginLeft: 18,
                  }}
                />
              ) : (
                <TouchableOpacity
                  style={{
                    width: 76,
                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: "transparent",
                    borderRadius: 3,
                    borderColor: "#5c5c5c",
                    borderWidth: 2,

                    marginRight: 22,
                  }}
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#5c5c5c",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const navigation = useNavigation();

  const renderDisputeButton = () => {
    if (showDisputeButton) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            paddingVertical: 9,
            backgroundColor: "#D80000",
            borderRadius: 5,

            marginRight: 12,
            marginBottom: 24,
            marginTop: 12,
          }}
          onPress={() => {
            setShowModal(true);
          }}
        >
          <Text
            style={{
              color: "#FAFAFA",
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            Initiate Dispute
          </Text>
        </TouchableOpacity>
      );
    }
    //
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#1b1b1b",
        paddingLeft: 12,
        paddingBottom: 22,
      }}
    >
      {showModal ? disputeModal() : null}
      {props.status === "disputed" ? (
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 4,

            backgroundColor: "#5c0000",
            marginTop: 12,
            width: "98%",
          }}
        >
          <IconI name={"warning"} color={"#ff0000"} size={38} />
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                color: "#D80000",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Dispute in progress
            </Text>
            <Text
              style={{
                color: "#D80000",
                fontSize: 13,
              }}
            >
              Follow the instructions sent by email
            </Text>
          </View>
        </View>
      ) : null}
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

              justifyContent: "space-between",

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
                marginRight: 12,
              }}
            >
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
                  Start Chat
                </Text>
                <IconMCI
                  name={"message"}
                  size={17}
                  style={{ color: "#121212" }}
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
                onPress={() => {
                  navigation.navigate("SellerStack", {
                    screen: "OtherSellersOffers",
                    params: {
                      sellerId:
                        props.seller === auth.currentUser.uid
                          ? props.buyer
                          : props.seller,
                    },
                  });
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
                  name={"cards"}
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
          marginTop: 12,
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
              {props.shipping.address.city}, {props.shipping.address.state},{" "}
              {props.shipping.address.zipCode}
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
              {props.shipping.sent ? sentDate : "-"}
            </Text>
            <Text
              style={{
                color: "#565656",
                fontFamily: "Roboto_Medium",
                fontSize: 12,

                marginBottom: 4,
              }}
            >
              DELIVERED
            </Text>
            <Text style={{ color: "#f4f4f4", marginLeft: 6, marginBottom: 6 }}>
              {props.shipping.delivered ? deliveryDate : "-"}
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

          marginBottom: 12,
        }}
      >
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
      {props.buyer === auth.currentUser.uid ? renderDisputeButton() : null}
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
