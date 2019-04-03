import { Component, ViewChild } from '@angular/core';

import {
  CompanyOrdersCommon,
  Deadline,
  PeriodicOrdersApiService
 } from '../shared';

import { MenuApiService, Menu } from '../../shared';
import { ToastService, AppStateService } from "../../../services";
import { UserMenuService } from 'app/shared/components/user-menu';

@Component({
  selector: 'company-defaults',
  templateUrl: './company-defaults.html',
  styleUrls: ['company-defaults.scss'],
  providers: [
    MenuApiService,
    PeriodicOrdersApiService
  ]
})

export class CompanyDefaultsComponent extends CompanyOrdersCommon {
  @ViewChild('kitchenCarousel') kitchenCarousel;
  dateColumnName = 'day';

  constructor(
    toast: ToastService,
    menuApi: MenuApiService,
    ordersApi: PeriodicOrdersApiService,
    public userMenu: UserMenuService,
    state: AppStateService) {
      super(toast, menuApi, ordersApi, null, state);
  }

  ngOnInit() {
    this.loadCalendarInfo();
  }

  dateFormatted() {
    return this.selectedDay;
  }

  // loaders
  kitchenLoader() {
    return this.menuApi.kitchens();
  }

  menuLoader(kitchen) {
    return this.menuApi.menu(this.activeSubscription, kitchen.id, null, this.dateFormatted())
  }

  findKitchen(): any {
    return _.first(this.kitchens);
  }

  cartLoader() {
    return this.menuApi.cart(this.activeSubscription, null, this.dateFormatted())
  }

  // events
  onDaySelect(e) {
    this.selectedDay = e;
    super.onDaySelect(e);
  }

  isoWeekday() {
    return this.selectedDay + 1;
  }
}
