import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  Image,
} from "react-native";

import IconMI from "react-native-vector-icons/MaterialIcons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";
import { TextInput, RadioButton } from "react-native-paper";
import { editShippingMethod, deleteShippingMethod } from "../../../authContext";

import { useNavigation, useRoute } from "@react-navigation/native";

const priceRegEx = /^\d+([.,]\d{1,2})?$/g;

const reviewSchema = yup.object({
  carrier: yup.string("Wrong format!").required("Carrier is required!"),
  name: yup.string("Wrong format!").required("Name is required!"),
  from: yup
    .string("Wrong format!")
    .required("Required!")
    .matches(/^\d+$/g, "^^^^^^^^^^"),
  to: yup
    .string("Wrong format!")
    .required("Required!")
    .matches(/^\d+$/g, "^^^^^^^^^^"),
  price: yup
    .string("Wrong format!")
    .matches(priceRegEx, "Wrong format!")
    .required("Price is required!")
    .max(5, "Price is too long!"),
});

export default function EditShippingMethod() {
  const navigation = useNavigation();
  const route = useRoute();

  const { shippingRange, shippingMethod, userCountry } = route.params;

  const [errorState, setError] = useState(false);
  const [modalState, setModal] = useState(false);
  const [rangeState, setRange] = useState(shippingRange);
  const [trackingState, setTracking] = useState(shippingMethod.tracking);
  const [activityIndicator, setActivityIndicator] = useState(false);

  const [countryPickerState, setCountryPickerState] = useState(false);
  const [destinationCountry, setDestinationCountry] = useState({});

  const countryCodes = [
    { Code: "AU", Name: "Australia" },
    { Code: "AT", Name: "Austria" },
    { Code: "BE", Name: "Belgium" },
    { Code: "BR", Name: "Brazil" },
    { Code: "CA", Name: "Canada" },
    { Code: "CY", Name: "Cyprus" },
    { Code: "CZ", Name: "Czech Republic" },
    { Code: "DK", Name: "Denmark" },
    { Code: "FI", Name: "Finland" },
    { Code: "FR", Name: "France" },
    { Code: "DE", Name: "Germany" },
    { Code: "GR", Name: "Greece" },
    { Code: "HU", Name: "Hungary" },
    { Code: "IS", Name: "Iceland" },
    { Code: "IE", Name: "Ireland" },
    { Code: "IT", Name: "Italy" },
    { Code: "JP", Name: "Japan" },
    { Code: "KR", Name: "South Korea" },
    { Code: "LU", Name: "Luxembourg" },
    { Code: "MX", Name: "Mexico" },
    { Code: "NZ", Name: "New Zealand" },
    { Code: "NO", Name: "Norway" },
    { Code: "PH", Name: "Philippines" },
    { Code: "PL", Name: "Poland" },
    { Code: "PT", Name: "Portugal" },
    { Code: "SK", Name: "Slovakia" },
    { Code: "SI", Name: "Slovenia" },
    { Code: "ES", Name: "Spain" },
    { Code: "SE", Name: "Sweden" },
    { Code: "CH", Name: "Switzerland" },
    { Code: "TR", Name: "Turkey" },
    { Code: "UA", Name: "Ukraine" },
    { Code: "GB", Name: "United Kingdom" },
    { Code: "US", Name: "United States" },
  ];

  useEffect(() => {
    shippingMethod.destinationCountry.forEach((country) => {
      setDestinationCountry((prevState) => {
        return { ...prevState, [country]: true };
      });
    });
  }, []);

  const renderCountryListElement = (item) => {
    if (item.Name === userCountry) return null;
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 12,
          paddingHorizontal: 18,
        }}
      >
        <RadioButton
          value={item}
          status={destinationCountry[item.Name] ? "checked" : "unchecked"}
          onPress={() => {
            if (destinationCountry[item.Name]) {
              setDestinationCountry((prevState) => {
                delete prevState[[item.Name]];
                return { ...prevState };
              });
            } else {
              setDestinationCountry({
                ...destinationCountry,
                [item.Name]: true,
              });
            }
          }}
          uncheckedColor="#f4f4f4"
          color="#0082ff"
        />
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 28, height: 21, marginRight: 14 }}
            source={{
              uri: `https://flagcdn.com/160x120/${item.Code.toLowerCase()}.png`,
            }}
          />
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 16,
              textAlign: "right",
            }}
          >
            {item.Name}
          </Text>
        </View>
      </View>
    );
  };
  const renderDestinationCountryList = (arr) => {
    let filtersString = "";

    if (arr.length === 0 || !arr)
      return (
        <Text
          style={{
            fontSize: 15,
            color: "#565656",
            marginLeft: 12,
          }}
        >
          --- NONE SELECTED ---
        </Text>
      );

    if (arr.length > 1) {
      arr.forEach((element, index) => {
        if (element[1]) {
          if (index + 1 === arr.length) {
            filtersString += element[0];
          } else {
            filtersString += element[0] + ", ";
          }
        }
      });
    } else {
      filtersString += arr[0][0];
    }

    return (
      <Text
        style={{
          color: "#565656",
          fontSize: 16,
          textAlign: "left",
          marginLeft: 12,
        }}
      >
        {filtersString}
      </Text>
    );
  };

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
                  "If so, you will need to provide the buyer with a tracking code or link within 7 days after purchasing the cards."
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

      {countryPickerState ? (
        <Modal
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          transparent={true}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                height: "80%",
                backgroundColor: "#121212",
                borderRadius: 8,
                paddingVertical: 10,
              }}
            >
              <FlatList
                data={countryCodes}
                keyExtractor={(item, index) => index.toString()}
                style={{ paddingRight: 10 }}
                renderItem={({ item }) => {
                  return renderCountryListElement(item);
                }}
              />

              <View
                style={{
                  flexDirection: "row-reverse",
                  marginTop: 18,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 84,
                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: "#0082FF",
                    borderRadius: 3,
                    marginRight: 12,
                  }}
                  onPress={async () => {
                    setCountryPickerState(false);
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
                <TouchableOpacity
                  style={{
                    width: 76,
                    height: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: "transparent",
                    borderRadius: 3,
                    borderColor: "#5c5c5c",
                    borderWidth: 2,

                    marginRight: 22,
                  }}
                  onPress={async () => {
                    setCountryPickerState(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#5c5c5c",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      <Formik
        initialValues={{
          carrier: shippingMethod.carrier,
          name: shippingMethod.name,
          from: shippingMethod.from.toString(),
          to: shippingMethod.to.toString(),
          price: shippingMethod.price.toFixed(2).toString(),
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values) => {
          setActivityIndicator(true);

          let countriesArr = [];

          for (var key of Object.keys(destinationCountry)) {
            countriesArr.push(key);
          }

          const detectChanges = () => {
            if (
              shippingMethod.from.toString() != values.from ||
              shippingMethod.to.toString() != values.to ||
              shippingMethod.price.toString() != values.price ||
              shippingMethod.carrier != values.carrier ||
              shippingMethod.name != values.name ||
              shippingMethod.tracking != trackingState ||
              shippingMethod.destinationCountry != countriesArr
            ) {
              return true;
            }
            return false;
          };

          if (detectChanges()) {
            if (
              parseInt(values.from) <= 0 ||
              parseInt(values.to) <= 0 ||
              parseInt(values.from) >= parseInt(values.to)
            ) {
              setError("Wrong avg. delivery time!");
            } else {
              await editShippingMethod(shippingMethod, {
                carrier: values.carrier,
                name: values.name,
                from: parseInt(values.from),
                to: parseInt(values.to),
                price: parseFloat(values.price),
                tracking: trackingState,
                destinationCountries: countriesArr,
              });
              navigation.reset({
                index: 0,
                routes: [{ name: "SellerProfile" }],
              });
            }
          } else {
            setError("No changes detected!");
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
            <TouchableOpacity
              style={{
                height: 30,
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#D80000",
                borderRadius: 3,
                width: "70%",
              }}
              onPress={async () => {
                await deleteShippingMethod(shippingMethod);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "SellerProfile" }],
                });
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                Delete Method
              </Text>
            </TouchableOpacity>
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
              autoCapitalize="none"
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
                color: "#f4f4f4",
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
                  autoCapitalize="none"
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
                  autoCapitalize="none"
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
                    fontSize: 13,
                    color: "#5C5C5C",

                    marginLeft: "8%",
                    // marginTop: 8,
                    bottom: 0,
                    fontFamily: "Roboto_Medium",
                    position: "absolute",
                  }}
                >
                  DAYS
                </Text>
              </View>
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
                  // color: "#5C5C5C",
                  color: "#f4f4f4",
                  fontFamily: "Roboto_Medium",
                }}
              >
                PARCEL TRACKING
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}>
                <IconMCI
                  size={18}
                  color={"#f4f4f4"}
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

            {shippingRange === "international" ? (
              <View style={{ width: "90%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 28,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#f4f4f4",
                      marginBottom: 10,
                      fontSize: 12,
                      fontFamily: "Roboto_Medium",
                    }}
                  >
                    DESTINATION COUNTRY
                  </Text>

                  <TouchableOpacity
                    style={{
                      height: 26,

                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",

                      backgroundColor: "#0082FF",
                      borderRadius: 3,
                      paddingHorizontal: 14,

                      alignSelf: "baseline",
                      marginLeft: 10,
                    }}
                    onPress={() => {
                      setCountryPickerState(true);
                    }}
                  >
                    <IconMCI
                      name={"playlist-edit"}
                      color={"#121212"}
                      size={14}
                    />

                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#121212",
                        marginLeft: 6,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>

                {renderDestinationCountryList(
                  Object.keys(destinationCountry).map((key) => [
                    key,
                    destinationCountry[key],
                  ])
                )}
              </View>
            ) : null}

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
                marginTop: 6,

                paddingHorizontal: 18,
                paddingVertical: 16,

                borderRadius: 3,
                backgroundColor: "#121212",

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                alignSelf: "flex-start",
              }}
            >
              {trackingState ? (
                <IconMCI
                  name={"radar"}
                  size={16}
                  color={"#24FF00"}
                  style={{ marginRight: 10 }}
                />
              ) : null}
              <Text
                style={{
                  fontSize: 14,
                  color: "#f4f4f4",
                  fontWeight: "700",
                  marginRight: 10,
                }}
              >
                {props.values.carrier ? props.values.carrier : "USPS"}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#939393",
                  marginRight: 10,
                }}
              >
                {props.values.name ? props.values.name : "Standard"}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#f4f4f4",
                  marginRight: 10,
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
                {props.values.price
                  ? parseFloat(
                      props.values.price.replace(/,/g, ".").replace(/ /g, "")
                    ).toFixed(2)
                  : "0.00"}{" "}
                USD
              </Text>
            </View>
            <View
              style={{
                width: "90%",
                flexDirection: "row-reverse",
                marginBottom: 40,
                alignItems: "center",
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
                disabled={activityIndicator}
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
                  style={{
                    marginRight: 14,
                    marginTop: 20,
                  }}
                />
              ) : (
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
              )}
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
