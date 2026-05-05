import { calcTax } from "../scripts/utils/money.js";
import { getOption } from "./delivery-options.js";
import { getProduct } from "./products.js";

// Turned the cart functions and cart into an object for encapsulation, reusability and organization. Then used an
// object inside a function and returned the object. This makes it easy to variable the object while just
// updating its parameter to access its properties.
// This is also the right pre-step to take when learning classes as a class is essentiantly an upgraded
// functional object
const Cart = (localStorageKey) => {
  const cart = {
    cartItems: [],
    loadCartFromStorage: function () {
      this.cartItems =
        JSON.parse(localStorage.getItem(`${localStorageKey}`)) || [];
    },
    addToCart: function (productId, selection) {
      let matchingProduct;

      this.cartItems.forEach((product) => {
        if (productId === product.productId) {
          matchingProduct = product;
        }
      });

      if (matchingProduct) {
        matchingProduct.quantity += selection;
      } else {
        this.cartItems.push({
          productId,
          quantity: selection,
          deliveryOptionId: "1",
        });
      }

      this.saveToLocalStorage();
    },
    updateCartQuantity: function () {
      let cartQuantity = 0;

      this.cartItems.forEach((product) => {
        cartQuantity += product.quantity;
      });

      const cartIcon = document.querySelector(".js-cart-quantity");
      if (cartIcon) {
        cartIcon.innerText = cartQuantity;
      }

      return cartQuantity;
    },
    forEachCartButton: function () {
      document.querySelectorAll(".js-add-cart").forEach((button) => {
        const productId = button.dataset.productId;

        button.addEventListener("click", () => {
          const container = button.closest(".product-container");
          const selector = container.querySelector(".js-selector");
          const selection = Number(selector.value);

          this.addToCart(productId, selection);
          this.updateCartQuantity();
        });
      });
    },
    deleteFromCart: function (productId) {
      this.cartItems = this.cartItems.filter(
        (item) => productId !== item.productId || item.quantity > 1,
      );

      this.saveToLocalStorage();
    },
    deleteQuantity: function (productId) {
      this.cartItems.forEach((item) => {
        if (productId === item.productId) {
          if (item.quantity > 1) {
            item.quantity--;
          }
        }
      });
    },
    saveToLocalStorage: function () {
      localStorage.setItem(
        `${localStorageKey}`,
        JSON.stringify(this.cartItems),
      );
    },
    saveNewQuantity: function (productId, quantityInput) {
      const newQuantity = Number(quantityInput.value);

      this.cartItems.forEach((item) => {
        if (productId === item.productId) {
          if (newQuantity >= 0 && newQuantity < 1000) {
            item.quantity = newQuantity;
          } else {
            alert("Please enter a valid quantity (0-999)");
          }
        }

        if (newQuantity === 0) {
          this.deleteFromCart(productId);
        }
      });

      this.saveToLocalStorage();
    },
    updateDeliveryOptionId: function (productId, optionId) {
      const matchingItem = this.getItem(productId);

      if (matchingItem) {
        matchingItem.deliveryOptionId = optionId;
      }

      this.saveToLocalStorage();
    },
    calcPaymentSummary: function () {
      let allItemsTotal = 0;
      let totalShipping = 0;

      this.cartItems.forEach((item) => {
        const matchingProduct = getProduct(item.productId);
        const matchingOption = getOption(item.deliveryOptionId);

        if (matchingProduct) {
          allItemsTotal += item.quantity * matchingProduct.priceCents;
        }

        if (matchingOption) {
          totalShipping += matchingOption.deliveryPrice;
        }
      });

      const shippingPlusItems = totalShipping + allItemsTotal;
      const tax = calcTax(shippingPlusItems);
      const grandTotal = Number(tax) * 100 + shippingPlusItems;

      return {
        shippingPlusItems,
        tax,
        grandTotal,
        allItemsTotal,
        totalShipping,
      };
    },
    getItem: function (productId) {
      const matchingItem = this.cartItems.find(
        (item) => item.productId === productId,
      );
      return matchingItem;
    },
  };

  return cart;
};

// Now using what was learned above to easily transition the data into a class. The class keyword lets
// write properties and functions as if they were not inside an object, it automatically sets the properties
// and methods.
class CartClass {
  cartItems = []; // sets the property with an empty array for updating
  #localStorageKey; // defines a unique variable using the number sign to privatize the local storage key.
  // This ensures the key cannot be re-defined outside the class.

  constructor(localStorageKey) {
    // This is a special function for classes that runs outside the class to
    // allow loading from storage while also allowing for a parameter to be used with the class. This is how
    //  an argument can be used to set a local storage key, making the class dynamic.
    this.#localStorageKey = localStorageKey;
    this._loadCartFromStorage();
  }

