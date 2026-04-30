import { orders } from "../data/orders.js";
import { getProduct, products, fetchProductsAsync } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { cart } from "../data/cart-oop.js";

const forEachOrdertButton = () => {
  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    const productId = button.dataset.productId;

    button.addEventListener("click", () => {
      const selection = 1;
      cart.addToCart(productId, selection);
      cart.updateCartQuantity();
    });
  });
};

const generateOrdersHtml = () => {
  let ordersHtml = "";
  if (orders.length === 0) {
    document.querySelector(".js-page-title").innerHTML =
      "<p style='display: flex; justify-content: center; font-size: 2rem'> You Dont Have Any Orders! :( </p>";
  }

  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime).format("MMMM D");

    const generateOrderProductsHtml = () => {
      let productsHtml = "";

      order.products.forEach((product) => {
        const expectedDate = dayjs(product.estimatedDeliveryTime).format(
          "MMMM D",
        );
        const matchingProduct = getProduct(product.productId);

        if (matchingProduct) {
          productsHtml += `
            <div class="order-details-grid">
              <div class="product-image-container">
                <img src=${matchingProduct.image}>
              </div>

              <div class="product-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-delivery-date">
                  Arriving on: ${expectedDate}
                </div>
                <div class="product-quantity">
                  Quantity: ${product.quantity}
                </div>
                <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${matchingProduct.id}">
                  <img class="buy-again-icon" src="images/icons/buy-again.png">
                  <span class="buy-again-message">Buy it again</span>
                </button>
              </div>

              <div class="product-actions">
                <a href="tracking.html?orderId=${order.id}&productId=${matchingProduct.id}&arrival=${expectedDate}&quantity=${product.quantity}">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            </div>
          `;
        }
      });

      return productsHtml;
    };

    ordersHtml += `
      <div class="order-container js-order-container">

        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        ${generateOrderProductsHtml()}
      </div>
    `;
  });

  document.querySelector(".js-orders-grid").innerHTML = ordersHtml;
};

const loadPageAPI = async () => {
  try {
    await fetchProductsAsync();
  } catch (error) {
    console.log("Error Recieiving From API", error);
  }

  generateOrdersHtml();
  forEachOrdertButton();
  cart.updateCartQuantity();
};

loadPageAPI();
