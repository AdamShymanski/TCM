const functions = require("firebase-functions");
const stripe = require("stripe")(
  "sk_test_51KDXfNCVH1iPNeBrKw7YbGdP8IpIPZiQKrG6uKrrUSd3xVie1zH7EJe9uO5pdvnl8lgl17qhxB5Q9JM84WFr6Nqb00lWqb7G75"
);

const admin = require("firebase-admin");
admin.initializeApp();

exports.addMessage = functions.https.onCall(async (data, context) => {
  const original = data.text;

  return original;
});

exports.paymentSheet = functions.https.onCall(async (data, context) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2020-08-27" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "eur",

      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },

      googlePay: true,
      merchantCountryCode: "US",
      testEnv: true,
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51KDXfNCVH1iPNeBr6PM5Zak8UGwXkTlXQAQvPws2JKGYC8eTAQyto3yBt66jvthbe1Zetrdei7KHOC7oGuVK3xtA00jYwqovzX",
    };
  } catch (error) {
    console.log(error);
  }
});

// exports.placeOrder = functions.https.onRequest(async (req, res) => {
//   try {
//     const { address1, address2, city, state, zip, country } = req.body;

//     res.json({
//       data: { address1, address2, city, state, zip, country },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// exports.addCard = functions.https.onRequest(async (data, context) => {
//   try {
//     //validate all params to create new card document

//     const priceRegEx = /^\d+([.,]\d{1,2})?$/g;
//     const conditionRegEx = /^[1-9]|10*$/g;

//     const yupObject = yup.object({
//       price: yup
//         .string("Wrong format!")
//         .matches(priceRegEx, "Wrong format!")
//         .required("Price is required!")
//         .max(12, "Price is too long!"),
//       condition: yup
//         .string("Wrong format!")
//         .matches(conditionRegEx, "Wrong format!")
//         .required("Condition is required!")
//         .max(2, "Wrong format"),
//       languageVersion: yup
//         .string("Wrong format!")
//         .required("Language Version is required!")
//         .min(4, "Wrong format"),
//       description: yup
//         .string("Wrong format!")
//         .required("Description is required!")
//         .max(60, "Description is too long!"),
//       isGraded: yup.boolean().required("graded is required!"),
//       cardId: yup.string().required("cardId is required!"),
//       owner: yup.string().required("owner is required!"),
//     });

//     //ADD
//     // status
//     // timestamp

//     // owner -- fetch from meta from req
//     // cardId
//     // isGraded

//     yupObject
//       .validate(req.body)
//       .then(async (value) => {})
//       .catch(async (value) => {});
//   } catch (error) {
//     console.log(error);
//   }
// });
