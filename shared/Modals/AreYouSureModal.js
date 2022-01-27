import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";

import * as Google from "expo-google-app-auth";
import { googleReSignIn } from "../../authContext";

export const AreYouSureModal = ({ setReauthenticationResult, setModal }) => {
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const reSignIn = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "352773112597-2s89t2icc0hfk1tquuvj354s0aig0jq2.apps.googleusercontent.com",
        androidStandaloneAppClientId: `352773112597-2s89t2icc0hfk1tquuvj354s0aig0jq2.apps.googleusercontent.com`,
        scopes: ["profile", "email"],
      });

      return await googleReSignIn(result);
    } catch (e) {
      if (e.code == "auth/email-already-in-use") {
        console.log("Duplicated emails has been detected");
      } else {
        console.log(e);
      }
    }
  };
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
            Are You Sure?
          </Text>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              width: "90%",
              marginTop: 10,
            }}
          >
            If you choose to delete your account, you will not be able to
            recover the lost data later.
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
                if (await reSignIn()) {
                  setModal(false);
                  setReauthenticationResult(true);
                }
                setLoadingIndicator(false);
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
            ) : null}
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
                setReauthenticationResult(false);
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
          </View>
        </View>
      </View>
    </Modal>
  );
};
