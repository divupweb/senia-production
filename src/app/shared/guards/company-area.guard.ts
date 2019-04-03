import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthCommonGuard } from './auth-common.guard';
import { AppStateService } from 'app/services';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class CompanyAreaGuard extends AuthCommonGuard {
  constructor(
    public state: AppStateService,
    public router: Router,
    public t: TranslateService) {
    super(state, router, t);
  }


  authenticated() {
    return this.state.companyAdmin() && !!this.state.currentCompany();
  }
}
