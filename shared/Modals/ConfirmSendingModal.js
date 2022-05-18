import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";

import { db, firebaseObj } from "../../authContext";

export default function ConfirmSendingModal({ id, setModal }) {
  const [loadingIndicator, setLoadingIndicator] = useState(false);

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
            Confirm Sending
          </Text>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              width: "90%",
              marginTop: 10,
            }}
          >
            If you have sent the package to the buyer click submit, the
            transaction status will change to "In Transist".
          </Text>
          <View
            style={{
              flexDirection: "row-reverse",
              marginTop: 32,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: 84,
                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#0082FF",
                borderRadius: 3,
              }}
              onPress={async () => {
                setLoadingIndicator(true);
                await db
                  .collection("transactions")
                  .doc(id)
                  .update({
                    ["shipping.sent"]:
                      firebaseObj.firestore.FieldValue.serverTimestamp(),
                  });

                setLoadingIndicator(false);
                setModal(null);
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
            {loadingIndicator ? (
              <ActivityIndicator
                size={30}
                color="#0082ff"
                animating={loadingIndicator}
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
                  setModal(null);
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
}
