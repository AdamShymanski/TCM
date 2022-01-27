import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import {
  fetchOffers,
  fetchMoreCards,
  fetchSavedOffersId,
  fetchMostRecentOffers,
  db,
  auth,
} from "../authContext";

import { useIsFocused } from "@react-navigation/native";

import PickerModal from "../shared/Modals/PickerModal";
import pikachu from "../assets/pikachu.png";

import DefaultCard from "../shared/Cards/DefaultCard";
import OfferCard from "../shared/Cards/OfferCard";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Search({ props, setProps }) {
  const [id, setId] = useState(null);
  const [offersData, setOffersData] = useState([]);
  const [pickerModal, setPickerModal] = useState(false);
  const [savedOffersId, setSavedOffersId] = useState([]);
  const [mostRecentOffers, setMostRecentOffers] = useState([]);
  const [pickerMode, setPickerMode] = useState("filtering");

  const [noCardsState, setNoCards] = useState(false);
  const [cartState, setCartState] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    const resolvePromise = async () => {
      setProps((prev) => ({ ...prev, loadingState: true }));
      await fetchSavedOffersId(setSavedOffersId, setProps);
      const doc = await db.collection("users").doc(auth.currentUser.uid).get();
      setCartState(doc.data().cart);
      setMostRecentOffers(await fetchMostRecentOffers());
      setProps((prev) => ({ ...prev, loadingState: false }));
    };
    resolvePromise();
  }, []);

  useEffect(() => {
    if (props.cardsData.length >= 1) {
      setProps((prevState) => ({
        ...prevState,
        screen: "cards",
      }));
    }
    if (props.cardsData.length === 0 && noCardsState) {
      setProps((prevState) => ({
        ...prevState,
        screen: "noCards",
      }));
    }
  }, [props.cardsData]);

  useEffect(() => {
    if (props.loadingState && mostRecentOffers.length !== 0) setNoCards(true);
  }, [props.loadingState]);

  useEffect(async () => {
    if (!isFocused) {
      setSavedOffersId([]);
      setProps((prevState) => ({
        ...prevState,
        loadingState: true,
      }));
    }
    if (isFocused) {
      await fetchSavedOffersId(setSavedOffersId, setProps);
    }
  }, [isFocused]);

  useEffect(async () => {
    if (id !== undefined || null || []) {
      setProps((prevState) => ({
        ...prevState,
        loadingState: true,
      }));

      setOffersData(await fetchOffers(id, props.filterParams));

      setProps((prevState) => ({
        ...prevState,
        loadingState: false,
      }));
    }
  }, [id, props.filterParams]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1b1b1b",
      }}
    >
      <PickerModal
        props={props}
        setProps={setProps}
        mode={pickerMode}
        visible={pickerModal}
        setVisible={setPickerModal}
      />
      <View style={{ flex: 1, backgroundColor: "#1b1b1b" }}>
        <View
          style={{
            backgroundColor: "#121212",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {props.screen === "cards" && !props.loadingState ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flexDirection: "row", marginVertical: 12 }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 4,

                  marginLeft: 8,
                  marginTop: 4,

                  height: 32,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1b1b1b",
                }}
                onPress={() => {
                  setPickerMode("sorting");
                  setPickerModal(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#f4f4f4",
                  }}
                >
                  {" Sort by :  "}
                  <Text style={{ color: "#0082ff" }}>{props.sorterParams}</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          ) : null}
          {props.screen === "offers" && !props.loadingState ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flexDirection: "row", marginVertical: 12 }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 3,
                  marginLeft: 12,

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#777777",
                  paddingHorizontal: 14,
                  height: 32,
                  marginTop: 4,
                }}
                onPress={() => {
                  setOffersData([]);
                  setId([]);
                  setProps((prevState) => ({
                    ...prevState,
                    screen: "cards",
                  }));
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#777777",
                  }}
                >
                  {"Go back"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 4,

                  marginLeft: 8,
                  marginTop: 4,
                  marginRight: 8,

                  height: 32,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1b1b1b",
                }}
                onPress={() => {
                  setPickerMode("filtering");
                  setPickerModal(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#f4f4f4",
                    marginRight: 10,
                  }}
                >
                  {"Filters"}
                </Text>
                <Icon name="filter-plus" color={"#0082ff"} size={20} />
              </TouchableOpacity>
            </ScrollView>
          ) : null}
        </View>
        {props.screen === "noCards" && !props.loadingState ? (
          <View
            style={{
              flex: 1,

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={pikachu}
              style={{
                aspectRatio: 651 / 522,
                width: "64%",
                height: undefined,
              }}
            />
            <Text
              style={{
                color: "#434343",
                fontSize: 20,
                fontWeight: "600",
                marginTop: 30,
                fontWeight: "700",
              }}
            >
              {"Search for a card"}
            </Text>
          </View>
        ) : null}
        {props.screen === "mostRecentOffers" && !props.loadingState ? (
          <FlatList
            data={mostRecentOffers}
            renderItem={({ item }) => {
              if (item.status === "published") {
                return (
                  <OfferCard
                    props={item}
                    isSavedState={savedOffersId}
                    cartArray={cartState}
                    nameOfCard={true}
                  />
                );
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
        ) : null}
        {props.screen === "cards" && !props.loadingState ? (
          <FlatList
            style={{ paddingHorizontal: 8 }}
            data={props.cardsData}
            numColumns={2}
            renderItem={({ item }) => {
              return (
                <DefaultCard props={item} setId={setId} setProps={setProps} />
              );
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
            onEndReached={async () => {
              await fetchMoreCards(props, setProps);
              setProps((prevState) => ({
                ...prevState,
                pageNumber: props.pageNumber + 1,
              }));
            }}
            onEndReachedThreshold={4}
          />
        ) : null}
        {props.screen === "offers" &&
        offersData?.length > 0 &&
        !props.loadingState ? (
          <FlatList
            data={offersData}
            renderItem={({ item }) => {
              if (item.status === "published") {
                return (
                  <OfferCard
                    props={item}
                    isSavedState={savedOffersId}
                    cartState={cartState}
                    nameOfCard={false}
                  />
                );
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
        ) : null}
        {props.screen === "offers" &&
        (offersData?.length === 0 || offersData === undefined) &&
        !props.loadingState ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                color: "#5c5c5c",
                fontWeight: "700",
                fontSize: 20,
                width: "80%",
                textAlign: "center",
              }}
            >
              There are no offers with the specified filters
            </Text>
          </View>
        ) : null}
        {props.loadingState ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0082ff" />
          </View>
        ) : null}
      </View>
    </View>
  );
}
