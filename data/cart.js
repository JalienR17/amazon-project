export const cart = [];

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
    cart.push({ productID, quantity: selection });
  }
};

export const updateCartQuantity = () => {
  let cartQuantity = 0;

  cart.forEach((product) => {
    cartQuantity += product.quantity;
  });

  document.querySelector(".js-cart-quantity").innerText = cartQuantity;
};

export const forEachCartButton = () => {
  document.querySelectorAll(".js-add-cart").forEach((button) => {
    const productID = button.dataset.productId;

    button.addEventListener("click", () => {
      const selector = button
        .closest(".product-container")
        .querySelector(".js-selector");
      const selection = Number(selector.value);

      addToCart(productID, selection);
      updateCartQuantity();
    });
  });
};
