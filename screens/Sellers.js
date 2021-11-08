import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { TextInput } from 'react-native-paper';
import { Formik, ErrorMessage } from 'formik';

import * as yup from 'yup';

export default function Sellers() {
  const reviewSchema = yup.object({
    sellerId: yup
      .string('Wrong format!')
      .required('Name is required!')
      .min(4, 'Name must be longer then 4 charts!'),
  });

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#1b1b1b',
      }}>
      <View
        style={{
          backgroundColor: '#121212',
          aspectRatio: 1 / 0.4,
          width: '90%',
          height: undefined,
          borderRadius: 6,
          padding: 16,
        }}>
        <Text style={{ color: '#f4f4f4', fontWeight: '700', fontSize: 19 }}>
          Search for a Seller
        </Text>
        <Formik
          initialValues={{
            sellerId: '',
          }}
          validationSchema={reviewSchema}
          onSubmit={async (values, actions) => {}}
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          {(props) => (
            <View>
              <TextInput
                mode={'outlined'}
                value={props.values.sellerId}
                onChangeText={props.handleChange('nick')}
                label='Seller ID'
                outlineColor={'#5c5c5c'}
                error={
                  props.touched.sellerId && props.errors.sellerId ? true : false
                }
                style={{
                  width: '50%',
                  backgroundColor: '#121212',
                  color: '#f4f4f4',
                  marginTop: 14,
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
              <ErrorMessage component='div' name='sellerId'>
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
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
