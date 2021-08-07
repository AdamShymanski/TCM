import React, { useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { TextInput } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';

import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';
import * as yup from 'yup';

import { Switch } from 'react-native-paper';

import globalState from '../global.js';

const reviewSchema = yup.object({
  // fullName: yup
  //   .string('Wrong format!')
  //   .required('Name is required!')
  //   .min(4, 'Name must be longer then 4 charts!')
  //   .matches(onlyLettersRegEx, 'Name cannot contain numbers or symbols!'),
  cardNumber: yup
    .string('Wrong format!')
    .email('Email is invalid!')
    .required('Email is required!'),
  price: yup
    .string('Wrong format!')
    .required('Password is required!')
    .min(7, 'Password must be longer then 7 charts!'),
});

export default function AddCard() {
  const [gradingSwitch, setGrading] = useState(true);
  const [photoState, setPhoto] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [organizationName, setOrganizationName] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [gradingScore, setGradingScore] = useState('');

  console.log(globalState.userObject);
  console.log(globalState.userData);
  console.log(globalState.globalData);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1b1b1b', padding: 20 }}>
      {/* <Text style={{ fontWeight: '700', color: '#5c5c5c', marginBottom: 20 }}>
        {'* - Required Field'}
      </Text> */}
      <View>
        <TouchableOpacity
          style={{
            borderRadius: 4,
            marginRight: 16,

            height: 36,
            width: 230,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0082FF',
          }}
          // onPress={}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#121212',
            }}>
            Add photos of the card
          </Text>
          <IconMI
            name={'camera-image'}
            size={22}
            color='#121212'
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {photoState !== 1 || 2 ? (
          <View
            style={{
              aspectRatio: 193 / 270,
              height: 140,
              width: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: '#5c5c5c',
              borderStyle: 'dashed',
              marginTop: 20,
              marginRight: 20,
            }}
          />
        ) : null}
        {photoState !== 2 ? (
          <View
            style={{
              aspectRatio: 193 / 270,
              height: 140,
              width: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: '#5c5c5c',
              borderStyle: 'dashed',
              marginTop: 20,
              marginRight: 20,
            }}
          />
        ) : null}
        {photoState !== 3 ? (
          <View
            style={{
              aspectRatio: 193 / 270,
              height: 140,
              width: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: '#5c5c5c',
              borderStyle: 'dashed',
              marginTop: 20,
            }}
          />
        ) : null}
      </View>
      <Formik
        initialValues={{
          cardNumber: '',
          price: '',
        }}
        validationSchema={reviewSchema}
        onSubmit={(values, actions) => {
          // actions.resetForm();
          // addReview(values);

          console.log(values);
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
              alignItems: 'flex-start',
              width: '100%',
            }}>
            <TextInput
              mode={'outlined'}
              value={props.values.cardNumber}
              onChangeText={props.handleChange('cardNumber')}
              label='Card Number (e.g. 155/128)'
              outlineColor={'#5c5c5c'}
              error={
                props.touched.cardNumber && props.errors.cardNumber
                  ? true
                  : false
              }
              style={{
                width: '85%',
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
            <TextInput
              mode={'outlined'}
              value={props.values.price}
              onChangeText={props.handleChange('price')}
              label='Price'
              outlineColor={'#5c5c5c'}
              error={props.touched.price && props.errors.price ? true : false}
              style={{
                width: '85%',
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
            <Text
              style={{
                fontSize: 13,
                color: '#4c4c4c',
                width: '90%',
                marginTop: 10,
              }}>
              At this stage you're only adding card to your collection. Later
              you'll can sell it or exchange.
            </Text>
          </View>
        )}
      </Formik>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 40,
          }}>
          <Text
            style={{
              flexDirection: 'row',

              color: '#f4f4f4',
              fontWeight: '700',
              fontSize: 20,
              marginRight: 10,
            }}>
            Grading of Card
          </Text>
          <Switch
            value={gradingSwitch}
            color={'#0082ff'}
            onValueChange={() => setGrading(!gradingSwitch)}
          />
        </View>
        {/* <Text
          style={{
            color: !gradingSwitch ? '#858585' : '#f4f4f4',
            fontWeight: '700',
            fontSize: 20,
            marginTop: 20,
            marginBottom: 8,
          }}>
          Grading Score{'   '}
          <Text
            style={{
              color: !gradingSwitch ? '#858585' : '#0082ff',
              fontWeight: '700',
              fontSize: 20,
            }}>
            {sliderValue}
          </Text>
        </Text>
        <Slider
          style={{ height: 20 }}
          disabled={!gradingSwitch}
          minimumValue={1}
          maximumValue={10}
          width={'85%'}
          step={1}
          thumbTintColor={!gradingSwitch ? '#5c5c5c' : '#0082ff'}
          maximumTrackTintColor={!gradingSwitch ? '#5c5c5c' : '#121212'}
          minimumTrackTintColor={!gradingSwitch ? '#5c5c5c' : '#0082ff'}
          onValueChange={(value) => setSliderValue(value)}
        /> */}

        {gradingSwitch ? (
          <View style={{ width: '100%' }}>
            <TextInput
              mode={'outlined'}
              value={gradingScore}
              onChangeText={(gradingScore) => {
                setGradingScore(gradingScore);
              }}
              disabled={!gradingSwitch}
              label='Grading Score (e.g. 10 PRI or 8.5)'
              outlineColor={'#5c5c5c'}
              style={{
                width: '85%',
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
            <TextInput
              mode={'outlined'}
              value={organizationName}
              onChangeText={(organizationName) => {
                setOrganizationName(organizationName);
              }}
              disabled={!gradingSwitch}
              label='Grading Organization (e.g. PSA)'
              outlineColor={'#5c5c5c'}
              style={{
                width: '85%',
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
            <TextInput
              mode={'outlined'}
              value={certificateNumber}
              onChangeText={(certificateNumber) => {
                setCertificateNumber(certificateNumber);
              }}
              disabled={!gradingSwitch}
              label='Certificate Number'
              outlineColor={'#5c5c5c'}
              style={{
                width: '85%',
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
          </View>
        ) : null}
      </View>
      <View
        style={{
          width: '85%',
          flexDirection: 'row-reverse',
          marginBottom: 40,
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
          onPress={console.log()}>
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
    </ScrollView>
  );
}
