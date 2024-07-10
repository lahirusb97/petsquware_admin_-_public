import React, { useEffect } from "react";
import Card from "../components/Card";
import { Button } from "@mui/material";
import { useProductContext } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
export default function Product() {
  const productsPerPage = 4;
  const { products, loading, totalCount, loadMore } = useProductContext();
  const { showToast } = useToast();

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-center">
        {products.map((product) => (
          <Card product={product} />
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {totalCount && !loading && (
        <Button onClick={loadMore} className="see-more-btn">
          See More
        </Button>
      )}
    </div>
  );
}
