import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Clipboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from "react-native";

import { TextInput } from "react-native-paper";

import * as yup from "yup";
import { Formik, ErrorMessage } from "formik";

import { Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconI from "react-native-vector-icons/Ionicons";

import {
  auth,
  db,
  functions,
  fetchUserData,
  updateUserData,
  deleteAccount,
  changeEmail,
  googleReSignIn,
  auth,
} from '../authContext';

// import * as GoogleSignIn from "expo-google-app-auth";
import * as GoogleSignIn from "expo-google-sign-in";

import AreYouSureModal from "../shared/Modals/AreYouSureModal";
import ChangePasswordModal from "../shared/Modals/ChangePasswordModal";
import { CountryPickerModal } from "../shared/Modals/CountryPickerModal";
import ReauthenticationModal from "../shared/Modals/ReauthenticationModal";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

const onlyLettersRegEx =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
const firstCapitalLetter = /^[A-Z].*/;

const reviewSchema = yup.object({
  nick: yup
    .string('Wrong format!')
    .min(4, 'Name must be longer then 4 charts!'),
  country: yup
    .string('Wrong format!')
    .required('Country is required!')
    .matches(firstCapitalLetter, 'Wrong country name!')
    .matches(onlyLettersRegEx, 'Name cannot contain numbers or symbols!'),
});

export default function Settings() {
  const [loading, setLoading] = useState(true);

  const [formChanged, setFormChanged] = useState(false);

  const [actionType, setActionType] = useState(null);
  const [areYouSureModal, setAreYouSureModal] = useState(false);
  const [countryPickerState, setCountryPickerState] = useState(false);
  const [reauthenticationResult, setReauthenticationResult] = useState(null);

  const [modalState, setModal] = useState(false);
  const [addressesArray, setAddressesArray] = useState([]);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const [snackbarState, setSnackbarState] = useState(false);

  const [userData, setUserData] = useState({
    nick: '',
    country: '',
  });
  const [initValues, setInitValues] = useState({
    nick: '',
    country: '',
  });

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  ]);

  useEffect(async () => {
    if (isFocused) {
      const result = await fetchUserData();

      setInitValues({ nick: result.nick, country: result.country });
      setUserData({ nick: result.nick, country: result.country });

      setAddressesArray(result.addresses);

      const query = functions.httpsCallable("testNotification");
      await query().then((result) => {
        console.log(result.data);
      });

      setLoading(false);
    } else {
      setLoading(true);
      setInitValues({
        nick: "",
        country: "",
      });
      setUserData({
        nick: "",
        country: "",
      });
      setAddressesArray([]);
    }
  }, [isFocused]);

  useEffect(() => {
    const resolvePromises = async () => {
      if (reauthenticationResult) {
        if (actionType == 'deleteAccount') {
          await deleteAccount();
        } else if (actionType == 'changeEmail') {
          await changeEmail();
        } else if (actionType == "updateUser") {
          setFormChanged(false);
          await updateUserData(userData, initValues, setAddressesArray);
          setInitValues({
            nick: userData.nick,
            country: userData.country,
          });
        }

        setModal(false);
        setActionType(null);
        setReauthenticationResult(false);
      }
    };
    resolvePromises();
  }, [reauthenticationResult]);

  const setCountryValue = (value) => {
    setUserData((prevState) => ({ ...prevState, country: value }));

    if (value !== initValues.country) {
      setFormChanged(true);
    } else {
      setFormChanged(false);
    }
  };

  const detectChanges = (values) => {
    if (
      values.nick !== initValues.nick ||
      userData.country !== initValues.country
    ) {
      setUserData(values);
      setFormChanged(true);
    } else {
      setFormChanged(false);
    }
  };

  async function reSignInWithGoogleAsync(action) {
    try {
      if (action === 'deleteAccount') {
        navigation.navigate('DeletingAccount');
      }

      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();

      if (
        type === "success" &&
        (await googleReSignIn({
          type: "success",
          idToken: user.auth.idToken,
          accessToken: user.auth.accessToken,
        }))
      ) {
        if (action === "deleteAccount") {
          await deleteAccount();
          navigation.navigate("DeletingAccount");
        } else {
          setInitValues({
            nick: userData.nick,
            country: userData.country,
          });
          setFormChanged(false);

          await updateUserData(userData);
        }
      } else {
        return { cancelled: true };
      }
    } catch ({ message }) {
      alert("login: Error:" + message);
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1b1b1b",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0082ff" />
      </View>
    );
  } else {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#1b1b1b',
        }}>
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

              paddingLeft: "5%",
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
                nick: initValues.nick,
                country: initValues.country,
              }}
              validationSchema={reviewSchema}
              onSubmit={async (values, actions) => {
                if (
                  auth.currentUser?.providerData[0].providerId != "google.com"
                ) {
                  setModal(true);
                } else {
                  await reSignInWithGoogleAsync();
                }
              }}
              style={{
                flex: 1,
                flexDirection: "column",
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
                    width: "100%",
                    height: "100%",
                    paddingLeft: "5%",
                    marginBottom: 20,
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
                <ErrorMessage component='div' name='nick'>
                  {(msg) => (
                    <Text
                      style={{
                        width: '80%',
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
                <TouchableOpacity
                  style={{ width: '80%' }}
                  onPress={() => setCountryPickerState(true)}>
                  <TextInput
                    mode={"outlined"}
                    value={props.values.nick}
                    onChangeText={props.handleChange("nick")}
                    onEndEditing={(e) => {
                      if (e.nativeEvent.text.length >= 4) {
                        detectChanges(props.values);
                      } else {
                        setFormChanged(false);
                      }
                    }}
                    label="Nick"
                    outlineColor={"#5c5c5c"}
                    error={
                      props.touched.country && props.errors.country
                        ? true
                        : false
                    }
                    style={{
                      width: '100%',
                      backgroundColor: '#1B1B1B',
                      marginTop: 20,
                    }}
                    disabled={true}
                    theme={{
                      colors: {
                        text: '#fff',
                        disabled: '#5c5c5c',
                        background: 'transparent',
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
                    onPress={() => {
                      setCountryPickerState(true);
                    }}
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
                        width: '80%',
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
                    width: '80%',
                    flexDirection: 'row-reverse',
                    marginBottom: 20,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: "80%",
                      flexDirection: "row-reverse",
                      alignItems: "center",
                      display: formChanged ? "flex" : "none",
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
                      disabled={!formChanged}
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

              marginTop: 20,
              marginBottom: 12,
              paddingLeft: "5%",
            }}
          >
            Account ID
          </Text>

          <View
            style={{
              backgroundColor: "#1B1B1B",
              paddingLeft: "5%",
            }}
            onPress={async () => {
              if (
                auth.currentUser?.providerData[0].providerId != 'google.com'
              ) {
                setActionType('deleteAccount');
                setModal(true);
              } else {
                await reSignInWithGoogleAsync('deleteAccount');
              }
            }}>
            <Text
              style={{
                borderRadius: 6,
                paddingVertical: 12,
                flexDirection: "row",
                alignSelf: "baseline",
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
          <FlatList
            numColumns={2}
            data={addressesArray}
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",

              backgroundColor: "#1b1b1b",

              flex: 1,
            }}
            renderItem={({ item, index }) => {
              if (item.empty) {
                return (
                  <TouchableOpacity
                    style={{
                      width: "48%",
                      height: undefined,

                      marginRight: index === 0 || 2 || 4 ? "4%" : "0%",

                      padding: 8,
                      borderWidth: 2,
                      borderRadius: 6,
                      borderColor: "#5c5c5c",
                      borderStyle: "dashed",
                      justifyContent: "center",

                      backgroundColor: "#121212",

                      aspectRatio:
                        addressesArray.length === 0 ? 1.68 / 1 : null,
                    }}
                    onPress={() => {
                      navigation.navigate("CartStack", {
                        screen: "AddAddress",
                      });
                    }}
                  >
                    <Text
                      style={{
                        color: "#5c5c5c",
                        fontFamily: "Roboto_Medium",
                        fontSize: 16,
                        alignSelf: "center",
                      }}
                    >
                      Add
                    </Text>
                    <Text
                      style={{
                        color: "#5c5c5c",
                        fontFamily: "Roboto_Medium",
                        fontSize: 16,
                        alignSelf: "center",
                      }}
                    >
                      Address
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={{
                      width: "48%",
                      marginRight: index === 0 || 2 || 4 ? "4%" : "0%",

                      padding: 10,
                      borderRadius: 6,

                      backgroundColor: "#121212",
                    }}
                    onPress={() => {
                      navigation.navigate("SettingsStack", {
                        screen: "Settings_EditAddress",
                        params: item,
                      });
                    }}
                  >
                    <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
                      {`${item.firstName} ${item.lastName}`}
                    </Text>
                    <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
                      {item.streetAddress1}
                    </Text>
                    {item.streetAddress2 ? (
                      <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
                        {item.streetAddress2}
                      </Text>
                    ) : null}
                    <Text
                      style={{ color: "#f4f4f4", marginLeft: 6 }}
                    >{`${item.city}, ${item.zipCode}`}</Text>
                    <Text style={{ color: "#f4f4f4", marginLeft: 6 }}>
                      {item.country}
                    </Text>
                    <Text
                      style={{ color: "#f4f4f4", marginLeft: 6, marginTop: 8 }}
                    >
                      {item.phoneNumber}
                    </Text>
                  </TouchableOpacity>
                );
              }
            }}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",

                    marginTop: 40,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "#f4f4f4",
                      fontWeight: "700",
                      fontSize: 22,
                      marginRight: 16,
                    }}
                  >
                    Addresses
                  </Text>

                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => {
                      navigation.navigate("SettingsStack", {
                        screen: "Settings_AddAddress",
                        params: { country: userData.country },
                      });
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto_Medium",
                        color: "#0082ff",
                        marginRight: 6,
                      }}
                    >
                      Add New
                    </Text>
                    <IconMCI name={"plus"} color={"#0082ff"} size={20} />
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={() => {
              if (loading) {
                return (
                  <View
                    style={{
                      felx: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size="large" color="#0082ff" />
                  </View>
                );
              } else {
                return (
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      marginTop: 12,
                      backgroundColor: "#121212",
                      borderRadius: 6,
                      width: "98%",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                    }}
                  >
                    <IconI name={"warning"} color={"yellow"} size={50} />
                    <View style={{ marginLeft: 12, paddingRight: 40 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#888",
                        }}
                      >
                        Add shipping address
                      </Text>
                      <Text
                        style={{ fontSize: 12, color: "#888", width: "92%" }}
                      >
                        You cannot buy anything until you add a shipping
                        address.
                      </Text>
                    </View>
                  </View>
                );
              }
            }}
          />
          <Text
            style={{
              color: "#f4f4f4",
              fontWeight: "700",
              fontSize: 22,

              paddingLeft: "5%",

              marginTop: 40,
              marginBottom: 12,
            }}
          >
            Other
          </Text>
          <View
            style={{
              backgroundColor: "#1B1B1B",
              flexDirection: "column",

              paddingLeft: "5%",
              marginBottom: 30,
            }}
          >
            <View
              style={{
                // backgroundColor: "#121212",

                borderRadius: 5,
                marginTop: 8,

                alignItems: "center",
                justifyContent: "space-evenly",
                width: "92%",
              }}
            >
              <TouchableOpacity
                style={{
                  width: "90%",

                  paddingVertical: 7,

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 4,
                  backgroundColor: "#0082FF",
                }}
                onPress={async () => {
                  navigation.navigate("WelcomeStack", { screen: "SignOut" });
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                    marginRight: 10,
                  }}
                >
                  Sign Out
                </Text>
                <IconMCI name={"logout"} size={20} color={"#121212"} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: "90%",
                  marginTop: 20,
                  paddingVertical: 7,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 3,
                  backgroundColor: "#0082FF",
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
                    marginRight: 10,
                  }}
                >
                  Delete Account
                </Text>
                <IconMCI name={"delete"} size={20} color={"#121212"} />
              </TouchableOpacity>
              {auth.currentUser?.providerData[0].providerId != "google.com" ? (
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    width: "90%",

                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: "#0082FF",
                    borderRadius: 3,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
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
                      marginRight: 10,
                    }}
                  >
                    Change Password
                  </Text>
                  <IconMCI name={"key-change"} size={20} color={"#121212"} />
                </TouchableOpacity>
              ) : null}
            </View>
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
          Account ID is copied to clipboard
        </Snackbar>
      </View>
    );
  }
}

//!Instagram, Whatsapp, Discord
