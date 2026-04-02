import { addToCart, cart } from "../../data/cart.js";

describe("Test Suite: addToCart Function", () => {
  it("adds a product to the cart using its ID", () => {
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart.length).toEqual(1);
  });
});
