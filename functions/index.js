const request = require("request");
// import { pokemon } from "pokemontcgsdk";
const pokemon = require("pokemontcgsdk");

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const stream_chat = require("stream-chat");
const stripe = require("stripe")(
  "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"
);
//! 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
//! sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75

const endpointSecret =
  "whsec_fe2b32369c4237e36bdacd1e74883ebebadde92f87c0eda852575649abee2e38";

pokemon.configure({ apiKey: "3c362cd9-2286-48d4-989a-0d2a65b9d5a8" });

admin.initializeApp();
//Stripe Account

const api_key = "nfnwsdq54g3b";
const api_secret =
  "3fzhjfk2spyxw8tmxeudfj4thqu3q2ftbure2qqxgpqrth7nv8dwahp45b6cc4pk";
const serverClient = stream_chat.StreamChat.getInstance(api_key, api_secret);

const SENDGRID_API_KEY =
  "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";
sgMail.setApiKey(SENDGRID_API_KEY);

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

exports.deleteChatUser = functions.https.onCall(async (data, context) => {
  try {
    await serverClient.deleteUser(context.auth.uid, {
      mark_messages_deleted: false,
    });

    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
});

exports.createStripeAccount = functions.https.onCall(async (data, context) => {
  try {
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
        refresh_url: "https://tcmarket.place/return-to-the-app/",
        return_url: "https://tcmarket.place/return-to-the-app/",
        type: "account_onboarding",
      });
    }

    return accountLink.url;
  } catch (err) {
    console.log(err);
  }
});

exports.loginStripeLink = functions.https.onCall(async (data, context) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
});

exports.linkStripeAccount = functions.https.onCall(async (data, context) => {
  try {
    const doc = await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .get();

    const accountLink = await stripe.accountLinks.create({
      account: doc.data().stripe.vendorId,
      refresh_url: "https://tcmarket.place/return-to-the-app/",
      return_url: "https://tcmarket.place/return-to-the-app/",
      type: "account_onboarding",
    });

    // console.log(accountLink.url);
    return accountLink.url;
  } catch (err) {
    console.log(err);
  }
});

exports.createChatToken = functions.https.onCall(async (data, context) => {
  try {
    const token = serverClient.createToken(context.auth.uid);

    await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .update({ chatToken: token });

    return token;
  } catch (err) {
    console.log(err);
  }
});

// exports.getStripeAccount = functions.https.onCall(async (data, context) => {
//   const doc = await admin
//     .firestore()
//     .collection("users")
//     .doc(context.auth.uid)
//     .get();

//   const vendorId = doc.data().stripe.vendorId;

//   const account = await stripe.accounts.retrieve(vendorId);
//   const balance = await stripe.balance.retrieve({
//     stripeAccount: vendorId,
//   });

//   const transactions = await stripe.balanceTransactions.list(
//     {
//       limit: 3,
//     },
//     { stripeAccount: vendorId }
//   );

//   account.balance = balance;
//   account.transactions =
//     transactions.data.lenght > 0 ? transactions.data : null;

//   return account;
// });

exports.fetchStripeAccount = functions.https.onCall(async (data, context) => {
  try {
    const doc = await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .get();

    const vendorId = doc.data().stripe.vendorId;

    const account = await stripe.accounts.retrieve(vendorId);
    const balance = await stripe.balance.retrieve({
      stripeAccount: vendorId,
    });

    const transactions = await stripe.balanceTransactions.list(
      {
        limit: 3,
      },
      { stripeAccount: vendorId }
    );

    account.balance = balance;
    account.transactions =
      transactions.data.lenght > 0 ? transactions.data : null;

    return account;
  } catch (err) {
    console.log(err);
  }
});

exports.useReferralCode = functions.https.onCall(async (data, context) => {
  let result = false;
  try {
    // await admin
    //   .firestore()
    //   .collection("users")
    //   .doc(data.code)
    //   .update({
    //     discounts: {
    //       referralProgram: admin.firestore.FieldValue.arrayUnion(
    //         context.auth.uid
    //       ),
    //     },
    //   })
    //   .then((res) => {
    //     result = res;
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    return result;
  } catch (e) {
    console.log(e);
  }
});

