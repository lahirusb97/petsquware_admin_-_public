require("dotenv").config();
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
admin.initializeApp();
//Call Functions
const { addDataToStripe } = require("./stripe/createNewProduct");
const { addData } = require("./firebase/updateProduct");
//Call Functions

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
        addData(context.params.productId, "error", {});
      }
    } catch (error) {
      console.error("Error during onProductCreated:", error);
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

    if (afterData.edited) {
      updateStripeData(beforeData, afterData, context);
    }
  });

const updateStripeData = async (beforeData, afterData, context) => {
  try {
    // Update the product information
    await stripe.products.update(afterData.stripeProductId, {
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

    // Process price updates
    const afterDataChanges = {};
    const priceUpdates = Object.values(afterData.pricing).map(
      async (variation) => {
        const beforeVariation = beforeData["pricing"][variation.id];

        console.log("before------------------------>", beforeVariation);
        console.log("after------------------------>", afterData);

        // If the variation does not exist in beforeData, create a new price
        if (!beforeVariation) {
          const newPrice = await stripe.prices.create({
            unit_amount: variation.price * 100, // price in cents
            currency: "aud", // specify your currency as Australian dollars
            product: afterData.stripeProductId,
            metadata: {
              color: variation.color,
              quantity: variation.quantity,
            },
          });
          console.log(
            "New price created:++++++++++++++++++++++++++++++++++ line 1",
            newPrice
          );

          afterDataChanges[newPrice.id] = {
            id: newPrice.id,
            price: variation.price,
            color: variation.color,
            quantity: variation.quantity,
          };
        } else {
          // Check if the price has changed
          if (beforeVariation.price != variation.price) {
            const newPrice = await stripe.prices.create({
              unit_amount: variation.price * 100, // price in cents
              currency: "aud", // specify your currency as Australian dollars
              product: afterData.stripeProductId,
              metadata: {
                color: variation.color,
                quantity: variation.quantity,
              },
            });
            afterDataChanges[newPrice.id] = {
              id: newPrice.id,
              price: variation.price,
              color: variation.color,
              quantity: variation.quantity,
            };
            console.log(
              "New price created++++++++++++++++++++++++++++++++ line 2",
              newPrice
            );
          } else {
            // Update the existing price metadata if only color or quantity changed
            const updatedPrice = await stripe.prices.update(variation.id, {
              metadata: {
                color: variation.color,
                quantity: variation.quantity,
              },
            });
            afterDataChanges[variation.id] = {
              id: variation.id,
              price: variation.price,
              color: variation.color,
              quantity: variation.quantity,
            };
            console.log(
              "UPDATED ***********************************:",
              updatedPrice
            );
          }
        }
      }
    );

    await Promise.all(priceUpdates);

    // Update Firebase with the new price data
    await admin
      .firestore()
      .collection("product")
      .doc(context.params.docId)
      .update({
        pricing: afterDataChanges,
        edited: false,
      });

    console.log(
      `Product and prices updated successfully for product ID: ${afterData.stripeProductId}`
    );
  } catch (error) {
    console.error("Error updating Stripe data:", error);
  }
};
