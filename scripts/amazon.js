import { products, fetchProductsAsync } from "../data/products.js"; // Imports the necessary data to run this
// file as modules
import { formatCurrency } from "./utils/money.js";
//import { updateCartQuantity, forEachCartButton } from "../data/cart.js";
import { cart } from "../data/cart-oop.js";
import { loadFakeCartAPI } from "../data/cart.js";

export const generateProductsHtml = () => {
  // Defines a generate products html function to render the html
  // for each product on the products array.
  let htmlList = ""; // Sets the accumulator variable

  products.forEach((product) => {
    // Runs the for each loop through the products array of classes and takes each products
    //  details and methods which are within the class.
    htmlList += `
    <div class="product-container js-product-container">
      <div class="product-image-container">
        <img
          class="product-image"
          src=${product.image}
        />
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img
          class="product-rating-stars"
          src="${product.getRatingStars()}"
        />
        <div class="product-rating-count link-primary">${product.rating.count}</div>
      </div>

      <div class="product-price">${product.getPrice()}</div>

      <div class="product-quantity-container">
        <select class="js-selector">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      ${product.createLink()} 
      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png" />
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-cart" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `;
  });

  document.querySelector(".js-products-display").innerHTML = htmlList; // Adds the inner html for the container
};

Promise.all([
  // The products data is being received through an API so the API data needs to load first before
  //  the functions can run and render the page. Here is an older way to do this using the promise class but
  // good to know for legacy code and to also understand the evolution of the code.
  fetchProductsAsync(), // Here its using the .all array to simultaneously download the promises. Its first
  // using an async function to load the products, which returns the value of a promise.
  new Promise((moveOn, reject) => {
    // Then defines a new promise class to download the fake cart which is
    // slightly outdated as can be seen with the async function. Uses the first parameter as a value of a
    // function that resolves or continues the code once its been loaded acts like a play button. The second
    // parameter is for error testing as you can see with the comment below.
    loadFakeCartAPI(() => {
      // The load cart function which makes an xml request using the XMLHttpRequest() class has a parameter
      // set that runs a function. In this case it will be used to run the moveOn function set in the promise
      //  and to catch the reponses value as a parameter which is then passed over to .then.
      //reject("Throws an error in a call back");
      moveOn(
        "This is how the value of the response is stored in .then() as a parameter in an array",
      ); // Once the request has been made the move function continues the promise or resolves the promise.
    });
  }),
])
  .then((valueOfResponse) => {
    //  Now has the value of the response as a parameter and the functions that
    // needed the data can be run
    generateProductsHtml(); // Displays the Html with the products details in the array.
    cart.forEachCartButton(); // Runs a function that has a for each loop and event listeners for each button.
    cart.updateCartQuantity(); // Runs the update cart quantity function.
  })
  .catch((error) => {
    // Catches the error and logs its details.
    console.log(error);
  });
