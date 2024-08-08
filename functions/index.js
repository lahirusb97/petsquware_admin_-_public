require("dotenv").config();
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
admin.initializeApp();
//Call Functions
const { addDataToStripe } = require("./stripe/createNewProduct");
const { addData } = require("./firebase/updateProduct");
const { updateMainData } = require("./stripe/updateMainData");
const { priceUpdate } = require("./stripe/priceUpdate");
const { updatePriceMetaData } = require("./stripe/updatePriceMetaData");
//Call Functions

exports.onProductCreated = functions.firestore
  .document("product/{productId}")
  .onCreate(async (data, context) => {
    const newData = data.data();

    const getStripeProductId = await addDataToStripe(newData);

    if (getStripeProductId.success) {
      const data = {
        stripeProductId: getStripeProductId.stripeProductId,
        pricing: getStripeProductId.prices,
      };
      const updateData = addData(context.params.productId, data);
    } else {
      const updateData = addData(context.params.productId, "error", {});
    }
  });
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (!req.body || !req.body.items) {
        return res.status(400).send("Bad Request: Missing required fields.");
      }

      // Fetch price details from Stripe using the price IDs
      const items = req.body.items;
      let totalPrice = 0;

      // Fetch price details and calculate total price
      const lineItems = await Promise.all(
        items.map(async (item) => {
          const price = await stripe.prices.retrieve(item.price);
          const itemTotal = price.unit_amount * item.quantity;
          totalPrice += itemTotal;
          return {
            price: item.price,
            quantity: item.quantity,
          };
        })
      );

      // Determine the shipping rate based on the recalculated total price
      let shippingRate;
      if (totalPrice > 3000) {
        // Assuming prices are in cents, 3000 cents = $30
        shippingRate = "shr_1PhxVgIT4CAR61BEJ54Jma31"; // Free shipping rate ID
      } else {
        shippingRate = "shr_1PYfTPIT4CAR61BEwlQOGbDh"; // Standard shipping rate ID
      }

      const session = await stripe.checkout.sessions.create({
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
        line_items: lineItems,
        mode: "payment",
        shipping_options: [
          {
            shipping_rate: shippingRate,
          },
        ],
        shipping_address_collection: {
          allowed_countries: ["AU"], // Only allow Australia
        },
      });
      // await handleOrderDetails(req.body, session.id);
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      if (error.type === "StripeInvalidRequestError") {
        res.status(400).send("Invalid request: " + error.message);
      } else if (error.type === "StripeAPIError") {
        res.status(500).send("Stripe API error: " + error.message);
      } else {
        res.status(500).send("Internal Server Error: " + error.message);
      }
    }
  });
});

exports.onDocumentUpdate = functions.firestore
  .document("product/{docId}")
  .onUpdate((change, context) => {
    const beforeData = change.before.data(); // The document's data before the update
    const afterData = change.after.data(); // The document's data after the update
    //Update the product information
    if (afterData.edited) {
      updateStripeData(beforeData, afterData, context);
    }
  });

const updateStripeData = async (beforeData, afterData, context) => {
  // Update the product information
  const updateProductMainData = await updateMainData(afterData);

  // Process price updates
  if (updateProductMainData.success) {
  } else {
    console.log(updateProductMainData.error);
  }

  const afterDataChanges = {};
  const priceUpdates = Object.values(afterData.pricing).map(
    async (variation) => {
      const beforeVariation = beforeData["pricing"][variation.id];

      // If the variation does not exist in beforeData, create a new price
      if (!beforeVariation) {
        //TODO create new price
        const createNewPrice = await priceUpdate(variation, afterData);
        const newPrice = createNewPrice.data;
        if (createNewPrice.success) {
          afterDataChanges[newPrice.id] = {
            id: newPrice.id,
            price: newPrice.price,
            color: newPrice.color,
            quantity: newPrice.quantity,
          };
        } else {
          //! create new price Error handling
          console.log(createNewPrice.error);
        }
      } else {
        //TODO Update price Data
        const updatedPrice = await updatePriceMetaData(variation);
        if (updatedPrice.success) {
          afterDataChanges[variation.id] = {
            id: variation.id,
            price: variation.price,
            color: variation.color,
            quantity: variation.quantity,
          };
        } else {
          //! Update Price Data Error handling

          console.log(createNewPrice.error);
        }
      }
    }
  );

  await Promise.all(priceUpdates);

  //TODO Update Firebase with the new price data
  const data = { pricing: afterDataChanges, edited: false };
  const storeUpdatedPriceData = await addData(context.params.docId, data);

  if (storeUpdatedPriceData.success) {
    console.log("Product updated successfully");
  } else {
    //! Store Price Data Error handling

    console.log("Error updating product: ", storeUpdatedPriceData.error);
  }
};
