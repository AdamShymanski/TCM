// import React, { useState, useEffect } from "react";
// import { fetchPhotos, fetchCardsName, storage } from "../../authContext";

// import { View, Image, Text, ActivityIndicator } from "react-native";

// export default function CardMostRecent({ props }) {

//   const [loadingState, setLoading] = useState(true);
//   const [pokemonName, setPokemonName] = useState(false);
//   const [photoState, setPhotoState] = useState([
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketplace.appspot.com/o/global%2Fplacegolder.png?alt=media&token=ed9d1f9b-9a3b-4c82-b86f-132da3e75957",
//       props: {},
//     },
//   ]);

//   useEffect(() => {
//     let mounted = true;

//     const resolvePromises = async () => {
//       if (mounted) {
//         setPokemonName(await fetchCardsName(props.cardId));

//         const pathReference = storage.ref("cards/" + `${props.id}/0`);
//         await pathReference.getDownloadURL().then((url) => {
//           setPhotoState(url);
//         });

//         setLoading(false);
//       }
//     };
//     resolvePromises();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (!loadingState) {
//     return (
//       <View
//         style={{
//           width: 100,
//           height: 120,

//           marginTop: 12,
//           marginRight: 12,
//           borderRadius: 4,
//           backgroundColor: "#121212",
//         }}
//       >
//         <Text>{pokemonName}</Text>
//         <Image
//           style={{
//             width: 52.5,
//             height: 70,
//             marginLeft: 12,
//             borderRadius: 3,
//           }}
//           source={{ uri: photoState }}
//         />
//       </View>
//     );
//   } else {
//     return (
//       <View
//         style={{
//           width: 100,
//           height: 120,

//           marginTop: 12,
//           marginRight: 12,
//           borderRadius: 4,
//           backgroundColor: "#121212",

//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <ActivityIndicator color={"#0082ff"} size={"large"} />
//       </View>
//     );
//   }
// }

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/Octicons";

import { auth, fetchPhotos, fetchCardsName } from "../../authContext";

export default function CardMostRecent({ props, last }) {
  //fetch ID of cards from CF

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

        paddingVertical: 4,
        paddingHorizontal: 12,

        alignItems: "center",
        flexDirection: "row",
        height: 120,
        flex: 1,

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
    </View>
  );
}
