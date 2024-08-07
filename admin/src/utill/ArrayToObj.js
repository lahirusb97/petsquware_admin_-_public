export const convertPricesArrayToObject = (pricesArray) => {
  return pricesArray.reduce((acc, price) => {
    acc[price.id] = price;
    return acc;
  }, {});
};
