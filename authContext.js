import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import "firebase/functions";
import firebase from "firebase/app";

import pokemon from "pokemontcgsdk";

import * as GoogleSignIn from "expo-google-sign-in";
import { StreamChat } from "stream-chat";

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: "AIzaSyA0rTGml4Zi9yozBmgQ5k74jUMmWCxEE2I",
    authDomain: "ptcg-marketpla.firebaseapp.com",
    projectId: "ptcg-marketpla",
    storageBucket: "ptcg-marketpla.appspot.com",
    messagingSenderId: "442180761659",
    appId: "1:442180761659:web:d15b3d500793744982041e",
    measurementId: "G-1HB5T78SQS",
  });
}

pokemon.configure({ apiKey: "3c362cd9-2286-48d4-989a-0d2a65b9d5a8" });

export const pokemonAPI = pokemon;
export const db = firebase.firestore();
db.settings({ experimentalForceLongPolling: true });
export const auth = firebase.auth();
export const storage = firebase.storage();
export const functions = firebase.functions();

export const firebaseObj = firebase;

export const chatClient = StreamChat.getInstance("nfnwsdq54g3b");

// if (__DEV__) {
//   firebase.functions().useEmulator("192.168.0.106", 5001);
//   firebase.firestore().useEmulator("192.168.0.101", 8080);
// }

