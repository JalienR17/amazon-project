/*import {
  cart,
  updateCartQuantity,
  deleteFromCart,
  deleteQuantity,
  saveToLocalStorage,
  updateDeliveryOptionId,
  saveNewQuantity,
} from "../../data/cart.js";*/
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions, getOption } from "../../data/delivery-options.js";
import { generatePaymentSummary } from "./payment-summary.js";
import { getProduct } from "../../data/products.js";
import { cart } from "../../data/cart-oop.js";

export const deliveryOptionsHtml = (productId, deliveryOptionId) => {
  let deliveryOptionsHtml = "";

  deliveryOptions.forEach((option) => {
    const today = dayjs();
    const deliveryDate = today.add(option.deliveryDays, "days");
    const formattedDate = deliveryDate.format("dddd, MMMM D");
    const deliveryPrice =
      option.deliveryPrice === 0
        ? "FREE"
        : `$${formatCurrency(option.deliveryPrice)} -`;
    const isChecked = option.id === deliveryOptionId;

    deliveryOptionsHtml += `
        <div class="delivery-option" data-option-id="${option.id}" data-product-id="${productId}">
          <input type="radio" ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name=${productId}>
          <div>
            <div class="delivery-option-date">
              ${formattedDate}
            </div>
            <div class="delivery-option-price js-delivery-option-price">
              ${deliveryPrice} Shipping
            </div>
          </div>
        </div>`;
  });

  return deliveryOptionsHtml;
};

export const generateCartHtml = () => {
  const cartQuantity = cart.updateCartQuantity();
  const checkoutInnerText = `Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} items</a>)`;
  let itemsHtml = "";

  if (cart.cartItems.length === 0) {
    document.querySelector(".js-empty-cart-title").innerHTML =
      "<p> Your Cart Is Empty! :( </p>";
    document.querySelector(".js-payment-summary").remove();
  }

  cart.cartItems.forEach((item) => {
    //products.forEach((product) => {
    //let matchingProduct;
    //let selectedOption;
    const matchingProduct = getProduct(item.productID);
    const selectedOption = getOption(item.deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(selectedOption.deliveryDays, "days");
    const formattedDate = deliveryDate.format("dddd, MMMM D");

    /*if (item.productID === product.id) {
        matchingProduct = product.id;
      }

      deliveryOptions.forEach((option) => {
        if (option.id === item.deliveryOptionId) {
          selectedOption = option;
        }
      });*/

    if (matchingProduct) {
      itemsHtml += `
          <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}" data-id="${matchingProduct.id}">
            <div class="delivery-date">
              Delivery Date: ${formattedDate}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${matchingProduct.image}>

              <div class="cart-item-details js-cart-item-details-${matchingProduct.id}">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span class="js-quantity-${matchingProduct.id}">
                    Quantity: <span class="quantity-label js-quantity">${item.quantity}</span>
                  </span>
                  <span data-id="${matchingProduct.id}" class="update-quantity-link link-primary js-update-item">
                    Update
                  </span>
                  <span data-id="${matchingProduct.id}" class="delete-quantity-link link-primary js-delete-item js-delete-link-${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHtml(matchingProduct.id, item.deliveryOptionId)}
              </div>
            </div>
          </div>
        `;
    }
    //});
  });

  document.querySelector(".js-checkout-items").innerHTML = checkoutInnerText;
  document.querySelector(".js-order-display").innerHTML = itemsHtml;

  document.querySelectorAll(".js-delete-item").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.id;
      cart.deleteFromCart(productId);
      cart.deleteQuantity(productId);
      cart.saveToLocalStorage();
      generateCartHtml();
      generatePaymentSummary();
    });
  });

  document.querySelectorAll(".js-update-item").forEach((link) => {
    const productId = link.dataset.id;
    const container = link.closest(".cart-item-container");
    const quantity = container.querySelector(".js-quantity");
    const updateLink = container.querySelector(".js-update-item");

    link.addEventListener("click", () => {
      quantity.innerHTML = `<input class="js-input" type="number"/>`;
      updateLink.innerHTML = `<span class="save-link link-primary js-save-link">Save</span>`;
      const saveLink = container.querySelector(".js-save-link");
      const quantityInput = container.querySelector(".js-input");

      saveLink.addEventListener("click", () => {
        saveNewQuantity(productId, quantityInput);
        generateCartHtml();
        generatePaymentSummary();
      });

      quantityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          cart.saveNewQuantity(productId, quantityInput);
          generateCartHtml();
          generatePaymentSummary();
        }
      });
    });
  });

  document.querySelectorAll(".delivery-option").forEach((container) => {
    const { optionId, productId } = container.dataset;
    container.addEventListener("click", () => {
      cart.updateDeliveryOptionId(productId, optionId);
      generateCartHtml();
      generatePaymentSummary();
    });
  });
};