  _loadCartFromStorage() {
    // Defines the load from storage method. The underscore is used to let other
    //  developers know not to call this method or change it outisde the class. The number sign can be used to
    // fully privatize it but this function is being called inside the jasmine tests.
    this.cartItems = // Parses the return from local storage and sets a dynamic variable value that will be
      // updated via the argument.
      JSON.parse(localStorage.getItem(`${this.#localStorageKey}`)) || [];
  }

  addToCart(productId, selection) {
    // This is the add to cart method which uses a for each loop with conditionals.
    let matchingProduct;

    this.cartItems.forEach((product) => {
      // Takes the product Id which is passed as an argument and looks for a match within the cart.
      if (productId === product.productId) {
        matchingProduct = product;
      }
    });

    if (matchingProduct) {
      // Then takes that matching product and updates its quantity according to the value of the selector,
      //  which is also passed as an argument.
      matchingProduct.quantity += selection;
    } else {
      // If there isnt a matching product then that product is pushed into the carts
      //  array with a selector value of 1.
      this.cartItems.push({
        productId,
        quantity: selection,
        deliveryOptionId: "1",
      });
    }

    this.saveToLocalStorage(); // Finally the save to local storage function is called.
  }

  updateCartQuantity() {
    // This method updates the carts quantity and displays it on the page.
    let cartQuantity = 0; // Defines the accumulating variable outside the loop.

    this.cartItems.forEach((product) => {
      // Runs the cart loop and uses the object's quantity property to
      cartQuantity += product.quantity; // add the values.
    });

    const cartIcon = document.querySelector(".js-cart-quantity");
    if (cartIcon) {
      // Uses a conditional to display the quantity if the icon container exists, avoiding
      //  a connot set properties of null error, allowing the function to be used within all pages.
      cartIcon.innerText = cartQuantity;
    }

    return cartQuantity; // Returns the value calculated so the function can be variabled using that value.
  }

  forEachCartButton() {
    // Defines a method to run a loop for each add to cart button.
    document.querySelectorAll(".js-add-cart").forEach((button) => {
      // Uses "all" for selecting all of the containers.
      const productId = button.dataset.productId; // Extracts the product Id that is stored as a data
      // attribute and stores it in a variable

      button.addEventListener("click", () => {
        // for each button it adds an event listener. Note: this can be
        // further simplified by using a tecnique called event delegation which would use the .closest button
        // container and just one main container event listener.
        const container = button.closest(".product-container"); // Variables the closest product container
        // to the click event.
        const selector = container.querySelector(".js-selector"); // In order to select its corresponding
        //  selector
        const selection = Number(selector.value); // Then transforms its value into an integer.

        this.addToCart(productId, selection); // Calls the add to cart function when the button is clicked
        //  using the variabled values.
        this.updateCartQuantity(); // Then calls the update cart quantity function. This is also a good example
        // of the MVC cycle and the reason for keeping relative code in seperate re-usable functions.
      });
    });
  }

  deleteFromCart(productId) {
    // Defines a delete from cart function that takes a product id as an argument.
    this.cartItems = this.cartItems.filter(
      // Uses a filter method to loop through the cart and filter
      // out every product that doesnt match the product Id or quantity less than 2 and makes a new array.
      // Esentially deleting or leaving out the product if it doesnt match and its quantity is 1.
      (item) => productId !== item.productId || item.quantity > 1,
    ); // filter creates a new array without the filtered data set in the function.

    this.saveToLocalStorage(); // Then saves to local storage by calling the function.
  }

  deleteQuantity(productId) {
    // Defines a delete quantity method that takes a product id as an argument.
    this.cartItems.forEach((item) => {
      // Runs a for each loop through the cart
      if (productId === item.productId) {
        // then uses a conditional to find the matching product
        if (item.quantity > 1) {
          // if it finds the product It then runs a nested conditional to check if the
          // quantity is greater than one in order to not allow the quantity to drop to zero or the negatives
          item.quantity--; // if it passes the nested conditional it then subtracts one from the quantity by
          // using the shorthand way of --
        }
      }
    });
  }

  saveToLocalStorage() {
    // Defines a save to local storage method in order to easily update the storage with any changes made
    // to the cart.
    localStorage.setItem(
      `${this.#localStorageKey}`, // Uses the argument set by the constructor function to pass over a
      // property for the local storage JSON file.
      JSON.stringify(this.cartItems), // Transforms the cart array into a JSON format
    );
  }

