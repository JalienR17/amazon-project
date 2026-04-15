import { generateCartHtml } from "../../scripts/checkout/order-summary.js";
import { cart } from "../../data/cart-oop.js";

describe("Test Suite: generateCartHtml", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  beforeEach(() => {
    document.querySelector(".js-test-container").innerHTML = `
    <div class="js-checkout-items"></div>
    <div class="js-order-display"></div>`;
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productID: productId1,
          quantity: 1,
          deliveryOptionId: "1",
        },
        {
          productID: productId2,
          quantity: 2,
          deliveryOptionId: "2",
        },
      ]);
    });
    cart.loadCartFromStorage();
    generateCartHtml();
  });

  afterAll(() => {
    document.querySelector(".js-test-container").innerHTML = "";
  });

  it("Displays the proper quantity for each item", () => {
    expect(
      document.querySelector(`.js-quantity-${productId1}`).innerText,
    ).toContain("Quantity: 1");

    expect(
      document.querySelector(`.js-quantity-${productId2}`).innerText,
    ).toContain("Quantity: 2");
  });

  it("Renders a container for each item in the cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2,
    );
  });

  it("Deletes 1 item quantity from the page or the container if its only 1 item", () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      1,
    );
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productID).toEqual(productId2);
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`),
    ).toEqual(null);

    document.querySelector(`.js-delete-link-${productId2}`).click();
    expect(
      document.querySelector(`.js-quantity-${productId2}`).innerText,
    ).toContain("Quantity: 1");
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`),
    ).not.toEqual(null);
  });

  it("Displays the proper items title", () => {
    expect(
      document.querySelector(`.js-cart-item-details-${productId2}`).innerText,
    ).toContain("Intermediate Size Basketball");
    expect(
      document.querySelector(`.js-cart-item-details-${productId1}`).innerText,
    ).toContain("Black and Gray Athletic Cotton Socks - 6 Pairs");
  });

  it("Displays the proper items price", () => {
    expect(
      document.querySelector(`.js-cart-item-details-${productId2}`).innerText,
    ).toContain("$20.95");
    expect(
      document.querySelector(`.js-cart-item-details-${productId1}`).innerText,
    ).toContain("$10.90");
  });
});
