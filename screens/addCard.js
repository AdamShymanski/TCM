import React, { useState, useEffect } from 'react';

import * as yup from 'yup';
import { Formik, ErrorMessage } from 'formik';

import { Switch, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';

import { addCard } from '../authContext';

export default function AddCard() {
  const navigation = useNavigation();

  const reviewSchema = yup.object({
    cardNumber: yup
      .string('Wrong format!')
      .required('Card Number is required!')
      .min(7, 'Wrong format!')
      .max(7, 'Wrong format!'),
    price: yup
      .string('Wrong format!')
      .required('Price is required!')
      .max(10, 'Price is too long!'),
    condition: yup
      .string('Wrong format!')
      .required('Condition is required!')
      .max(2, 'Wrong format'),
    languageVersion: yup
      .string('Wrong format!')
      .required('Language Version is required!')
      .min(4, 'Wrong format'),
  });

  const reviewSchemaWithGrading = yup.object({
    cardNumber: yup
      .string('Wrong format!')
      .required('Card Number is required!')
      .min(7, 'Wrong format!')
      .max(7, 'Wrong format!'),
    price: yup
      .string('Wrong format!')
      .required('Price is required!')
      .max(10, 'Grading Organization is too long!'),
    languageVersion: yup
      .string('Wrong format!')
      .required('Language Version is required!')
      .min(4, 'Wrong format')
      .max(12, 'Wrong format'),
    grade: yup
      .string('Wrong format!')
      .required('Grading Score is required!')
      .max(8, 'Grading Score is too long!'),
    gradingOrganization: yup
      .string('Wrong format!')
      .required('Grading Organization is required!')
      .max(8, 'Grading Organization is too long!'),
    certificateNumber: yup
      .string('Wrong format!')
      .required('Certificate Number is required!')
      .max(40, 'Certificate Number is too long!'),
  });

  const [gradingSwitch, setGrading] = useState(true);
  const [photoState, setPhoto] = useState(null);

  // const uid = globalState.userObject.uid;

  const ImagePlaceHodler = () => {
    if (photoState === null || undefined) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              aspectRatio: 3 / 4,
              width: '28%',
              height: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: '#5c5c5c',
              borderStyle: 'dashed',
              marginTop: 20,
              marginRight: 20,
            }}
          />
          <View
            style={{
              aspectRatio: 3 / 4,
              width: '28%',
              height: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: '#5c5c5c',
              borderStyle: 'dashed',
              marginTop: 20,
              marginRight: 20,
            }}
          />
          <View
            style={{
              aspectRatio: 3 / 4,
              width: '28%',
              height: undefined,
              borderWidth: 2,
              borderRadius: 8,
              borderColor: '#5c5c5c',
              borderStyle: 'dashed',
              marginTop: 20,
            }}
          />
        </View>
      );
    }
    if (photoState !== null || undefined) {
      return (
        <View style={{ flexDirection: 'row' }}>
          {photoState[0] === undefined || null ? (
            <View
              style={{
                aspectRatio: 3 / 4,
                width: '28%',
                height: undefined,
                borderWidth: 2,
                borderRadius: 8,
                borderColor: '#5c5c5c',
                borderStyle: 'dashed',
                marginTop: 20,
                marginRight: 20,
              }}
            />
          ) : (
            <Image
              style={{
                aspectRatio: 3 / 4,
                width: '28%',
                height: undefined,
                marginTop: 20,
                marginRight: 20,
                borderRadius: 4,
              }}
              source={{ uri: photoState[0].uri }}
            />
          )}
          {photoState[1] === undefined || null ? (
            <View
              style={{
                aspectRatio: 3 / 4,
                width: '28%',
                height: undefined,
                borderWidth: 2,
                borderRadius: 8,
                borderColor: '#5c5c5c',
                borderStyle: 'dashed',
                marginTop: 20,
                marginRight: 20,
              }}
            />
          ) : (
            <Image
              style={{
                aspectRatio: 3 / 4,
                width: '28%',
                height: undefined,
                marginTop: 20,
                marginRight: 20,
                borderRadius: 4,
              }}
              source={{ uri: photoState[1].uri }}
            />
          )}
          {photoState[2] === undefined || null ? (
            <View
              style={{
                aspectRatio: 3 / 4,
                width: '28%',
                height: undefined,
                borderWidth: 2,
                borderRadius: 8,
                borderColor: '#5c5c5c',
                borderStyle: 'dashed',
                marginTop: 20,
              }}
            />
          ) : (
            <Image
              style={{
                aspectRatio: 3 / 4,
                width: '28%',
                height: undefined,
                marginTop: 20,
                marginRight: 20,
                borderRadius: 4,
              }}
              source={{ uri: photoState[2].uri }}
            />
          )}
        </View>
      );
    }
  };

  const submitForm = (values) => {
    if (photoState) {
      addCard(values, gradingSwitch, photoState);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1b1b1b', padding: 20 }}>
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
          onPress={() => {
            navigation.navigate('ImageBrowser', { photoState, setPhoto });
          }}>
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
        <Text
          style={{
            marginTop: 10,
            marginLeft: 12,
            fontSize: 14,
            fontWeight: '700',
            color: '#4c4c4c',
          }}>
          You must pick at least one photo
        </Text>
      </View>
      <Formik
        style={{ flex: 1 }}
        initialValues={{
          cardNumber: '',
          price: '',
          grade: '',
          gradingOrganization: '',
          certificateNumber: '',
          condition: '',
          description: '',
          languageVersion: '',
        }}
        validationSchema={
          gradingSwitch ? reviewSchemaWithGrading : reviewSchema
        }
        onSubmit={(values, actions) => {
          submitForm(values);
        }}>
        {(props) => (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <ImagePlaceHodler />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                marginTop: 20,
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
              <ErrorMessage component='div' name='cardNumber'>
                {(msg) => (
                  <Text
                    style={{
                      width: '70%',
                      marginTop: 8,
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
                value={props.values.price}
                onChangeText={props.handleChange('price')}
                label='Price ($)'
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
              <ErrorMessage component='div' name='price'>
                {(msg) => (
                  <Text
                    style={{
                      width: '70%',
                      marginTop: 8,
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
                value={props.values.languageVersion}
                onChangeText={props.handleChange('languageVersion')}
                label='Language Version'
                outlineColor={'#5c5c5c'}
                error={
                  props.touched.languageVersion && props.errors.languageVersion
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
              <ErrorMessage component='div' name='languageVersion'>
                {(msg) => (
                  <Text
                    style={{
                      width: '70%',
                      marginTop: 8,
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
                value={props.values.description}
                onChangeText={props.handleChange('description')}
                label='Short Description (not required)'
                outlineColor={'#5c5c5c'}
                error={
                  props.touched.description && props.errors.description
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
              <ErrorMessage component='div' name='description'>
                {(msg) => (
                  <Text
                    style={{
                      width: '70%',
                      marginTop: 8,
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
                value={props.values.condition}
                onChangeText={props.handleChange('condition')}
                label='Condition (from 1 to 10)'
                outlineColor={'#5c5c5c'}
                error={
                  props.touched.condition && props.errors.condition
                    ? true
                    : false
                }
                style={{
                  width: '85%',
                  backgroundColor: '#1b1b1b',
                  color: '#f4f4f4',
                  marginTop: 20,
                  display: gradingSwitch ? 'none' : 'flex',
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
              <ErrorMessage
                component='div'
                name='condition'
                style={{ display: gradingSwitch ? 'none' : 'flex' }}>
                {!gradingSwitch ? (
                  (msg) => (
                    <Text
                      style={{
                        width: '70%',
                        marginTop: 8,
                        height: 20,
                        marginBottom: 14,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        display: gradingSwitch ? 'none' : 'flex',
                        color: '#b40424',
                        fontWeight: '700',
                      }}>
                      {msg}
                    </Text>
                  )
                ) : (
                  <View />
                )}
              </ErrorMessage>
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

              {gradingSwitch ? (
                <View style={{ width: '100%' }}>
                  <TextInput
                    mode={'outlined'}
                    value={props.values.grade}
                    onChangeText={props.handleChange('grade')}
                    error={
                      props.touched.grade && props.errors.grade ? true : false
                    }
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
                  <ErrorMessage component='div' name='grade'>
                    {(msg) => (
                      <Text
                        style={{
                          width: '70%',
                          marginTop: 8,
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
                    value={props.values.gradingOrganization}
                    onChangeText={props.handleChange('gradingOrganization')}
                    error={
                      props.touched.gradingOrganization &&
                      props.errors.gradingOrganization
                        ? true
                        : false
                    }
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
                  <ErrorMessage component='div' name='gradingOrganization'>
                    {(msg) => (
                      <Text
                        style={{
                          width: '70%',
                          marginTop: 8,
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
                    value={props.values.certificateNumber}
                    onChangeText={props.handleChange('certificateNumber')}
                    error={
                      props.touched.certificateNumber &&
                      props.errors.certificateNumber
                        ? true
                        : false
                    }
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
                  <ErrorMessage component='div' name='certificateNumber'>
                    {(msg) => (
                      <Text
                        style={{
                          width: '70%',
                          marginTop: 8,
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
                onPress={props.submitForm}
                type={'submit'}>
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
