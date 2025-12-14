import { zoom } from '../lib/zoom.vanilla';

export class ZoomService {

  showImagePopup(path: string): void {
    console.log(`ZoomService: Tentative d'affichage pour l'image : ${path}`);

    // !Todo adapter :
    zoom.open({
        path: path,
        // ... autres options
    });
  }
}

export const zoomServiceInstance = new ZoomService();
