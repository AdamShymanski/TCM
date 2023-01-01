import React, { useEffect, useState } from "react";

import ImageViewer from "react-native-image-zoom-viewer";
import { View, Image, Text, TouchableOpacity, Modal } from "react-native";

import { fetchDefaultCardsDetails } from "../../authContext";

import { useNavigation } from "@react-navigation/native";

export default function SearchResultCard({ props }) {
  const [imageViewerState, setImageViewer] = useState(false);
  const [details, setDetails] = useState([0, 0, 0]);

  const navigation = useNavigation();

  const renderNumber = () => {
    let firstSegment;
    let secondSegment;
    if (props.number < 9) {
      firstSegment = "00" + props.number;
    } else if (props.number < 99) {
      firstSegment = "0" + props.number;
    } else {
      firstSegment = props.number;
    }
    if (props.set.printedTotal < 9) {
      secondSegment = "00" + props.set.printedTotal;
    } else if (props.set.printedTotal < 99) {
      secondSegment = "0" + props.set.printedTotal;
    } else {
      secondSegment = props.set.printedTotal;
    }

    return `#${firstSegment}/${secondSegment}`;
  };
  useEffect(() => {
    let mounted = true;
    const resolvePromises = async () => {
      await fetchDefaultCardsDetails(props.id, setDetails, mounted);
    };
    resolvePromises();
    return () => (mounted = false);
  }, []);

  return (
    <View
      style={{
        flexDirection: "column",
        width: "96%",
        marginLeft: "2%",
      }}
    >
      <Modal
        visible={imageViewerState}
        transparent={true}
        style={{ flex: 1 }}
        animationType={"slide"}
      >
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
          backgroundColor={"#1b1b1b"}
          enableSwipeDown={true}
          renderHeader={() => (
            <View
              style={{
                width: "100%",
                height: 66,
                flexDirection: "row",
                backgroundColor: "#121212",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 3,
                  marginLeft: 12,
                  marginTop: 12,
                  height: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#777777",
                  paddingHorizontal: 12,
                }}
                onPress={() => setImageViewer(false)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#777777",
                  }}
                >
                  {"Go back"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </Modal>

      <TouchableOpacity
        style={{
          width: "100%",

          backgroundColor: "#121212",
          borderRadius: 8,

          flexDirection: "row",
          // alignItems: "center",

          marginVertical: 8,
          paddingHorizontal: 12,
          paddingVertical: 9,
        }}
        disabled={details[0] === 0 ? true : false}
        onPress={() => {
          navigation.navigate("SearchOffers", {
            id: props.id,
          });
        }}
      >
        <TouchableOpacity
          // style={{
          //   width: "20%",
          //   height: undefined,
          //   aspectRatio: 6.3 / 8.8,
          // }}
          style={{
            width: "22%",
            justifyContent: "center",
          }}
          onPress={() => {
            setImageViewer(true);
          }}
        >
          <Image
            source={{ uri: props.images.small }}
            style={{
              aspectRatio: 6.3 / 8.8,
              width: "100%",
              height: undefined,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 12,
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 15,
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            {props.name}
          </Text>

          <View style={{ flexDirection: "row", marginLeft: 4 }}>
            <Text
              style={{
                fontSize: 13,
                color: "#5c5c5c",
                textAlign: "center",
              }}
            >
              {props.set.name}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginLeft: 4 }}>
            <Text
              style={{
                fontSize: 13,
                color: "#5c5c5c",
                textAlign: "center",
              }}
            >
              {`${props.rarity} • ${renderNumber()}`}
            </Text>
          </View>

          {details[0] === 0 ? (
            <Text
              style={{
                color: "#FF0000",
                fontWeight: "700",
                marginTop: 6,
                fontSize: 11,
              }}
            >
              Out Of Stock
            </Text>
          ) : (
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <View style={{ flexDirection: "row", marginTop: 6 }}>
                <Text
                  style={{
                    color: "#585858",
                    fontFamily: "Roboto_Medium",
                    fontSize: 13,
                  }}
                >
                  Quantity
                </Text>
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontFamily: "Roboto_Medium",
                    fontSize: 13,
                    marginLeft: 4,
                  }}
                >
                  {/* {details[0] === 0 ? (
                <Text style={{ color: "#FF0000" }}>Out Of Stock</Text>
              ) : (
                details[0]
              )} */}
                  {`${details[0]}`}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 3 }}>
                <Text
                  style={{
                    color: "#585858",
                    fontFamily: "Roboto_Medium",
                    fontSize: 13,
                  }}
                >
                  Price Range
                </Text>
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontFamily: "Roboto_Medium",
                    fontSize: 13,
                    marginLeft: 4,
                  }}
                >
                  {details[1].toFixed(2)}
                  <Text style={{ color: "#585858" }}> {" / "}</Text>
                  {/* {" / "} */}
                  {details[2].toFixed(2)}
                  <Text style={{ color: "#0082ff" }}> USD</Text>
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
