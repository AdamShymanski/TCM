import React, { useEffect } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Picker,
} from "react-native";

import { Checkbox, TextInput } from "react-native-paper";

import { MaterialIcons } from "@expo/vector-icons";

import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

const PickerModal = ({ props, setProps, mode, visible, setVisible }) => {
  const conditionRegEx = /^[1-9]{1,2}([.][5]{1})?/;
  const priceRegEx = /^\d+([.,]\d{1,2})?$/g;

  const reviewSchema = yup.object().shape(
    {
      from: yup
        .string("Wrong format!")
        .matches(priceRegEx, "Wrong format!")
        .when("to", {
          is: (val) => (val !== undefined || null ? true : false),
          then: yup.string().required("Both values are required!"),
        }),

      to: yup
        .string("Wrong format!")
        .matches(priceRegEx, "Wrong format!")
        .when("from", {
          is: (val) => (val !== undefined || null ? true : false),
          then: yup.string().required("Both values are required!"),
        }),
      condition: yup
        .string("Wrong format!")
        .matches(conditionRegEx, "Wrong value!")
        .test("max", "Value is to high!", (val) => {
          if (val === undefined || null || "" || " ") return true;
          if (parseFloat(val) <= 10) return false;
        }),
    },
    ["from", "to", "condition"]
  );
  const countryCodes = [
    { Code: "PL", Name: "Polish" },
    { Code: "JP", Name: "Japanese" },
    { Code: "GB", Name: "English" },
    { Code: "BE", Name: "Dutch" },
    { Code: "DE", Name: "German" },
    { Code: "FR", Name: "French" },
    { Code: "IT", Name: "Italian" },
    { Code: "ES", Name: "Spanish " },
    { Code: "PT", Name: "Portuguese " },
    { Code: "KR", Name: "Korean" },
    { Code: "CN", Name: "Traditional Chinese" },
    { Code: "RU", Name: "Russian" },
  ];

  const [checkbox, setCheckbox] = useState(false);
  const [languages, setLanguages] = useState({
    PL: false,
    JP: false,
    GB: false,
    BE: false,
    DE: false,
    FR: false,
    IT: false,
    ES: false,
    PT: false,
    KR: false,
    CN: false,
    RU: false,
  });

  useEffect(() => {
    if (visible) {
      if (props.filterParams.graded) {
        setCheckbox(true);
      } else {
        setCheckbox(false);
      }

      //setting up languages object
      if (props.filterParams.language.lenght >= 1) {
        props.filterParams.language.forEach((element) => {
          countryCodes.forEach((item) => {
            if (element === item.Name) {
              setLanguages({
                ...languages,
                [item.Code]: true,
              });
            }
          });
        });
      }
    }
  }, [visible]);

  if (visible) {
    return (
      <Modal
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        transparent={true}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            setVisible(false);
          }}>
          <View
            style={{
              width: '80%',

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
                        setProps((prevState) => ({
                          ...prevState,
                          sorterParams: item,
                        }));
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
          onPress={() => {
            setVisible(false);
          }}
        >
          <View
            elevation={2}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SafeAreaView
              style={{
                width: "80%",

                backgroundColor: "#121212",
                borderRadius: 8,
                paddingBottom: 12,
              }}
            >
              <View style={{ paddingLeft: 14 }}>
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontSize: 18,
                    fontWeight: "700",
                    marginTop: 12,
                  }}
                >
                  Language Version
                </Text>
                <FlatList
                  style={{
                    height: 180,
                    marginVertical: 12,
                    paddingVertical: 8,
                    paddingHorizontal: 8,

                    width: "90%",
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
                          paddingVertical: 11,
                          marginVertical: 4,
                          borderRadius: 3.6,
                          borderWidth: languages[item.Code] ? 2 : 0,
                          borderColor: languages[item.Code]
                            ? "#0082ff"
                            : undefined,
                        }}
                        onPress={() => {
                          setLanguages({
                            ...languages,
                            [item.Code]: !languages[item.Code],
                          });
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
                <Text
                  style={{
                    color: "#f4f4f4",
                    fontSize: 18,
                    fontWeight: "700",
                    marginTop: 12,
                  }}
                >
                  Price
                </Text>
                <Formik
                  initialValues={{
                    from: props.filterParams.price.from
                      ? props.filterParams.price.from.toString()
                      : "",
                    to: props.filterParams.price.to
                      ? props.filterParams.price.to.toString()
                      : "",
                    condition: props.filterParams.condition
                      ? props.filterParams.condition.toString()
                      : "",
                  }}
                  validationSchema={reviewSchema}
                  onSubmit={async (values, actions) => {
                    let outObj = {
                      language: [],
                      price: { from: null, to: null },
                      graded: false,
                      condition: null,
                    };

                    for (const [key, value] of Object.entries(languages)) {
                      if (value) {
                        countryCodes.map((item) => {
                          if (item.Code === key) {
                            outObj.language.push(item.Name);
                          }
                        });
                      }
                    }

                    if (checkbox) {
                      outObj.graded = true;
                    }

                    if (values.from && values.to) {
                      outObj.price.from = parseFloat(
                        values.from.replace(/,/g, ".").replace(/ /g, "")
                      );
                      outObj.price.to = parseFloat(
                        values.to.replace(/,/g, ".").replace(/ /g, "")
                      );
                    } else {
                      outObj.price.to, outObj.price.from == null;
                    }

                    if (values.condition) {
                      outObj.condition = parseFloat(values.condition);
                    } else {
                      outObj.condition = null;
                    }

                    setProps((prevState) => ({
                      ...prevState,
                      filterParams: outObj,
                    }));
                    setVisible(false);
                  }}
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    width: "60%",
                  }}
                >
                  {(props) => (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                          width: "80%",
                          marginTop: 6,
                        }}
                      >
                        <TextInput
                          autoCapitalize="none"
                          mode={"outlined"}
                          value={props.values.from}
                          onChangeText={props.handleChange("from")}
                          label="from"
                          outlineColor={"#5c5c5c"}
                          error={
                            props.touched.from && props.errors.from
                              ? true
                              : false
                          }
                          style={{
                            width: "40%",
                            color: "#f4f4f4",
                            backgroundColor: "#1b1b1b",
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
                        <View
                          style={{
                            width: 14,
                            height: 2,
                            marginTop: 8,
                            backgroundColor: "#0082ff",
                            borderRadius: 1,
                          }}
                        />
                        <TextInput
                          autoCapitalize="none"
                          mode={"outlined"}
                          value={props.values.to}
                          onChangeText={props.handleChange("to")}
                          label="to"
                          outlineColor={"#5c5c5c"}
                          error={
                            props.touched.to && props.errors.to ? true : false
                          }
                          style={{
                            width: "40%",
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
                      <ErrorMessage component="div" name={("from", "to")}>
                        {(msg) => (
                          <Text
                            style={{
                              width: "70%",
                              marginTop: 8,

                              marginLeft: 6,
                              height: 20,
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
                      <Text
                        style={{
                          color: "#f4f4f4",
                          fontSize: 18,
                          fontWeight: "700",
                          marginTop: 14,
                        }}
                      >
                        Condition
                      </Text>
                      <TextInput
                        autoCapitalize="none"
                        mode={"outlined"}
                        value={props.values.condition}
                        onChangeText={props.handleChange("condition")}
                        label="1 to 10"
                        outlineColor={"#5c5c5c"}
                        error={
                          props.touched.condition && props.errors.condition
                            ? true
                            : false
                        }
                        style={{
                          width: "40%",
                          backgroundColor: "#1b1b1b",
                          color: "#f4f4f4",
                          marginTop: 6,
                          marginLeft: 6,
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
                      <ErrorMessage component="div" name={"condition"}>
                        {(msg) => (
                          <Text
                            style={{
                              width: "70%",
                              marginTop: 8,
                              marginLeft: 6,
                              height: 20,
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
                      <View
                        style={{
                          width: "80%",
                          marginTop: 12,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#f4f4f4",
                            fontSize: 18,
                            fontWeight: "700",
                          }}
                        >
                          Only Graded
                        </Text>
                        <Checkbox
                          status={checkbox ? "checked" : "unchecked"}
                          color={"#0082ff"}
                          uncheckedColor={"#5c5c5c"}
                          onPress={() => {
                            setCheckbox(!checkbox);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row-reverse",
                          width: "96%",
                          alignItems: "center",
                          marginTop: 22,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            height: 30,

                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: "#0082FF",
                            borderRadius: 3,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => props.submitForm()}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "700",
                              color: "#121212",
                            }}
                          >
                            Apply
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            height: 30,

                            marginRight: 14,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",

                            borderColor: "#5c5c5c",
                            borderWidth: 2,

                            borderRadius: 3,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            setVisible(false);
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
                  )}
                </Formik>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      );
    }
  }
  return null;
};

export default PickerModal;
