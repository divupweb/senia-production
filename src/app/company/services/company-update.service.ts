import { EventEmitter } from '@angular/core';

export class CompanyUpdateService {
  update = new EventEmitter();
  welcomePopup = new EventEmitter();

  public set(data) {
    this.update.emit(data);
  }

  public showWelcomePopup(status = true) {
    this.welcomePopup.emit(status);
  }
}
