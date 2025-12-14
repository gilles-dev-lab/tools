import { AgeEnfants, AgeValid } from '../types/branded';

export function assertIsAgeValide(age: number): asserts age is AgeValid {
  if (age < 0) {
    throw new Error("Ce n'est pas un age valide (doit être >= 0).");
  }
}
export function assertIsAgeEnfant(age: AgeValid): asserts age is AgeEnfants {
    if (age >= 18) {
        throw new Error("C'est un adulte (doit être < 18).");
    }
}

export function checkAgeEnfant(age: number): true {
    try {
        assertIsAgeValide(age);
        assertIsAgeEnfant(age);
        return true;
    } catch (e) {
        // On peut relancer l'erreur initiale ou une erreur standardisée
        throw new Error(`Validation AgeEnfant échouée: ${(e as Error).message}`);
    }
}
export function isAgeEnfant(age: number): age is AgeEnfants {
    try {
        assertIsAgeValide(age);
        assertIsAgeEnfant(age);
        return true;
    } catch (e) {
        return false;
    }
}
