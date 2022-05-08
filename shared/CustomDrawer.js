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

const countryCodes = [
  { Code: "AF", Name: "Afghanistan" },
  { Code: "AL", Name: "Albania" },
  { Code: "DZ", Name: "Algeria" },
  { Code: "AS", Name: "American Samoa" },
  { Code: "AD", Name: "Andorra" },
  { Code: "AO", Name: "Angola" },
  { Code: "AI", Name: "Anguilla" },
  { Code: "AQ", Name: "Antarctica" },
  { Code: "AG", Name: "Antigua and Barbuda" },
  { Code: "AR", Name: "Argentina" },
  { Code: "AM", Name: "Armenia" },
  { Code: "AW", Name: "Aruba" },
  { Code: "AU", Name: "Australia" },
  { Code: "AT", Name: "Austria" },
  { Code: "AZ", Name: "Azerbaijan" },
  { Code: "BS", Name: "Bahamas" },
  { Code: "BH", Name: "Bahrain" },
  { Code: "BD", Name: "Bangladesh" },
  { Code: "BB", Name: "Barbados" },
  { Code: "BY", Name: "Belarus" },
  { Code: "BE", Name: "Belgium" },
  { Code: "BZ", Name: "Belize" },
  { Code: "BJ", Name: "Benin" },
  { Code: "BM", Name: "Bermuda" },
  { Code: "BT", Name: "Bhutan" },
  { Code: "BW", Name: "Botswana" },
  { Code: "BV", Name: "Bouvet Island" },
  { Code: "BR", Name: "Brazil" },
  { Code: "IO", Name: "British Indian Ocean Territory" },
  { Code: "BN", Name: "Brunei Darussalam" },
  { Code: "BG", Name: "Bulgaria" },
  { Code: "BF", Name: "Burkina Faso" },
  { Code: "BI", Name: "Burundi" },
  { Code: "KH", Name: "Cambodia" },
  { Code: "CM", Name: "Cameroon" },
  { Code: "CA", Name: "Canada" },
  { Code: "CV", Name: "Cape Verde" },
  { Code: "KY", Name: "Cayman Islands" },
  { Code: "CF", Name: "Central African Republic" },
  { Code: "TD", Name: "Chad" },
  { Code: "CL", Name: "Chile" },
  { Code: "CN", Name: "China" },
  { Code: "CX", Name: "Christmas Island" },
  { Code: "CC", Name: "Cocos (Keeling) Islands" },
  { Code: "CO", Name: "Colombia" },
  { Code: "KM", Name: "Comoros" },
  { Code: "CG", Name: "Congo" },
  { Code: "CD", Name: "Congo, the Democratic Republic of the" },
  { Code: "CK", Name: "Cook Islands" },
  { Code: "CR", Name: "Costa Rica" },
  { Code: "HR", Name: "Croatia" },
  { Code: "CU", Name: "Cuba" },
  { Code: "CY", Name: "Cyprus" },
  { Code: "CZ", Name: "Czech Republic" },
  { Code: "DK", Name: "Denmark" },
  { Code: "DJ", Name: "Djibouti" },
  { Code: "DM", Name: "Dominica" },
  { Code: "DO", Name: "Dominican Republic" },
  { Code: "EC", Name: "Ecuador" },
  { Code: "EG", Name: "Egypt" },
  { Code: "SV", Name: "El Salvador" },
  { Code: "GQ", Name: "Equatorial Guinea" },
  { Code: "ER", Name: "Eritrea" },
  { Code: "EE", Name: "Estonia" },
  { Code: "ET", Name: "Ethiopia" },
  { Code: "FK", Name: "Falkland Islands (Malvinas)" },
  { Code: "FO", Name: "Faroe Islands" },
  { Code: "FJ", Name: "Fiji" },
  { Code: "FI", Name: "Finland" },
  { Code: "FR", Name: "France" },
  { Code: "GF", Name: "French Guiana" },
  { Code: "PF", Name: "French Polynesia" },
  { Code: "TF", Name: "French Southern Territories" },
  { Code: "GA", Name: "Gabon" },
  { Code: "GM", Name: "Gambia" },
  { Code: "GE", Name: "Georgia" },
  { Code: "DE", Name: "Germany" },
  { Code: "GH", Name: "Ghana" },
  { Code: "GI", Name: "Gibraltar" },
  { Code: "GR", Name: "Greece" },
  { Code: "GL", Name: "Greenland" },
  { Code: "GD", Name: "Grenada" },
  { Code: "GP", Name: "Guadeloupe" },
  { Code: "GU", Name: "Guam" },
  { Code: "GT", Name: "Guatemala" },
  { Code: "GG", Name: "Guernsey" },
  { Code: "GN", Name: "Guinea" },
  { Code: "GW", Name: "Guinea-Bissau" },
  { Code: "GY", Name: "Guyana" },
  { Code: "HT", Name: "Haiti" },
  { Code: "HM", Name: "Heard Island and McDonald Islands" },
  { Code: "VA", Name: "Holy See (Vatican City State)" },
  { Code: "HN", Name: "Honduras" },
  { Code: "HK", Name: "Hong Kong" },
  { Code: "HU", Name: "Hungary" },
  { Code: "IS", Name: "Iceland" },
  { Code: "IN", Name: "India" },
  { Code: "ID", Name: "Indonesia" },
  { Code: "IR", Name: "Iran, Islamic Republic of" },
  { Code: "IQ", Name: "Iraq" },
  { Code: "IE", Name: "Ireland" },
  { Code: "IM", Name: "Isle of Man" },
  { Code: "IL", Name: "Israel" },
  { Code: "IT", Name: "Italy" },
  { Code: "JM", Name: "Jamaica" },
  { Code: "JP", Name: "Japan" },
  { Code: "JE", Name: "Jersey" },
  { Code: "JO", Name: "Jordan" },
  { Code: "KZ", Name: "Kazakhstan" },
  { Code: "KE", Name: "Kenya" },
  { Code: "KI", Name: "Kiribati" },
  { Code: "KP", Name: "Korea, Democratic People's Republic of" },
  { Code: "KR", Name: "Korea, Republic of" },
  { Code: "KW", Name: "Kuwait" },
  { Code: "KG", Name: "Kyrgyzstan" },
  { Code: "LA", Name: "Lao People's Democratic Republic" },
  { Code: "LV", Name: "Latvia" },
  { Code: "LB", Name: "Lebanon" },
  { Code: "LS", Name: "Lesotho" },
  { Code: "LR", Name: "Liberia" },
  { Code: "LY", Name: "Libya" },
  { Code: "LI", Name: "Liechtenstein" },
  { Code: "LT", Name: "Lithuania" },
  { Code: "LU", Name: "Luxembourg" },
  { Code: "MO", Name: "Macao" },
  { Code: "MK", Name: "Macedonia, the Former Yugoslav Republic of" },
  { Code: "MG", Name: "Madagascar" },
  { Code: "MW", Name: "Malawi" },
  { Code: "MY", Name: "Malaysia" },
  { Code: "MV", Name: "Maldives" },
  { Code: "ML", Name: "Mali" },
  { Code: "MT", Name: "Malta" },
  { Code: "MH", Name: "Marshall Islands" },
  { Code: "MQ", Name: "Martinique" },
  { Code: "MR", Name: "Mauritania" },
  { Code: "MU", Name: "Mauritius" },
  { Code: "YT", Name: "Mayotte" },
  { Code: "MX", Name: "Mexico" },
  { Code: "FM", Name: "Micronesia, Federated States of" },
  { Code: "MD", Name: "Moldova, Republic of" },
  { Code: "MC", Name: "Monaco" },
  { Code: "MN", Name: "Mongolia" },
  { Code: "ME", Name: "Montenegro" },
  { Code: "MS", Name: "Montserrat" },
  { Code: "MA", Name: "Morocco" },
  { Code: "MZ", Name: "Mozambique" },
  { Code: "MM", Name: "Myanmar" },
  { Code: "NA", Name: "Namibia" },
  { Code: "NR", Name: "Nauru" },
  { Code: "NP", Name: "Nepal" },
  { Code: "NL", Name: "Netherlands" },
  { Code: "NC", Name: "New Caledonia" },
  { Code: "NZ", Name: "New Zealand" },
  { Code: "NI", Name: "Nicaragua" },
  { Code: "NE", Name: "Niger" },
  { Code: "NG", Name: "Nigeria" },
  { Code: "NU", Name: "Niue" },
  { Code: "NF", Name: "Norfolk Island" },
  { Code: "MP", Name: "Northern Mariana Islands" },
  { Code: "NO", Name: "Norway" },
  { Code: "OM", Name: "Oman" },
  { Code: "PK", Name: "Pakistan" },
  { Code: "PW", Name: "Palau" },
  { Code: "PS", Name: "Palestine, State of" },
  { Code: "PA", Name: "Panama" },
  { Code: "PG", Name: "Papua New Guinea" },
  { Code: "PY", Name: "Paraguay" },
  { Code: "PE", Name: "Peru" },
  { Code: "PH", Name: "Philippines" },
  { Code: "PN", Name: "Pitcairn" },
  { Code: "PL", Name: "Poland" },
  { Code: "PT", Name: "Portugal" },
  { Code: "PR", Name: "Puerto Rico" },
  { Code: "QA", Name: "Qatar" },
  { Code: "RO", Name: "Romania" },
  { Code: "RU", Name: "Russian Federation" },
  { Code: "RW", Name: "Rwanda" },
  { Code: "SH", Name: "Saint Helena, Ascension and Tristan da Cunha" },
  { Code: "KN", Name: "Saint Kitts and Nevis" },
  { Code: "LC", Name: "Saint Lucia" },
  { Code: "MF", Name: "Saint Martin (French part)" },
  { Code: "PM", Name: "Saint Pierre and Miquelon" },
  { Code: "VC", Name: "Saint Vincent and the Grenadines" },
  { Code: "WS", Name: "Samoa" },
  { Code: "SM", Name: "San Marino" },
  { Code: "ST", Name: "Sao Tome and Principe" },
  { Code: "SA", Name: "Saudi Arabia" },
  { Code: "SN", Name: "Senegal" },
  { Code: "RS", Name: "Serbia" },
  { Code: "SC", Name: "Seychelles" },
  { Code: "SL", Name: "Sierra Leone" },
  { Code: "SG", Name: "Singapore" },
  { Code: "SX", Name: "Sint Maarten (Dutch part)" },
  { Code: "SK", Name: "Slovakia" },
  { Code: "SI", Name: "Slovenia" },
  { Code: "SB", Name: "Solomon Islands" },
  { Code: "SO", Name: "Somalia" },
  { Code: "ZA", Name: "South Africa" },
  { Code: "GS", Name: "South Georgia and the South Sandwich Islands" },
  { Code: "SS", Name: "South Sudan" },
  { Code: "ES", Name: "Spain" },
  { Code: "LK", Name: "Sri Lanka" },
  { Code: "SD", Name: "Sudan" },
  { Code: "SR", Name: "Suriname" },
  { Code: "SJ", Name: "Svalbard and Jan Mayen" },
  { Code: "SZ", Name: "Swaziland" },
  { Code: "SE", Name: "Sweden" },
  { Code: "CH", Name: "Switzerland" },
  { Code: "SY", Name: "Syrian Arab Republic" },
  { Code: "TW", Name: "Taiwan, Province of China" },
  { Code: "TJ", Name: "Tajikistan" },
  { Code: "TZ", Name: "Tanzania, United Republic of" },
  { Code: "TH", Name: "Thailand" },
  { Code: "TL", Name: "Timor-Leste" },
  { Code: "TG", Name: "Togo" },
  { Code: "TK", Name: "Tokelau" },
  { Code: "TO", Name: "Tonga" },
  { Code: "TT", Name: "Trinidad and Tobago" },
  { Code: "TN", Name: "Tunisia" },
  { Code: "TR", Name: "Turkey" },
  { Code: "TM", Name: "Turkmenistan" },
  { Code: "TC", Name: "Turks and Caicos Islands" },
  { Code: "TV", Name: "Tuvalu" },
  { Code: "UG", Name: "Uganda" },
  { Code: "UA", Name: "Ukraine" },
  { Code: "AE", Name: "United Arab Emirates" },
  { Code: "GB", Name: "United Kingdom" },
  { Code: "US", Name: "United States" },
  { Code: "UM", Name: "United States Minor Outlying Islands" },
  { Code: "UY", Name: "Uruguay" },
  { Code: "UZ", Name: "Uzbekistan" },
  { Code: "VU", Name: "Vanuatu" },
  { Code: "VE", Name: "Venezuela, Bolivarian Republic of" },
  { Code: "VN", Name: "Viet Nam" },
  { Code: "VG", Name: "Virgin Islands, British" },
  { Code: "VI", Name: "Virgin Islands, U.S." },
  { Code: "WF", Name: "Wallis and Futuna" },
  { Code: "EH", Name: "Western Sahara" },
  { Code: "YE", Name: "Yemen" },
  { Code: "ZM", Name: "Zambia" },
  { Code: "ZW", Name: "Zimbabwe" },
];

export default function CustomDrawer({ navigation }) {
  const [owner, setOwner] = useState({
    nick: "Loading...",
    countryCode: "US",
    sellerProfile: {
      avgRating: 0,
      statistics: {
        numberOfOffers: 0,
      },
    },
  });

  useEffect(() => {
    const docListener = () => {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .onSnapshot((snapshot) => {
          let countryCode;

          countryCodes.forEach((item, i) => {
            if (item.Name == snapshot.data().country) {
              countryCode = countryCodes[i].Code.toLowerCase();
            }
          });

          setOwner({ countryCode: countryCode, ...snapshot.data() });
          // setNotificationState(!snapshot.data().lastSupportMessageReaded);
        });
    };

    return docListener();
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
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Chat" }],
                });

                navigation.navigate("Chat", { screen: "ChatConversations" });
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
                screen: "SellerProfile",
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
                screen: "YourOffers",
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
              // navigation.navigate("TermsConditionsStack");
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
