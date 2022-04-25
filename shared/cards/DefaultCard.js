import React, { useEffect, useState } from "react";

import ImageViewer from "react-native-image-zoom-viewer";
import { View, Image, Text, TouchableOpacity, Modal } from "react-native";

import inStock from "../../assets/in_stock.png";
import tag_arrow_up from "../../assets/tag_arrow_up.png";
import tag_arrow_down from "../../assets/tag_arrow_down.png";

import bluePricetag from "../../assets/blue_pricetag.png";

import { fetchDefaultCardsDetails } from "../../authContext";

import IconMI from "react-native-vector-icons/MaterialIcons";

export default function DefaultCard({ props, setId, setProps }) {
  const [imageViewerState, setImageViewer] = useState(false);
  const [details, setDetails] = useState([0, 0, 0]);

  useEffect(() => {
    let mounted = true;
    const resolvePromises = async () => {
      await fetchDefaultCardsDetails(props.id, setDetails, mounted);
    };
    resolvePromises();
    return () => (mounted = false);
  }, []);

  const returnFontSize = (string) => {
    if (string.length > 20) {
      return 10;
    } else if (string.length > 14) {
      return 13;
    } else {
      return 18;
    }
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
            aspectRatio: 1 / 1.31,
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
          {details[0] === 0 ? (
            <View
              style={{
                marginTop: "20%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,

                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: "#4a1010",

                alignSelf: "center",
              }}
            >
              {/* <Text
                style={{
                  fontWeight: "700",
                  color: "#C31313",
                  fontSize: 14,
                }}
              >
                OUT OF STOCK
              </Text> */}

              <IconMI name="remove-shopping-cart" size={32} color="#C31313" />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                width: "76%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginTop: 12,
                }}
              >
                <Image
                  source={inStock}
                  style={{
                    width: 16,
                    height: undefined,
                    aspectRatio: 22 / 21.1,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{ fontWeight: "700", fontSize: 12, color: "#f4f4f4" }}
                >
                  {details[0]}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <Image
                    source={tag_arrow_down}
                    style={{ width: 14, height: 14, marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 12,
                      color: "#f4f4f4",
                    }}
                  >
                    {details[2].toFixed(2)}{" "}
                    <Text style={{ color: "#CDCDCD" }}> USD</Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <Image
                    source={tag_arrow_up}
                    style={{ width: 14, height: 14, marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 12,
                      color: "#f4f4f4",
                    }}
                  >
                    {details[1].toFixed(2)}{" "}
                    <Text style={{ color: "#CDCDCD" }}> USD</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {details[0] === 0 ? null : (
            <TouchableOpacity
              style={{
                width: "80%",

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: details[0] !== 0 ? "#0082FF" : "#00315e",
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
                    loadingState: true,
                  }));
                }
              }}
            >
              <Text
                style={{ fontWeight: "700", fontSize: 15, color: "#121212" }}
              >
                Select
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
