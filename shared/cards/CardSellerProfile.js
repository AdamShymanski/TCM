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

import { globalStyles } from "../../styles/global";

import IconMI from "react-native-vector-icons/MaterialCommunityIcons";
import language_icon from "./../../assets/language.png";
import condition_icon from "./../../assets/condition.png";

import {
  fetchPhotos,
  fetchOwnerData,
  unsaveOffer,
  saveOffer,
  auth,
} from "../../authContext";

import { useNavigation } from "@react-navigation/native";

export function CardSellerProfile({ props, isSavedState }) {
  const condition = props.condition;
  const description = props.description;
  const price = props.price;
  const languageVersion = props.languageVersion;

  let cardPhotos = [];

  const [loadingState, setLoading] = useState(true);
  const [imageViewerState, setImageViewer] = useState(false);

  const [owner, setOwner] = useState({
    name: "",
    reputation: 0,
    collectionSize: 0,
    countryCodes: "",
  });
  const [isSaved, setSaveOffer] = useState(false);

  const navigation = useNavigation();

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

  useEffect(() => {
    const resolvePromises = async () => {
      cardPhotos = await fetchPhotos(props.id);
      setOwner(await fetchOwnerData(props.owner));
      setPhotosArray(fillPhotosArray(cardPhotos));

      isSavedState.forEach((item) => {
        if (item == props.id) setSaveOffer(true);
      });
    };

    resolvePromises();
    setLoading(false);
  }, []);

  useEffect(() => {
    setSaveOffer(false);
    isSavedState.forEach((item) => {
      if (item == props.id) setSaveOffer(true);
    });
  }, [isSavedState]);

  const clickSave = async () => {
    if (!isSaved) {
      try {
        setSaveOffer(true);
        saveOffer(auth.currentUser.uid, props.id);
      } catch (err) {
        console.log(err);
      }
    }
    if (isSaved) {
      try {
        setSaveOffer(false);
        unsaveOffer(auth.currentUser.uid, props.id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const renderSaveButton = () => {
    if (isSaved) {
      return (
        <TouchableOpacity
          style={[
            {
              borderRadius: 3,
              marginRight: 16,

              height: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0082FF",
              width: 90,
            },
          ]}
          onPress={() => clickSave()}
        >
          <Text
            style={[
              {
                fontSize: 16,
                fontWeight: "700",
                color: "#121212",
              },
            ]}
          >
            Saved
          </Text>
          <IconMI
            name={"check-bold"}
            size={18}
            color="#121212"
            style={{ marginLeft: 6, bottom: 1 }}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          {
            borderRadius: 3,
            marginRight: 16,

            height: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: 76,
            backgroundColor: "transparent",
            borderWidth: 2.5,
            borderColor: "#5c5c5c",
          },
        ]}
        onPress={() => clickSave()}
      >
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: "700",
              color: "#5c5c5c",
            },
          ]}
        >
          Save
        </Text>
      </TouchableOpacity>
    );
  };

  const fillPhotosArray = (array) => {
    let outArray = [];

    array.forEach((item) => {
      outArray.push({ url: item });
    });

    return outArray;
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
          {/* <View style={stylesCard.top}>
            <View
              style={{
                backgroundColor: "#404040",
                height: "100%",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderTopLeftRadius: 3,
                borderBottomLeftRadius: 3,
                marginRight: 10,
              }}
            >
              <Image
                style={{ width: 28, height: 21 }}
                source={{
                  uri: `https://flagcdn.com/160x120/${owner.countryCode}.png`,
                }}
              />
            </View>
            <Text style={[globalStyles.titleText, { color: "white" }]}>
              {owner.name}
            </Text>
            <View style={stylesCard.profileParams}>
              <Image
                source={reputation_icon}
                style={{ height: 26, width: 22.9, marginRight: 6 }}
              />
              <Text
                style={{
                  color: "#f4f4f4",
                  fontSize: 18,
                  fontWeight: "700",
                  marginRight: 20,
                }}
              >
                {owner.reputation}
              </Text>
              <Image
                source={collection_icon}
                style={{
                  height: 19,
                  width: 16,
                  marginRight: 6,
                }}
              />
              <Text
                style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 18 }}
              >
                {owner.collectionSize}
              </Text>
            </View> 
          </View> */}

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
                    style={{ width: 20, height: 20, marginRight: 10 }}
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
              {renderSaveButton()}

              <TouchableOpacity
                style={{
                  width: 76,
                  height: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "#0082FF",
                  borderRadius: 3,
                }}
                onPress={() => navigation.navigate("Buy", owner)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                  }}
                >
                  Buy
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
    width: "92%",
    marginLeft: "4%",
  },
  cardContent: {
    marginVertical: 20,
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

    paddingBottom: 12,
    paddingTop: 12,

    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
