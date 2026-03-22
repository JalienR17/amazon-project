import {
  cart,
  updateCartQuantity,
  deleteFromCart,
  deleteQuantity,
  saveToLocalStorage,
} from "../data/cart.js";
import products from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import deliveryOptions from "../data/delivery-options.js";

const deliveryOptionsHtml = (productId, deliveryOptionId) => {
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
        <div class="delivery-option">
          <input data-id="${option.id}" type="radio" ${isChecked ? "checked" : ""}
            class="delivery-option-input js-delivery-option-input"
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

const generateCartHtml = () => {
  const cartQuantity = updateCartQuantity();
  const checkoutInnerText = `Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} items</a>)`;
  let itemsHtml = "";

  if (cart.length === 0) {
    document.querySelector(".js-empty-cart-title").innerHTML =
      "<p> Your Cart Is Empty! :( </p>";
    document.querySelector(".js-payment-summary").remove();
  }

  cart.forEach((item) => {
    //products.forEach((product) => {
    //let matchingProduct;
    //let selectedOption;
    const matchingProduct = products.find(
      (product) => product.id === item.productID,
    );
    const selectedOption = deliveryOptions.find(
      (option) => option.id === item.deliveryOptionId,
    );
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
          <div class="cart-item-container" data-id="${matchingProduct.id}">
            <div class="delivery-date">
              Delivery Date: ${formattedDate}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${matchingProduct.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity">${item.quantity}</span>
                  </span>
                  <span data-id="${matchingProduct.id}" class="update-quantity-link link-primary js-update-item">
                    Update
                  </span>
                  <span data-id="${matchingProduct.id}" class="delete-quantity-link link-primary js-delete-item">
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
      deleteFromCart(productId);
      deleteQuantity(productId);
      generateCartHtml();
      saveToLocalStorage();
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

      const saveNewQuantity = () => {
        const newQuantity = Number(quantityInput.value);

        cart.forEach((item) => {
          if (productId === item.productID) {
            if (newQuantity >= 0 && newQuantity < 1000) {
              item.quantity = newQuantity;
            } else {
              alert("Please enter a valid quantity (0-999)");
            }
          }

          if (newQuantity === 0) {
            deleteFromCart(productId);
          }
        });

        saveToLocalStorage();
        generateCartHtml();
      };

      saveLink.addEventListener("click", saveNewQuantity);
      quantityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveNewQuantity();
        }
      });
    });
  });

  document
    .querySelectorAll(".js-delivery-option-input")
    .forEach((optionInput) => {
      const optionId = optionInput.dataset.id;
      const itemContainer = optionInput.closest(".cart-item-container");
      const productId = itemContainer.dataset.id;

      optionInput.addEventListener("click", () => {
        // Find the SPECIFIC item that matches this product ID in order to store its value and use it for modifications
        const matchingItem = cart.find((item) => item.productID === productId);

        if (matchingItem) {
          matchingItem.deliveryOptionId = optionId;

          saveToLocalStorage();
          generateCartHtml();
        }
      });
    });
};

generateCartHtml();
