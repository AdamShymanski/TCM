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
import MailObject from "../../../shared/Objects/MailObject";

export default function Mails() {
  return (
    <FlatList
      data={[1, 2, 3]}
      scrollEventThrottle={2000}
      renderItem={({ item, index }) => {
        if (index === 0) {
          return (
            <Text
              style={{
                fontSize: 12,
                color: "#A5A5A5",

                marginTop: 18,
                marginBottom: 6,
                paddingHorizontal: 28,
                textAlign: "center",
              }}
            >
              This page shows all emails which was sent to you by TCM, to make
              sure no one impersonates us
            </Text>
          );
        }
        return <MailObject />;
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
