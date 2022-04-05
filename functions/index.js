const functions = require("firebase-functions");
const admin = require("firebase-admin");

const stripe = require("stripe")(
  "sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75"
);
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

exports.events = functions.https.onRequest((request, response) => {
  response.send("Endpoint for Stripe Webhooks!");
});
exports.createStripeAccount = functions.https.onCall(async (data, context) => {
  const account = await stripe.accounts.create({
    type: "standard",
  });

  //Check if account is already assigned to user
  //! Do afer successful account linking

  await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .update({ stripe: { vendorID: account.id } });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "https://ptcgmarketplace.com/",
    return_url: "https://ptcgmarketplace.com/",
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
    account: doc.data().stripe.vendorID,
    refresh_url: "https://ptcgmarketplace.com/",
    return_url: "https://ptcgmarketplace.com/",
    type: "account_onboarding",
  });

  // console.log(accountLink.url);
  return accountLink.url;
});
exports.fetchStripeAccount = functions.https.onCall(async (data, context) => {
  const doc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  const vendorId = doc.data().stripe.vendorID;

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
exports.createTransactions = functions.https.onCall(async (data, context) => {
  //get shipping methods - from client side
  //get offers - only ids of them from client side, price and other info from db

  let customer = null;
  let finalAmount,
    finalFee,
    finalDiscount = 0;
  const transactionsIds = [];

  const userDoc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  if (userDoc.data()?.stripe?.merchentID) {
    customer = { id: userDoc.data().stripe.merchentID };
  } else {
    customer = await stripe.customers.create();
    await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .update({ stripe: { merchentID: customer.id } });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );

  data.offersState.forEach(async (item) => {
    //create doc for each transaction
    //seperate transaction has to be made for each seller

    if (item.data.lenght > 1) {
      //transactions with more than one vendor
    }

    await admin
      .firestore()
      .collection("transactions")
      .add({
        timeStamp: admin.firestore.FieldValue.serverTimestamp(),
        buyer: context.auth.uid,
        seller: data.seller,
        offers: [...data.offers],
        shipping: {
          method: data.shipping.method,
          address: data.shipping.address,
          trackingNumber: null,
          sent: false,
          delivered: false,
        },
        paymentId: null,
      })
      .then((result) => {
        transactionsIds.push(result.id);
      })
      .catch((err) => {
        console.log(err);
      });

    //calulate final amount
    //calulate final fee
  });

  //apply discount

  //create paymentItent
  //split into multiple transfers if necessary

  var paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "usd",
    customer: customer.id,
    payment_method_types: ["card"],
    application_fee_amount: finalFee,
    transfer_data: {
      destination: "acct_1KaRdI2Q2GDOQWR5",
    },
  });

  admin.firestore().collection("transactions").doc(paymentIntent.id).set({
    timeStamp: admin.firestore.FieldValue.serverTimestamp(),
    buyer: context.auth.uid,
    seller: data.seller,
  });

  return {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX",
  };
});
exports.paymentSheet = functions.https.onCall(async (data, context) => {
  const docsArray = [];

  let finalAmount = 0;
  let customer = null;
  let { offersState, shippingMethod } = data;

  const doc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  if (doc.data()?.stripe?.merchentID) {
    customer = { id: doc.data().stripe.merchentID };
  } else {
    customer = await stripe.customers.create();
    await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .update({ stripe: { merchentID: customer.id } });
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
              fetchedOffer.price * 100 * 0.085
            );

            transactionCosts.cards += fetchedOffer.price * 100;
            finalAmount += fetchedOffer.price * 100;
          });

        if (section.data.length === index + 1) {
          docsArray.push({
            timeStamp: admin.firestore.FieldValue.serverTimestamp(),
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
              payment_method_types: ["card"],
              transfer_group: uuidv4(),
            });

            resolve();
          }
        }
      });
    });
  });

  return promise.then(() => {
    docsArray.forEach(async (doc) => {
      console.log("paymentIntent: " + paymentIntent.id);
      await admin
        .firestore()
        .collection("transactions")
        .doc()
        .set({ ...doc, paymentIntent: paymentIntent.id });
    });

    //paymentIntent.client_secret

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX",
    };
  });
});
exports.purchaseSheet = functions.https.onCall(async (data, context) => {
  //check for any discount

  //start from referral program, fetch all uids from array at discounts/referralProgram
  //then check each user if they had made any purchase yet and if they wasn't used yet
  // if yes, each active user is 2 USD, mark these uids in array as used

  try {
    //fetch array
    const usedUids = [];
    const totalDiscount = 0;

    const doc = await admin.collection("users").doc(context.auth.uid).get();

    if (doc.data().discounts.referralProgram.lenght > 0) {
      const newArray = doc.data().discounts.referralProgram;

      doc.data().discounts.referralProgram.forEach((element, index) => {
        if (element.used === false && element.activated === true) {
          newArray[index].used = true;
          totalDiscount += 2;
        }
      });
      admin
        .firestore()
        .collection("users")
        .doc(context.auth.uid)
        .update({ discounts: { referralProgram: newArray } });
    }

    //   await admin
    //     .firestore()
    //     .collection("users")
    //     .doc(data.code)
    //     .update({
    //       discounts: {
    //         referralProgram: admin.firestore.FieldValue.arrayUnion(
    //           context.auth.uid
    //         ),
    //       },
    //     })
    //     .then((res) => {
    //       result = res;
    //       console.log(res);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }

    return result;
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
    const paymentIntent = event.data.object;

    console.log(event.data.object.id);

    await admin
      .firestore()
      .collection("transactions")
      .where("paymentIntent", "==", event.data.object.id)
      .get()
      .then((res) => {
        console.log(res[0].data());
      });
  }
}); 