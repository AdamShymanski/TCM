import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import { auth, storage } from "../../authContext";

import Icon from "react-native-vector-icons/Octicons";

export default function ChatBubble({ props, index }) {
  const [photoState, setPhotoState] = useState("loading");

  useEffect(() => {
    if (props.type == "image") {
      if (props.content) {
        setPhotoState(props.content);
      } else {
        fetchPhoto().then((result) => {
          setPhotoState(result);
        });
      }
    }
  }, []);

  const fetchPhoto = useCallback(async () => {
    const path = "chats/" + `${props.chatId}/`;
    const pathReference = storage.ref(path + props.id);

    const result = await pathReference.getDownloadURL();
    return result;
  }, [props]);

  if (props.sender !== auth.currentUser.uid) {
    if (props.type === "text") {
      return (
        <View
          style={{
            borderRadius: 6,
            borderBottomLeftRadius: 0,
            backgroundColor: "#353535",

            flexShrink: 1,
            marginVertical: 2,

            paddingVertical: 8,
            paddingHorizontal: 12,
            maxWidth: "80%",

            alignSelf: "flex-end",
          }}
        >
          <Text style={{ color: "#f4f4f4", flexWrap: "wrap" }}>
            {props.content}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          borderRadius: 6,
          borderBottomLeftRadius: 0,

          marginVertical: 2,

          paddingVertical: 8,
          paddingHorizontal: 12,

          alignSelf: "flex-end",

          backgroundColor: "#353535",
        }}
      >
        {photoState === "loading" ? (
          <ActivityIndicator color="#0082ff" size={30} />
        ) : (
          <Image
            style={{
              width: 105,
              height: 140,

              borderRadius: 3,
            }}
            source={{
              uri: photoState,
            }}
            // source={{
            //   uri: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2F1etzuug6yGljKAuQz5ry%2F0?alt=media&token=e894faa2-f992-420a-bdda-235931bb0423",
            // }}
          />
        )}
      </View>
    );
  } else {
    if (props.type === "text") {
      return (
        <View
          style={{
            borderRadius: 6,
            borderBottomRightRadius: 0,
            backgroundColor: "#003C75",

            flexShrink: 1,
            marginVertical: 2,

            marginRight: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
            maxWidth: "80%",

            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "#f4f4f4", flexWrap: "wrap" }}>
            {props.content}
          </Text>
        </View>
      );
    }
    return (
      <View
        style={{
          borderRadius: 6,
          borderBottomRightRadius: 0,
          backgroundColor: "#003C75",

          marginVertical: 2,

          marginRight: 8,
          paddingVertical: 8,
          paddingHorizontal: 12,

          alignSelf: "flex-start",
        }}
      >
        {photoState === "loading" ? (
          <ActivityIndicator color="#0082ff" size={30} />
        ) : (
          <Image
            style={{
              width: 105,
              height: 140,

              borderRadius: 3,
            }}
            source={{
              uri: photoState,
            }}
            // source={{
            //   uri: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2F1etzuug6yGljKAuQz5ry%2F0?alt=media&token=e894faa2-f992-420a-bdda-235931bb0423",
            // }}
          />
        )}
      </View>
    );
  }
}
