/*import {
  cart,
  updateCartQuantity,
  deleteFromCart,
  deleteQuantity,
  saveToLocalStorage,
  updateDeliveryOptionId,
  saveNewQuantity,
} from "../../data/cart.js";*/
import { formatCurrency } from "../utils/money.js"; // Imports the necessary data to run this file.
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"; // This is the dayjs import, which is coming
//  from a server. This import simplifies getting the current date, in order to add the delivery days, as well
// as update the date formats.
import { deliveryOptions, getOption } from "../../data/delivery-options.js";
import { generatePaymentSummary } from "./payment-summary.js";
import { getProduct, products } from "../../data/products.js";
import { cart } from "../../data/cart-oop.js";

export const deliveryOptionsHtml = (productId, deliveryOptionId) => {
  // Defines the delivery options html function so it can be inserted in the template literal of the generate
  //  cart html function, as this function will run a loop through the options array.
  let deliveryOptionsHtml = ""; // Sets the accumulator variable.

  deliveryOptions.forEach((option) => {
    // Runs a for each loop through the delivery options array and for
    // each option it renders an html container with that options data.
    const today = dayjs(); // Takes the current date and sets it into the variable today.
    const deliveryDate = today.add(option.deliveryDays, "days"); // since today now holds the value of the
    // dayjs function. The .add method can be used with its parameters, which take how many as the first
    // argument and what type as the second. In this case its days. The how many is held within each options
    // data stored in an object, accessed through the loops parameter with dot notation.
    const formattedDate = deliveryDate.format("dddd, MMMM D"); // This formats the date according to the
    // argument.
    const deliveryPrice = // This variable uses a ternary operator to check if the price is 0 in order to
      // render a "free" string or the formatted delivery price.
      option.deliveryPrice === 0
        ? "FREE"
        : `$${formatCurrency(option.deliveryPrice)} -`;
    const isChecked = option.id === deliveryOptionId; // This variable sets a boolean resulting in true or
    // false, whether the id matches or not. Essentially checking the radio button if it matches and setting
    // the ternary operator at the radio attribute as checked since the conditional will result as true when
    //  theres a match, this adds the string checked to the attribute. The deliveryOptionId is passed in as an
    //  argument coming from the carts data.

    deliveryOptionsHtml += `
        <div class="delivery-option" data-option-id="${option.id}" data-product-id="${productId}">
          <input type="radio" ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name=${productId}>
          <div>
            <div class="delivery-option-date">
              ${formattedDate}
            </div>
            <div class="delivery-option-price js-delivery-option-price">
              ${deliveryPrice} Shipping
            </div>
          </div>
        </div>`;
  }); // The options html is added to the accumulator according to each option and the product id is passed in
  //  as an argument to
  // properly id each container using the for each loop ran through the carts items.

  return deliveryOptionsHtml; // Then the value is returned so it can be used within the generate cart html
  // function.
};

