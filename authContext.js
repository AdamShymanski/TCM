import React, { useState, useEffect } from 'react';

import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

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

//  const [currentUser, setCurrentUser] = useState(null);
//  const [userData, setUserData] = useState(null);
//  const [globalData, setGlobalData] = useState(null);
//  const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged(async (user) => {
//     setCurrentUser(user);
//     if (user) {
//       await fetchGolablData();
//       await fetchUserData(user.uid);
//     }
//     setLoading(false);
//   });

//   if (path) {
//     if (currentUser) {
//       if (path !== '/' || '/settings' || '/support') {
//         history.push('/');
//       }
//       history.push(path);
//     }
//     if (!currentUser && (path !== '/home' || '/settings')) {
//       history.push(path);
//     }
//   }

//   return unsubscribe;
// }, []);\

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
  console.log('fetchGlobalData');
}

export async function fetchUserData(email, password) {
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

  console.log('fetchUserData');
}

export async function login(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
}

// export async function register(email, password) {
//   try {
//     let user;
//     await auth.createUserWithEmailAndPassword(email, password).then((user) => {
//       login(email, password);
//       db.collection('users').doc(user.uid).set({
//         name: 'Los Angeles',
//         state: 'CA',
//         country: 'USA',
//       });
//     });
//   } catch (error) {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log(errorCode, errorMessage);
//   }
// }

export async function register(
  email,
  password,
  name,
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
        name: name,
        address: address,
        country: country,
        postalCode: postalCode,
        phoneNumber: phoneNumber,
      });

      await login(email, password);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}
