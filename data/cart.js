export const cart = [];

export const addToCart = () => {
  document.querySelectorAll(".js-add-cart").forEach((button) => {
    const productID = button.dataset.productId;

    button.addEventListener("click", () => {
      const selector = button
        .closest(".product-container")
        .querySelector(".js-selector");
      const selection = Number(selector.value);
      let matchingProduct;
      let cartQuantity = 0;
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

      cart.forEach((product) => {
        cartQuantity += product.quantity;
      });

      document.querySelector(".js-cart-quantity").innerText = cartQuantity;
      console.log(cart);
    });
  });
};
