import { cart } from "../data/cart-oop.js";
import { products, getProduct, fetchProductsAsync } from "../data/products.js";

const generateTrackingHtml = () => {
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

const loadPageAPI = async () => {
  try {
    await fetchProductsAsync();
  } catch (error) {
    console.log("Error Recieiving From API", error);
  }

  generateTrackingHtml();
  cart.updateCartQuantity();
};

loadPageAPI();
