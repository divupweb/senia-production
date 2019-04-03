import { WindowRef } from '../../services/window-ref';

export class MapService {
  static kitchenIcon(): string {
    return `${WindowRef.nativeWindow.location.origin}/assets/images/markers/map-marker-red.png`
  }

  static companyIcon(): string {
    return `${WindowRef.nativeWindow.location.origin}/assets/images/markers/map-marker-purple.png`
  }

  static hubIcon(): string {
    return `${WindowRef.nativeWindow.location.origin}/assets/images/markers/map-marker-green.png`
  }
}
