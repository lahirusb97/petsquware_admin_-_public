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
    where("category", "==", category)
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
