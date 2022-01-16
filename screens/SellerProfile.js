import React, { useEffect, useState } from "react";
import { Image, View, ActivityIndicator, Text, FlatList } from "react-native";
import { db, fetchOwnerData, fetchSavedOffersId } from "../authContext";

import { CardSellerProfile } from "../shared/cards/CardSellerProfile";
import { useIsFocused } from "@react-navigation/native";
import SellerDetailsBar from "../shared/SellerDetailsBar";

export default function SellerProfile({ route }) {
  const [cardsArray, setCardsArray] = useState([]);
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();
  const [savedOffersId, setSavedOffersId] = useState(null);

  useEffect(() => {
    const resolvePromises = async () => {
      const docArr = await db
        .collection("cards")
        .where("owner", "==", route.params.sellerId)
        .get();

      const arr = [];

      docArr.forEach((doc) => {
        let cardObj = doc.data();
        cardObj.id = doc.id;
        arr.push(cardObj);
      });

      setSellerData(await fetchOwnerData(route.params.sellerId));
      setCardsArray(arr);
      setLoading(false);
    };

    resolvePromises();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setSavedOffersId(null);
      setLoading(true);
    }
    if (isFocused) {
      fetchSavedOffersId(setSavedOffersId, setLoading);
    }
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
              {sellerData.name}
            </Text>
          </View>
          <View style={{ marginRight: 12, marginLeft: 12 }}>
            <SellerDetailsBar
              props={{ hide: false, collectionSize: sellerData.collectionSize }}
            />
          </View>
        </View>

        {cardsArray !== null || cardsArray.length > 0 ? (
          <FlatList
            data={cardsArray}
            renderItem={({ item, index }) => {
              return (
                <CardSellerProfile props={item} isSavedState={savedOffersId} />
              );
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
