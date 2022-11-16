import React, { useState, useEffect } from "react";

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";

import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

import { db, auth, firebaseObj, fetchUserData } from "../../../authContext";

import { useNavigation } from "@react-navigation/native";

export default function Checkout_AddAddress() {
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [countryState, setCountry] = useState("Loading...");

  const [error, setError] = useState("");

  const reviewSchema = yup.object({
    firstName: yup.string("Wrong format!").required("Required!").max(30),
    lastName: yup.string("Wrong format!").required("Required!").max(30),
    zipCode: yup.string("Wrong format!").required("Required!").max(30),
    country: yup.string("Wrong format!").required("Required!").max(30),
    state: yup.string("Wrong format!").required("Required!").max(30),
    city: yup.string("Wrong format!").required("Required!").max(30),
    streetAddress1: yup.string("Wrong format!").required("Required!").max(30),
    streetAddress2: yup.string("Required!").max(30),
    phoneNumber: yup
      .string("Wrong format!")
      .required("Required!")
      .max(13, "At most 13 digits!"),
  });

  const navigation = useNavigation();

  useEffect(() => {
    const resolvePromises = async () => {
      const result = await fetchUserData();
      setCountry(result.country);
    };
    resolvePromises();
  }, []);
  
  return (
    <ScrollView style={{ backgroundColor: "#1b1b1b", flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text
          style={{
            fontSize: 36,
            color: "#f4f4f4",
            fontWeight: "700",
            textAlign: "center",

            marginTop: 40,
            marginBottom: 18,
          }}
        >
          Add Shipping Address
        </Text>
        <Text
          style={{
            fontWeight: "600",
            color: "#939393",
            fontSize: 12,
            textAlign: "center",
            width: 280,
            marginBottom: 30,
          }}
        >
          {
            "You have to provide an address where the seller will ship the parcel."
          }
        </Text>
      </View>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          zipCode: "",
          country: countryState,
          state: "",
          city: "",
          streetAddress1: "",
          streetAddress2: "",
          phoneNumber: "",
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values, actions) => {
          try {
            const preventAddressesDuplication = () => {
              const promise = new Promise((resolve, reject) => {
                db.collection("users")
                  .doc(auth.currentUser.uid)
                  .get()
                  .then((doc) => {
                    if (doc.data().addresses.length > 0) {
                      doc.data().addresses.forEach((address, index) => {
                        if (
                          JSON.stringify(address) === JSON.stringify(values)
                        ) {
                          reject("Address already exists!");
                        }
                        if (index === doc.data().addresses.length - 1) {
                          resolve();
                        }
                      });
                    } else {
                      resolve();
                    }
                  });
              });

              return promise;
            };
            preventAddressesDuplication()
              .then(async () => {
                values.country = countryState;
                await db
                  .collection("users")
                  .doc(auth.currentUser.uid)
                  .update({
                    addresses:
                      firebaseObj.firestore.FieldValue.arrayUnion(values),
                  });

                setLoadingIndicator(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Checkout" }],
                });
              })
              .catch((e) => {
                setError(e);
                setLoadingIndicator(false);
              });
          } catch (e) {
            console.log(e);
          }
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
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "40%" }}>
                <TextInput
                  mode={"outlined"}
                  value={props.values.firstName}
                  onChangeText={props.handleChange("firstName")}
                  label="First Name"
                  outlineColor={"#5c5c5c"}
                  error={
                    props.touched.firstName && props.errors.firstName
                      ? true
                      : false
                  }
                  style={{
                    width: "100%",
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
                <ErrorMessage component="div" name="firstName">
                  {(msg) => {
                    if (msg != "Required!") {
                      return (
                        <Text
                          style={{
                            width: "100%",
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
                      );
                    } else return null;
                  }}
                </ErrorMessage>
              </View>
              <View style={{ width: "55%" }}>
                <TextInput
                  mode={"outlined"}
                  value={props.values.lastName}
                  onChangeText={props.handleChange("lastName")}
                  label="Last Name"
                  outlineColor={"#5c5c5c"}
                  error={
                    props.touched.lastName && props.errors.lastName
                      ? true
                      : false
                  }
                  style={{
                    width: "100%",
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
                <ErrorMessage component="div" name="lastName">
                  {(msg) => {
                    if (msg != "Required!") {
                      return (
                        <Text
                          style={{
                            width: "100%",
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
                      );
                    } else return null;
                  }}
                </ErrorMessage>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "45%" }}>
                <TextInput
                  autoCapitalize="none"
                  mode={"outlined"}
                  value={props.values.zipCode}
                  onChangeText={props.handleChange("zipCode")}
                  label="ZIP/Postal Code"
                  outlineColor={"#5c5c5c"}
                  keyboardType="numeric"
                  error={
                    props.touched.zipCode && props.errors.zipCode ? true : false
                  }
                  style={{
                    width: "100%",
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
                <ErrorMessage component="div" name="zipCode">
                  {(msg) => {
                    if (msg != "Required!") {
                      return (
                        <Text
                          style={{
                            width: "100%",
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
                      );
                    } else return null;
                  }}
                </ErrorMessage>
              </View>
              <View style={{ width: "50%" }}>
                <TouchableOpacity style={{ width: "100%" }} disabled={true}>
                  <TextInput
                    mode={"outlined"}
                    value={countryState}
                    onChangeText={props.handleChange("country")}
                    label="Country"
                    outlineColor={props.errors.country ? "#b40424" : "#5c5c5c"}
                    style={{
                      width: "100%",
                      marginTop: 20,
                      backgroundColor: "#1b1b1b",
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
                  {(msg) => {
                    if (msg != "Required!") {
                      return (
                        <Text
                          style={{
                            width: "100%",
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
                      );
                    } else return null;
                  }}
                </ErrorMessage>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "40%" }}>
                <TextInput
                  mode={"outlined"}
                  value={props.values.city}
                  onChangeText={props.handleChange("city")}
                  label="City"
                  outlineColor={"#5c5c5c"}
                  error={props.touched.city && props.errors.city ? true : false}
                  style={{
                    width: "100%",
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
                <ErrorMessage component="div" name="city">
                  {(msg) => {
                    if (msg != "Required!") {
                      return (
                        <Text
                          style={{
                            width: "100%",
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
                      );
                    } else return null;
                  }}
                </ErrorMessage>
              </View>
              <View style={{ width: "55%" }}>
                <TextInput
                  mode={"outlined"}
                  value={props.values.state}
                  onChangeText={props.handleChange("state")}
                  label="State/Region"
                  outlineColor={"#5c5c5c"}
                  error={
                    props.touched.state && props.errors.state ? true : false
                  }
                  style={{
                    width: "100%",
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
                <ErrorMessage component="div" name="state">
                  {(msg) => {
                    if (msg != "Required!") {
                      return (
                        <Text
                          style={{
                            width: "100%",
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
                      );
                    } else return null;
                  }}
                </ErrorMessage>
              </View>
            </View>

            <TextInput
              mode={"outlined"}
              value={props.values.streetAddress1}
              onChangeText={props.handleChange("streetAddress1")}
              label="Street Address nr.1"
              outlineColor={"#5c5c5c"}
              error={
                props.touched.streetAddress1 && props.errors.streetAddress1
                  ? true
                  : false
              }
              style={{
                width: "90%",
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
            <ErrorMessage component="div" name="streetAddress1">
              {(msg) => {
                if (msg != "Required!") {
                  return (
                    <Text
                      style={{
                        width: "100%",
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
                  );
                } else return null;
              }}
            </ErrorMessage>
            <TextInput
              mode={"outlined"}
              value={props.values.streetAddress2}
              onChangeText={props.handleChange("streetAddress2")}
              label="Street Address nr.2 (optional)"
              outlineColor={"#5c5c5c"}
              error={
                props.touched.streetAddress2 && props.errors.streetAddress2
                  ? true
                  : false
              }
              style={{
                width: "90%",
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
            <ErrorMessage component="div" name="streetAddress2">
              {(msg) => {
                if (msg != "Required!") {
                  return (
                    <Text
                      style={{
                        width: "100%",
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
                  );
                } else return null;
              }}
            </ErrorMessage>

            <TextInput
              mode={"outlined"}
              autoCapitalize="none"
              label="Phone Number"
              outlineColor={"#5c5c5c"}
              keyboardType="numeric"
              value={props.values.phoneNumber}
              onChangeText={props.handleChange("phoneNumber")}
              error={
                props.touched.phoneNumber && props.errors.phoneNumber
                  ? true
                  : false
              }
              style={{
                width: "90%",
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
            <ErrorMessage component="div" name="phoneNumber">
              {(msg) => {
                if (msg != "Required!") {
                  return (
                    <Text
                      style={{
                        width: "90%",
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
                  );
                } else return null;
              }}
            </ErrorMessage>

            <View
              style={{
                width: "90%",
                flexDirection: "row-reverse",
                alignItems: "center",
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
                onPress={async () => {
                  setLoadingIndicator(true);
                  props.handleSubmit();
                }}
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
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
