import { cart } from "../data/cart-oop.js"; // Imports the necessary files to run this page as modules.
import { products, getProduct } from "../data/products.js";
import { loadPageAPI } from "../backend/backend-practice.js";

const generateTrackingHtml = () => {
  // Defines the function that will generate the html.
  const url = new URL(window.location.href); // Takes the windows url and creates a url class with its value.
  const orderId = url.searchParams.get("orderId"); // Variables the order ID that has been passed in for that
  // containers button through the href attribute using url search params. The same is done for the next 3
  // variables
  const productId = url.searchParams.get("productId");
  const expectedDate = url.searchParams.get("arrival");
  const quantity = url.searchParams.get("quantity");
  const matchingProduct = getProduct(productId); // The product id is used to find the full
  // information for that product within the original products array in order to use its property
  // values. This is achieved with the function getProduct() which uses a find loop to return a matching
  // product.

  // Now defines the html with the extracted values.
  const html = `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">Arriving on ${expectedDate}</div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">Quantity: ${quantity}</div>

      <img
        class="product-image"
        src=${matchingProduct.image}
      />

      <div class="progress-labels-container">
        <div class="progress-label">Preparing</div>
        <div class="progress-label current-status">Shipped</div>
        <div class="progress-label">Delivered</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    </div>
  `;

  document.querySelector(".js-main").innerHTML = html; // Displays the html in the js-main container.
};

loadPageAPI(() => {
  // The API data is loaded before the functions are ran. look into the checkout.js and
  // backend-practice.js file for a more in depth analysis.
  generateTrackingHtml();
  cart.updateCartQuantity();
});
