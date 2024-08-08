require("dotenv").config();
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const priceUpdate = async (variation, afterData) => {
  try {
    const newPrice = await stripe.prices.create({
      unit_amount: variation.price * 100, // price in cents
      currency: "aud", // specify your currency as Australian dollars
      product: afterData.stripeProductId,
      metadata: {
        color: variation.color,
        quantity: variation.quantity,
      },
    });

    return {
      success: true,
      data: {
        id: newPrice.id,
        price: variation.price,
        color: variation.color,
        quantity: variation.quantity,
      },
    };
  } catch (error) {
    return { success: false, error: errorMessage };
  }
};

module.exports = { priceUpdate };
