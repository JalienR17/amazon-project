export const formatCurrency = (priceCents) => {
  return (priceCents / 100).toFixed(2);
};

export const calcTax = (priceCents) => {
  const roundedPrice = Math.round((priceCents * 10) / 100);
  const dollarPrice = roundedPrice / 100;
  return dollarPrice.toFixed(2);
};
