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
import { convertPricesObjectToArray } from "../util/ObjToArray";

const productsCollection = collection(db, "product");

export const fetchProducts = async (productsPerPage, lastVisible) => {
  let productsQuery = query(productsCollection, limit(productsPerPage));

  if (lastVisible) {
    productsQuery = query(
      productsCollection,
      startAfter(lastVisible),
      limit(productsPerPage)
    );
  }

  const querySnapshot = await getDocs(productsQuery);
  const fetchedProducts = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const pricingArray = convertPricesObjectToArray(data.pricing);
    fetchedProducts.push({ id: doc.id, ...data, pricing: pricingArray });
  });

  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {
    products: fetchedProducts,
    lastVisible: lastDoc,
    hasMore: querySnapshot.docs.length === productsPerPage,
  };
};

export const fetchProductsCount = async () => {
  const countSnapshot = await getCountFromServer(productsCollection);
  return countSnapshot.data().count;
};

//LOAD CATEGORY
export const fetchCategoryWiseProduct = async (productsPerPage, category) => {
  let productsQuery = query(
    collection(db, "product"),
    where("category", "==", category),
    limit(productsPerPage)
  );

  if (lastVisible) {
    productsQuery = query(
      collection(productsCollection),
      where("category", "==", category),
      startAfter(lastVisible),
      limit(productsPerPage)
    );
  }

  const querySnapshot = await getDocs(productsQuery);
  const fetchedProducts = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const pricingArray = convertPricesObjectToArray(data.pricing);
    fetchedProducts.push({ id: doc.id, ...data, pricing: pricingArray });
  });

  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {
    products: fetchedProducts,
    lastVisible: lastDoc,
    hasMore: querySnapshot.docs.length === productsPerPage,
  };
};
