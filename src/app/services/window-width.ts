import { WindowRef } from "./window-ref";
export class WindowWidth {
  public window;
  constructor() {
    this.window = WindowRef.nativeWindow;
  }

  public isMobile() {
    return this.window.innerWidth <= 768;
  }
}
