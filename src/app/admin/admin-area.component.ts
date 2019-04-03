import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AdminPendingService } from "./services";
import { UserMenuService } from '../shared';
import { AppStateService, AuthService } from "../services";

@Component({
  selector: 'admin-area',
  providers: [ AdminPendingService ],
  styleUrls: [ 'admin-area.scss' ],
  templateUrl: './admin-area.html',
})

export class AdminAreaComponent {
  user = {};
  account = {};
  constructor(
    private  _state: AppStateService,
    private _router: Router,
    public pendingService: AdminPendingService,
    public userMenu: UserMenuService,
    public auth: AuthService) { }

  ngOnInit() {
    this.auth.currentUser(0).subscribe(() => this.setCurrentInfo());
    if(!this._state.admin()) {
      this._router.navigate(['/'])
    }

    this.pendingService.updateCount();
    this.setCurrentInfo();
  }

  private setCurrentInfo() {
    this.user = this._state.currentUser();
    this.account = this._state.currentAccount();
  }
}
