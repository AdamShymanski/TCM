import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';

import * as yup from 'yup';

import { Snackbar, TextInput } from "react-native-paper";

import { login, auth } from "../authContext";
import { Formik, ErrorMessage } from "formik";

const reviewSchema = yup.object({
  email: yup
    .string('Wrong format!')
    .email('Email is invalid!')
    .required('Email is required!'),
  password: yup.string('Wrong format!').required('Password is required!'),
});
const modalReviewSchema = yup.object({
  email: yup
    .string("Wrong format!")
    .email("Email is invalid!")
    .required("Email is required!"),
});

export default function Login() {
  const [modalState, setModalVisible] = useState(false);
  const [snackbarState, setSnackbar] = useState(false);

  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [modalLoadingIndicator, setModalLoadingIndicator] = useState(false);

  return (
    <View
      style={{
        backgroundColor: "#1b1b1b",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Modal
        visible={modalState}
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
              width: "87%",

              backgroundColor: "#121212",
              borderRadius: 8,
              paddingVertical: 18,
              paddingHorizontal: 18,
            }}
          >
            <Text style={{ color: "#f4f4f4", fontSize: 26, fontWeight: "700" }}>
              Reset Password
            </Text>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={modalReviewSchema}
              onSubmit={async (values, actions) => {
                console.log("submit");

                setModalError(false);
                setModalLoadingIndicator(true);

                auth
                  .sendPasswordResetEmail(values.email)
                  .then(() => {
                    setModalLoadingIndicator(false);
                    setModalVisible(false);
                    setSnackbar("Email sent successfully!");
                  })
                  .catch((error) => {
                    if (error.code === "auth/user-not-found") {
                      setModalError("User not found!");
                    } else {
                      setModalError("Something went wrong!");
                    }
                    setModalLoadingIndicator(false);
                  });
              }}
            >
              {(props) => (
                <View
                  style={{
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      mode={"outlined"}
                      value={props.values.email}
                      onChangeText={props.handleChange("email")}
                      onFocus={() => setModalError("")}
                      label="Email"
                      outlineColor={"#5c5c5c"}
                      error={
                        props.touched.email && props.errors.email ? true : false
                      }
                      style={{
                        width: "80%",

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
                    {modalLoadingIndicator ? (
                      <ActivityIndicator
                        size={30}
                        color="#0082ff"
                        animating={modalLoadingIndicator}
                        style={{
                          marginLeft: 14,
                          marginTop: 20,
                        }}
                      />
                    ) : null}
                  </View>

                  <ErrorMessage component="div" name="email">
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

                  {!modalLoadingIndicator ? (
                    <Text
                      style={{
                        color: "#b40424",
                        fontWeight: "700",
                        marginTop: 20,
                        marginRight: 14,
                      }}
                    >
                      {modalError}
                    </Text>
                  ) : (
                    <View
                      style={{
                        marginTop: 20,
                      }}
                    />
                  )}

                  <View
                    style={{
                      flexDirection: "row-reverse",
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 76,
                        height: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor: "#0082FF",
                        borderRadius: 3,
                      }}
                      onPress={() => {
                        console.log("click");
                        props.submitForm();
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
                        marginRight: 12,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",

                        borderRadius: 3,
                        borderWidth: 2,
                        borderColor: "#5c5c5c",
                      }}
                      onPress={() => {
                        setModalVisible(false);
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
              )}
            </Formik>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text
          style={{
            fontWeight: '700',
            color: '#f4f4f4',
            fontSize: 46,
            marginTop: 40,
            marginBottom: 18,
          }}>
          Login
        </Text>
        <Text
          style={{
            fontWeight: '600',
            color: '#939393',
            fontSize: 12,
            textAlign: 'center',
            width: 280,
            marginBottom: 40,
          }}>
          {"Welcome back! Check out our new features which we've made for you."}
        </Text>
      </View>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values, actions) => {
          setLoadingIndicator(true);
          setError("");
          await login(values.email, values.password, setError);
          setLoadingIndicator(false);
        }}
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          marginVertical: 40,
        }}>
        {(props) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            <TextInput
              mode={'outlined'}
              value={props.values.email}
              onChangeText={props.handleChange('email')}
              label='Email'
              outlineColor={'#5c5c5c'}
              error={props.touched.email && props.errors.email ? true : false}
              style={{
                width: '70%',

                backgroundColor: '#1b1b1b',
                color: '#f4f4f4',
                marginTop: 20,
              }}
              theme={{
                colors: {
                  primary: '#0082ff',
                  placeholder: '#5c5c5c',
                  background: 'transparent',
                  text: '#f4f4f4',
                },
              }}
            />
            <ErrorMessage component='div' name='email'>
              {(msg) => (
                <Text
                  style={{
                    width: '70%',
                    marginTop: 8,
                    marginBottom: 18,
                    height: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    color: '#b40424',
                    fontWeight: '700',
                  }}>
                  {msg}
                </Text>
              )}
            </ErrorMessage>
            <TextInput
              mode={'outlined'}
              value={props.values.password}
              secureTextEntry={true}
              onChangeText={props.handleChange('password')}
              label='Password'
              outlineColor={'#5c5c5c'}
              error={
                props.touched.password && props.errors.password ? true : false
              }
              style={{
                width: '70%',

                backgroundColor: '#1b1b1b',
                color: '#f4f4f4',
                marginTop: 20,
              }}
              theme={{
                colors: {
                  primary: '#0082ff',
                  placeholder: '#5c5c5c',
                  background: 'transparent',
                  text: '#f4f4f4',
                },
              }}
            />
            <ErrorMessage component='div' name='password'>
              {(msg) => (
                <Text
                  style={{
                    width: '70%',
                    marginTop: 8,
                    marginBottom: 18,
                    height: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    color: '#b40424',
                    fontWeight: '700',
                  }}>
                  {msg}
                </Text>
              )}
            </ErrorMessage>

            <View
              style={{
                width: '70%',
                flexDirection: 'row-reverse',
                marginBottom: 40,
                alignItems: 'center',
              }}
              onPress={props.submitForm}>
              <TouchableOpacity
                style={{
                  height: 30,
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',

                  backgroundColor: '#0082FF',
                  borderRadius: 3,
                  paddingHorizontal: 20,
                }}
                onPress={props.submitForm}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#121212',
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
              {loadingIndicator ? (
                <ActivityIndicator
                  size={30}
                  color='#0082ff'
                  animating={loadingIndicator}
                  style={{
                    marginRight: 14,
                    marginTop: 20,
                  }}
                />
              ) : null}
              <Text
                style={{
                  color: '#b40424',
                  fontWeight: '700',
                  marginTop: 20,
                  marginRight: 14,
                }}>
                {error}
              </Text>
            </View>
          </View>
        )}
      </Formik>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={{ color: "#5c5c5c" }}>Forgot password?</Text>
      </TouchableOpacity>
      <Snackbar
        visible={snackbarState}
        duration={2000}
        onDismiss={() => setSnackbar(false)}
        action={{
          label: "",
          onPress: () => {},
        }}
      >
        {snackbarState}
      </Snackbar>
    </View>
  );
}
