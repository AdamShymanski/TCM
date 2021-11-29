import React, { useState } from "react";

import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";

import { MaterialIcons } from "@expo/vector-icons";
import IconMI from "react-native-vector-icons/MaterialCommunityIcons";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Modal,
  TextInput as TextInputNative,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { Checkbox, TextInput } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import { addCard, fetchBigCards, fetchMoreBigCards } from "../authContext";

import pikachu from "../assets/pikachu.png";

import CardAddCardPage from "../shared/cards/CardAddCardPage";

import PickerModal from "../shared/PickerModal";
import { LanguagePickerModal } from "../shared/LanguagePickerModal";

export default function AddCard() {
  const navigation = useNavigation();

  const priceRegEx = /^\d+([.,]\d{1,2})?$/g;
  const gradeRegEx = /^[1-9]|10*$/g;

  const reviewSchema = yup.object({
    price: yup
      .string("Wrong format!")
      .matches(priceRegEx, "Wrong format!")
      .required("Price is required!")
      .max(12, "Price is too long!"),
    condition: yup
      .string("Wrong format!")
      .matches(gradeRegEx, "Wrong format!")
      .required("Condition is required!")
      .max(2, "Wrong format"),
    languageVersion: yup
      .string("Wrong format!")
      .required("Language Version is required!")
      .min(4, "Wrong format"),
    description: yup
      .string("Wrong format!")
      .required("Description is required!")
      .max(60, "Description is too long!"),
  });

  const ImagePlaceHolder = () => {
    if (photoState === null || undefined) {
      return (
        <View style={{ flexDirection: "row", paddingTop: 20 }}>
          <View
            style={{
              aspectRatio: 3 / 4,
              width: "28%",
              height: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: "#5c5c5c",
              borderStyle: "dashed",

              marginRight: 20,
            }}
          />
          <View
            style={{
              aspectRatio: 3 / 4,
              width: "28%",
              height: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: "#5c5c5c",
              borderStyle: "dashed",

              marginRight: 20,
            }}
          />
          <View
            style={{
              aspectRatio: 3 / 4,
              width: "28%",
              height: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: "#5c5c5c",
              borderStyle: "dashed",
            }}
          />
        </View>
      );
    }
    if (photoState !== null || undefined) {
      return (
        <View style={{ flexDirection: "row" }}>
          {photoState[0] === undefined || null ? (
            <View
              style={{
                aspectRatio: 3 / 4,
                width: "28%",
                height: undefined,
                borderWidth: 2,
                borderRadius: 8,
                borderColor: "#5c5c5c",
                borderStyle: "dashed",
                marginTop: 20,
                marginRight: 20,
              }}
            />
          ) : (
            <Image
              style={{
                aspectRatio: 3 / 4,
                width: "28%",
                height: undefined,
                marginTop: 20,
                marginRight: 20,
                borderRadius: 4,
              }}
              source={{ uri: photoState[0].uri }}
            />
          )}
          {photoState[1] === undefined || null ? (
            <View
              style={{
                aspectRatio: 3 / 4,
                width: "28%",
                height: undefined,
                borderWidth: 2,
                borderRadius: 8,
                borderColor: "#5c5c5c",
                borderStyle: "dashed",
                marginTop: 20,
                marginRight: 20,
              }}
            />
          ) : (
            <Image
              style={{
                aspectRatio: 3 / 4,
                width: "28%",
                height: undefined,
                marginTop: 20,
                marginRight: 20,
                borderRadius: 4,
              }}
              source={{ uri: photoState[1].uri }}
            />
          )}
          {photoState[2] === undefined || null ? (
            <View
              style={{
                aspectRatio: 3 / 4,
                width: "28%",
                height: undefined,
                borderWidth: 2,
                borderRadius: 8,
                borderColor: "#5c5c5c",
                borderStyle: "dashed",
                marginTop: 20,
              }}
            />
          ) : (
            <Image
              style={{
                aspectRatio: 3 / 4,
                width: "28%",
                height: undefined,
                marginTop: 20,
                marginRight: 20,
                borderRadius: 4,
              }}
              source={{ uri: photoState[2].uri }}
            />
          )}
        </View>
      );
    }
  };

  const submitForm = async (values) => {
    if (cardId) {
      if (photoState) {
        values.price = values.price.replace(/,/g, ".").replace(/ /g, "");

        await addCard(values, gradingSwitch, photoState, cardId);
        navigation.reset({
          index: 0,
          routes: [{ name: "Thanks" }],
        });
      }
    } else {
      setScError(true);
    }
  };
  const searchForCard = async () => {
    setBigCardsData(
      await fetchBigCards(nativeInputValue, pickerValue, setLoading)
    );
    setPageNumber(2);
  };
  const stateHandler = (variant) => {
    if (variant == "pikachu") {
      if (loadingState) return false;

      if (bigCardsData == null || undefined) {
        return true;
      } else if (bigCardsData.length < 1) {
        return true;
      }
      return false;
    }
    if (variant == "list") {
      if (loadingState) {
        return false;
      } else if (bigCardsData == null || undefined) {
        return false;
      } else if (bigCardsData.length < 1) {
        return false;
      } else {
        return true;
      }
    }
    if (variant == "indicator") {
      if (loadingState) return true;
      return false;
    }
  };
  const closeModal = () => {
    setModal(false);
    setNativeInputValue("");
    setBigCardsData(null);
    setPageNumber(2);
  };

  const [photoState, setPhoto] = useState(null);
  const [gradingSwitch, setGrading] = useState(false);

  const [modalState, setModal] = useState(false);
  const [scError, setScError] = useState(false);

  const [cardId, setId] = useState(null);

  const [loadingState, setLoading] = useState(false);
  const [bigCardsData, setBigCardsData] = useState(null);

  const [nativeInputValue, setNativeInputValue] = useState("");
  const [inputPlaceholderState, setInputPlaceholder] = useState(
    "Number or Name of Card"
  );

  const [pickerValue, setPickerValue] = useState("Rarity Declining");
  const [pickerModal, setPickerModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(2);

  const [languagePickerState, setLanguagePickerState] = useState(false);
  const [languageInputTouched, setLanguageInputTouched] = useState(false);

  //state exclusively for Language Version
  const [submitClicked, setSubmitClicked] = useState(false);

  const [loadingIndicator, setLoadingIndicator] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1b1b1b", padding: 20 }}>
      <PickerModal
        setValue={setPickerValue}
        propsArry={[
          // 'Price Ascending',
          // 'Price Declining',
          "Rarity Ascending",
          "Rarity Declining",
        ]}
        visible={pickerModal}
        setVisible={setPickerModal}
      />
      <Modal visible={modalState} animationType={"slide"}>
        <View style={{ flex: 1, backgroundColor: "#1b1b1b" }}>
          <View
            style={{
              backgroundColor: "#121212",
              height: 80,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,

                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#777777",
                paddingHorizontal: 12,
              }}
              onPress={() => {
                closeModal();
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <TextInputNative
                mode="outlined"
                placeholderTextColor={"#5c5c5c"}
                outlineColor={"#121212"}
                onEndEditing={() => {
                  searchForCard();
                }}
                value={nativeInputValue}
                onChangeText={(text) => setNativeInputValue(text)}
                placeholder={inputPlaceholderState}
                onFocus={() => setInputPlaceholder("")}
                onBlur={() => setInputPlaceholder("Number or Name of Card")}
                style={{
                  width: 260,
                  height: 40,
                  marginBottom: 5,
                  borderColor: "#121212",
                  backgroundColor: "#1b1b1b",
                  borderWidth: 2,
                  borderRadius: 5,
                  paddingLeft: 10,
                  color: "#f4f4f4",
                }}
              />
              <MaterialIcons
                name="search"
                size={24}
                color={"#f4f4f4"}
                style={{ position: "absolute", right: 14 }}
              />
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#121212",

              borderTopColor: "#5c5c5c",
              borderTopWidth: 1.5,
              marginBottom: 12,
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: 8,
              paddingTop: 8,
            }}
          >
            <View style={{ flexDirection: "row" }}>
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
                  backgroundColor: "#1B1B1B",
                }}
                onPress={() => setPickerModal(true)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#f4f4f4",
                  }}
                >
                  {" Sort by :  "}
                  <Text style={{ color: "#0082ff" }}>{pickerValue}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {stateHandler("pikachu") ? (
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
                  width: "80%",
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
                {"No cards found "}
              </Text>
            </View>
          ) : null}

          {stateHandler("list") ? (
            <FlatList
              style={{ paddingHorizontal: 8 }}
              data={bigCardsData}
              numColumns={2}
              renderItem={({ item }) => {
                return (
                  <CardAddCardPage
                    props={item}
                    setId={setId}
                    closeModal={closeModal}
                  />
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={async () => {
                await fetchMoreBigCards(
                  nativeInputValue,
                  pickerValue,
                  pageNumber,
                  bigCardsData,
                  setBigCardsData
                );
                setPageNumber(pageNumber + 1);
              }}
              onEndReachedThreshold={4}
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
      </Modal>
      <View>
        <TouchableOpacity
          style={{
            borderRadius: 4,
            marginRight: 16,

            height: 36,
            width: 230,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0082FF",
          }}
          onPress={() => {
            navigation.navigate("ImageBrowser", { photoState, setPhoto });
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#121212",
            }}
          >
            Add photos of the card
          </Text>
          <IconMI
            name={"camera-image"}
            size={22}
            color="#121212"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 10,
            marginLeft: 12,
            fontSize: 14,
            fontWeight: "700",
            color: "#4c4c4c",
          }}
        >
          You must pick at least one photo
        </Text>
      </View>
      <Formik
        style={{ flex: 1 }}
        initialValues={{
          price: "",
          condition: "",
          description: "",
          languageVersion: "",
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values, actions) => {
          setLoadingIndicator(true);
          await submitForm(values);
          setLoadingIndicator(false);
        }}
      >
        {(props) => (
          <View>
            {languagePickerState ? (
              <LanguagePickerModal
                setValue={(value) => {
                  props.setFieldValue("languageVersion", value);
                }}
                setVisible={setLanguagePickerState}
              />
            ) : null}
            <View style={{ flexDirection: "row" }}>
              <ImagePlaceHolder />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 4,

                  marginRight: 16,
                  marginTop: 16,

                  height: 36,
                  width: 160,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#0082FF",
                }}
                onPress={() => {
                  setModal(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                  }}
                >
                  Select Card
                </Text>
                <IconMI
                  name={"cards"}
                  size={22}
                  color="#121212"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>

              {cardId ? (
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 11,
                    marginTop: 6,
                    marginLeft: 6,
                    color: "#5c5c5c",
                  }}
                >
                  ID of seleceted Card:
                  <Text
                    style={{
                      color: "#0082FF",
                    }}
                  >
                    {cardId}
                  </Text>
                </Text>
              ) : null}

              {scError && !cardId ? (
                <Text
                  style={{
                    color: "#b80424",
                    fontWeight: "700",
                    marginTop: 6,
                    marginLeft: 6,
                  }}
                >
                  You must select the card!
                </Text>
              ) : null}

              <TextInput
                mode={"outlined"}
                value={props.values.price}
                onChangeText={props.handleChange("price")}
                label="Price ($)"
                outlineColor={"#5c5c5c"}
                error={props.touched.price && props.errors.price ? true : false}
                style={{
                  width: "85%",
                  backgroundColor: "#1b1b1b",
                  color: "#f4f4f4",
                  marginTop: 20,
                }}
                theme={{
                  colors: {
                    primary: "#0082ff",
                    placeholder: "#5c5c5c",
                    background: "transparent",
                    text: "#f4f4f4",
                  },
                }}
              />
              <Text
                style={{
                  color: "#5c5c5c",
                  fontSize: 12,
                  fontWeight: "600",
                  marginTop: 6,
                }}
              >
                Example: 2,531.00 or 1.000
              </Text>
              <ErrorMessage component="div" name="price">
                {(msg) => (
                  <Text
                    style={{
                      width: "70%",
                      marginTop: 8,
                      height: 20,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      color: "#b40424",
                      fontWeight: "700",
                    }}
                  >
                    {msg}
                  </Text>
                )}
              </ErrorMessage>
              <TouchableOpacity
                style={{ width: "70%" }}
                onPress={() => {
                  setLanguagePickerState(true);
                  setLanguageInputTouched(true);
                }}
              >
                <TextInput
                  mode={"outlined"}
                  value={props.values.languageVersion}
                  onChangeText={props.handleChange("languageVersion")}
                  label="Language Version"
                  outlineColor={
                    props.errors.languageVersion &&
                    (languageInputTouched || submitClicked)
                      ? "#b40424"
                      : "#5c5c5c"
                  }
                  style={{
                    width: "85%",
                    backgroundColor: "#1b1b1b",
                    color: "#f4f4f4",
                    marginTop: 20,
                  }}
                  disabled={true}
                  theme={{
                    colors: {
                      text: "#f4f4f4",
                      disabled:
                        props.errors.languageVersion &&
                        (languageInputTouched || submitClicked)
                          ? "#b40424"
                          : "#5c5c5c",
                      background: "transparent",
                    },
                  }}
                />
              </TouchableOpacity>

              <ErrorMessage component="div" name="languageVersion">
                {(msg) => (
                  <Text
                    style={{
                      width: "70%",
                      marginTop: 8,
                      height: 20,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      color: "#b40424",
                      fontWeight: "700",
                    }}
                  >
                    {msg}
                  </Text>
                )}
              </ErrorMessage>
              <TextInput
                mode={"outlined"}
                value={props.values.description}
                onChangeText={props.handleChange("description")}
                label="Short Description"
                outlineColor={"#5c5c5c"}
                error={
                  props.touched.description && props.errors.description
                    ? true
                    : false
                }
                style={{
                  width: "85%",
                  backgroundColor: "#1b1b1b",
                  color: "#f4f4f4",
                  marginTop: 20,
                }}
                theme={{
                  colors: {
                    primary: "#0082ff",
                    placeholder: "#5c5c5c",
                    background: "transparent",
                    text: "#f4f4f4",
                  },
                }}
              />
              <ErrorMessage component="div" name="description">
                {(msg) => (
                  <Text
                    style={{
                      width: "70%",
                      marginTop: 8,
                      height: 20,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      color: "#b40424",
                      fontWeight: "700",
                    }}
                  >
                    {msg}
                  </Text>
                )}
              </ErrorMessage>
              <TextInput
                mode={"outlined"}
                value={props.values.condition}
                onChangeText={props.handleChange("condition")}
                label="Condition (from 1 to 10)"
                outlineColor={"#5c5c5c"}
                error={
                  props.touched.condition && props.errors.condition
                    ? true
                    : false
                }
                style={{
                  width: "85%",
                  backgroundColor: "#1b1b1b",
                  color: "#f4f4f4",
                  marginTop: 20,
                }}
                theme={{
                  colors: {
                    primary: "#0082ff",
                    placeholder: "#5c5c5c",
                    background: "transparent",
                    text: "#f4f4f4",
                  },
                }}
              />
              <ErrorMessage component="div" name="condition">
                {!gradingSwitch ? (
                  (msg) => (
                    <Text
                      style={{
                        width: "70%",
                        marginTop: 8,
                        height: 20,
                        marginBottom: 14,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        display: gradingSwitch ? "none" : "flex",
                        color: "#b40424",
                        fontWeight: "700",
                      }}
                    >
                      {msg}
                    </Text>
                  )
                ) : (
                  <View />
                )}
              </ErrorMessage>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    flexDirection: "row",

                    color: "#f4f4f4",
                    fontWeight: "700",
                    fontSize: 20,
                    marginRight: 10,
                  }}
                >
                  Is the card graded?
                </Text>
                <Checkbox
                  status={gradingSwitch ? "checked" : "unchecked"}
                  color={"#0082ff"}
                  uncheckedColor={"#5c5c5c"}
                  onPress={() => setGrading(!gradingSwitch)}
                />
              </View>
            </View>
            <View
              style={{
                width: "85%",
                flexDirection: "row-reverse",
                marginBottom: 40,
              }}
            >
              <TouchableOpacity
                style={{
                  height: 30,
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "#0082FF",
                  borderRadius: 3,
                  paddingHorizontal: 20,
                }}
                onPress={() => {
                  setSubmitClicked(true);
                  props.submitForm();
                  if (!cardId) {
                    setScError(true);
                  }
                }}
                type={"submit"}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
              {loadingIndicator ? (
                <ActivityIndicator
                  size={30}
                  color="#0082ff"
                  animating={loadingIndicator}
                  style={{
                    marginRight: 14,
                  }}
                />
              ) : null}
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}