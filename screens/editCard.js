import React, { useState, useEffect } from 'react';

import * as yup from 'yup';
import { Formik, ErrorMessage } from 'formik';

import { MaterialIcons } from '@expo/vector-icons';
import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Modal,
  TextInput as TextInputNative,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Switch, TextInput } from 'react-native-paper';

import CardAcp from '../shared/cards/cardAcp';
import { useNavigation } from '@react-navigation/native';
import { fetchBigCards, fetchMoreBigCards, updateCard } from '../authContext';

import pikachu from '../assets/pikachu.png';

import PickerModal from '../shared/pickerModal';

export default function EditCard({ route }) {
  const navigation = useNavigation();

  const reviewSchema = yup.object({
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
    description: yup
      .string('Wrong format!')
      .required('Description is required!')
      .max(60, 'Description is too long!'),
  });
  const reviewSchemaWithGrading = yup.object({
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
    description: yup
      .string('Wrong format!')
      .required('Description is required!')
      .max(60, 'Description is too long!'),
  });

  const ImagePlaceHolder = () => {
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
              source={{
                uri: photoState[0].url ? photoState[0].url : photoState[0].uri,
              }}
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
              source={{
                uri: photoState[1].url ? photoState[1].url : photoState[1].uri,
              }}
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
              source={{
                uri: photoState[2].url ? photoState[2].url : photoState[2].uri,
              }}
            />
          )}
        </View>
      );
    }
  };

  const [photoState, setPhoto] = useState(route.params.photosArray);
  const [gradingSwitch, setGrading] = useState(route.params.props.isGraded);

  const [modalState, setModal] = useState(false);
  const [scError, setScError] = useState(false);

  const [cardId, setId] = useState(route.params.props.cardId);
  const [pageNumber, setPageNumber] = useState(2);
  const [loadingState, setLoading] = useState(false);
  const [bigCardsData, setBigCardsData] = useState(null);

  const [nativeInputValue, setNativeInputValue] = useState('');
  const [inputPlaceholderState, setInputPlaceholder] = useState(
    'Number or Name of Card'
  );

  const [showFilters, setShowFiletrs] = useState(true);
  const [pickerValue, setPickerValue] = useState('Rarity Declining');
  const [pickerModal, setPickerModal] = useState(false);

  const searchForCard = async () => {
    setBigCardsData(
      await fetchBigCards(nativeInputValue, pickerValue, setLoading)
    );
    setPageNumber(2);
  };

  const stateHandler = (variant) => {
    if (variant == 'pikachu') {
      if (loadingState) return false;

      if (bigCardsData == null || undefined) {
        return true;
      } else if (bigCardsData.length < 1) {
        return true;
      }
      return false;
    }
    if (variant == 'list') {
      if (loadingState) {
        return false;
      } else if (bigCardsData == null || undefined) {
        return false;
      } else if (bigCardsData.length < 1) {
        return false;
      } else {
        return true;
      }
    }
    if (variant == 'indicator') {
      if (loadingState) return true;
      return false;
    }
  };

  const closeModal = () => {
    setModal(false);
    setNativeInputValue('');
    setBigCardsData(null);
    setPageNumber(2);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1b1b1b', padding: 20 }}>
      <PickerModal
        setValue={setPickerValue}
        propsArry={[
          // 'Price Ascending',
          // 'Price Declining',
          'Rarity Ascending',
          'Rarity Declining',
        ]}
        visible={pickerModal}
        setVisible={setPickerModal}
      />
      <Modal visible={modalState} animationType={'slide'}>
        <View style={{ flex: 1, backgroundColor: '#1b1b1b' }}>
          <View
            style={{
              backgroundColor: '#121212',
              height: 80,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                borderRadius: 3,
                marginLeft: 12,

                height: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#777777',
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              onPress={() => {
                closeModal();
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#777777',
                }}>
                {'Go back'}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
              <TextInputNative
                mode='outlined'
                placeholderTextColor={'#5c5c5c'}
                outlineColor={'#121212'}
                onEndEditing={() => {
                  searchForCard();
                }}
                value={nativeInputValue}
                onChangeText={(text) => setNativeInputValue(text)}
                placeholder={inputPlaceholderState}
                onFocus={() => setInputPlaceholder('')}
                onBlur={() => setInputPlaceholder('Number or Name of Card')}
                style={{
                  width: 260,
                  height: 40,
                  marginBottom: 5,
                  borderColor: '#121212',
                  backgroundColor: '#1b1b1b',
                  borderWidth: 2,
                  borderRadius: 5,
                  paddingLeft: 10,
                  color: '#f4f4f4',
                }}
              />
              <MaterialIcons
                name='search'
                size={24}
                color={'#f4f4f4'}
                style={{ position: 'absolute', right: 14 }}
              />
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#121212',
              height: showFilters ? null : 40,
              borderTopColor: '#5c5c5c',
              borderTopWidth: 1.5,
              marginBottom: 12,
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingBottom: 8,
              paddingTop: 8,
            }}>
            {showFilters ? (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 4,

                    marginLeft: 8,
                    marginTop: 4,

                    height: 32,
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1B1B1B',
                  }}
                  onPress={() => setPickerModal(true)}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: '#f4f4f4',
                    }}>
                    {' Sort by :  '}
                    <Text style={{ color: '#0082ff' }}>{pickerValue}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: showFilters ? 12 : null,
              }}>
              {showFilters ? (
                <IconMI
                  name={'arrow-up-drop-circle'}
                  color={'#0082ff'}
                  size={23}
                  onPress={() => {
                    setShowFiletrs(false);
                  }}
                />
              ) : (
                <IconMI
                  name={'arrow-down-drop-circle'}
                  color={'#0082ff'}
                  size={23}
                  onPress={() => {
                    setShowFiletrs(true);
                  }}
                />
              )}
            </View>
          </View>

          {stateHandler('pikachu') ? (
            <View
              style={{
                flex: 1,

                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 30,
              }}>
              <Image
                source={pikachu}
                style={{
                  aspectRatio: 651 / 522,
                  width: '80%',
                  height: undefined,
                }}
              />
              <Text
                style={{
                  color: '#434343',
                  fontSize: 20,
                  fontWeight: '600',
                  marginTop: 30,
                  fontWeight: '700',
                }}>
                {'No cards found '}
              </Text>
            </View>
          ) : null}

          {stateHandler('list') ? (
            <FlatList
              style={{ paddingHorizontal: 8 }}
              data={bigCardsData}
              renderItem={({ item }) => {
                return (
                  <CardAcp props={item} setId={setId} closeModal={closeModal} />
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={async () => {
                await fetchMoreBigCards(
                  nativeInputValue,
                  pickerValue,
                  pageNumber,
                  bigCardsData,
                  setBigCardsData
                );
                setPageNumber(pageNumber + 1);
              }}
              onEndReachedThreshold={4}
            />
          ) : null}

          {stateHandler('indicator') ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size='large' color='#0082ff' />
            </View>
          ) : null}
        </View>
      </Modal>
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
          price: route.params.props.price,
          grade: route.params.props.grade,
          gradingOrganization: route.params.props.gradingOrganization,
          certificateNumber: route.params.props.certificateNumber,
          condition: route.params.props.condition,
          description: route.params.props.description,
          languageVersion: route.params.props.languageVersion,
        }}
        validationSchema={
          gradingSwitch ? reviewSchemaWithGrading : reviewSchema
        }
        onSubmit={async (values, actions) => {
          const initValues = [
            route.params.props.price,
            route.params.props.grade,
            route.params.props.gradingOrganization,
            route.params.props.certificateNumber,
            route.params.props.condition,
            route.params.props.description,
            route.params.props.languageVersion,
            route.params.props.isGraded,
          ];
          const outValues = [
            values.price,
            values.grade,
            values.gradingOrganization,
            values.certificateNumber,
            values.condition,
            values.description,
            values.languageVersion,
            gradingSwitch,
          ];
          const valuesOrder = [
            'price',
            'grade',
            'gradingOrganization',
            'certificateNumber',
            'condition',
            'description',
            'languageVersion',
            'isGraded',
          ];

          const detectChanges = () => {
            let change = false;
            outValues.forEach((item, index) => {
              if (item !== initValues[index]) {
                change = true;
              }
            });
            if (change) {
              return true;
            }
          };
          
          if (detectChanges()) {
            await updateCard(
              route.params.props.id,
              outValues,
              initValues,
              valuesOrder
            );
            route.params.setModal(false);
            navigation.goBack();
          }
        }}>
        {(props) => (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <ImagePlaceHolder />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 4,

                  marginRight: 16,
                  marginTop: 16,

                  height: 36,
                  width: 160,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#0082FF',
                }}
                onPress={() => {
                  setModal(true);
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#121212',
                  }}>
                  Select Card
                </Text>
                <IconMI
                  name={'cards'}
                  size={22}
                  color='#121212'
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
              {cardId ? (
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 11,
                    marginTop: 6,
                    marginLeft: 6,
                    color: '#5c5c5c',
                  }}>
                  ID of seleceted Card:{' '}
                  <Text
                    style={{
                      color: '#0082FF',
                    }}>
                    {cardId}
                  </Text>
                </Text>
              ) : null}

              {scError && !cardId ? (
                <Text
                  style={{
                    color: '#b80424',
                    fontWeight: '700',
                    marginTop: 6,
                    marginLeft: 6,
                  }}>
                  You must select the card!
                </Text>
              ) : null}

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
                label='Short Description'
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
                onPress={() => {
                  props.submitForm();
                  if (!cardId) {
                    setScError(true);
                  }
                }}
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
