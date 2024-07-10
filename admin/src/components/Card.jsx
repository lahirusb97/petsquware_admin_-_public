import React from "react";
import { Link, useNavigate } from "react-router-dom";
import paw from "../assets/paw.svg";
import { Button, IconButton } from "@mui/material";
import { DeleteProduct, deleteProductDoc } from "../service/ProductService";
import { deleteObject, getStorage, ref } from "firebase/storage";

const Card = ({ product }) => {
  const navigate = useNavigate();

  const deleteProductData = async () => {
    const deleteProduct = await DeleteProduct(product.id, product.images);
    if (deleteProduct.success) {
      console.log(deleteProduct.message);
      const deleteDocData = await deleteProductDoc(product.id);
      if (deleteDocData.success) {
        // alert(deleteDocData.message);
      } else {
        // alert(deleteDocData.error);
      }
    } else {
    }
  };

  return (
    <div className="sm:w-96 border cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <img
        src={product.images[0]}
        className="w-full sm:w-96 h-96 object-cover"
        alt={product.name}
      />
      <div className="flex flex-col items-center p-4">
        <h5 className="mt-4 text-center font-sans text-lg">{product.name}</h5>
        <h4 className="text-center font-bold text-lg text-red-600 mt-2">
          {product.price}₹
        </h4>
        <div className="flex justify-between w-full px-4 mt-4">
          {/* <img
            src={paw}
            alt="paw"
            className="w-16 rotate-45 transform transition-transform duration-200 hover:rotate-0"
          /> */}

          <Button
            onClick={() => navigate("/product_update/" + product.id + "/")}
            variant="contained"
            color="success"
          >
            Edit
          </Button>
          <Button onClick={deleteProductData} variant="outlined" color="error">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
