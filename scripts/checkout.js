import {
  generateCartHtml,
  deliveryOptionsHtml,
} from "./checkout/order-summary.js";
import { generatePaymentSummary } from "./checkout/payment-summary.js";
import "../data/backend-practice.js";

deliveryOptionsHtml();
generatePaymentSummary();
generateCartHtml();
