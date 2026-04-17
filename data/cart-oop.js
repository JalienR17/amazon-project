import { calcTax } from "../scripts/utils/money.js";
import { getOption } from "./delivery-options.js";
import { getProduct } from "./products.js";

const Cart = (localStorageKey) => {
  const cart = {
    cartItems: [],
    loadCartFromStorage: function () {
      this.cartItems =
        JSON.parse(localStorage.getItem(`${localStorageKey}`)) || [];
    },
    addToCart: function (productID, selection) {
      let matchingProduct;

      this.cartItems.forEach((product) => {
        if (productID === product.productID) {
          matchingProduct = product;
        }
      });

      if (matchingProduct) {
        matchingProduct.quantity += selection;
      } else {
        this.cartItems.push({
          productID,
          quantity: selection,
          deliveryOptionId: "1",
        });
      }

      this.saveToLocalStorage();
    },
    updateCartQuantity: function () {
      let cartQuantity = 0;

      this.cartItems.forEach((product) => {
        cartQuantity += product.quantity;
      });

      const cartIcon = document.querySelector(".js-cart-quantity");
      if (cartIcon) {
        cartIcon.innerText = cartQuantity;
      }

      return cartQuantity;
    },
    forEachCartButton: function () {
      document.querySelectorAll(".js-add-cart").forEach((button) => {
        const productID = button.dataset.productId;

        button.addEventListener("click", () => {
          const container = button.closest(".product-container");
          const selector = container.querySelector(".js-selector");
          const selection = Number(selector.value);

          this.addToCart(productID, selection);
          this.updateCartQuantity();
        });
      });
    },
    deleteFromCart: function (productId) {
      this.cartItems = this.cartItems.filter(
        (item) => productId !== item.productID || item.quantity > 1,
      );

      this.saveToLocalStorage();
    },
    deleteQuantity: function (productId) {
      this.cartItems.forEach((item) => {
        if (productId === item.productID) {
          if (item.quantity > 1) {
            item.quantity--;
          }
        }
      });
    },
    saveToLocalStorage: function () {
      localStorage.setItem(
        `${localStorageKey}`,
        JSON.stringify(this.cartItems),
      );
    },
    saveNewQuantity: function (productId, quantityInput) {
      const newQuantity = Number(quantityInput.value);

      this.cartItems.forEach((item) => {
        if (productId === item.productID) {
          if (newQuantity >= 0 && newQuantity < 1000) {
            item.quantity = newQuantity;
          } else {
            alert("Please enter a valid quantity (0-999)");
          }
        }

        if (newQuantity === 0) {
          this.deleteFromCart(productId);
        }
      });

      this.saveToLocalStorage();
    },
    updateDeliveryOptionId: function (productId, optionId) {
      const matchingItem = this.getItem(productId);

      if (matchingItem) {
        matchingItem.deliveryOptionId = optionId;
      }

      this.saveToLocalStorage();
    },
    calcPaymentSummary: function () {
      let allItemsTotal = 0;
      let totalShipping = 0;

      this.cartItems.forEach((item) => {
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

      return {
        shippingPlusItems,
        tax,
        grandTotal,
        allItemsTotal,
        totalShipping,
      };
    },
    getItem: function (productId) {
      const matchingItem = this.cartItems.find(
        (item) => item.productID === productId,
      );
      return matchingItem;
    },
  };

  return cart;
};

class CartClass {
  cartItems = [];
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this._loadCartFromStorage();
  }

  _loadCartFromStorage() {
    this.cartItems =
      JSON.parse(localStorage.getItem(`${this.#localStorageKey}`)) || [];
  }

  addToCart(productID, selection) {
    let matchingProduct;

    this.cartItems.forEach((product) => {
      if (productID === product.productID) {
        matchingProduct = product;
      }
    });

    if (matchingProduct) {
      matchingProduct.quantity += selection;
    } else {
      this.cartItems.push({
        productID,
        quantity: selection,
        deliveryOptionId: "1",
      });
    }

    this.saveToLocalStorage();
  }

  updateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((product) => {
      cartQuantity += product.quantity;
    });

    const cartIcon = document.querySelector(".js-cart-quantity");
    if (cartIcon) {
      cartIcon.innerText = cartQuantity;
    }

    return cartQuantity;
  }

  forEachCartButton() {
    document.querySelectorAll(".js-add-cart").forEach((button) => {
      const productID = button.dataset.productId;

      button.addEventListener("click", () => {
        const container = button.closest(".product-container");
        const selector = container.querySelector(".js-selector");
        const selection = Number(selector.value);

        this.addToCart(productID, selection);
        this.updateCartQuantity();
      });
    });
  }

  deleteFromCart(productId) {
    this.cartItems = this.cartItems.filter(
      (item) => productId !== item.productID || item.quantity > 1,
    );

    this.saveToLocalStorage();
  }

  deleteQuantity(productId) {
    this.cartItems.forEach((item) => {
      if (productId === item.productID) {
        if (item.quantity > 1) {
          item.quantity--;
        }
      }
    });
  }

  saveToLocalStorage() {
    localStorage.setItem(
      `${this.#localStorageKey}`,
      JSON.stringify(this.cartItems),
    );
  }

  saveNewQuantity(productId, quantityInput) {
    const newQuantity = Number(quantityInput.value);

    this.cartItems.forEach((item) => {
      if (productId === item.productID) {
        if (newQuantity >= 0 && newQuantity < 1000) {
          item.quantity = newQuantity;
        } else {
          alert("Please enter a valid quantity (0-999)");
        }
      }

      if (newQuantity === 0) {
        this.deleteFromCart(productId);
      }
    });

    this.saveToLocalStorage();
  }

  updateDeliveryOptionId(productId, optionId) {
    const matchingItem = this.getItem(productId);

    if (matchingItem) {
      matchingItem.deliveryOptionId = optionId;
    }

    this.saveToLocalStorage();
  }

  calcPaymentSummary() {
    let allItemsTotal = 0;
    let totalShipping = 0;

    this.cartItems.forEach((item) => {
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

    return {
      shippingPlusItems,
      tax,
      grandTotal,
      allItemsTotal,
      totalShipping,
    };
  }

  getItem(productId) {
    const matchingItem = this.cartItems.find(
      (item) => item.productID === productId,
    );
    return matchingItem;
  }
}

/* 
Built in javascript classes 
date = new date(); 
console.log(date); 
console.log(date.toLocalTimeString());
xhr = new XMLHttpRequest();
*/

/*
const object1 = {
  // Inside a method this points to the object it belongs to.
  method: function () {
    console.log(this);
  },

  method2: function () {
    // In order to access and call methods within the object without the need to use the objects name. If the objects name is changed the code stayes dynamic and changes with the source.
    this.method();
  },
};
object1.method2();

function logThis() {
  // Inside a function this is obviously undefined as it stays within the functions scope, but a cool feature of javascript allows us to change the value from outside the function by using .call();
  console.log(this);

  [1, 2, 3].forEach((num) => {
    console.log(this); // Inside arrow functions this behaves differently, its allowed to reach outside the function to access its parent. Unlike function declarations where its confined to the functions scope. As you can see in this example its been implemented for the use of forEach loops. 
  });
}

logThis.call(
  // note this only works with a function declaration and not an expression
  "I just changed the value of the undefined 'this' inside the logThis(); function",
);
*/

export const cart = new CartClass("amazon-reg-cart"); //Cart("amazon-reg-cart");
