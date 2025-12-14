import {querySelectorAssert} from '../validators/dom';
import {assertIsCodeProductValide} from '../validators/products';
import { zoomServiceInstance } from '../services/ZoomService';
import {CodeProduct, Produit} from '../types/branded';

const existenceCache = new Map<CodeProduct, boolean>();

export class CartesUi {
  private CARTE_BASE_PATH : string = "/Cartes/";
  
  constructor(produits: Produit[]){
    this.loadCacheFromSessionStorage();
  }
  private loadCacheFromSessionStorage() {
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('carte_exists_')) {
            const code = key.substring('carte_exists_'.length);
            const existsStr = sessionStorage.getItem(key);
            if (existsStr) {
                existenceCache.set(code as CodeProduct, existsStr === 'true');
            }
        }
    }
  }
  
  private async checkCarteExistence(code: CodeProduct): Promise<boolean> {
      assertIsCodeProductValide(code);
      if (existenceCache.has(code)) return existenceCache.get(code) ?? false; // Simplifier si has code > nécessairement get(code) est non null / undefined
  
      const url = `${this.CARTE_BASE_PATH}${code}.jpg`;
      try {
          const response = await fetch(url, { method: 'HEAD' });
          const exists = response.ok;
          existenceCache.set(code, exists);
          sessionStorage.setItem(`carte_exists_${code}`, String(exists));
          return exists;
      } catch (error) {
          console.error(`Erreur lors de la vérification de ${url}:`, error);
          existenceCache.set(code, false);
          return false;
      }
  }
  public async processProductCards(produits: Produit[]) {
    console.debug(`Démarrage du traitement de ${produits.length} produits...`);
  
    const checkPromises = produits.map(produit => this.checkCarteExistence(produit.codeProduct));
    const results = await Promise.all(checkPromises);

    produits.forEach((produit, index) => {
        const carteExiste = results[index];
        const code = produit.codeProduct;

        const cardProduct = querySelectorAssert(`[data-show-map="${code}"]`);
        if (!carteExiste) this.removeCardLink(cardProduct); 
    });
    
    console.debug("Traitement des cartes terminé.");
  }
  private removeCardLink(element: Element) {
    element.remove();
  }

  public eventShowCarte(code: CodeProduct) {
    const path = `${this.CARTE_BASE_PATH}${code}`
    zoomServiceInstance.showImagePopup(path);
  }
}
