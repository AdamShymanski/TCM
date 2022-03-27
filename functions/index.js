const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(
  "sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75"
);

admin.initializeApp();
//Stripe Account

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

    console.log(item.data);

    // await admin
    //   .firestore()
    //   .collection("transactions")
    //   .add({
    //     timeStamp: admin.firestore.FieldValue.serverTimestamp(),
    //     buyer: context.auth.uid,
    //     seller: data.seller,
    //     offers: [...data.offers],
    //     shipping: {
    //       method: data.shipping.method,
    //       address: data.shipping.address,
    //       trackingNumber: null,
    //       sent: false,
    //       delivered: false,
    //     },
    //     paymentId: null,
    //   })
    //   .then((result) => {
    //     transactionsIds.push(result.id);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    //calulate final amount
    //calulate final fee
  });

  //apply discount

  //create paymentItent
  //split into multiple transfers if necessary

  if (transactionsIds.length > 1) {
    transactionsIds.forEach(async (id) => {
      await stripe.transfers.create({
        amount: 7000,
        currency: "pln",
        destination: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
        transfer_group: "{ORDER10}",
      });
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
      application_fee_amount: finalFee,
      transfer_data: {
        destination: "acct_1KaRdI2Q2GDOQWR5",
      },
      transfer_group: "{ORDER10}",
    });
  }

  // Create a Transfer to the connected account (later):

  // Create a second Transfer to another connected account (later):
  const secondTransfer = await stripe.transfers.create({
    amount: 2000,
    currency: "pln",
    destination: "{{OTHER_CONNECTED_STRIPE_ACCOUNT_ID}}",
    transfer_group: "{ORDER10}",
  });

  return {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX",
  };
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

exports.paymentSheet = functions.https.onCall(async (data, context) => {
  const doc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  let customer;

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

  let { offersState, shippingMethod } = data;

  let finalFee = 0;
  let finalAmount = 0;
  let paymentIntent = {};

  const promise = new Promise((resolve, reject) => {
    offersState.forEach((section, masterIndex) => {
      section.data.forEach(async (offer, index) => {
        await admin
          .firestore()
          .collection("offers")
          .doc(offer.id)
          .get()
          .then((doc) => {
            const offer = doc.data();
            finalAmount += Math.round(offer.price * 100);

            finalFee += Math.round(offer.price * 100 * 0.085);

            if (shippingMethod[doc.data().owner]) {
              finalAmount += Math.round(
                shippingMethod[doc.data().owner].price * 100
              );
            }
          });

        if (
          offersState.length === index + 1 &&
          section.data.length === masterIndex + 1
        ) {
          paymentIntent = await stripe.paymentIntents.create({
            amount: finalAmount,
            currency: "usd",
            customer: customer.id,
            payment_method_types: ["card"],
            application_fee_amount: finalFee,
            transfer_data: {
              destination: "acct_1KaRdI2Q2GDOQWR5",
            },
          });
          resolve();
        }
      });
    });
  });

  //if offersId.lenght > 1 => split payment inoto multiple transfers (lenght === offersId.lenght)

  return promise.then(async () => {
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
