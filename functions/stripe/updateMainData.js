require("dotenv").config();
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const updateMainData = async (afterData) => {
  try {
    const product = await stripe.products.update(afterData.stripeProductId, {
      name: afterData.name,
      description: afterData.description,
      images: afterData.images,
      metadata: {
        initial_stock: JSON.stringify(
          Object.values(afterData.pricing).map((variation) => ({
            color: variation.color,
            quantity: variation.quantity,
          }))
        ),
      },
    });
    return { success: true };
  } catch (error) {
    let errorMessage = "An error occurred while updating the product.";
    if (error.type === "StripeCardError") {
      // Handle Stripe card errors
      errorMessage = "There was an error with the card details provided.";
    } else if (error.type === "RateLimitError") {
      // Handle Stripe rate limit errors
      errorMessage = "Too many requests made to the Stripe API too quickly.";
    } else if (error.type === "StripeInvalidRequestError") {
      // Handle Stripe invalid request errors
      errorMessage = "Invalid parameters were supplied to Stripe's API.";
    } else if (error.type === "StripeAPIError") {
      // Handle generic Stripe API errors
      errorMessage = "An error occurred internally with Stripe's API.";
    } else if (error.type === "StripeConnectionError") {
      // Handle Stripe connection errors
      errorMessage = "An error occurred during connection to Stripe.";
    } else if (error.type === "StripeAuthenticationError") {
      // Handle Stripe authentication errors
      errorMessage = "Authentication with Stripe's API failed.";
    } else {
      // Handle other types of errors
      errorMessage = error.message || errorMessage;
    }

    return { success: false, error: errorMessage };
  }
};

module.exports = { updateMainData };
