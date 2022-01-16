import React, { useState, useEffect } from "react";

import { View, TouchableOpacity, Text } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

import { requestApi } from "../authContext";

export default function StripeCheckout() {
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const fetchPaymentSheetParams = async () => {
    let reqResult = { data: "a" };
    requestApi();

    const { paymentIntent, ephemeralKey, customer } = reqResult.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
    });
    if (!error) {
      setLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      console.log("Success", "Your order is confirmed!");
    }
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#997523",
          //#ffc43c default background color
          width: "100%",
          paddingVertical: 8,
          alignItems: "center",
          borderRadius: 5,
        }}
        onPress={() => requestApi()}
      >
        <Text>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}
