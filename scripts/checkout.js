import {
  generateCartHtml,
  deliveryOptionsHtml,
} from "./checkout/order-summary.js";
import { generatePaymentSummary } from "./checkout/payment-summary.js";
import { fetchProductsAsync } from "../data/products.js";
import { loadFakeCartAsync } from "../data/cart.js";

/*Promise.all([fetchProductsAsync(), loadFakeCartAsync()]).then(() => {
  deliveryOptionsHtml();
  generatePaymentSummary();
  generateCartHtml();
});*/

export const loadPageAPI = async () => {
  try {
    //throw "Test Error";
    await Promise.all([fetchProductsAsync(), loadFakeCartAsync()]);
  } catch (error) {
    console.log("Error Recieiving From API", error);
  }

  deliveryOptionsHtml();
  generatePaymentSummary();
  generateCartHtml();
};

loadPageAPI();
