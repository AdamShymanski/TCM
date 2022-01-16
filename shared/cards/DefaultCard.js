import React, { useEffect, useState } from "react";

import ImageViewer from "react-native-image-zoom-viewer";
import { View, Image, Text, TouchableOpacity, Modal } from "react-native";

import inStock from "../../assets/in_stock.png";
import bluePricetag from "../../assets/blue_pricetag.png";

import { fetchBigCardsDetails } from "../../authContext";

export default function DefaultCard({ props, setId, setProps }) {
  const [imageViewerState, setImageViewer] = useState(false);
  const [details, setDetails] = useState([0, 0, 0]);

  useEffect(() => {
    return fetchBigCardsDetails(props.id, setDetails);
  }, []);

  const returnFontSize = (string) => {
    if (string.length > 20) {
      return 10;
    }
    if (string.length > 14) {
      return 13;
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
            aspectRatio: 1 / 1.22,
            backgroundColor: "#121212",
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "60%",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  style={{ fontWeight: '600', fontSize: 10, color: '#696969' }}>
                  from
                </Text>
                <Text
                  style={{ fontWeight: "700", color: "#f4f4f4", fontSize: 12 }}
                >
                  {details[2]}
                </Text>
                <Text
                  style={{ fontWeight: '600', fontSize: 10, color: '#696969' }}>
                  to
                </Text>
                <Text
                  style={{ fontWeight: "700", color: "#f4f4f4", fontSize: 12 }}
                >
                  {details[1]} USD
                </Text>
              </View>
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
              if (details[0] !== 0) {
                setId(props.id);
                setProps((prevProps) => ({
                  ...prevProps,
                  screen: "offers",
                }));
              }
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 15, color: "#121212" }}>
              Select
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
