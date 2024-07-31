import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { fetchProductsCount } from "../service/LoadAllProduct";

export const useProductLoad = (coll) => {
  const [products, setProducts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const count = await fetchProductsCount();
        setTotalCount(count);

        // Initial query (limit 1)
        const initialQ = query(collection(db, "product"), limit(20));
        const initialUnsubscribe = onSnapshot(initialQ, (initialSnapshot) => {
          const initialProductArray = initialSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setProducts(initialProductArray);
          setLastDoc(initialSnapshot.docs[initialSnapshot.docs.length - 1]);
          setLoading(false);
        });

        // Return cleanup function to unsubscribe
        return () => initialUnsubscribe();
      } catch (error) {
        console.error("Error fetching initial products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadMore = () => {
    setLoading(true);

    // Pagination query (limit 10 starting after lastDoc)
    const paginationQ = query(
      collection(db, "product"),
      startAfter(lastDoc),
      limit(10)
    );

    const paginationUnsubscribe = onSnapshot(
      paginationQ,
      (paginationSnapshot) => {
        const newDocs = paginationSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setProducts((prevProducts) => [...prevProducts, ...newDocs]);
        setLastDoc(paginationSnapshot.docs[paginationSnapshot.docs.length - 1]);
        setLoading(false);
      }
    );

    // Return cleanup function to unsubscribe
    return () => paginationUnsubscribe();
  };

  return { products, loadMore, loading, totalCount };
};
