const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const addData = async (productId, data) => {
  try {
    await admin.firestore().collection("product").doc(productId).update(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
module.exports = { addData };
