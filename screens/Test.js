import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { initializeApp } from "firebase/app";

const reqApi = () => {
  const app = initializeApp({
    apiKey: "AIzaSyA0rTGml4Zi9yozBmgQ5k74jUMmWCxEE2I",
    authDomain: "ptcg-marketpla.firebaseapp.com",
    projectId: "ptcg-marketpla",
    storageBucket: "ptcg-marketpla.appspot.com",
    messagingSenderId: "442180761659",
    appId: "1:442180761659:web:d15b3d500793744982041e",
    measurementId: "G-1HB5T78SQS",
  });

  const functions = getFunctions(app);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);

  const helloWorld = httpsCallable(functions, "helloWorld");
  helloWorld()
    .then((result) => {
      // Read result of the Cloud Function.
      /** @type {any} */

      console.log(result);
    })
    .catch((error) => {
      // Getting the Error details.
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.log(code, message, details);
      // ...
    });
};

export default function Test() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#997523",

          width: "100%",
          paddingVertical: 8,
          alignItems: "center",
          borderRadius: 5,
        }}
        onPress={() => reqApi()}
      >
        <Text>Test</Text>
      </TouchableOpacity>
    </View>
  );
}
