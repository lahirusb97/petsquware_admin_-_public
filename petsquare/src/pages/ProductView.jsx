import React from "react";
import { useParams } from "react-router-dom";
import ProductViewImgBox from "../components/ProductViewImgBox";
import NavBar from "../components/NavBar";
export default function ProductView() {
  const { product } = useParams();
  return (
    <div>
      <NavBar />
      <div className="max-w-7xl m-auto xsm:mt-28 mt-2">
        <ProductViewImgBox />
      </div>
    </div>
  );
}
