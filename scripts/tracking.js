import { cart } from "../data/cart-oop.js"; // Imports the necessary files to run this page as modules.
import { products, getProduct } from "../data/products.js";
import { loadPageAPI } from "../backend/backend-practice.js";

const generateTrackingHtml = () => {
  // Defines the function that will generate the html.
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");
  const expectedDate = url.searchParams.get("arrival");
  const quantity = url.searchParams.get("quantity");
  const matchingProduct = getProduct(productId);

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

  document.querySelector(".js-main").innerHTML = html;
};

loadPageAPI(() => {
  generateTrackingHtml();
  cart.updateCartQuantity();
});
