import React, { useEffect } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

export const CountryPickerModal = ({ setValue, setVisible }) => {
  const countryCodes = [
    { Code: "AU", Name: "Australia" },
    { Code: "AT", Name: "Austria" },
    { Code: "BE", Name: "Belgium" },
    { Code: "BR", Name: "Brazil" },
    { Code: "CA", Name: "Canada" },
    { Code: "CY", Name: "Cyprus" },
    { Code: "CZ", Name: "Czech Republic" },
    { Code: "DK", Name: "Denmark" },
    { Code: "FI", Name: "Finland" },
    { Code: "FR", Name: "France" },
    { Code: "DE", Name: "Germany" },
    { Code: "GR", Name: "Greece" },
    { Code: "HU", Name: "Hungary" },
    { Code: "IS", Name: "Iceland" },
    { Code: "IE", Name: "Ireland" },
    { Code: "IT", Name: "Italy" },
    { Code: "JP", Name: "Japan" },
    { Code: "KR", Name: "South Korea" },
    { Code: "LU", Name: "Luxembourg" },
    { Code: "MX", Name: "Mexico" },
    { Code: "NZ", Name: "New Zealand" },
    { Code: "NO", Name: "Norway" },
    { Code: "PH", Name: "Philippines" },
    { Code: "PL", Name: "Poland" },
    { Code: "PT", Name: "Portugal" },
    { Code: "SK", Name: "Slovakia" },
    { Code: "SI", Name: "Slovenia" },
    { Code: "ES", Name: "Spain" },
    { Code: "SE", Name: "Sweden" },
    { Code: "CH", Name: "Switzerland" },
    { Code: "TR", Name: "Turkey" },
    { Code: "UA", Name: "Ukraine" },
    { Code: "GB", Name: "United Kingdom" },
    { Code: "US", Name: "United States" },
  ];

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
            width: "90%",
            height: "80%",
            backgroundColor: "#121212",
            borderRadius: 8,
            paddingVertical: 10,
          }}
        >
          <FlatList
            style={{
              paddingHorizontal: 8,
            }}
            data={countryCodes}
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
                    setValue(item.Name);
                  }}
                >
                  <View
                    style={{
                      width: "90%",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ width: 28, height: 21, marginRight: 8 }}
                      source={{
                        uri: `https://flagcdn.com/160x120/${item.Code.toLowerCase()}.png`,
                      }}
                    />
                    <Text
                      style={{
                        color: "#f4f4f4",
                        fontWeight: "700",
                        fontSize: 16,
                        textAlign: "right",
                      }}
                    >
                      {item.Name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
