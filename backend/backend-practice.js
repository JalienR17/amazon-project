import { fetchProductsAsync } from "../data/products.js"; // Importing my fetch functions
import { loadFakeCartAsync } from "../data/cart.js";

// This is an older more outdated way of making XML requests, with its functionality stored in a class
const xhr = new XMLHttpRequest();
xhr.addEventListener("load", () => {
  // It uses a callback (the add event listener that waits for the load) instead of the promise class or the
  // async function with await to wait for the response. Since callbacks must be nested to work they can lead
  // to "call back hell"
  const products = JSON.parse(xhr.response);
});
// It uses the open and send methods to fetch from the API
xhr.open("GET", "https://supersimplebackend.dev/products");
xhr.send();

// This is the updated way of making API calls. It uses async/await to wait for the response and automaticaly
// returns a promise. We can use .then after this function since its value is a promise.
export const loadPageAPI = async (functions) => {
  try {
    // Try catch can be used to catch network errors if the proccess breaks but not for server 400+ errors
    //throw "Test Error";
    await Promise.all([fetchProductsAsync(), loadFakeCartAsync()]); // Await is similar to chaining promises
    // so in order to have all the fetch calls load at the same time we use the Promise.all array.
  } catch (error) {
    // the error parameter can be used to catch and store the error message in further detail
    console.log("Error Recieiving From API", error);
  }

  functions(); // I run the parameter as this parameter is meant to run different functions, according to the
  //  page
};
