import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Clipboard,
} from "react-native";
//correct and updated library is -- import Clipboard from '@react-native-community/clipboard';
//but it doesn't work :/

import { TextInput } from "react-native-paper";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Snackbar } from "react-native-paper";

import {
  auth,
  fetchUserData,
  updateUserData,
  deleteAccount,
  changeEmail,
  googleReSignIn,
} from "../authContext";

import * as Google from "expo-google-app-auth";

import ReauthenticationModal from "../shared/ReauthenticationModal";
import ChangePasswordModal from "../shared/ChangePasswordModal";
import { CountryPickerModal } from "../shared/CountryPickerModal";
import { AreYouSureModal } from "../shared/AreYouSureModal";

import { useNavigation } from "@react-navigation/native";

const onlyLettersRegEx =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
const firstCapitalLetter = /^[A-Z].*/;

const reviewSchema = yup.object({
  nick: yup
    .string("Wrong format!")
    .min(4, "Name must be longer then 4 charts!"),
  country: yup
    .string("Wrong format!")
    .required("Country is required!")
    .matches(firstCapitalLetter, "Wrong country name!")
    .matches(onlyLettersRegEx, "Name cannot contain numbers or symbols!"),
});

export default function Settings() {
  const [loading, setLoading] = useState(true);

  const [accountFormError, setAccountFormError] = useState("");

  const [actionType, setActionType] = useState(null);
  const [modalState, setModal] = useState(false);
  const [areYouSureModal, setAreYouSureModal] = useState(false);
  const [countryPickerState, setCountryPickerState] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [reauthenticationResult, setReauthenticationResult] = useState(null);

  const [snackbarState, setSnackbarState] = useState(false);

  const [userData, setUserData] = useState({
    nick: "",
    country: "",
  });

  const [initValues, setInitValues] = useState({
    nick: "",
    country: "",
  });

  const navigation = useNavigation();

  useEffect(() => {
    const resolvePromises = async () => {
      const result = await fetchUserData();

      setUserData(result);
      setInitValues({ nick: result.nick, country: result.country });
      setLoading(false);
    };
    resolvePromises();
  }, []);

  useEffect(() => {
    const resolvePromises = async () => {
      if (reauthenticationResult) {
        if (actionType == "deleteAccount") {
          await deleteAccount();
        } else if (actionType == "changeEmail") {
          await changeEmail();
        } else if (actionType == "updateUser") {
          await updateUserData(userData);
        }

        setModal(false);
        setActionType(null);
        setReauthenticationResult(false);
      }
    };
    resolvePromises();
  }, [reauthenticationResult]);

  const setCountryValue = (value) => {
    const obj = userData;
    obj.country = value;
    setUserData(obj);
  };

  async function reSignInWithGoogleAsync(action) {
    try {
      if (action === "deleteAccount") {
        navigation.navigate("DeletingAccount");
      }
      const result = await Google.logInAsync({
        androidClientId:
          "352773112597-2s89t2icc0hfk1tquuvj354s0aig0jq2.apps.googleusercontent.com",
        androidStandaloneAppClientId: `352773112597-2s89t2icc0hfk1tquuvj354s0aig0jq2.apps.googleusercontent.com`,
        scopes: ["profile", "email"],
      });

      if (result.type === "success" && (await googleReSignIn(result))) {
        if (action === "deleteAccount") {
          await deleteAccount();
        } else {
          await updateUserData(userData);
        }
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      if (e.code == "auth/email-already-in-use") {
        console.log("Duplicated emails has been detected");
      } else {
        console.log(e);
      }
    }
  }

  if (loading) {
    return <View />;
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1b1b1b",
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#1b1b1b",
          }}
        >
          {countryPickerState ? (
            <CountryPickerModal
              setValue={setCountryValue}
              setVisible={setCountryPickerState}
            />
          ) : null}
          {modalState ? (
            <ReauthenticationModal
              setReauthenticationResult={setReauthenticationResult}
              setModal={setModal}
            />
          ) : null}
          {areYouSureModal ? (
            <AreYouSureModal
              setReauthenticationResult={setReauthenticationResult}
              setModal={setAreYouSureModal}
            />
          ) : null}
          {changePasswordModal ? (
            <ChangePasswordModal setModal={setChangePasswordModal} />
          ) : null}

          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 22,

              paddingTop: 12,
              paddingLeft: 12,
            }}
          >
            Account
          </Text>
          <View
            style={{
              backgroundColor: "#1B1B1B",
            }}
          >
            <Formik
              initialValues={{
                nick: userData.nick,
                country: userData.country,
              }}
              validationSchema={reviewSchema}
              onSubmit={async (values, actions) => {
                const detectChanges = () => {
                  if (
                    values.nick == initValues.nick &&
                    userData.country == initValues.country
                  ) {
                    setAccountFormError("No change detected");
                    return false;
                  } else {
                    setAccountFormError("");
                    return true;
                  }
                };

                if (detectChanges()) {
                  if (
                    auth.currentUser?.providerData[0].providerId != "google.com"
                  ) {
                    setModal(true);
                  } else {
                    await reSignInWithGoogleAsync();
                    setUserData({
                      nick: values.nick,
                      country: userData.country,
                    });
                    setInitValues({
                      nick: values.nick,
                      country: userData.country,
                    });
                  }
                }
              }}
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
                marginVertical: 40,
                backgroundColor: "#121212",
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
                  <TextInput
                    mode={"outlined"}
                    value={props.values.nick}
                    onChangeText={props.handleChange("nick")}
                    label="Nick"
                    outlineColor={"#5c5c5c"}
                    error={
                      props.touched.nick && props.errors.nick ? true : false
                    }
                    style={{
                      width: "80%",
                      backgroundColor: "#1B1B1B",
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
                          width: "80%",
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
                    style={{ width: "80%" }}
                    onPress={() => setCountryPickerState(true)}
                  >
                    <TextInput
                      mode={"outlined"}
                      value={userData.country}
                      onChangeText={props.handleChange("country")}
                      label="Country"
                      outlineColor={"#5c5c5c"}
                      error={
                        props.touched.country && props.errors.country
                          ? true
                          : false
                      }
                      style={{
                        width: "100%",
                        backgroundColor: "#1B1B1B",
                        marginTop: 20,
                      }}
                      disabled={true}
                      theme={{
                        colors: {
                          text: "#fff",
                          disabled: "#5c5c5c",
                          background: "transparent",
                        },
                      }}
                    />
                  </TouchableOpacity>

                  <ErrorMessage component="div" name="country">
                    {(msg) => (
                      <Text
                        style={{
                          width: "80%",
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
                      width: "80%",
                      flexDirection: "row-reverse",
                      marginBottom: 20,
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
                      onPress={() => {
                        setActionType("updateUser");
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
                    <Text
                      style={{
                        color: "#b40424",
                        fontWeight: "700",
                        marginBottom: -20,
                        marginRight: 16,
                      }}
                    >
                      {accountFormError}
                    </Text>
                  </View>
                </View>
              )}
            </Formik>
          </View>
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 22,

              paddingTop: 12,
              paddingLeft: 12,
            }}
          >
            Seller ID
          </Text>
          <View
            style={{
              marginTop: 20,
              backgroundColor: "#1B1B1B",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <View
              style={{
                borderRadius: 6,
                paddingVertical: 12,
                flexDirection: "row",
                backgroundColor: "#121212",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#1b1b1b",
                  paddingVertical: 6,
                  paddingHorizontal: 6,
                  borderRadius: 4,
                  marginLeft: 16,
                }}
                onPress={() => {
                  Clipboard.setString(`${auth.currentUser.uid}`);
                  setSnackbarState(true);
                }}
              >
                <Icon name="content-copy" color={"#0082ff"} size={24} />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 13.7,
                  color: "#f4f4f4",
                  marginLeft: 12,
                  marginRight: 16,
                }}
              >
                {auth.currentUser.uid}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 22,

              paddingTop: 12,
              paddingLeft: 12,
            }}
          >
            Other
          </Text>
          <View
            style={{
              backgroundColor: "#1B1B1B",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                height: 30,
                marginTop: 20,
                width: "70%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#0082FF",
                borderRadius: 3,
                paddingHorizontal: 12,
              }}
              onPress={async () => {
                if (
                  auth.currentUser?.providerData[0].providerId != "google.com"
                ) {
                  setActionType("deleteAccount");
                  setModal(true);
                } else {
                  await reSignInWithGoogleAsync("deleteAccount");
                }
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#121212",
                }}
              >
                Delete Account
              </Text>
            </TouchableOpacity>

            {auth.currentUser?.providerData[0].providerId != "google.com" ? (
              <TouchableOpacity
                style={{
                  height: 30,
                  marginTop: 20,
                  width: "70%",

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "#0082FF",
                  borderRadius: 3,
                  paddingHorizontal: 12,
                }}
                onPress={() => {
                  setChangePasswordModal(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                  }}
                >
                  Change Password
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={{
                height: 30,
                marginTop: 20,
                width: "70%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#0082FF",
                borderRadius: 3,
                paddingHorizontal: 12,
              }}
              onPress={async () => {
                auth.signOut();
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#121212",
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Snackbar
          visible={snackbarState}
          duration={2000}
          onDismiss={() => setSnackbarState(false)}
          action={{
            label: "",
            onPress: () => {},
          }}
        >
          Seller ID is copied to clipboard
        </Snackbar>
      </View>
    );
  }
}

//!Instagram, Whatsapp, Discord
