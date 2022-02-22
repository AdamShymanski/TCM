import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";

import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import cart_white_down_icon from "./../assets/cart_white_down.png";
import cart_white_up_icon from "./../assets/cart_white_up.png";

import { useNavigation } from "@react-navigation/native";

export default function SellerProfile() {
  const navigation = useNavigation();
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#1b1b1b",
        paddingLeft: 12,
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          width: "96%",

          paddingVertical: 14,

          backgroundColor: "#121212",
          borderRadius: 6,

          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ width: "50%", paddingLeft: 12 }}>
          <Text
            style={{
              color: "#5c5c5c",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
            }}
          >
            BALANCE
          </Text>
          <Text
            style={{
              marginTop: 10,
              marginLeft: 12,

              fontSize: 22,
              color: "#f4f4f4",
              fontWeight: "700",
            }}
          >
            3491 USD
          </Text>
          <TouchableOpacity
            style={{
              alignItems: "center",

              marginTop: 10,
              marginLeft: 12,
              paddingVertical: 5,
              width: "60%",

              borderRadius: 4,
              backgroundColor: "#0082ff",
            }}
          >
            <Text style={{ color: "#121212", fontWeight: "700" }}>
              Withdraw
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#5c5c5c",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
              marginTop: 24,
            }}
          >
            RECIPIENT'S DETAILS
          </Text>
          <Text
            style={{
              marginTop: 10,
              marginLeft: 12,

              fontSize: 12,
              color: "#f4f4f4",
            }}
          >
            Adam Szymański
          </Text>
          <Text
            style={{
              marginTop: 4,
              marginLeft: 12,

              fontSize: 12,
              color: "#f4f4f4",
            }}
          >
            Łódź, ul. Krasińskiego 1
          </Text>
          <Text
            style={{
              marginTop: 4,
              marginLeft: 12,

              fontSize: 12,
              color: "#f4f4f4",
            }}
          >
            92-446
          </Text>
          <Text
            style={{
              marginTop: 10,
              marginLeft: 12,

              fontSize: 12,
              color: "#f4f4f4",
            }}
          >
            +48 606417902
          </Text>
        </View>
        <View style={{ width: "50%" }}>
          <Text
            style={{
              color: "#5c5c5c",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            HISTORY
          </Text>
          <FlatList
            data={["a", "b", "c"]}
            ListFooterComponent={() => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Roboto_Medium",
                    fontSize: 14,
                    color: "#0082ff",
                  }}
                >
                  Details
                </Text>
                <IconMI
                  name="arrow-right-alt"
                  size={24}
                  color="#0082ff"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            )}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 3,
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: 14,
                  }}
                >
                  <View
                    style={{
                      width: 3,
                      height: 20,

                      borderRadius: 3,
                      backgroundColor: "#04BC00",
                    }}
                  />
                  <Text style={{ color: "#f4f4f4", fontSize: 12 }}>
                    + 12.45 USD
                  </Text>
                  <Text
                    style={{
                      color: "#04BC00",
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    SALE
                  </Text>
                  <Text style={{ color: "#939393", fontSize: 12 }}>
                    12.02.2022
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={
              <View
                style={{
                  width: "100%",
                  height: 600,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#0082ff" />
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 38,
        }}
      >
        <Text
          style={{
            color: "#f4f4f4",
            fontWeight: "700",
            fontSize: 24,
            marginRight: 12,
          }}
        >
          Shipping
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#0082ff",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 4,

            borderRadius: 3,
          }}
          onPress={() => navigation.navigate("AddNewShippingMethod")}
        >
          <Text
            style={{
              fontWeight: "700",
              color: "#121212",
            }}
          >
            Add New
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: "#5c5c5c",
          fontSize: 12,
          fontFamily: "Roboto_Medium",
          marginTop: 20,
          marginLeft: 12,
        }}
      >
        DOMESTIC
      </Text>
      <View
        style={{
          width: "90%",

          marginTop: 6,
          marginLeft: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,

          borderRadius: 3,
          backgroundColor: "#121212",

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
            fontWeight: "700",
          }}
        >
          USPS
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#939393",
          }}
        >
          First-Class
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
          }}
        >
          3 - 8 days
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
            fontWeight: "700",
          }}
        >
          16.99 USD
        </Text>
        <IconMI name={"edit"} color={"#0082ff"} size={17} />
      </View>
      <Text
        style={{
          color: "#5c5c5c",
          fontSize: 12,
          fontFamily: "Roboto_Medium",
          marginTop: 20,
          marginLeft: 12,
        }}
      >
        INTERNATIONAL
      </Text>
      <View
        style={{
          width: "90%",

          marginTop: 6,
          marginLeft: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,

          borderRadius: 3,
          backgroundColor: "#121212",

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
            fontWeight: "700",
          }}
        >
          USPS
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#939393",
          }}
        >
          First-Class
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
          }}
        >
          3 - 8 days
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#f4f4f4",
            fontWeight: "700",
          }}
        >
          16.99 USD
        </Text>
        <IconMI name={"edit"} color={"#0082ff"} size={17} />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 38,
        }}
      >
        <Text
          style={{
            color: "#f4f4f4",
            fontWeight: "700",
            fontSize: 24,
            marginRight: 12,
          }}
        >
          Rating
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#0082ff",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 4,

            borderRadius: 3,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              color: "#121212",
            }}
          >
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 12,
          color: "#5c5c5c",
          fontFamily: "Roboto_Medium",

          marginTop: 20,
          marginLeft: 12,
        }}
      >
        AVERAGE FROM 5 BUYERS
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          marginLeft: 12,
          marginTop: 8,
        }}
      >
        <IconMI name={"star"} size={18} color={"#f4f4f4"} />
        <IconMI name={"star"} size={18} color={"#f4f4f4"} />
        <IconMI name={"star"} size={18} color={"#f4f4f4"} />
        <IconMI name={"star"} size={18} color={"#f4f4f4"} />
        <IconMI name={"star-half"} size={18} color={"#f4f4f4"} />
        <Text style={{ color: "#f4f4f4", fontWeight: "700", marginLeft: 6 }}>
          4.2
        </Text>
      </View>
      <Text
        style={{
          fontSize: 12,
          color: "#5c5c5c",
          fontFamily: "Roboto_Medium",

          marginTop: 12,
          marginLeft: 12,
        }}
      >
        MOST RECENT
      </Text>

      <View
        style={{
          width: "90%",

          marginTop: 8,
          marginLeft: 12,

          paddingVertical: 12,
          paddingHorizontal: 14,

          borderRadius: 6,
          backgroundColor: "#121212",
          position: "relative",
        }}
      >
        <Text
          style={{ position: "absolute", right: 14, top: 12, color: "#5c5c5c" }}
        >
          12/12/2020
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#f4f4f4",
              fontWeight: "700",

              marginRight: 12,
            }}
          >
            Adam
          </Text>
          <IconMI name={"star"} size={18} color={"#0082ff"} />
          <IconMI name={"star"} size={18} color={"#0082ff"} />
          <IconMI name={"star"} size={18} color={"#0082ff"} />
          <IconMI name={"star"} size={18} color={"#0082ff"} />
          <IconMI name={"star-half"} size={18} color={"#0082ff"} />
        </View>
        <Text style={{ marginTop: 8, color: "#f4f4f4", fontSize: 12 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec
          libero quam. Nulla blandit bibendum bibendum. Etiam eros libero,
          tempus ac posuere blandit, congue sit amet ligula. Proin venenatis
          tortor vitae purus ornare feugiat. Praesent mi sapien, imperdiet sed
          eros eget, condimentum varius lectus.
        </Text>
      </View>
      <Text
        style={{
          color: "#f4f4f4",
          fontWeight: "700",
          fontSize: 24,
          marginTop: 38,

          marginRight: 12,
        }}
      >
        Statistics
      </Text>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <Text
          style={{
            fontSize: 12,
            color: "#5c5c5c",
            fontFamily: "Roboto_Medium",

            marginLeft: 12,
          }}
        >
          TOTAL SALES
        </Text>
        <Image
          source={cart_white_up_icon}
          style={{
            height: undefined,
            aspectRatio: 23 / 26,
            width: 16,
            marginRight: 8,
            marginLeft: 12,
          }}
        />
        <Text
          style={{
            color: "#f4f4f4",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          197
        </Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
      >
        <Text
          style={{
            fontSize: 12,
            color: "#5c5c5c",
            fontFamily: "Roboto_Medium",

            marginLeft: 12,
          }}
        >
          TOTAL PURCHASES
        </Text>
        <Image
          source={cart_white_down_icon}
          style={{
            height: undefined,
            aspectRatio: 23 / 26,
            width: 16,
            marginRight: 8,
            marginLeft: 12,
          }}
        />
        <Text
          style={{
            color: "#f4f4f4",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          197
        </Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
      >
        <Text
          style={{
            fontSize: 12,
            color: "#5c5c5c",
            fontFamily: "Roboto_Medium",
            marginLeft: 12,
          }}
        >
          NUMBER OF OFFERS
        </Text>
        <IconMCI
          name="cards-outline"
          size={17}
          style={{ color: "#f4f4f4", marginLeft: 12, marginRight: 8 }}
        />
        <Text
          style={{
            color: "#f4f4f4",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          197
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
      >
        <Text
          style={{
            fontSize: 12,
            color: "#5c5c5c",
            fontFamily: "Roboto_Medium",

            marginLeft: 12,
          }}
        >
          TOTAL ACCOUNT VISITS
        </Text>
        <IconMCI
          name="eye"
          size={16}
          style={{ color: "#f4f4f4", marginLeft: 12, marginRight: 8 }}
        />
        <Text
          style={{
            color: "#f4f4f4",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          197
        </Text>
      </View>

      <View style={{ marginBottom: 38 }} />
    </ScrollView>
  );
}
