import React, { useEffect, useState } from "react";
import { Image, View, ActivityIndicator, Text, FlatList } from "react-native";
import { db, fetchOwnerData, fetchSavedOffersId, auth } from "../authContext";

import { CardSellerProfile } from "../shared/Cards/CardSellerProfile";
import { useIsFocused } from "@react-navigation/native";
import SellerDetailsBar from "../shared/SellerDetailsBar";

export default function OtherSellersOffers({ route }) {
  const [loading, setLoading] = useState(true);
  const [cardsArray, setCardsArray] = useState([]);
  const [sellerData, setSellerData] = useState(null);
  const [savedOffersId, setSavedOffersId] = useState(null);

  const [userCountry, setUserCountry] = useState(null);
  const [cartState, setCartState] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    const resolvePromise = async () => {
      if (!isFocused) {
        setSavedOffersId(null);
        setLoading(true);
      }
      if (isFocused) {
        await fetchSavedOffersId(setSavedOffersId, setLoading);
        const docArr = await db
          .collection("offers")
          .where("owner", "==", route.params.sellerId)
          .get();

        const arr = [];

        docArr.forEach((doc) => {
          let cardObj = doc.data();
          cardObj.id = doc.id;
          arr.push(cardObj);
        });

        const doc = await db
          .collection("users")
          .doc(auth.currentUser.uid)
          .get();
        setCartState(doc.data().cart);
        setUserCountry(doc.data().country);

        setSellerData(await fetchOwnerData(route.params.sellerId));
        setCardsArray(arr);
        setLoading(false);
      }
    };
    resolvePromise();
  }, [isFocused]);

  if (!loading && sellerData !== null) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#1b1b1b",
        }}
      >
        <View>
          <View
            style={{
              position: "relative",
              alignItems: "center",
              flexDirection: "row",

              borderRadius: 3,
              backgroundColor: "#121212",

              marginTop: 12,
              marginHorizontal: 12,
            }}
          >
            <View
              style={{
                backgroundColor: "#404040",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderTopLeftRadius: 3,
                // borderBottomLeftRadius: 3,
                marginRight: 10,
              }}
            >
              <Image
                style={{ width: 28, height: 21 }}
                source={{
                  uri: `https://flagcdn.com/160x120/${sellerData.countryCode}.png`,
                }}
              />
            </View>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 20 }}>
              {sellerData.nick}
            </Text>
          </View>
          <View style={{ marginRight: 12, marginLeft: 12 }}>
            <SellerDetailsBar
              props={{
                hide: false,
                sellerProfile: {
                  ...sellerData.sellerProfile,
                  name: sellerData.nick,
                  uid: route.params.sellerId,
                },
              }}
            />
          </View>
        </View>

        {cardsArray !== null || cardsArray.length > 0 ? (
          <FlatList
            data={cardsArray}
            renderItem={({ item, index }) => {
              if (item.status === "published") {
                return (
                  <CardSellerProfile
                    props={item}
                    isSavedState={savedOffersId}
                    cartArray={cartState}
                    userCountry={userCountry}
                  />
                );
              } else {
                return null;
              }
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1b1b1b",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#0082ff" />
    </View>
  );
}
