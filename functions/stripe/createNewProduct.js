require("dotenv").config();
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const addDataToStripe = async (newValue) => {
  try {
    const product = await stripe.products.create({
      name: newValue.name,
      images: newValue.images,
      description: newValue.description,
      metadata: {
        initial_stock: JSON.stringify(
          Object.values(newValue.pricing).map((variation) => ({
            color: variation.color,
            quantity: variation.quantity,
          }))
        ),
      },
      shippable: true,
    });

    const prices = await Promise.all(
      Object.values(newValue.pricing).map(async (variation) => {
        const priceVariation = await stripe.prices.create({
          unit_amount: variation.price * 100, // price in cents
          currency: "aud",
          product: product.id,
          metadata: {
            color: variation.color,
            quantity: variation.quantity, // Adding quantity to metadata
          },
        });

        return {
          color: priceVariation.metadata.color,
          quantity: parseInt(priceVariation.metadata.quantity),
          price: parseFloat(priceVariation.unit_amount) / 100,
          id: priceVariation.id,
        };
      })
    );

    const pricesObject = convertPricesArrayToObject(prices);
    return { success: true, stripeProductId: product.id, prices: pricesObject };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const convertPricesArrayToObject = (pricesArray) => {
  return pricesArray.reduce((acc, price) => {
    acc[price.id] = price;
    return acc;
  }, {});
};
module.exports = { addDataToStripe };
