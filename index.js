import "expo-dev-client";

import "react-native-gesture-handler";
import { registerRootComponent } from "expo";

import App from "./App";
import { StreamChat } from "stream-chat";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  try {
    const client = StreamChat.getInstance("nfnwsdq54g3b");
    await client._setToken(
      {
        id: client._user.id,
      },
      client.tokenManager.getToken()
    );
    const message = await client.getMessage(remoteMessage.data.id);
    const { stream, ...rest } = remoteMessage.data ?? {};

    // const data = {
    //   ...rest,
    //   ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
    // };

    // const data = {
    //   ...rest,
    //   stream,
    // };+
    const data = {
      ...rest,
    };

    const channelId = await notifee.createChannel({
      id: "chat-messages",
      name: "Chat Messages",
    });

    await notifee.displayNotification({
      title: "New message from " + message.message.user.name,
      body: message.message.text,
      data,
      android: {
        channelId,
        // add a press action to open the app on press
        pressAction: {
          id: "default",
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

registerRootComponent(App);
