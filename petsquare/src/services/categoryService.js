import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  getCountFromServer,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const productsCollection = collection(db, "product");
export const getCategoryWiseProductTest = async (category) => {
  let productsQuery = query(
    collection(db, "product"),
    where("category", "==", category),
    limit(30)
  );

  const querySnapshot = await getDocs(productsQuery);
  const fetchedProducts = [];
  querySnapshot.forEach((doc) => {
    fetchedProducts.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return fetchedProducts;
};
export const searchProductsByName = async (searchTerm) => {
  try {
    const productsRef = collection(db, "product"); // Replace 'products' with your collection name

    // Use `where` with a substring pattern if you use a dedicated field or preprocessing for text search
    const q = query(
      productsRef,
      where("name", ">=", searchTerm.toLowerCase()),
      where("name", "<=", searchTerm.toLowerCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const results = [];

    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    console.log("Search results:", results);
    return results;
  } catch (error) {
    console.error("Error searching for products:", error);
    return [];
  }
};
