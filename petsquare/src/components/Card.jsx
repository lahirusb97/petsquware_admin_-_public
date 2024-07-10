import React from "react";
import { Link, useNavigate } from "react-router-dom";
import paw from "../assets/paw.svg";

const Card = (props) => {
  const navigate = useNavigate();
  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

  console.log(props);
  return (
    <div
      onClick={() => openInNewTab(`/${props.id}`)}
      className="w-full sm:w-72 md:w-80 border cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
    >
      {/* Product Image */}
      <img
        src={props.img}
        className="w-full h-52 object-cover rounded-t-lg"
        alt={props.name}
      />

      {/* Product Details */}
      <div className="flex flex-col items-center p-2 bg-white rounded-b-lg">
        {/* Product Name */}
        <h5 className="mt-2 text-center font-semibold text-lg text-gray-800">
          {props.name}
        </h5>

        {/* Product Price */}
        <h4 className="text-center font-bold text-lg text-red-600 mt-1">
          {props.pricing[0]["price"]} AUD
        </h4>

        {/* Action Buttons */}
        <div className="flex justify-between w-full px-2 mt-2">
          <img
            src={paw}
            alt="paw"
            className="w-8 transform transition-transform duration-200 hover:rotate-12"
          />
          <Link to={`/product/${props.id}`}>
            <button className="bg-blue-500 text-white font-semibold py-1 px-3 rounded mb-1 mt-1 transform transition-transform duration-200 hover:scale-110">
              Buy Now
            </button>
          </Link>
          <img
            src={paw}
            alt="paw"
            className="w-8 -rotate-12 transform transition-transform duration-200 hover:rotate-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
