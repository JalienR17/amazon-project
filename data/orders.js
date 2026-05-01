import { cart } from "./cart-oop.js";

class OrderClass {
  ordersList = [];
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadOrders();
  }

  #loadOrders() {
    this.ordersList =
      JSON.parse(localStorage.getItem(`${this.#localStorageKey}`)) || [];
  }

  saveOrders = () => {
    localStorage.setItem(
      `${this.#localStorageKey}`,
      JSON.stringify(this.ordersList),
    );
  };

  addToOrders = (order) => {
    this.ordersList.unshift(order);
    console.log(this.ordersList);
    this.saveOrders();
  };

  placeOrderAPI = async (functions) => {
    try {
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart.cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
        return;
      }

      const order = await response.json();
      this.addToOrders(order);
      localStorage.removeItem("amazon-reg-cart");
      window.location.href = "orders.html";
    } catch (error) {
      console.log("Error Placing Order", error);
    }
  };
}

export const orders = new OrderClass("orders");