//! CARDS
export async function fetchCards(props, setProps) {
  try {
    setProps((prevState) => ({
      ...prevState,
      cardsData: [],
    }));

    let result;

    if (props.inputValue) {
      if (/\d/.test(props.inputValue)) {
        const arg = props.inputValue.split("/");

        result = await pokemon.card.where({
          q: `number:${arg[0]} set.printedTotal:${arg[1]}`,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
          pageSize: 8,
          page: 1,
        });
      } else {
        result = await pokemon.card.where({
          q: `name:"${props.inputValue}*"`,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
          pageSize: 8,
          page: 1,
        });
      }

      if (result) {
        setProps((prevState) => ({
          ...prevState,
          cardsData: [...result.data],
        }));
      } else {
        setProps((prevState) => ({
          ...prevState,
          cardsData: [],
        }));
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export async function fetchMoreCards(props, setProps) {
  try {
    let result;

    if (props.inputValue) {
      if (/\d/.test(props.inputValue)) {
        const arg = props.inputValue.split("/");

        result = await pokemon.card.where({
          q: `number:${arg[0]} set.printedTotal:${arg[1]}`,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
          pageSize: 8,
          page: props.pageNumber,
        });
      } else {
        result = await pokemon.card.where({
          q: `name:"${props.inputValue}*"`,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
          pageSize: 8,
          page: props.pageNumber,
        });
      }

      setProps((prevState) => ({
        ...prevState,
        cardsData: [...prevState.cardsData, ...result.data],
      }));
    }
  } catch (error) {
    console.log(error);
  }
}
export async function fetchDefaultCardsDetails(id, setDetails, mounted) {
  try {
    const doc = await db.collection("cardsData").doc(id).get();
    if (doc.data() !== undefined) {
      if (mounted) {
        setDetails([
          doc.data().offersNumber,
          doc.data().highestPrice,
          doc.data().lowestPrice,
        ]);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//! CHAT
export async function fetchLastMessage(
  setLastMessage,
  setHour,
  setNotificationState,
  data
) {
  const result = await db
    .collection(`chats/${data.id}/messages`)
    .doc(data.data.lastMessage)
    .get();

  setLastMessage(result.data());
  setHour(
    result.data().createdAt.toDate().toLocaleTimeString("en-US").substring(0, 5)
  );
  if (result.data().uid === auth.currentUser.uid) {
    setNotificationState(true);
  } else {
    setNotificationState(false);
  }
}
export async function checkForUnreadedMessages(result) {
  try {
    let returnStatement = false;
    await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        const result = doc.data();
        if (result.lastSupportMessageReaded) {
          returnStatement = false;
        } else {
          returnStatement = true;
        }
      });

    // await db.collection("chats");
    // search for unreaded messages
    return returnStatement;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function createChat(secondUserUid) {
  let id = null;

  console.log({
    participants: [auth.currentUser.uid, secondUserUid],
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  await db
    .collection("chats")
    .add({
      participants: [auth.currentUser.uid, secondUserUid],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((doc) => {
      id = doc.id;
    });

  return id;
}
export async function sendMessage(id, message) {
  try {
    await db
      .collection("chats")
      .doc(id)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          content: message,
          sentAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid: auth.currentUser.uid,
          name: auth.currentUser.uid,
          received: false,
        }),
      });
  } catch (err) {}
}
export async function setChatListeners(setListenerData) {
  const secondUserUid = (doc) => {
    if (doc.data().members[0] == auth.currentUser.uid) {
      return doc.data().members[1];
    } else return doc.data().members[0];
  };

  db.collection("chats")
    .where("members", "array-contains", auth.currentUser.uid)
    .onSnapshot((doc) => {
      const array = [];
      doc.forEach((doc) => {
        array.push({ data: doc.data(), uid: secondUserUid(doc), id: doc.id });
      });
      setListenerData(array);
    });
}

//! PURCHASE Co-Related FUNCTIONS
export async function addShippingMethod(props) {
  try {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        [`sellerProfile.shippingMethods`]:
          firebase.firestore.FieldValue.arrayUnion(props),
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function editShippingMethod(oldObj, newObj) {
  try {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        [`sellerProfile.shippingMethods`]:
          firebase.firestore.FieldValue.arrayRemove(oldObj),
      })
      .then(() => {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({
            [`sellerProfile.shippingMethods`]:
              firebase.firestore.FieldValue.arrayUnion(newObj),
          });
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function deleteShippingMethod(oldObj) {
  try {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        [`sellerProfile.shippingMethods`]:
          firebase.firestore.FieldValue.arrayRemove(oldObj),
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function addNewRating(props) {
  try {
    props.author = auth.currentUser.uid;
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        sellerProfile: {
          rating: firebase.firestore.FieldValue.arrayUnion(props),
        },
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}

//! OFFERS - AND RELATED TO IT
export async function addCard(values, gradingSwitch, photoState, cardId) {
  //parse price & condition
  values.condition = parseFloat(values.condition);
  values.price = parseFloat(values.price);

  const doc = await db.collection("users").doc(auth.currentUser.uid).get();

  const cardStatus =
    doc.data().sellerProfile.status === "restricted"
      ? "suspended"
      : "verification_pending";

  db.collection(`offers`)
    .add({
      ...values,
      isGraded: gradingSwitch,
      owner: auth.currentUser.uid,
      cardId: cardId,
      status: cardStatus,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(async (docRef) => {
      db.collection("cardsData")
        .doc(cardId)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            const actualPriceH = doc.data().highestPrice;
            const actualPriceL = doc.data().lowestPrice;
            const newPrice = values.price;

            const keysOrder = ["offersNumber", "highestPrice", "lowestPrice"];

            let updateObj = {
              [keysOrder[0]]: doc.data().offersNumber + 1,
              [keysOrder[1]]: doc.data().highestPrice,
              [keysOrder[2]]: doc.data().lowestPrice,
            };

            if ((actualPriceH && actualPriceL) === 0) {
              updateObj[keysOrder[1]] = values.price;
              updateObj[keysOrder[2]] = values.price;
            } else {
              if (actualPriceH < newPrice) {
                updateObj[keysOrder[1]] = values.price;
              }
              if (actualPriceL > newPrice) {
                updateObj[keysOrder[2]] = values.price;
              }
            }

            db.collection("cardsData").doc(cardId).update(updateObj);
          } else {
            db.collection("cardsData").doc(cardId).set({
              offersNumber: 1,
              highestPrice: values.price,
              lowestPrice: values.price,
            });
          }
          const user = await db
            .collection("users")
            .doc(auth.currentUser.uid)
            .get();

          let update = user.data();

          update.sellerProfile.statistics.numberOfOffers = update.sellerProfile
            .statistics.numberOfOffers
            ? update.sellerProfile.statistics.numberOfOffers + 1
            : 1;

          await db.collection("users").doc(auth.currentUser.uid).set(update);
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });

      const storageRef = firebase.storage().ref(`cards/${docRef.id}`);
      photoState.map(async (photo, i) => {
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        await storageRef.child(`/${i}`).put(blob);
      });
    });
}
export async function editCard(props, outValues, initValues, valuesOrder) {
  try {
    let cardUpdateObj = {};

    outValues.forEach((item, index) => {
      const keyName = valuesOrder[index];
      if (item !== initValues[index]) cardUpdateObj[keyName] = item;
    });

    await db.collection("offers").doc(props.id).update(cardUpdateObj);

    if (outValues[0] != initValues[0]) {
      let updateObj = {
        highestPrice: null,
        lowestPrice: null,
      };

      async function searchForNewHighestPrice() {
        const result = await db
          .collection("offers")
          .where("cardId", "==", props.cardId)
          .get();

        const arr = [];

        result.forEach((doc) => {
          arr.push(doc.data());
        });

        let finalPrice = 0;

        arr.forEach((item, index) => {
          if (index === 0) {
            finalPrice = item.price;
          } else if (item.price > finalPrice) {
            finalPrice = item.price;
          }
        });

        return finalPrice;
      }
      async function searchForNewLowestPrice() {
        const result = await db
          .collection("offers")
          .where("cardId", "==", props.cardId)
          .get();

        const arr = [];

        result.forEach((doc) => {
          arr.push(doc.data());
        });

        let finalPrice = 0;

        arr.forEach((item, index) => {
          if (index === 0) {
            finalPrice = item.price;
          } else if (item.price < finalPrice) {
            finalPrice = item.price;
          }
        });

        return finalPrice;
      }

      updateObj.lowestPrice = await searchForNewLowestPrice();
      updateObj.highestPrice = await searchForNewHighestPrice();

      await db
        .collection("cardsData")
        .doc(props.cardId)
        .update({ updateObj, status: "verification_pending" });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function deleteCard(id) {
  try {
    let user = await db.collection("users").doc(auth.currentUser.uid).get();
    await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({
        ["sellerProfile.statistics.numberOfOffers"]:
          user.data().sellerProfile.statistics.numberOfOffers - 1,
      });

    async function handleOtherChanges() {
      const offert = await db.collection("offers").doc(id).get();
      const doc = await db
        .collection("cardsData")
        .doc(offert.data().cardId)
        .get();

      const recentPriceH = doc.data().highestPrice;
      const recentPriceL = doc.data().lowestPrice;

      const offersNumber = doc.data().offersNumber - 1;

      let updateObj = {
        offersNumber: offersNumber,
        highestPrice: recentPriceH,
        lowestPrice: recentPriceL,
      };

      async function searchForNewHighestPrice() {
        const result = await db
          .collection("offers")
          .where("cardId", "==", offert.data().cardId)
          .get();

        let newPrice = [0, 0];
        // 0- price, 1- index
        const arr = [];

        result.forEach((doc) => {
          arr.push(doc.data());
        });

        arr.forEach((item, index) => {
          if (item.price < recentPriceH) {
            if (index === 0) {
              newPrice = [item.price, index];
            } else {
              if (item.price > newPrice[0]) {
                newPrice = [item.price, index];
              }
            }
          }
        });

        return arr[newPrice[1]].price;
      }

      async function searchForNewLowestPrice() {
        const result = await db
          .collection("offers")
          .where("cardId", "==", offert.data().cardId)
          .get();

        let newPrice = [0, 0];
        // 0- price, 1- index
        const arr = [];

        result.forEach((doc) => {
          arr.push(doc.data());
        });

        arr.forEach((item, index) => {
          if (item.price > recentPriceH) {
            if (index === 0) {
              newPrice = [item.price, index];
            } else {
              if (item.price < newPrice[0]) {
                newPrice = [item.price, index];
              }
            }
          }
        });

        return arr[newPrice[1]].price;
      }

      if (doc.data().offersNumber === 1) {
        updateObj.highestPrice = 0;
        updateObj.lowestPrice = 0;
      } else {
        if (recentPriceL == offert.data().price) {
          const result = await searchForNewLowestPrice();
          updateObj.lowestPrice = result;
        }
        if (recentPriceH == offert.data().price) {
          const result = await searchForNewHighestPrice();
          updateObj.highestPrice = result;
        }
      }
      await db
        .collection("cardsData")
        .doc(offert.data().cardId)
        .update(updateObj);
    }

    await handleOtherChanges();

    await db.collection("offers").doc(id).delete();

    const desertRef = storageRef.child(`cards/${id}`);
    await desertRef.delete();
  } catch (error) {
    console.log(error);
  }
}
//?
export async function fetchPhotos(offerId) {
  try {
    const pathsArray = [];

    const path = "cards/" + `${offerId}/`;

    for (let i = 0; i < 3; i++) {
      const pathReference = storage.ref(path + i);

      try {
        await pathReference.getDownloadURL().then((url) => {
          pathsArray.push(url);
        });
      } catch (error) {
        // console.log(error);
      }
    }

    return pathsArray;
  } catch (error) {
    console.log(error);
  }
}
export async function fetchOffers(id, filters, setOffers) {
  try {
    const arr = [];

    if (id) {
      let docArr = db.collection("offers").where("cardId", "==", id);

      const languageFilter = (offer) => {
        if (filters.language.length === 0) return true;
        return filters.language.includes(offer.languageVersion);
      };

      // if (filters.graded) docArr = docArr.where("isGraded", "==", true);
      // if (filters.condition)
      //   docArr = docArr.where("condition", "==", filters.condition);
      // if (filters.price.from && filters.price.to) {
      //   docArr = docArr
      //     .where("price", ">=", filters.price.from)
      //     .where("price", "<=", filters.price.to);
      // }

      if (filters.graded) {
        if (filters.price.from && filters.price.to && filters.condition) {
          docArr = db
            .collection("offers")
            .where("cardId", "==", id)
            .where("price", ">=", filters.price.from)
            .where("price", "<=", filters.price.to)
            .where("condition", "==", filters.condition)
            .where("isGraded", "==", true);
        } else if (filters.condition) {
          docArr = db
            .collection("offers")
            .where("cardId", "==", id)
            .where("condition", "==", filters.condition)
            .where("isGraded", "==", true);
        } else if (filters.price.from && filters.price.to) {
          docArr = db
            .collection("offers")
            .where("cardId", "==", id)
            .where("price", ">=", filters.price.from)
            .where("price", "<=", filters.price.to)
            .where("isGraded", "==", true);
        } else {
          docArr = db
            .collection("offers")
            .where("cardId", "==", id)
            .where("isGraded", "==", true);
        }
      } else if (filters.condition) {
        if (filters.price.from && filters.price.to) {
          docArr = db
            .collection("offers")
            .where("cardId", "==", id)
            .where("price", ">=", filters.price.from)
            .where("price", "<=", filters.price.to)
            .where("condition", "==", filters.condition);
        } else {
          docArr = db
            .collection("offers")
            .where("cardId", "==", id)
            .where("condition", "==", filters.condition);
        }
      } else if (filters.price.from && filters.price.to) {
        docArr = db
          .collection("offers")
          .where("cardId", "==", id)
          .where("price", ">=", filters.price.from)
          .where("price", "<=", filters.price.to);
      }

      const snapshot = await docArr.get();
      snapshot.forEach((doc) => {
        let offers = doc.data();
        offers.id = doc.id;

        if (languageFilter(offers)) arr.push(offers);
      });

      setOffers(arr);
    } else setOffers([]);
  } catch (error) {
    console.log(error);
  }
}
export async function fetchCardsName(id) {
  try {
    const promise = new Promise(async (resolve, reject) => {
      pokemon.card
        .find(id)
        .then((card) => {
          resolve(card.name);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    return promise;
  } catch (error) {
    console.log(error);
  }
}
export async function fetchOwnerData(
  ownerId,
  userCountry,
  setShippingImposible
) {
  const countryCodes = [
    { Code: "AF", Name: "Afghanistan" },
    { Code: "AL", Name: "Albania" },
    { Code: "DZ", Name: "Algeria" },
    { Code: "AS", Name: "American Samoa" },
    { Code: "AD", Name: "Andorra" },
    { Code: "AO", Name: "Angola" },
    { Code: "AI", Name: "Anguilla" },
    { Code: "AQ", Name: "Antarctica" },
    { Code: "AG", Name: "Antigua and Barbuda" },
    { Code: "AR", Name: "Argentina" },
    { Code: "AM", Name: "Armenia" },
    { Code: "AW", Name: "Aruba" },
    { Code: "AU", Name: "Australia" },
    { Code: "AT", Name: "Austria" },
    { Code: "AZ", Name: "Azerbaijan" },
    { Code: "BS", Name: "Bahamas" },
    { Code: "BH", Name: "Bahrain" },
    { Code: "BD", Name: "Bangladesh" },
    { Code: "BB", Name: "Barbados" },
    { Code: "BY", Name: "Belarus" },
    { Code: "BE", Name: "Belgium" },
    { Code: "BZ", Name: "Belize" },
    { Code: "BJ", Name: "Benin" },
    { Code: "BM", Name: "Bermuda" },
    { Code: "BT", Name: "Bhutan" },
    { Code: "BW", Name: "Botswana" },
    { Code: "BV", Name: "Bouvet Island" },
    { Code: "BR", Name: "Brazil" },
    { Code: "IO", Name: "British Indian Ocean Territory" },
    { Code: "BN", Name: "Brunei Darussalam" },
    { Code: "BG", Name: "Bulgaria" },
    { Code: "BF", Name: "Burkina Faso" },
    { Code: "BI", Name: "Burundi" },
    { Code: "KH", Name: "Cambodia" },
    { Code: "CM", Name: "Cameroon" },
    { Code: "CA", Name: "Canada" },
    { Code: "CV", Name: "Cape Verde" },
    { Code: "KY", Name: "Cayman Islands" },
    { Code: "CF", Name: "Central African Republic" },
    { Code: "TD", Name: "Chad" },
    { Code: "CL", Name: "Chile" },
    { Code: "CN", Name: "China" },
    { Code: "CX", Name: "Christmas Island" },
    { Code: "CC", Name: "Cocos (Keeling) Islands" },
    { Code: "CO", Name: "Colombia" },
    { Code: "KM", Name: "Comoros" },
    { Code: "CG", Name: "Congo" },
    { Code: "CD", Name: "Congo, the Democratic Republic of the" },
    { Code: "CK", Name: "Cook Islands" },
    { Code: "CR", Name: "Costa Rica" },
    { Code: "HR", Name: "Croatia" },
    { Code: "CU", Name: "Cuba" },
    { Code: "CY", Name: "Cyprus" },
    { Code: "CZ", Name: "Czech Republic" },
    { Code: "DK", Name: "Denmark" },
    { Code: "DJ", Name: "Djibouti" },
    { Code: "DM", Name: "Dominica" },
    { Code: "DO", Name: "Dominican Republic" },
    { Code: "EC", Name: "Ecuador" },
    { Code: "EG", Name: "Egypt" },
    { Code: "SV", Name: "El Salvador" },
    { Code: "GQ", Name: "Equatorial Guinea" },
    { Code: "ER", Name: "Eritrea" },
    { Code: "EE", Name: "Estonia" },
    { Code: "ET", Name: "Ethiopia" },
    { Code: "FK", Name: "Falkland Islands (Malvinas)" },
    { Code: "FO", Name: "Faroe Islands" },
    { Code: "FJ", Name: "Fiji" },
    { Code: "FI", Name: "Finland" },
    { Code: "FR", Name: "France" },
    { Code: "GF", Name: "French Guiana" },
    { Code: "PF", Name: "French Polynesia" },
    { Code: "TF", Name: "French Southern Territories" },
    { Code: "GA", Name: "Gabon" },
    { Code: "GM", Name: "Gambia" },
    { Code: "GE", Name: "Georgia" },
    { Code: "DE", Name: "Germany" },
    { Code: "GH", Name: "Ghana" },
    { Code: "GI", Name: "Gibraltar" },
    { Code: "GR", Name: "Greece" },
    { Code: "GL", Name: "Greenland" },
    { Code: "GD", Name: "Grenada" },
    { Code: "GP", Name: "Guadeloupe" },
    { Code: "GU", Name: "Guam" },
    { Code: "GT", Name: "Guatemala" },
    { Code: "GG", Name: "Guernsey" },
    { Code: "GN", Name: "Guinea" },
    { Code: "GW", Name: "Guinea-Bissau" },
    { Code: "GY", Name: "Guyana" },
    { Code: "HT", Name: "Haiti" },
    { Code: "HM", Name: "Heard Island and McDonald Islands" },
    { Code: "VA", Name: "Holy See (Vatican City State)" },
    { Code: "HN", Name: "Honduras" },
    { Code: "HK", Name: "Hong Kong" },
    { Code: "HU", Name: "Hungary" },
    { Code: "IS", Name: "Iceland" },
    { Code: "IN", Name: "India" },
    { Code: "ID", Name: "Indonesia" },
    { Code: "IR", Name: "Iran, Islamic Republic of" },
    { Code: "IQ", Name: "Iraq" },
    { Code: "IE", Name: "Ireland" },
    { Code: "IM", Name: "Isle of Man" },
    { Code: "IL", Name: "Israel" },
    { Code: "IT", Name: "Italy" },
    { Code: "JM", Name: "Jamaica" },
    { Code: "JP", Name: "Japan" },
    { Code: "JE", Name: "Jersey" },
    { Code: "JO", Name: "Jordan" },
    { Code: "KZ", Name: "Kazakhstan" },
    { Code: "KE", Name: "Kenya" },
    { Code: "KI", Name: "Kiribati" },
    { Code: "KP", Name: "Korea, Democratic People's Republic of" },
    { Code: "KR", Name: "Korea, Republic of" },
    { Code: "KW", Name: "Kuwait" },
    { Code: "KG", Name: "Kyrgyzstan" },
    { Code: "LA", Name: "Lao People's Democratic Republic" },
    { Code: "LV", Name: "Latvia" },
    { Code: "LB", Name: "Lebanon" },
    { Code: "LS", Name: "Lesotho" },
    { Code: "LR", Name: "Liberia" },
    { Code: "LY", Name: "Libya" },
    { Code: "LI", Name: "Liechtenstein" },
    { Code: "LT", Name: "Lithuania" },
    { Code: "LU", Name: "Luxembourg" },
    { Code: "MO", Name: "Macao" },
    { Code: "MK", Name: "Macedonia, the Former Yugoslav Republic of" },
    { Code: "MG", Name: "Madagascar" },
    { Code: "MW", Name: "Malawi" },
    { Code: "MY", Name: "Malaysia" },
    { Code: "MV", Name: "Maldives" },
    { Code: "ML", Name: "Mali" },
    { Code: "MT", Name: "Malta" },
    { Code: "MH", Name: "Marshall Islands" },
    { Code: "MQ", Name: "Martinique" },
    { Code: "MR", Name: "Mauritania" },
    { Code: "MU", Name: "Mauritius" },
    { Code: "YT", Name: "Mayotte" },
    { Code: "MX", Name: "Mexico" },
    { Code: "FM", Name: "Micronesia, Federated States of" },
    { Code: "MD", Name: "Moldova, Republic of" },
    { Code: "MC", Name: "Monaco" },
    { Code: "MN", Name: "Mongolia" },
    { Code: "ME", Name: "Montenegro" },
    { Code: "MS", Name: "Montserrat" },
    { Code: "MA", Name: "Morocco" },
    { Code: "MZ", Name: "Mozambique" },
    { Code: "MM", Name: "Myanmar" },
    { Code: "NA", Name: "Namibia" },
    { Code: "NR", Name: "Nauru" },
    { Code: "NP", Name: "Nepal" },
    { Code: "NL", Name: "Netherlands" },
    { Code: "NC", Name: "New Caledonia" },
    { Code: "NZ", Name: "New Zealand" },
    { Code: "NI", Name: "Nicaragua" },
    { Code: "NE", Name: "Niger" },
    { Code: "NG", Name: "Nigeria" },
    { Code: "NU", Name: "Niue" },
    { Code: "NF", Name: "Norfolk Island" },
    { Code: "MP", Name: "Northern Mariana Islands" },
    { Code: "NO", Name: "Norway" },
    { Code: "OM", Name: "Oman" },
    { Code: "PK", Name: "Pakistan" },
    { Code: "PW", Name: "Palau" },
    { Code: "PS", Name: "Palestine, State of" },
    { Code: "PA", Name: "Panama" },
    { Code: "PG", Name: "Papua New Guinea" },
    { Code: "PY", Name: "Paraguay" },
    { Code: "PE", Name: "Peru" },
    { Code: "PH", Name: "Philippines" },
    { Code: "PN", Name: "Pitcairn" },
    { Code: "PL", Name: "Poland" },
    { Code: "PT", Name: "Portugal" },
    { Code: "PR", Name: "Puerto Rico" },
    { Code: "QA", Name: "Qatar" },
    { Code: "RO", Name: "Romania" },
    { Code: "RU", Name: "Russian Federation" },
    { Code: "RW", Name: "Rwanda" },
    { Code: "SH", Name: "Saint Helena, Ascension and Tristan da Cunha" },
    { Code: "KN", Name: "Saint Kitts and Nevis" },
    { Code: "LC", Name: "Saint Lucia" },
    { Code: "MF", Name: "Saint Martin (French part)" },
    { Code: "PM", Name: "Saint Pierre and Miquelon" },
    { Code: "VC", Name: "Saint Vincent and the Grenadines" },
    { Code: "WS", Name: "Samoa" },
    { Code: "SM", Name: "San Marino" },
    { Code: "ST", Name: "Sao Tome and Principe" },
    { Code: "SA", Name: "Saudi Arabia" },
    { Code: "SN", Name: "Senegal" },
    { Code: "RS", Name: "Serbia" },
    { Code: "SC", Name: "Seychelles" },
    { Code: "SL", Name: "Sierra Leone" },
    { Code: "SG", Name: "Singapore" },
    { Code: "SX", Name: "Sint Maarten (Dutch part)" },
    { Code: "SK", Name: "Slovakia" },
    { Code: "SI", Name: "Slovenia" },
    { Code: "SB", Name: "Solomon Islands" },
    { Code: "SO", Name: "Somalia" },
    { Code: "ZA", Name: "South Africa" },
    { Code: "GS", Name: "South Georgia and the South Sandwich Islands" },
    { Code: "SS", Name: "South Sudan" },
    { Code: "ES", Name: "Spain" },
    { Code: "LK", Name: "Sri Lanka" },
    { Code: "SD", Name: "Sudan" },
    { Code: "SR", Name: "Suriname" },
    { Code: "SJ", Name: "Svalbard and Jan Mayen" },
    { Code: "SZ", Name: "Swaziland" },
    { Code: "SE", Name: "Sweden" },
    { Code: "CH", Name: "Switzerland" },
    { Code: "SY", Name: "Syrian Arab Republic" },
    { Code: "TW", Name: "Taiwan, Province of China" },
    { Code: "TJ", Name: "Tajikistan" },
    { Code: "TZ", Name: "Tanzania, United Republic of" },
    { Code: "TH", Name: "Thailand" },
    { Code: "TL", Name: "Timor-Leste" },
    { Code: "TG", Name: "Togo" },
    { Code: "TK", Name: "Tokelau" },
    { Code: "TO", Name: "Tonga" },
    { Code: "TT", Name: "Trinidad and Tobago" },
    { Code: "TN", Name: "Tunisia" },
    { Code: "TR", Name: "Turkey" },
    { Code: "TM", Name: "Turkmenistan" },
    { Code: "TC", Name: "Turks and Caicos Islands" },
    { Code: "TV", Name: "Tuvalu" },
    { Code: "UG", Name: "Uganda" },
    { Code: "UA", Name: "Ukraine" },
    { Code: "AE", Name: "United Arab Emirates" },
    { Code: "GB", Name: "United Kingdom" },
    { Code: "US", Name: "United States" },
    { Code: "UM", Name: "United States Minor Outlying Islands" },
    { Code: "UY", Name: "Uruguay" },
    { Code: "UZ", Name: "Uzbekistan" },
    { Code: "VU", Name: "Vanuatu" },
    { Code: "VE", Name: "Venezuela, Bolivarian Republic of" },
    { Code: "VN", Name: "Viet Nam" },
    { Code: "VG", Name: "Virgin Islands, British" },
    { Code: "VI", Name: "Virgin Islands, U.S." },
    { Code: "WF", Name: "Wallis and Futuna" },
    { Code: "EH", Name: "Western Sahara" },
    { Code: "YE", Name: "Yemen" },
    { Code: "ZM", Name: "Zambia" },
    { Code: "ZW", Name: "Zimbabwe" },
  ];

  try {
    let nick, country, savedOffers, countryCode, cart, sellerProfile;

    const calculateAvgRating = (doc) => {
      let total = 0;

      if (doc.data()?.sellerProfile !== undefined) {
        doc.data()?.sellerProfile?.rating.forEach((rate) => {
          total += rate.stars;
        });
        return total / doc.data()?.sellerProfile?.rating?.length;
      } else {
        return "-";
      }
    };

    await db
      .collection("users")
      .doc(ownerId)
      .get()
      .then((doc) => {
        nick = doc.data()?.nick;
        country = doc.data()?.country;
        savedOffers = doc.data()?.savedOffers;

        cart = doc.data()?.cart ? doc.data()?.cart : [];
        sellerProfile = doc.data()?.sellerProfile;
        sellerProfile.uid = ownerId;

        if (sellerProfile === undefined) {
          sellerProfile = {
            statistics: {
              views: 0,
              purchases: 0,
              numberOfOffers: 0,
              sales: 0,
            },
            avgRating: 0,
            rating: [],
          };
        } else {
          sellerProfile.avgRating = calculateAvgRating(doc);
        }

        countryCodes.forEach((item, i) => {
          if (item.Name == country) {
            countryCode = countryCodes[i].Code.toLowerCase();
          }
        });

        if (setShippingImposible && userCountry) {
          doc.data().sellerProfile.shippingMethods.forEach((method) => {
            method.destinationCountries.forEach((country) => {
              if (country === userCountry) {
                setShippingImposible(false);
              }
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return {
      nick,
      country,
      savedOffers,
      countryCode,
      sellerProfile,
      cart,
    };
  } catch (error) {
    console.log(error);
  }
}

//! MY ACCOUNT
export async function reauthenticate(password) {
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(
      auth.currentUser.email,
      password.trim()
    );

    await auth.currentUser.reauthenticateWithCredential(credential);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function login(email, password, setError) {
  try {
    await auth.signInWithEmailAndPassword(email.trim(), password.trim());
    return true;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    setError("Wrong Credentials!");
    return false;
  }
}
export async function register(email, password, nick, country, setError) {
  try {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        user.updateProfile({
          displayName: nick,
        });

        await db
          .collection("users")
          .doc(user.uid)
          .set({
            nick: nick.trim(),
            country: country.trim(),
            discounts: {
              referralProgram: [],
              compensation: [],
            },
            addresses: [],
            sellerProfile: {
              status: "unset",
              rating: [],
              shippingMethods: {
                domestic: [],
                international: [],
              },
              statistics: {
                purchases: 0,
                sales: 0,
                views: 0,
                numberOfOffers: 0,
              },
            },
            cart: [],
            stripe: {
              vendorId: null,
              merchantId: null,
            },
            notificationToken: null,
            savedOffers: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        const query = functions.httpsCallable("createChatToken");
        await query();

        const mailQuery = functions.httpsCallable("sendMail");

        await mailQuery({
          to: user.uid,
          subject: "Welcome",
          from: {
            email: "contact@tcmarket.place",
            name: "TCM",
          },
          templateId: "d-e4314d0e1ff44a708d65f68374e62d83",
          dynamicTemplateData: {
            name: nick.trim(),
          },
        });

        // const { clientIsReady, chatClient } = useChatClient();

        // await query()
        //   .then((result) => {
        //     try {
        //       chatClient.connectUser(user, result.data);
        //     } catch (e) {
        //       console.log(e);
        //     }
        //   })
        //   .catch((err) => console.log(err));

        await login(email.trim(), password.trim());
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (
          errorMessage ===
          "The email address is already in use by another account."
        ) {
          setError("Email has been already used.");
        }
      });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function deleteAccount() {
  try {
    let arr = [];

    const result = await db
      .collection("offers")
      .where("owner", "==", auth.currentUser.uid)
      .get();

    //fetch all users card, and push them to arr
    result.forEach((doc) => {
      let cardObj = doc.data();
      cardObj.id = doc.id;
      arr.push(cardObj);
    });

    const chatQuery = functions.httpsCallable("deleteChatUser");
    await chatQuery();

    const mailQuery = functions.httpsCallable("sendMail");

    await mailQuery({
      to: auth.currentUser.uid,
      subject: "Account Deleted",
      from: {
        email: "contact@tcmarket.place",
        name: "TCM",
      },
      templateId: "d-b5623b8b20ba4e6aba03154f14f166cf",
    });

    if (arr.length > 0) {
      const promise = new Promise(async (resolve, reject) => {
        arr.forEach(async (doc, index) => {
          await deleteCard(doc.id);
          if (arr.length == index + 1) resolve();
        });
      });
      await promise.then(async () => {
        await db.collection("users").doc(auth.currentUser.uid).delete();
        await auth.currentUser.delete();

        if (auth.currentUser?.providerData[0].providerId == "google.com") {
          await GoogleSignIn.signOutAsync();
        } else {
          auth.signOut();
        }
      });
    } else {
      await db.collection("users").doc(auth.currentUser.uid).delete();
      await auth.currentUser.delete();

      if (auth.currentUser?.providerData[0].providerId == "google.com") {
        await GoogleSignIn.signOutAsync();
      } else {
        auth.signOut();
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export async function sendResetPasswordMail(email, setError) {
  try {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {})
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setError(errorMessage);
        // ..
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function googleReSignIn(result) {
  try {
    if (result.type === "success") {
      const credential = firebase.auth.GoogleAuthProvider.credential(
        result.idToken,
        result.accessToken
      );

      await firebase
        .auth()
        .currentUser.reauthenticateWithCredential(credential);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function updateUserData(outValues, initValues, setAddressesArray) {
  try {
    if (outValues.nick !== initValues.nick) {
      await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .update({ nick: outValues.nick });

      //update nick in firebase auth
      await auth.currentUser.updateProfile({
        displayName: outValues.nick,
      });
    }

    if (outValues.country !== initValues.country) {
      await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .update({ country: outValues.country });

      const result = await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .get();

      result.data().addresses.forEach(async (doc) => {
        await db
          .collection("users")
          .doc(auth.currentUser.uid)
          .update({
            addresses: firebase.firestore.FieldValue.arrayRemove(doc),
          });

        doc.country = outValues.country;

        setAddressesArray((prev) => [...prev, doc]);

        await db
          .collection("users")
          .doc(auth.currentUser.uid)
          .update({
            addresses: firebase.firestore.FieldValue.arrayUnion(doc),
          });
      });
    }

    if (outValues.email !== initValues.email) {
      await auth.currentUser.updateEmail(outValues.email);
    }

    // if (initValues.country != outValues.country) {
    //   setAddressesArray([]);

    //   if (initValues.nick != outValues.nick) {
    //     await db
    //       .collection("users")
    //       .doc(auth.currentUser.uid)
    //       .update({ nick: outValues.nick, country: outValues.country });

    //     //update nick in firebase auth
    //     await auth.currentUser.updateProfile({
    //       displayName: outValues.nick,
    //     });
    //   } else {
    //     await db
    //       .collection("users")
    //       .doc(auth.currentUser.uid)
    //       .update({ country: outValues.country });
    //   }

    //   //fetch all users addresses, and push them to arr

    //   const result = await db
    //     .collection("users")
    //     .doc(auth.currentUser.uid)
    //     .get();

    //   result.data().addresses.forEach(async (doc) => {
    //     await db
    //       .collection("users")
    //       .doc(auth.currentUser.uid)
    //       .update({
    //         addresses: firebase.firestore.FieldValue.arrayRemove(doc),
    //       });

    //     doc.country = outValues.country;

    //     setAddressesArray((prev) => [...prev, doc]);

    //     await db
    //       .collection("users")
    //       .doc(auth.currentUser.uid)
    //       .update({
    //         addresses: firebase.firestore.FieldValue.arrayUnion(doc),
    //       });
    //   });
    // } else {
    //   await db
    //     .collection("users")
    //     .doc(auth.currentUser.uid)
    //     .update({ nick: outValues.nick });
    // }
  } catch (error) {
    console.log(error);
  }
}
export async function deleteAddress(oldObj) {
  try {
    await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({
        addresses: firebase.firestore.FieldValue.arrayRemove(oldObj),
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function editAddress(oldObj, newObj) {
  try {
    await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({
        addresses: firebase.firestore.FieldValue.arrayRemove(oldObj),
      })
      .then(() => {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({
            addresses: firebase.firestore.FieldValue.arrayUnion(newObj),
          });
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function sendVerificationEmail(email, newObj) {
  try {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: "https://www.example.com/finishSignUp?cartId=1234",
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: "com.example.ios",
      },
      android: {
        packageName: "com.example.android",
        installApp: true,
        minimumVersion: "12",
      },
      dynamicLinkDomain: "example.page.link",
    };

    firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}

//! OTHER USERS
export async function fetchName() {
  try {
    const result = await db.collection("users").doc(auth.currentUser.uid).get();
    return result.data().nick;
  } catch (error) {
    console.log(errorCode, errorMessage);
  }
}
export async function fetchUserData() {
  const response = await db.collection("users").doc(auth.currentUser.uid).get();
  return response.data();
}
export async function fetchUsersCards() {
  try {
    let arr = [];

    const docArr = await db
      .collection("offers")
      .where("owner", "==", auth.currentUser.uid)
      .get();

    docArr.forEach((doc) => {
      let cardObj = doc.data();
      cardObj.id = doc.id;
      arr.push(cardObj);
    });

    return arr;
  } catch (error) {
    console.log(error);
  }
}

//! CART
export async function fetchCart() {
  try {
    const promise = new Promise(async (resolve, reject) => {
      const cartArr = [];
      const doc = await db.collection("users").doc(auth.currentUser.uid).get();

      if (doc.data().cart.length > 0) {
        // count sellers

        doc.data().cart.forEach(async (item, index) => {
          const card = await db.collection("offers").doc(item).get();

          if (card.exists && card.data().status === "published") {
            const owner = await fetchOwnerData(card.data().owner);

            const res = cartArr.find((item) => {
              if (item.uid === card.data().owner) {
                item.data.push({ ...card.data(), id: card.id });
                return true;
              }
            });

            if (!res) {
              cartArr.push({
                data: [{ ...card.data(), id: card.id }],
                title: owner.nick,
                uid: card.data().owner,
              });
            }

            if (index + 1 == doc.data().cart.length) {
              if (cartArr.length > 0) {
                resolve(cartArr);
              } else {
                reject(false);
              }
            }
          }
        });
      } else {
        reject("no cart");
      }
    });

    return promise;
  } catch (error) {
    console.log(error);
  }
}
export async function addToCart(offerID) {
  try {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        cart: firebase.firestore.FieldValue.arrayUnion(offerID),
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function removeFromCart(offerID) {
  try {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        cart: firebase.firestore.FieldValue.arrayRemove(offerID),
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}

//! SAVED OFFERS
export async function saveOffer(ownerId, offerId) {
  try {
    await db
      .collection("users")
      .doc(ownerId)
      .update({
        savedOffers: firebase.firestore.FieldValue.arrayUnion(offerId),
      });
    return true;
  } catch (error) {
    console.log(errorCode, errorMessage);
    return false;
  }
}
export async function unsaveOffer(ownerId, offerId) {
  try {
    await db
      .collection("users")
      .doc(ownerId)
      .update({
        savedOffers: firebase.firestore.FieldValue.arrayRemove(offerId),
      });
    return true;
  } catch (error) {
    console.log(errorCode, errorMessage);
    return false;
  }
}
export async function fetchSavedCards(setSavedCards, setLoading) {
  try {
    const outputArray = [];
    const doc = await db.collection("users").doc(auth.currentUser.uid).get();

    if (doc.data().savedOffers.length === 0) {
      setSavedCards([]);
      setLoading(false);
    }

    const arrLength = doc.data().savedOffers.length;

    const promise = new Promise((resolve, reject) => {
      doc.data().savedOffers.forEach(async (item, index) => {
        const cardDoc = await db.collection("offers").doc(item).get();
        const cardData = { ...cardDoc.data(), id: cardDoc.id };

        outputArray.push(cardData);

        if (index === arrLength - 1) resolve();
      });
    });

    await promise;
    setSavedCards(outputArray);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
}
export async function fetchSavedOffersId(setSavedOffersId) {
  try {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .onSnapshot(async (doc) => {
        setSavedOffersId(doc.data().savedOffers);
      });
  } catch (error) {
    console.log(error);
  }
}

//! MOST RECENT OFFERS
export async function fetchMostRecentOffers(setMostRecentOffers) {
  try {
    const offers = [];

    await db
      .collection("offers")
      .orderBy("timestamp", "desc")
      .where("status", "==", "published")
      .limit(10)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          let result = doc.data();
          result.id = doc.id;
          offers.push(result);
        });
      });

    setMostRecentOffers(offers);
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function fetchMoreMostRecentOffers(
  mostRecentOffers,
  setMostRecentOffers
) {
  try {
    const newOffers = [];
    const lastVisible = mostRecentOffers[mostRecentOffers.length - 1].timestamp;

    await db
      .collection("offers")
      .orderBy("timestamp", "desc")
      .where("status", "==", "published")
      .startAfter(lastVisible)
      .limit(4)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let result = doc.data();
          result.id = doc.id;
          newOffers.push(result);
        });
      });

    setMostRecentOffers((prevState) => [...prevState, ...newOffers]);
  } catch (error) {
    console.log(error);
    return false;
  }
}

// export async function setTransactionsListeners(setListenerData) {
//   const secondUserUid = (doc) => {
//     if (doc.data().members[0] == auth.currentUser.uid) {
//       return doc.data().members[1];
//     } else return doc.data().members[0];
//   };

//   db.collection("transactions")
//     .where("seller", "==", auth.currentUser.uid)
//     .onSnapshot((doc) => {
//       //
//       // {
//       //   type: sell
//       //   offers:["x", "y"]
//       // }
//       //
//       //
//       setListenerData(array);
//     });
//   db.collection("transactions")
//     .where("buyer", "==", auth.currentUser.uid)
//     .onSnapshot((doc) => {
//       //
//       // {
//       //   type: buy
//       //   offers:["x", "y"]
//       // }
//       //
//       //
//       setListenerData(array);
//     });
// }
