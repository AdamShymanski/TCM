import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Share,
} from "react-native";

import { Snackbar } from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import IconO from "react-native-vector-icon/Octoicons";

import { ShareModal } from "./../shared/Modals/ShareModal";

import { auth, db } from "../authContext";

export default function ReferralProgram() {
  const [snackbarState, setSnackbarState] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [modalMode, setModalMode] = useState("code");
  const [data, setData] = useState({ ACVYC: 0, DONP: 0, TDR: 0 });

  useEffect(() => {
    const resolvePromise = async () => {
      let ACVYC = 0;
      let DONP = 0;
      let TDR = 0;

      const doc = await db.collection("users").doc(auth.currentUser.uid).get();

      doc.data()?.discounts.referralProgram.forEach((item) => {
        ACVYC++;
        db.collection("users")
          .doc(item.uid)
          .get()
          .then((doc) => {
            if (doc.data()?.sellerProfile?.statistics?.purchases > 0) {
              if (item.used === false) DONP += 2;
              TDR += 2;
            }
          });
      });

      setData({ ACVYC: ACVYC, DONP: DONP, TDR: TDR });
    };
    resolvePromise();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#1b1b1b", paddingLeft: "2%" }}
    >
      {modalState ? (
        <ShareModal
          setModal={setModalState}
          setSnackbarState={setSnackbarState}
          mode={modalMode}
        />
      ) : null}

      <Text
        style={{
          width: "96%",

          fontSize: 16,
          color: "#f4f4f4",
          fontFamily: "Roboto_Medium",

          marginTop: 12,
          marginLeft: 12,
        }}
      >
        Invite a friend to create a{" "}
        <Text style={{ fontWeight: "700", color: "#0082ff" }}>
          PTCG Marketplace
        </Text>{" "}
        account
      </Text>
      <Text
        style={{
          width: "94%",

          fontSize: 12,
          color: "#f4f4f4",
          fontFamily: "Roboto_Medium",

          marginTop: 12,
          marginLeft: 12,
        }}
      >
        <Text style={{ fontWeight: "700", color: "#0082ff" }}>- </Text>In
        return, receive{" "}
        <Text style={{ fontWeight: "700", color: "#0082ff" }}>2 USD</Text> or
        <Text style={{ fontWeight: "700", color: "#0082ff" }}>
          {" "}
          HIGHER
        </Text>{" "}
        discount for next purchase
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#121212",
          width: "96%",
          padding: 14,
          marginTop: 22,
          borderRadius: 5,
        }}
      >
        <View style={{ width: "68%" }}>
          <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 16 }}>
            Send referral code or link to yor firends{" "}
          </Text>
          <Text
            style={{
              color: "#ADADAD",
              fontSize: 12,
              marginTop: 8,
              paddingRight: 8,
            }}
          >
            <Text style={{ color: "#0082ff" }}>- </Text>
            Your friend has to enter your code on account sign up. If they open
            the app through a link, the code will be entered automatically.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 18,
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 5,
                backgroundColor: "#0082ff",
                borderRadius: 4,
              }}
              onPress={() => {
                setModalMode("code");
                setModalState(true);
              }}
            >
              <Text style={{ fontWeight: "700" }}>Referral Code</Text>
            </TouchableOpacity>
            {/* <Text
              style={{
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",
                marginHorizontal: 8,
              }}
            >
              or
            </Text>
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 5,
                backgroundColor: "#0082ff",
                borderRadius: 4,
              }}
              onPress={() => {
                setModalMode("link");
                setModalState(true);
              }}
            >
              <Text style={{ fontWeight: "700" }}>Referral Deeplink</Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View
          style={{ width: "32%", alignItems: "flex-end", paddingRight: "2%" }}
        >
          <Icon name={"share-variant"} size={100} color="#1B1B1B" />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#121212",
          width: "96%",
          padding: 14,
          marginTop: 22,
          borderRadius: 5,
        }}
      >
        <View style={{ width: "68%" }}>
          <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 16 }}>
            Your friend must make a purchase
          </Text>
          <Text
            style={{
              color: "#ADADAD",
              fontSize: 12,
              marginTop: 8,
              paddingRight: 8,
            }}
          >
            <Text style={{ color: "#0082ff" }}>- </Text>
            Your friend can make a purchase whenever they want, you will only
            receive the reward after their transaction is complete.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 18,
            }}
          >
            <View style={{ marginRight: 16 }}>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                }}
              >
                ACCOUNTS CREATED
              </Text>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 12,
                }}
              >
                WITH YOUR CODE
              </Text>
            </View>

            <Text style={{ fontSize: 34, fontWeight: "700", color: "#05FD00" }}>
              {data.ACVYC}
            </Text>
          </View>
        </View>

        <View
          style={{ width: "32%", alignItems: "flex-end", paddingRight: "2%" }}
        >
          <Icon name={"cart-outline"} size={100} color="#1B1B1B" />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#121212",
          width: "96%",
          padding: 14,
          marginTop: 22,
          borderRadius: 5,
          marginBottom: 28,
        }}
      >
        <View style={{ width: "68%" }}>
          <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 16 }}>
            Receive and enjoy the discount{" "}
          </Text>
          <Text
            style={{
              color: "#ADADAD",
              fontSize: 12,
              marginTop: 8,
              paddingRight: 8,
            }}
          >
            <Text style={{ color: "#0082ff" }}>- </Text>
            Congratulations, you have received your award. You don't have to use
            it right away. The discount will add up, it will be used
            automatically on your next purchase. Enjoy your shopping.
          </Text>
          <View
            style={{
              marginTop: 18,
            }}
          >
            <Text
              style={{
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",
                fontSize: 12,
              }}
            >
              DISCOUNT ON NEXT PURCHASE
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",

                marginLeft: 8,
                marginTop: 4,
              }}
            >
              {data.DONP}
              <Text
                style={{
                  color: "#0082ff",
                }}
              >
                {" "}
                USD
              </Text>
            </Text>

            <Text
              style={{
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",
                fontSize: 12,
                marginTop: 6,
              }}
            >
              TOTAL DISCOUNT RECEIVED
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",

                marginLeft: 8,
                marginTop: 4,
              }}
            >
              {data.TDR}
              <Text
                style={{
                  color: "#0082ff",
                }}
              >
                {" "}
                USD
              </Text>
            </Text>
          </View>
        </View>
        <View
          style={{ width: "32%", alignItems: "flex-end", paddingRight: "2%" }}
        >
          <Icon name={"sale"} size={100} color="#1B1B1B" />
        </View>
      </View>
      <Snackbar
        visible={snackbarState}
        duration={2000}
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
