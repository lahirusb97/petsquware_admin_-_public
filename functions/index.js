const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const stripe = require("stripe")(
  "sk_test_51PXmjKIT4CAR61BEcyFtkdcQLbyy5PJdtALtVf2Hdf4v5tfkYKc1w0H0lSB2axJWBbOyF7KJyEYe9k9bIcVEwIOz00jq0fIBH2"
);
admin.initializeApp();

exports.onProductCreated = functions.firestore
  .document("product/{productId}")
  .onCreate(async (data, context) => {
    const newData = data.data();

    try {
      const getStripeProductId = await addDataToStripe(newData);

      if (getStripeProductId.success) {
        addData(
          context.params.productId,
          getStripeProductId.stripeProductId,
          getStripeProductId.prices
        );
      } else {
        addData(context.params.productId, "error", []);
      }
    } catch (error) {
      console.error("Error during onProductCreated:", error);
    }
  });

const addData = async (productId, data, prices) => {
  try {
    await admin.firestore().collection("product").doc(productId).update({
      stripeProductId: data,
      pricing: prices,
    });
  } catch (error) {}
};

const addDataToStripe = async (newValue) => {
  try {
    const product = await stripe.products.create({
      name: newValue.name,
      images: newValue.images,
      description: newValue.description,
      metadata: {
        initial_stock: JSON.stringify(
          newValue.pricing.map((variation) => ({
            color: variation.color,
            quantity: variation.quantity,
          }))
        ),
      },
      shippable: true,
    });

    const prices = await Promise.all(
      newValue.pricing.map(async (variation) => {
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
          id: priceVariation.id,
          color: priceVariation.metadata.color,
          quantity: parseInt(priceVariation.metadata.quantity),
          price: parseFloat(priceVariation.unit_amount) / 100,
        };
      })
    );

    return { success: true, stripeProductId: product.id, prices: prices };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
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
// async function handleOrderDetails(order, sessionId) {
//   try {
//     const orderRef = admin.firestore().collection("orders").doc(sessionId);
//     await orderRef.set({
//       id: sessionId,
//       customer_email: "customer@example.com", // Replace with actual email if available
//       items: order.items,
//       total: order.total,
//       created_at: new Date().toISOString(),
//     });
//     console.log("Order written to Firestore:", sessionId);
//   } catch (error) {
//     console.error("Error writing order to Firestore:", error);
//   }
// }
// Recive orders data

// exports.getPendingCheckoutSessions = functions.https.onRequest((req, res) => {
//   cors(req, res, async () => {
//     try {
//       // Retrieve all Checkout Sessions with specific status if needed
//       const sessions = await stripe.checkout.sessions.list({
//         limit: 100, // Adjust the limit as needed
//       });

//       res.status(200).json(sessions.data);
//     } catch (error) {
//       console.error("Error retrieving Checkout Sessions from Stripe:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   });
// });
exports.onDocumentUpdate = functions.firestore
  .document("product/{docId}")
  .onUpdate((change, context) => {
    const beforeData = change.before.data(); // The document's data before the update
    const afterData = change.after.data(); // The document's data after the update
    const documentId = context.params.docId; // The ID of the updated document

    if (afterData.edited) {
      updateStripeData(afterData);
    }
  });

const updateStripeData = async (afterData) => {
  try {
    // Update the product information
    await stripe.products.update(afterData.stripeProductId, {
      name: afterData.name,
      description: afterData.description,
      images: afterData.images,
      metadata: {
        initial_stock: JSON.stringify(
          afterData.pricing.map((variation) => ({
            color: variation.color,
            quantity: variation.quantity,
          }))
        ),
      },
    });

    // Update the prices
    const priceUpdates = afterData.pricing.map(async (variation) => {
      console.log(variation);
      // Ensure that variation.id corresponds to a price object
      await stripe.prices.update(variation.id, {
        unit_amount: 1600, // price in cents
        metadata: {
          color: variation.color,
          quantity: variation.quantity,
        },
      });
    });

    await Promise.all(priceUpdates);

    console.log(
      `Product and prices updated successfully for product ID: ${afterData.stripeProductId}`
    );
  } catch (error) {
    console.error("Error updating Stripe data:", error);
  }
};
