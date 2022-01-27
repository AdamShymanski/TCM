import React, { useEffect, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  r,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import DeleteCardModal from "../shared/Modals/DeleteCardModal";
import { AlertModal } from "../shared/Modals/AlertModal";
import { CardYourOffers } from "../shared/Cards/CardYourOffers";

import { fetchUsersCards } from "../authContext";

export default function YourOffers() {
  const navigation = useNavigation();

  const [cardsData, setCardsData] = useState([]);
  const [modalState, setModalState] = useState(null);
  const [alertModal, setAlertModal] = useState(null);
  const [loadingState, setLoadingState] = useState(true);

  const [id, setId] = useState(null);

  useEffect(() => {
    const resolvePromises = async () => {
      setCardsData(await fetchUsersCards());
    };

    resolvePromises();
    setLoadingState(false);
  }, []);

  useEffect(() => {
    const resolvePromises = async () => {
      if (modalState === false) {
        setLoadingState(true);
        setModalState(null);
        setCardsData(await fetchUsersCards());
        setLoadingState(false);
      }
    };

    resolvePromises();
  }, [modalState]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1b1b1b",
        flexDirection: "column",
      }}
    >
      {loadingState ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0082ff" />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "96%",
              backgroundColor: "#121212",
              paddingVertical: 10,
              marginLeft: "2%",
              marginTop: 10,
              marginBottom: 6,
              borderRadius: 4,
            }}
            onPress={() => {
              navigation.navigate("AddCard");
            }}
          >
            <MaterialIcons
              name="add"
              size={24}
              color="#f4f4f4"
              style={{ position: "absolute", left: "25%" }}
            />
            <Text
              style={{
                color: "#f4f4f4",
                fontWeight: "700",
                fontSize: 15,
                marginRight: 8,
              }}
            >
              {"Add a new Card"}
            </Text>
          </TouchableOpacity>

          {cardsData.length > 0 ? (
            <FlatList
              data={cardsData}
              renderItem={({ item, index }) => {
                return (
                  <CardYourOffers
                    props={item}
                    setModal={setModalState}
                    setId={setId}
                  />
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
                name="cards"
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
                Add New Offers!
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
                Add photos, description, price and condition of the card and
                sell it. It's really easy with PTCG Marketplace.
              </Text>
            </View>
          )}
        </View>
      )}
      {modalState ? <DeleteCardModal setModal={setModalState} id={id} /> : null}
      {alertModal ? <AlertModal setModal={setAlertModal} /> : null}
    </View>
  );
}
