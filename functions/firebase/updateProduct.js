const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const addData = async (productId, data, prices) => {
  try {
    await admin.firestore().collection("product").doc(productId).update({
      stripeProductId: data,
      pricing: prices,
    });
  } catch (error) {}
};
module.exports = { addData };
