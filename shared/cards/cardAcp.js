import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import { fetchBigCardsDetails } from '../../authContext';

import bluePricetag from '../../assets/blue_pricetag.png';
import inStock from '../../assets/in_stock.png';

export default function CardAcp({ props, setId, closeModal }) {
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

  const [details, setDetails] = useState([0, 0, 0]);

  useEffect(() => {
    const resolvePromise = async () => {
      await fetchBigCardsDetails(props.id, setDetails);
    };
    resolvePromise();
  }, []);

  const returnFontSize = (string) => {
    if (string.length > 14) {
      return 13;
    }
    if (string.length > 16) {
      return 11;
    }
    return 18;
  };

  return (
    <View style={{ flexDirection: 'column', width: '50%' }}>
      <Modal
        visible={imageViewerState}
        transparent={true}
        style={{ flex: 1 }}
        animationType={'slide'}>
        <ImageViewer
          imageUrls={[
            {
              url: props.images.large,

              width: 358,
              height: 500,
              props: {},
            },
          ]}
          renderIndicator={() => null}
          onSwipeDown={() => {
            setImageViewer(false);
          }}
          backgroundColor={'#1b1b1b'}
          enableSwipeDown={true}
          renderHeader={() => (
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
                  marginTop: 12,

                  height: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#777777',
                  paddingHorizontal: 12,
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
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            width: '36%',
            height: undefined,
            aspectRatio: 6.3 / 8.8,
            zIndex: 2,
            bottom: -40,
          }}
          onPress={() => {
            setImageViewer(true);
          }}>
          <Image
            source={{ uri: props.images.small }}
            style={{
              aspectRatio: 6.3 / 8.8,
              width: '100%',
              height: undefined,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            width: '90%',
            height: undefined,
            aspectRatio: 1 / 1.2,
            backgroundColor: '#121212',
            borderRadius: 8,

            paddingTop: 58,
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: returnFontSize(props.name),
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: 8,
            }}>
            {props.name}
          </Text>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Image
                source={inStock}
                style={{
                  width: 21,
                  height: undefined,
                  aspectRatio: 22 / 21.1,
                  marginRight: 8,
                }}
              />
              <Text
                style={{ fontWeight: '700', fontSize: 14, color: '#f4f4f4' }}>
                {details[0]}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Image
                source={bluePricetag}
                style={{
                  width: 18,
                  height: undefined,
                  aspectRatio: 1 / 1,
                  marginRight: 8,
                }}
              />
              <Text
                style={{ fontWeight: '700', fontSize: 12, color: '#f4f4f4' }}>
                <Text
                  style={{ fontWeight: '600', fontSize: 10, color: '#696969' }}>
                  from
                </Text>{' '}
                {details[2]}{' '}
                <Text
                  style={{ fontWeight: '600', fontSize: 10, color: '#696969' }}>
                  to
                </Text>{' '}
                {details[1]} USD
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: '80%',

              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',

              backgroundColor: details[0] !== 0 ? '#0082FF' : '#00315e',
              borderRadius: 3,

              marginTop: 18,
              paddingVertical: 1.6,
            }}
            onPress={() => {
              setId(props.id);
            }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: '#121212' }}>
              Select
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text1: {
    fontWeight: '600',
    color: '#f4f4f4',
    marginBottom: 8,
  },
  box: {
    backgroundColor: '#1b1b1b',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  boxWrapper: {
    marginRight: 20,
  },
  text2: {
    fontWeight: '700',
    color: '#0082ff',
  },
});
