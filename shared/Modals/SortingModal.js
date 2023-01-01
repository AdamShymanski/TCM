import React from "react";
import { View, Text, Modal, TouchableOpacity, FlatList } from "react-native";

export default function SortingModal({ setSorting, setVisible }) {
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
          setVisible(false);
        }}
      >
        <View
          style={{
            width: "80%",

            backgroundColor: "#121212",
            borderRadius: 8,
            paddingVertical: 10,
          }}
        >
          <FlatList
            style={{
              paddingHorizontal: 8,
            }}
            data={["Rarity Ascending", "Rarity Declining"]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    width: "100%",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    paddingVertical: 15,
                  }}
                  onPress={() => {
                    setVisible(false);
                    setSorting(item);
                  }}
                >
                  <View
                    style={{
                      width: "70%",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#f4f4f4",
                        fontWeight: "700",
                        fontSize: 16,
                      }}
                    >
                      {item}
                    </Text>
                    <MaterialIcons
                      name={
                        item.split(" ")[1] === "Ascending"
                          ? "keyboard-arrow-up"
                          : "keyboard-arrow-down"
                      }
                      size={30}
                      color={
                        item.split(" ")[1] === "Ascending"
                          ? "#03fc07"
                          : "#ff0000"
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
