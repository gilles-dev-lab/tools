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
