import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { AppStateService } from 'app/services';
import { AuthCommonGuard } from './auth-common.guard';


@Injectable()
export class UserAreaGuard extends AuthCommonGuard {
  constructor(
    public state: AppStateService,
    public router: Router,
    public t: TranslateService) {
    super(state, router, t);
  }

  private user;
  private signUpUser = false;

  authenticated() {
    this.user = this.state.currentUser();
    this.signUpUser = this.state.signUpUser();
    return this.user && !this.signUpUser;
  }

  navigate() {
    let path = this.signUpUser ? ['/sign-up-wizard'] : ['/'];
    return path;
  }
}
