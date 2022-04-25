import React, { useEffect, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  Image,
} from "react-native";

import Stripe_logo from "../assets/Stripe_logo.png";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import AlertModal from "../shared/Modals/AlertModal";
import DeleteCardModal from "../shared/Modals/DeleteCardModal";

import { CardYourOffers } from "../shared/Cards/CardYourOffers";

import { db, functions, auth, fetchUsersCards } from "../authContext";

export default function YourOffers() {
  const navigation = useNavigation();

  const [cardsData, setCardsData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [alertModal, setAlertModal] = useState(null);
  const [loadingState, setLoadingState] = useState(true);
  const [vendorId, setVendorId] = useState(undefined);
  const [activityIndicator, setActivityIndicator] = useState(false);

  const [id, setId] = useState(null);

  useEffect(() => {
    const resolvePromises = async () => {
      //fetch id of stripe vendor account
      const doc = await db.collection("users").doc(auth.currentUser.uid).get();
      setVendorId(doc.data()?.stripe?.vendorId);

      setCardsData(await fetchUsersCards());
    };

    resolvePromises();
    setLoadingState(false);
  }, []);

  useEffect(() => {
    const resolvePromises = async () => {
      if (deleteModal === false) {
        setLoadingState(true);
        setDeleteModal(null);
        setCardsData(await fetchUsersCards());
        setLoadingState(false);
      }
    };

    resolvePromises();
  }, [deleteModal]);

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
        <View style={{ flex: 1 }}>
          {!vendorId ? (
            <View
              style={{
                flex: 1,
                backgroundColor: "#1b1b1b",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconMCI
                name="shield-check"
                color={"#0082ff"}
                size={58}
                style={{ marginBottom: 12, marginTop: 20 }}
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
                Let us know you!
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
                Before we allow you to post your offer, we need to verify your
                identity for safety reasons. Therefore, you must create Stripe
                account. It's really easy and don't take more then 5 minutes to
                set up.
              </Text>

              {activityIndicator ? (
                <ActivityIndicator size={"large"} color={"#0082ff"} />
              ) : (
                <View
                  style={{
                    width: "90%",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "90%",
                      backgroundColor: "#0082ff",
                      paddingVertical: 8,
                      marginLeft: "2%",
                      marginTop: 10,
                      marginBottom: 6,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      const query = functions.httpsCallable(
                        "createStripeAccount"
                      );

                      setActivityIndicator(true);

                      query()
                        .then((result) => {
                          Linking.openURL(result.data);
                          setActivityIndicator(false);
                        })
                        .catch((err) => {
                          console.log(err);
                          setActivityIndicator(false);
                        });
                    }}
                  >
                    <Text
                      style={{
                        color: "#121212",
                        fontWeight: "700",
                        fontSize: 15,
                      }}
                    >
                      {"Add Vendor Details"}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row", marginTop: 12 }}>
                    <Text
                      style={{ fontFamily: "Roboto_Medium", color: "#555555" }}
                    >
                      Powered by{"  "}
                    </Text>
                    <Image
                      source={Stripe_logo}
                      style={{
                        aspectRatio: 282 / 117,
                        width: undefined,
                        height: 20,
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {cardsData.length > 0 ? (
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

                      marginBottom: 6,
                      marginTop: 14,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      navigation.navigate("AddCard");
                    }}
                  >
                    <IconMCI
                      name="plus"
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
                      {"Add a new card"}
                    </Text>
                  </TouchableOpacity>
                  <FlatList
                    data={cardsData}
                    renderItem={({ item, index }) => {
                      return (
                        <CardYourOffers
                          props={item}
                          setModal={setDeleteModal}
                          setId={setId}
                        />
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1b1b1b",
                  }}
                >
                  <IconMCI
                    name="cards"
                    color={"#0082ff"}
                    size={58}
                    style={{ marginBottom: 12, marginTop: 20 }}
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

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "90%",
                      backgroundColor: "#0082ff",
                      paddingVertical: 8,
                      marginLeft: "2%",
                      marginTop: 10,
                      marginBottom: 6,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      navigation.navigate("AddCard");
                    }}
                  >
                    <IconMCI
                      name="plus"
                      size={24}
                      color="#121212"
                      style={{ position: "absolute", left: "25%" }}
                    />
                    <Text
                      style={{
                        color: "#121212",
                        fontWeight: "700",
                        fontSize: 15,
                        marginLeft: 12,
                      }}
                    >
                      {"Add a new card"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      )}
      {deleteModal ? (
        <DeleteCardModal setModal={setDeleteModal} id={id} />
      ) : null}
      {alertModal ? <AlertModal setModal={setAlertModal} /> : null}
    </View>
  );
}
