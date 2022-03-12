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
    { Code: "AL", Name: "Albania" },
    { Code: "AU", Name: "Australia" },
    { Code: "AT", Name: "Austria" },
    { Code: "BE", Name: "Belgium" },
    { Code: "BR", Name: "Brazil" },
    { Code: "BG", Name: "Bulgaria" },
    // { Code: "BY", Name: "Belarus" },
    { Code: "CA", Name: "Canada" },
    { Code: "CL", Name: "Chile" },
    { Code: "CN", Name: "China" },
    { Code: "CO", Name: "Colombia" },
    { Code: "CY", Name: "Cyprus" },
    { Code: "CZ", Name: "Czech Republic" },
    { Code: "DK", Name: "Denmark" },
    { Code: "EG", Name: "Egypt" },
    { Code: "EE", Name: "Estonia" },
    { Code: "FI", Name: "Finland" },
    { Code: "FR", Name: "France" },
    { Code: "GF", Name: "French Guiana" },
    { Code: "PF", Name: "French Polynesia" },
    { Code: "GE", Name: "Georgia" },
    { Code: "DE", Name: "Germany" },
    { Code: "GR", Name: "Greece" },
    { Code: "HK", Name: "Hong Kong" },
    { Code: "HU", Name: "Hungary" },
    { Code: "IS", Name: "Iceland" },
    { Code: "IN", Name: "India" },
    { Code: "ID", Name: "Indonesia" },
    { Code: "IE", Name: "Ireland" },
    { Code: "IL", Name: "Israel" },
    { Code: "IT", Name: "Italy" },
    { Code: "JM", Name: "Jamaica" },
    { Code: "JP", Name: "Japan" },
    { Code: "KR", Name: "South Korea" },
    { Code: "LT", Name: "Lithuania" },
    { Code: "LU", Name: "Luxembourg" },
    { Code: "MX", Name: "Mexico" },
    { Code: "NZ", Name: "New Zealand" },
    { Code: "NO", Name: "Norway" },
    { Code: "PH", Name: "Philippines" },
    { Code: "PL", Name: "Poland" },
    { Code: "PT", Name: "Portugal" },
    { Code: "RO", Name: "Romania" },
    // { Code: "RU", Name: "Russian Federation" },
    { Code: "SK", Name: "Slovakia" },
    { Code: "SI", Name: "Slovenia" },
    { Code: "ZA", Name: "South Africa" },
    { Code: "ES", Name: "Spain" },
    { Code: "SE", Name: "Sweden" },
    { Code: "CH", Name: "Switzerland" },
    { Code: "TR", Name: "Turkey" },
    { Code: "UA", Name: "Ukraine" },
    { Code: "AE", Name: "United Arab Emirates" },
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
