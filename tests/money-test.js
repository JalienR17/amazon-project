import { calcTax } from "../scripts/utils/money.js";

console.log("Testing Calculate Tax Function");

console.log("Working test =");
if (calcTax(2010) === "2.01") {
  console.log("Passed");
} else {
  console.log("Failed");
}

console.log("Edge case test =");
if (calcTax(2015) === "2.02") {
  console.log("Passed");
} else {
  console.log("Failed");
}

console.log("Edge case test 2 =");
if (calcTax(2014) === "2.01") {
  console.log("Passed");
} else {
  console.log("Failed");
}
