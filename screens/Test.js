import React, { useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import firebase from "firebase/compat/app";
import "firebase/compat/functions";

// import {
//   getFunctions,
//   httpsCallable,
//   connectFunctionsEmulator,
// } from "firebase/compat/functions";

import * as Sentry from "sentry-expo";

export default function Test() {
  let app;

  useEffect(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: "AIzaSyA0rTGml4Zi9yozBmgQ5k74jUMmWCxEE2I",
        authDomain: "ptcg-marketpla.firebaseapp.com",
        projectId: "ptcg-marketpla",
        storageBucket: "ptcg-marketpla.appspot.com",
        messagingSenderId: "442180761659",
        appId: "1:442180761659:web:d15b3d500793744982041e",
        measurementId: "G-1HB5T78SQS",
      });
    }

    Sentry.init({
      dsn: "https://6131440690cd436b8802bd5b1318e1a6@o1133377.ingest.sentry.io/6179878",
      enableInExpoDevelopment: true,
    });
  }, []);

  const requestApi = async () => {
    // const functions = getFunctions(app);
    const functions = firebase.functions();

    // connectFunctionsEmulator(functions, "192.168.0.104", 5001);
    functions.useEmulator("192.168.0.104", 5001);

    // const helloWorld = httpsCallable(functions, "helloWorld");
    const helloWorld = functions.httpsCallable("helloWorld");

    helloWorld()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error.message, error.code, error.details);
      });
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#0082ff",

          width: "88%",
          paddingVertical: 8,
          alignItems: "center",
          borderRadius: 5,
        }}
        onPress={() => requestApi()}
      >
        <Text>Test</Text>
      </TouchableOpacity>
    </View>
  );
}