  saveNewQuantity(productId, quantityInput) {
    // Defines a save new quantity method so it can be used with the update quantity link in the checkout page.
    const newQuantity = Number(quantityInput.value); // This variable stores the value of the input field as
    // a calculatable integer

    this.cartItems.forEach((item) => {
      //  Creates a for each loop that runs through the cart to find the matching product id which is passed
      //  in as an argument and extracted from the links data attribute, in order to update the proper items
      // quantity
      if (productId === item.productId) {
        // A conditional to find the corresponding item using the product id
        //  stored on the links data attribute
        if (newQuantity >= 0 && newQuantity < 1000) {
          // nested conditional to avoid a negative input or over
          //  1000 input
          item.quantity = newQuantity; // once all conditions are met the quantity is updated with the one
          // inputed by the user
        } else {
          // if the condition is not met the user is alerted
          alert("Please enter a valid quantity (0-999)");
        }
      }

      if (newQuantity === 0) {
        // if a quantity of 0 is inputed then the item is deleted from the cart by
        //  calling the delete from cart function.
        this.deleteFromCart(productId);
      }
    });

    this.saveToLocalStorage(); // once the changes have been made to the carts array, It then saves the changes
    //  to the local storage.
  }

  updateDeliveryOptionId(productId, optionId) {
    //  defines a method to update the delivery option id,
    // when the user chooses one, by default its set to option 1 which is free shipping.
    const matchingItem = this.getItem(productId); // uses the get item method which runs a find method for the
    //  cart array to find the matching product id.

    if (matchingItem) {
      // once the matching product in the cart is found, It then updates the delivery option
      // id property with the users input.
      matchingItem.deliveryOptionId = optionId;
    }

    this.saveToLocalStorage(); //  runs the save to local storage method again to update the changes.
  }

  calcPaymentSummary() {
    // Defines a method to calculate the payment summary as the user inputs delivery
    // options or adds items to the cart.
    let allItemsTotal = 0; // Sets the accumulator variables
    let totalShipping = 0;

    this.cartItems.forEach((item) => {
      // Runs a for each loop through the cart items, then uses the get product function and the get option
      // function to find and variable the matching id's.
      const matchingProduct = getProduct(item.productId); // Runs a find loop through the products array
      const matchingOption = getOption(item.deliveryOptionId); // and runs a find loop through the options
      // array in order to variable the match

      if (matchingProduct) {
        // Uses the matching product's value to add to the accumulator, the price times the items quantity.
        allItemsTotal += item.quantity * matchingProduct.priceCents;
      }

      if (matchingOption) {
        // Uses the matching option's value to add to the accumulator the delivery price.
        totalShipping += matchingOption.deliveryPrice;
      }
    });

    const shippingPlusItems = totalShipping + allItemsTotal; // Adds both accumulators. The total delivery
    // prices plus the total of all the items prices together.
    const tax = calcTax(shippingPlusItems); // Calculates the tax for the total of the shipping plus the items
    const grandTotal = Number(tax) * 100 + shippingPlusItems; // Takes the calculated tax and converts it back
    //  to cents, then adds it to the shipping plus the items total.

    return {
      // Returns the variables in an object so its values can be accessed with dot notation.
      shippingPlusItems,
      tax,
      grandTotal,
      allItemsTotal,
      totalShipping,
    };
  }

  getItem(productId) {
    // Defines a method to find the matching cart item using the find method and sets a parameter, to take the
    //  products id to be matched as an argument.
    const matchingItem = this.cartItems.find(
      (item) => item.productId === productId,
    );
    return matchingItem; // Returns the match to be set as the methods value.
  }
}

/* 
Built in javascript classes 
date = new date(); 
console.log(date); 
console.log(date.toLocalTimeString());
xhr = new XMLHttpRequest();
*/

/*
const object1 = {
  // Inside a method this points to the object it belongs to.
  method: function () {
    console.log(this);
  },

  method2: function () {
    // In order to access and call methods within the object without the need to use the objects name. If the objects name is changed the code stayes dynamic and changes with the source.
    this.method();
  },
};
object1.method2();

function logThis() {
  // Inside a function this is obviously undefined as it stays within the functions scope, but a cool feature of javascript allows us to change the value from outside the function by using .call();
  console.log(this);

  [1, 2, 3].forEach((num) => {
    console.log(this); // Inside arrow functions this behaves differently, its allowed to reach outside the function to access its parent. Unlike function declarations where its confined to the functions scope. As you can see in this example its been implemented for the use of forEach loops. 
  });
}

logThis.call(
  // note this only works with a function declaration and not an expression
  "I just changed the value of the undefined 'this' inside the logThis(); function",
);
*/

// This is the benefit of using classes, now to create a new cart that holds all code needed, its as simple as
//  defining a variable that creats a new instance of that class and then just using the argument to make it
// unique.
export const cart = new CartClass("amazon-reg-cart"); //Cart("amazon-reg-cart");
