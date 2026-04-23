import { calcTax } from "../scripts/utils/money.js";
import { getOption } from "./delivery-options.js";
import { getProduct } from "./products.js";

export let cart;

export const loadCartFromStorage = () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
};
loadCartFromStorage();

export const addToCart = (productID, selection) => {
  let matchingProduct;

  cart.forEach((product) => {
    if (productID === product.productID) {
      matchingProduct = product;
    }
  });

  if (matchingProduct) {
    matchingProduct.quantity += selection;
  } else {
    cart.push({ productID, quantity: selection, deliveryOptionId: "1" });
  }

  saveToLocalStorage();
};

export const updateCartQuantity = () => {
  let cartQuantity = 0;

  cart.forEach((product) => {
    cartQuantity += product.quantity;
  });

  const cartIcon = document.querySelector(".js-cart-quantity");
  if (cartIcon) {
    cartIcon.innerText = cartQuantity;
  }

  return cartQuantity;
};

export const forEachCartButton = () => {
  document.querySelectorAll(".js-add-cart").forEach((button) => {
    const productID = button.dataset.productId;

    button.addEventListener("click", () => {
      const container = button.closest(".product-container");
      const selector = container.querySelector(".js-selector");
      const selection = Number(selector.value);

      addToCart(productID, selection);
      updateCartQuantity();
    });
  });
};

export const deleteFromCart = (productId) => {
  cart = cart.filter(
    (item) => productId !== item.productID || item.quantity > 1,
  ); // one linner filter function, which simplifies the code
  /*const newCart = [];

  cart.forEach((item) => {
    if (item.productID !== productId || item.quantity > 1) {
      newCart.push(item);
    }
  });

  cart = newCart;
  const container = document.querySelector(
    `.js-for-surgical-removal-${productId}`,
  ); // cool way to remove the container and useful to learn for future projects but the HTML re-render is actually better in this scenerio since its based off of the actual cart. One source of truth
  container.remove();*/
  saveToLocalStorage();
};

export const deleteQuantity = (productId) => {
  cart.forEach((item) => {
    /* if (productId === item.productID && item.quantity > 1) {
      item.quantity--;
    }*/

    if (productId === item.productID) {
      if (item.quantity > 1) {
        item.quantity--;
      }
    }
  });
};

export const saveToLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const saveNewQuantity = (productId, quantityInput) => {
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
};

export const updateDeliveryOptionId = (productId, optionId) => {
  const matchingItem = getItem(productId);

  if (matchingItem) {
    matchingItem.deliveryOptionId = optionId;
  }

  saveToLocalStorage();
};

export const calcPaymentSummary = () => {
  let allItemsTotal = 0;
  let totalShipping = 0;

  cart.forEach((item) => {
    const matchingProduct = getProduct(item.productID);
    const matchingOption = getOption(item.deliveryOptionId);

    if (matchingProduct) {
      allItemsTotal += item.quantity * matchingProduct.priceCents;
    }

    if (matchingOption) {
      totalShipping += matchingOption.deliveryPrice;
    }
  });

  const shippingPlusItems = totalShipping + allItemsTotal;
  const tax = calcTax(shippingPlusItems);
  const grandTotal = Number(tax) * 100 + shippingPlusItems;

  return { shippingPlusItems, tax, grandTotal, allItemsTotal, totalShipping };
};

export const getItem = (productId) => {
  const matchingItem = cart.find((item) => item.productID === productId);
  return matchingItem;
};

export const loadFakeCartAPI = (functions) => {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    if (xhr.status >= 400) {
      console.error("Server Error:", xhr.status);
      return;
    }
    const fakeCart = xhr.response;
    console.log(fakeCart);
    console.log("Cart received from API");
  });
  xhr.open("GET", "https://supersimplebackend.dev/cart");
  xhr.send();
  xhr.addEventListener("error", (error) => {
    console.log("Error Recieiving Cart From API", "Error Details:", error);
  });
  functions();
};

export const loadFakeCartAsync = async () => {
  try {
    //throw "Test Error";
    const response = await fetch("https://supersimplebackend.dev/cart");
    if (!response.ok) {
      // This 'throw' sends the code straight to the 'catch' block below if a server 400 or above error response is detected
      throw new Error(`Server Error: ${response.status}`);
    }
    const data = await response.text();
    const fakeCart = data;
    console.log(fakeCart);
    console.log("Cart received from API");
  } catch (error) {
    console.log("Error loading cart from API", error);
  }
};
