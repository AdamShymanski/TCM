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

  return (
    <View style={{ flexDirection: 'column', marginBottom: 30 }}>
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

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ width: '26%', height: undefined, aspectRatio: 6.3 / 8.8 }}
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
            marginLeft: 12,
            backgroundColor: '#121212',
            width: '70%',
            borderRadius: 4,
            padding: 12,
            paddingTop: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 3,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#f4f4f4',
              }}>
              {props.name}
            </Text>
            <View
              style={{
                backgroundColor: '#1b1b1b',
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginLeft: 10,
                borderRadius: 4,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#0082ff',
                }}>
                {props.number + ' / ' + props.set.printedTotal}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 22 }}>
            <Text style={{ flexDirection: 'row', color: '#f4f4f4' }}>
              Price <Text style={{ color: '#5c5c5c' }}> from </Text>
              <Text style={styles.text2}> ${details[2]}</Text>{' '}
              <Text style={{ color: '#5c5c5c' }}> up to </Text>
              <Text style={styles.text2}> ${details[1]}</Text>
            </Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text style={{ flexDirection: 'row', color: '#f4f4f4' }}>
              Offers Number : <Text style={styles.text2}> {details[0]}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={{ width: '100%', flexDirection: 'row-reverse' }}>
        <TouchableOpacity
          style={{
            width: 140,
            height: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',

            backgroundColor: '#0082FF',
            borderRadius: 3,

            marginTop: 12,
          }}
          onPress={() => {
            setId(props.id);
            closeModal();
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#121212',
            }}>
            Select this card
          </Text>
        </TouchableOpacity>
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
