import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import { fetchPhotos, fetchOwnerData, pokemonAPI } from "../../authContext";

import { useNavigation } from "@react-navigation/native";

export default function CardMostRecent({ props, userCountry, cartArray }) {
  const [loading, setLoading] = useState(true);
  const [photosArray, setPhotosArray] = useState([
    {
      url: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketplace.appspot.com/o/global%2Fplacegolder.png?alt=media&token=ed9d1f9b-9a3b-4c82-b86f-132da3e75957",
      props: {},
    },
  ]);
  const [cardObject, setCardObject] = useState({});
  const [owner, setOwner] = useState({});

  useEffect(() => {
    const resolvePromises = async () => {
      let cardPhotos = [];
      cardPhotos = await fetchPhotos(props.id);
      setPhotosArray(fillPhotosArray(cardPhotos));
      setOwner(await fetchOwnerData(props.owner));
      await pokemonAPI.card
        .find(props.cardId)
        .then((card) => {
          setCardObject({ ...card });
        })
        .catch((error) => {
          console.log(error);
        });
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

  const navigation = useNavigation();

  if (loading) return null;
  return (
    <TouchableOpacity
      style={{
        marginVertical: 5,
        paddingHorizontal: 8,

        alignItems: "center",
        flexDirection: "row",
        height: 112,
        flex: 1,

        backgroundColor: "#121212",
        borderRadius: 5,
      }}
      onPress={() => {
        if (cardObject.name) {
          navigation.navigate("OfferDetailsStack", {
            screen: "OfferDetails",
            params: {
              ...props,
              cardObject,
              photosArray,
              owner: owner,
              userCountry,
              cartArray,
            },
          });
        }
      }}
    >
      <Image
        source={{
          uri: photosArray[0]?.url,
        }}
        style={{
          aspectRatio: 105 / 140,
          width: undefined,
          height: 90,
          marginLeft: 4,
        }}
      />
      <View
        style={{
          justifyContent: "space-between",
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
          {cardObject.name}
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
    </TouchableOpacity>
  );
}
