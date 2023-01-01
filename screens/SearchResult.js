import React, { useEffect, useState } from "react";
import pokemon from "pokemontcgsdk";

import { useNavigation, useRoute } from "@react-navigation/native";
import { View, ActivityIndicator, FlatList, Text, Image } from "react-native";
import SearchResultCard from "../shared/Cards/SearchResultCard";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import question_mark_pokemon from "../assets/question_mark_pokemon.png";

import * as Progress from "react-native-progress";

export default function SerachResult() {
  // if(offersState.length > 0) {}
  // if(searchResult.length >0) {}

  const route = useRoute();
  const navigation = useNavigation();

  const {
    inputValue,
    subtypeState,
    setState,
    seriesState,
    rarityState,
    supertypeState,
  } = route.params;

  const [pageState, setPageState] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [resultState, setResultState] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);

  const props = {
    sorterParams: "Rarity Declining",
  };

  const createQueryObject = (page) => {
    let queryObject = {
      q: "",
      orderBy:
        props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
      pageSize: 12,
      page: page,
    };

    if (/\d/.test(inputValue)) {
      function formatString(string) {
        let res = "";

        for (let i = 0; i < string.length; i++) {
          if (string[i] !== "0") {
            res += string[i];
          }
        }

        // string[0] = string[0].replace("0", "");
        // string[1] = string[1].replace("0", "");

        res = res.split("/");

        return res;
      }

      const arg = formatString(inputValue);

      queryObject.q = `number:${arg[0]} set.printedTotal:${arg[1]}`;
    } else if (inputValue) {
      queryObject.q = `name:"${inputValue}*"`;
    }

    //(subtypes:mega OR subtypes:vmax)
    //e.g  q: `name:${inputValue}* (subtypes:mega OR subtypes:vmax)`,

    // let paramString = `(rarity:"Rare Holo" OR rarity:"Rare Holo EX")`;

    let paramString = "";

    if (supertypeState) {
      paramString += ` supertype:"${supertypeState}"`;
    }

    if (rarityState.length > 0) {
      if (rarityState.length > 1) {
        let innerParamString = " (";
        rarityState.forEach((element, index) => {
          if (element) {
            if (index === 0) innerParamString += `rarity:"${element}"`;
            else if (index + 1 === rarityState.length)
              innerParamString += ` OR rarity:"${element}")`;
            else innerParamString += ` OR rarity:"${element}"`;
          }
        });
        paramString += innerParamString;
      } else {
        paramString += ` rarity:"${rarityState}"`;
      }
    }
    if (subtypeState.length > 0) {
      if (subtypeState.length > 1) {
        let innerParamString = " (";
        subtypeState.forEach((element, index) => {
          if (element) {
            if (index === 0) innerParamString += `subtypes:"${element}"`;
            else if (index + 1 === subtypeState.length)
              innerParamString += ` OR subtypes:"${element}")`;
            else innerParamString += ` OR subtypes:"${element}"`;
          }
        });
        paramString += innerParamString;
      } else {
        paramString += ` subtypes:"${subtypeState}"`;
      }
    }
    if (setState.length > 0) {
      if (setState.length > 1) {
        let innerParamString = " (";
        setState.forEach((element, index) => {
          if (element) {
            if (index === 0) innerParamString += `set.name:"${element}"`;
            else if (index + 1 === setState.length)
              innerParamString += ` OR set.name:"${element}")`;
            else innerParamString += ` OR set.name:"${element}"`;
          }
        });
        paramString += innerParamString;
      } else {
        paramString += ` set.name:"${setState}"`;
      }
    }
    if (seriesState.length > 0) {
      if (seriesState.length > 1) {
        let innerParamString = " (";
        seriesState.forEach((element, index) => {
          if (element) {
            if (index === 0) innerParamString += `set.series:"${element}"`;
            else if (index + 1 === seriesState.length)
              innerParamString += ` OR set.series:"${element}")`;
            else innerParamString += ` OR set.series:"${element}"`;
          }
        });
        paramString += innerParamString;
      } else {
        paramString += ` set.series:"${seriesState}"`;
      }
    }

    queryObject.q += paramString;

    return queryObject;
  };

  const fetchMoreCards = async () => {
    try {
      const result = await pokemon.card.where(createQueryObject(pageState + 1));
      if (result.data.length === 0) {
        setEndReached(true);
        setActivityIndicator(false);
      } else {
        setResultState((prevState) => [...prevState, ...result.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    pokemon.configure({ apiKey: "3c362cd9-2286-48d4-989a-0d2a65b9d5a8" });

    const resolvePromises = async () => {
      const result = await pokemon.card.where(createQueryObject(pageState));

      if (result) {
        setResultState(result.data);
      } else {
        setResultState(null);
      }
    };

    resolvePromises();
  }, []);

  // return (
  //   <View style={{ width: "100%", alignItems: "center", paddingVertical: 8 }}>
  //     <Progress.Bar
  //       indeterminate={true}
  //       animated={false}
  //       indeterminateAnimationDuration={600}
  //       width={200}
  //       color={"#0082ff"}
  //     />
  //   </View>
  // );

  if (resultState === false) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1b1b1b",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0082ff" />
      </View>
    );
  }
  if (resultState === null || resultState.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1b1b1b",
          width: "100%",
          height: "100%",
        }}
      >
        <Image
          source={question_mark_pokemon}
          style={{ aspectRatio: 400 / 800, height: undefined, width: "30%" }}
        />
        <Text
          style={{
            color: "#f4f4f4",
            fontSize: 38,
            fontWeight: "700",
            marginBottom: 12,
            paddingHorizontal: 20,
            textAlign: "center",
          }}
        >
          Hmmmm....
        </Text>
        <Text
          style={{
            fontSize: 15,
            width: "80%",
            color: "#4f4f4f",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          We cannot find any cards that would match your filters. Try to make
          some tweaks and try again.
        </Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: "#1b1b1b",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <FlatList
          style={{ paddingHorizontal: 8, width: "100%", height: "100%" }}
          data={resultState}
          scrollEventThrottle={2000}
          bounces={true}
          renderItem={({ item }) => {
            return <SearchResultCard props={item} />;
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1b1b1b",
              }}
            >
              <Icon
                name="cart"
                color={"#0082ff"}
                size={58}
                style={{ marginBottom: 12 }}
              />
              <Text
                style={{
                  color: "#f4f4f4",
                  fontSize: 38,
                  fontWeight: "700",
                  marginBottom: 12,
                  paddingHorizontal: 20,
                  textAlign: "center",
                }}
              >
                Quite Empty Here!
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  width: "80%",
                  color: "#4f4f4f",
                  marginBottom: 60,
                  textAlign: "center",
                }}
              >
                Search for a card and add it to your cart. Then You will be able
                to place an order and finally buy them.
              </Text>
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
          onEndReached={async () => {
            if (!endReached) {
              setActivityIndicator(true);
              await fetchMoreCards();
              setActivityIndicator(false);
              setPageState((prev) => prev + 1);
            }
          }}
          ListFooterComponent={() => {
            if (activityIndicator) {
              return (
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    paddingVertical: 6,
                  }}
                >
                  <ActivityIndicator size="large" color="#0082ff" />
                </View>
              );
            }
          }}
          onEndReachedThreshold={2}
        />
      </View>
    );
  }
}
