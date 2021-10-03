import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Button,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { TextInput } from 'react-native-paper';
import { Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';

import {
  fetchUserData,
  updateUserData,
  deleteAccount,
  resetPassword,
  changeEmail,
} from '../authContext';

import ReauthenticationModal from '../shared/reauthenticationModal';
import { CountryPickerModal } from '../shared/countryPickerModal';

const onlyLettersRegEx =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
const firstCapitalLetter = /^[A-Z].*/;

const reviewSchema = yup.object({
  nick: yup
    .string('Wrong format!')
    .min(4, 'Name must be longer then 4 charts!'),
  // address: yup.string('Wrong format!').required('Address is required!'),
  // postalCode: yup
  //   .string('Wrong format!')
  //   .required('Postal or Zip Code is required!'),
  country: yup
    .string('Wrong format!')
    .required('Country is required!')
    .matches(firstCapitalLetter, 'Wrong country name!')
    .matches(onlyLettersRegEx, 'Name cannot contain numbers or symbols!'),
  // phoneNumber: yup
  //   .string('Wrong format!')
  //   .required('Phone Number is required!')
  //   .min(9, 'Phone number is too short!'),
});

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(true);
  const [modalState, setModal] = useState(false);
  const [reauthenticationResult, setReauthenticationResult] = useState(null);
  const [actionType, setActionType] = useState(null);

  const [countryPickerState, setCountryPickerState] = useState(false);
  const [countryValue, setCountryValue] = useState(null);

  const [contactInfoFormError, setContactInfoFormError] = useState('');
  const [accountFormError, setAccountFormError] = useState('');

  const valuesOrder = [
    'nick',
    'country',
    'whatsAppContact',
    'discordContact',
    'instagramContact',
  ];
  const initValues = [
    // userData.phoneNumber,
    userData.nick,
    // userData.address,
    // userData.postalCode,
    userData.country,
    userData.whatsAppContact,
    userData.discordContact,
    userData.instagramContact,
  ];
  const [outValues, setOutValues] = useState(null);

  useEffect(() => {
    const resolvePromises = async () => {
      setUserData(await fetchUserData());
      setCountryValue(userData.country);
      setLoading(false);
    };
    resolvePromises();
  }, []);

  useEffect(() => {
    const resolvePromises = async () => {
      if (reauthenticationResult) {
        if (actionType == 'deleteAccount') {
          console.log('deleting account i elo');
          await deleteAccount();
        }
        if (actionType == 'resetPassword') {
          await resetPassword();
        }
        if (actionType == 'changeEmail') {
          await changeEmail();
        }
        if (actionType == null) {
          await updateUserData(initValues, outValues, valuesOrder);
        }

        setModal(false);
        setActionType(null);
        setReauthenticationResult(false);
      }
    };
    resolvePromises();
  }, [reauthenticationResult]);

  if (loading) {
    return null;
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
        <View
          style={{
            backgroundColor: '#1b1b1b',
            marginTop: 16,
            marginLeft: 12,
            marginBottom: 4,
          }}>
          <Text style={{ color: '#f4f4f4', fontWeight: '700', fontSize: 22 }}>
            Account
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#121212',
          }}>
          <Formik
            initialValues={{
              nick: userData.nick,
              country: userData.country,
            }}
            validationSchema={reviewSchema}
            onSubmit={async (values, actions) => {
              setOutValues([
                values.nick,
                countryValue ? countryValue : userData.country,
                userData.whatsAppContact,
                userData.discordContact,
                userData.instagramContact,
              ]);
              const detectChanges = () => {
                let change = false;
                [
                  values.nick,
                  countryValue ? countryValue : userData.country,
                  userData.whatsAppContact,
                  userData.discordContact,
                  userData.instagramContact,
                ].forEach((item, index) => {
                  if (item !== initValues[index]) {
                    change = true;
                  }
                });
                if (change) {
                  setAccountFormError('');
                  return true;
                }
                setAccountFormError('No change detected');
              };

              if (detectChanges()) {
                setModal(true);
              }
            }}
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              marginVertical: 40,
              backgroundColor: '#121212',
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
                  value={props.values.nick}
                  onChangeText={props.handleChange('nick')}
                  label='Nick'
                  outlineColor={'#5c5c5c'}
                  error={props.touched.nick && props.errors.nick ? true : false}
                  style={{
                    width: '80%',
                    backgroundColor: '#121212',
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
                    mode={'outlined'}
                    value={countryValue ? countryValue : userData.country}
                    onChangeText={props.handleChange('country')}
                    label='Country'
                    outlineColor={'#5c5c5c'}
                    error={
                      props.touched.country && props.errors.country
                        ? true
                        : false
                    }
                    style={{
                      width: '100%',
                      backgroundColor: '#121212',
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
                </TouchableOpacity>

                <ErrorMessage component='div' name='country'>
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

                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row-reverse',
                    marginBottom: 20,
                    alignItems: 'center',
                  }}>
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
                  <Text
                    style={{
                      color: '#b40424',
                      fontWeight: '700',
                      marginBottom: -20,
                      marginRight: 16,
                    }}>
                    {accountFormError}
                  </Text>
                </View>
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',

                    borderTopWidth: 2,
                    borderColor: '#5c5c5c',
                  }}>
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
                    onPress={() => {
                      setActionType('changeEmail');
                      setModal(true);
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: '#121212',
                      }}>
                      Change Email
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: 30,
                      marginTop: 20,
                      marginRight: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',

                      backgroundColor: '#0082FF',
                      borderRadius: 3,
                      paddingHorizontal: 20,
                    }}
                    onPress={() => {
                      setActionType('resetPassword');
                      setModal(true);
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: '#121212',
                      }}>
                      Reset Password
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row-reverse',
                    marginBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
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
                    onPress={() => {
                      setActionType('deleteAccount');
                      setModal(true);
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: '#121212',
                      }}>
                      Delete Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
        <View
          style={{
            backgroundColor: '#1b1b1b',
            marginTop: 16,
            marginLeft: 12,
            marginBottom: 4,
          }}>
          <Text style={{ color: '#f4f4f4', fontWeight: '700', fontSize: 22 }}>
            Contact Info for Buyers
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#121212',
          }}>
          <Formik
            initialValues={{
              whatsAppContact: userData.whatsAppContact,
              instagramContact: userData.instagramContact,
              discordContact: userData.discordContact,
            }}
            onSubmit={async (values, actions) => {
              setOutValues([
                // userData.phoneNumber,
                userData.nick,
                // userData.address,
                // userData.postalCode,
                userData.country,
                values.whatsAppContact,
                values.instagramContact,
                values.discordContact,
              ]);

              const detectChanges = () => {
                let change = false;
                [
                  // userData.phoneNumber,
                  userData.nick,
                  // userData.address,
                  // userData.postalCode,
                  userData.country,
                  values.whatsAppContact,
                  values.instagramContact,
                  values.discordContact,
                ].forEach((item, index) => {
                  if (item !== initValues[index]) {
                    change = true;
                  }
                });
                if (change) {
                  setContactInfoFormError('');
                  return true;
                }
                setContactInfoFormError('No change detected');
              };

              if (detectChanges()) {
                setModal(true);
              }
            }}
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              marginVertical: 40,
              backgroundColor: '#121212',
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
                  value={props.values.whatsAppContact}
                  onChangeText={props.handleChange('whatsAppContact')}
                  label='WhatsApp Contact'
                  outlineColor={'#5c5c5c'}
                  error={
                    props.touched.whatsAppContact &&
                    props.errors.whatsAppContact
                      ? true
                      : false
                  }
                  style={{
                    width: '80%',
                    backgroundColor: '#121212',
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
                <ErrorMessage component='div' name='whatsAppContact'>
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
                <TextInput
                  mode={'outlined'}
                  value={props.values.discordContact}
                  onChangeText={props.handleChange('discordContact')}
                  label='Discord Contact'
                  outlineColor={'#5c5c5c'}
                  error={
                    props.touched.discordContact && props.errors.discordContact
                      ? true
                      : false
                  }
                  style={{
                    width: '80%',
                    backgroundColor: '#121212',
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
                <ErrorMessage component='div' name='discordContact'>
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
                <TextInput
                  mode={'outlined'}
                  value={props.values.instagramContact}
                  onChangeText={props.handleChange('instagramContact')}
                  label='Instagram Contact'
                  outlineColor={'#5c5c5c'}
                  error={
                    props.touched.instagramContact &&
                    props.errors.instagramContact
                      ? true
                      : false
                  }
                  style={{
                    width: '80%',
                    backgroundColor: '#121212',
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
                <ErrorMessage component='div' name='instagramContact'>
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
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row-reverse',
                    marginBottom: 20,
                    alignItems: 'center',
                  }}>
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
                  <Text
                    style={{
                      color: '#b40424',
                      fontWeight: '700',
                      marginBottom: -20,
                      marginRight: 16,
                    }}>
                    {contactInfoFormError}
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </View>
        <View
          style={{
            backgroundColor: '#1b1b1b',
            marginTop: 16,
            marginLeft: 12,
            marginBottom: 4,
          }}>
          <Text style={{ color: '#f4f4f4', fontWeight: '700', fontSize: 22 }}>
            About
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#121212',
          }}></View>
      </ScrollView>
    );
  }
}

//!Instagram, Whatsapp, Discord
