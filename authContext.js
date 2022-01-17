import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import "firebase/auth";

import pokemon from "pokemontcgsdk";
// import * as Google from "expo-google-app-auth";

import * as GoogleSignIn from "expo-google-sign-in";

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

export const firebaseObj = firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const functions = firebase.functions();

// if (location.hostname === "localhost") {
//   functions.useEmulator("localhost", 5001);
// }

export async function fetchUserData() {
  const response = await db.collection("users").doc(auth.currentUser.uid).get();
  return response.data();
}
export async function addCard(values, gradingSwitch, photoState, cardId) {
  if (values.condition) condition = parseFloat(values.condition);
  else condition = null;

  //parse price
  values.price = parseFloat(values.price);

  db.collection(`cards`)
    .add({
      ...values,
      isGraded: gradingSwitch,
      owner: auth.currentUser.uid,
      cardId: cardId,
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
          update.collectionSize = update.collectionSize + 1;

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
export async function fetchPhotos(offerId) {
  try {
    const pathsArray = [];

    const path = "cards/" + `${offerId}/`;

    for (let i = 0; i < 3; i++) {
      var pathReference = storage.ref(path + i);

      try {
        await pathReference.getDownloadURL().then((url) => {
          pathsArray.push(url);
        });
      } catch (error) {}
    }

    return pathsArray;
  } catch (error) {
    console.log(error);
  }
}
export async function updateCard(props, outValues, initValues, valuesOrder) {
  try {
    let cardUpdateObj = {};

    outValues.forEach((item, index) => {
      const keyName = valuesOrder[index];
      if (item !== initValues[index]) cardUpdateObj[keyName] = item;
    });

    await db.collection("cards").doc(props.id).update(cardUpdateObj);

    if (outValues[0] != initValues[0]) {
      let updateObj = {
        highestPrice: null,
        lowestPrice: null,
      };

      async function searchForNewHighestPrice() {
        const result = await db
          .collection("cards")
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
          .collection("cards")
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

      await db.collection("cardsData").doc(props.cardId).update(updateObj);
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
      .update({ collectionSize: user.data().collectionSize - 1 });

    async function handleOtherChanges() {
      const offert = await db.collection("cards").doc(id).get();
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
          .collection("cards")
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
          .collection("cards")
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

    await db.collection("cards").doc(id).delete();
  } catch (error) {
    console.log(error);
  }
}
export async function fetchCardsName(id) {
  try {
    const promise = new Promise(async (resolve, reject) => {
      pokemon.card.find(id).then((card) => {
        resolve(card.name);
      });
    });
    return promise;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteAccount() {
  try {
    let arr = [];

    const result = await db
      .collection("cards")
      .where("owner", "==", auth.currentUser.uid)
      .get();

    //fetch all users card, and push them to arr
    result.forEach((doc) => {
      let cardObj = doc.data();
      cardObj.id = doc.id;
      arr.push(cardObj);
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
export async function fetchName() {
  try {
    const result = await db.collection("users").doc(auth.currentUser.uid).get();
    return result.data().nick;
  } catch (error) {
    console.log(errorCode, errorMessage);
  }
}
export async function fetchOwnerData(ownerId) {
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
    let name,
      country,
      savedOffers,
      countryCode,
      rating,
      collectionSize,
      sold,
      visits,
      bought;

    await db
      .collection("users")
      .doc(ownerId)
      .get()
      .then((doc) => {
        name = doc.data()?.nick;
        country = doc.data()?.country;
        savedOffers = doc.data()?.savedOffers;

        sold = doc.data()?.sold;
        rating = doc.data()?.rating;
        visits = doc.data()?.visits;
        bought = doc.data()?.bought;
        collectionSize = doc.data()?.collectionSize;

        countryCodes.forEach((item, i) => {
          if (item.Name == country) {
            countryCode = countryCodes[i].Code.toLowerCase();
          }
        });
      });
    return {
      name,
      country,
      savedOffers,
      countryCode,
      sold,
      rating,
      visits,
      bought,
      collectionSize,
    };
  } catch (error) {
    console.log(error);
  }
}
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
export async function fetchMostRecentOffers() {
  try {
    const offers = [];
    await db
      .collection("cards")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let result = doc.data();
          result.id = doc.id;
          offers.push(result);
        });
      });

    return offers;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function login(email, password, setError) {
  try {
    await auth.signInWithEmailAndPassword(email.trim(), password.trim());
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    setError("Wrong Credentials!");
  }
}
export async function register(email, password, nick, country, setError) {
  await auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      user.updateProfile({
        displayName: nick,
      });

      await db.collection("users").doc(user.uid).set({
        nick: nick.trim(),
        country: country.trim(),
        collectionSize: 0,
        savedOffers: [],
      });

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

    const arrLength = doc.data().savedOffers.length;

    const promise = new Promise((resolve, reject) => {
      doc.data().savedOffers.forEach(async (item, index) => {
        const cardDoc = await db.collection("cards").doc(item).get();
        const cardData = cardDoc.data();
        cardData.id = cardDoc.id;
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
export async function fetchOffers(id, filterParams) {
  try {
    const arr = [];

    //language filter localy

    if (id) {
      let docArr = db.collection("cards").where("cardId", "==", id);

      const languageFilter = (offer) => {
        if (filterParams.language.length === 0) return true;
        return filterParams.language.includes(offer.language);
      };

      if (filterParams.graded) {
        if (
          filterParams.price.from &&
          filterParams.price.to &&
          filterParams.condition
        ) {
          docArr = db
            .collection("cards")
            .where("cardId", "==", id)
            .where("price", ">=", filterParams.price.from)
            .where("price", "<=", filterParams.price.to)
            .where("condition", "==", filterParams.condition)
            .where("isGraded", "==", true);
        } else if (filterParams.condition) {
          docArr = db
            .collection("cards")
            .where("cardId", "==", id)
            .where("condition", "==", filterParams.condition)
            .where("isGraded", "==", true);
        } else if (filterParams.price.from && filterParams.price.to) {
          docArr = db
            .collection("cards")
            .where("cardId", "==", id)
            .where("price", ">=", filterParams.price.from)
            .where("price", "<=", filterParams.price.to)
            .where("isGraded", "==", true);
        } else {
          docArr = db
            .collection("cards")
            .where("cardId", "==", id)
            .where("isGraded", "==", true);
        }
      } else if (filterParams.condition) {
        if (filterParams.price.from && filterParams.price.to) {
          docArr = db
            .collection("cards")
            .where("cardId", "==", id)
            .where("price", ">=", filterParams.price.from)
            .where("price", "<=", filterParams.price.to)
            .where("condition", "==", filterParams.condition);
        } else {
          docArr = db
            .collection("cards")
            .where("cardId", "==", id)
            .where("condition", "==", filterParams.condition);
        }
      } else if (filterParams.price.from && filterParams.price.to) {
        docArr = db
          .collection("cards")
          .where("cardId", "==", id)
          .where("price", ">=", filterParams.price.from)
          .where("price", "<=", filterParams.price.to);
      }

      const snapshot = await docArr.get();

      snapshot.forEach((doc) => {
        let offers = doc.data();
        offers.id = doc.id;
        console.log(doc.data());

        if (languageFilter(offers)) arr.push(offers);
      });

      return arr;
    } else return [];
  } catch (error) {
    console.log(error);
  }
}
export async function fetchMoreCards(props, setProps) {
  try {
    pokemon.configure({ apiKey: "6aa1ef65-fa80-4ea4-b35f-9466d2add1a6" });

    let initArray = [...props.cardsData];

    const clearOutArray = (array) => {
      let arrayOfIds = [];

      array.forEach((item, index) => {
        if (arrayOfIds.includes(item.id) || props.cardsData.includes(item.id)) {
          array.splice(index, 1);
        } else {
          arrayOfIds.push(item.id);
        }
      });

      // arrayOfIds = [];

      return array;
    };

    if (!/\d/.test(props.inputValue)) {
      const result = await pokemon.card.where({
        q: `name:${props.inputValue}`,
        pageSize: 5,
        page: props.pageNumber,
        orderBy:
          props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
      });

      initArray = [...initArray, ...result.data];

      if (props.inputValue.split(" ").length > 1) {
        const sArg = props.inputValue.split(" ");

        const result1 = await pokemon.card.where({
          q: `name:${sArg[1]} subtypes:${sArg[0]}`,
          pageSize: 5,
          page: props.pageNumber,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
        });

        initArray = [...initArray, ...result1.data];

        const result2 = await pokemon.card.where({
          q: `name:${sArg[0]} subtypes:${sArg[1]}`,
          pageSize: 5,
          page: props.pageNumber,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
        });

        initArray = [...initArray, ...result2.data];

        const result3 = await pokemon.card.where({
          q: `name:${props.inputValue} rarity:${parseRarity(sArg[0])}`,
          pageSize: 5,
          page: props.pageNumber,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
        });

        initArray = [...initArray, ...result3.data];

        const result4 = await pokemon.card.where({
          q: `name:${props.inputValue} rarity:${parseRarity(sArg[1])}`,
          pageSize: 5,
          page: props.pageNumber,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
        });

        initArray = [...initArray, ...result4.data];

        const result5 = await pokemon.card.where({
          q: `name:${props.inputValue} rarity:${parseRarity(
            sArg[1] + sArg[2]
          )}`,
          pageSize: 5,
          page: props.pageNumber,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
        });

        initArray = [...initArray, ...result5.data];

        const result6 = await pokemon.card.where({
          q: `name:${props.inputValue} rarity:${parseRarity(sArg[2])}`,
          pageSize: 5,
          page: props.pageNumber,
          orderBy:
            props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
        });

        initArray = [...initArray, ...result6.data];
      }
    } else {
      const sArg = props.inputValue.split("/");
      const result = await pokemon.card.where({
        q: `number:${sArg[0]} set.printedTotal:${sArg[1]}`,
        pageSize: 5,
        page: props.pageNumber,
        orderBy:
          props.sorterParams === "Rarity Declining" ? "-rarity" : "+rarity",
      });
      initArray = [...initArray, ...result.data];
    }

    const idsArray = [];
    initArray.forEach((item, index, array) => {
      idsArray.forEach((id) => {
        if (id == item.id) {
          array.splice(index, 1);
        } else {
          idsArray.push(item.id);
        }
      });
    });

    setProps((prevState) => ({
      ...prevState,
      cardsData: clearOutArray(initArray),
    }));

    // setBigCardsData([...initArray]);
  } catch (error) {
    console.log(error);
  }
}
export async function fetchCards(props, setProps) {
  try {
    pokemon.configure({ apiKey: "3c362cd9-2286-48d4-989a-0d2a65b9d5a8" });

    // setProps((prevState) => ({ ...prevState, loadingState: true }));

    let initArray = [];

    const clearOutArray = (array) => {
      let arrayOfIds = [];

      array.forEach((item, index) => {
        if (arrayOfIds.includes(item.id) || props.cardsData.includes(item.id)) {
          array.splice(index, 1);
        } else {
          arrayOfIds.push(item.id);
        }
      });

      // arrayOfIds = [];

      return array;
    };

    if (props.inputValue) {
      const sArg = props.inputValue.split(" ");

      if (!/\d/.test(props.inputValue)) {
        if (props.inputValue.split(" ").length > 1) {
          let parsedArg;
          props.inputValue.split(" ").forEach((item, index) => {
            if (index == 0) {
              parsedArg = item + "*";
              return;
            }
            if (index == props.inputValue.split(" ").length - 1) {
              parsedArg = parsedArg + item;
              return;
            }
            parsedArg = parsedArg + item + "*";
          });

          try {
            const result = await pokemon.card.where({
              q: `name:${parsedArg}`,
              pageSize: 10,
              page: 1,
              orderBy: props.sorterParams,
            });

            initArray = [...initArray, ...result.data];
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            const result = await pokemon.card.where({
              q: `name:${sArg}`,
              pageSize: 10,
              page: 1,
              orderBy: props.sorterParams,
            });

            initArray = [...initArray, ...result.data];
          } catch (error) {
            console.log(error);
          }
        }

        if (props.inputValue.split(" ").length > 1) {
          try {
            const result1 = await pokemon.card.where({
              q: `name:${sArg[1]} subtypes:${sArg[0]}`,
              pageSize: 5,
              page: 1,
              orderBy: props.sorterParams,
            });

            initArray = [...initArray, ...result1.data];
          } catch (error) {
            console.log(error);
          }

          try {
            const result2 = await pokemon.card.where({
              q: `name:${sArg[0]} subtypes:${sArg[1]}`,
              pageSize: 5,
              page: 1,
              orderBy: props.sorterParams,
            });

            initArray = [...initArray, ...result2.data];
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        const sArg = props.inputValue.split("/");
        try {
          const result = await pokemon.card.where({
            q: `number:${sArg[0]} set.printedTotal:${sArg[1]}`,
            pageSize: 5,
            page: 1,
            orderBy: props.sorterParams,
          });
          initArray = [...initArray, ...result.data];
        } catch (error) {
          console.log(error);
        }
      }
    }

    setProps((prevState) => ({
      ...prevState,
      cardsData: clearOutArray(initArray),
    }));
  } catch (error) {
    console.log(error);
  }
}
export async function fetchBigCardsDetails(id, setDetails, mounted) {
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
export async function fetchUsersCards() {
  try {
    let arr = [];

    const docArr = await db
      .collection("cards")
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
export async function fetchSavedOffersId(setSavedOffersId, setProps) {
  try {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .onSnapshot(async (doc) => {
        setSavedOffersId(doc.data().savedOffers);
        setProps((prevState) => ({
          ...prevState,
          loadingState: false,
        }));
      });
  } catch (error) {
    console.log(error);
  }
}
export async function updateUserData(outValues) {
  try {
    await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({ nick: outValues.nick, country: outValues.country });
  } catch (error) {
    console.log(error);
  }
}
export async function createChat(message, secondUserUid, setChatRef) {
  db.collection("chats")
    .add({
      members: [auth.currentUser.uid, secondUserUid],
      lastMessage: "",
      notificationFor: secondUserUid,
    })
    .then(async (doc) => {
      db.collection(`chats/${doc.id}/messages`)
        .add(message[0])
        .then(async (messageDoc) => {
          await db
            .collection(`chats`)
            .doc(doc.id)
            .update({ lastMessage: messageDoc.id });

          setChatRef(`chats/${doc.id}/messages`);
        });
    });
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
export async function requestApi() {
  try {
    // firebase.functions().useFunctionsEmulator("http://0.0.0.0:5000");
    // firebase.functions().useFunctionsEmulator("http://0.0.0.0:5001");

    // firebase.functions("us-central1").useEmulator("0.0.0.0", 5001);
    // firebase.functions().useEmulator("0.0.0.0", 5001);
    const addMessage = firebase.functions().httpsCallable("paymentSheet");

    addMessage()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    return false;
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

function parseRarity(inputString) {
  return `Rare ${inputString}`;
}
