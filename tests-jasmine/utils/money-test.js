import { calcTax, formatCurrency } from "../../scripts/utils/money.js"; // Importing calcTax() and
// formatCurrency() in order to test with the Jasmine framework. Note: this file is linked through the script
// tag and the module attribute in the tests.html file within Jasmine just how a normal script link would work
//  just kept under Jasmine's own script tags to properly load the framework.

describe("Test Suite: calcTax", () => {
  // Describe is the Jasmine function that is used to group related.
  // tests together. The first parameter takes a string that displays in the UI as a title. While the second
  // parameter takes a function in which the test functions will be used.
  describe("Nesting describe is possible for grouping related tests like so :)", () => {
    // It's also possible
    // to nest describe functions. For more specific grouping.
    it("Working test is a test thats just checks if the function is working at its most basic operation, in this case = calculates tax at 10% and converts to dollars from cents", () => {
      expect(calcTax(2010)).toEqual("2.01"); // it(); also takes 2 parameters. The first a string to further
      //  describe that specific test and display it as a sub-title on the page. The second is a function that
      //  holds the test and uses certain functions to perform the test. In this one the expect function with
      // the toEqual(); method is used. Jasmine is made to be read like reading english sentences. expect();
      // takes the function being tested as a parameter while chaining the toEqual(); method to check the
      // results.
    }); // In Jasmine instead of just seeing "Failed" in a console, Jasmine provides a UI that tells you
    // exactly which edge case failed and why.

    it("Edge case test is a test that checks if the function is working at its limits, where it would be expected to fail, in this case, at the .055 it should round up", () => {
      expect(calcTax(2015)).toEqual("2.02"); // The same pattern is repeated while using working tests and
      // following with edge case tests.
    });

    it("Rounds Down", () => {
      expect(calcTax(2014)).toEqual("2.01");
    });

    it("Checks close to zero if it rounds down to zero", () => {
      expect(calcTax(4)).toEqual("0.00");
    });

    it("Checks close to zero if it rounds up to one cent", () => {
      expect(calcTax(5)).toEqual("0.01");
    });

    it("Checks At Zero", () => {
      expect(calcTax(0)).toEqual("0.00");
    });
  });
});

describe("Test Suite: formatCurrency", () => {
  it("Just checks if the converts cents into dollars at its most basic operation", () => {
    expect(formatCurrency(2010)).toEqual("20.10");
  });

  it("Converts cents into dollars", () => {
    expect(formatCurrency(2015)).toEqual("20.15");
  });

  it("Converts cents into dollars", () => {
    expect(formatCurrency(2014)).toEqual("20.14");
  });

  it("Checks with less than a dollar", () => {
    expect(formatCurrency(4)).toEqual("0.04");
  });

  it("Checks with one cent", () => {
    expect(formatCurrency(1)).toEqual("0.01");
  });

  it("Checks At Zero", () => {
    expect(formatCurrency(0)).toEqual("0.00");
  });

  it("Checks to the nearest cent if it rounds up", () => {
    expect(formatCurrency(1000.5)).toEqual("10.01");
  });

  it("Checks to the nearest cent if it rounds down", () => {
    expect(formatCurrency(1000.4)).toEqual("10.00");
  });
});
