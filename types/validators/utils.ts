function assertIsNonNegative(value: number): asserts value is NonNegativeNumber {
  if (value < 0) {
    throw new Error(`La valeur ne peut pas être négative: ${value}`);
  }
}
function assertIsPositiveInteger(value: number): asserts value is PositiveInteger {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Doit être un entier strictement positif: ${value}`);
  }
}
function assertIsStatusCode(code: number): asserts code is HttpResponseStatusCode {
  if (code < 100 || code >= 600) {
    throw new Error(`Code HTTP invalide: ${code}`);
  }
}
