import { EventEmitter } from '@angular/core';

export class LogoChangedService {
  public urlEmitted: EventEmitter<string> = new EventEmitter();

  public emitDisplayUrl(url: any) {
    this.urlEmitted.emit(url);
  }
}
