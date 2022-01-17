import React, { useState, useEffect } from "react";

import ImageViewer from "react-native-image-zoom-viewer";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";

import condition_icon from "./../../assets/condition.png";

import IconIO from "react-native-vector-icons/Ionicons";
import IconMI from "react-native-vector-icons/MaterialCommunityIcons";
import IconM from "react-native-vector-icons/MaterialIcons";

import {
  auth,
  saveOffer,
  unsaveOffer,
  fetchPhotos,
  fetchOwnerData,
  fetchCardsName,
} from "../../authContext";

import { Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from "expo-linear-gradient";

import SellerDetailsBar from "../SellerDetailsBar";

export default function OfferCard({ props, isSavedState, nameOfCard }) {
  const condition = props.condition;
  const description = props.description;
  const price = props.price;
  const languageVersion = props.languageVersion;

  const ownerId = props.owner;

  let cardPhotos = [];

  const [loadingState, setLoading] = useState(true);
  const [imageViewerState, setImageViewer] = useState(false);
  const [owner, setOwner] = useState({
    name: null,
    countryCodes: null,
    collectionSize: null,
  });
  const [isSaved, setSaveOffer] = useState(false);
  const [photosArray, setPhotosArray] = useState([
    {
      url: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketplace.appspot.com/o/global%2Fplacegolder.png?alt=media&token=ed9d1f9b-9a3b-4c82-b86f-132da3e75957",
      props: {},
    },
  ]);

  const [snackbarState, setSnackbar] = useState(false);
  const [detailsBarState, setDetailsBar] = useState(true);

  const [pokemonName, setPokemonName] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    let mounted = true;

    const resolvePromises = async () => {
      if (mounted) {
        cardPhotos = await fetchPhotos(props.id);
        setOwner(await fetchOwnerData(props.owner));
        setPhotosArray(fillPhotosArray(cardPhotos));

        isSavedState.forEach((item) => {
          if (item == props.id) setSaveOffer(true);
        });

        if (nameOfCard) {
          setPokemonName(await fetchCardsName(props.cardId));
        }
        setLoading(false);
      }
    };

    resolvePromises();
    return () => (mounted = false);
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
          onPress={() => {
            clickSave();
          }}
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
        onPress={() => {
          if (ownerId === auth.currentUser.uid) {
            setSnackbar("You can't save your own offer");
          } else {
            clickSave();
          }
        }}
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

  if (!loadingState && nameOfCard) {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          marginHorizontal: 4,
          marginVertical: 6,
          marginRight: 20,
          marginLeft: 20,
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

        <View style={{ marginVertical: 20 }}>
          <View
            style={{
              position: "relative",

              flexDirection: "row",
              alignItems: "center",
              marginBottom: !detailsBarState ? 0 : 18,

              borderRadius: 3,
              borderBottomRightRadius: !detailsBarState ? 0 : 3,
              borderBottomLeftRadius: !detailsBarState ? 0 : 3,
              backgroundColor: "#121212",
            }}
          >
            <View
              style={{
                backgroundColor: "#404040",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderTopLeftRadius: 3,
                borderBottomLeftRadius: !detailsBarState ? 0 : 3,
                marginRight: 10,
              }}
            >
              <Image
                style={{ width: 28, height: 21 }}
                source={{
                  uri: `https://flagcdn.com/160x120/${owner?.countryCode}.png`,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (ownerId !== auth.currentUser.uid) {
                  navigation.navigate("Sellers", {
                    screen: "SellerProfile",
                    params: { sellerId: ownerId },
                  });
                }
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#333",
                  color: "white",
                  fontWeight: "700",
                }}
              >
                {owner.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                position: "absolute",
                right: 20,
              }}
              onPress={() => {
                setDetailsBar((prevState) => !prevState);
              }}
            >
              <IconM
                name={!detailsBarState ? "expand-less" : "expand-more"}
                size={26}
                color="#f4f4f4"
              />
            </TouchableOpacity>
          </View>
          <SellerDetailsBar
            props={{
              collectionSize: owner.collectionSize,
              hide: detailsBarState,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              backgroundColor: "#121212",
              paddingVertical: 12,

              borderRadius: 6,
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
              <Text
                style={{
                  color: "#d6d6d6",
                  fontSize: 16,
                  paddingBottom: 12,
                  fontWeight: "700",
                }}
              >
                {pokemonName}
              </Text>
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
                    {condition}
                    <Text
                      style={{
                        color: "#7c7c7c",
                        fontFamily: "Roboto_Medium",
                        fontSize: 9,
                        marginLeft: 4,
                      }}
                    >
                      /10
                    </Text>
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
                    {languageVersion}
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
                  marginRight: 5,
                }}
                onPress={() => {
                  if (ownerId === auth.currentUser.uid) {
                    setSnackbar("You can't buy your own card");
                  } else {
                    navigation.navigate("Buy", { ownerId });
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                    marginRight: 5,
                  }}
                >
                  Buy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Snackbar
          visible={snackbarState}
          duration={2000}
          onDismiss={() => setSnackbar(false)}
          action={{
            label: "",
            onPress: () => {},
          }}
        >
          {snackbarState}
        </Snackbar>
      </View>
    );
  } else if (!loadingState) {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          marginHorizontal: 4,
          marginVertical: 6,
          marginRight: 20,
          marginLeft: 20,
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

        <View style={{ marginVertical: 20 }}>
          <View
            style={{
              position: "relative",

              flexDirection: "row",
              alignItems: "center",
              marginBottom: detailsBarState ? 0 : 18,

              borderRadius: 3,
              borderBottomRightRadius: detailsBarState ? 0 : 3,
              borderBottomLeftRadius: detailsBarState ? 0 : 3,
              backgroundColor: "#121212",
            }}
          >
            <View
              style={{
                backgroundColor: "#404040",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderTopLeftRadius: 3,
                borderBottomLeftRadius: detailsBarState ? 0 : 3,
                marginRight: 10,
              }}
            >
              <Image
                style={{ width: 28, height: 21 }}
                source={{
                  uri: `https://flagcdn.com/160x120/${owner?.countryCode}.png`,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (ownerId !== auth.currentUser.uid) {
                  navigation.navigate("Sellers", {
                    screen: "SellerProfile",
                    params: { sellerId: ownerId },
                  });
                }
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#333",
                  color: "white",
                  fontWeight: "700",
                }}
              >
                {owner.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                position: "absolute",
                right: 20,
              }}
              onPress={() => {
                setDetailsBar((prevState) => !prevState);
              }}
            >
              <IconM
                name={detailsBarState ? "expand-less" : "expand-more"}
                size={26}
                color="#f4f4f4"
              />
            </TouchableOpacity>
          </View>
          <SellerDetailsBar
            props={{
              collectionSize: owner.collectionSize,
              hide: detailsBarState,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              backgroundColor: "#121212",
              paddingVertical: 12,

              borderRadius: 6,
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
                    {languageVersion}
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
                  marginRight: 5,
                }}
                onPress={() => {
                  if (ownerId === auth.currentUser.uid) {
                    setSnackbar("You can't buy your own card");
                  } else {
                    navigation.navigate("Buy", { ownerId });
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                    marginRight: 5,
                  }}
                >
                  Buy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Snackbar
          visible={snackbarState}
          duration={2000}
          onDismiss={() => setSnackbar(false)}
          action={{
            label: "",
            onPress: () => {},
          }}
        >
          You can't buy this card
        </Snackbar>
      </View>
    );
  }
  return null;
}
