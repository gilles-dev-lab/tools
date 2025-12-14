import { zoom } from '../lib/zoom.vanilla';

export class ZoomService {

  showImagePopup(path: string): void {
    console.log(`ZoomService: Tentative d'affichage pour le code : ${path}`);

    // Exemple d'appel à la librairie externe :
    zoom.open({
        productCode: code,
        // ... autres options
    });
  }
}

// Pour une utilisation facile, vous pouvez aussi exporter une instance singleton :
export const zoomServiceInstance = new ZoomService();
