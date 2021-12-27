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

import { globalStyles } from "../styles/global";

import {
  fetchCards,
  fetchSavedOffersId,
  fetchMoreBigCards,
  fetchMostRecentOffers,
} from "../authContext";

import { useIsFocused, useNavigation } from "@react-navigation/native";

import PickerModal from "../shared/PickerModal";
import pikachu from "../assets/pikachu.png";
import arrow from "../assets/arrow.png";

import BigCardHome from "../shared/cards/BigCardHome";
import { CardHome } from "../shared/cards/CardHome";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Home({
  bigCardsData,
  setBigCardsData,
  loadingState,
  setLoading,
  sortingPickerValue,
  setSortingPickerValue,
  filteringPickerValue,
  setFilteringPickerValue,
  pageNumber,
  setPageNumber,
  nativeInputValue,
  inputFocusState,
}) {
  const [id, setId] = useState(null);
  const [cardsData, setCardsData] = useState([]);
  const [pickerModal, setPickerModal] = useState(true);
  const [savedOffersId, setSavedOffersId] = useState([]);
  const [mostRecentOffers, setMostRecentOffers] = useState([]);
  const [pickerMode, setPickerMode] = useState("filtering");

  const isFocused = useIsFocused();

  useEffect(() => {
    const resolvePromise = async () => {
      await fetchSavedOffersId(setSavedOffersId, setLoading);
      setMostRecentOffers(await fetchMostRecentOffers());
    };
    resolvePromise();
  }, []);

  useEffect(() => {
    if (cardsData.length >= 1) setCardsData([]);
  }, [bigCardsData]);

  useEffect(async () => {
    if (!isFocused) {
      setSavedOffersId([]);
      setLoading(true);
    }
    if (isFocused) {
      await fetchSavedOffersId(setSavedOffersId, setLoading);
    }
  }, [isFocused]);

  useEffect(() => {
    setMostRecentOffers([]);
  }, [loadingState]);

  useEffect(async () => {
    if (id != undefined || null || []) {
      setLoading(true);
      setCardsData(await fetchCards(id));
      setLoading(false);
    }
  }, [id]);

  const stateHandler = (variant) => {
    if (variant == "pikachu") {
      if (loadingState) return false;
      if (mostRecentOffers.length > 0) return false;
      if (cardsData === null || undefined) return true;
      if (bigCardsData === null || undefined) return true;
      if (cardsData.length > 1) return false;
      if (bigCardsData.length > 1) return false;
      return true;
    }
    if (variant == "list") {
      if (loadingState) return false;
      if (cardsData === null || undefined) return false;
      if (bigCardsData === null || undefined) return false;
      if (cardsData.length >= 1) return false;
      if (bigCardsData.length < 1) return false;
      return true;
    }
    if (variant == "secondList") {
      if (loadingState) return false;
      if (cardsData === null || undefined) return false;
      if (cardsData.length >= 1) return true;
    }
    if (variant == "indicator") {
      if (loadingState) return true;
      return false;
    }
    if (variant == "topBar") {
      if (
        bigCardsData?.length >= 1 &&
        (cardsData.length < 1 || cardsData === null)
      ) {
        return true;
      }
      return false;
    }
    if (variant == "goBackBar") {
      if (cardsData.length >= 1) return true;
      return false;
    }
  };

  return (
    <View style={[globalStyles.container, { paddingLeft: 0 }]}>
      <PickerModal
        setSortingPickerValue={setSortingPickerValue}
        setFilteringPickerValue={setFilteringPickerValue}
        filteringPickerValue={filteringPickerValue}
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
          {stateHandler("topBar") ? (
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
                  <Text style={{ color: "#0082ff" }}>{sortingPickerValue}</Text>
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
                <Icon name="filter-variant" color={"#f4f4f4"} size={20} />
              </TouchableOpacity>
            </ScrollView>
          ) : null}
          {stateHandler("goBackBar") ? (
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,
                marginVertical: 12,

                height: 30,
                width: 120,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() => {
                setCardsData([]);
                setId(null);
              }}
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
          ) : null}
        </View>
        {stateHandler("pikachu") && !inputFocusState ? (
          <View
            style={{
              flex: 1,

              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 30,
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
        {mostRecentOffers.length > 1 && !inputFocusState ? (
          <FlatList
            data={mostRecentOffers}
            renderItem={({ item }) => {
              return <CardHome props={item} isSavedState={savedOffersId} />;
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : null}
        {stateHandler("list") ? (
          <FlatList
            style={{ paddingHorizontal: 8 }}
            data={bigCardsData}
            numColumns={2}
            renderItem={({ item }) => {
              return <BigCardHome props={item} setId={setId} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={async () => {
              await fetchMoreBigCards(
                nativeInputValue,
                sortingPickerValue,
                filteringPickerValue,
                pageNumber,
                bigCardsData,
                setBigCardsData
              );
              setPageNumber(pageNumber + 1);
            }}
            onEndReachedThreshold={4}
          />
        ) : null}
        {stateHandler("secondList") ? (
          <FlatList
            data={cardsData}
            renderItem={({ item }) => {
              return <CardHome props={item} isSavedState={savedOffersId} />;
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : null}
        {stateHandler("indicator") ? (
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
