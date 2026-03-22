export let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
