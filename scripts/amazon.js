import { products, fetchProductsAsync } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
//import { updateCartQuantity, forEachCartButton } from "../data/cart.js";
import { cart } from "../data/cart-oop.js";
import { loadFakeCartAPI } from "../data/cart.js";

export const generateProductsHtml = () => {
  let htmlList = "";

  products.forEach((product) => {
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

  document.querySelector(".js-products-display").innerHTML = htmlList;
};

Promise.all([
  fetchProductsAsync(),
  new Promise((moveOn, reject) => {
    loadFakeCartAPI(() => {
      //reject("Throws an error in a call back");
      moveOn(
        "This is how the value of the response is stored in .then() as a parameter in an array",
      );
    });
  }),
])
  .then((valueOfResponse) => {
    generateProductsHtml();
    cart.forEachCartButton();
    cart.updateCartQuantity();
  })
  .catch((error) => {
    console.log(error);
  });
