import React, { useState } from 'react';
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

import { register } from '../authContext';
import { CountryPickerModal } from '../shared/countryPickerModal';

// const strongPasswordRegEx =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&].{8,}$/;
const strongPasswordRegEx =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/;

// const strongPasswordRegEx =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{8,}$/;

// const onlyLettersRegEx =
//   /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
const firstCapitalLetter = /^[A-Z].*/;

const nickRegEx = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g;

const reviewSchema = yup.object({
  nick: yup
    .string('Wrong format!')
    .required('Name is required!')
    .min(4, 'Name must be longer then 4 charts!')
    .matches(nickRegEx, 'No special charts!'),
  email: yup
    .string('Wrong format!')
    .email('Email is invalid!')
    .required('Email is required!'),
  password: yup
    .string('Wrong format!')
    .required('Password is required!')
    .min(7, 'Password must be longer then 6 charts!')
    .matches(
      strongPasswordRegEx,
      'At least one number, capital & lower letter!'
    ),
  confirmPassword: yup.string().when('password', {
    is: (val) => (val && val.length > 0 ? true : false),
    then: yup
      .string()
      .oneOf([yup.ref('password')], "Passwords aren't the same! ")
      .required('Confirm Password is required!                  '),
  }),
  // address: yup.string('Wrong format!').required('Address is required!'),
  // postalCode: yup
  //   .string('Wrong format!')
  //   .required('Postal or Zip Code is required!'),
  country: yup
    .string('Wrong format!')
    .required('Country is required!')
    .matches(firstCapitalLetter, 'Wrong country name!'),
  // phoneNumber: yup
  //   .string('Wrong format!')
  //   .required('Phone Number is required!')
  //   .min(9, 'Phone number is too short!'),
});

export default function Register({ auth }) {
  const [countryPickerState, setCountryPickerState] = useState('');
  const [countryInputTouched, setCountryInputTouched] = useState(false);

  return (
    <ScrollView style={{ backgroundColor: '#1b1b1b', flex: 1 }}>
      <View style={{ alignItems: 'center', width: '100%' }}>
        <Text
          style={{
            fontWeight: '700',
            color: '#f4f4f4',
            fontSize: 46,
            marginTop: 40,

            marginBottom: 18,
          }}>
          Register
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
          {"Let's create your account! Fill all the field and submit the form."}
        </Text>
      </View>

      <Formik
        initialValues={{
          nick: '',
          country: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={reviewSchema}
        onSubmit={async (values, actions) => {
          await register(
            values.email,
            values.password,
            values.nick,
            values.country
          );
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
            {countryPickerState ? (
              <CountryPickerModal
                setValue={(value) => {
                  props.setFieldValue('country', value);
                }}
                setVisible={setCountryPickerState}
              />
            ) : null}
            <TextInput
              mode={'outlined'}
              value={props.values.nick}
              onChangeText={props.handleChange('nick')}
              label='Nick'
              outlineColor={'#5c5c5c'}
              error={props.touched.nick && props.errors.nick ? true : false}
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
            <ErrorMessage component='div' name='nick'>
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
              value={props.values.email}
              onChangeText={props.handleChange('email')}
              label='Email'
              outlineColor={'#5c5c5c'}
              error={props.touched.email && props.errors.email ? true : false}
              style={{
                width: '70%',
                backgroundColor: '#1b1b1b',
                color: '#f4f4f4',
                marginTop: props.touched.nick && props.errors.nick ? 0 : 20,
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
                marginTop: props.touched.email && props.errors.email ? 0 : 20,
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
            <TextInput
              mode={'outlined'}
              value={props.values.confirmPassword}
              secureTextEntry={true}
              onChangeText={props.handleChange('confirmPassword')}
              label='Confirm Password'
              outlineColor={'#5c5c5c'}
              error={
                props.touched.confirmPassword && props.errors.confirmPassword
                  ? true
                  : false
              }
              style={{
                width: '70%',
                backgroundColor: '#1b1b1b',
                color: '#f4f4f4',
                marginTop:
                  props.touched.password && props.errors.password ? 0 : 20,
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
            <ErrorMessage component='div' name='confirmPassword'>
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
                  {/* {props.values.confirmPassword == props.values.password
                    ? ''
                    : (msg = 'Passwords must match!')} */}
                </Text>
              )}
            </ErrorMessage>
            <TouchableOpacity
              style={{ width: '70%' }}
              onPress={() => {
                setCountryPickerState(true);
                setCountryInputTouched(true);
              }}>
              <TextInput
                mode={'outlined'}
                value={props.values.country}
                onChangeText={props.handleChange('country')}
                label='Country'
                outlineColor={
                  props.errors.country && countryInputTouched
                    ? '#b40424'
                    : '#5c5c5c'
                }
                style={{
                  width: '100%',
                  backgroundColor: '#1b1b1b',
                  marginTop:
                    props.errors.country && countryInputTouched ? 0 : 20,
                }}
                disabled={true}
                theme={{
                  colors: {
                    text: '#fff',
                    disabled:
                      props.errors.country && countryInputTouched
                        ? '#b40424'
                        : '#5c5c5c',
                    background: 'transparent',
                  },
                }}
              />
            </TouchableOpacity>
            <ErrorMessage component='div' name='country'>
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
            {/* <TextInput
              mode={'outlined'}
              value={props.values.phoneNumber}
              onChangeText={props.handleChange('phoneNumber')}
              label='Phone Number'
              outlineColor={'#5c5c5c'}
              error={
                props.touched.phoneNumber && props.errors.phoneNumber
                  ? true
                  : false
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
            <ErrorMessage component='div' name='phoneNumber'>
              {(msg) => (
                <Text
                  style={{
                    width: '70%',
                    marginTop: 8,
                    marginBottom: -10,
                    height: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    color: '#b40424',
                    fontWeight: '700',
                  }}>
                  {msg}
                </Text>
              )}
            </ErrorMessage> */}

            <View
              style={{
                width: '70%',
                flexDirection: 'row-reverse',
                marginBottom: 40,
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
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
