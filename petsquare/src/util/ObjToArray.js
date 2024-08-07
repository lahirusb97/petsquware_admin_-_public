// util/ObjToArray.js
export const convertPricesObjectToArray = (pricesObject) => {
  return Object.keys(pricesObject).map((key) => ({
    id: key,
    ...pricesObject[key],
  }));
};
