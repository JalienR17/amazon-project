import {
  generateCartHtml,
  deliveryOptionsHtml,
} from "./checkout/order-summary.js";
import { generatePaymentSummary } from "./checkout/payment-summary.js";
import { loadProductsAPI } from "../data/products.js";
import { loadFakeCartAPI } from "../data/cart.js";

Promise.all([
  new Promise((moveOn) => {
    loadProductsAPI(() => {
      moveOn();
    });
  }),
  new Promise((moveOn) => {
    loadFakeCartAPI(() => {
      moveOn();
    });
  }),
]).then(() => {
  deliveryOptionsHtml();
  generatePaymentSummary();
  generateCartHtml();
});
