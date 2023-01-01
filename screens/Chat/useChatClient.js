import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  chatApiKey,
  chatUserId,
  chatUserName,
  chatUserToken,
} from "./chatConfig";

import { AsyncStorage } from "react-native";

import { auth, db, functions } from "../../authContext";
import messaging from "@react-native-firebase/messaging";

export default function useChatClient() {
  const [clientIsReady, setClientIsReady] = useState(true);
  let chatClient = null;

  // useEffect(() => {
  //   let unsubscribeTokenRefreshListener;
  //   const resolvePromise = async () => {
  //     try {
  //       if (auth.currentUser.uid) {
  //         const registerPushToken = async () => {
  //           token = await messaging().getToken({
  //             vapidKey:
  //               "BBGS4skwQmR3XTpi98N79O10BE1Xc1Z7h2JFVltSut-4Dy9w2XXf2uhQgzzcZoHXg69EsQoF8sskFGeJD2IsIWk",
  //           });

  //           const push_provider = "firebase";
  //           const push_provider_name = "TCM";

  //           // name an alias for your push provider (optional)
  //           // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle

  //           chatClient.setLocalDevice({
  //             id: token,
  //             push_provider,
  //             push_provider_name,
  //           });

  //           await AsyncStorage.setItem("@current_push_token", token);
  //           await AsyncStorage.setItem(
  //             "@current_user_id",
  //             auth.currentUser.uid
  //           );

  //           const removeOldToken = async () => {
  //             const oldToken = await AsyncStorage.getItem(
  //               "@current_push_token"
  //             );
  //             if (oldToken !== null) {
  //               await chatClient.removeDevice(oldToken);
  //             }
  //           };

  //           unsubscribeTokenRefreshListener = messaging().onTokenRefresh(
  //             async (newToken) => {
  //               await Promise.all([
  //                 removeOldToken(),
  //                 await chatClient.addDevice(
  //                   newToken,
  //                   push_provider,
  //                   auth.currentUser.uid,
  //                   push_provider_name
  //                 ),
  //                 AsyncStorage.setItem("@current_push_token", newToken),
  //               ]);
  //             }
  //           );

  //           // await chatClient?.disconnectUser().then(() => {
  //           //   console.log("chat disconnected");
  //           // });

  //           return token;
  //         };

  //         const setupClient = async () => {
  //           try {
  //             await db
  //               .collection("users")
  //               .doc(auth.currentUser.uid)
  //               .get()
  //               .then(async (usersDoc) => {
  //                 try {
  //                   const userObject = {
  //                     id: auth.currentUser.uid,
  //                     name: auth.currentUser.displayName,
  //                   };

  //                   const token = await registerPushToken();

  //                   if (!usersDoc.data().chatToken) {
  //                     const query = functions.httpsCallable("createChatToken");

  //                     await query()
  //                       .then(async (result) => {
  //                         try {
  //                           await chatClient.connectUser(
  //                             userObject,
  //                             result.data
  //                           );
  //                         } catch (e) {
  //                           console.log(e);
  //                         }
  //                       })
  //                       .catch((err) => console.log(err));
  //                   } else {
  //                     await chatClient.connectUser(
  //                       userObject,
  //                       usersDoc.data().chatToken
  //                     );
  //                   }

  //                   if (
  //                     !usersDoc.data().notificationToken ||
  //                     usersDoc.data().notificationToken != token
  //                   ) {
  //                     await db
  //                       .collection("users")
  //                       .doc(auth.currentUser.uid)
  //                       .update({
  //                         notificationToken: token,
  //                       });
  //                   }
  //                 } catch (error) {
  //                   console.log(error);
  //                 }
  //               });

  //             setClientIsReady(true);

  //             // connectUser is an async function. So you can choose to await for it or not depending on your use case (e.g. to show custom loading indicator)
  //             // But in case you need the chat to load from offline storage first then you should render chat components
  //             // immediately after calling `connectUser()`.
  //             // BUT ITS NECESSARY TO CALL connectUser FIRST IN ANY CASE.
  //           } catch (error) {
  //             if (error instanceof Error) {
  //               console.error(
  //                 `An error occurred while connecting the user: ${error.message}`
  //               );
  //             }
  //           }
  //         };

  //         setupClient();
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     let token;
  //   };
  //   // auth.onAuthStateChanged(async (user) => {
  //   //   if (user) {
  //   //     resolvePromise();
  //   //   } else {
  //   //     unsubscribeTokenRefreshListener();
  //   //   }
  //   // });
  //   // resolvePromise();

  //   // const rrss = async () => {
  //   //   try {
  //   //     await db
  //   //       .collection("users")
  //   //       .doc(auth.currentUser.uid)
  //   //       .get()
  //   //       .then(async (usersDoc) => {
  //   //         await chatClient.connectUser(userObject, result.data);
  //   //       });
  //   //     console.log("chat connected");
  //   //     setClientIsReady(true);
  //   //   } catch (e) {
  //   //     console.log(e);
  //   //   }
  //   // };
  //   // rrss();
  // }, []);

  useEffect(() => {
    const resolvePromise = async () => {
      try {
        chatClient = StreamChat.getInstance(chatApiKey);

        if (!chatClient?.userID) {
          const user = {
            id: auth.currentUser.uid,
            name: auth.currentUser.displayName,
          };

          const usersDoc = await db
            .collection("users")
            .doc(auth.currentUser.uid)
            .get();

          if (!usersDoc.data().chatToken) {
            const query = functions.httpsCallable("createChatToken");

            await query()
              .then(async (result) => {
                try {
                  await chatClient.connectUser(user, result.data);
                } catch (e) {
                  console.log(e);
                }
              })
              .catch((err) => console.log(err));
          } else {
            await chatClient.connectUser(user, usersDoc.data().chatToken);
          }

          setClientIsReady(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
    resolvePromise();
  }, []);

  // const setup = async () => {
  //   try {
  //     if (!chatClient.userID) {
  //       setClientIsReady(false);

  //       const user = {
  //         id: auth.currentUser.uid,
  //         name: auth.currentUser.displayName,
  //       };

  //       const usersDoc = await db
  //         .collection("users")
  //         .doc(auth.currentUser.uid)
  //         .get();

  //       if (!usersDoc.data().chatToken) {
  //         console.log("gdfgd");
  //         const query = functions.httpsCallable("createChatToken");

  //         await query()
  //           .then(async (result) => {
  //             try {
  //               await chatClient.connectUser(user, result.data);
  //             } catch (e) {
  //               console.log(e);
  //             }
  //           })
  //           .catch((err) => console.log(err));
  //       } else {
  //         await chatClient.connectUser(user, usersDoc.data().chatToken);
  //       }

  //       setClientIsReady(true);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // setup();

  return {
    clientIsReady,
    chatClient,
  };
}
