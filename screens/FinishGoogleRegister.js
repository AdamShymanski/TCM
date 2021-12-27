import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

import { CountryPickerModal } from "../shared/CountryPickerModal";
import { db, auth } from "../authContext";

const firstCapitalLetter = /^[A-Z].*/;
const reviewSchema = yup.object({
  country: yup
    .string("Wrong format!")
    .required("Country is required!")
    .matches(firstCapitalLetter, "Wrong country name!"),
});

export default function FinishGoogleRegister({ callback, name }) {
  const [countryPickerState, setCountryPickerState] = useState("");
  const [countryInputTouched, setCountryInputTouched] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  return (
    <ScrollView style={{ backgroundColor: "#1b1b1b", flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text
          style={{
            fontWeight: "700",
            color: "#f4f4f4",
            fontSize: 36,
            marginTop: 40,

            marginBottom: 18,
          }}
        >
          Where are you from?
        </Text>
        <Text
          style={{
            fontWeight: "600",
            color: "#939393",
            fontSize: 12,
            textAlign: "center",
            width: 280,
            marginBottom: 40,
          }}
        >
          {
            "Add the country you currently live in. This will help other users find out the shipping country."
          }
        </Text>
      </View>

      <Formik
        initialValues={{
          country: "",
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values, actions) => {
          setLoadingIndicator(true);
          db.collection("users")
            .doc(auth.currentUser.uid)
            .set({
              nick: name,
              country: values.country,
              reputation: 0,
              collectionSize: 0,
              savedOffers: [],
            })
            .then((result) => {
              setLoadingIndicator(false);
              callback(false);
            });
        }}
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          marginVertical: 40,
        }}
      >
        {(props) => (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {countryPickerState ? (
              <CountryPickerModal
                setValue={(value) => {
                  props.setFieldValue("country", value);
                }}
                setVisible={setCountryPickerState}
              />
            ) : null}

            <TouchableOpacity
              style={{ width: "70%" }}
              onPress={() => {
                setCountryPickerState(true);
                setCountryInputTouched(true);
              }}
            >
              <TextInput
                mode={"outlined"}
                value={props.values.country}
                onChangeText={props.handleChange("country")}
                label="Country"
                outlineColor={
                  props.errors.country && countryInputTouched
                    ? "#b40424"
                    : "#5c5c5c"
                }
                style={{
                  width: "100%",
                  backgroundColor: "#1b1b1b",
                  marginTop:
                    props.errors.country && countryInputTouched ? 0 : 20,
                }}
                disabled={true}
                theme={{
                  colors: {
                    text: "#fff",
                    disabled:
                      props.errors.country && countryInputTouched
                        ? "#b40424"
                        : "#5c5c5c",
                    background: "transparent",
                  },
                }}
              />
            </TouchableOpacity>
            <ErrorMessage component="div" name="country">
              {(msg) => (
                <Text
                  style={{
                    width: "70%",
                    marginTop: 8,
                    marginBottom: 18,
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
            <View
              style={{
                width: "70%",
                flexDirection: "row-reverse",
                marginBottom: 40,
              }}
              onPress={props.submitForm}
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
                onPress={props.submitForm}
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
                    marginTop: 20,
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
