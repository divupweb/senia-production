import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  ToastService,
  AppStateService
} from "app/services";
import { UserMenuService } from 'app/shared';

import {
  KitchenSettings,
  KitchenLogoChangedService
} from "app/kitchen/services/";
import { providers } from './kitchen-area.providers';


@Component({
  selector: 'kitchen-area',
  styleUrls: ['kitchen-area.scss' ],
  templateUrl: './kitchen-area.html',
  providers: [
    providers
  ]
})

export class KitchenAreaComponent {
  public imageDisplayUrl: string;
  public kitchen: any = {};
  userTitle = '';
  user: any;
  constructor(private _state: AppStateService,
              private _router: Router,
              private _toast: ToastService,
              private _settings: KitchenSettings,
              public userMenu: UserMenuService,
              public auth: AuthService,
              public state: AppStateService,
              protected logoService: KitchenLogoChangedService
  ) {
    this.logoService.urlEmitted.subscribe((url) => this.imageDisplayUrl = url);
  }

  ngOnInit() {
    this.loadUser();
    if(!this._state.kitchenAdmin()) {
      this._router.navigate(['/']);
      return;
    }
    this.auth.currentUser(0).subscribe(
      (data) => this.loadSettings()
    );
  }

  loadUser() {
    this.user = this.state.currentUser();
    this.setUserTitle();
  }

  private loadSettings() {
    this._settings.load().subscribe(
      (response) => {
        this.kitchen = response.kitchen;
        this.logoService.emitDisplayUrl(this.kitchen.display_url);
      }, (error) => this._toast.error(error)
    );
  }
  private setUserTitle() {
    this.userTitle = '';
    if (this.user) {
      this.userTitle = this.user.email;
      if (this.state.fakeCompanyAdmin()) {
        var company = this.state.get('company');
        if (company) this.userTitle = company.name;
      }
      if (this.state.fakeKitchenAdmin()) {
        var kitchen = this.state.get('kitchen');
        if (kitchen) this.userTitle = kitchen.name;
      }
    }
  }
}
