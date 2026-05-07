//import { updateCartQuantity, calcPaymentSummary } from "../../data/cart.js";
import { formatCurrency } from "../utils/money.js"; // Imports the data needed to run the file
import { cart } from "../../data/cart-oop.js"; // This file acts as a Bridge between the cart data, the orders
//  API, and the user interface. It provides the view and controller for model interaction.
import { orders } from "../../data/orders.js";

export const generatePaymentSummary = () => {
  // Defines a function to generate the html for the payment
  // summary section.
  const cartQuantity = cart.updateCartQuantity(); // Variables the updateCartQuantity method to use its value
  //  as it displays the cart quantity number.
  const total = cart.calcPaymentSummary(); // Variables the calcPaymentSummary method to use its returned
  // object as this holds the value for each calculation. Since it returns the value of an object those
  // calculations can be accessed through dot notation as seen in the code below.
  const summaryContainer = document.querySelector(".js-payment-summary"); // Variables the container that will
  // hold the html.

  // Defines the html content using backticks and sets its values using the templates.
  const html = ` 
      <div class="payment-summary-title">Order Summary</div>

      <div class="payment-summary-row">
        <div>Items (${cartQuantity}):</div>
        <div class="payment-summary-money">$${formatCurrency(total.allItemsTotal)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(total.totalShipping)}</div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatCurrency(total.shippingPlusItems)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${total.tax}</div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(total.grandTotal)}</div>
      </div>

      <button class="place-order-button button-primary js-place-order-button">
        Place your order
      </button>`;

  if (summaryContainer) {
    // Adds a check to see if the container exists, to avoid a console error since the
    // container is conditionaly removed in the order summary file if the cart is empty. If it passes, then the
    //  html content is added to the container and the order buttons event listener is added.
    summaryContainer.innerHTML = html;

    const orderButton = document.querySelector(".js-place-order-button"); // Variables the order button
    orderButton.addEventListener("click", () => {
      // Adds the click event listener and runs the place order
      // method if its clicked.
      orders.placeOrderAPI();
    });
  }
};
