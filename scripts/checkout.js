import {
  generateCartHtml,
  deliveryOptionsHtml,
} from "./checkout/order-summary.js";
import { generatePaymentSummary } from "./checkout/payment-summary.js";

deliveryOptionsHtml();
generatePaymentSummary();
generateCartHtml();
