import { calcTax, formatCurrency } from "../../scripts/utils/money.js";

describe("Test Suite: calcTax", () => {
  describe("Nesting describe is possible for grouping related tests like so :)", () => {
    it("Working test is a test thats just checks if the function is working at its most basic operation, in this case = calculates tax at 10% and converts to dollares from cents", () => {
      expect(calcTax(2010)).toEqual("2.01");
    });

    it("Edge case test is a test that checks if the function is working at its limits, where it would be expected to fail, in this case, at the .055 it should round up", () => {
      expect(calcTax(2015)).toEqual("2.02");
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
});
