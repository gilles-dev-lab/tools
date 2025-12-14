import { checkAgeEnfant } as Validators from '../validators/age';

function processChildData(age: number) {
    Validators.checkAgeEnfant(age); 
    console.log(`Traitement pour un enfant de ${age} ans.`);
}

function canDisplayDiscount(age: number): boolean {
    if (Validators.isAgeEnfant(age)) {
        return true;
    }
    return false;
}

// Symbol testing
const price = {
  amount: 99.99,
  currency: "USD",
  [Symbol.toPrimitive](hint: string) {
    if (hint === "string") return `${this.currency} ${this.amount}`;
    if (hint === "number") return this.amount;
    return null;
  },
};

console.log(String(price));
console.log(Number(price));
console.log(Number(price) + 10);

const customReplacer = {
  [Symbol.replace](string: string, replacement: string) {
    return string.replace("apple", replacement); 
  }
};

console.log("I like apple too much".replace(customReplacer, "banana")); 
