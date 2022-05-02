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
    nick: "",
    countryCode: "",
    sellerProfile: {
      avgRating: 0,
      statistics: {
        numberOfOffers: 0,
      },
    },
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
          // setNotificationState(!snapshot.data().lastSupportMessageReaded);
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
              <Title style={styles.title}>{owner.nick}</Title>
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  {owner.sellerProfile.statistics.numberOfOffers}
                </Paragraph>
                <Caption style={styles.caption}>Cards</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  <Text>
                    {owner.sellerProfile.avgRating
                      ? owner.sellerProfile.avgRating
                      : "-"}
                  </Text>
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
                navigation.navigate("HomeStack");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="cart-outline" color={"#f4f4f4"} size={size} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Cart"
              onPress={() => {
                navigation.navigate("CartStack", { screen: "Cart" });
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="bookmark-outline" color={"#f4f4f4"} size={size} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Saved Offers"
              onPress={() => {
                navigation.navigate("SavedOffersStack");
              }}
            />
            {/* <DrawerItem
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
                navigation.navigate("Chat");
              }}
            /> */}
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="swap-vertical" color={"#f4f4f4"} size={size} />
              )}
              labelStyle={{ color: "#f4f4f4" }}
              label="Transactions"
              onPress={() => {
                navigation.navigate("TransactionsStack");
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
        <Drawer.Section
          style={styles.bottomDrawerSection}
          title={
            <Text
              style={{
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",
              }}
            >
              Selling
            </Text>
          }
        >
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account-cash-outline" color={"#f4f4f4"} size={size} />
            )}
            labelStyle={{ color: "#f4f4f4" }}
            label="Seller Profile"
            onPress={() => {
              navigation.navigate("SellerStack", {
                screen: "WorkInProgress",
              });
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="cards-outline" color={"#f4f4f4"} size={size} />
            )}
            labelStyle={{ color: "#f4f4f4" }}
            label="Your Offers"
            onPress={() => {
              navigation.navigate("YourOffersStack", {
                screen: "WorkInProgress",
              });
            }}
          />
        </Drawer.Section>
        <Drawer.Section
          style={styles.bottomDrawerSection}
          title={
            <Text
              style={{
                color: "#5c5c5c",
                fontFamily: "Roboto_Medium",
              }}
            >
              Other
            </Text>
          }
        >
          <DrawerItem
            icon={({ color, size }) => (
              <IconF name="settings" color={"#f4f4f4"} size={size - 4} />
            )}
            labelStyle={{ color: "#f4f4f4" }}
            label="Settings"
            onPress={() => {
              navigation.navigate("SettingsStack");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="script-text-outline"
                color={"#f4f4f4"}
                size={size - 4}
              />
            )}
            labelStyle={{ color: "#f4f4f4" }}
            label="Terms & Conditions"
            onPress={() => {
              navigation.navigate("TermsConditionsStack");
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
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
