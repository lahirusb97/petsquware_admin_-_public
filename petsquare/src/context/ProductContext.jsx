// ProductContext.js
import React, { createContext, useContext } from "react";
import { useProducts } from "../hooks/useProducts"; // Adjust the import path as needed

const ProductContext = createContext();

export const ProductProvider = ({ children, productsPerPage }) => {
  const productData = useProducts(productsPerPage);

  return (
    <ProductContext.Provider value={productData}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
