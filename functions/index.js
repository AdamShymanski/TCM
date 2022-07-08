const request = require("request");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const stripe = require("stripe")(
  "sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75"
);

//! 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
//! sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75
const endpointSecret =
  "whsec_fe2b32369c4237e36bdacd1e74883ebebadde92f87c0eda852575649abee2e38";

admin.initializeApp();
//Stripe Account

function uuidv4() {
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

async function handleCardDeletion(id) {
  const offert = await admin.firestore().collection("offers").doc(id).get();
  const doc = await admin
    .firestore()
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
    const result = await admin
      .firestore()
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
    const result = await admin
      .firestore()
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
  await admin
    .firestore()
    .collection("cardsData")
    .doc(offert.data().cardId)
    .update(updateObj);
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "New Order",
    body: "Someone bought you card!",
    data: { someData: "Open transactions page." },
  };

  const options = {
    url: "https://exp.host/--/api/v2/push/send",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
    }
  }

  request(options, callback);

  // await fetch("https://exp.host/--/api/v2/push/send", {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Accept-encoding": "gzip, deflate",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(message),
  // });
}

exports.createStripeAccount = functions.https.onCall(async (data, context) => {
  const doc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  if (doc.data().stripe.vendorId === null) {
    const account = await stripe.accounts.create({
      type: "express",
      business_type: "individual",
      email: context.auth.token.email,
      business_profile: {
        mcc: "5947",
        name: context.auth.uid,
        product_description:
          "TCM is platform for trading your Pokémon cards.",
      },
      business_type: "individual",
    });

    //Check if account is already assigned to user
    //! Do afer successful account linking

    await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .update({ [`stripe.vendorId`]: account.id });

    var accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://ptcgmarketplace.com/returnToApp",
      return_url: "https://ptcgmarketplace.com/returnToApp",
      type: "account_onboarding",
    });
  }

  return accountLink.url;
});

exports.linkStripeAccount = functions.https.onCall(async (data, context) => {
  const doc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  const accountLink = await stripe.accountLinks.create({
    account: doc.data().stripe.vendorId,
    refresh_url: "https://ptcgmarketplace.com/returnToApp",
    return_url: "https://ptcgmarketplace.com/returnToApp",
    type: "account_onboarding",
  });

  // console.log(accountLink.url);
  return accountLink.url;
});

exports.loginStripeLink = functions.https.onCall(async (data, context) => {
  const doc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  // const link = await stripe.accounts.createLoginLink("acct_1KowCZ2S1NwHjbvs");

  const link = await stripe.accounts.createLoginLink(
    doc.data().stripe.vendorId
  );

  // console.log(accountLink.url);
  return link.url;
});

exports.fetchStripeAccount = functions.https.onCall(async (data, context) => {
  const doc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  const vendorId = doc.data().stripe.vendorId;

  const balance = await stripe.balance.retrieve({
    stripeAccount: vendorId,
  });
  const transactions = await stripe.balanceTransactions.list(
    {
      limit: 3,
    },
    { stripeAccount: vendorId }
  );

  const account = await stripe.accounts.retrieve(vendorId);

  account.balance = balance;
  account.transactions =
    transactions.data.lenght > 0 ? transactions.data : null;

  return account;
});

