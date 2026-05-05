import { cart } from "./cart-oop.js"; // Imports the cart as there are functions using the carts data.

class OrderClass {
  // Defines an orders class for encapsulation, organization and reusability. If a completed
  //  orders or pending orders is needed, all it would take is just an instance of this class.
  ordersList = []; // Defines the orders empty array
  #localStorageKey; // Makes a private local storage property that cant be changed outside this class

  constructor(localStorageKey) {
    // Sets the constructor in order to pass the storage property in as an
    //  argument and pre-load the orders from the storage.
    this.#localStorageKey = localStorageKey;
    this.#loadOrders();
  }

  #loadOrders() {
    // Defines the load orders method and makes it private so it can't be called outside this
    //  class
    this.ordersList = // gets the data from local storage and re-defines the orderslist using the argument
      // passed in.
      JSON.parse(localStorage.getItem(`${this.#localStorageKey}`)) || [];
  }

  saveOrders = () => {
    // Defines a saves order method that saves to local storage.
    localStorage.setItem(
      `${this.#localStorageKey}`,
      JSON.stringify(this.ordersList), // parses the orders list back to JSON format.
    );
  };

  addToOrders = (order) => {
    // Defines a add to orders method that pushes the order being received from
    //  the API to the orders array. Has a parameter that takes the value of the order.
    this.ordersList.unshift(order); // Uses unshift to push the order as this method adds it to the front of
    //  the list instead of the end like it would with .push();
    this.saveOrders(); // Finally saves it to local storage.
  };

  placeOrderAPI = async () => {
    // Defines a place order async method for the xml post that uses
    // await and fetch.
    try {
      // awaits the fetch post in the try block and saves it into the response variable.
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST", // defines the method property and sets it as post.
        headers: {
          // defines the header property by saying the content being posted is in JSON format.
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Defines the content being posted inside the body property and parses it into
          // a JSON format. The property value must be an object.
          cart: cart.cartItems,
        }),
      });

      if (!response.ok) {
        // If the response is a server error 400+ then it throws an error and uses the
        // .status method to show the exact error details in the console.
        throw new Error(`Server Error: ${response.status}`);
        return; // Then returns the function (stops it from continuing)
      }

      const order = await response.json(); // If it passes the response check then it sets its value into the
      // order variable and parses back into an array of ojects using the .json(); method. This procces needs
      // an await as .json is a promise and it takes time.
      this.addToOrders(order); // Once the order is parsed into a usable value its then passed into the add to
      // orders method
      localStorage.removeItem("amazon-reg-cart"); // Removes the cart from local storage as the order was just
      // placed.
      window.location.href = "orders.html"; // Takes the user to the orders page to view their recent order.
    } catch (error) {
      // Catches a network error besides the server error check above and uses the error
      // argument to use the events value so its details can be logged.
      console.log("Error Placing Order", error);
    }
  };
}

export const orders = new OrderClass("orders"); // Finally an instance of the class is saved in orders with
// the local storage property of orders. 
