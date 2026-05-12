import { calcTax } from "../scripts/utils/money.js"; // This is an example of how to manually write automated
//  tests that dont use a framework. Automated tests are tests that automatically test a piece of code when
// it has been changed without the need to manually test the UI. Just opening the test.html file and checking
//  the console should run a test thats sufficient enough for any updates made to the code.

console.log("Testing Calculate Tax Function"); // Sets a title that describes what function is being tested

console.log("Working test ="); // This is a working test which just checks if the function is working at its
// most basic task.
if (calcTax(2010) === "2.01") {
  // A value is used with the function and the result is checked. If the value
  // is whats expected, then the conditional logs passed. If it fails, then the conditional logs failed.
  console.log("Passed");
} else {
  console.log("Failed");
}

console.log("Edge case test ="); // This is an edge case test. This test checks if the function still passes
// even at its most stressed or likely to fail state. Here it tests the function right at the rounding
// boundary.
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
