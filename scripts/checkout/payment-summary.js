//import { updateCartQuantity, calcPaymentSummary } from "../../data/cart.js";
import { formatCurrency } from "../utils/money.js";
import { cart } from "../../data/cart-oop.js";

export const generatePaymentSummary = () => {
  const cartQuantity = cart.updateCartQuantity();
  const total = cart.calcPaymentSummary();
  const summaryContainer = document.querySelector(".js-payment-summary");

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

      <button class="place-order-button button-primary">
        Place your order
      </button>`;

  if (summaryContainer) {
    summaryContainer.innerHTML = html;
  }
};
