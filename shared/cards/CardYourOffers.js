import React, { useState, useEffect } from "react";

import ImageViewer from "react-native-image-zoom-viewer";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";

import language_icon from "./../../assets/language.png";
import condition_icon from "./../../assets/condition.png";

import IconIO from "react-native-vector-icons/Ionicons";
import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import { fetchPhotos, fetchCardsName } from "../../authContext";

import { useNavigation } from "@react-navigation/native";

export function CardYourOffers({ props, setModal, setId }) {
  const [loadingState, setLoading] = useState(true);
  const [imageViewerState, setImageViewer] = useState(false);
  const [photosArray, setPhotosArray] = useState([
    {
      // Simplest usage.
      url: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketplace.appspot.com/o/global%2Fplacegolder.png?alt=media&token=ed9d1f9b-9a3b-4c82-b86f-132da3e75957",

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {},
    },
  ]);

  const [pokemonName, setPokemonName] = useState(false);

  const navigation = useNavigation();

  let cardPhotos = [];

  useEffect(() => {
    const resolvePromises = async () => {
      cardPhotos = await fetchPhotos(props.id);
      setPhotosArray(fillPhotosArray(cardPhotos));
      setPokemonName(await fetchCardsName(props.cardId));

      setLoading(false);
    };

    resolvePromises();
  }, []);

  const fillPhotosArray = (array) => {
    let outArray = [];

    array.forEach((item) => {
      outArray.push({ url: item });
    });

    return outArray;
  };
  const returnStatus = (prop) => {
    if (prop === "verification_pending") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",

            justifyContent: "space-evenly",

            marginTop: 18,
            paddingHorizontal: 12,
            paddingVertical: 8,

            backgroundColor: "#59520d",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <Text
            style={{
              color: "#FFE600",
              fontFamily: "Roboto_Medium",
              marginRight: 6,
              fontSize: 10,
            }}
          >
            VERIFICATION PENDING
          </Text>
          <IconMCI name={"clock"} size={16} color={"#FFE600"} />
        </View>
      );
    }
    if (prop === "published") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",

            justifyContent: "space-evenly",

            marginTop: 18,
            paddingHorizontal: 12,
            paddingVertical: 8,

            backgroundColor: "#114a10",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <Text
            style={{
              color: "#0dff25",

              fontSize: 10,
              marginRight: 6,
              fontFamily: "Roboto_Medium",
            }}
          >
            PUBLISHED
          </Text>
          <IconMCI name={"check"} size={16} color={"#0DCA09"} />
        </View>
      );
    }
    if (prop === "rejected") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",

            justifyContent: "space-evenly",

            marginTop: 18,
            paddingHorizontal: 12,
            paddingVertical: 8,

            backgroundColor: "#4a1010",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <Text
            style={{
              color: "#C31313",

              fontSize: 10,
              marginRight: 6,
              fontFamily: "Roboto_Medium",
            }}
          >
            REJECTED
          </Text>
          <IconMI name={"done-all"} size={16} color={"#C31313"} />
        </View>
      );
    }
    if (prop === "sold") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",

            justifyContent: "space-evenly",

            marginTop: 18,
            paddingHorizontal: 12,
            paddingVertical: 8,

            backgroundColor: "#023261",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <Text
            style={{
              color: "#0082ff",

              fontSize: 10,
              marginRight: 6,
              fontFamily: "Roboto_Medium",
            }}
          >
            SOLD
          </Text>
          <IconMI name={"done-all"} size={16} color={"#0082ff"} />
        </View>
      );
    }
  };

  if (!loadingState) {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          width: "90%",
          marginLeft: "5%",
        }}
      >
        <Modal visible={imageViewerState} transparent={true}>
          <ImageViewer
            imageUrls={photosArray}
            onSwipeDown={() => {
              setImageViewer(false);
            }}
            backgroundColor={"#1b1b1b"}
            enableSwipeDown={true}
            renderHeader={(currentIndex) => (
              <View
                style={{
                  width: "100%",
                  height: 66,
                  flexDirection: "row",
                  backgroundColor: "#121212",
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 3,
                    marginLeft: 12,

                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#777777",
                    paddingHorizontal: 12,
                  }}
                  onPress={() => setImageViewer(false)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#777777",
                    }}
                  >
                    {"Go back"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </Modal>
        {returnStatus(props.status)}
        <View
          style={{
            alignItems: "flex-start",
            backgroundColor: "#121212",
            zIndex: 1,
            borderRadius: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              backgroundColor: "#121212",
              zIndex: 1,
              paddingVertical: 12,

              borderRadius: 6,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setImageViewer(true);
              }}
            >
              <Image
                style={{
                  width: 105,
                  height: 140,
                  marginLeft: 12,
                  borderRadius: 3,
                }}
                source={{ uri: photosArray[0]?.url }}
              />
            </TouchableOpacity>

            <View
              style={{
                height: "100%",
                flex: 1,
                flexDirection: "column",

                paddingLeft: 12,

                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 3,
                  paddingRight: 12,

                  paddingBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: "#d6d6d6",
                    fontSize: 16,
                    width: "80%",

                    fontWeight: "700",
                  }}
                >
                  {pokemonName}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                    marginRight: 6,
                    borderRadius: 3,
                    paddingHorizontal: 16,
                  }}
                >
                  <Image
                    source={condition_icon}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "#f4f4f4",
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    {props.condition}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",

                    marginBottom: 12,
                    borderRadius: 3,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  }}
                >
                  <IconIO
                    name={"language"}
                    size={22}
                    color="#0082FF"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "#f4f4f4",
                      fontWeight: "700",
                      fontSize: 12.5,
                    }}
                  >
                    {props.languageVersion}
                  </Text>
                </View>
              </View>

              <View
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <View
                  style={{
                    flex: 1,

                    borderTopWidth: 1.5,
                    borderTopColor: "#777777",

                    width: 210,
                    height: 52,
                    padding: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#ADADAD",
                      fontWeight: "500",
                      marginRight: 9,
                      flex: 1,
                      fontSize: 12,
                    }}
                  >
                    {props.description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#121212",

              borderBottomLeftRadius: 7,
              borderBottomRightRadius: 7,

              paddingVertical: 5,
              paddingHorizontal: 8,
              paddingBottom: 9,
            }}
          >
            <View
              style={{
                paddingVertical: 6,
                paddingHorizontal: 10,

                borderRadius: 4,
                backgroundColor: "#121212",

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ marginRight: 6 }}>
                <IconMCI name={"tag"} color={"#0082ff"} size={22} />
              </View>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#f4f4f4" }}
              >
                {props.price.toFixed(2)}
              </Text>

              <Text
                style={{ color: "#CDCDCD", fontSize: 14, fontWeight: "700" }}
              >
                {"  USD"}
              </Text>
            </View>

            {props.status !== "sold" ? (
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 76,
                    height: 30,
                    marginRight: 10,

                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",

                    borderColor: "#5c5c5c",
                    borderRadius: 3,
                    borderWidth: 2.5,
                  }}
                  onPress={() => {
                    setModal(true);
                    setId(props.id);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#5c5c5c",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 76,
                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: "#0082FF",
                    borderRadius: 3,

                    marginRight: 5,
                  }}
                  onPress={() =>
                    navigation.navigate("YourOffersStack", {
                      params: { props, photosArray, setModal },
                      screen: "EditCard",
                    })
                  }
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#121212",
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
        <View
          style={{
            top: -6,
            zIndex: 0,

            flexDirection: "row",
            alignSelf: "flex-start",

            paddingVertical: 5,
            paddingTop: 11,
            paddingHorizontal: 12,
            position: "relative",

            borderRadius: 6,
            borderTopLeftRadius: 0,

            backgroundColor: "#404040",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto_Medium",
              color: "#ffffff",

              flexShrink: 1,
              flexGrow: 0,
              flexWrap: "wrap",
            }}
          >
            ID: {props.id}
          </Text>
        </View>
      </View>
    );
  } else {
    return null;
  }
}
