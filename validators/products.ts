import { CodeProduct } from '../types/branded';

export function assertIsCodeProductValide(codeProduit: string): asserts codeProduit is CodeProduct {
  if (codeProduit.lenght < 4) {
    throw new Error("Ce n'est pas un code produit");
  }
}
