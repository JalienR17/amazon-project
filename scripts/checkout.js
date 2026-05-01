import {
  generateCartHtml,
  deliveryOptionsHtml,
} from "./checkout/order-summary.js";
import { generatePaymentSummary } from "./checkout/payment-summary.js";
import { loadPageAPI } from "../backend/backend-practice.js";

/*Promise.all([fetchProductsAsync(), loadFakeCartAsync()]).then(() => {
  deliveryOptionsHtml();
  generatePaymentSummary();
  generateCartHtml();
});*/

loadPageAPI(() => {
  deliveryOptionsHtml();
  generatePaymentSummary();
  generateCartHtml();
});
