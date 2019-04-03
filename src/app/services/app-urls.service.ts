import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';

@Injectable()
export class AppUrlsService {
  constructor(private appState: AppStateService) {}

  kitchenRoot() {
    return '/kitchens/' + this.appState.kitchenAdmin();
  }

  kitchenEmployeeUser() {
    return '/kitchens/' + this.appState.kitchenEmployeeUser()
  }
}
