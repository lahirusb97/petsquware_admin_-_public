import { useState, useEffect } from "react";
import { fetchProducts, fetchProductsCount } from "../services/productService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const useProducts = (productsPerPage) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true); // Set loading to true before fetching initial data
      try {
        const count = await fetchProductsCount();
        setTotalCount(count);

        const {
          products: initialProducts,
          lastVisible: initialLastVisible,
          hasMore: initialHasMore,
        } = await fetchProducts(productsPerPage);

        setProducts(initialProducts);
        setLastVisible(initialLastVisible);
        setHasMore(initialHasMore);
      } catch (error) {
        console.error("Error initializing products: ", error);
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
      } = await fetchProducts(productsPerPage, lastVisible);

      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setLastVisible(newLastVisible);
      setHasMore(newHasMore);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, hasMore, loadMoreProducts, totalCount };
};
