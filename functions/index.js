const request = require("request");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const stream_chat = require("stream-chat");
const stripe = require("stripe")(
  "sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75"
);
//! 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
//! sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75

const endpointSecret =
  "whsec_fe2b32369c4237e36bdacd1e74883ebebadde92f87c0eda852575649abee2e38";

admin.initializeApp();
//Stripe Account

const api_key = "nfnwsdq54g3b";
const api_secret =
  "3fzhjfk2spyxw8tmxeudfj4thqu3q2ftbure2qqxgpqrth7nv8dwahp45b6cc4pk";
const SENDGRID_API_KEY =
  "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";

sgMail.setApiKey(SENDGRID_API_KEY);
const serverClient = stream_chat.StreamChat.getInstance(api_key, api_secret);

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

            //APPLICATION FEE

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
                .then(async (transactionDoc) => {
                  transactionDoc.data().offers.forEach(async (offer) => {
                    await admin
                      .firestore()
                      .collection("offers")
                      .doc(offer.id)
                      .update({ status: "sold" });

                    await handleCardDeletion(offer.id);
                  });

                  await admin
                    .firestore()
                    .collection("users")
                    .doc(doc.data().seller)
                    .update({
                      ["sellerProfile.statistics.numberOfOffers"]:
                        admin.firestore.FieldValue.increment(
                          -transactionDoc.data().offers.length
                        ),
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
                .update({
                  cart: [],
                  ["sellerProfile.statistics.purchases"]:
                    admin.firestore.FieldValue.increment(1),
                });

              await admin
                .firestore()
                .collection("users")
                .doc(doc.data().seller)
                .update({
                  ["sellerProfile.statistics.sales"]:
                    admin.firestore.FieldValue.increment(1),
                });

              //incremetn by number of cards sold

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

            //send email to buyer
            //send email to seller
            //send notification to seller

            // const msg = {
            //   to: "test@example.com", // Change to your recipient
            //   from: "test@example.com", // Change to your verified sender
            //   subject: "Sending with SendGrid is Fun",
            //   text: "and easy to do anywhere, even with Node.js",
            //   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
            // };

            // sgMail
            //   .send(msg)
            //   .then(() => {
            //     console.log("Email sent");
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });

            // const msg = {
            //   to: "szymanskiadam111@gmail.com",
            //   from: "sales@tcmarket.place",
            //   templateId: "d-f43daeeaef504760851f727007e0b5d0",
            //   subject: 'Order Confirmation',
            //   dynamicTemplateData: {
            //     subject: "Testing Templates",
            //     name: "Some One",
            //     city: "Denver",
            //   },
            // };
            // sgMail
            //   .send(msg)
            //   .then(() => {
            //     console.log("Email sent");
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });
          });

          promise.then(() => {
            res.status(200).send("success");
          });
        } catch (err) {
          res.status(400).send(err);
        }
      });
  }
  if (
    event.type === "payment_intent.canceled" ||
    event.type === "payment_intent.failed"
  ) {
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
    const msg = {
      to: "milosz.nedzny@gmail.com",
      from: "sales@tcmarket.place",
      templateId: "d-0c7fc69547ec40f2b778421535729a31",
      subject: "Order Confirmation",
      dynamicTemplateData: {
        order_id: "137vn2389jfg72h98wh",
        vendor_name: "Ben Harvey",
        shipping_address: {
          name: "Adam Szymanski",
          street1: "Waclawa Wojewodzkiego 1/2",
          street2: "-- street 2 --",
          city: "Lodz",
          postal_code: "92-446",
          phone: "+48606417902",
          country: "Poland",
        },
        shipping_method: {
          carrier: "USPS",
          cost: "12.00 USD",
          type: "Standard",
          delivery_time: "12/21",
        },
        final_cost: {
          shipping: "12.00 USD",
          cards: "89.00 USD",
          discount: "12.00 USD",
          total: "89.00 USD",
        },
        card1: {
          name: "Gyarados GX",
          price: "12.00 USD",
          graded: true,
          condition: 1,
          language: "English",
          url: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2FAwPacv081ZZLBZsiS396%2F0?alt=media&token=09cbc856-aa3b-457f-a0eb-cacf7683d71c",
        },
        card2: {
          name: "Pikachu GX",
          price: "12.00 USD",
          graded: false,
          condition: 9,
          language: "English",
          url: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2FGYbG7QO4a0dlYXOhqZHI%2F0?alt=media&token=019e42c2-f258-49b2-9271-48d313e2ff3d",
        },
        card3: {
          name: "Charizard GX",
          price: "12.00 USD",
          graded: true,
          condition: 9,
          language: "English",
          url: "https://firebasestorage.googleapis.com/v0/b/ptcg-marketpla.appspot.com/o/cards%2FQLnfrUsLYy2UKQkakBUR%2F0?alt=media&token=37201275-52d5-46dc-b75c-7b9609f5fab2",
        },
      },
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    return "success";
  } catch (err) {
    console.log(err);
  }
});

// exports.validateOffersStatus = functions.pubsub
//   .schedule("every 10 minutes")
//   .onRun((context) => {
//     //check status of all sellerProfiles
//     //if status != enabled, set status of all published offers to suspended

//     admin
//       .firestore()
//       .collection("users")
//       .where("sellerProfile.status", "!=", "enabled")
//       .get()
//       .then((snapshot) => {
//         if (snapshot.lenght > 0) {
//           snapshot.forEach(async (doc) => {
//             await admin
//               .firestore()
//               .collection("offers")
//               .where("owner", "==", doc.id)
//               .where("status", "==", "published")
//               .get()
//               .then((offers) => {
//                 if (offers.length > 0) {
//                   offers.forEach(async (offer) => {
//                     offer.ref.update({ status: "suspended" });
//                     await handleCardDeletion(offer.id);
//                   });
//                 }
//               });
//           });
//         }
//       });
//     return null;
//   });

// exports.deleteExpiredTransactions = functions.pubsub
//   .schedule("every 10 minutes")
//   .onRun((context) => {
//     let currentDate = new Date();
//     var pastDue = new Date(currentDate.getTime() - 600000);

//     admin
//       .firestore()
//       .collection("transactions")
//       .where("timestamp", "<", pastDue)
//       .where("status", "==", "unpaid")
//       .get()
//       .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//           doc.ref.delete();
//         });
//       });

//     return null;
//   });
