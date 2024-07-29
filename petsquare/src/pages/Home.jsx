import React, { useEffect, useState } from "react";
import HeroSlide from "../components/HeroSlide";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import imgb1 from "../assets/ProductImg/imgb1.jpg";
import { Button } from "@mui/material";

import { useProductContext } from "../context/ProductContext";
import Footer from "./Footer";

export default function Home() {
  const productsPerPage = 4;

  const { products, loading, hasMore, loadMoreProducts } = useProductContext();

  return (
    <div>
      <NavBar />
      <HeroSlide />
      <div className="flex flex-wrap gap-4 justify-center my-8">
        {products.map((product) => (
          <Card
            key={product.id}
            img={product.images ? product.images[0] : imgb1}
            name={product.name}
            description={product.description}
            pricing={product.pricing}
            id={product.id}
          />
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {hasMore && !loading && (
        <Button onClick={loadMoreProducts} className="see-more-btn">
          See More
        </Button>
      )}
    </div>
  );
}
