import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Snackbar } from "react-native-paper";
import ImageViewer from "react-native-image-zoom-viewer";

import { View, Image, Text, TouchableOpacity, Modal } from "react-native";

import IconMI from "react-native-vector-icons/MaterialCommunityIcons";
import IconM from "react-native-vector-icons/MaterialIcons";
import cart_check from "./../assets/cart_check.png";

import SellerDetailsBar from "./../shared/SellerDetailsBar";

import { auth, db, addToCart } from "./../authContext";

export default function OfferDetails() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    id,
    owner,
    price,
    isGraded,
    cartArray,
    condition,
    cardObject,
    photosArray,
    description,
    userCountry,
    languageVersion,
  } = route.params;

  const [imageViewerState, setImageViewer] = useState(false);
  const [detailsBarState, setDetailsBar] = useState(true);
  const [snackbarState, setSnackbar] = useState(false);

  const [shippingImposible, setShippingImposible] = useState(true);
  const [cartState, setCartState] = useState(false);

  const renderCartButton = () => {
    if (cartState) {
      return (
        <View
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
        </View>
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
          if (!auth.currentUser) {
            setSnackbar("You have to be signed in to proceed further");
          } else {
            if (owner.sellerProfile.uid !== auth.currentUser.uid) {
              if (shippingImposible) {
                setSnackbar("Shipping is imposible for this item");
              } else {
                setCartState(true);
                addToCart(id);
              }
            } else {
              setSnackbar("You can't add your own offer to cart");
            }
          }
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

  const renderNumber = () => {
    let firstSegment;
    let secondSegment;
    if (cardObject.number < 9) {
      firstSegment = "00" + cardObject.number;
    } else if (cardObject.number < 99) {
      firstSegment = "0" + cardObject.number;
    } else {
      firstSegment = cardObject.number;
    }
    if (cardObject.set.printedTotal < 9) {
      secondSegment = "00" + cardObject.set.printedTotal;
    } else if (cardObject.set.printedTotal < 99) {
      secondSegment = "0" + cardObject.set.printedTotal;
    } else {
      secondSegment = cardObject.set.printedTotal;
    }
    return `#${firstSegment}/${secondSegment}`;
  };

  useEffect(() => {
    let mounted = true;

    const resolvePromise = async () => {
      if (!mounted) return;

      cartArray.forEach((item) => {
        if (item === id) setCartState(true);
      });

      await db
        .collection("users")
        .doc(owner.sellerProfile.uid)
        .get()
        .then((doc) => {
          doc.data().sellerProfile.shippingMethods.forEach((method) => {
            method.destinationCountries.forEach((country) => {
              if (country === userCountry) {
                setShippingImposible(false);
              }
            });
          });
        });
    };

    resolvePromise();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#1b1b1b",
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
                alignItems: "center",
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

      {auth?.currentUser?.uid !== owner.sellerProfile.uid ? (
        <View
          style={{
            width: "96%",
            marginLeft: "2%",
            top: 12,
            position: "absolute",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: !detailsBarState ? 0 : 18,

              borderRadius: 3,
              borderBottomRightRadius: !detailsBarState ? 0 : 3,
              borderBottomLeftRadius: !detailsBarState ? 0 : 3,
              backgroundColor: "#121212",

              zIndex: 1,
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
                  uri: `https://flagcdn.com/160x120/${owner.countryCode}.png`,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (!auth.currentUser) {
                  setSnackbar("You have to be signed in to proceed further");
                } else {
                  if (owner.sellerProfile.uid !== auth.currentUser.uid) {
                    navigation.navigate("SellerStack", {
                      screen: "OtherSellersOffers",
                      params: { sellerId: owner.sellerProfile.uid },
                    });
                  } else {
                    setSnackbar("You can't go to your own profile");
                  }
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
                {owner.nick}
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
              sellerProfile: owner.sellerProfile,
              hide: detailsBarState,
              setSnackbar: setSnackbar,
            }}
          />
        </View>
      ) : null}

      <TouchableOpacity
        style={{
          top: 0,
          zIndex: 0,
          position: "absolute",
          width: "100%",
          alignItems: "center",
        }}
        onPress={() => {
          setImageViewer(true);
        }}
      >
        <Image
          style={{
            aspectRatio: 734 / 979,
            width: "106%",
            height: undefined,
          }}
          source={{ uri: photosArray[0]?.url }}
        />
      </TouchableOpacity>

      <View
        style={{
          height: "12%",
          width: "60%",

          backgroundColor: "#121212",

          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",

          borderTopRightRadius: 12,
          paddingHorizontal: 18,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 12,
              color: "#727272",
              fontFamily: "Roboto_Medium",
            }}
          >
            Language
          </Text>
          <Text
            style={{
              fontSize: 22,
              marginTop: 2,
              color: "#FFFFFF",
              fontWeight: "700",
            }}
          >
            {languageVersion}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 12,
              color: "#727272",
              fontFamily: "Roboto_Medium",
            }}
          >
            Condition
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: 22,
              marginTop: 2,
            }}
          >
            {condition}
            <Text
              style={{
                color: "#727272",
                fontFamily: "Roboto_Medium",
                fontSize: 12,
              }}
            >
              /10
            </Text>
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: "#727272",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
            }}
          >
            Graded
          </Text>
          {isGraded ? (
            <Text
              style={{
                color: "#05FD00",
                fontFamily: "Roboto_Medium",
                fontSize: 22,
                marginTop: 2,
              }}
            >
              Yes
            </Text>
          ) : (
            <Text
              style={{
                color: "#FF0000",
                fontFamily: "Roboto_Medium",
                fontSize: 22,
                marginTop: 2,
              }}
            >
              No
            </Text>
          )}
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#1A1A1A",

          flexDirection: "row",
          alignItems: "center",

          paddingLeft: 18,
        }}
      >
        <View style={{ marginRight: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "#727272",
                marginRight: 8,
              }}
            >
              Number
            </Text>
            <Text
              style={{
                marginTop: 2,
                color: "#FFFFFF",
                fontFamily: "Roboto_Medium",
              }}
            >
              {renderNumber()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 6,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#727272",
                marginRight: 8,
              }}
            >
              Artist
            </Text>
            <Text
              style={{
                marginTop: 2,
                color: "#FFFFFF",
                fontFamily: "Roboto_Medium",
              }}
            >
              {cardObject.artist}
            </Text>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "#727272",
                marginRight: 8,
              }}
            >
              Set
            </Text>
            <Image
              source={{ uri: `${cardObject.set.images.symbol}` }}
              style={{
                aspectRatio: 1 / 1,
                width: 13,
                height: undefined,
                marginRight: 3,
              }}
            />
            <Text
              style={{
                color: "#8F00FF",
                fontFamily: "Roboto_Medium",
              }}
            >
              {cardObject.set.name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 6,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#727272",
                marginRight: 8,
              }}
            >
              Rarity
            </Text>
            <Text
              style={{
                marginTop: 2,
                color: "#FFE600",
                fontFamily: "Roboto_Medium",
              }}
            >
              {cardObject.rarity}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",

          backgroundColor: "#272727",

          paddingLeft: 18,
          paddingRight: 8,
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            color: "#727272",
            fontFamily: "Roboto_Medium",
            marginTop: 2,
          }}
        >
          DESCRIPTION
        </Text>
        <Text
          style={{
            marginTop: 2,
            color: "#FFFFFF",
          }}
        >
          {description}
        </Text>
      </View>
      <View
        style={{
          paddingLeft: 18,
          paddingRight: 8,

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",

          height: "10%",

          backgroundColor: "#1A1A1A",
          borderTopLeftRadius: 12,
        }}
      >
        <View style={{ marginRight: 12 }}>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
            {price.toFixed(2)} USD
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "#727272",
              fontFamily: "Roboto_Medium",
              marginTop: 2,
            }}
          >
            CARD COST
          </Text>
        </View>
        {userCountry !== "XXX" ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              onPress={() => {
                if (!auth.currentUser) {
                  setSnackbar("You have to be signed in to proceed further");
                } else {
                  if (owner.sellerProfile.uid !== auth.currentUser.uid) {
                    if (shippingImposible) {
                      setSnackbar("Shipping is imposible for this item");
                    } else {
                      navigation.navigate("CartStack", {
                        screen: "Checkout",
                        params: {
                          instantBuy: [
                            {
                              data: [route.params],
                              title: owner.nick,
                              uid: owner.sellerProfile.uid,
                            },
                          ],
                        },
                      });
                    }
                  } else {
                    setSnackbar("You can't buy your own item");
                  }
                }
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
        ) : null}
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
