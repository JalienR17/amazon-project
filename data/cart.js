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
    cart.push({ productID, quantity: selection });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
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
      const selector = button
        .closest(".product-container")
        .querySelector(".js-selector");
      const selection = Number(selector.value);

      addToCart(productID, selection);
      updateCartQuantity();
    });
  });
};

export function clearCart() {
  cart = [];
  localStorage.clear();
}
