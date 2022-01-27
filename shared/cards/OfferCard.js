import React, { useState, useEffect } from "react";

import ImageViewer from "react-native-image-zoom-viewer";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";

import condition_icon from "./../../assets/condition.png";

import IconIO from "react-native-vector-icons/Ionicons";
import IconMI from "react-native-vector-icons/MaterialCommunityIcons";
import IconM from "react-native-vector-icons/MaterialIcons";

import cart_check from "./../../assets/cart_check.png";

import {
  auth,
  saveOffer,
  unsaveOffer,
  fetchPhotos,
  fetchOwnerData,
  fetchCardsName,
  addToCart,
  db,
} from "../../authContext";

import { Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import SellerDetailsBar from "../SellerDetailsBar";
// import { LinearGradient } from "expo-linear-gradient";

export default function OfferCard({
  props,
  isSavedState,
  cartArray,
  nameOfCard,
}) {
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
  const [cartState, setCartState] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    let mounted = true;

    const resolvePromises = async () => {
      if (mounted) {
        cardPhotos = await fetchPhotos(props.id);
        setOwner(await fetchOwnerData(props.owner));
        setPhotosArray(fillPhotosArray(cardPhotos));

        cartArray.forEach((item) => {
          if (item === props.id) setCartState(true);
        });

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
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let result = false;
    isSavedState.forEach((item) => {
      if (item == props.id) result = true;
    });
    setSaveOffer(result);
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
  const renderSaveIndicator = () => {
    if (isSaved) {
      return (
        <IconMI
          name={"bookmark-check"}
          color={"#0082ff"}
          size={nameOfCard ? 26 : 29}
          onPress={() => {
            clickSave();
          }}
        />
      );
    }

    return (
      <IconMI
        name={"bookmark-plus-outline"}
        color={"#0082ff"}
        size={nameOfCard ? 26 : 29}
        onPress={() => {
          if (ownerId === auth.currentUser.uid) {
            setSnackbar("You can't save your own offer");
          } else {
            clickSave();
          }
        }}
      />
    );
  };

  const renderCartButton = () => {
    if (cartState) {
      return (
        <TouchableOpacity
          style={{
            width: 100,
            paddingVertical: 4.5,
            marginRight: 10,

            borderRadius: 4,
            backgroundColor: "#0082ff",

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              color: "#121212",
              marginRight: 8,
              fontSize: 16,
            }}
          >
            In Cart
          </Text>
          <Image source={cart_check} style={{ width: 19, height: 19 }} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={{
          width: 90,
          paddingVertical: 3,
          marginRight: 10,

          borderWidth: 2.5,
          borderRadius: 4,
          borderColor: "#5c5c5c",

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          setCartState(true);
          addToCart(props.id);
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            color: "#5c5c5c",
            marginRight: 8,
            fontSize: 16,
          }}
        >
          Add
        </Text>
        <IconMI name={"cart-plus"} size={20} color={"#5c5c5c"} />
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingRight: 12,
                  paddingLeft: 3,
                  paddingBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: "#d6d6d6",
                    fontSize: 16,

                    fontWeight: "700",
                  }}
                >
                  {pokemonName}
                </Text>
                {renderSaveIndicator()}
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
              {renderCartButton()}

              <TouchableOpacity
                style={{
                  width: 86,
                  paddingVertical: 3.5,

                  borderRadius: 4,

                  backgroundColor: "#0082FF",

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: "#121212",
                    fontSize: 16,
                    marginRight: 6,
                  }}
                >
                  Buy
                </Text>
                <IconMI
                  name={"credit-card-outline"}
                  size={20}
                  color={"#121212"}
                  style={{ marginTop: 2.5 }}
                />
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
          marginVertical: 6,
          marginRight: 14,
          marginLeft: 14,
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
                borderRadius: 5,

                flex: 1,
                flexDirection: "column",
                paddingLeft: 12,
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
              <View style={{ marginRight: 12, marginTop: 4 }}>
                {renderSaveIndicator()}
              </View>

              {renderCartButton()}

              <TouchableOpacity
                style={{
                  width: 86,
                  paddingVertical: 3.5,

                  borderRadius: 4,

                  backgroundColor: "#0082FF",

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: "#121212",
                    fontSize: 16,
                    marginRight: 6,
                  }}
                >
                  Buy
                </Text>
                <IconMI
                  name={"credit-card-outline"}
                  size={20}
                  color={"#121212"}
                  style={{ marginTop: 2.5 }}
                />
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
  }
  return null;
}
