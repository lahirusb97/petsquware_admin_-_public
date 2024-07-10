import React from "react";
import NavBar from "../components/NavBar";
import { useCategoryWiseProduct } from "../hooks/useCategoryWiseProduct";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import Card from "../components/Card";
import Footer from "./Footer";

export default function CatCategory() {
  const location = useLocation();

  const productsPerPage = 4;

  const { products, loading, loadMoreProducts } = useCategoryWiseProduct(
    10,
    location.pathname.replace("/", "")
  );
  console.log(products);
  return (
    <div>
      <NavBar />

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

      <Button onClick={loadMoreProducts} className="see-more-btn">
        See More
      </Button>

      <Footer />
    </div>
  );
}
