import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Share,
  Clipboard,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth } from "../../authContext";

export const ShareModal = ({ setModal, setSnackbarState, mode }) => {
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
            width: "87%",

            backgroundColor: "#121212",
            borderRadius: 8,
            paddingVertical: 18,
            paddingHorizontal: 18,
          }}
        >
          <Text
            style={{
              color: "#f4f4f4",
              fontSize: 26,
              fontWeight: "700",
              marginBottom: 20,
            }}
          >
            Select
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="content-copy" color={"#f4f4f4"} size={24} />

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                width: "87%",
                marginLeft: "6%",
                paddingHorizontal: 12,
                paddingVertical: 5,

                backgroundColor: "#0082ff",
                borderRadius: 3,
              }}
              onPress={() => {
                if (mode === "code") {
                  Clipboard.setString(`${auth.currentUser.uid}`);
                  setSnackbarState("Code copied to clipboard");
                } else if (mode === "link") {
                  Clipboard.setString(
                    "Hi there, I found this awesome app called PTCG Marketplace. It's a great way to sell your cards and collect money. You can download it here: https://play.google.com/store/apps/details?id=com.ptcg.marketplace"
                  );
                  setSnackbarState("Message copied to clipboard");
                }

                setModal(false);
              }}
            >
              <Text
                style={{
                  color: "#121212",
                  fontWeight: "700",
                  fontSize: 18,
                  marginRight: 12,
                }}
              >
                Copy
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="share-variant" color={"#f4f4f4"} size={24} />

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                width: "87%",
                marginLeft: "6%",
                marginTop: 12,
                paddingHorizontal: 12,
                paddingVertical: 5,

                borderRadius: 3,
                backgroundColor: "#0082ff",
              }}
              onPress={async () => {
                try {
                  if (mode === "code") {
                    await Share.share({
                      message: `Hi there, I found this awesome app called PTCG Marketplace. It's a great way to sell your cards and collect money. Sign Up with this code: ${auth.currentUser.uid}`,
                    });
                  } else if (mode === "link") {
                    await Share.share({
                      message: `Hi there, I found this awesome app called PTCG Marketplace. It's a great way to sell your cards and collect money. You can download it here: https://play.google.com/store/apps/details?id=com.ptcg.marketplace`,
                    });
                  }

                  setModal(false);
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              <Text
                style={{
                  color: "#121212",
                  fontWeight: "700",
                  fontSize: 18,
                  marginRight: 12,
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row-reverse", marginTop: 28 }}>
            <TouchableOpacity
              style={{
                width: 84,
                height: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                borderWidth: 1.8,
                borderColor: "#5c5c5c",
                borderRadius: 3,
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
      </View>
    </Modal>
  );
};