exports.useReferralCode = functions.https.onCall(async (data, context) => {
  let result = false;
  try {
    await admin
      .firestore()
      .collection("users")
      .doc(data.code)
      .update({
        discounts: {
          referralProgram: admin.firestore.FieldValue.arrayUnion(
            context.auth.uid
          ),
        },
      })
      .then((res) => {
        result = res;
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    return result;
  } catch (e) {
    console.log(e);
  }
});

exports.overWriteUserDocs = functions.https.onCall(async (data, context) => {
  try {
    await admin
      .firestore()
      .collection("users")
      .get()
      .then((snapshot) => {
        snapshot.forEach(async (doc) => {
          let nick, country;

          nick = doc.data().nick;
          country = doc.data().country;

          doc.ref.delete();

          await admin
            .firestore()
            .collection("users")
            .doc(doc.id)
            .set({
              nick: nick,
              country: country,
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
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        });
      });
  } catch (e) {
    console.log(e);
  }
});

exports.calculateDiscount = functions.https.onCall(async (data, context) => {
  let result = false;
  try {
    await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .get()
      .then((doc) => {
        const array = doc.data()?.discounts.referralProgram;
        array.forEach((item) => {
          result += 2;
        });
      })
      .catch((err) => {
        console.log(err);
      });

    return result;
  } catch (e) {
    console.log(e);
  }
});

exports.paymentSheet = functions.https.onCall(async (data, context) => {
  try {
    const docsArray = [];

    let finalAmount = 0;
    let { offersState, shippingMethod } = data;

    let customer,
      paymentIntent = null;

    const doc = await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .get();

    if (doc.data().stripe.merchantId) {
      customer = { id: doc.data().stripe.merchantId };
    } else {
      customer = await stripe.customers.create();
      await admin
        .firestore()
        .collection("users")
        .doc(context.auth.uid)
        .update({ [`stripe.merchantId`]: customer.id });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2020-08-27" }
    );

    const promise = new Promise((resolve, reject) => {
      offersState.forEach(async (section, masterIndex) => {
        const transactionCosts = {
          shipping: shippingMethod[section.uid].price * 100,
          cards: 0,
          fee: 0,
          discount: 0,
        };

        finalAmount += shippingMethod[section.uid].price * 100;

        section.data.forEach(async (offer, index) => {
          await admin
            .firestore()
            .collection("offers")
            .doc(offer.id)
            .get()
            .then((doc) => {
              const fetchedOffer = doc.data();

              transactionCosts.fee += Math.round(
                fetchedOffer.price * 100 * 0.09
              );

              transactionCosts.cards += fetchedOffer.price * 100;
              finalAmount += fetchedOffer.price * 100;
            });

          if (section.data.length === index + 1) {
            docsArray.push({
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
              seller: section.uid,
              buyer: context.auth.uid,
              offers: section.data,
              shipping: {
                method: data.shippingMethod[section.uid],
                address: data.shippingAddress,
                trackingNumber: null,
                sent: false,
                delivered: false,
              },
              costs: {
                cards: transactionCosts.cards,
                shipping: transactionCosts.shipping,
                discount: transactionCosts.discount,
                fee: transactionCosts.fee,
              },
              status: "unpaid",
            });

            if (offersState.length === masterIndex + 1) {
              paymentIntent = await stripe.paymentIntents.create({
                amount: finalAmount,
                currency: "usd",
                customer: customer.id,
                transfer_group: uuidv4(),
                payment_method_types: ["card"],
              });

              resolve();
            }
          }
        });
      });
    });

    return promise.then(() => {
      docsArray.forEach(async (doc) => {
        await admin
          .firestore()
          .collection("transactions")
          .doc()
          .set({ ...doc, paymentIntent: paymentIntent.id });
      });

      return {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey:
          "pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX",
      };
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

exports.stripeWebhooks = functions.https.onRequest(async (req, res) => {
  let event;
  const sig = req.headers["stripe-signature"];

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    await admin
      .firestore()
      .collection("transactions")
      .where("paymentIntent", "==", event.data.object.id)
      .get()
      .then((transactions) => {
        try {
          const promise = new Promise((resolve, reject) => {
            transactions.forEach(async (doc, index) => {
              let transferDestination = "";

              //update doc
              await admin
                .firestore()
                .collection("transactions")
                .doc(doc.id)
                .update({ status: "paid" });

              await admin
                .firestore()
                .collection("transactions")
                .doc(doc.id)
                .get()
                .then((transactionDoc) => {
                  transactionDoc.data().offers.forEach(async (offer) => {
                    await admin
                      .firestore()
                      .collection("offers")
                      .doc(offer.id)
                      .update({ status: "sold" });

                    await handleCardDeletion(offer.id);
                  });
                });

              //fetch destination id
              await admin
                .firestore()
                .collection("users")
                .doc(doc.data().seller)
                .get()
                .then(async (seller) => {
                  transferDestination = seller.data().stripe.vendorId;

                  //send notification about order
                  await sendPushNotification(seller.data().notificationToken);
                });

              await admin
                .firestore()
                .collection("users")
                .doc(doc.data().buyer)
                .update({ cart: [] });

              await stripe.transfers.create({
                amount:
                  doc.data().costs.cards +
                  doc.data().costs.shipping -
                  doc.data().costs.fee,
                currency: "usd",
                destination: transferDestination,
                transfer_group: event.data.object.transfer_group,
              });

              if (transactions.length - 1 === index) {
                resolve();
              }
            });
          });

          promise.then(() => {
            res.status(200).send("success");
          });
        } catch (err) {
          res.status(400).send(err);
        }
      });
  }
  // if (
  //   event.type === "payment_intent.canceled" ||
  //   event.type === "payment_intent.failed"
  // ) {
  //   await admin
  //     .firestore()
  //     .collection("transactions")
  //     .where("paymentIntent", "==", event.data.object.id)
  //     .get()
  //     .then((transactions) => {
  //       const promise = new Promise((resolve, reject) => {
  //         transactions.forEach(async (doc) => {
  //           await admin
  //             .firestore()
  //             .collection("transactions")
  //             .doc(doc.id)
  //             .delete();
  //         });
  //         if (transactions.length - 1 === index) {
  //           resolve();
  //         }
  //       });

  //       promise.then(() => {
  //         res.status(200).send("success");
  //       });
  //     });
  // }
  if (event.type === "account.updated") {
    const accountData = event.data.object;

    if (accountData.requirements.pending_verification.length > 0) {
      //! PEDNING VERIFICATION
      await admin
        .firestore()
        .collection("users")
        .doc(accountData.business_profile.name)
        .update({
          ["sellerProfile.status"]: "verification_pending",
        });

      //update status of all offers

      await admin
        .firestore()
        .collection("offers")
        .where("owner", "==", accountData.business_profile.name)
        .where("status", "==", "published")
        .get()
        .then((offers) => {
          if (offers.length > 0) {
            offers.forEach(async (offer) => {
              offer.ref.update({ status: "suspended" });
            });
          }
        });

      //update
    } else if (!(accountData.charges_enabled || accountData.payouts_enabled)) {
      //! RESTRICTED
      await admin
        .firestore()
        .collection("users")
        .doc(accountData.business_profile.name)
        .update({
          ["sellerProfile.status"]: "restricted",
        });

      //update status of all offers

      await admin
        .firestore()
        .collection("offers")
        .where("owner", "==", accountData.business_profile.name)
        .where("status", "==", "published")
        .get()
        .then((offers) => {
          if (offers.length > 0) {
            offers.forEach(async (offer) => {
              offer.ref.update({ status: "suspended" });
              await handleCardDeletion(offer.id);
            });
          }
        });
    } else if (
      accountData.requirements.eventually_due.length > 0 &&
      accountData.requirements.current_deadline.length === 0
    ) {
      //! ENABLED

      await admin
        .firestore()
        .collection("users")
        .doc(accountData.business_profile.name)
        .update({
          ["sellerProfile.status"]: "enabled",
        });

      //update status of all offers

      await admin
        .firestore()
        .collection("offers")
        .where("owner", "==", accountData.business_profile.name)
        .where("status", "==", "suspended")
        .get()
        .then((offers) => {
          if (offers.length > 0) {
            offers.forEach(async (offer) => {
              offer.ref.update({ status: "published" });
            });
          }
        });
    } else if (accountData.requirements.eventually_due.length === 0) {
      await admin
        .firestore()
        .collection("users")
        .doc(accountData.business_profile.name)
        .update({
          ["sellerProfile.status"]: "enabled",
        });

      await admin
        .firestore()
        .collection("offers")
        .where("owner", "==", accountData.business_profile.name)
        .where("status", "==", "suspended")
        .get()
        .then((offers) => {
          if (offers.length > 0) {
            offers.forEach(async (offer) => {
              offer.ref.update({ status: "published" });

              const doc = await admin
                .firestore()
                .collection("cardsData")
                .doc(offer.data().cardId)
                .get();

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

              db.collection("cardsData")
                .doc(offer.data().cardId)
                .update(updateObj);
            });
          }
        });
    }
  } else {
    res.status(200).send("event type not handled");
  }
});

exports.validateOffersStatus = functions.pubsub
  .schedule("every 10 minutes")
  .onRun((context) => {
    //check status of all sellerProfiles
    //if status != enabled, set status of all published offers to suspended

    admin
      .firestore()
      .collection("users")
      .where("sellerProfile.status", "!=", "enabled")
      .get()
      .then((snapshot) => {
        if (snapshot.lenght > 0) {
          snapshot.forEach(async (doc) => {
            await admin
              .firestore()
              .collection("offers")
              .where("owner", "==", doc.id)
              .where("status", "==", "published")
              .get()
              .then((offers) => {
                if (offers.length > 0) {
                  offers.forEach(async (offer) => {
                    offer.ref.update({ status: "suspended" });
                    await handleCardDeletion(offer.id);
                  });
                }
              });
          });
        }
      });
    return null;
  });

exports.deleteExpiredTransactions = functions.pubsub
  .schedule("every 10 minutes")
  .onRun((context) => {
    let currentDate = new Date();
    var pastDue = new Date(currentDate.getTime() - 600000);

    admin
      .firestore()
      .collection("transactions")
      .where("timestamp", "<", pastDue)
      .where("status", "==", "unpaid")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });

    return null;
  });
