import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";

import { TextInput } from "react-native-paper";
import { db, firebaseObj, functions, auth } from "../../authContext";

export default function AddTrackigNumberModal({ id, setModal }) {
  const [error, setError] = useState("");
  const [activityIndicator, setActivityIndicator] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

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
            width: "84%",
            backgroundColor: "#121212",
            borderRadius: 8,
            paddingVertical: 18,
            paddingLeft: 20,
          }}
        >
          <Text style={{ color: "#f4f4f4", fontSize: 26, fontWeight: "700" }}>
            Tracking Number
          </Text>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              width: "90%",
              marginTop: 10,
            }}
          >
            When you add the tracking number, it will indicate that the package
            has been shipped.
          </Text>
          <TextInput
            autoCapitalize="none"
            mode={"outlined"}
            value={trackingNumber}
            onChangeText={(value) => {
              setTrackingNumber(value);
            }}
            label="Tracking Number"
            outlineColor={"#5c5c5c"}
            error={false}
            style={{
              width: "90%",
              backgroundColor: "#121212",
              color: "#f4f4f4",
              marginTop: 20,
            }}
            theme={{
              colors: {
                primary: "#0082ff",
                placeholder: "#5c5c5c",
                background: "transparent",
                text: "#f4f4f4",
              },
            }}
          />
          {error ? (
            <Text
              style={{
                color: "#b40424",
                fontWeight: "700",
                marginTop: 8,
                marginRight: 16,
              }}
            >
              {error}
            </Text>
          ) : null}

          <View
            style={{
              width: "90%",
              flexDirection: "row-reverse",
              marginBottom: 8,
              paddingTop: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "90%",
                flexDirection: "row-reverse",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "#0082FF",
                  borderRadius: 3,
                  paddingHorizontal: 20,
                }}
                disabled={activityIndicator}
                onPress={async () => {
                  try {
                    setActivityIndicator(true);

                    await db
                      .collection("transactions")
                      .doc(id)
                      .get()
                      .then((doc) => {
                        const notificationQuery =
                          functions.httpsCallable("sendNotification");

                        notificationQuery({
                          payload: {
                            notification: {
                              title: "Shipment Sent",
                              body: "The order has been shipped 🚀",
                            },
                            data: {
                              channelId: "transactions-notifications",
                            },
                          },
                          uid: doc.data().buyer,
                        });

                        const mailQuery = functions.httpsCallable("sendMail");

                        mailQuery({
                          to: doc.data().buyer,
                          from: {
                            email: "sales@tcmarket.place",
                            name: "TCM",
                          },
                          templateId: "d-b76ecdbfa7ca44d9a90a6c6788e6d863",
                          subject: "Shipment Sent",
                          dynamicTemplateData: {
                            order_id: id,
                          },
                        });
                      });

                    await db
                      .collection("transactions")
                      .doc(id)
                      .update({
                        ["shipping.sent"]:
                          firebaseObj.firestore.FieldValue.serverTimestamp(),
                        ["shipping.trackingNumber"]: trackingNumber.trim(),
                        ["status"]: "sent",
                      });

                    setActivityIndicator(false);
                    setModal(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
              {activityIndicator ? (
                <ActivityIndicator
                  size={30}
                  color="#0082ff"
                  animating={activityIndicator}
                  style={{
                    marginRight: 14,
                  }}
                />
              ) : (
                <TouchableOpacity
                  style={{
                    height: 30,

                    marginRight: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    borderColor: "#5c5c5c",
                    borderWidth: 2,

                    borderRadius: 3,
                    paddingHorizontal: 20,
                  }}
                  onPress={() => {
                    setModal(false);
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
      </View>
    </Modal>
  );
}
