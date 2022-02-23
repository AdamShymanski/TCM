import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";

import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import { Snackbar, TextInput } from "react-native-paper";
import { addNewShippingMethod } from "../../../authContext";

const priceRegEx = /^\d+([.,]\d{1,2})?$/g;

const reviewSchema = yup.object({
  carrier: yup.string("Wrong format!").required("Carrier is required!"),
  name: yup.string("Wrong format!").required("Name is required!"),
  from: yup.string("Wrong format!").required("Required!"),
  to: yup.string("Wrong format!").required("Required!"),
  price: yup
    .string("Wrong format!")
    .matches(priceRegEx, "Wrong format!")
    .required("Price is required!")
    .max(5, "Price is too long!"),
});

export default function AddNewShippingMethod({ navigation }) {
  const [errorState, setError] = useState(false);
  const [modalState, setModal] = useState(false);
  const [trackingState, setTracking] = useState(true);
  const [rangeState, setRange] = useState("domestic");
  const [activityIndicator, setActivityIndicator] = useState(false);

  return (
    <ScrollView style={{ backgroundColor: "#1b1b1b", flex: 1 }}>
      {modalState ? (
        <Modal
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          transparent={true}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setModal(null);
            }}
          >
            <View
              style={{
                width: "87%",

                backgroundColor: "#121212",
                borderRadius: 8,
                paddingVertical: 18,
                paddingHorizontal: 18,
              }}
            >
              <Text
                style={{ color: "#f4f4f4", fontSize: 26, fontWeight: "700" }}
              >
                Parcel tracking
              </Text>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontSize: 12,
                  width: "90%",
                  marginTop: 8,
                }}
              >
                {
                  "Most carriers offer a package tracking option. This provides comfort to the buyer, they know where their goods are and at what stage of delivery. Does your new delivery method provide tracking?"
                }
              </Text>
              <Text
                style={{
                  color: "#5c5c5c",
                  fontSize: 12,
                  width: "90%",
                  marginTop: 8,
                }}
              >
                {
                  "If so, you will need to provide the buyer with a tracking code or link within 3 days after purchasing the cards."
                }
              </Text>
              <View style={{ flexDirection: "row-reverse", marginTop: 30 }}>
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: "#0082FF",
                    borderRadius: 3,
                  }}
                  onPress={() => {
                    setModal(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#121212",
                    }}
                  >
                    Got It
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      ) : null}

      <Formik
        initialValues={{
          carrier: "",
          name: "",
          from: "",
          to: "",
          price: "",
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values, { setStatus, setErrors }) => {
          setActivityIndicator(true);

          if (
            parseInt(values.from) <= 0 ||
            parseInt(values.to) <= 0 ||
            parseInt(values.from) >= parseInt(values.to)
          ) {
            setError("Wrong avg. delivery time!");
          } else {
            addNewShippingMethod(
              {
                carrier: values.carrier,
                name: values.name,
                from: parseInt(values.from),
                to: parseInt(values.to),
                price: parseFloat(values.price),
              },
              rangeState
            );
          }

          setActivityIndicator(false);
        }}
        style={{
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginTop: 20,
        }}
      >
        {(props) => (
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              marginLeft: "6%",
            }}
          >
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor:
                    rangeState === "domestic" ? "#0082ff" : "#5c5c5c",

                  backgroundColor:
                    rangeState === "domestic" ? "#0082ff" : "#1b1b1b",

                  paddingHorizontal: 12,
                  paddingVertical: 5,

                  borderRadius: 3,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                onPress={() => {
                  if (rangeState === "international") {
                    setRange("domestic");
                  } else {
                    setRange("international");
                  }
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: rangeState === "domestic" ? "#121212" : "#5c5c5c",
                    fontSize: 16,
                  }}
                >
                  Domestic
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderColor:
                    rangeState === "international" ? "#0082ff" : "#5c5c5c",
                  borderWidth: 1,

                  backgroundColor:
                    rangeState === "international" ? "#0082ff" : "#1b1b1b",

                  paddingVertical: 5,
                  paddingHorizontal: 12,

                  borderRadius: 3,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                onPress={() => {
                  if (rangeState === "international") {
                    setRange("domestic");
                  } else {
                    setRange("international");
                  }
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color:
                      rangeState === "international" ? "#121212" : "#5c5c5c",
                    fontSize: 16,
                  }}
                >
                  International
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#5C5C5C",
                  fontFamily: "Roboto_Medium",
                }}
              >
                WILL THE PARCEL BE TRACKED
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}>
                <IconMCI
                  size={18}
                  color={"#5c5c5c"}
                  name={"information-outline"}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: trackingState ? "#0082ff" : "#5c5c5c",

                  backgroundColor: trackingState ? "#0082ff" : "#1b1b1b",

                  paddingHorizontal: 12,
                  paddingVertical: 5,

                  borderRadius: 3,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                onPress={() => setTracking((prevState) => !prevState)}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: trackingState ? "#121212" : "#5c5c5c",
                    fontSize: 16,
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: !trackingState ? "#0082ff" : "#5c5c5c",
                  borderWidth: 1,

                  backgroundColor: !trackingState ? "#0082ff" : "#1b1b1b",

                  paddingVertical: 5,
                  paddingHorizontal: 12,

                  borderRadius: 3,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                onPress={() => setTracking((prevState) => !prevState)}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: !trackingState ? "#121212" : "#5c5c5c",
                    fontSize: 16,
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              mode={"outlined"}
              value={props.values.carrier}
              onChangeText={props.handleChange("carrier")}
              label="Carrier (e.g. USPS)"
              outlineColor={"#5c5c5c"}
              error={
                props.touched.carrier && props.errors.carrier ? true : false
              }
              style={{
                width: "70%",

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
            <ErrorMessage component="div" name="carrier">
              {(msg) => (
                <Text
                  style={{
                    width: "70%",
                    marginTop: 8,

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
              value={props.values.name}
              onChangeText={props.handleChange("name")}
              label="Name (e.g. Standard)"
              outlineColor={"#5c5c5c"}
              error={props.touched.name && props.errors.name ? true : false}
              style={{
                width: "70%",

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
            <ErrorMessage component="div" name="name">
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

            <Text
              style={{
                color: "#5C5C5C",
                marginTop: 24,
                marginBottom: 10,
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              AVERAGE DELIVERY TIME
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",

                width: "50%",
              }}
            >
              <View style={{ width: "38%" }}>
                <TextInput
                  mode={"outlined"}
                  value={props.values.from}
                  onChangeText={props.handleChange("from")}
                  label="From"
                  keyboardType="numeric"
                  outlineColor={"#5c5c5c"}
                  error={props.touched.from && props.errors.from ? true : false}
                  style={{
                    width: "100%",

                    backgroundColor: "#1b1b1b",
                    color: "#f4f4f4",
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

                <ErrorMessage component="div" name="from">
                  {(msg) => (
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
                  )}
                </ErrorMessage>
              </View>
              <View
                style={{
                  height: "100%",
                  width: "20%",
                  position: "relative",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "60%",
                    height: 4,
                    marginHorizontal: "5%",

                    borderRadius: 6,
                    backgroundColor: "#0082ff",

                    top: 32,
                    position: "absolute",
                  }}
                />
              </View>

              <View style={{ width: "38%" }}>
                <TextInput
                  mode={"outlined"}
                  value={props.values.to}
                  keyboardType="numeric"
                  onChangeText={props.handleChange("to")}
                  label="To"
                  outlineColor={"#5c5c5c"}
                  error={props.touched.to && props.errors.to ? true : false}
                  style={{
                    width: "100%",

                    backgroundColor: "#1b1b1b",
                    color: "#f4f4f4",
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

                <ErrorMessage component="div" name="to">
                  {(msg) => (
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
                  )}
                </ErrorMessage>
              </View>
              <View
                style={{ height: "100%", position: "relative", width: "100%" }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "#f4f4f4",

                    marginLeft: "8%",
                    // marginTop: 8,

                    position: "absolute",
                    top: 23,
                  }}
                >
                  Days
                </Text>
              </View>
            </View>
            <TextInput
              mode={"outlined"}
              value={props.values.price}
              onChangeText={props.handleChange("price")}
              label="Price ($)"
              keyboardType="numeric"
              outlineColor={"#5c5c5c"}
              error={props.touched.price && props.errors.price ? true : false}
              style={{
                width: "70%",

                backgroundColor: "#1b1b1b",
                color: "#f4f4f4",
                marginTop: 20,
                position: "relative",
              }}
              theme={{
                colors: {
                  primary: "#0082ff",
                  placeholder: "#5c5c5c",
                  background: "transparent",
                  text: "#f4f4f4",
                },
              }}
            ></TextInput>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontWeight: "600",
                marginTop: 6,
              }}
            >
              Example: 5.30 or 4.50 USD
            </Text>
            <ErrorMessage component="div" name="price">
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

            <Text
              style={{
                fontSize: 12,
                color: "#5C5C5C",
                fontFamily: "Roboto_Medium",
                marginBottom: 8,
                marginTop: 24,
              }}
            >
              RESULT
            </Text>
            <View
              style={{
                width: "70%",

                marginTop: 6,

                paddingHorizontal: 12,
                paddingVertical: 8,

                borderRadius: 3,
                backgroundColor: "#121212",

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#f4f4f4",
                  fontWeight: "700",
                }}
              >
                {props.values.carrier ? props.values.carrier : "USPS"}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#939393",
                }}
              >
                {props.values.name ? props.values.name : "Standard"}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#f4f4f4",
                }}
              >
                {`${props.values.from ? ` ${props.values.from}` : " 0"}`} -
                {`${props.values.to ? ` ${props.values.to}` : " 0"}`} days
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#f4f4f4",
                  fontWeight: "700",
                }}
              >
                {props.values.price ? props.values.price : "0"} USD
              </Text>
            </View>
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
              {activityIndicator ? (
                <ActivityIndicator
                  size={30}
                  color="#0082ff"
                  animating={activityIndicator}
                  style={{
                    marginRight: 14,
                    marginTop: 20,
                  }}
                />
              ) : null}
              {!activityIndicator ? (
                <Text
                  style={{
                    color: "#b40424",
                    fontWeight: "700",
                    marginTop: 20,
                    marginRight: 14,
                  }}
                >
                  {errorState}
                </Text>
              ) : null}
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
