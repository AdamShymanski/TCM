import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const { width } = Dimensions.get("window");
import CartObject from "../shared/Objects/CartObject";

import { db, auth, fetchOwnerData } from "../authContext";

import ZigzagLines from "react-native-zigzag-lines";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation, useIsFocused } from "@react-navigation/native";

// [
//   {
//     data: [
//       {
//         cardId: "neo4-61",
//         condition: 9,
//         description: "PSA 9.",
//         id: "yyafoAYS0lQ8lHGvYQ0C",
//         isGraded: true,
//         languageVersion: "English",
//         owner: "MVmhz0e2HFds3yIgscXxLRED8HE3",
//         price: 65,
//         status: "published",
//         timestamp: {
//           nanoseconds: 658000000,
//           seconds: 1652905171,
//         },
//       },
//       {
//         cardId: "base2-58",
//         condition: 10,
//         description: "PSA 10. Mint.",
//         id: "HtFlbcrhgPfiR6AffNJ2",
//         isGraded: true,
//         languageVersion: "English",
//         owner: "MVmhz0e2HFds3yIgscXxLRED8HE3",
//         price: 100,
//         status: "published",
//         timestamp: {
//           nanoseconds: 388000000,
//           seconds: 1652905566,
//         },
//       },
//     ],
//     title: "John Doe",
//     uid: "MVmhz0e2HFds3yIgscXxLRED8HE3",
//   },
//   {
//     data: [
//       {
//         cardId: "bw11-RC14",
//         condition: 10,
//         description: "Perfect condition. Graded by PSA.",
//         id: "AwPacv081ZZLBZsiS396",
//         isGraded: true,
//         languageVersion: "Japanese",
//         owner: "Uldn432HRXYcHPVCMnLQ9ik4GMr1",
//         price: 414,
//         status: "published",
//         timestamp: {
//           nanoseconds: 919000000,
//           seconds: 1652906798,
//         },
//       },
//     ],
//     title: "Marc Smith",
//     uid: "Uldn432HRXYcHPVCMnLQ9ik4GMr1",
//   },
// ]

export default function Cart({ route }) {
  const [cartState, setCartState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalState, setTotalState] = useState({
    sellers: [],
    price: 0,
    cards: 0,
  });
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isFocused) {
      setCartState([]);
      setLoading(true);
    }
    if (isFocused) {
      try {
        let val = {
          sellers: [],
          price: 0,
          cards: 0,
        };

        const promise = new Promise(async (resolve, reject) => {
          const cartArr = [];
          const doc = await db
            .collection("users")
            .doc(auth.currentUser.uid)
            .get();

          if (doc.data().cart.length > 0) {
            doc.data().cart.forEach(async (item, index) => {
              const card = await db.collection("offers").doc(item).get();

              val.price += card.data().price;
              val.cards++;
              if (!val.sellers.includes(card.data().owner)) {
                val.sellers.push(card.data().owner);
              }

              const owner = await fetchOwnerData(card.data().owner);

              if (card.data().status === "published") {
                const res = cartArr.find((item) => {
                  if (item.uid === card.data().owner) {
                    item.data.push({ ...card.data(), id: card.id });
                    return true;
                  }
                });

                if (!res) {
                  cartArr.push({
                    data: [{ ...card.data(), id: card.id }],
                    title: owner.nick,
                    uid: card.data().owner,
                  });
                }
              }

              if (index + 1 == doc.data().cart.length) {
                if (cartArr.length > 0) {
                  resolve(cartArr);
                } else {
                  reject(false);
                }
              }
            });
          } else {
            reject("no cart");
          }
        });

        promise
          .then((result) => {
            setCartState(result);
            setLoading(false);
            setTotalState(val);
          })
          .catch((e) => {
            setCartState([]);
            setLoading(false);
            console.log(e);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1B1B1B",
        }}
      >
        <ActivityIndicator color={"#0082ff"} size={"large"} />
      </View>
    );
  } else if (cartState.length > 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1B1B1B" }}>
        <SectionList
          style={{ width: "100%" }}
          sections={cartState}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => {
            return <CartObject props={item} setOffers={setCartState} />;
          }}
          renderSectionHeader={({ section: { title } }) => (
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
                  {title}
                </Text>
              </Text>
            </View>
          )}
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
            {totalState.price.toFixed(2)} USD{" "}
            <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
              for
            </Text>{" "}
            {totalState.cards} cards{" "}
            <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
              from
            </Text>{" "}
            {totalState.sellers.length} seller
          </Text>
          <TouchableOpacity
            style={{
              marginHorizontal: 12,

              paddingHorizontal: 12,

              // borderRadius: 4,

              flexDirection: "row",

              backgroundColor: "#0082ff",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              paddingVertical: 7,
            }}
            onPress={() => {
              navigation.navigate("Checkout");
            }}
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
  } else {
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
          Quite Empty Here!
        </Text>
        <Text
          style={{
            fontSize: 15,
            width: "80%",
            color: "#4f4f4f",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          Search for a card and add it to your cart. Then You will be able to
          place an order and finally buy them.
        </Text>
      </View>
    );
  }
}
