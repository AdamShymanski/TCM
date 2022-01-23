import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import { removeFromCart } from "../authContext";

export default function CartObject({ props, setOffersState, setCartState }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <View
      style={{
        marginVertical: 8,
        marginHorizontal: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,

        alignItems: "center",
        flexDirection: "row",

        backgroundColor: "#121212",
        borderRadius: 5,
      }}
    >
      <Image
        source={{
          uri: `${props.images[0]}`,
        }}
        style={{ aspectRatio: 105 / 140, width: undefined, height: 70 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            height: 70,
            marginLeft: 12,
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
              fontSize: 15,
            }}
          >
            {props.name}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#585858",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
              }}
            >
              Price
            </Text>
            <Text
              style={{
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              {`${props.price} USD`}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#585858",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
              }}
            >
              Graded
            </Text>
            <Text
              style={{
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              {props.graded ? (
                <Icon name="check" color={"#0dff25"} size={14} />
              ) : (
                <Text style={{ fontSize: 11, color: "#CD0000" }}>X</Text>
              )}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#585858",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
              }}
            >
              Condition
            </Text>
            <Text
              style={{
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              {props.condition}
              <Text
                style={{
                  color: "#7c7c7c",
                  fontFamily: "Roboto_Medium",
                  fontSize: 8,
                  marginLeft: 4,
                }}
              >
                /10
              </Text>
            </Text>
          </View>
        </View>
        <View style={{ justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#CD0000",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 3,
            }}
            onPress={async () => {
              // setVisible(false);
              //delete item from offersArray
              //then delete id of offet from cart in db of user

              setCartState((prevState) => {
                prevState.forEach((item, index) => {
                  if (item === props.id) {
                    prevState.splice(index, 1);
                  }
                });
                return prevState;
              });
              setOffersState((prevState) => {
                prevState.forEach((item, masterIndex) => {
                  item.offers.forEach((offer, index) => {
                    if (offer.id === props.id) {
                      prevState[masterIndex].offers.splice(index, 1);
                      if (prevState[masterIndex].offers.length === 0) {
                        prevState.splice(masterIndex, 1);
                      }
                    }
                  });
                });

                return [...prevState];
              });
              await removeFromCart(props.id);
            }}
          >
            <Text
              style={{
                color: "#f4f4f4",
                fontWeight: "700",
                fontSize: 11.8,
              }}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
