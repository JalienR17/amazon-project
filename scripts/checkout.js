import {
  cart,
  updateCartQuantity,
  deleteFromCart,
  deleteQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

const generateCartHtml = () => {
  const cartQuantity = updateCartQuantity();
  const checkoutInnerText = `Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} items</a>)`;
  let htmlList = "";

  if (cart.length === 0) {
    document.querySelector(".js-empty-cart-title").innerHTML =
      "<p> Your Cart Is Empty! :( </p>";
    document.querySelector(".js-payment-summary").remove();
  }

  cart.forEach((item) => {
    products.forEach((product) => {
      let matchingProduct;

      if (item.productID === product.id) {
        matchingProduct = product.id;
      }

      if (matchingProduct) {
        htmlList += `
          <div class="cart-item-container js-for-surgical-removal-${item.productID}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${product.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${product.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(product.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${item.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span data-id="${product.id}"class="delete-quantity-link link-primary js-delete-item">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name=${product.id}>
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name=${product.id}>
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name=${product.id}>
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    });
  });

  document.querySelector(".js-checkout-items").innerHTML = checkoutInnerText;
  document.querySelector(".js-order-display").innerHTML = htmlList;

  document.querySelectorAll(".js-delete-item").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.id;
      deleteFromCart(productId);
      deleteQuantity(productId);
      generateCartHtml();
    });
  });
};

generateCartHtml();
