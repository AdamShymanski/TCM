import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, Image } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { fetchCards } from "../authContext";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconM from "react-native-vector-icons/MaterialIcons";
import IconF from "react-native-vector-icons/Feather";

import referral_program_icon from "../assets/referral_program.png";
import tcm_logo from "../assets/TCM.png";
import { async } from "./../authContext";

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
    "Card number or Name"
  );

  if (version == "workInProgress") {
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 10,
            }}
          >
            {"Work In Progress"}
          </Text>
          <Icon name={"hammer-wrench"} size={28} color={"#0082ff"} />
        </View>
      </View>
    );
  }

  if (version == "referralProgram") {
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 21,
              marginRight: 10,
            }}
          >
            {"Referral Program"}
          </Text>
          <Image
            source={referral_program_icon}
            style={{
              marginRight: 8,
              aspectRatio: 46 / 43,
              width: undefined,
              height: 26,
            }}
          />
        </View>
      </View>
    );
  }

  if (version == "sellerProfile") {
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            {"Seller Profile"}
          </Text>
          <Icon
            name="account-cash"
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
          <Icon
            name="cog"
            color={"#0082ff"}
            size={30}
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
    );
  }
  if (version == "cart") {
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            {"Cart"}
          </Text>
          <Icon
            name="cart"
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
  if (version == "transactions") {
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            {"Transactions"}
          </Text>
          <Icon name="swap-vertical" color={"#0082ff"} size={30} />
        </View>
      </View>
    );
  }
  if (version == "messages") {
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            {"Messages"}
          </Text>
          <Icon name="message" color={"#0082ff"} size={30} />
        </View>
      </View>
    );
  }
  if (version == "newSearch") {
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
            marginLeft: 6,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
            {"Search"}
          </Text>
          <Icon name="magnify" color={"#0082ff"} size={30} />
        </View>
      </View>
    );
  }

  if (version == "home") {
    // useEffect(async () => {
    //   searchForCard();
    // }, [props.sorterParams]);

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
            marginLeft: 6,
          }}
        />

        {/* <View
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
            {"PTCGM"}
          </Text>
          <Icon name="swap-vertical" color={"#0082ff"} size={30} />
        </View> */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#5C5C5C",
              fontWeight: "700",
              fontSize: 14,
              marginRight: 12,
            }}
          >
            {"Welcome to"}
          </Text>
          <Image
            source={tcm_logo}
            style={{ aspectRatio: 640 / 315, width: undefined, height: 28 }}
          />
        </View>
      </View>
    );
  }
  if (version == "search") {
    useEffect(() => {
      const resolvePromise = async () => await searchForCard();
      resolvePromise();
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
            autoCapitalize="none"
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
              setInputPlaceholder("Card number or Name");
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
    left: 6,
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
