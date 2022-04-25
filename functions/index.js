const functions = require("firebase-functions");
const admin = require("firebase-admin");

const request = require("request");

// const express = require("express");
// const cors = require("cors");

// const app = express();
// app.use(cors({ origin: true }));

const stripe = require("stripe")(
  "sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75"
);

//! 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

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

exports.events = functions.https.onRequest((request, response) => {
  response.send("Endpoint for Stripe Webhooks!");
});

exports.createStripeAccount = functions.https.onCall(async (data, context) => {
  const doc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  const account = await stripe.accounts.create({
    type: "express",
    business_type: "individual",
    email: context.auth.token.email,
    business_profile: {
      mcc: "5947",
      name: context.auth.uid,
      product_description:
        "PTCG Marketplace is platform for trading your Pokémon cards.",
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

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "https://ptcgmarketplace.com/returnToApp",
    return_url: "https://ptcgmarketplace.com/returnToApp",
    type: "account_onboarding",
  });

  // console.log(accountLink.url);
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
                firstSell: null,
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
  if (event.type === "payment_intent.canceled") {
    await admin
      .firestore()
      .collection("transactions")
      .where("paymentIntent", "==", event.data.object.id)
      .get()
      .then((transactions) => {
        const promise = new Promise((resolve, reject) => {
          transactions.forEach(async (doc) => {
            await admin
              .firestore()
              .collection("transactions")
              .doc(doc.id)
              .delete();
          });
          if (transactions.length - 1 === index) {
            resolve();
          }
        });

        promise.then(() => {
          res.status(200).send("success");
        });
      });
  } else {
    //event type was not handled

    res.status(200).send("event type not handled");
  }
});

exports.deleteExpiredTransactions = functions.pubsub
  .schedule("every 5 minutes")
  .onRun((context) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const expirationDate = admin.firestore.Timestamp.fromDate(date);

    console.log(expirationDate);

    admin
      .firestore()
      .collection("transactions")
      .where("timestamps", "<", expirationDate)
      .where("status", "==", "unpaid")
      .get()
      .then((snapshot) => {
        if (snapshot.lenght > 0) {
          snapshot.forEach((doc) => {
            doc.ref.delete();
          });
        }
      });
    return null;
  });
