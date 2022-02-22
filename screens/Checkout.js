import React, { useState, useEffect } from "react";

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SectionList,
} from "react-native";

import { useStripe } from "@stripe/stripe-react-native";
import { useNavigation } from "@react-navigation/native";

import { functions, auth, fetchName, fetchCart } from "../authContext";

import { ActivityIndicator, TextInput } from "react-native-paper";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

import SummaryObject from "./../shared/Objects/SummaryObject";
import { CountryPickerModal } from "../shared/Modals/CountryPickerModal";

import DHL_logo from "../assets/DHL_logo.png";
import FedExExpress_logo from "../assets/FedEx_Express_logo.png";
import FedEx_logo from "../assets/FedEx_logo.png";
import UPS_logo from "../assets/UPS_logo.png";
import USPS_logo from "../assets/USPS_logo.png";
import Stripe_logo from "../assets/Stripe_logo.png";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

export default function Checkout({ pageState, setPage }) {
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "Adam",
    lastName: "Szymański",
    zipCode: "92-446",
    country: "Poland",
    state: "Łódzkie",
    city: "Łódź",
    streetAddress1: "Wacława Wojewódzkiego 1 m2",
    streetAddress2: "",
    phoneNumber: "+48 606417902",
  });

  const [offersState, setOffersState] = useState([]);
  const [shippingServiceProvider, setShippingServiceProvider] =
    useState("USPS");

  if (pageState === "shippingAddressPage") {
    return (
      <ShippingAddressPage
        setPage={setPage}
        setShippingAddress={setShippingAddress}
      />
    );
  } else if (pageState === "summaryPage") {
    return (
      <SummaryPage
        setPage={setPage}
        shippingAddress={shippingAddress}
        shippingServiceProvider={shippingServiceProvider}
        offersState={offersState}
      />
    );
  } else if (pageState === "endPage") {
    return <EndPage />;
  } else {
    return (
      <LoadingPage
        setPage={setPage}
        setOffersState={setOffersState}
        setShippingServiceProvider={setShippingServiceProvider}
      />
    );
  }
}

