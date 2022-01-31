import React, { useState, useEffect } from "react";

import { View, TouchableOpacity, Text } from "react-native";
// import { useStripe } from "@stripe/stripe-react-native";

import { functions } from "../authContext";

export default function StripeCheckout() {
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resolvePromise = async () => {
      const query = functions.httpsCallable("paymentSheet");
      let result = await query();
      // initializePaymentSheet(result.data);
    };

    resolvePromise();
  }, []);

  // const initializePaymentSheet = async (data) => {
  //   const { paymentIntent, ephemeralKey, customer, publishableKey } = data;

  //   const { error } = await initPaymentSheet({
  //     customerId: customer,
  //     customerEphemeralKeySecret: ephemeralKey,
  //     paymentIntentClientSecret: paymentIntent,
  //     // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
  //     //methods that complete payment after a delay, like SEPA Debit and Sofort.
  //     allowsDelayedPaymentMethods: true,
  //   });
  //   if (!error) {
  //     setLoading(true);
  //   }
  // };
  // const openPaymentSheet = async () => {
  //   const { error } = await presentPaymentSheet();

  //   if (error) {
  //     console.log(`Error code: ${error.code}`, error.message);
  //   } else {
  //     console.log("Success", "Your order is confirmed!");
  //   }
  // };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity
        style={{ width: "80%", height: 20, backgroundColor: "#0082ff" }}
        onPress={openPaymentSheet}
      >
        <Text>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}
