import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import * as ImageManipulator from "expo-image-manipulator";
import { ImageBrowser } from "expo-image-picker-multiple";

import { useNavigation } from "@react-navigation/native";

const ImageBrowserScreen = ({ route }) => {
  const navigation = useNavigation();

  let setPhoto = route.params.setPhoto;
  let photoState = route.params.photoState;

  const _getHeaderLoader = () => {
    <ActivityIndicator size="big" color={"#0082ff"} />;
  };

  const imagesCallback = (callback) => {
    navigation.setOptions({
      headerRight: () => _getHeaderLoader(),
    });

    callback
      .then(async (photos) => {
        const cPhotos = [];
        for (let photo of photos) {
          const pPhoto = await _processImageAsync(photo.uri);

          cPhotos.push({
            uri: pPhoto.uri,
            name: photo.filename,
            type: "image/jpg",
          });
        }
        setPhoto(cPhotos);
        navigation.goBack();
      })
      .catch((e) => console.log(e));
  };

  const _processImageAsync = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { height: 1600, width: 1200 } }],

      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };

  const _renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return (
      <TouchableOpacity
        style={{
          borderRadius: 3,
          marginRight: 12,

          height: 30,
          width: 80,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          backgroundColor: "#0082ff",
          borderColor: "#0082ff",
          paddingHorizontal: 12,
        }}
        onPress={onSubmit}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#121212",
          }}
        >
          {"Done"}
        </Text>
      </TouchableOpacity>
    );
  };

  const updateHandler = (count, onSubmit) => {
    navigation.setOptions({
      headerRight: () => _renderDoneButton(count, onSubmit),
    });
  };

  const renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  const emptyStayComponent = (
    <Text style={styles.emptyStay}>You don't have any pictures(</Text>
  );

  return (
    <View style={[styles.flex, styles.container]}>
      <ImageBrowser
        max={3}
        onChange={updateHandler}
        callback={imagesCallback}
        renderSelectedComponent={renderSelectedComponent}
        emptyStayComponent={emptyStayComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },
  container: {
    position: "relative",
  },
  emptyStay: {
    textAlign: "center",
  },
  countBadge: {
    paddingHorizontal: 10.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: "absolute",
    right: 3,
    bottom: 3,
    justifyContent: "center",
    backgroundColor: "#0580FF",
  },
  countBadgeText: {
    fontWeight: "bold",
    alignSelf: "center",
    padding: "auto",
    color: "#ffffff",
  },
});

export default ImageBrowserScreen;