const ShippingAddressPage = ({ setPage, setShippingAddress }) => {
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [countryPickerState, setCountryPickerState] = useState("");
  const [countryInputTouched, setCountryInputTouched] = useState(false);

  const [error, setError] = useState("");

  const phoneNumberRegEx =
    /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

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
      .matches(
        phoneNumberRegEx,
        "At least one number, capital & lower letter!"
      ),
  });

  return (
    <ScrollView style={{ backgroundColor: "#1b1b1b", flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text
          style={{
            fontWeight: "700",
            color: "#f4f4f4",
            fontSize: 40,
            marginTop: 40,

            marginBottom: 18,
          }}
        >
          Shipping Address
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
            "You have to provide an address where the seller will ship the parcel."
          }
        </Text>
      </View>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          zipCode: "",
          country: "",
          state: "",
          city: "",
          streetAddress1: "",
          streetAddress2: "",
          phoneNumber: "",
        }}
        // validationSchema={reviewSchema}
        onSubmit={async (values, actions) => {
          setShippingAddress({
            firstName: "Adam",
            lastName: "Szymański",
            zipCode: "92-446",
            country: "Poland",
            state: "Łódzkie",
            city: "Łódź",
            streetAddress1: "Wacława Wojewódzkiego 1 m2",
            streetAddress2: "",
            phoneNumber: "+48 606417902",
          });
          setPage("loadingPage");
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
                  mode={"outlined"}
                  value={props.values.zipCode}
                  onChangeText={props.handleChange("zipCode")}
                  label="ZIP/Postal Code"
                  outlineColor={"#5c5c5c"}
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
                <TouchableOpacity
                  style={{ width: "100%" }}
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
                    outlineColor={props.errors.country ? "#b40424" : "#5c5c5c"}
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
              value={props.values.phoneNumber}
              onChangeText={props.handleChange("phoneNumber")}
              label="Phone Number"
              outlineColor={"#5c5c5c"}
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
                  setPage("loadingPage");
                  // props.handleSubmit();
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
};

const SummaryPage = ({
  setPage,
  shippingAddress,
  shippingServiceProvider,
  offersState,
}) => {
  return (
    <View style={{ backgroundColor: "#1b1b1b", flex: 1 }}>
      <SectionList
        style={{ width: "100%" }}
        sections={offersState}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <SummaryObject props={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <Text
              style={{
                color: "#f4f4f4",
                fontSize: 12,
                marginTop: 10,
                marginLeft: 18,
              }}
            >
              from{"  "}
              <Text
                style={{
                  color: "#f4f4f4",
                  fontSize: 17,
                  fontFamily: "Roboto_Medium",
                }}
              >
                {title}
              </Text>
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ paddingVertical: 18 }}>
            <ActivityIndicator size={"small"} color={"#0082ff"} />
          </View>
        }
        ListHeaderComponent={getHeader}
        ListFooterComponent={getFooter(
          setPage,
          shippingServiceProvider,
          shippingAddress,
          offersState
        )}
      />
    </View>
  );
};
const LoadingPage = ({
  setPage,
  setOffersState,
  setShippingServiceProvider,
}) => {
  useEffect(() => {
    const resolvePromise = async () => {
      await fetchCart(setOffersState, () => {});
      //check each vendor for shipping service provider
      setPage("summaryPage");
    };
    resolvePromise();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1b1b",
      }}
    >
      <ActivityIndicator size={"large"} color="#0082ff" />
    </View>
  );
};
const EndPage = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1b1b",
        paddingBottom: 20,
      }}
    >
      <IconMCI name={"flag-checkered"} color={"#0082ff"} size={220} />
      <Text
        style={{
          color: "#f4f4f4",
          fontWeight: "700",
          fontSize: 38,
          marginTop: 10,
        }}
      >
        Congratulations!
      </Text>
      <Text
        style={{
          color: "#5c5c5c",
          textAlign: "center",
          fontSize: 14,
          marginTop: 10,
          width: "90%",
        }}
      >
        The order has been successfully placed. The vendor has 48 hours to ship
        your cards. You can track your shipment in the Transactions Tab.
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
          marginTop: 80,
          marginBottom: 6,
          borderRadius: 4,
        }}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Transactions" }],
          });
        }}
      >
        <Text
          style={{
            color: "#121212",
            fontWeight: "700",
            fontSize: 17,
            marginRight: 8,
          }}
        >
          {"Go to Transactions"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getHeader = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text
          style={{
            fontWeight: "700",
            color: "#f4f4f4",
            fontSize: 40,
            marginTop: 20,

            marginBottom: 10,
          }}
        >
          Summary
        </Text>
        <Text
          style={{
            fontWeight: "600",
            color: "#939393",
            fontSize: 12,
            textAlign: "center",
            width: "80%",
            marginBottom: 20,
          }}
        >
          {"Take one last look at what you will pay for."}
        </Text>
      </View>
      <Text
        style={{
          color: "#565656",
          fontFamily: "Roboto_Medium",
          fontSize: 12,
          marginLeft: 12,
          marginBottom: 2,
          marginTop: 12,
        }}
      >
        REVIEW CARDS
      </Text>
    </View>
  );
};
const getFooter = (
  setPage,
  shippingServiceProvider,
  shippingAddress,
  offersState
) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [totals, setTotals] = useState({
    cards: 0,
    shipping: 18.23,
    final: 0,
  });

  useEffect(() => {
    const resolvePromise = async () => {
      functions.useEmulator("192.168.0.104", 5001);
      const query = functions.httpsCallable("paymentSheet");

      query()
        .then((result) => {
          initializePaymentSheet(result.data);
        })
        .catch((err) => console.log(err));
    };

    resolvePromise();
  }, []);

  useEffect(() => {
    if (offersState) {
      offersState.forEach((object) => {
        object.data.forEach((offer) => {
          setTotals((prevState) => ({
            ...prevState,
            cards: prevState.cards * offer.price,
            final: prevState.cards + prevState.shipping,
          }));
        });
      });
    }
  }, [offersState]);

  const initializePaymentSheet = async (data) => {
    const { paymentIntent, ephemeralKey, customer } = data;

    let merchantName = auth.currentUser.displayName;

    if (merchantName == null) {
      merchantName = await fetchName();
    }

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      googlePay: true,
      merchantDisplayName: merchantName,
    });
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      console.log("Success", "Your order is confirmed!");
      setPage("endPage");
      navigation.addListener("beforeRemove", (e) => {
        if (pageState === "endPage") {
          e.preventDefault();
        } else {
          return;
        }
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: 18,
        }}
      >
        <Text
          style={{
            color: "#f4f4f4",
            fontFamily: "Roboto_Medium",
            fontSize: 12,
          }}
        >
          Total Cards Cost{"  "}
          <Text
            style={{
              fontSize: 14,
              color: "#0082ff",
              fontWeight: "700",
              fontFamily: "Roboto_Regular",
            }}
          >
            {`${totals.cards} USD`}
          </Text>
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 12,
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginTop: 34,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            height: "100%",
          }}
        >
          <Text
            style={{
              color: "#565656",
              fontFamily: "Roboto_Medium",
              fontSize: 12,

              marginBottom: 8,
            }}
          >
            SHIPPING ADDRESS
          </Text>
          <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
            {`${shippingAddress.firstName} ${shippingAddress.lastName}`}
          </Text>
          <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
            {shippingAddress.streetAddress1}
          </Text>
          {shippingAddress.streetAddress2 ? (
            <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
              {shippingAddress.streetAddress2}
            </Text>
          ) : null}
          <Text
            style={{ color: "#f4f4f4", marginLeft: 6 }}
          >{`${shippingAddress.city}, ${shippingAddress.zipCode}`}</Text>
          <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
            {shippingAddress.country}
          </Text>
          <Text style={{ color: "#f4f4f4", marginLeft: 6, marginTop: 8 }}>
            {shippingAddress.phoneNumber}
          </Text>
        </View>
        <View
          style={{
            flex: 1.3,
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Text
            style={{
              color: "#565656",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
              marginLeft: 12,
              marginBottom: 8,
            }}
          >
            CARRIER
          </Text>

          {shippingServiceProvider == "DHL" ? (
            <Image
              source={DHL_logo}
              style={{
                aspectRatio: 675 / 260,
                height: 50,
                width: undefined,
                marginLeft: 18,
              }}
            />
          ) : null}
          {shippingServiceProvider == "FedExExpress" ? (
            <Image
              source={FedExExpress_logo}
              style={{
                aspectRatio: 5000 / 2281,
                height: 50,
                width: undefined,
                marginLeft: 20,
              }}
            />
          ) : null}
          {shippingServiceProvider == "FedEx" ? (
            <Image
              source={FedEx_logo}
              style={{
                aspectRatio: 5000 / 1400,
                height: 40,
                width: undefined,
                marginLeft: 18,
              }}
            />
          ) : null}
          {shippingServiceProvider == "USPS" ? (
            <Image
              source={USPS_logo}
              style={{
                aspectRatio: 736 / 168,
                height: 34,
                width: undefined,
                marginLeft: 18,
              }}
            />
          ) : null}
          {shippingServiceProvider == "UPS" ? (
            <Image
              source={UPS_logo}
              style={{
                aspectRatio: 478 / 570,
                height: 50,
                width: undefined,
                marginLeft: 18,
              }}
            />
          ) : null}
          <Text
            style={{
              fontSize: 12,
              color: "#B6B6B6",
              marginLeft: 18,
              marginTop: 8,
            }}
          >
            Est. delivery: Feb 2 -- Feb 21
          </Text>
          <Text
            style={{
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
              fontSize: 12,
              marginLeft: 18,
              marginTop: 10,
            }}
          >
            Total Shipping Cost{"  "}
            <Text
              style={{
                fontSize: 14,
                color: "#0082ff",
                fontWeight: "700",
                fontFamily: "Roboto_Regular",
              }}
            >
              {`${totals.shipping} USD`}
            </Text>
          </Text>
        </View>
      </View>
      <Text
        style={{
          marginLeft: 12,
          marginTop: 50,

          fontSize: 18,
          color: "#f4f4f4",
          fontFamily: "Roboto_Medium",
        }}
      >
        Final Cost
      </Text>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
      >
        <Text
          style={{
            color: "#565656",
            fontFamily: "Roboto_Medium",
            fontSize: 12,
            marginLeft: 18,
          }}
        >
          CARDS
        </Text>
        <Text
          style={{
            fontFamily: "Roboto_Medium",
            color: "#0bb31b",
            fontSize: 12,
            marginLeft: 8,
          }}
        >
          {`+ ${totals.cards} USD`}
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
      >
        <Text
          style={{
            color: "#565656",
            fontFamily: "Roboto_Medium",
            fontSize: 12,
            marginLeft: 18,
          }}
        >
          SHIPPING
        </Text>
        <Text
          style={{
            fontFamily: "Roboto_Medium",
            color: "#0bb31b",
            fontSize: 12,
            marginLeft: 8,
          }}
        >
          {`+ ${totals.shipping} USD`}
        </Text>
      </View>
      {/* <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
      >
        <Text
          style={{
            color: "#565656",
            fontFamily: "Roboto_Medium",
            fontSize: 12,
            marginLeft: 18,
          }}
        >
          MARKETPLACE FEES
        </Text>
        <Text
          style={{
            fontFamily: "Roboto_Medium",
            color: "#0bb31b",
            fontSize: 12,
            marginLeft: 8,
          }}
        >
          {`+ ${totals.marketplaceFees} USD`}
        </Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
      >
        <Text
          style={{
            color: "#565656",
            fontFamily: "Roboto_Medium",
            fontSize: 12,
            marginLeft: 18,
          }}
        >
          PAYMENT PROCESSING FEES
        </Text>
        <Text
          style={{
            fontFamily: "Roboto_Medium",
            color: "#0bb31b",
            fontSize: 12,
            marginLeft: 8,
          }}
        >
          {`+ ${totals.paymentProcessingFees} USD`}
        </Text>
      </View> */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 18,
        }}
      >
        <View
          style={{
            width: 20,
            height: 2,
            backgroundColor: "#f4f4f4",
            marginLeft: 12,
            borderRadius: 3,
          }}
        />
        <Text
          style={{
            fontWeight: "700",
            color: "#0dff25",
            fontSize: 18,
            marginLeft: 8,
          }}
        >
          {`${totals.final} USD`}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#0082ff",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            paddingVertical: 7,
            marginTop: 50,

            width: "90%",
          }}
          onPress={() => {
            setPage("endPage");
          }}
        >
          <Text style={{ fontWeight: "700", color: "#121212", fontSize: 18 }}>
            Purchase
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Text style={{ fontFamily: "Roboto_Medium", color: "#555555" }}>
            Powered by{"  "}
          </Text>
          <Image
            source={Stripe_logo}
            style={{ aspectRatio: 282 / 117, width: undefined, height: 20 }}
          />
        </View>
      </View>
    </View>
  );
};
