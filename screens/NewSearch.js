import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

import { TextInput, Checkbox, RadioButton } from "react-native-paper";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";

import pokemon_logo from "../assets/pokemon_logo.png";
import sport_cards_logo from "../assets/sport_cards_logo.png";
import yugioh_logo from "../assets/yugioh_logo.png";

export default function NewSearch() {
  const [inputValue, setInputValue] = useState("");

  const [subtypeModal, setSubtypeModal] = useState(false);
  const [setModal, setSetModal] = useState(false);
  const [seriesModal, setSeriesModal] = useState(false);
  const [rarityModal, setRarityModal] = useState(false);

  const [supertypeState, setSupertype] = useState(null);
  const [subtypeState, setSubtypeState] = useState({});
  const [setState, setSetState] = useState({});
  const [seriesState, setSeriesState] = useState({});
  const [rarityState, setRarityState] = useState({});

  const subtypesArray = [
    "BREAK",
    "Baby",
    "Basic",
    "EX",
    "Eternamax",
    "Fusion Strike",
    "GX",
    "Goldenrod Game Center",
    "Item",
    "LEGEND",
    "Level-Up",
    "MEGA",
    "Pokémon Tool",
    "Pokémon Tool F",
    "Prime",
    "Prism Star",
    "Radiant",
    "Rapid Strike",
    "Restored",
    "Rocket's Secret Machine",
    "SP",
    "Single Strike",
    "Special",
    "Stadium",
    "Stage 1",
    "Stage 2",
    "Star",
    "Supporter",
    "Tag Team",
    "Technical Machine",
    "V",
    "V-UNION",
    "VMAX",
    "VSTAR",
  ];
  const setsArray = [
    "Ancient Origins",
    "Aquapolis",
    "Arceus",
    "Astral Radiance",
    "Astral Radiance Trainer Gallery",
    "BREAKpoint",
    "BREAKthrough",
    "Base",
    "Base Set 2",
    "Battle Styles",
    "Best of Game",
    "Black & White",
    "Boundaries Crossed",
    "Brilliant Stars",
    "Brilliant Stars Trainer Gallery",
    "Burning Shadows",
    "Call of Legends",
    "Celebrations",
    "Celebrations: Classic Collection",
    "Celestial Storm",
    "Champion's Path",
    "Chilling Reign",
    "Cosmic Eclipse",
    "Crimson Invasion",
    "Crystal Guardians",
    "DP Black Star Promos",
    "Dark Explorers",
    "Darkness Ablaze",
    "Delta Species",
    "Deoxys",
    "Detective Pikachu",
    "Diamond & Pearl",
    "Double Crisis",
    "Dragon",
    "Dragon Frontiers",
    "Dragon Majesty",
    "Dragon Vault",
    "Dragons Exalted",
    "EX Trainer Kit 2 Minun",
    "EX Trainer Kit 2 Plusle",
    "EX Trainer Kit Latias",
    "EX Trainer Kit Latios",
    "Emerald",
    "Emerging Powers",
    "Evolutions",
    "Evolving Skies",
    "Expedition Base Set",
    "Fates Collide",
    "FireRed & LeafGreen",
    "Flashfire",
    "Forbidden Light",
    "Fossil",
    "Furious Fists",
    "Fusion Strike",
    "Generations",
    "Great Encounters",
    "Guardians Rising",
    "Gym Challenge",
    "Gym Heroes",
    "HGSS Black Star Promos",
    "HS—Triumphant",
    "HS—Undaunted",
    "HS—Unleashed",
    "HeartGold & SoulSilver",
    "Hidden Fates",
    "Hidden Legends",
    "Holon Phantoms",
    "Jungle",
    "Kalos Starter Set",
    "Legend Maker",
    "Legendary Collection",
    "Legendary Treasures",
    "Legends Awakened",
    "Lost Origin",
    "Lost Origin Trainer Gallery",
    "Lost Thunder",
    "Majestic Dawn",
    "McDonald's Collection 2011",
    "McDonald's Collection 2012",
    "McDonald's Collection 2013",
    "McDonald's Collection 2014",
    "McDonald's Collection 2015",
    "McDonald's Collection 2016",
    "McDonald's Collection 2017",
    "McDonald's Collection 2018",
    "McDonald's Collection 2019",
    "McDonald's Collection 2020",
    "McDonald's Collection 2021",
    "McDonald's Collection 2022",
    "Mysterious Treasures",
    "Neo Destiny",
    "Neo Discovery",
    "Neo Genesis",
    "Neo Revelation",
    "Next Destinies",
    "Nintendo Black Star Promos",
    "Noble Victories",
    "POP Series 1",
    "POP Series 2",
    "POP Series 3",
    "POP Series 4",
    "POP Series 5",
    "POP Series 6",
    "POP Series 7",
    "POP Series 8",
    "POP Series 9",
    "Phantom Forces",
    "Plasma Blast",
    "Plasma Freeze",
    "Plasma Storm",
    "Platinum",
    "Pokémon Futsal Collection",
    "Pokémon GO",
    "Pokémon Rumble",
    "Power Keepers",
    "Primal Clash",
    "Rebel Clash",
    "Rising Rivals",
    "Roaring Skies",
    "Ruby & Sapphire",
    "SM Black Star Promos",
    "SWSH Black Star Promos",
    "Sandstorm",
    "Sandstorm",
    "Shining Fates",
    "Shining Legends",
    "Shiny Vault",
    "Silver Tempest",
    "Silver Tempest Trainer Gallery",
    "Skyridge",
    "Southern Islands",
    "Steam Siege",
    "Stormfront",
    "Sun & Moon",
    "Supreme Victors",
    "Sword & Shield",
    "Team Magma vs Team Aqua",
    "Team Rocket",
    "Team Rocket Returns",
    "Team Up",
    "Ultra Prism",
    "Unbroken Bonds",
    "Unified Minds",
    "Unseen Forces",
    "Vivid Voltage",
    "Wizards Black Star Promos",
    "XY",
    "XY Black Star Promos",
  ];
  const rarityArray = [
    "Amazing Rare",
    "Classic Collection",
    "Common",
    "LEGEND",
    "Promo",
    "Radiant Rare",
    "Rare ACE",
    "Rare BREAK",
    "Rare Holo",
    "Rare Holo EX",
    "Rare Holo GX",
    "Rare Holo LV.X",
    "Rare Holo Star",
    "Rare Holo V",
    "Rare Holo VMAX",
    "Rare Holo VSTAR",
    "Rare Prime",
    "Rare Prism Star",
    "Rare Rainbow",
    "Rare Secret",
    "Rare Shining",
    "Rare Shiny",
    "Rare Shiny GX",
    "Rare Ultra",
    "Trainer Gallery Rare Holo",
    "Trainer Gallery Rare Holo V",
    "Trainer Gallery Rare Secret",
    "Trainer Gallery Rare Ultra",
    "Uncommon",
    "V",
    "VM",
  ];
  const seriesArray = [
    "Base",
    "Black & White",
    "Diamond & Pearl",
    "E-Card",
    "EX",
    "Gym",
    "HeartGold & SoulSilver",
    "NP",
    "Neo",
    "Pop",
    "Platinum",
    "Sun & Moon",
    "Sword & Shield",
    "XY",
  ];

  const renderSetListElemet = (item) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <RadioButton
          value={item}
          status={setState[item] ? "checked" : "unchecked"}
          onPress={() => {
            if (setState[item]) {
              setSetState((prevState) => {
                delete prevState[item];
                return { ...prevState };
              });
            } else {
              setSetState({ ...setState, [item]: true });
            }
          }}
          uncheckedColor="#f4f4f4"
          color="#0082ff"
        />

        <Text
          style={{
            color: "#f4f4f4",
            fontWeight: "700",
            fontSize: 16,
            textAlign: "right",
          }}
        >
          {item}
        </Text>
      </View>
    );
  };

  const renderFilterListElement = (arr) => {
    let filtersString = "";

    if (arr.length === 0 || !arr)
      return (
        <Text
          style={{
            fontSize: 15,
            color: "#565656",
            marginLeft: 12,
          }}
        >
          --- NONE SELECTED ---
        </Text>
      );

    if (arr.length > 1) {
      arr.forEach((element, index) => {
        if (element[1]) {
          if (index + 1 === arr.length) {
            filtersString += element[0];
          } else {
            filtersString += element[0] + ", ";
          }
        }
      });
    } else {
      filtersString += arr[0][0];
    }

    return (
      <Text
        style={{
          color: "#565656",
          // fontFamily: "Roboto_Medium",
          fontSize: 16,
          textAlign: "left",
          marginLeft: 12,
        }}
      >
        {filtersString}
      </Text>
    );
  };

  const getItemLayout = (data, index) => ({
    length: 30,
    offset: 30 * index,
    index,
  });

  const renderSubtypeModal = () => {
    return (
      <Modal
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: "80%",

              backgroundColor: "#121212",
              borderRadius: 8,
              paddingVertical: 18,
              paddingHorizontal: 18,
            }}
          >
            <FlatList
              data={subtypesArray}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <RadioButton
                      value={item}
                      status={subtypeState[item] ? "checked" : "unchecked"}
                      onPress={() => {
                        if (subtypeState[item]) {
                          const x = { ...subtypeState };
                          delete x[item];
                          setSubtypeState(x);
                        } else {
                          setSubtypeState({ ...subtypeState, [item]: true });
                        }
                      }}
                      uncheckedColor="#f4f4f4"
                      color="#0082ff"
                    />
                    <Text
                      style={{
                        color: "#f4f4f4",
                        fontWeight: "700",
                        fontSize: 16,
                        textAlign: "right",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
            <View
              style={{
                flexDirection: "row-reverse",
                marginTop: 18,
                alignItems: "center",
              }}
            >
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
                  setSubtypeModal(false);
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
                onPress={async () => {
                  setSubtypeModal(false);
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
        </View>
      </Modal>
    );
  };
  const renderSetModal = () => {
    return (
      <Modal
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: "80%",

              backgroundColor: "#121212",
              borderRadius: 8,
              paddingVertical: 18,
              paddingHorizontal: 18,
            }}
          >
            <FlatList
              data={setsArray}
              renderItem={({ item }) => renderSetListElemet(item)}
              // renderItem={({ item, index }) => {
              //   return (
              //     <View
              //       style={{
              //         flexDirection: "row",
              //         alignItems: "center",
              //         marginBottom: 5,
              //       }}
              //     >
              //       <RadioButton
              //         value={item}
              //         status={setState[item] ? "checked" : "unchecked"}
              //         onPress={() => {
              //           if (setState[item]) {
              //             const x = setState[item];
              //             delete x[item];
              //             setSetState(x);
              //           } else {
              //             setSetState({ ...setState, [item]: true });
              //           }
              //         }}
              //         uncheckedColor="#f4f4f4"
              //         color="#0082ff"
              //       />

              //       <Text
              //         style={{
              //           color: "#f4f4f4",
              //           fontWeight: "700",
              //           fontSize: 16,
              //           textAlign: "right",
              //         }}
              //       >
              //         {item}
              //       </Text>
              //     </View>
              //   );
              // }}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={8} // Reduce initial render amount
              maxToRenderPerBatch={4} // Reduce number in each render batch
              updateCellsBatchingPeriod={30} // Increase time between renders
              windowSize={8} // Reduce the window size
              // getItemLayout={getItemLayout}
              // removeClippedSubviews={true} // Unmount components when outside of window
            />
            <View
              style={{
                flexDirection: "row-reverse",
                marginTop: 18,
                alignItems: "center",
              }}
            >
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
                  setSetModal(false);
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
                onPress={async () => {
                  setSetModal(false);
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
        </View>
      </Modal>
    );
  };
  const renderSeriesModal = () => {
    return (
      <Modal
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: "80%",

              backgroundColor: "#121212",
              borderRadius: 8,
              paddingVertical: 18,
              paddingHorizontal: 18,
            }}
          >
            <FlatList
              data={seriesArray}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <RadioButton
                      value={item}
                      status={seriesState[item] ? "checked" : "unchecked"}
                      onPress={() => {
                        if (seriesState[item]) {
                          const x = { ...seriesState };
                          delete x[item];
                          setSeriesState(x);
                        } else {
                          setSeriesState({ ...seriesState, [item]: true });
                        }
                      }}
                      uncheckedColor="#f4f4f4"
                      color="#0082ff"
                    />
                    <Text
                      style={{
                        color: "#f4f4f4",
                        fontWeight: "700",
                        fontSize: 16,
                        textAlign: "right",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
            <View
              style={{
                flexDirection: "row-reverse",
                marginTop: 18,
                alignItems: "center",
              }}
            >
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
                  setSeriesModal(false);
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
                onPress={async () => {
                  setSeriesModal(false);
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
        </View>
      </Modal>
    );
  };
  const renderRarityModal = () => {
    return (
      <Modal
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: "80%",

              backgroundColor: "#121212",
              borderRadius: 8,
              paddingVertical: 18,
              paddingHorizontal: 18,
            }}
          >
            <FlatList
              data={rarityArray}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <RadioButton
                      value={item}
                      status={rarityState[item] ? "checked" : "unchecked"}
                      onPress={() => {
                        if (rarityState[item]) {
                          const x = { ...rarityState };
                          delete x[item];
                          setRarityState(x);
                        } else {
                          setRarityState({ ...rarityState, [item]: true });
                        }
                      }}
                      uncheckedColor="#f4f4f4"
                      color="#0082ff"
                    />
                    <Text
                      style={{
                        color: "#f4f4f4",
                        fontWeight: "700",
                        fontSize: 16,
                        textAlign: "right",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
            <View
              style={{
                flexDirection: "row-reverse",
                marginTop: 18,
                alignItems: "center",
              }}
            >
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
                  setRarityModal(false);
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
                onPress={async () => {
                  setRarityModal(false);
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
        </View>
      </Modal>
    );
  };

  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#1b1b1b",
      }}
    >
      {subtypeModal ? renderSubtypeModal() : null}
      {setModal ? renderSetModal() : null}
      {seriesModal ? renderSeriesModal() : null}
      {rarityModal ? renderRarityModal() : null}

      <View style={{ height: 120, marginTop: 20 }}>
        <FlatList
          data={[1, 2, 3]}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          renderItem={({ item }) => {
            if (item == 1) {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#121212",
                    paddingHorizontal: 20,
                    marginHorizontal: 10,
                    paddingVertical: 8,

                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexGrow: 0,
                    flexShrink: 1,

                    borderWidth: 3,
                    borderColor: "#0082ff",

                    width: 250,
                    height: 110,
                  }}
                  onPress={() => {}}
                >
                  <Image
                    source={pokemon_logo}
                    style={{
                      aspectRatio: 417 / 154,
                      width: "90%",
                      height: undefined,
                    }}
                  />
                  <Text style={{ color: "#BBBBBB" }}>
                    Over{" "}
                    <Text style={{ color: "#ffffff", fontWeight: "700" }}>
                      +2000
                    </Text>{" "}
                    offers
                  </Text>
                </TouchableOpacity>
              );
            } else if (item == 2) {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#121212",

                    marginHorizontal: 10,

                    width: 250,
                    height: 110,

                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={sport_cards_logo}
                    style={{
                      aspectRatio: 750 / 330,
                      width: "100%",
                      height: undefined,
                    }}
                  />
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#121212",

                    marginHorizontal: 10,

                    width: 250,
                    height: 110,

                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={yugioh_logo}
                    style={{
                      aspectRatio: 750 / 330,
                      width: "100%",
                      height: undefined,
                    }}
                  />
                </TouchableOpacity>
              );
            }
          }}
        />
      </View>

      <TextInput
        mode={"outlined"}
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
        onEndEditing={(e) => {
          //
        }}
        label="Card Name or ID"
        outlineColor={"#5c5c5c"}
        error={false}
        style={{
          width: "90%",
          backgroundColor: "#1B1B1B",
          color: "#f4f4f4",
          marginTop: 20,
          marginBottom: 20,
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
          alignItems: "flex-start",
          width: "90%",
        }}
      >
        <Text
          style={{
            // color: "#565656",
            color: "#f4f4f4",
            fontFamily: "Roboto_Medium",
            fontSize: 18,

            marginBottom: 8,
            marginTop: 12,
          }}
        >
          Supertype
        </Text>
        <View style={{ flexDirection: "row", marginLeft: 12 }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,

              borderColor: supertypeState === "pokémon" ? "#0082ff" : "#5c5c5c",
              backgroundColor:
                supertypeState === "pokémon" ? "#0082ff" : "#1b1b1b",

              paddingHorizontal: 12,
              paddingVertical: 5,

              borderRadius: 3,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            onPress={() => {
              if (supertypeState === "pokémon") {
                setSupertype(null);
              } else {
                setSupertype("pokémon");
              }
            }}
          >
            <Text
              style={{
                fontWeight: supertypeState === "pokémon" ? "700" : undefined,
                fontFamily:
                  supertypeState === "pokémon" ? undefined : "Roboto_Medium",
                color: supertypeState === "pokémon" ? "#121212" : "#5c5c5c",
                fontSize: 16,
              }}
            >
              Pokémon
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: supertypeState === "trainer" ? "#0082ff" : "#5c5c5c",

              backgroundColor:
                supertypeState === "trainer" ? "#0082ff" : "#1b1b1b",

              paddingHorizontal: 12,
              paddingVertical: 5,

              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            onPress={() => {
              if (supertypeState === "trainer") {
                setSupertype(null);
              } else {
                setSupertype("trainer");
              }
            }}
          >
            <Text
              style={{
                fontWeight: supertypeState === "trainer" ? "700" : undefined,
                fontFamily:
                  supertypeState === "trainer" ? undefined : "Roboto_Medium",
                color: supertypeState === "trainer" ? "#121212" : "#5c5c5c",
                fontSize: 16,
              }}
            >
              Trainer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderColor: supertypeState === "energy" ? "#0082ff" : "#5c5c5c",
              borderWidth: 1,

              backgroundColor:
                supertypeState === "energy" ? "#0082ff" : "#1b1b1b",

              paddingVertical: 5,
              paddingHorizontal: 12,

              borderRadius: 3,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            onPress={() => {
              if (supertypeState === "energy") {
                setSupertype(null);
              } else {
                setSupertype("energy");
              }
            }}
          >
            <Text
              style={{
                fontWeight: supertypeState === "energy" ? "700" : undefined,
                fontFamily:
                  supertypeState === "energy" ? undefined : "Roboto_Medium",
                color: supertypeState === "energy" ? "#121212" : "#5c5c5c",
                fontSize: 16,
              }}
            >
              Energy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          alignItems: "flex-start",
          width: "90%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 22,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              // color: "#565656",
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
              fontSize: 18,
              marginRight: 8,
            }}
          >
            Subtype
          </Text>
          <TouchableOpacity onPress={() => setSubtypeModal(true)}>
            <IconMCI name={"filter-plus"} size={20} color={"#0082ff"} />
          </TouchableOpacity>
        </View>
        {renderFilterListElement(
          Object.keys(subtypeState).map((key) => [key, subtypeState[key]])
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 22,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              // color: "#565656",
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
              fontSize: 18,
              marginRight: 8,
            }}
          >
            Set
          </Text>
          <TouchableOpacity onPress={() => setSetModal(true)}>
            <IconMCI name={"filter-plus"} size={20} color={"#0082ff"} />
          </TouchableOpacity>
        </View>
        {renderFilterListElement(
          Object.keys(setState).map((key) => [key, setState[key]])
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 22,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              // color: "#565656",
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
              fontSize: 18,
              marginRight: 8,
            }}
          >
            Series
          </Text>
          <TouchableOpacity onPress={() => setSeriesModal(true)}>
            <IconMCI name={"filter-plus"} size={20} color={"#0082ff"} />
          </TouchableOpacity>
        </View>
        {renderFilterListElement(
          Object.keys(seriesState).map((key) => [key, seriesState[key]])
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 22,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              // color: "#565656",
              color: "#f4f4f4",
              fontFamily: "Roboto_Medium",
              fontSize: 18,
              marginRight: 8,
            }}
          >
            Rarity
          </Text>
          <TouchableOpacity onPress={() => setRarityModal(true)}>
            <IconMCI name={"filter-plus"} size={20} color={"#0082ff"} />
          </TouchableOpacity>
        </View>
        {renderFilterListElement(
          Object.keys(rarityState).map((key) => [key, rarityState[key]])
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
        }}
      >
        {subtypeState ||
        setState ||
        seriesState ||
        rarityState ||
        supertypeState ||
        inputValue ? (
          <TouchableOpacity
            style={{
              height: 30,
              marginTop: 20,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: "#D80000",
              borderRadius: 3,
              paddingHorizontal: 20,
            }}
            onPress={() => {
              setInputValue("");
              setSupertype(null);
              setSubtypeState({});
              setRarityState({});
              setSeriesState({});
              setSetState({});
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#fff",
              }}
            >
              Clear Filters
            </Text>
          </TouchableOpacity>
        ) : null}

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
          onPress={() => {
            navigation.navigate("SearchResult", {
              inputValue: inputValue,
              supertypeState: supertypeState,
              setState: Object.keys(setState).map((key) => {
                if (setState[key]) {
                  return key;
                }
              }),
              seriesState: Object.keys(seriesState).map((key) => {
                if (seriesState[key]) {
                  return key;
                }
              }),
              rarityState: Object.keys(rarityState).map((key) => {
                if (rarityState[key]) {
                  return key;
                }
              }),
              subtypeState: Object.keys(subtypeState).map((key) => {
                if (subtypeState[key]) {
                  return key;
                }
              }),
            });
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
      </View>
    </View>
  );
}
