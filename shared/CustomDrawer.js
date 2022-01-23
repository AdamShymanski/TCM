import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import {
  useTheme,
  Title,
  Caption,
  Paragraph,
  Drawer,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { CommonActions } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconM from "react-native-vector-icons/MaterialIcons";
import IconF from "react-native-vector-icons/Feather";

import {
  db,
  auth,
  fetchOwnerData,
  checkForUnreadedMessages,
} from "../authContext";

export default function CustomDrawer({ navigation }) {
  const [owner, setOwner] = useState({
    name: "",
    reputation: 0,
    collectionSize: 0,
    countryCode: "",
  });
  const [notificationState, setNotificationState] = useState(false);

  useEffect(() => {
    const resolvePromises = async () => {
      setOwner(await fetchOwnerData(auth.currentUser.uid));
      setNotificationState(await checkForUnreadedMessages());
    };

    const chatNotificationListener = () => {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .onSnapshot((snapshot) => {
          setNotificationState(!snapshot.data().lastSupportMessageReaded);
        });
    };

    resolvePromises();
    return chatNotificationListener();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <DrawerContentScrollView style={{ backgroundColor: "#121212" }}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <View
                style={{
                  backgroundColor: "#1b1b1b",
                  padding: 14,
                  paddingVertical: 8,
                  borderRadius: 3,
                }}
              >
                <Image
                  style={{ width: 26, height: 22 }}
                  source={{
                    uri: `https://flagcdn.com/32x24/${owner.countryCode}.png`,
                  }}
                />
              </View>
              <Title style={styles.title}>{owner.name}</Title>
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  {owner.collectionSize}
                </Paragraph>
                <Caption style={styles.caption}>Cards</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  -
                </Paragraph>
                <Caption style={styles.caption}>Rating</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={"#f4f4f4"} size={size} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Home"
              onPress={() => {
                navigation.navigate("Home");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="account-cash-outline"
                  color={"#f4f4f4"}
                  size={size}
                />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Sellers"
              onPress={() => {
                navigation.navigate("Sellers", { screen: "SearchForSeller" });
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="cart-outline" color={"#f4f4f4"} size={size} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Cart"
              onPress={() => {
                navigation.navigate("Cart");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="swap-vertical" color={"#f4f4f4"} size={size} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Transactions"
              onPress={() => {
                navigation.navigate("Transactions");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="bookmark-outline" color={"#f4f4f4"} size={size} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Saved Offers"
              onPress={() => {
                navigation.navigate("SavedOffers");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="cards-outline" color={"#f4f4f4"} size={size} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Your Offers"
              onPress={() => {
                navigation.navigate("YourOffers");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => {
                if (notificationState) {
                  return (
                    <View>
                      <View
                        style={{
                          backgroundColor: "#ed400b",
                          width: 10,
                          height: 10,
                          borderRadius: 8,
                          top: 9,
                          left: 14,
                          zIndex: 2,
                        }}
                      />
                      <IconM
                        name="chat-bubble-outline"
                        color={"#f4f4f4"}
                        size={size - 2}
                        style={{ zIndex: 1 }}
                      />
                    </View>
                  );
                } else {
                  return (
                    <IconM
                      name="chat-bubble-outline"
                      color={"#f4f4f4"}
                      size={size - 2}
                    />
                  );
                }
              }}
              labelStyle={{ color: "#f4f4f4" }}
              label="Chat"
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Chat" }],
                });

                navigation.navigate("Chat", { screen: "ChatConversations" });
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <IconF name="settings" color={"#f4f4f4"} size={size - 4} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Settings"
              onPress={() => {
                navigation.navigate("Settings");
              }}
            />
            {/* <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name='account-check-outline'
                  color={'#f4f4f4'}
                  size={size}
                />
              )}
              labelStyle={{ color: '#f4f4f4' }}
              label='Support'
              onPress={() => {
                // props.navigation.navigate('SupportScreen');
              }}
            /> */}
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          // icon={({ color, size }) => (
          //   <Icon name="exit-to-app" color={"#f4f4f4"} size={size} />
          // )}
          labelStyle={{
            color: "#121212",
            textAlign: "center",
            justifyContent: "center",
          }}
          label="Terms & Conditions"
          labelStyle={{ color: "#7c7c7c" }}
          // onPress={() => {
          //   auth.signOut();
          // }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    color: "#121212",
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 18,
    marginTop: 3,
    fontWeight: "bold",
    color: "#f4f4f4",
    paddingLeft: 16,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: "#5c5c5c",
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
    color: "#f4f4f4",
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 10,
    // borderTopColor: "#5c5c5c",
    // borderTopWidth: 2,
    backgroundColor: "#121212",
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
