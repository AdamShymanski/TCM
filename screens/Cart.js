import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const { width } = Dimensions.get("window");

import pokemon from "pokemontcgsdk";
import { auth, db, fetchPhotos, functions } from "../authContext";

import ZigzagLines from "react-native-zigzag-lines";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import CartObject from "../shared/CartObject";

import { useStripe } from "@stripe/stripe-react-native";
import { useIsFocused } from "@react-navigation/native";

export default function Cart({ route }) {
  const [cartState, setCartState] = useState([]);
  const [offersState, setOffersState] = useState([]);
  const [totalState, setTotalState] = useState({
    price: 0,
    sellers: 0,
    cards: 0,
  });
  const [emptyCartState, setEmptyCartState] = useState(false);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();

  const calculateTotal = () => {
    let result = {
      price: 0,
      sellers: 0,
      cards: 0,
    };

    try {
      offersState?.forEach((item) => {
        result.sellers += 1;
        if (item?.offers.length > 0) {
          item.offers.forEach((offer) => {
            result.cards += 1;
            result.price += offer.price;
          });
        }
      });

      setTotalState(result);
    } catch (e) {
      console.log(e);
    }
  };

  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // const initializePaymentSheet = async (data) => {
  //   const { paymentIntent, ephemeralKey, customer, publishableKey } = data;

  //   const { error } = await initPaymentSheet({
  //     customerId: customer,
  //     customerEphemeralKeySecret: ephemeralKey,
  //     paymentIntentClientSecret: paymentIntent,
  //     allowsDelayedPaymentMethods: true,
  //   });
  //   if (!error) {
  //     setLoading(true);
  //   }
  // };
  // const openPaymentSheet = async () => {
  //   const { error } = await presentPaymentSheet();

  //   if (error) {
  //     console.log(`Error code: ${error.code}`, error.message);
  //   } else {
  //     console.log("Success", "Your order is confirmed!");
  //   }
  // };

  useEffect(() => {
    pokemon.configure({ apiKey: "3c362cd9-2286-48d4-989a-0d2a65b9d5a8" });

    const resolvePromises = async () => {
      // const query = functions.httpsCallable("paymentSheet");
      // let paymentIntent = await query();
      // initializePaymentSheet(paymentIntent.data);

      db.collection("users")
        .doc(auth.currentUser.uid)
        .onSnapshot((snapshot) => {
          if (snapshot.data().cart.length > 0) {
            console.log("log");
            setCartState(snapshot.data().cart);
          } else if (
            snapshot.data().cart === undefined ||
            snapshot.data().cart.length === 0
          ) {
            setEmptyCartState(true);
          }
        });
    };

    resolvePromises();
  }, []);

  const callFunction = async () => {
    const response = functions.httpsCallable("placeOrder", {
      address1: "Wacława Wojewódzkiego 1",
      address2: "mieszkanie 2",
      city: "Łódź",
      state: "Łódzkie",
      zip: "99-644",
      country: "Poland",
    });
    const result = await response();
    console.log(result);
  };

  useEffect(async () => {
    if (cartState.length > 0) {
      cartState.forEach(async (item) => {
        const cardObj = await db.collection("cards").doc(item).get();

        //fetch oweners name
        const owner = await db
          .collection("users")
          .doc(cardObj.data().owner)
          .get();

        //fetch name of the card
        const cardName = await pokemon.card.where({
          q: `id:${cardObj.data().cardId}`,
        });

        const offerObject = {
          id: cardObj.id,
          name: cardName.data[0].name,
          price: cardObj.data().price,
          graded: cardObj.data().isGraded,
          condition: cardObj.data().condition,
          images: await fetchPhotos(cardObj.id),
        };

        let isNewSeller = true;

        if (offersState.length > 0) {
          //check if seller is already in the offersState
          offersState.forEach((item, index) => {
            if (item.sellerId === owner.id) {
              isNewSeller = false;
            }
          });

          if (isNewSeller) {
            setOffersState((prevState) => [
              ...prevState,
              {
                sellerId: owner.id,
                nick: owner.data().nick,
                offers: [offerObject],
              },
            ]);
          } else {
            offersState.forEach((item, index) => {
              if (item.sellerId === owner.id) {
                // offersState[index].offers.push(offerObject);
                setOffersState((prevState) => [
                  ...prevState,
                  prevState[index].offers.push(offerObject),
                ]);
              }
            });
          }
        } else {
          setOffersState((prevState) => [
            ...prevState,
            {
              sellerId: owner.id,
              nick: owner.data().nick,
              offers: [offerObject],
            },
          ]);
        }
      });
    }
  }, [cartState]);

  useEffect(() => {
    if (offersState.length > 0) {
      calculateTotal();
    }
  }, [offersState]);

  if (offersState.length > 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1B1B1B" }}>
        <FlatList
          data={offersState}
          renderItem={({ item, index }) => {
            return (
              <View>
                <Text
                  style={{
                    color: "#7c7c7c",
                    fontSize: 12,
                    marginTop: 10,
                    marginLeft: 12,
                  }}
                >
                  from{"  "}
                  <Text
                    style={{
                      color: "#bbbbbb",
                      fontSize: 17,
                      fontFamily: "Roboto_Medium",
                    }}
                  >
                    {item.nick}
                  </Text>
                </Text>
                <FlatList
                  data={offersState[index].offers}
                  renderItem={({ item }) => {
                    return (
                      <CartObject
                        props={item}
                        setOffersState={setOffersState}
                        setCartState={setCartState}
                      />
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            );
          }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  width: "100%",
                  height: 500,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size={"large"} color={"#0082ff"} />
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        <ZigzagLines
          width={width}
          backgroundColor="transparent"
          color="#121212"
        />
        <View
          style={{
            width: "100%",
            backgroundColor: "#121212",
            height: 130,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 20,
              color: "#7C7C7C",
              marginTop: 12,
              marginLeft: 12,
            }}
          >
            In Total
          </Text>
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "600",
              fontFamily: "Roboto_Medium",

              marginVertical: 12,
              marginLeft: 12,
            }}
          >
            {totalState.price} USD{" "}
            <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
              for
            </Text>{" "}
            {totalState.cards} cards{" "}
            <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
              from
            </Text>{" "}
            {totalState.sellers} seller
          </Text>
          <TouchableOpacity
            style={{
              marginHorizontal: 12,
              paddingVertical: 5,
              paddingHorizontal: 12,

              borderRadius: 3,
              backgroundColor: "#0082ff",

              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            onPress={callFunction}
          >
            <Text
              style={{
                color: "#121212",
                fontWeight: "700",
                fontSize: 18,
              }}
            >
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (emptyCartState) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1b1b1b",
        }}
      >
        <Icon
          name="cart"
          color={"#0082ff"}
          size={58}
          style={{ marginBottom: 12 }}
        />

        <Text
          style={{
            color: "#f4f4f4",
            fontSize: 38,
            fontWeight: "700",
            marginBottom: 12,
            paddingHorizontal: 20,
            textAlign: "center",
          }}
        >
          Quite empty here!
        </Text>

        <Text
          style={{
            color: "#4f4f4f",
            fontSize: 15,
            width: "88%",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          Ohhh, it looks like you haven't added any offers to your cart yet.
          Let's change that!
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#1b1b1b",
      }}
    >
      <ActivityIndicator size={"large"} color={"#0082ff"} />
    </View>
  );
}