export const generateCartHtml = () => {
  // Now the generate cart html function is defined with the html and event listeners inside.
  const cartQuantity = cart.updateCartQuantity(); // Variables cart quantity to display the carts quantity
  const checkoutInnerText = `Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} items</a>)`; // Variables the checkout inner text so that the cart quantity template can be inserted.
  let itemsHtml = ""; // Sets the accumulator variable.

  if (cart.cartItems.length === 0) {
    // Adds a conditional check to see if the cart is empty so it can display
    //  a warning to the user that the cart is empty, as well as remove the payment summary container as theres
    // nothing to calculate.
    document.querySelector(".js-empty-cart-title").innerHTML =
      "<p style='display: flex; justify-content: center; font-size: 2rem'> Your Cart Is Empty! :( </p>";
    document.querySelector(".js-payment-summary").remove();
  }

  cart.cartItems.forEach((item) => {
    // Runs a loop through the cart
    //products.forEach((product) => {
    //let matchingProduct;
    //let selectedOption;
    const matchingProduct = getProduct(item.productId); // Uses the find product method to with the id saved
    //  in the cart to access that products full information saved in the products array.
    const selectedOption = getOption(item.deliveryOptionId); // Uses the find option method with the id saved
    // in the cart to get that options full information saved in the delivery options array.
    const today = dayjs(); // Sets the current date into the today variable.
    const deliveryDate = today.add(selectedOption.deliveryDays, "days"); // Adds the days as noted in the
    // comments above.
    const formattedDate = deliveryDate.format("dddd, MMMM D"); // Formats the date

    /*if (item.productId === product.id) {
        matchingProduct = product.id;
      }

      deliveryOptions.forEach((option) => {
        if (option.id === item.deliveryOptionId) {
          selectedOption = option;
        }
      });*/

    if (matchingProduct) {
      // If theres a matching product it then renders the html with that products
      // specific information.
      itemsHtml += `
          <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}" data-id="${matchingProduct.id}">
            <div class="delivery-date">
              Delivery Date: ${formattedDate}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${matchingProduct.image}>

              <div class="cart-item-details js-cart-item-details-${matchingProduct.id}">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity">
                  <span class="js-quantity-${matchingProduct.id}">
                    Quantity: <span class="quantity-label js-quantity">${item.quantity}</span>
                  </span>
                  <span data-id="${matchingProduct.id}" class="update-quantity-link link-primary js-update-item">
                    Update
                  </span>
                  <span data-id="${matchingProduct.id}" class="delete-quantity-link link-primary js-delete-item js-delete-link-${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHtml(matchingProduct.id, item.deliveryOptionId)}
              </div>
            </div>
          </div>
        `;
    }
    //});
  });

  document.querySelector(".js-checkout-items").innerHTML = checkoutInnerText; // Displays the inner text with
  //  the link and quantity template.
  document.querySelector(".js-order-display").innerHTML = itemsHtml; // Displays the html for each product.

  document.querySelectorAll(".js-delete-item").forEach((link) => {
    // Runs a loop for each delete link and
    // adds a click event listener.
    link.addEventListener("click", () => {
      const productId = link.dataset.id; // Takes the product id stored as a data attribute in the links tag
      cart.deleteFromCart(productId); // Runs the delete from cart function and passes in that links product
      //  id to be removed from the cart.
      cart.deleteQuantity(productId); // Passes in the product Id from the link and runs the delete quantity
      //  method.
      cart.saveToLocalStorage(); // Saves the updates to local storage
      generateCartHtml(); // re-renders the html with the new updates
      generatePaymentSummary(); // re-renders the html for the payment summary with the new calculations
    });
  });

  document.querySelectorAll(".js-update-item").forEach((link) => {
    // Runs a loop for each update link
    const productId = link.dataset.id; // variables the product id stored in the data set attribute
    const container = link.closest(".cart-item-container"); // variables the closest container to the update
    // link
    const quantity = container.querySelector(".js-quantity"); // variables that specific containers quantity
    const updateLink = container.querySelector(".js-update-item"); // variables that specific update link

    link.addEventListener("click", () => {
      // Now adds the click event listener for each link
      quantity.innerHTML = `<input class="js-input" type="number"/>`; // Changes the innerHtml of the quantity
      //  to an input field, that takes a number as a value when the link is clicked.
      updateLink.innerHTML = `<span class="save-link link-primary js-save-link">Save</span>`; // Adds a save
      // link next to the input field.
      const saveLink = container.querySelector(".js-save-link"); // Variables the save link that was just
      // created.
      const quantityInput = container.querySelector(".js-input"); // Variables the input field for the
      // quantity.

      saveLink.addEventListener("click", () => {
        // Adds a neseted event listener for the save link
        cart.saveNewQuantity(productId, quantityInput); // When clicked it runs the save new quantity method
        // which takes in the input field and its value as a parameter as well as the product id.
        generateCartHtml(); // re-renders the html showing the new updates
        generatePaymentSummary(); // re-renders the payment summary calculations.
      });

      quantityInput.addEventListener("keydown", (event) => {
        // Adds an event listener for the quantity input
        //  to listen for a keydown event that equals enter to then run the same process as if the save link
        //  was clicked. Creates a parameter that takes in the value of the event which holds a property in
        // key for each key entered when the value of key in the conditional equals true, the method and
        // functions are ran.
        if (event.key === "Enter") {
          cart.saveNewQuantity(productId, quantityInput);
          generateCartHtml();
          generatePaymentSummary();
        }
      });
    });
  });

  document.querySelectorAll(".delivery-option").forEach((container) => {
    // Runs a for loop through each
    // delivery options container.
    const { optionId, productId } = container.dataset; // Uses object destructering to shorthand variable
    container.addEventListener("click", () => {
      cart.updateDeliveryOptionId(productId, optionId); // Takes the dataset attributes holding both the
      // product id and the options id to update the carts data according to that containers clicked delivery
      //  option which in turn updates everything else since the loops are extracting the data from the cart
      // array.
      generateCartHtml(); // re-renders the html showing the new updates
      generatePaymentSummary(); // re-renders the payment summary calculations.
    });
  });
};
