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
          quantity: priceVariation.metadata.quantity,
          price: priceVariation.unit_amount / 100,
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
    console.log(req.body);

    try {
      const session = await stripe.checkout.sessions.create({
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
        line_items: req.body,
        mode: "payment",
        shipping_options: [
          {
            shipping_rate: "shr_1PYfTPIT4CAR61BEwlQOGbDh",
          },
        ],
      });
      res.json({ url: session.url }); // Send JSON response with the URL to redirect
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
