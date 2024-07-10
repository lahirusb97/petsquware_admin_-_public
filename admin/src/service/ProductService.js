import React from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Await } from "react-router-dom";
import { db, storage } from "../firebaseConfig";

// const db = getFirestore();
const productsCollection = collection(db, "product");

//* UPLORD SINGLE IMAGE AND RETURN URL
export async function uploadSingleImages(ID, image, index) {
  try {
    const storageRef = ref(storage, `product/${ID}/${index}`);
    const response = await fetch(image);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return { success: true, downloadURL };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { success: false, error: error.message };
  }
}

//* UPLORD IMAGE AND RETURN ARRAY
export async function uploadImages(ID, images) {
  try {
    const imageUrls = await Promise.all(
      images.map(async (image, index) => {
        const storageRef = ref(storage, `product/${ID}/${index}`);
        const response = await fetch(image);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      })
    );

    return { success: true, imageUrls };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { success: false, error: error.message };
  }
}

//* ADD PRODUCT WITH RANDOM ID
export async function addProduct(data) {
  try {
    const docRef = await addDoc(collection(db, "product"), data);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//* UPDATE PRODUCT
export async function updateProduct(ID, data) {
  try {
    const productRef = doc(db, "product", ID);
    await updateDoc(productRef, data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//* Delete PRODUCT IMG
// export const DeleteProduct = async (ID, images) => {

//   try {
//     await Promise.all(
//       images.map(
//         async (url) =>
//           await deleteObject(ref(getStorage, `product/${ID}/${url}/`))
//       )
//     );
//     return { success: true };
//   } catch (error) {
//     console.error(error.message);
//     return { success: false, error: error.message };
//   }
// };
export const DeleteProduct = async (ID, images) => {
  try {
    await Promise.all(
      images.map(
        async (url, index) =>
          await deleteObject(ref(storage, `product/${ID}/${index}`))
      )
    );
    return { success: true };
  } catch (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
};

//* Delete PRODUCT DOC

export async function deleteProductDoc(ID) {
  try {
    const productRef = doc(db, "product", ID);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}

//Delete USING URL
