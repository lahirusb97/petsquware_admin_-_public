export const convertPricingObjectToArray = (pricingObj) => {
  return Object.keys(pricingObj).map((key) => ({
    id: key,
    ...pricingObj[key],
  }));
};
