require("dotenv").config();
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const updatePriceMetaData = async (variation) => {
  try {
    const updatedPrice = await stripe.prices.update(variation.id, {
      metadata: {
        color: variation.color,
        quantity: variation.quantity,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage };
  }
};

module.exports = { updatePriceMetaData };
