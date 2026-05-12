import {
  // Imports the necessary files to run this page as modules
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
  // Runs the load page function defined in the backend file. This is the most up to date
  // way to load from an API as this function uses the async await to load the cart and products promise then
  // runs the functions that use this data to render the page. Very clean and simple syntax.
  deliveryOptionsHtml(); // shows the options html and all of its content.
  generatePaymentSummary(); // shows the payment summary and its calculations.
  generateCartHtml(); // shows the carts html with the relevant products.
});
