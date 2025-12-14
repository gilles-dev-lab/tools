import {querySelectorAssert} from '../validators/dom';
import {assertIsCodeProductValide} from '../validators/products';
import { zoomServiceInstance } from '../services/ZoomService';
import {CodeProduct, Produit, CarteExistenceMap} from '../types/branded';

const existenceCache = new Map<CodeProduct, boolean>();
const CACHE_SESSION_KEY = 'all_carte_existences';

export class CartesUi {
  private CARTE_BASE_PATH : string = '/Cartes/';
  private prefixStorage : string = 'carte_exists_';
  private cardLinkAttribute: string = 'data-show-map';
  
  constructor(produits: Produit[]){
    this.loadCacheFromSessionStorage();
  }

  private loadCacheFromSessionStorage() {
    const cachedData = sessionStorage.getItem(CACHE_SESSION_KEY);
    if (!cachedData) return;
    try {
        const mapAsObject: CarteExistenceMap = JSON.parse(cachedData);
        Object.entries(mapAsObject).forEach(([code, exists]) => {
            existenceCache.set(code as CodeProduct, exists); 
        });
        console.debug(`${existenceCache.size} entrées de cache chargées depuis sessionStorage.`);

    } catch (e) {
        console.error("Erreur lors du parsing du cache JSON de session.", e);
        sessionStorage.removeItem(CACHE_SESSION_KEY); 
    }
  }
  private saveCacheToSessionStorage(): void {
      const mapAsObject: CarteExistenceMap = {};
      
      existenceCache.forEach((exists, code) => {
          mapAsObject[code] = exists;
      });
  
      try {
          sessionStorage.setItem(CACHE_SESSION_KEY, JSON.stringify(mapAsObject));
      } catch (e) {
          console.error("Erreur lors de la sauvegarde du cache JSON dans sessionStorage", e);
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

        const cardProduct = querySelectorAssert(`[${this.cardLinkAttribute}="${code}"]`);
        if (!carteExiste) this.removeCardLink(cardProduct); 
    });
    this.saveCacheToSessionStorage();
    console.debug("Traitement des cartes terminé.");
  }
  private removeCardLink(element: Element) {
    element.remove();
  }

  public eventShowMap(code: CodeProduct) {
    const path = `${this.CARTE_BASE_PATH}${code}`
    zoomServiceInstance.showImagePopup(path);
  }
}
