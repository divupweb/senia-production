import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppStateService } from 'app/services';
import { TranslateService } from "@ngx-translate/core";

export class AuthCommonGuard {
  constructor(
    public state: AppStateService,
    public router: Router,
    public t: TranslateService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let result = false;

    if (this.authenticated()) {
      result = true;
    } else {
      console.error(this.t.instant('TOAST.ERROR.GUARD'))
      result = false;
      let path = this.navigate();
      this.router.navigate(path);
    }

    return result;
  }

  authenticated() {
    return false;
  }

  navigate() {
    return ['/'];
  }
}