// exports.calculateDiscount = functions.https.onCall(async (data, context) => {
//   let result = false;
//   try {
//     await admin
//       .firestore()
//       .collection("users")
//       .doc(context.auth.uid)
//       .get()
//       .then((doc) => {
//         const array = doc.data()?.discounts.referralProgram;
//         array.forEach((item) => {
//           result += 2;
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     return result;
//   } catch (e) {
//     console.log(e);
//   }
// });

exports.paymentSheet = functions.https.onCall(async (data, context) => {
  try {
    const docsArray = [];

    let { offersState, shippingMethod, shippingAddress } = data;

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
      const emailAddress = await admin
        .auth()
        .getUser(context.auth.uid)
        .then((userRecord) => userRecord.toJSON().email);

      customer = await stripe.customers.create({
        email: emailAddress,
        name: doc.data().nick,
      });

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
      let finalAmount = 0;
      offersState.forEach(async (section, masterIndex) => {
        finalAmount += shippingMethod[section.uid].price * 100;
        let transactionCosts = {
          cards: 0,
          shipping: shippingMethod[section.uid].price * 100,
        };
        section.data.forEach(async (offer, index) => {
          await admin
            .firestore()
            .collection("offers")
            .doc(offer.id)
            .get()
            .then((offerObject) => {
              transactionCosts.cards += offerObject.data().price * 100;
              finalAmount += transactionCosts.cards;
            });

          if (section.data.length === index + 1) {
            docsArray.push({
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
              seller: section.uid,
              buyer: context.auth.uid,
              offers: section.data,
              shipping: {
                method: shippingMethod[section.uid],
                address: shippingAddress,
                trackingNumber: null,
                sent: false,
                delivered: false,
              },
              costs: {
                cards: transactionCosts.cards,
                shipping: transactionCosts.shipping,
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
        id: paymentIntent.id,
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey:
          "pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX",

        //"pk_live_51KDXfNCVH1iPNeBrTGAw1ZFwnNCTNO3rJ23zBni3ohGDWO8zuby2xDw3dYiHabs2furS1EAgQKq3hdtR2PP2jPZr00JCFvS9h8",
      };
    });
  } catch (e) {
    console.log(e);
    // return e;
  }
});

exports.cancelPaymentSheet = functions.https.onCall(async (data, context) => {
  try {
    console.log(data);
    await stripe.paymentIntents.cancel(data.paymentIntent);
  } catch (e) {
    console.log(e);
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
          transactions.forEach(async (doc, index) => {
            const msg = {
              from: {
                email: "sales@tcmarket.place",
                name: "TCM",
              },
              templateId: "d-0c7fc69547ec40f2b778421535729a31",
              subject: "Order Confirmation",
              dynamicTemplateData: {
                order_id: doc.id,
              },
            };

            await admin
              .firestore()
              .collection("users")
              .doc(doc.data().buyer)
              .update({
                cart: [],
                ["sellerProfile.statistics.purchases"]:
                  admin.firestore.FieldValue.increment(
                    +doc.data().offers.length
                  ),
              });

            await admin
              .firestore()
              .collection("users")
              .doc(doc.data().seller)
              .update({
                ["sellerProfile.statistics.numberOfOffers"]:
                  admin.firestore.FieldValue.increment(
                    -doc.data().offers.length
                  ),
                ["sellerProfile.statistics.sales"]:
                  admin.firestore.FieldValue.increment(
                    +doc.data().offers.length
                  ),
              });

            await admin
              .firestore()
              .collection("transactions")
              .doc(doc.id)
              .update({ status: "paid" });

            msg.dynamicTemplateData.shipping_address = {
              name:
                doc.data().shipping.address.firstName +
                " " +
                doc.data().shipping.address.lastName,
              street1: doc.data().shipping.address.streetAddress1,
              street2: doc.data().shipping.address.streetAddress2,
              city: doc.data().shipping.address.city,
              state: doc.data().shipping.address.state,
              postal_code: doc.data().shipping.address.zipCode,
              phone: doc.data().shipping.address.phone,
              country: doc.data().shipping.address.country,
            };
            msg.dynamicTemplateData.shipping_method = {
              carrier: doc.data().shipping.method.carrier,
              cost: doc.data().shipping.method.price + " USD",
              type: doc.data().shipping.method.name,
              delivery_time: {
                to: doc.data().shipping.method.to,
                from: doc.data().shipping.method.from,
              },
            };
            msg.dynamicTemplateData.final_cost = {
              shipping: doc.data().costs.shipping / 100 + " USD",
              cards: doc.data().costs.cards / 100 + " USD",
              discount: "-0 USD",
              total:
                (doc.data().costs.shipping + doc.data().costs.cards) / 100 +
                " USD",
            };

            const promise = new Promise((resolve, reject) => {
              doc.data().offers.forEach(async (offer, index) => {
                let pokemonName;

                await pokemon.card.find(offer.cardId).then((card) => {
                  pokemonName = card.name;
                });

                if (index == 0) {
                  msg.dynamicTemplateData.first = {
                    name: pokemonName,
                    condition: offer.condition,
                    price: offer.price + " USD",
                    language: offer.languageVersion,
                    graded: offer.isGraded,
                    url: `https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2F${offer.id}%2F0?alt=media&token=b1428248-6d61-41fb-a222-d8973540776d`,
                    id: offer.id,
                  };
                } else if (index == 1) {
                  msg.dynamicTemplateData.second = {
                    name: pokemonName,
                    condition: offer.condition,
                    price: offer.price + " USD",
                    language: offer.languageVersion,
                    graded: offer.isGraded,
                    url: `https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2F${offer.id}%2F0?alt=media&token=b1428248-6d61-41fb-a222-d8973540776d`,
                    id: offer.id,
                  };
                } else if (index == 2) {
                  msg.dynamicTemplateData.third = {
                    name: pokemonName,
                    condition: offer.condition,
                    price: offer.price + " USD",
                    language: offer.languageVersion,
                    graded: offer.isGraded,
                    url: `https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2F${offer.id}%2F0?alt=media&token=b1428248-6d61-41fb-a222-d8973540776d`,
                    id: offer.id,
                  };
                } else {
                  msg.dynamicTemplateData.more_cards = true;
                }

                await admin
                  .firestore()
                  .collection("offers")
                  .doc(offer.id)
                  .update({ status: "sold" });

                await handleCardDeletion(offer.id);

                if (index == doc.data().offers.length - 1) resolve();
              });
            });

            promise.then(async () => {
              let FCMToken;

              await admin
                .firestore()
                .collection("users")
                .doc(doc.data().seller)
                .get()
                .then((doc) => {
                  FCMToken = doc.data().notificationToken;

                  msg.dynamicTemplateData.vendor_name = doc.data().nick;
                });

              admin
                .auth()
                .getUser(doc.data().buyer)
                .then((userRecord) => {
                  msg.to = userRecord.toJSON().email;
                  sgMail.send(msg);
                });

              const sellerMsg = { ...msg };

              sellerMsg.subject = "New Order";
              sellerMsg.templateId = "d-61dd76364c434c9c8e852bff5c30fa8b";

              sellerMsg.dynamicTemplateData.final_cost.commision =
                doc.data().costs.cards * 0.085;

              sellerMsg.dynamicTemplateData.final_cost.payment_processing =
                (doc.data().costs.cards + doc.data().costs.shipping) * 0.029 +
                30;

              sellerMsg.dynamicTemplateData.final_cost.total =
                sellerMsg.dynamicTemplateData.final_cost.total -
                sellerMsg.dynamicTemplateData.final_cost.commision -
                sellerMsg.dynamicTemplateData.final_cost.payment_processing;

              admin
                .auth()
                .getUser(doc.data().seller)
                .then((userRecord) => {
                  sellerMsg.to = userRecord.toJSON().email;
                  sgMail.send(sellerMsg);
                });

              admin.messaging().send({
                token: FCMToken,
                notification: {
                  title: "New Order",
                  body: "Congrats! You have a new order 🛒",
                },
                data: {
                  channelId: "vendor-notifications",
                },
              });
            });

            if (transactions.length - 1 === index) resolve();
          });
        } catch (err) {
          res.status(400).send(err);
        }
      });
  }
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

              admin
                .firestore()
                .collection("cardsData")
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

exports.testNotification = functions.https.onCall(async (data, context) => {
  try {
    await serverClient.testPushSettings(context.auth.uid, {
      messageID:
        "sketJE8u32UYTkUySGRLYWPuaT93-a39b8870-1a4e-4030-34f2-d0c026431a31",
      skipDevices: true,
    });
    return "success";
  } catch (err) {
    console.log(err);
  }
});

exports.sendMail = functions.https.onCall(async (data, context) => {
  try {
    admin
      .auth()
      .getUser(data.to)
      .then(async (userRecord) => {
        const msg = {
          to: userRecord.toJSON().email,
          from: {
            email: data.from.email,
            name: data.from.name,
          },
          templateId: data.templateId,
          subject: data.subject,
          dynamicTemplateData: data.dynamicTemplateData,
        };

        sgMail.send(msg);
      });

    return { success: true };
  } catch (err) {
    console.log(err);
  }
});

exports.sendNotification = functions.https.onCall(async (data, context) => {
  try {
    const FCMToken = await admin
      .firestore()
      .collection("users")
      .doc(data.uid)
      .get()
      .then((doc) => doc.data().notificationToken);

    const payload = {
      token: FCMToken,
      ...data.payload,
    };

    admin
      .messaging()
      .send(payload)
      .then((response) => {
        return { success: true };
      })
      .catch((error) => {
        console.error(error);
        return { error: error.code };
      });

    return { success: true };
  } catch (err) {
    console.log(err);
  }
});

// exports.sendListenerPushNotification = functions.database.ref('/sendMessage/{userId}/').onWrite((data, context) => {});

exports.deleteExpiredTransactions = functions.pubsub
  .schedule("every 10 minutes")
  .onRun((context) => {
    try {
      let expirationDate = new Date(Date.now() - 3 * 60 * 60 * 1000);

      admin
        .firestore()
        .collection("transactions")
        .where("timestamp", "<", expirationDate)
        .where("status", "==", "unpaid")
        .get()
        .then((snapshot) => {
          if (snapshot.docs.length > 0) {
            snapshot.forEach(async (doc) => {
              await stripe.paymentIntents.cancel(doc.data().paymentIntent);
              doc.ref.delete();
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
    return null;
  });

exports.confirmSuccesfulTransaction = functions.pubsub
  .schedule("every 10 minutes")
  .onRun((context) => {
    try {
      let expirationDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

      admin
        .firestore()
        .collection("transactions")
        .where("shipping.delivered", "<", expirationDate)
        .where("status", "==", "delivered")
        .get()
        .then((snapshot) => {
          if (snapshot.docs.length > 0) {
            snapshot.forEach(async (doc) => {
              let buyerEmail;
              let sellerEmail;

              await admin
                .auth()
                .getUser(doc.data().buyer)
                .then((userRecord) => {
                  buyerEmail = userRecord.toJSON().email;
                });

              await admin
                .auth()
                .getUser(doc.data().seller)
                .then((userRecord) => {
                  sellerEmail = userRecord.toJSON().email;
                });

              //transaction confirmation with request for feedback
              const msg1 = {
                to: buyerEmail,
                from: {
                  email: "sales@tcmarket.place",
                  name: "TCM",
                },
                templateId: "d-27e3838d4db44c66bea4dbf4f57eb5a2",
                subject: "Transaction completed",
                dynamicTemplateData: {
                  order_id: doc.id,
                },
              };

              await sgMail.send(msg1);

              //paybout available
              const msg2 = {
                to: sellerEmail,
                from: {
                  email: "sales@tcmarket.place",
                  name: "TCM",
                },
                templateId: "d-8d714d90048f469590cb4e0061e1dea3",
                subject: "Payout available",
                dynamicTemplateData: {
                  order_id: doc.id,
                },
              };

              await sgMail.send(msg2);

              let FCMTokenSeller;
              let stripeAccount;

              await admin
                .firestore()
                .collection("users")
                .doc(doc.data().seller)
                .get()
                .then((doc) => {
                  FCMTokenSeller = doc.data().notificationToken;
                  stripeAccount = doc.data().stripe.vendorId;
                });

              const FCMTokenBuyer = await admin
                .firestore()
                .collection("users")
                .doc(doc.data().buyer)
                .get()
                .then((doc) => doc.data().notificationToken);

              const payloadSeller = {
                token: FCMTokenSeller,
                notification: {
                  title: "Payout available",
                  body: "Funds available for payout from your Stripe account 💸",
                },
                data: {
                  channelId: "transactions-notifications",
                },
              };
              const payloadBuyer = {
                token: FCMTokenBuyer,
                notification: {
                  title: "Transaction completed",
                  body: "From now any actions about this transaction are not possible. Please give a review to the seller ⭐⭐⭐⭐⭐",
                },
                data: {
                  channelId: "transactions-notifications",
                },
              };

              await admin.messaging().send(payloadSeller);
              await admin.messaging().send(payloadBuyer);

              const paymentIntent = await stripe.paymentIntents.retrieve(
                doc.data().paymentIntent
              );

              await doc.ref.update({ status: "completed" });

              await stripe.transfers.create({
                amount: doc.data().costs.cards + doc.data().costs.shipping,
                currency: "usd",
                destination: stripeAccount,
                transfer_group: paymentIntent.transfer_group,
              });

              //update doc
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
    return null;
  });

//

exports.onlyTest = functions.https.onCall(async (data, context) => {
  try {
    await stripe.charges.create({
      amount: 20000000,
      currency: "usd",
      source: "tok_bypassPending",
      description: "TEST CHARGE",
    });
  } catch (err) {
    console.log(err);
  }
});

exports.runXXX = functions.https.onCall(async (data, context) => {
  try {
    let expirationDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    admin
      .firestore()
      .collection("transactions")
      .where("shipping.delivered", "<", expirationDate)
      .where("status", "==", "delivered")
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          snapshot.forEach(async (doc) => {
            let buyerEmail;
            let sellerEmail;

            await admin
              .auth()
              .getUser(doc.data().buyer)
              .then((userRecord) => {
                buyerEmail = userRecord.toJSON().email;
              });

            await admin
              .auth()
              .getUser(doc.data().seller)
              .then((userRecord) => {
                sellerEmail = userRecord.toJSON().email;
              });

            //transaction confirmation with request for feedback
            const msg1 = {
              to: buyerEmail,
              from: {
                email: "sales@tcmarket.place",
                name: "TCM",
              },
              templateId: "d-27e3838d4db44c66bea4dbf4f57eb5a2",
              subject: "Transaction completed",
              dynamicTemplateData: {
                order_id: doc.id,
              },
            };

            await sgMail.send(msg1);

            //paybout available
            const msg2 = {
              to: sellerEmail,
              from: {
                email: "sales@tcmarket.place",
                name: "TCM",
              },
              templateId: "d-8d714d90048f469590cb4e0061e1dea3",
              subject: "Payout available",
              dynamicTemplateData: {
                order_id: doc.id,
              },
            };

            await sgMail.send(msg2);

            let FCMTokenSeller;
            let stripeAccount;

            await admin
              .firestore()
              .collection("users")
              .doc(doc.data().seller)
              .get()
              .then((doc) => {
                FCMTokenSeller = doc.data().notificationToken;
                stripeAccount = doc.data().stripe.vendorId;
              });

            const FCMTokenBuyer = await admin
              .firestore()
              .collection("users")
              .doc(doc.data().buyer)
              .get()
              .then((doc) => doc.data().notificationToken);

            const payloadSeller = {
              token: FCMTokenSeller,
              notification: {
                title: "Payout available",
                body: "Funds available for payout from your Stripe account 💸",
              },
              data: {
                channelId: "transactions-notifications",
              },
            };

            const payloadBuyer = {
              token: FCMTokenBuyer,
              notification: {
                title: "Transaction completed",
                body: "From now any actions about this transaction are not possible. Please give a review to the seller ⭐⭐⭐⭐⭐",
              },
              data: {
                channelId: "transactions-notifications",
              },
            };

            await admin.messaging().send(payloadSeller);
            await admin.messaging().send(payloadBuyer);

            const paymentIntent = await stripe.paymentIntents.retrieve(
              doc.data().paymentIntent
            );

            await stripe.transfers.create({
              amount:
                (doc.data().costs.cards + doc.data().costs.shipping) * 0.915,
              currency: "usd",
              destination: stripeAccount,
              transfer_group: paymentIntent.transfer_group,
            });

            //update doc
            doc.ref.update({ status: "completed" });
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
  return null;
});
