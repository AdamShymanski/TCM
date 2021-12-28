import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";

import { Checkbox, TextInput } from "react-native-paper";

import { MaterialIcons } from "@expo/vector-icons";

import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

const PickerModal = ({
  setSortingPickerValue,
  setFilteringPickerValue,
  filteringPickerValue,
  mode,
  visible,
  setVisible,
}) => {
  const removeElementFromArray = (obj, element) => {
    let arr = obj.rarity;
    arr.forEach((item, index) => {
      if (item === element) {
        arr.splice(index, 1);
        setFilteringPickerValue({ rarity: arr });
      }
    });
  };

  // const [checkbox, setCheckbox] = useState([false]);

  // useEffect(() => {
  //   if (filterPickerValue.rarity.length === 0) {
  //     setCheckbox([false]);
  //   }
  // }, []);

  const reviewSchema = yup.object({
    from: yup
      .string("Wrong format!")
      .email("Email is invalid!")
      .required("Email is required!"),
    to: yup.string("Wrong format!").required("Password is required!"),
  });

  if (visible) {
    if (mode === "sorting") {
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
                data={[
                  // 'Price Ascending',
                  // 'Price Declining',
                  "Rarity Ascending",
                  "Rarity Declining",
                ]}
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
                        setSortingPickerValue(item);
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
    if (mode === "filtering") {
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
            <SafeAreaView
              style={{
                width: "80%",

                backgroundColor: "#121212",
                borderRadius: 8,
                paddingVertical: 10,
              }}
            >
              <View style={{ paddingHorizontal: 8 }}>
                {/* <Text
                  style={{
                    color: "#f4f4f4",
                    fontSize: 22,
                    fontWeight: "700",
                    marginLeft: 8,
                  }}
                >
                  Rarity
                </Text>
                <FlatList
                  data={["Common", "Uncommon", "Rare", "Epic", "Legendary"]}
                  style={{ marginTop: 12 }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          width: "100%",
                          paddingVertical: 5,
                          paddingHorizontal: "10%",

                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: "#f4f4f4",

                            fontSize: 15,
                          }}
                        >
                          {item}
                        </Text>
                        <Checkbox
                          status={checkbox[index] ? "checked" : "unchecked"}
                          color={"#0082ff"}
                          uncheckedColor={"#5c5c5c"}
                          onPress={() => {
                            setCheckbox((prevState) => {
                              prevState[index] = !prevState[index];
                              return prevState;
                            });
                            if (filteringPickerValue.rarity.includes(item)) {
                              removeElementFromArray(
                                filteringPickerValue,
                                item
                              );
                            } else {
                              setFilteringPickerValue((prev) => {
                                return {
                                  rarity: [...prev.rarity, item],
                                };
                              });
                            }
                          }}
                        />
                      </View>
                    );
                  }}
                /> */}
                <Text>Location</Text>
                <Text>Language</Text>
                <Text>Price</Text>

                <Formik
                  initialValues={{
                    from: "",
                    to: "",
                  }}
                  validationSchema={reviewSchema}
                  onSubmit={async (values, actions) => {}}
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 20,
                  }}
                >
                  {(props) => (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ color: "#f4f4f4", fontSize: 12 }}>
                        from
                      </Text>
                      <TextInput
                        mode={"outlined"}
                        value={props.values.from}
                        secureTextEntry={true}
                        onChangeText={props.handleChange("from")}
                        label="from"
                        outlineColor={"#5c5c5c"}
                        error={
                          props.touched.from && props.errors.from ? true : false
                        }
                        style={{
                          width: "20%",

                          backgroundColor: "#1b1b1b",
                          color: "#f4f4f4",
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
                      <Text style={{ color: "#f4f4f4", fontSize: 12 }}>to</Text>
                      <TextInput
                        mode={"outlined"}
                        value={props.values.to}
                        secureTextEntry={true}
                        onChangeText={props.handleChange("to")}
                        label="to"
                        outlineColor={"#5c5c5c"}
                        error={
                          props.touched.to && props.errors.to ? true : false
                        }
                        style={{
                          width: "20%",

                          backgroundColor: "#1b1b1b",
                          color: "#f4f4f4",
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
                    </View>
                  )}
                </Formik>
                <View style={{flexDirecion:"row"}}>
                <Text>Graded?</Text>
                <Checkbox
                          status={"checked"}
                          color={"#0082ff"}
                          uncheckedColor={"#5c5c5c"}
                          onPress={() => {
                            setCheckbox((prevState) => {
                              prevState[index] = !prevState[index];
                              return prevState;
                            });
                            if (filteringPickerValue.rarity.includes(item)) {
                              removeElementFromArray(
                                filteringPickerValue,
                                item
                              );
                            } else {
                              setFilteringPickerValue((prev) => {
                                return {
                                  rarity: [...prev.rarity, item],
                                };
                              });
                            }
                          }}
                        />
                </View>
              </View>
            </SafeAreaView>
          </TouchableOpacity>
        </Modal>
      );
    }
  }

  return null;
};

export default PickerModal;
