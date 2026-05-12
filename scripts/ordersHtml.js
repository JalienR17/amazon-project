import { orders } from "../data/orders.js"; // Imports the necessary files to run this page as modules.
import { getProduct, products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { cart } from "../data/cart-oop.js";
import { loadPageAPI } from "../backend/backend-practice.js";

const forEachOrdertButton = () => {
  // Creates a for each button function that runs a loop and adds a click
  // event listener to run functions when clicked.
  // This function is being defined first as im using function expressions to avoid hoisting unless absolutely
  // needed
  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    // Runs the loop for each button
    const productId = button.dataset.productId; // Variables the product id stored as a data attribute.

    button.addEventListener("click", () => {
      // Adds the click event listener for the button
      const selection = 1; // Variables the selection to equal 1 as the add to cart method takes a quantity
      // number value for its second parameter.
      cart.addToCart(productId, selection); // Runs the add to cart method with the value of selection and the
      // product id in that container.
      cart.updateCartQuantity(); // Updates the cart quantity in the UI.
    });
  });
};

const generateOrdersHtml = () => {
  // Now the generate orders html function is defined which runs nested loops, one for each orders object and
  //  the other for that objects products property which holds an array of products also stored in objects.
  let ordersHtml = ""; // Sets the accumulator variable for the orders html which will be the outer container.
  if (orders.ordersList.length === 0) {
    // Sets a check to see if the orders array is empty and properly informs
    // the user by displaying a message in the UI.
    document.querySelector(".js-page-title").innerHTML =
      "<p style='display: flex; justify-content: center; font-size: 2rem'> No Orders To Show! :( </p>";
  }

  orders.ordersList.forEach((order) => {
    // Starts the for each loop through the orders list.
    const orderDate = dayjs(order.orderTime).format("MMMM D"); // Formats the orders time for better
    // readability

    const generateOrderProductsHtml = () => {
      // The products html function is defined.
      let productsHtml = ""; // The html's accumulator variable.

      order.products.forEach((product) => {
        // Now the second nested loop is ran so the products array
        // for each order can be accessed and each products html properly displayed within the orders
        // container.
        const expectedDate = dayjs(product.estimatedDeliveryTime).format(
          "MMMM D",
        ); // The expected date is also formatted for better readability.
        const matchingProduct = getProduct(product.productId); // The product id is used to find the full
        // information for that product within the original products array in order to use its property
        // values. This is achieved with the function getProduct() which uses a find loop.

        if (matchingProduct) {
          // If theres a matching product then the html is created using its values.
          // Note on this html creation theres a distinction from the others. The button which is inside the
          // anchor tag made for links, is using search params in its href attribute, with unique IDs as
          // well as other data needed for the tracking page.The params are being passed into the url with
          // the ?/& symbols. Then extracted at the tracking page using the url class.
          productsHtml += `
            <div class="order-details-grid">
              <div class="product-image-container">
                <img src=${matchingProduct.image}>
              </div>

              <div class="product-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-delivery-date">
                  Arriving on: ${expectedDate}
                </div>
                <div class="product-quantity">
                  Quantity: ${product.quantity}
                </div>
                <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${matchingProduct.id}">
                  <img class="buy-again-icon" src="images/icons/buy-again.png">
                  <span class="buy-again-message">Buy it again</span>
                </button>
              </div>

              <div class="product-actions">
                <a href="tracking.html?orderId=${order.id}&productId=${matchingProduct.id}&arrival=$    {expectedDate}&quantity=${product.quantity}">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            </div>
          `;
        }
      });

      return productsHtml; // Returns the products html so it can be inserted into the orders html container.
    };
    // Now the orders html is created and the products function containing the value of the html is inserted.
    ordersHtml += `
      <div class="order-container js-order-container">

        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        ${generateOrderProductsHtml()}
      </div>
    `;
  });

  document.querySelector(".js-orders-grid").innerHTML = ordersHtml; // The full html is displayed into the
  // orders grid container.
};

loadPageAPI(() => {
  // The API data is loaded before the functions are ran. look into the checkout.js and
  // backend-practice.js file for a more in depth analysis.
  generateOrdersHtml();
  forEachOrdertButton();
  cart.updateCartQuantity();
});
