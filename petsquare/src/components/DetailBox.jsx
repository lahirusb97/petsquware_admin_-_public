import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import location from "../assets/Icons/location.svg";
import plus from "../assets/Icons/plus.svg";
import minus from "../assets/Icons/minus.svg";
import { Typography } from "@mui/material";
import { useCartContext } from "../context/CartContext";

const DetailBox = ({ productData }) => {
  const [qtyadd, setqtyadd] = useState(1);

  const { cartItems, addToCart } = useCartContext();
  const [priceData, setPriceData] = useState({
    price: productData["pricing"][0]["price"],
    qty: productData["pricing"][0]["quantity"],
    color: productData["pricing"][0]["color"],
    id: productData["pricing"][0]["id"],
  });
  console.log(priceData);
  const handleAddToCart = () => {
    const item = {
      ...priceData,
      name: productData["name"],
      description: productData["description"],
      userSelectQty: qtyadd,
      images: productData["images"],
    };
    addToCart(item);
  };
  const getStripe = (() => {
    let stripePromise;
    return () => {
      if (!stripePromise) {
        stripePromise = loadStripe(
          "pk_test_51PXmjKIT4CAR61BEQ8aawVjGMNA1Mb0dWva2ldQv9foYNczkIsWpRBluZRysZq1fKAMm70FdqzdhNGCC3JTpu8O5003j5OQ775"
        );
      }
      return stripePromise;
    };
  })();

  const redirectToCheckOut = async () => {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        { price: "price_1PZrF2IT4CAR61BEUyq3yVTw", quantity: qtyadd },
      ],
      mode: "payment",
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });
    if (error) {
      console.error(error);
    }
  };

  const handleColorSelect = (color) => {
    setPriceData({
      price: color.price,
      qty: color.quantity,
      color: color.color,
      id: color.id,
    });
    setqtyadd(1);
  };

  return (
    <div className="flex flex-col max-w-md p-4 bg-white rounded-lg shadow-md sm:w-96 w-full">
      {/* Product Name */}
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        {productData.name}
      </h1>

      {/* Product Description */}
      <div className="items-center mb-4">
        <p className="text-gray-600 text-sm">{productData.description}</p>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold text-red-600">
          {priceData.price} AUD
        </div>
      </div>

      {/* Colors */}
      <div className="mb-4">
        <h2 className="font-semibold text-gray-800 text-lg mb-2">Colors</h2>
        <div className="flex space-x-3">
          {productData["pricing"].map((color, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                priceData["color"] === color["color"]
                  ? "border-red-600"
                  : "border-gray-300"
              }`}
              style={{ background: color["color"] }}
              onClick={() => handleColorSelect(color)}
              role="button"
            >
              {priceData["color"] === color["color"] && (
                <div className="w-3 h-3 rounded-full bg-red-600 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-4">
        <h2 className="font-semibold text-gray-800 text-lg mb-2">Quantity</h2>
        <div className="flex items-center">
          <img
            src={plus}
            alt="increase"
            className="cursor-pointer w-8"
            onClick={() => {
              if (qtyadd < priceData.qty) {
                setqtyadd(qtyadd + 1);
              }
            }}
          />

          <h3 className="text-xl font-semibold mx-4">{qtyadd}</h3>
          <img
            src={minus}
            alt="decrease"
            className="cursor-pointer w-8"
            onClick={() => {
              if (qtyadd > 1) {
                setqtyadd(qtyadd - 1);
              }
            }}
          />
        </div>
        <div className="ml-auto text-gray-600 text-sm">
          {priceData.qty} Pieces available
        </div>
      </div>

      {/* Add to Cart Button */}
      <div>
        {priceData.qty > 0 ? (
          <div>
            <button
              // onClick={redirectToCheckOut}
              onClick={handleAddToCart}
              className="w-full py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Add To Card
            </button>
            {/* <button
              // onClick={redirectToCheckOut}
              onClick={redirectToCheckOut}
              className="w-full py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Buy
            </button> */}
          </div>
        ) : (
          <Typography variant="h4" color="error" align="center">
            This Color is Out Of Stock
          </Typography>
        )}
      </div>
    </div>
  );
};

DetailBox.propTypes = {
  productData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    qty: PropTypes.number.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default DetailBox;
