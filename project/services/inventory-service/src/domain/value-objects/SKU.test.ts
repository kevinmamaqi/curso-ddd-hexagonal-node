import { SKU } from "./SKU";

describe("SKU", () => {
  const validSKUs = ["AAA-0000-AA", "ABC-1234-AB", "XYZ-9999-XY"];
  validSKUs.forEach((sku) => {
    it("should create a valid SKU", () => {
      expect(() => SKU.of(sku)).not.toThrow();
    });
  });

  const invalidSKUs = [
    "AB-1234-CD",
    "ABCD-1234-EF",
    "ABC-123-DE",
    "ABC-12345-DE",
    "ABC-1234-D",
    "ABC-1234-DEF",
    "ABC1234DE",
    "ABC-1234",
    "123-4567-AB",
    "AAA-0000-A",
    "AAA-0000-AAA",
    "AAA-0000-",
    "AAA-0000",
    "AAA-0000- ",
    "AAA-0000-  ",
    "AAA-0000- A",
    "",
    "abc-1234-de",
    "Abc-1234-De",
    "ABC-defg-HI",
    "ABC-1234-dE",
    "A!C-1234-DE",
    "ABC-12!4-DE",
    "ABC-1234-D!",
    "ABC--1234-DE",
    "ABC-1234--DE",
    "-1234-DE",
    "ABC--DE",
    "ABC-1234DE",
    "ABC1234-DE",
    " ABC-1234-DE",
    "ABC-1234-DE ",
    "PRE-ABC-1234-DE",
    "ABC-1234-DE-POST",
    "PRE-ABC-1234-DE-POST",
    "ABC-1234-DEextra",
    "AAA_0000_AA",
    "AAA.0000.AA"
    ];
  invalidSKUs.forEach((sku) => {
    it(`should not create a SKU with invalid characters ${sku}`, () => {
      expect(() => SKU.of(sku)).toThrow(
        "El SKU debe tener el formato 'AAA-0000-AA'."
      );
    });
  });
});
