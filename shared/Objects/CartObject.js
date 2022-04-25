import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import {
  auth,
  fetchPhotos,
  fetchCardsName,
  removeFromCart,
} from "../../authContext";

export default function CartObject({ props, setOffers }) {
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
        marginBottom: 8,
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
            height: 90,
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
          <View style={{ flexDirection: "row", marginTop: 6 }}>
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
              {`${props.price.toFixed(2)} USD`}
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
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#585858",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
              }}
            >
              Language
            </Text>
            <Text
              style={{
                color: "#f4f4f4",
                fontFamily: "Roboto_Medium",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              {`${props.languageVersion}`}
            </Text>
          </View>
        </View>
        <View style={{ justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",

              paddingHorizontal: 12,
              paddingVertical: 4,

              backgroundColor: "#CD0000",
              borderRadius: 3,
            }}
            onPress={async () => {
              // setVisible(false);
              //delete item from offersArray
              //then delete id of offer from cart in db of user

              setOffers((prevState) => {
                prevState.forEach((item, masterIndex) => {
                  //check if item.data inclueds obj with id equel to props.id
                  item.data.forEach((offer, index) => {
                    if (offer.id === props.id) {
                      prevState[masterIndex].data.splice(index, 1);
                    }
                  });
                  if (item.data.length === 0) {
                    prevState.splice(masterIndex, 1);
                  }
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
                fontSize: 12,
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
