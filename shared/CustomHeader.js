import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconM from "react-native-vector-icons/MaterialIcons";
import IconF from "react-native-vector-icons/Feather";

import { fetchCards } from "../authContext";

export default function CustomHeader({ version, props, setProps }) {
  const searchForCard = async () => {
    setProps((prevState) => ({
      ...prevState,
      loadingState: true,
    }));
    await fetchCards(props, setProps);
    setProps((prevState) => ({
      ...prevState,
      pageNumber: 2,
      loadingState: false,
    }));
  };

  const openMenu = () => {
    navigation.openDrawer();
  };

  const navigation = useNavigation();
  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Search for a card by name"
  );

  if (version == "savedOffers") {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons
          name="menu"
          size={28}
          color={"#f4f4f4"}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: "#f4f4f4",
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 4,
            }}
          >
            {"Saved Offers"}
          </Text>
          <Icon
            name="bookmark"
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }
  if (version == "settings") {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons
          name="menu"
          size={28}
          color={"#f4f4f4"}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: "#f4f4f4",
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 8,
            }}
          >
            {"Settings"}
          </Text>
          <IconF
            name="settings"
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }
  if (version == "orders") {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons
          name="menu"
          size={28}
          color={"#f4f4f4"}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: "#f4f4f4",
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 8,
            }}
          >
            {"Orders"}
          </Text>
          <Icon
            name="cart-outline"
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }
  if (version == "chatConversations") {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons
          name="menu"
          size={28}
          color={"#f4f4f4"}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: "#f4f4f4",
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 8,
            }}
          >
            {"Chat"}
          </Text>
          <IconM
            name="chat-bubble"
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }
  if (version == "chat") {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons
          name="menu"
          size={28}
          color={"#f4f4f4"}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: "#f4f4f4",
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 8,
            }}
          >
            {"Chat"}
          </Text>
          <IconM
            name="chat-bubble-outline"
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }
  if (version == "yourOffers") {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons
          name="menu"
          size={28}
          color={"#f4f4f4"}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: "#f4f4f4",
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 8,
            }}
          >
            {"Your Offers"}
          </Text>
          <Icon name="cards" color={"#0082ff"} size={30} />
        </View>
      </View>
    );
  }
  if (version == "searchForSeller") {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons
          name="menu"
          size={28}
          color={"#f4f4f4"}
          onPress={() => {
            openMenu();
          }}
          style={{
            color: "#f4f4f4",
            marginLeft: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 8,
            }}
          >
            {"Sellers"}
          </Text>
          <Icon name="account-cash" color={"#0082ff"} size={30} />
        </View>
      </View>
    );
  }
  if (version == "home") {
    useEffect(async () => {
      searchForCard();
    }, [props.sorterParams]);

    return (
      <View style={styles.header}>
        <MaterialIcons
          name="menu"
          size={28}
          color={"#f4f4f4"}
          onPress={() => {
            openMenu();
          }}
          style={styles.icon}
        />
        <View style={styles.headerTitle}>
          <TextInput
            mode="outlined"
            placeholderTextColor={"#5c5c5c"}
            outlineColor={"#121212"}
            onEndEditing={() => {
              searchForCard();
            }}
            value={props.inputValue}
            onChangeText={(text) => {
              setProps((prevState) => ({ ...prevState, inputValue: text }));
            }}
            placeholder={inputPlaceholder}
            onFocus={() => {
              setInputPlaceholder("");
              setProps((prevState) => ({
                ...prevState,
                inputFocusState: true,
              }));
            }}
            onBlur={() => {
              setInputPlaceholder("Seach for a card by name");
              setProps((prevState) => ({
                ...prevState,
                inputFocusState: false,
              }));
            }}
            style={{
              width: 260,
              height: 40,
              marginBottom: 5,
              borderColor: "#121212",
              backgroundColor: "#1b1b1b",
              borderWidth: 2,
              borderRadius: 5,
              paddingLeft: 10,
              color: "#f4f4f4",
            }}
          />
          <MaterialIcons
            name="search"
            size={26}
            color={"#f4f4f4"}
            style={{ position: "absolute", right: 14, top: 8 }}
          />
        </View>
      </View>
    );
  }
}

// export default withNavigation(Header);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
  },
  header: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 1,
  },
  icon: {
    position: "absolute",
    left: 16,
    color: "#f4f4f4",
  },
  headerTitle: {
    position: "absolute",
    right: 16,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: 26,
    height: 26,
    marginHorizontal: 10,
  },
});
