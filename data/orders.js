import { cart } from "./cart-oop.js";

export const orders = loadOrders();

function loadOrders() {
  const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
  return savedOrders;
}

const saveOrders = () => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const addToOrders = (order) => {
  orders.unshift(order);
  console.log(orders);
  saveOrders();
};

export const placeOrderAPI = async (functions) => {
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
    addToOrders(order);
    localStorage.removeItem("amazon-reg-cart");
    window.location.href = "orders.html";
  } catch (error) {
    console.log("Error Placing Order", error);
  }
};
