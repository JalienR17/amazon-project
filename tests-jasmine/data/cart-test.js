import { addToCart, cart, loadCartFromStorage } from "../../data/cart.js"; // Importing addToCart() and
// it's related data in order to test with the Jasmine framework. Note: this file is linked through the script
// tag and the module attribute in the tests.html file within Jasmine just how a normal script link would work
//  just kept under Jasmine's own script tags to properly load the framework.

describe("Test Suite: addToCart Function", () => {
  // Describe is the Jasmine function that is used to group related.
  // tests together. The first parameter takes a string that displays in the UI as a title. While the second
  // parameter takes a function in which the test functions will be used.

  beforeEach(() => {
    //Before each is a Jasmine function that takes a function as a parameter and loads that
    // function before each it(); This is useful for data that needs to be preloaded for each test to run.
    //  Avoids having to write it multiple times and cleans up the code.
    spyOn(localStorage, "setItem"); // spyOn mocks and records the method or function and doesnt allow the
    // original to be modified as this is just for testing and the original storage should not be interfered
    // with. By default, spyOn(object, 'method') replaces the original function with a "stub" that does
    // nothing. If you want the real code to still run while you just watch it, you have to chain .and.
    // callThrough(). There are several chains that can be used with spy on to further test or modify.
  });

  it("adds a product to the cart using it's ID", () => {
    // it(); also takes 2 parameters. The first a string to further
    //  describe that specific test and display it as a sub-title on the page. The second is a function that
    //  holds the test and uses certain functions to perform the test.
    spyOn(localStorage, "getItem").and.callFake(() => {
      // Here spyOn() is being chained with callFake() which fakes the method getItem and replaces it's value
      // with an empty array that has been stringified into JSON format as this is what the
      // loadCartFromStorage() is expecting. If you need the spy to do something specific—like return a
      // different value every time it's called, you can use .and.callFake(). This allows you to write a
      // mini-function inside the spy to  simulate complex behavior.
      return JSON.stringify([]);
    });
    loadCartFromStorage(); // Now that the fake or mock has been set, the function that uses it can be called.
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1); // Then the addToCart() test.

    expect(cart.length).toEqual(1); // Now the proper checks are added with expect(); which
    // takes the function being tested as a parameter while chaining the toEqual(); method to check the
    // results. In Jasmine instead of just seeing "Failed" in a console, Jasmine provides a UI that tells you
    // exactly which edge case failed and why.

    expect(localStorage.setItem).toHaveBeenCalledTimes(1); // Here it chains toHaveBeenCalledTimes() to check
    // if it's not stuck in a save loop and it's actually being called the expected times.
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart[0].quantity).toEqual(1);
  });

  it("It updates the quantity of the item in the cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      // Here the call fake is being used again to change
      // the get item value to a default cart item, to test if it's quantity is being updated as well.
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ]);
    });
    loadCartFromStorage(); // Then the same pattern is repeated in order to perform the test.
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart[0].quantity).toEqual(2);
  });
});
