const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(
  "sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75"
);

admin.initializeApp();
//Stripe Account

exports.helloWorld = functions.https.onCall(async (data, context) => {
  console.log(context.auth.uid);
  // res.json({ result: `Hello World` });
  return "Hello World";
});
exports.addTransaction = functions.https.onCall(async (data, context) => {
  console.log(context.auth.uid);
  // res.json({ result: `Hello World` });
  return "Hello World";
});
exports.createStripeLinkedAccount = functions.https.onCall(
  async (data, context) => {
    const account = await stripe.accounts.create({
      type: "standard",
    });

    //Check if account is already assigned to user

    //! Do afer successful account linking
    // await admin
    //   .firestore()
    //   .collection("users")
    //   .doc(context.auth.uid)
    //   .update({ stripe: { vendorID: account.id } });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://ptcgmarketplace.com/",
      return_url: "https://ptcgmarketplace.com/",
      type: "account_onboarding",
    });

    // console.log(accountLink.url);
    return accountLink.url;
  }
);
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
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2137,
    currency: "usd",
    customer: customer.id,
    payment_method_types: ["card"],
    application_fee_amount: 100,
    transfer_data: {
      destination: "acct_1KP8Kr2SDMBrF0m7",
    },
  });

  return {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX",
  };
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
