declare const __brand: unique symbol;
export type Branded<T, Brand> = T & { readonly [__brand]: Brand };

// Définitions des types spécifiques
export type ValidEmail = Branded<string, 'Email'>;
export type NonNegativeNumber = Branded<number, 'NonNegativeNumber'>;
export type PositiveInteger = Branded<number, 'PositiveInteger'>;
export type HttpResponseStatusCode = Branded<number, 'HttpResponseStatusCode'>;

// Types business
export type TypeVoyage = Branded<number, "Code type voyage">;
export type AgeEnfants = Branded<number, "Age enfant">; 

// Type product
export interface Produit {
    codeProduct: CodeProduct,
    duration?: Duration,
    libelle?: Libelle
}

export type CodeProduct = Brand<string, "codeProduct">;
type Duration = Brand<number, "duration">;
type Libelle = Brand<string, "libelle">;

export type CarteExistenceMap = {
    [code: CodeProduct]: boolean;
};
