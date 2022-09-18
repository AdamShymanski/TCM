import React, { useEffect, useState } from "react";

import { Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
  View,
  Text,
  FlatList,
  Clipboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from "react-native";

import {
  auth,
  changeEmail,
  fetchUserData,
  deleteAccount,
  googleReSignIn,
  updateUserData,
} from "../authContext";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import Chats from "../screens/subscreens/Messages/Chats";
import Mails from "../screens/subscreens/Messages/Mails";
import Disputes from "../screens/subscreens/Messages/Disputes";

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [snackbarState, setSnackbarState] = useState(false);

  const [pageState, setPageState] = useState("chats");

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1b1b1b",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0082ff" />
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1b1b1b",
        }}
      >
        <View
          style={{
            backgroundColor: "#2B2B2B",
            width: "100%",
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
              paddingHorizontal: 18,
              backgroundColor:
                pageState === "chats" ? "#0082ff" : "transparent",
              flexShrink: 1,
              borderRadius: 4,
            }}
            onPress={() => {
              setPageState("chats");
            }}
          >
            <Text
              style={{
                color: pageState === "chats" ? "#121212" : "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 14,
              }}
            >
              Chats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
              paddingHorizontal: 18,
              backgroundColor:
                pageState === "disputes" ? "#0082ff" : "transparent",
              flexShrink: 1,
              borderRadius: 4,
            }}
            onPress={() => {
              setPageState("disputes");
            }}
          >
            <Text
              style={{
                color: pageState === "disputes" ? "#121212" : "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 14,
              }}
            >
              Disputes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
              paddingHorizontal: 18,
              backgroundColor:
                pageState === "mails" ? "#0082ff" : "transparent",
              flexShrink: 1,
              borderRadius: 4,
            }}
            onPress={() => {
              setPageState("mails");
            }}
          >
            <Text
              style={{
                color: pageState === "mails" ? "#121212" : "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 14,
              }}
            >
              Mails
            </Text>
          </TouchableOpacity>
        </View>
        {pageState === "chats" ? <Chats /> : null}
        {pageState === "disputes" ? <Disputes /> : null}
        {pageState === "mails" ? <Mails /> : null}

        <Snackbar
          visible={snackbarState}
          duration={2000}
          onDismiss={() => setSnackbarState(false)}
          action={{
            label: "",
            onPress: () => {},
          }}
        >
          Account ID is copied to clipboard
        </Snackbar>
      </View>
    );
  }
}
