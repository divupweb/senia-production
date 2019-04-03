import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, ToastService, AppStateService } from "app/services";
import { UserMenuService } from 'app/shared';

import {
  KitchenSettingsApiService,
  KitchenSettings,
  KitchenSubscriptionsApiService,
  KitchenSubscriptionsService,
  KitchenLogoChangedService,
  DishCategoriesApiService
} from "../services/";
import {RegisterKitchenService} from "app/shared/auth/kitchen-register";


@Component({
  selector: 'kitchen-area',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../admin/kitchen-area.scss' ],
  templateUrl: './kitchen-employee-area.html',
  providers: [
    UserMenuService,
    DishCategoriesApiService,
    KitchenSettingsApiService,
    KitchenSettings,
    KitchenSubscriptionsApiService,
    KitchenLogoChangedService,
    KitchenSubscriptionsService,
    RegisterKitchenService,
  ]
})

export class KitchenEmployeeAreaComponent {
  public imageDisplayUrl: string;
  public kitchen: any = {};
  constructor(private _state: AppStateService,
              private _router: Router,
              private _toast: ToastService,
              private _settings: KitchenSettings,
              public userMenu: UserMenuService,
              public auth: AuthService,
              protected logoService: KitchenLogoChangedService
  ) {
    this.logoService.urlEmitted.subscribe((url) => this.imageDisplayUrl = url);
  }

  ngOnInit() {
    if(!this._state.kitchenEmployeeUser()) {
      this._router.navigate(['/']);
      return;
    }
    this.auth.currentUser(0).subscribe(
      (data) => this.loadSettings()
    );
  }

  private loadSettings() {
    this._settings.load({ isEmployee: true }).subscribe(
      (response) => {
        this.kitchen = response.kitchen;
        this.logoService.emitDisplayUrl(this.kitchen.display_url);
      }, (error) => this._toast.error(error)
    );
  }
}
