import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Clipboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from "react-native";

import { TextInput } from "react-native-paper";
import DisputeObject from "../../../shared/Objects/DisputeObject";

export default function Disputes() {
  return (
    <FlatList
      data={[1, 6, 3, 4, 5, 7]}
      scrollEventThrottle={2000}
      renderItem={({ item }) => {
        return <DisputeObject />;
      }}
      ListEmptyComponent={
        <View
          style={{
            width: "100%",
            height: 600,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0082ff" />
        </View>
      }
      onEndReachedThreshold={0.8}
      onEndReached={async ({ distanceFromEnd }) => {
        if (distanceFromEnd >= 0) {
          // setProps((prevState) => ({
          //   ...prevState,
          //   mroTimestamp:
          //     mostRecentOffers[mostRecentOffers.length - 1].timestamp,
          // }));
        }
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
