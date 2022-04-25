import React, { useEffect } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

import { deleteCard } from "../../authContext";

export default function DeleteCardModal({ setModal, id }) {
  return (
    <Modal
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      transparent={true}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          setModal(null);
        }}
      >
        <View
          style={{
            width: "87%",

            backgroundColor: "#121212",
            borderRadius: 8,
            paddingVertical: 18,
            paddingHorizontal: 18,
          }}
        >
          <Text style={{ color: "#f4f4f4", fontSize: 26, fontWeight: "700" }}>
            Are you sure?
          </Text>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              width: "90%",
              marginTop: 10,
            }}
          >
            If you choose to delete this card, you will not be able to recover
            the lost data later.
          </Text>
          <View style={{ flexDirection: "row-reverse", marginTop: 32 }}>
            <TouchableOpacity
              style={{
                width: 84,
                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#0082FF",
                borderRadius: 3,
              }}
              onPress={async () => {
                await deleteCard(id);
                setModal(false);
              }}
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
            <TouchableOpacity
              style={{
                width: 76,
                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "transparent",
                borderRadius: 3,
                borderColor: "#5c5c5c",
                borderWidth: 2,

                marginRight: 22,
              }}
              onPress={() => {
                setModal(false);
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#5c5c5c",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
