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

import { db, auth, functions, firebaseObj } from "../authContext";
import { CountryPickerModal } from "../shared/Modals/CountryPickerModal";

const firstCapitalLetter = /^[A-Z].*/;
const reviewSchema = yup.object({
  country: yup
    .string("Wrong format!")
    .required("Country is required!")
    .matches(firstCapitalLetter, "Wrong country name!"),
  referralCode: yup
    .string("Wrong format!")
    .max(28, "Wrong Code!")
    .min(28, "Wrong Code!"),
});

export default function FinishGoogleRegister({ setFinishRegisterProcess }) {
  const [error, setError] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [countryPickerState, setCountryPickerState] = useState("");

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
          referralCode: "",
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values, actions) => {
          setLoadingIndicator(true);

          await db
            .collection("users")
            .doc(auth.currentUser.uid)
            .set({
              nick: auth.currentUser.displayName,
              country: values.country.trim(),
              discounts: {
                referralProgram: [],
                compensation: [],
              },
              addresses: [],
              sellerProfile: {
                status: "unset",
                rating: [],
                shippingMethods: {
                  domestic: [],
                  international: [],
                },
                statistics: {
                  purchases: 0,
                  sales: 0,
                  views: 0,
                  numberOfOffers: 0,
                },
              },
              cart: [],
              stripe: {
                vendorId: null,
                merchantId: null,
              },
              notificationToken: null,
              savedOffers: [],
              createdAt: firebaseObj.firestore.FieldValue.serverTimestamp(),
            });

          const mailQuery = functions.httpsCallable("sendMail");

          await mailQuery({
            to: auth.currentUser.uid,
            subject: "Welcome",
            from: {
              email: "contact@tcmarket.place",
              name: "TCM",
            },
            templateId: "d-e4314d0e1ff44a708d65f68374e62d83",
            dynamicTemplateData: {
              name: auth.currentUser.displayName,
            },
          });

          setLoadingIndicator(false);
          setFinishRegisterProcess(false);

          // if (values.referralCode !== "") {
          //   const functionCall = functions.httpsCallable("useReferralCode");

          //   functionCall({ code: values.referralCode.trim() })
          //     .then(() => {
          //       callback(false);
          //     })
          //     .catch((error) => {
          //       setError("Wrong Referral Code!");
          //     });
          // } else {
          //   callback(false);
          // }
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
              }}
            >
              <TextInput
                mode={"outlined"}
                value={props.values.country}
                onChangeText={props.handleChange("country")}
                label="Country"
                outlineColor={props.errors.country ? "#b40424" : "#5c5c5c"}
                style={{
                  width: "100%",
                  backgroundColor: "#1b1b1b",
                  marginTop: 10,
                }}
                disabled={true}
                theme={{
                  colors: {
                    text: "#fff",
                    disabled: props.errors.country ? "#b40424" : "#5c5c5c",
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
                    marginBottom: 3,
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
              style={{ width: "70%", alignItems: "flex-start", marginTop: 28 }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#5c5c5c",
                  fontFamily: "Roboto_Medium",
                }}
              >
                SOMEONE REFERRED YOU TO US ?
              </Text>
            </View>

            <TextInput
              autoCapitalize="none"
              mode={"outlined"}
              value={props.values.referralCode}
              onChangeText={props.handleChange("referralCode")}
              label="Referral Code (optional)"
              outlineColor={"#5c5c5c"}
              error={
                props.touched.referralCode && props.errors.referralCode
                  ? true
                  : false
              }
              style={{
                width: "70%",
                backgroundColor: "#1B1B1B",
                color: "#f4f4f4",
                marginTop: 8,
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
            <ErrorMessage component="div" name="referralCode">
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
                alignItems: "center",
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
                disabled={loadingIndicator}
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
              {!loadingIndicator ? (
                <Text
                  style={{
                    color: "#b40424",
                    fontWeight: "700",
                    marginTop: 20,
                    marginRight: 14,
                  }}
                >
                  {error}
                </Text>
              ) : null}
            </View>
            {/* <View
              style={{
                width: "70%",
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
            </View> */}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
