// ProductContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useProductLoad } from "../hooks/useProductsLoad";
import { db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
} from "firebase/firestore";
import { fetchProductsCount } from "../service/LoadAllProduct";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
const ProductContext = createContext();

export const ProductProvider = ({ children, productsPerPage }) => {
  const { products, loadMore, loading, totalCount } = useProductLoad();

  // const [docs, setDocs] = useState([]);

  // useEffect(() => {
  //   const q = query(
  //     collection(db, "product"),

  //     limit(1)
  //   );
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const productArray = [];
  //     querySnapshot.forEach((doc) => {
  //       productArray.push(doc.data());
  //     });
  //     console.log(productArray);
  //   });

  //   return () => unsubscribe();
  // }, []);

  return (
    <ProductContext.Provider
      value={{ products, loadMore, loading, totalCount }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
