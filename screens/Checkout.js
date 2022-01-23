import React, { useState } from "react";

import { Text, View, Image, TouchableOpacity } from "react-native";

import { TextInput } from "react-native-paper";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

import { placeOrder } from "../authContext";

const reviewSchema = yup.object({
  postlCode: yup.string("Wrong format!").required("Name is required!"),
  country: yup.string("Wrong format!").required("Email is required!"),
  firstName: yup.string("Wrong format!").required("Password is required!"),
  lastName: yup.string("Wrong format!").required("Password is required!"),
  streetAddress: yup.string("Wrong format!").required("Password is required!"),
  streetAddress2: yup.string("Wrong format!").required("Password is required!"),
  state: yup.string("Wrong format!").required("Password is required!"),
  ZIPCode: yup.string("Wrong format!").required("Password is required!"),
  email: yup.string("Wrong format!").required("Password is required!"),
  country: yup.string("Wrong format!").required("Password is required!"),
});

export default function Checkout() {
  const [countryPickerState, setCountryPickerState] = useState("");
  const [countryInputTouched, setCountryInputTouched] = useState(false);

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [error, setError] = useState("");

  return (
    <ScrollView style={{ backgroundColor: "#1b1b1b", flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text
          style={{
            fontWeight: "700",
            color: "#f4f4f4",
            fontSize: 46,
            marginTop: 40,

            marginBottom: 18,
          }}
        >
          Register
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
          {"Let's create your account! Fill all the field and submit the form."}
        </Text>
      </View>

      <Formik
        initialValues={{
          nick: "",
          country: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values, actions) => {
          setLoadingIndicator(true);
          await register(
            values.email,
            values.password,
            values.nick,
            values.country,
            setError
          );
          setLoadingIndicator(false);
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
            <TextInput
              mode={"outlined"}
              value={props.values.nick}
              onChangeText={props.handleChange("nick")}
              label="Nick"
              outlineColor={"#5c5c5c"}
              error={props.touched.nick && props.errors.nick ? true : false}
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
            <ErrorMessage component="div" name="nick">
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
            <TextInput
              mode={"outlined"}
              value={props.values.email}
              onChangeText={props.handleChange("email")}
              label="Email"
              outlineColor={"#5c5c5c"}
              error={props.touched.email && props.errors.email ? true : false}
              style={{
                width: "70%",
                backgroundColor: "#1b1b1b",
                color: "#f4f4f4",
                marginTop: props.touched.nick && props.errors.nick ? 0 : 20,
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
            <ErrorMessage component="div" name="email">
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
            <TextInput
              mode={"outlined"}
              value={props.values.password}
              secureTextEntry={true}
              onChangeText={props.handleChange("password")}
              label="Password"
              outlineColor={"#5c5c5c"}
              error={
                props.touched.password && props.errors.password ? true : false
              }
              style={{
                width: "70%",
                backgroundColor: "#1b1b1b",
                color: "#f4f4f4",
                marginTop: props.touched.email && props.errors.email ? 0 : 20,
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
            <ErrorMessage component="div" name="password">
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
            <TextInput
              mode={"outlined"}
              value={props.values.confirmPassword}
              secureTextEntry={true}
              onChangeText={props.handleChange("confirmPassword")}
              label="Confirm Password"
              outlineColor={"#5c5c5c"}
              error={
                props.touched.confirmPassword && props.errors.confirmPassword
                  ? true
                  : false
              }
              style={{
                width: "70%",
                backgroundColor: "#1b1b1b",
                color: "#f4f4f4",
                marginTop:
                  props.touched.password && props.errors.password ? 0 : 20,
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
            <ErrorMessage component="div" name="confirmPassword">
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
