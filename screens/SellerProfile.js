import React, { useEffect, useState } from "react";
import { Image, View, ActivityIndicator, Text, FlatList } from "react-native";
import { db, fetchOwnerData, fetchSavedOffersId } from "../authContext";

import { CardSellerProfile } from "../shared/cards/CardSellerProfile";
import { useIsFocused } from "@react-navigation/native";

export default function SellerProfile({ route }) {
  const [loading, setLoading] = useState(true);
  const [cardsArray, setCardsArray] = useState([]);
  const [sellerData, setSellerData] = useState(null);
  const [savedOffersId, setSavedOffersId] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    const resolvePromises = async () => {
      setSellerData(await fetchOwnerData(route.params.sellerId));

      const arr = [];
      const docArr = await db
        .collection("cards")
        .where("owner", "==", route.params.sellerId)
        .get();
      docArr.forEach((doc) => {
        let cardObj = doc.data();
        cardObj.id = doc.id;
        arr.push(cardObj);
      });
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
                uri: `https://flagcdn.com/160x120/${sellerData.countryCode}.png`,
              }}
            />
          </View>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 20 }}>
            {sellerData.name}
          </Text>
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
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1b1b1b",
            }}
          >
            <Icon
              name="bookmark"
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
              Save For Later!
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
              You can save the offers you like and review them again later. This
              will help you make a good decision.
            </Text>
          </View>
        )}
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
