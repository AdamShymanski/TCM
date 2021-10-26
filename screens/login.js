import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import * as yup from 'yup';

import { TextInput } from 'react-native-paper';
import { login } from '../authContext';
import { Formik, ErrorMessage } from 'formik';

const reviewSchema = yup.object({
  email: yup
    .string('Wrong format!')
    .email('Email is invalid!')
    .required('Email is required!'),
  password: yup.string('Wrong format!').required('Password is required!'),
});

export default function Login() {
  const [error, setError] = useState('');

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
        onSubmit={(values, actions) => {
          login(values.email, values.password, setError);
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
    </ScrollView>
  );
}
