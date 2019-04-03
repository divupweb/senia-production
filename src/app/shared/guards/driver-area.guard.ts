import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { AppStateService } from 'app/services';
import { AuthCommonGuard } from './auth-common.guard';

@Injectable()
export class DriverAreaGuard extends AuthCommonGuard {
  constructor(
    public state: AppStateService,
    public router: Router,
    public t: TranslateService) {
    super(state, router, t);
  }


  authenticated() {
    return this.state.driverUser() ||
           this.state.kitchenDriverUser() ||
           this.state.admin();
  }
}
