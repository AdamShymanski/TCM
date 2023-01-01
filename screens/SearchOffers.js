import React, { useEffect, useState } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";
import { View, ActivityIndicator, FlatList, Text, Image } from "react-native";

import { db, auth, fetchOffers } from "../authContext";

import OfferCard from "./../shared/Cards/OfferCard";
import PickerModal from "../shared/Modals/PickerModal";

import question_mark_pokemon from "../assets/question_mark_pokemon.png";

export default function SearchOffers({ pickerModal, setPickerModal }) {
  const route = useRoute();
  const navigation = useNavigation();

  const { id } = route.params;
  // const id = "sm11-72";

  const [activityIndicator, setActivityIndicator] = useState(true);
  const [offersData, setOffersData] = useState([]);
  const [user, setUser] = useState(null);

  const [filters, setFilters] = useState({
    language: [],
    price: { from: null, to: null },
    graded: null,
    condition: null,
  });

  useEffect(() => {
    if (!pickerModal) {
      const resolvePromises = async () => {
        setActivityIndicator(true);
        if (!user) {
          if (auth?.currentUser) {
            await db
              .collection("users")
              .doc(auth.currentUser.uid)
              .get()
              .then((doc) => {
                setUser(doc.data());
              });
          } else {
            setUser({
              cart: [],
              savedOffers: [],
              country: "United States",
            });
          }
        }
        await fetchOffers(id, filters, setOffersData);
        setActivityIndicator(false);
      };

      resolvePromises();
    }
  }, [, pickerModal]);

  if (activityIndicator) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1b1b1b",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0082ff" />
      </View>
    );
  } else if (offersData.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1b1b1b",
          width: "100%",
          height: "100%",
        }}
      >
        <PickerModal
          filters={filters}
          setFilters={setFilters}
          visible={pickerModal}
          setVisible={setPickerModal}
        />

        <Image
          source={question_mark_pokemon}
          style={{ aspectRatio: 400 / 800, height: undefined, width: "30%" }}
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
          Hmmmm....
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
          We cannot find any cards that match your filters. Try to make some
          tweaks and try again.
        </Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: "#1b1b1b",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <PickerModal
          filters={filters}
          setFilters={setFilters}
          visible={pickerModal}
          setVisible={setPickerModal}
        />

        <FlatList
          data={offersData}
          scrollEventThrottle={2000}
          style={{
            width: "100%",
          }}
          renderItem={({ item }) => {
            if (item.status === "published") {
              return (
                <OfferCard
                  props={item}
                  cartArray={user.cart}
                  isSavedState={user.savedOffers}
                  userCountry={user.country}
                  nameOfCard={false}
                />
              );
            } else {
              return null;
            }
          }}
          ListEmptyComponent={
            <View
              style={{
                width: "100%",
                height: 600,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0082ff" />
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
