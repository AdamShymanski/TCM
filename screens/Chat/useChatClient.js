import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  chatApiKey,
  chatUserId,
  chatUserName,
  chatUserToken,
} from "./chatConfig";

import { auth, db, functions } from "../../authContext";

export default function useChatClient() {
  const [clientIsReady, setClientIsReady] = useState(false);
  const chatClient = StreamChat.getInstance(chatApiKey);

  useEffect(() => {
    const setupClient = async () => {
      try {
        await db
          .collection("users")
          .doc(auth.currentUser.uid)
          .get()
          .then(async (doc) => {
            try {
              const user = {
                id: auth.currentUser.uid,
                name: auth.currentUser.displayName,
              };

              if (doc.data().chatToken) {
                chatClient.connectUser(user, doc.data().chatToken);
              } else {
                //call server to create token
                //save token to db
                //connect user

                const query = functions.httpsCallable("createChatToken");

                await query()
                  .then((result) => {
                    try {
                      chatClient.connectUser(user, result.data);
                    } catch (e) {
                      console.log(e);
                    }
                  })
                  .catch((err) => console.log(err));
              }

              console.log("useChatClient");
            } catch (error) {
              console.log(error);
            }
          });

        setClientIsReady(true);

        // connectUser is an async function. So you can choose to await for it or not depending on your use case (e.g. to show custom loading indicator)
        // But in case you need the chat to load from offline storage first then you should render chat components
        // immediately after calling `connectUser()`.
        // BUT ITS NECESSARY TO CALL connectUser FIRST IN ANY CASE.
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
    };

    // If the chat client has a value in the field `userID`, a user is already connected
    // and we can skip trying to connect the user again.
    if (!chatClient.userID) {
      setupClient();
    }
  }, []);

  return {
    clientIsReady,
    chatClient,
  };
}
