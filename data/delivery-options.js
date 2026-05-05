export const deliveryOptions = [
  // A delivery options array is made with each options content stored inside an object in order to be accessed through loops and dot notations to then be rendered on the page.
  {
    id: "1",
    deliveryDays: 7,
    deliveryPrice: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    deliveryPrice: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    deliveryPrice: 999,
  },
];

export const getOption = (optionId) => {
  // Defines a get option function to avoid having to write the find loop multiple times through out the project and implements the DRY principle.
  const matchingOption = deliveryOptions.find(
    (option) => option.id === optionId, // Takes an argument holding the users selected option ID and runs the loop through the array to find the matching option and stores its value in the variable.
  );
  return matchingOption || deliveryOptions[0]; // Returns the value of that option if its found or sets a default option at index 0 which is the first option in the array with id 1.
};
