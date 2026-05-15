import { generateCartHtml } from "../../scripts/checkout/order-summary.js";
// Importing generateCartHtml() and it's related data in order to test with the Jasmine framework. Note: this
// file is linked through the script tag and the module attribute in the tests.html file within Jasmine just
// how a normal script link would work just kept under Jasmine's own script tags to properly load the
// framework.
import { cart } from "../../data/cart-oop.js";
import { fetchProductsAsync } from "../../data/products.js";

const orderSummaryTest = () => {
  // In this test the Jasmine test is being defined and performed inside a
  // function and then called at the bottom of the script.
  describe("Test Suite: generateCartHtml", () => {
    // Describe is the Jasmine function that is used to group related.
    // tests together. The first parameter takes a string that displays in the UI as a title. While the second
    // parameter takes a function in which the test functions will be used.
    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"; // A chosen product ID is being stored in a
    // variable in order to be used in the test.
    const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

    beforeAll((MoveOn) => {
      // Before all is being used to load the products and resolve the promise before the test is ran. Just
      // like a promise the resolve or move on argument is used to continue the function after the data has
      // been received. Before all is very similar to beforeEach() but just as the name implies it loads the
      //  content before all instead of multiple times before each.
      fetchProductsAsync().then(() => {
        // .then must be used with the promise in order to call the set move
        //  on argument.
        MoveOn();
      });
    });

    beforeEach(() => {
      // beforeEach() is defining the data that is to be loaded before each test.
      // The necessary containers are being loaded  into the tests.html file in order to perform the test.
      document.querySelector(".js-test-container").innerHTML = `
    <div class="js-checkout-items"></div>
    <div class="js-order-display"></div>`;
      spyOn(localStorage, "setItem"); // The wire tap and mock is set on local storage using spyOn()
      // preventing modifications of the original storage.
      spyOn(localStorage, "getItem").and.callFake(() => {
        // Call fake is being used to return a fake cart
        // holding two products for testing.
        return JSON.stringify([
          {
            productId: productId1,
            quantity: 1,
            deliveryOptionId: "1",
          },
          {
            productId: productId2,
            quantity: 2,
            deliveryOptionId: "2",
          },
        ]);
      });
      cart._loadCartFromStorage(); // Then the fake is loaded and the function called.
      generateCartHtml();
    });

    afterAll(() => {
      // After all the container is set to an empty string. This keeps the UI clean without
      //  the html showing, just the test results.
      document.querySelector(".js-test-container").innerHTML = "";
    });

    it("Displays the proper quantity for each item", () => {
      // it(); also takes 2 parameters. The first a string to further
      //  describe that specific test and display it as a sub-title on the page. The second is a function that
      //  holds the test and uses certain functions to perform the test.
      expect(
        // Now the proper checks are added with expect(); which
        // takes the code being tested as a parameter while chaining the necessary method to test the results.
        // Here toContain() is being used to check if the html inner text contains the string "Quantity: 1",
        // essentially checking if the added fake products are being displayed properly.
        document.querySelector(`.js-quantity-${productId1}`).innerText,
      ).toContain("Quantity: 1"); // Same patterns are repeated for the next few tests.

      expect(
        document.querySelector(`.js-quantity-${productId2}`).innerText,
      ).toContain("Quantity: 2");
    });

    it("Renders a container for each item in the cart", () => {
      expect(
        document.querySelectorAll(".js-cart-item-container").length,
      ).toEqual(2);
    });

    it("Deletes 1 item quantity from the page or the container if its only 1 item", () => {
      document.querySelector(`.js-delete-link-${productId1}`).click(); // Here .click() is being used which
      // when chained, it performs an automatic click in order to test the results.
      expect(
        // Once clicked the relevant tests are performed.
        document.querySelectorAll(".js-cart-item-container").length,
      ).toEqual(1);
      expect(cart.cartItems.length).toEqual(1);
      expect(cart.cartItems[0].productId).toEqual(productId2);
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
};

orderSummaryTest(); // Now the function is called.
