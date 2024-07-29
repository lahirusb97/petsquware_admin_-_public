import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import {
  getCategoryWiseProductTest,
  searchProductsByName,
} from "../services/categoryService";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";

export default function Search() {
  const [products, setProduct] = useState([]);
  const productsPerPage = 4;
  const location = useLocation();
  const currentPath = location.pathname;
  const decodedPath = decodeURIComponent(currentPath);
  // const { products, loading, loadMoreProducts } = useCategoryWiseProduct(
  //   10,
  //   location.pathname.replace("/", "")
  // );
  console.log(decodedPath.replace("/search/", ""));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await searchProductsByName(
          decodedPath.replace("/search/", "")
        );
        setProduct(fetchedProducts);
      } catch (err) {
        console.log(err);
      } finally {
      }
    };

    fetchProducts();
  }, [currentPath]);
  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-center my-8">
        {products.length > 0 ? (
          products.map((product) => (
            <Card
              key={product.id}
              img={product.images ? product.images[0] : imgb1}
              name={product.name}
              description={product.description}
              pricing={product.pricing}
              id={product.id}
            />
          ))
        ) : (
          <>No Items</>
        )}
      </div>
    </div>
  );
}
