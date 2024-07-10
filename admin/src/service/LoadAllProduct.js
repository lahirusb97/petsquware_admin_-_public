import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
// const db = getFirestore();
const productsCollection = collection(db, "product");

// export const fetchProducts = async (productsPerPage, lastVisible) => {
//   let productsQuery = query(productsCollection, limit(productsPerPage));

//   if (lastVisible) {
//     productsQuery = query(
//       productsCollection,
//       startAfter(lastVisible),
//       limit(productsPerPage)
//     );
//   }

//   const querySnapshot = await getDocs(productsQuery);
//   const fetchedProducts = [];
//   querySnapshot.forEach((doc) => {
//     fetchedProducts.push({
//       id: doc.id,
//       ...doc.data(),
//     });
//   });

//   const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

//   return {
//     products: fetchedProducts,
//     lastVisible: lastDoc,
//     hasMore: querySnapshot.docs.length === productsPerPage,
//   };
// };

export const fetchProductsCount = async () => {
  try {
    const countSnapshot = await getCountFromServer(productsCollection);

    return countSnapshot.data().count;
  } catch (error) {
    return 0;
  }
};
