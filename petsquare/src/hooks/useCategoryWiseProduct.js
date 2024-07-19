import { useState, useEffect } from "react";
import { fetchCategoryWiseProduct } from "../services/productService";

export const useCategoryWiseProduct = (productsPerPage, category) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true); // Set loading to true before fetching initial data
      try {
        const {
          products: initialProducts,
          lastVisible: initialLastVisible,
          hasMore: initialHasMore,
        } = await fetchCategoryWiseProduct(productsPerPage, category);
        console.log(initialProducts);
        setProducts(initialProducts);
        setLastVisible(initialLastVisible);
        setHasMore(initialHasMore);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false); // Set loading to false once initialization is complete
      }
    };

    initialize();
  }, []); // Re-run the effect if productsPerPage changes

  const loadMoreProducts = async () => {
    if (!hasMore) return; // Prevent further loading if no more products are available

    setLoading(true);
    try {
      const {
        products: newProducts,
        lastVisible: newLastVisible,
        hasMore: newHasMore,
      } = await fetchCategoryWiseProduct(productsPerPage, lastVisible);

      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setLastVisible(newLastVisible);
      setHasMore(newHasMore);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, hasMore, loadMoreProducts };
};
