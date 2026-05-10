export const formatCurrency = (priceCents) => {
  // Defines a format currency function to apply the DRY
  // principle. Uses Integer Math by calculating in cents first to avoid floating-point errors, then rounds
  // and converts to a dollar string for the UI.
  return (priceCents / 100).toFixed(2); // Takes in the price to be formatted as an argument in cents divides
  //  it by 100 to convert into dollars and then uses the toFixed(); method with an argument of 2 as tofixed
  // uses a parameter to define the amount of digits we want to round to after the decimal point.
};

export const calcTax = (priceCents) => {
  //  Defines a calculate tax function that calculates 10% tax for the price given as an argument in cents.
  const roundedPrice = Math.round((priceCents * 10) / 100); // Takes the cents and times it by 10, divides
  //  by 100 and then rounds the results.
  const dollarPrice = roundedPrice / 100; // Converts the rounded price into dollars by dividing.
  return dollarPrice.toFixed(2); // Then returns the price with the to fixed method making it show 2 digits
  // after the decimal point.
};
