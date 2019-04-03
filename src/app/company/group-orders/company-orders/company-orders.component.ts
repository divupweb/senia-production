import { Component, ViewChild } from '@angular/core';

import {
  CompanyOrdersCommon,
  Deadline,
  CustomOrdersApiService,
  CateringOrdersApiService
} from '../shared';
import { MenuApiService } from 'app/company/shared';
import { ToastService, AppStateService } from "app/services";
import { TranslateService } from "@ngx-translate/core";
import { UserMenuService } from 'app/shared/components/user-menu';

@Component({
  selector: 'company-orders',
  templateUrl: './company-orders.html',
  styleUrls: ['company-orders.scss'],
  providers: [MenuApiService, CustomOrdersApiService, CateringOrdersApiService]
})

export class CompanyOrdersComponent extends CompanyOrdersCommon {
  @ViewChild('kitchenCarousel') kitchenCarousel;
  @ViewChild('cateringInformation') cateringInformation;
  deadline;
  available;


  constructor(
    toast: ToastService,
    menuApi: MenuApiService,
    ordersApi: CustomOrdersApiService,
    cateringApi: CateringOrdersApiService,
    state: AppStateService,
    public userMenu: UserMenuService,
    protected translate: TranslateService) {
      super(toast, menuApi, ordersApi, cateringApi, state);
  }

  ngOnInit() {
    this.ordersApi.available().subscribe(
      (data) => {
        this.available = data;
        if (data.subscription) {
          let item = _.find(this.subscriptions, { type: data.subscription });
          if (item) {
            this.activeSubscription = data.subscription;
            this.subscriptions.forEach((s) => s.active = false);
            item.active = true
          };
        }
      },
      (error) => this.toast.error(error)
    )
  }

  initSubscriptions() {
    super.initSubscriptions();
    this.subscriptions.push({
      type: 'catering',
      periodic: false,
      custom: false,
      amount: 0,
      active: false
    });
  }

  setSelectedDay(e) {
    this.selectedDay = e.clone();
  }

  readDeadline() {
    this.deadline = new Deadline(this.selectedKitchen.deadline);
  }

  loadCalendarInfo(days) {
    if (days.length == 0) return;
    super.loadCalendarInfo(days);
  }

  // events
  onWeekChange(days) {
    var filtered = days.map( (d) => {
      var e = moment.utc(d, "DD-MM-YYYY").formatUTC('YYYY-MM-DD');
      if (!(e in this.calendarInfo)) { return e };
    }).filter( (d) => !!d )

    this.loadCalendarInfo(filtered);
  }

  onCartSubmit(data) {
    let resp = this.cart.canBeSubmitted();
    if (!resp.status) {
      this.toast.error(resp.msg);
      return;
    }

    this.cateringApi.put(this.cart.toParams()).subscribe(
      (r) => {
        this.toast.success(this.translate.instant('TOAST.SUCCESS.CATERING_UPLOADED'));
        this.initCart(r.cart);
        this.mergeCalendarInfo(r.calendar);
      },
      (error) => this.toast.error(error)
    )
  }
}
