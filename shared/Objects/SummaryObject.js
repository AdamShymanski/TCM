import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import {
  auth,
  fetchPhotos,
  fetchCardsName,
  removeFromCart,
} from "../../authContext";

export default function SummaryObject({ props }) {
  //fetch ID of cards from CF

  props = {
    cardId: "swsh3-20",
    condition: "10",
    description: "PSA 10.",
    id: "R9O5HfR3PFf3V23atW9D",
    isGraded: true,
    languageVersion: "Japanese",
    owner: "1wHQ7P6haMb0lGXqYGH8kjhIfcv1",
    price: 115,
    status: "published",
    timestamp: {
      nanoseconds: 0,
      seconds: 1642434762,
    },
  };

  const [loading, setLoading] = useState(true);

  const [photosArray, setPhotosArray] = useState([
    {
      url: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketplace.appspot.com/o/global%2Fplacegolder.png?alt=media&token=ed9d1f9b-9a3b-4c82-b86f-132da3e75957",
      props: {},
    },
  ]);
  const [pokemonName, setPokemonName] = useState(false);

  useEffect(() => {
    const resolvePromises = async () => {
      let cardPhotos = [];
      cardPhotos = await fetchPhotos(props.id);
      setPhotosArray(fillPhotosArray(cardPhotos));
      setPokemonName(await fetchCardsName(props.cardId));
    };

    resolvePromises();
    setLoading(false);
  }, []);

  const fillPhotosArray = (array) => {
    let outArray = [];

    array.forEach((item) => {
      outArray.push({ url: item });
    });

    return outArray;
  };

  if (loading) return null;
  return (
    <View
      style={{
        marginVertical: 8,
        marginHorizontal: 16,
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
          uri: photosArray[0]?.url,
        }}
        style={{ aspectRatio: 105 / 140, width: undefined, height: 90 }}
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
            {pokemonName}
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
              {props.isGraded ? (
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
          <Text
            style={{
              color: "#838383",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            x1
          </Text>
        </View>
      </View>
    </View>
  );
}
