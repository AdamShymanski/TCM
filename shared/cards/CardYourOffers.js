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

import { fetchPhotos } from "../../authContext";

import { useNavigation } from "@react-navigation/native";

export function CardYourOffers({ props, setModal, setId }) {
  const condition = props.condition;
  const description = props.description;
  const price = props.price;
  const languageVersion = props.languageVersion;
  const status = props.status;

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

  const navigation = useNavigation();

  let cardPhotos = [];

  useEffect(() => {
    const resolvePromises = async () => {
      cardPhotos = await fetchPhotos(props.id);
      setPhotosArray(fillPhotosArray(cardPhotos));

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
    if (prop === "verificationPending") {
      return (
        <View
          style={{
            backgroundColor: "#121212",
            paddingVertical: 12,
            paddingLeft: 12,
            flexDirection: "row",
            alignItems: "center",
            width: 172,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        >
          <View
            style={{
              width: 9,
              height: 9,
              backgroundColor: "#b09b00",
              borderRadius: 10,
            }}
          />
          <Text
            style={{
              color: "#ffe100",
              fontFamily: "Roboto_Medium",
              marginLeft: 6,
            }}
          >
            Verification Pending
          </Text>
        </View>
      );
    }
    if (prop === "published") {
      return (
        <View
          style={{
            backgroundColor: "#121212",
            paddingVertical: 12,
            paddingLeft: 12,
            flexDirection: "row",
            alignItems: "center",
            width: 106,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        >
          <View
            style={{
              width: 9,
              height: 9,
              backgroundColor: "#0dba1e",
              borderRadius: 10,
            }}
          />
          <Text
            style={{
              color: "#0dff25",

              fontFamily: "Roboto_Medium",
              marginLeft: 6,
            }}
          >
            Published
          </Text>
        </View>
      );
    }
    if (prop === "rejected") {
      return (
        <View
          style={{
            backgroundColor: "#121212",
            paddingVertical: 12,
            paddingLeft: 12,
            flexDirection: "row",
            alignItems: "center",
            width: 100,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        >
          <View
            style={{
              width: 9,
              height: 9,
              backgroundColor: "#990000",
              borderRadius: 10,
            }}
          />
          <Text
            style={{
              color: "#ff0000",
              fontFamily: "Roboto_Medium",
              marginLeft: 6,
            }}
          >
            Rejected
          </Text>
        </View>
      );
    }
  };

  if (!loadingState) {
    return (
      <View style={styles.card}>
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
                    paddingVertical: 8,
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
        <View style={styles.cardContent}>
          {returnStatus(status)}
          <View style={stylesCard.body}>
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
                source={{ uri: photosArray[0].url }}
              />
            </TouchableOpacity>
            <View style={stylesCard.description}>
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
                    backgroundColor: "#1b1b1b",
                  }}
                >
                  <Image
                    source={condition_icon}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: "#f4f4f4",
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    {condition}
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
                    backgroundColor: "#1b1b1b",
                  }}
                >
                  <Image
                    source={language_icon}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "#f4f4f4",
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    {languageVersion}
                  </Text>
                </View>
              </View>
              <View
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <View
                  style={{
                    padding: 6,
                    paddingHorizontal: 16,
                    flex: 1,

                    borderRadius: 3,
                    backgroundColor: "#1b1b1b",
                    width: 210,
                    height: 90,
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
                    {description}
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
            <Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: "#121212",
                borderRadius: 4,
                color: "#f4f4f4",
                fontWeight: "700",
                fontSize: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#0082ff", fontSize: 14 }}>
                {"Price    "}
              </Text>
              {price}
              <Text style={{ color: "#CDCDCD", fontSize: 14 }}>{"  USD"}</Text>
            </Text>

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
                  borderWidth: 2,
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
                  navigation.navigate("EditCard", {
                    props,
                    photosArray,
                    setModal,
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
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    width: "90%",
    marginLeft: "5%",
  },
  cardContent: {
    paddingVertical: 20,
  },
});

const stylesCard = StyleSheet.create({
  top: {
    position: "relative",

    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 3,
    backgroundColor: "#121212",
  },
  body: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#121212",
    paddingVertical: 12,

    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  description: {
    height: "100%",
    flex: 1,

    paddingLeft: 12,
    // paddingTop: 10,
    borderRadius: 5,
  },
  rightText: {
    color: "#0082ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  leftText: {
    color: "#f4f4f4",
    fontWeight: "400",
    fontSize: 16,
  },
  cardName: {
    color: "#f4f4f4",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 8,
  },
  bottom: {
    flexDirection: "row",
    backgroundColor: "#121212",
    height: 60,
    width: "100%",
    paddingVertical: 12,
    justifyContent: "space-evenly",
    paddingHorizontal: 8,
  },
  profileParams: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 20,
  },
});
