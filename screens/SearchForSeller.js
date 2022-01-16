import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { TextInput } from "react-native-paper";
import { Formik, ErrorMessage } from "formik";

import * as yup from "yup";

import { auth, db } from "../authContext";

import { useNavigation } from "@react-navigation/native";

export default function SearchForSeller() {
  const reviewSchema = yup.object({
    sellerId: yup.string("Wrong ID!").required("Wrong ID!"),
  });

  const navigation = useNavigation();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#1b1b1b",
      }}
    >
      <View
        style={{
          backgroundColor: "#121212",

          width: "90%",

          borderRadius: 8,
          padding: 16,
        }}
      >
        <Text style={{ color: "#f4f4f4", fontWeight: "700", fontSize: 20 }}>
          Search for a Seller
        </Text>
        <Formik
          initialValues={{
            sellerId: "",
          }}
          validationSchema={reviewSchema}
          onSubmit={async (values, actions) => {
            //set error if value is uid

            if (values.sellerId === auth.currentUser.uid) {
              actions.setFieldError(
                "sellerId",
                "You can't search for yourself!"
              );
            }

            db.collection("users")
              .doc(values.sellerId)
              .get()
              .then(async (doc) => {
                if (doc.exists) {
                  navigation.navigate("SellerProfile", {
                    sellerId: values.sellerId,
                  });
                } else {
                  actions.setFieldError(
                    "sellerId",
                    "Seller not found! Please try again."
                  );
                }
              });
          }}
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {(props) => (
            <View>
              <TextInput
                mode={"outlined"}
                value={props.values.sellerId}
                onChangeText={props.handleChange("sellerId")}
                label="> Enter seller ID <"
                outlineColor={"#5c5c5c"}
                error={
                  props.touched.sellerId && props.errors.sellerId ? true : false
                }
                style={{
                  width: "80%",
                  backgroundColor: "#121212",
                  color: "#f4f4f4",
                  marginTop: 20,
                }}
                theme={{
                  colors: {
                    primary: "#0082ff",
                    placeholder: "#5c5c5c",
                    background: "transparent",
                    text: "#f4f4f4",
                  },
                }}
              />

              <ErrorMessage component="div" name="sellerId">
                {(msg) => (
                  <Text
                    style={{
                      width: "70%",
                      marginTop: 8,
                      marginBottom: 2,

                      flexDirection: "row",
                      justifyContent: "flex-end",
                      color: "#b40424",
                      fontWeight: "700",
                    }}
                  >
                    {msg}
                  </Text>
                )}
              </ErrorMessage>

              <TouchableOpacity
                style={{
                  height: 30,
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "#0082FF",
                  borderRadius: 3,
                  paddingHorizontal: 20,
                }}
                onPress={props.submitForm}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#121212",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
