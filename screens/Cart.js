import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

import pokemon from "pokemontcgsdk";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { auth, db, fetchPhotos } from "../authContext";
import CartObecjt from "../shared/CartObject";

export default function Cart({ route }) {
  const [cartState, setCartState] = useState([]);
  const [offersState, setOffersState] = useState([]);

  // useEffect(() => {
  //   const resolvePromises = async () => {
  //     const result = await db
  //       .collection("users")
  //       .doc(auth.currentUser.uid)
  //       .get();

  //     pokemon.configure({ apiKey: "3c362cd9-2286-48d4-989a-0d2a65b9d5a8" });

  //     if (result.data().cart) {
  //       setCartState(result.data().cart);
  //     }
  //   };

  //   resolvePromises();
  // }, []);

  // useEffect(async () => {
  //   if (cartState.length > 0) {
  //     cartState.forEach(async (item) => {
  //       const result = await db.collection("cards").doc(item).get();

  //       //fetch oweners name
  //       const owner = await db
  //         .collection("users")
  //         .doc(result.data().owner)
  //         .get();

  //       //fetch name of the card
  //       const card = await pokemon.card.where({
  //         q: `id:${result.data().cardId}`,
  //       });
  //       const offerObject = {
  //         id: result.id,
  //         name: card.data[0].name,
  //         price: result.data().price,
  //         graded: result.data().isGraded,
  //         condition: result.data().condition,
  //         images: await fetchPhotos(result.id),
  //       };

  //       let newSeller = true;

  //       offersState.forEach((item, index) => {
  //         if (item.sellerId === owner.id) {
  //           newSeller = false;
  //         }
  //       });

  //       if (newSeller) {
  //         setOffersState((prevState) => [
  //           ...prevState,
  //           {
  //             sellerId: owner.id,
  //             nick: owner.data().nick,
  //             offers: [offerObject],
  //           },
  //         ]);
  //       } else {
  //         offersState.forEach((item, index) => {
  //           if (item.sellerId === owner.id) {
  //             offersState[index].offers.push(offerObject);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, [cartState]);

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
        Add cards to your cart!
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
        Here you can place orders for cards you want to buy.
      </Text>
    </View>
  );

  // return (
  //   <View style={{ flex: 1, backgroundColor: "#1B1B1B" }}>
  //     <FlatList
  //       data={offersState}
  //       renderItem={({ item, index }) => {
  //         return (
  //           <View>
  //             <Text
  //               style={{
  //                 color: "#7c7c7c",
  //                 fontSize: 12,
  //                 marginTop: 10,
  //                 marginLeft: 12,
  //               }}
  //             >
  //               from{"  "}
  //               <Text
  //                 style={{
  //                   color: "#bbbbbb",
  //                   fontSize: 17,
  //                   fontFamily: "Roboto_Medium",
  //                 }}
  //               >
  //                 {item.nick}
  //               </Text>
  //             </Text>
  //             <FlatList
  //               data={offersState[index].offers}
  //               renderItem={({ item }) => {
  //                 return <CartObecjt props={item} />;
  //               }}
  //               keyExtractor={(item, index) => index.toString()}
  //             />
  //           </View>
  //         );
  //       }}
  //       keyExtractor={(item, index) => index.toString()}
  //     />
  //     <View
  //       style={{
  //         width: "100%",
  //         backgroundColor: "#121212",
  //         height: 130,
  //       }}
  //     >
  //       <Text
  //         style={{
  //           fontWeight: "700",
  //           fontSize: 20,
  //           color: "#7C7C7C",
  //           marginTop: 12,
  //           marginLeft: 12,
  //         }}
  //       >
  //         In Total
  //       </Text>
  //       <Text
  //         style={{
  //           color: "#f4f4f4",
  //           fontWeight: "600",
  //           fontFamily: "Roboto_Medium",

  //           marginVertical: 12,
  //           marginLeft: 12,
  //         }}
  //       >
  //         12.50 USD{" "}
  //         <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
  //           for
  //         </Text>{" "}
  //         2 cards{" "}
  //         <Text style={{ fontFamily: "Roboto_Regular", color: "#7C7C7C" }}>
  //           from
  //         </Text>{" "}
  //         1 seller
  //       </Text>
  //       <TouchableOpacity
  //         style={{
  //           marginHorizontal: 12,
  //           paddingVertical: 5,
  //           paddingHorizontal: 12,

  //           borderRadius: 3,
  //           backgroundColor: "#0082ff",

  //           alignItems: "center",
  //           justifyContent: "center",
  //           flexDirection: "row",
  //         }}
  //       >
  //         <Text
  //           style={{
  //             color: "#121212",
  //             fontWeight: "700",
  //             fontSize: 18,
  //           }}
  //         >
  //           Place Order
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );
}
