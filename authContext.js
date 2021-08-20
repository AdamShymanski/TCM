import React, { useState, useEffect } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import pokemon from 'pokemontcgsdk';

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBYXMfnN1cLq2NyAIrQn88ifogby7uq0tc',
    authDomain: 'ptcg-marketplace.firebaseapp.com',
    projectId: 'ptcg-marketplace',
    storageBucket: 'ptcg-marketplace.appspot.com',
    messagingSenderId: '304927127181',
    appId: '1:304927127181:web:d3b78fa4817b4dd65e94c4',
    measurementId: 'G-82QFXZ4BJR',
  });
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export async function fetchGlobalData(email, password) {
  // auth
  //   .signInWithEmailAndPassword(email, password)
  //   .then((userCredential) => {
  //     // Signed in
  //     userState = userCredential.user;

  //     // ...
  //   })
  //   .catch((error) => {
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //   });
  return ' fetchGlobalData';
}

export async function addCard(values, gradingSwitch, photoState) {
  const cnArray = values.cardNumber.split('/');
  const cnOutput = cnArray[0] + '-' + cnArray[1];

  const price = parseInt(values.price);

  let condition;

  if (values.condition) condition = parseInt(values.condition);
  else condition = null;

  db.collection(`cards`)
    .add({
      ...values,
      price: price,
      condition,
      isGraded: gradingSwitch,
      owner: auth.currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(async (docRef) => {
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

    const path = 'cards/' + `${offerId}/`;

    for (let i = 0; i < 3; i++) {
      var pathReference = storage.ref(path + i);

      await pathReference.getDownloadURL().then((url) => {
        pathsArray.push(url);
      });
    }

    return pathsArray;
  } catch (error) {
    console.log(error);
  }
}
export async function fetchBigCards() {
  try {
    pokemon.configure({ apiKey: '6aa1ef65-fa80-4ea4-b35f-9466d2add1a6' });

    const result = await pokemon.card.where({
      q: 'number:30 set.printedTotal:111',
    });
    
    // .then((result) => {
    //   console.log(result.data[0].images.large);
    //   setImage(result.data[0].images.large);
    // });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchOwnerData(ownerId) {
  const countryCodes = [
    { Code: 'AF', Name: 'Afghanistan' },
    { Code: 'AL', Name: 'Albania' },
    { Code: 'DZ', Name: 'Algeria' },
    { Code: 'AS', Name: 'American Samoa' },
    { Code: 'AD', Name: 'Andorra' },
    { Code: 'AO', Name: 'Angola' },
    { Code: 'AI', Name: 'Anguilla' },
    { Code: 'AQ', Name: 'Antarctica' },
    { Code: 'AG', Name: 'Antigua and Barbuda' },
    { Code: 'AR', Name: 'Argentina' },
    { Code: 'AM', Name: 'Armenia' },
    { Code: 'AW', Name: 'Aruba' },
    { Code: 'AU', Name: 'Australia' },
    { Code: 'AT', Name: 'Austria' },
    { Code: 'AZ', Name: 'Azerbaijan' },
    { Code: 'BS', Name: 'Bahamas' },
    { Code: 'BH', Name: 'Bahrain' },
    { Code: 'BD', Name: 'Bangladesh' },
    { Code: 'BB', Name: 'Barbados' },
    { Code: 'BY', Name: 'Belarus' },
    { Code: 'BE', Name: 'Belgium' },
    { Code: 'BZ', Name: 'Belize' },
    { Code: 'BJ', Name: 'Benin' },
    { Code: 'BM', Name: 'Bermuda' },
    { Code: 'BT', Name: 'Bhutan' },
    { Code: 'BW', Name: 'Botswana' },
    { Code: 'BV', Name: 'Bouvet Island' },
    { Code: 'BR', Name: 'Brazil' },
    { Code: 'IO', Name: 'British Indian Ocean Territory' },
    { Code: 'BN', Name: 'Brunei Darussalam' },
    { Code: 'BG', Name: 'Bulgaria' },
    { Code: 'BF', Name: 'Burkina Faso' },
    { Code: 'BI', Name: 'Burundi' },
    { Code: 'KH', Name: 'Cambodia' },
    { Code: 'CM', Name: 'Cameroon' },
    { Code: 'CA', Name: 'Canada' },
    { Code: 'CV', Name: 'Cape Verde' },
    { Code: 'KY', Name: 'Cayman Islands' },
    { Code: 'CF', Name: 'Central African Republic' },
    { Code: 'TD', Name: 'Chad' },
    { Code: 'CL', Name: 'Chile' },
    { Code: 'CN', Name: 'China' },
    { Code: 'CX', Name: 'Christmas Island' },
    { Code: 'CC', Name: 'Cocos (Keeling) Islands' },
    { Code: 'CO', Name: 'Colombia' },
    { Code: 'KM', Name: 'Comoros' },
    { Code: 'CG', Name: 'Congo' },
    { Code: 'CD', Name: 'Congo, the Democratic Republic of the' },
    { Code: 'CK', Name: 'Cook Islands' },
    { Code: 'CR', Name: 'Costa Rica' },
    { Code: 'HR', Name: 'Croatia' },
    { Code: 'CU', Name: 'Cuba' },
    { Code: 'CY', Name: 'Cyprus' },
    { Code: 'CZ', Name: 'Czech Republic' },
    { Code: 'DK', Name: 'Denmark' },
    { Code: 'DJ', Name: 'Djibouti' },
    { Code: 'DM', Name: 'Dominica' },
    { Code: 'DO', Name: 'Dominican Republic' },
    { Code: 'EC', Name: 'Ecuador' },
    { Code: 'EG', Name: 'Egypt' },
    { Code: 'SV', Name: 'El Salvador' },
    { Code: 'GQ', Name: 'Equatorial Guinea' },
    { Code: 'ER', Name: 'Eritrea' },
    { Code: 'EE', Name: 'Estonia' },
    { Code: 'ET', Name: 'Ethiopia' },
    { Code: 'FK', Name: 'Falkland Islands (Malvinas)' },
    { Code: 'FO', Name: 'Faroe Islands' },
    { Code: 'FJ', Name: 'Fiji' },
    { Code: 'FI', Name: 'Finland' },
    { Code: 'FR', Name: 'France' },
    { Code: 'GF', Name: 'French Guiana' },
    { Code: 'PF', Name: 'French Polynesia' },
    { Code: 'TF', Name: 'French Southern Territories' },
    { Code: 'GA', Name: 'Gabon' },
    { Code: 'GM', Name: 'Gambia' },
    { Code: 'GE', Name: 'Georgia' },
    { Code: 'DE', Name: 'Germany' },
    { Code: 'GH', Name: 'Ghana' },
    { Code: 'GI', Name: 'Gibraltar' },
    { Code: 'GR', Name: 'Greece' },
    { Code: 'GL', Name: 'Greenland' },
    { Code: 'GD', Name: 'Grenada' },
    { Code: 'GP', Name: 'Guadeloupe' },
    { Code: 'GU', Name: 'Guam' },
    { Code: 'GT', Name: 'Guatemala' },
    { Code: 'GG', Name: 'Guernsey' },
    { Code: 'GN', Name: 'Guinea' },
    { Code: 'GW', Name: 'Guinea-Bissau' },
    { Code: 'GY', Name: 'Guyana' },
    { Code: 'HT', Name: 'Haiti' },
    { Code: 'HM', Name: 'Heard Island and McDonald Islands' },
    { Code: 'VA', Name: 'Holy See (Vatican City State)' },
    { Code: 'HN', Name: 'Honduras' },
    { Code: 'HK', Name: 'Hong Kong' },
    { Code: 'HU', Name: 'Hungary' },
    { Code: 'IS', Name: 'Iceland' },
    { Code: 'IN', Name: 'India' },
    { Code: 'ID', Name: 'Indonesia' },
    { Code: 'IR', Name: 'Iran, Islamic Republic of' },
    { Code: 'IQ', Name: 'Iraq' },
    { Code: 'IE', Name: 'Ireland' },
    { Code: 'IM', Name: 'Isle of Man' },
    { Code: 'IL', Name: 'Israel' },
    { Code: 'IT', Name: 'Italy' },
    { Code: 'JM', Name: 'Jamaica' },
    { Code: 'JP', Name: 'Japan' },
    { Code: 'JE', Name: 'Jersey' },
    { Code: 'JO', Name: 'Jordan' },
    { Code: 'KZ', Name: 'Kazakhstan' },
    { Code: 'KE', Name: 'Kenya' },
    { Code: 'KI', Name: 'Kiribati' },
    { Code: 'KP', Name: "Korea, Democratic People's Republic of" },
    { Code: 'KR', Name: 'Korea, Republic of' },
    { Code: 'KW', Name: 'Kuwait' },
    { Code: 'KG', Name: 'Kyrgyzstan' },
    { Code: 'LA', Name: "Lao People's Democratic Republic" },
    { Code: 'LV', Name: 'Latvia' },
    { Code: 'LB', Name: 'Lebanon' },
    { Code: 'LS', Name: 'Lesotho' },
    { Code: 'LR', Name: 'Liberia' },
    { Code: 'LY', Name: 'Libya' },
    { Code: 'LI', Name: 'Liechtenstein' },
    { Code: 'LT', Name: 'Lithuania' },
    { Code: 'LU', Name: 'Luxembourg' },
    { Code: 'MO', Name: 'Macao' },
    { Code: 'MK', Name: 'Macedonia, the Former Yugoslav Republic of' },
    { Code: 'MG', Name: 'Madagascar' },
    { Code: 'MW', Name: 'Malawi' },
    { Code: 'MY', Name: 'Malaysia' },
    { Code: 'MV', Name: 'Maldives' },
    { Code: 'ML', Name: 'Mali' },
    { Code: 'MT', Name: 'Malta' },
    { Code: 'MH', Name: 'Marshall Islands' },
    { Code: 'MQ', Name: 'Martinique' },
    { Code: 'MR', Name: 'Mauritania' },
    { Code: 'MU', Name: 'Mauritius' },
    { Code: 'YT', Name: 'Mayotte' },
    { Code: 'MX', Name: 'Mexico' },
    { Code: 'FM', Name: 'Micronesia, Federated States of' },
    { Code: 'MD', Name: 'Moldova, Republic of' },
    { Code: 'MC', Name: 'Monaco' },
    { Code: 'MN', Name: 'Mongolia' },
    { Code: 'ME', Name: 'Montenegro' },
    { Code: 'MS', Name: 'Montserrat' },
    { Code: 'MA', Name: 'Morocco' },
    { Code: 'MZ', Name: 'Mozambique' },
    { Code: 'MM', Name: 'Myanmar' },
    { Code: 'NA', Name: 'Namibia' },
    { Code: 'NR', Name: 'Nauru' },
    { Code: 'NP', Name: 'Nepal' },
    { Code: 'NL', Name: 'Netherlands' },
    { Code: 'NC', Name: 'New Caledonia' },
    { Code: 'NZ', Name: 'New Zealand' },
    { Code: 'NI', Name: 'Nicaragua' },
    { Code: 'NE', Name: 'Niger' },
    { Code: 'NG', Name: 'Nigeria' },
    { Code: 'NU', Name: 'Niue' },
    { Code: 'NF', Name: 'Norfolk Island' },
    { Code: 'MP', Name: 'Northern Mariana Islands' },
    { Code: 'NO', Name: 'Norway' },
    { Code: 'OM', Name: 'Oman' },
    { Code: 'PK', Name: 'Pakistan' },
    { Code: 'PW', Name: 'Palau' },
    { Code: 'PS', Name: 'Palestine, State of' },
    { Code: 'PA', Name: 'Panama' },
    { Code: 'PG', Name: 'Papua New Guinea' },
    { Code: 'PY', Name: 'Paraguay' },
    { Code: 'PE', Name: 'Peru' },
    { Code: 'PH', Name: 'Philippines' },
    { Code: 'PN', Name: 'Pitcairn' },
    { Code: 'PL', Name: 'Poland' },
    { Code: 'PT', Name: 'Portugal' },
    { Code: 'PR', Name: 'Puerto Rico' },
    { Code: 'QA', Name: 'Qatar' },
    { Code: 'RO', Name: 'Romania' },
    { Code: 'RU', Name: 'Russian Federation' },
    { Code: 'RW', Name: 'Rwanda' },
    { Code: 'SH', Name: 'Saint Helena, Ascension and Tristan da Cunha' },
    { Code: 'KN', Name: 'Saint Kitts and Nevis' },
    { Code: 'LC', Name: 'Saint Lucia' },
    { Code: 'MF', Name: 'Saint Martin (French part)' },
    { Code: 'PM', Name: 'Saint Pierre and Miquelon' },
    { Code: 'VC', Name: 'Saint Vincent and the Grenadines' },
    { Code: 'WS', Name: 'Samoa' },
    { Code: 'SM', Name: 'San Marino' },
    { Code: 'ST', Name: 'Sao Tome and Principe' },
    { Code: 'SA', Name: 'Saudi Arabia' },
    { Code: 'SN', Name: 'Senegal' },
    { Code: 'RS', Name: 'Serbia' },
    { Code: 'SC', Name: 'Seychelles' },
    { Code: 'SL', Name: 'Sierra Leone' },
    { Code: 'SG', Name: 'Singapore' },
    { Code: 'SX', Name: 'Sint Maarten (Dutch part)' },
    { Code: 'SK', Name: 'Slovakia' },
    { Code: 'SI', Name: 'Slovenia' },
    { Code: 'SB', Name: 'Solomon Islands' },
    { Code: 'SO', Name: 'Somalia' },
    { Code: 'ZA', Name: 'South Africa' },
    { Code: 'GS', Name: 'South Georgia and the South Sandwich Islands' },
    { Code: 'SS', Name: 'South Sudan' },
    { Code: 'ES', Name: 'Spain' },
    { Code: 'LK', Name: 'Sri Lanka' },
    { Code: 'SD', Name: 'Sudan' },
    { Code: 'SR', Name: 'Suriname' },
    { Code: 'SJ', Name: 'Svalbard and Jan Mayen' },
    { Code: 'SZ', Name: 'Swaziland' },
    { Code: 'SE', Name: 'Sweden' },
    { Code: 'CH', Name: 'Switzerland' },
    { Code: 'SY', Name: 'Syrian Arab Republic' },
    { Code: 'TW', Name: 'Taiwan, Province of China' },
    { Code: 'TJ', Name: 'Tajikistan' },
    { Code: 'TZ', Name: 'Tanzania, United Republic of' },
    { Code: 'TH', Name: 'Thailand' },
    { Code: 'TL', Name: 'Timor-Leste' },
    { Code: 'TG', Name: 'Togo' },
    { Code: 'TK', Name: 'Tokelau' },
    { Code: 'TO', Name: 'Tonga' },
    { Code: 'TT', Name: 'Trinidad and Tobago' },
    { Code: 'TN', Name: 'Tunisia' },
    { Code: 'TR', Name: 'Turkey' },
    { Code: 'TM', Name: 'Turkmenistan' },
    { Code: 'TC', Name: 'Turks and Caicos Islands' },
    { Code: 'TV', Name: 'Tuvalu' },
    { Code: 'UG', Name: 'Uganda' },
    { Code: 'UA', Name: 'Ukraine' },
    { Code: 'AE', Name: 'United Arab Emirates' },
    { Code: 'GB', Name: 'United Kingdom' },
    { Code: 'US', Name: 'United States' },
    { Code: 'UM', Name: 'United States Minor Outlying Islands' },
    { Code: 'UY', Name: 'Uruguay' },
    { Code: 'UZ', Name: 'Uzbekistan' },
    { Code: 'VU', Name: 'Vanuatu' },
    { Code: 'VE', Name: 'Venezuela, Bolivarian Republic of' },
    { Code: 'VN', Name: 'Viet Nam' },
    { Code: 'VG', Name: 'Virgin Islands, British' },
    { Code: 'VI', Name: 'Virgin Islands, U.S.' },
    { Code: 'WF', Name: 'Wallis and Futuna' },
    { Code: 'EH', Name: 'Western Sahara' },
    { Code: 'YE', Name: 'Yemen' },
    { Code: 'ZM', Name: 'Zambia' },
    { Code: 'ZW', Name: 'Zimbabwe' },
  ];

  try {
    let name, reputation, collectionSize, country, savedOffers, countryCode;
    await db
      .collection('users')
      .doc(ownerId)
      .get()
      .then((doc) => {
        name = doc.data().nick;
        reputation = doc.data().reputation;
        collectionSize = doc.data().collectionSize;
        savedOffers = doc.data().savedOffers;
        country = doc.data().country;

        countryCodes.forEach((item, i) => {
          if (item.Name == country) {
            countryCode = countryCodes[i].Code.toLowerCase();
          }
        });
      });
    return {
      name,
      collectionSize,
      reputation,
      country,
      savedOffers,
      countryCode,
    };
  } catch (error) {
    console.log(errorCode, errorMessage);
  }
}

export async function saveOffer(ownerId, offerId) {
  try {
    await db
      .collection('users')
      .doc(ownerId)
      .update({
        savedOffers: firebase.firestore.FieldValue.arrayUnion(offerId),
      });
  } catch (error) {
    console.log(errorCode, errorMessage);
  }
}

export async function unsaveOffer(ownerId, offerId) {
  try {
    await db
      .collection('users')
      .doc(ownerId)
      .update({
        savedOffers: firebase.firestore.FieldValue.arrayRemove(offerId),
      });
  } catch (error) {
    console.log(errorCode, errorMessage);
  }
}

export async function fetchCards(cardNumber) {
  try {
    let arr = [];

    const docArr = await db.collection('cards').get();

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

export const fetchSavedCards = async () => {
  try {
    let arr = [];

    const doc = await db.collection('users').doc(auth.currentUser.uid).get();
    const length = await doc.data().savedOffers.length;

    const promise = new Promise((resolve, reject) => {
      doc.data().savedOffers.forEach(async (item, i) => {
        const innerDoc = await db.collection('cards').doc(item).get();
        const obj = innerDoc.data();
        obj.id = innerDoc.id;
        arr.push(obj);

        if (i + 1 === length) resolve();
      });
    });

    return promise.then(() => {
      return arr;
    });
  } catch (error) {
    console.log(error);
  }
};

export async function login(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
}

export async function register(
  email,
  password,
  nick,
  address,
  postalCode,
  country,
  phoneNumber
) {
  await auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      await db.collection('users').doc(user.uid).set({
        nick: nick,
        address: address,
        country: country,
        postalCode: postalCode,
        phoneNumber: phoneNumber,
        reputation: 0,
        collectionSize: 0,
        savedOffers: [],
      });

      await login(email, password);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}
