import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";

import { TextInput } from "react-native-paper";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

import { auth, reauthenticate } from "../../authContext";

const strongPasswordRegEx =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/;

const reviewSchema = yup.object({
  newPassowrd: yup
    .string("Wrong format!")
    .required("Password is required!")
    .min(7, "Password must be longer then 6 charts!")
    .matches(
      strongPasswordRegEx,
      "At least one number, capital & lower letter!"
    ),
  confirmPassword: yup.string().when("newPassowrd", {
    is: (val) => (val && val.length > 0 ? true : false),
    then: yup
      .string()
      .oneOf([yup.ref("newPassowrd")], "Passwords aren't the same! ")
      .required("Confirm Password is required!"),
  }),
});

const ChangePasswordModal = ({ setModal }) => {
  const [error, setError] = useState("");
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  return (
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
            width: "90%",
            backgroundColor: "#fff",
            borderRadius: 8,
            paddingVertical: 18,
            paddingLeft: 24,
          }}
        >
          <Text style={{ color: "#f4f4f4", fontSize: 26, fontWeight: "700" }}>
            Change Password
          </Text>
          <Formik
            initialValues={{
              recentPassword: "",
              newPassowrd: "",
              confirmPassword: "",
            }}
            validationSchema={reviewSchema}
            onSubmit={async (values, actions) => {
              setLoadingIndicator(true);
              if (await reauthenticate(values.recentPassword)) {
                await auth.currentUser.updatePassword(values.newPassowrd);
                setLoadingIndicator(false);
                setModal(false);
              } else {
                setLoadingIndicator(false);
                setError("Wrong recent password!");
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
              <View>
                <TextInput
                autoCapitalize="none"
                  mode={"outlined"}
                  value={props.values.recentPassword}
                  secureTextEntry={true}
                  onChangeText={props.handleChange("recentPassword")}
                  label="Recent Password"
                  outlineColor={"#5c5c5c"}
                  error={
                    props.touched.recentPassword && props.errors.recentPassword
                      ? true
                      : false
                  }
                  style={{
                    width: "90%",
                    backgroundColor: "#121212",
                    color: "#f4f4f4",
                    marginTop:
                      props.touched.recentPassword &&
                      props.errors.recentPassword
                        ? 0
                        : 20,
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
                <ErrorMessage component="div" name="recentPassword">
                  {(msg) => (
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
                  )}
                </ErrorMessage>
                <TextInput
                autoCapitalize="none"
                  mode={"outlined"}
                  value={props.values.newPassowrd}
                  secureTextEntry={true}
                  onChangeText={props.handleChange("newPassowrd")}
                  label="New Password"
                  outlineColor={"#5c5c5c"}
                  error={
                    props.touched.newPassowrd && props.errors.newPassowrd
                      ? true
                      : false
                  }
                  style={{
                    width: "90%",
                    backgroundColor: "#121212",
                    color: "#f4f4f4",
                    marginTop:
                      props.touched.recentPassword &&
                      props.errors.recentPassword
                        ? 0
                        : 40,
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
                <ErrorMessage component="div" name="newPassowrd">
                  {(msg) => (
                    <Text
                      style={{
                        width: "90%",
                        marginTop: 8,
                        marginBottom: 30,
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
                autoCapitalize="none"
                  mode={"outlined"}
                  value={props.values.confirmPassword}
                  secureTextEntry={true}
                  onChangeText={props.handleChange("confirmPassword")}
                  label="Confirm Password"
                  outlineColor={"#5c5c5c"}
                  error={
                    props.touched.confirmPassword &&
                    props.errors.confirmPassword
                      ? true
                      : false
                  }
                  style={{
                    width: "90%",
                    backgroundColor: "#121212",
                    color: "#f4f4f4",
                    marginTop:
                      props.touched.newPassowrd && props.errors.newPassowrd
                        ? 0
                        : 20,
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
                  )}
                </ErrorMessage>

                <View
                  style={{
                    width: "90%",
                    flexDirection: "row-reverse",
                    marginBottom: 8,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: 30,
                      marginTop: 30,
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
                        marginLeft: 18,
                      }}
                    />
                  ) : null}
                  <TouchableOpacity
                    style={{
                      height: 30,
                      marginTop: 30,
                      marginRight: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",

                      borderColor: "#5c5c5c",
                      borderWidth: 2,
                      borderRadius: 3,

                      paddingHorizontal: 20,
                    }}
                    onPress={() => {
                      setModal(false);
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

                  <Text
                    style={{
                      color: "#b40424",
                      fontWeight: "700",
                      marginBottom: -20,
                      marginRight: 16,
                    }}
                  >
                    {error}
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;
