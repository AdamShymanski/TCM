import React, { useState, useEffect } from 'react';
import { globalStyles } from '../../styles/global';

import ImageViewer from 'react-native-image-zoom-viewer';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';

import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';

import language_icon from './../../assets/language.png';
import condition_icon from './../../assets/condition.png';

import grade_icon from './../../assets/grade.png';
import go_icon from './../../assets/gradingOrganization.png';
import cn_icon from './../../assets/CN.png';

import { fetchPhotos } from '../../authContext';

import { useNavigation } from '@react-navigation/native';

export function CardCollection({ props, setModal, setId }) {
  const condition = props.condition;
  const description = props.description;
  const price = props.price;
  const languageVersion = props.languageVersion;

  const isGraded = props.isGraded;
  const grade = props.grade;
  const gradingOrganization = props.gradingOrganization;
  const certificateNumber = props.certificateNumber;

  let cardPhotos = [];

  const [loadingState, setLoading] = useState(true);
  const [imageViewerState, setImageViewer] = useState(false);
  const [photosArray, setPhotosArray] = useState([
    {
      // Simplest usage.
      url: 'https://firebasestorage.googleapis.com/v0/b/ptcg-marketplace.appspot.com/o/global%2Fplacegolder.png?alt=media&token=ed9d1f9b-9a3b-4c82-b86f-132da3e75957',

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {},
    },
  ]);

  const navigation = useNavigation();

  useEffect(() => {
    const resolvePromises = async () => {
      cardPhotos = await fetchPhotos(props.id);
      setPhotosArray(fillPhotosArray(cardPhotos));

      setLoading(false);
    };

    resolvePromises();
  }, []);

  const fillPhotosArray = (array) => {
    let outArray = [];

    array.forEach((item) => {
      outArray.push({ url: item });
    });

    return outArray;
  };

  if (!loadingState) {
    return (
      <View style={styles.card}>
        <Modal visible={imageViewerState} transparent={true}>
          <ImageViewer
            imageUrls={photosArray}
            onSwipeDown={() => {
              setImageViewer(false);
            }}
            backgroundColor={'#1b1b1b'}
            enableSwipeDown={true}
            renderHeader={(currentIndex) => (
              <View
                style={{
                  width: '100%',
                  height: 66,
                  flexDirection: 'row',
                  backgroundColor: '#121212',
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
                  onPress={() => setImageViewer(false)}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#777777',
                    }}>
                    {'Go back'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </Modal>
        <View style={styles.cardContent}>
          <View style={stylesCard.body}>
            <TouchableOpacity
              onPress={() => {
                setImageViewer(true);
              }}>
              <Image
                style={{
                  width: 105,
                  height: 140,
                  marginLeft: 12,
                  borderRadius: 3,
                }}
                source={{ uri: photosArray[0].url }}
              />
            </TouchableOpacity>
            <View style={stylesCard.description}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {isGraded ? null : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 12,
                      marginRight: 6,
                      borderRadius: 3,
                      paddingHorizontal: 16,
                      backgroundColor: '#1b1b1b',
                    }}>
                    <Image
                      source={condition_icon}
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        color: '#f4f4f4',
                        fontWeight: '700',
                        fontSize: 16,
                      }}>
                      {condition}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                    marginBottom: 12,
                    borderRadius: 3,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: '#1b1b1b',
                  }}>
                  <Image
                    source={language_icon}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: '#f4f4f4',
                      fontWeight: '700',
                      fontSize: 16,
                    }}>
                    {languageVersion}
                  </Text>
                </View>
              </View>
              <View
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <View
                  style={{
                    padding: 6,
                    paddingHorizontal: 16,
                    flex: 1,

                    borderRadius: 3,
                    backgroundColor: '#1b1b1b',
                    width: 210,
                    height: 90,
                  }}>
                  <Text
                    style={{
                      color: '#ADADAD',
                      fontWeight: '500',
                      marginRight: 9,
                      flex: 1,
                      fontSize: 12,
                    }}>
                    {description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {isGraded ? (
            <View style={stylesCard.bottom}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#1b1b1b',
                  paddingHorizontal: 12,
                  borderRadius: 4,
                  marginRight: 8,
                }}>
                <Image
                  source={grade_icon}
                  style={{
                    aspectRatio: 1 / 1,
                    width: undefined,
                    height: 18,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    color: '#f4f4f4',
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  {grade}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#1b1b1b',
                  paddingHorizontal: 12,
                  borderRadius: 4,
                  marginRight: 8,
                }}>
                <Image
                  source={go_icon}
                  style={{
                    aspectRatio: 1 / 1,
                    width: undefined,
                    height: 18,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    color: '#f4f4f4',
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  {gradingOrganization}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#1b1b1b',
                  paddingHorizontal: 12,
                  borderRadius: 4,
                }}>
                <Image
                  source={cn_icon}
                  style={{
                    aspectRatio: 52 / 27,
                    width: undefined,
                    height: 12,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    color: '#f4f4f4',
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  {certificateNumber}
                </Text>
              </View>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#121212',

              borderBottomLeftRadius: 7,
              borderBottomRightRadius: 7,

              paddingVertical: 5,
              paddingHorizontal: 8,
              paddingBottom: 9,
            }}>
            <Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: '#121212',
                borderRadius: 4,
                color: '#f4f4f4',
                fontWeight: '700',
                fontSize: 18,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#0082ff', fontSize: 14 }}>
                {'Price    '}
              </Text>
              {price}
              <Text style={{ color: '#CDCDCD', fontSize: 14 }}>{'  USD'}</Text>
            </Text>

            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  width: 76,
                  height: 30,
                  marginRight: 10,

                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',

                  borderColor: '#5c5c5c',
                  borderRadius: 3,
                  borderWidth: 2,
                }}
                onPress={() => {
                  setModal(true);
                  setId(props.id);
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#5c5c5c',
                  }}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 76,
                  height: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',

                  backgroundColor: '#0082FF',
                  borderRadius: 3,

                  marginRight: 5,
                }}
                onPress={() =>
                  navigation.navigate('EditCard', {
                    props,
                    photosArray,
                    setModal,
                  })
                }>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#121212',
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    width: '90%',
    marginRight: '2%',
    marginLeft: '2.3%',
  },
  cardContent: {
    paddingVertical: 20,
  },
});

const stylesCard = StyleSheet.create({
  top: {
    position: 'relative',

    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 3,
    backgroundColor: '#121212',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#121212',
    paddingVertical: 12,

    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  description: {
    height: '100%',
    flex: 1,

    paddingLeft: 12,
    // paddingTop: 10,
    borderRadius: 5,
  },
  rightText: {
    color: '#0082ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  leftText: {
    color: '#f4f4f4',
    fontWeight: '400',
    fontSize: 16,
  },
  cardName: {
    color: '#f4f4f4',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 8,
  },
  bottom: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    height: 60,
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },
  profileParams: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
});
