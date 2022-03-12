import React, { useState, useEffect } from "react";

import { View, TouchableOpacity, Text, Image } from "react-native";

import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import arrow_up_box from "../../../assets/arrow_up_box.png";
import arrow_down_box from "../../../assets/arrow_down_box.png";
import { FlatList } from "react-native-gesture-handler";

import { ActivityIndicator } from "react-native-paper";

import { functions } from "./../../../authContext";

export default function History({ route, navigation }) {
  const [accountData, setAccountData] = useState({});

  useEffect(() => {
    const resolvePromise = async () => {
      const query = functions.httpsCallable("fetchStripeAccount");

      query()
        .then((result) => {
          setAccountData(result.data);
          console.log(result.data.transactions[1]);
        })
        .catch((err) => {});
    };

    resolvePromise();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1b1b", alignItems: "center" }}>
      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={accountData.transactions}
        renderItem={({ item }) => {
          function timeConverter(unix_timestamp) {
            const a = new Date(unix_timestamp * 1000);
            const months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

            const time = {
              year: a.getFullYear(),
              month: months[a.getMonth()],
              date: a.getDate(),
              hour: a.getHours(),
              min: a.getMinutes(),
              sec: a.getSeconds(),
            };

            return time;
          }
          item.created = timeConverter(item.created);

          return (
            <View
              style={{
                width: "96%",
                padding: 10,
                marginTop: 12,
                marginLeft: "2%",

                flexDirection: "row",
                alignItems: "center",

                borderRadius: 6,
                backgroundColor: "#121212",
                height: 150,
              }}
            >
              {item.amount > 0 ? (
                <Image
                  style={{
                    aspectRatio: 438 / 486,
                    width: undefined,
                    height: 100,
                    marginLeft: 10,
                    marginRight: "8%",
                  }}
                  source={arrow_down_box}
                />
              ) : (
                <Image
                  style={{
                    aspectRatio: 411 / 558,
                    width: undefined,
                    height: 120,
                    marginLeft: 10,
                    marginRight: "8%",
                  }}
                  source={arrow_up_box}
                />
              )}

              <View
                style={{
                  height: 100,
                  flex: 1,

                  marginLeft: "4%",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}
                >
                  {item.description ? item.description : "-"}
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    marginLeft: 6,

                    color: "#f4f4f4",
                    fontSize: 12,
                  }}
                >
                  {item.type}
                </Text>
                <Text
                  style={{
                    color: "#5c5c5c",
                    fontSize: 12,
                    fontFamily: "Roboto_Medium",
                    marginTop: 12,
                  }}
                >
                  DATE
                </Text>
                <Text
                  style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}
                >
                  {item.created.date} {item.created.month}, {item.created.year}
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    marginLeft: 6,

                    color: "#f4f4f4",
                    fontSize: 12,
                  }}
                >
                  {item.created.hour}:{item.created.min}:{item.created.sec}
                </Text>
              </View>
              <View
                style={{
                  height: 100,
                  justifyContent: "space-between",
                  marginRight: "4%",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "#5c5c5c",
                      fontSize: 12,
                      fontFamily: "Roboto_Medium",
                    }}
                  >
                    AMOUNT
                  </Text>
                  <Text
                    style={{
                      color: "#f4f4f4",
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    {item.amount > 0 ? "+" : "-"}{" "}
                    {item.amount > 0
                      ? item.amount / 100
                      : Math.abs(item.amount / 100)}{" "}
                    <Text style={{ color: "#0082ff" }}>USD</Text>
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#5c5c5c",
                      fontSize: 12,
                      fontFamily: "Roboto_Medium",
                    }}
                  >
                    STATUS
                  </Text>
                  <Text
                    style={{
                      color:
                        item.status === "available" ? "#05FD00" : "#ffe100",
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    {item.status === "available" ? "Completed" : "Processing"}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View
            style={{
              width: "100%",
              height: 600,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0082ff" />
          </View>
        }
        keyExtractor={(item, index) => index.toString()}
      />
      {/* <View
        style={{
          width: "96%",
          padding: 10,
          marginTop: 12,

          flexDirection: "row",
          alignItems: "center",

          borderRadius: 6,
          backgroundColor: "#121212",
          height: 150,
        }}
      >
        <Image
          style={{
            aspectRatio: 438 / 486,
            width: undefined,
            height: 100,
            marginLeft: 10,
            marginRight: "8%",
          }}
          source={arrow_down_box}
        />
        <View
          style={{
            height: 100,
            justifyContent: "space-between",
            marginRight: "8%",
          }}
        >
          <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
            John Doe
          </Text>
          <Text
            style={{
              marginTop: 3,
              marginLeft: 6,

              color: "#f4f4f4",
              fontSize: 12,
            }}
          >
            Sell
          </Text>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              fontFamily: "Roboto_Medium",
              marginTop: 12,
            }}
          >
            DATE
          </Text>
          <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
            June 5, 2022
          </Text>
          <Text
            style={{
              marginTop: 3,
              marginLeft: 6,

              color: "#f4f4f4",
              fontSize: 12,
            }}
          >
            06:12:43 AM
          </Text>
        </View>
        <View style={{ height: 100, justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              AMOUNT
            </Text>
            <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
              + 125.00 <Text style={{ color: "#0082ff" }}>USD</Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              STATUS
            </Text>
            <Text style={{ color: "#05FD00", fontSize: 16, fontWeight: "700" }}>
              Completed
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "96%",
          padding: 10,
          marginTop: 12,

          flexDirection: "row",
          alignItems: "center",

          borderRadius: 6,
          backgroundColor: "#121212",
          height: 150,
        }}
      >
        <Image
          style={{
            aspectRatio: 411 / 558,
            width: undefined,
            height: 120,
            marginLeft: 10,
            marginRight: "8%",
          }}
          source={arrow_up_box}
        />
        <View
          style={{
            height: 100,
            justifyContent: "space-between",
            marginRight: "8%",
          }}
        >
          <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
            Adam Szymański
          </Text>
          <Text
            style={{
              marginTop: 3,
              marginLeft: 6,

              color: "#f4f4f4",
              fontSize: 12,
            }}
          >
            Withdraw
          </Text>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              fontFamily: "Roboto_Medium",
              marginTop: 12,
            }}
          >
            DATE
          </Text>
          <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
            June 5, 2022
          </Text>
          <Text
            style={{
              marginTop: 3,
              marginLeft: 6,

              color: "#f4f4f4",
              fontSize: 12,
            }}
          >
            06:12:43 AM
          </Text>
        </View>
        <View style={{ height: 100, justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              AMOUNT
            </Text>
            <Text style={{ color: "#f4f4f4", fontSize: 16, fontWeight: "700" }}>
              - 125.00 <Text style={{ color: "#0082ff" }}>USD</Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#5c5c5c",
                fontSize: 12,
                fontFamily: "Roboto_Medium",
              }}
            >
              STATUS
            </Text>
            <Text style={{ color: "#05FD00", fontSize: 16, fontWeight: "700" }}>
              Completed
            </Text>
          </View>
        </View>
      </View> */}
    </View>
  );
}
