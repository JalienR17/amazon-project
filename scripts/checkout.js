import {
  generateCartHtml,
  deliveryOptionsHtml,
} from "./checkout/order-summary.js";
import { generatePaymentSummary } from "./checkout/payment-summary.js";
import { loadProductsAPI } from "../data/products.js";

loadProductsAPI(() => {
  deliveryOptionsHtml();
  generatePaymentSummary();
  generateCartHtml();
});
