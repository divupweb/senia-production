import { Component, ElementRef, Renderer } from '@angular/core';
import { KitchenDashboardApiService } from './kitchen-dashboard-api.service'
import { ToastService, ParamsUrlParser, WindowRef } from "app/services";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin'
import { KitchenRatingsApiService } from './rating-popup';
import { UserMenuService } from 'app/shared/components/user-menu';

@Component({
  selector: 'dashboard',
  styleUrls: [ 'dashboard.scss' ],
  templateUrl: './dashboard.html',
  providers: [ KitchenDashboardApiService, KitchenRatingsApiService ]
})
export class KitchenDashboardComponent {
  window;
  currentDate;
  popupType;
  popupDate;
  popupSubscription;
  dates = [];
  subscriptionsData: any;
  cateringData;
  showRatingPopup = false;
  showDetailsPopup = false;
  isEmployee;
  cateringOrderId;
  accountId;
  deadlinePassed = false;

  constructor(private _service: KitchenDashboardApiService,
              public userMenu: UserMenuService,
              private toastService: ToastService) {
    this.window = WindowRef.nativeWindow;
    this.isEmployee = ParamsUrlParser.isEmployee();
  }

  onDaySelect(value) {
    this.dates = value
    this.loadData()
  }

  acceptCateringRequest(orderId) {
    this._service.acceptOrder(orderId, this.isEmployee).subscribe(
      (response) => {
        this.getCatering()
      },
      (error) => this.toastService.error(error)
    )
  }

  rejectCateringRequest(orderId) {
    this._service.rejectOrder(orderId, this.isEmployee).subscribe(
      (response) => {
        this.getCatering()
      },
      (error) => this.toastService.error(error)
    )
  }

  openPopup(date, accountId, subscription, type, cateringOrderId = null, deadlinePassed = false) {
    this.popupDate = date;
    this.popupSubscription = subscription;
    this.accountId = accountId;
    this.cateringOrderId = cateringOrderId;
    this.deadlinePassed = deadlinePassed;
    setTimeout( () => {this[type] = true}, 100);
  }

  printCateringOrder(order) {
    let url = this._service.printUrl(this.isEmployee, 'catering', null, 'production_lists', order.order_id);
    this.window.open(url, '_blank').focus();
  }

  private loadData() {
    if (this.cateringData) {
      this._service.get(this.dates, this.isEmployee).subscribe(
        (response) => this.subscriptionsData = response,
        (error) => this.toastService.error(error)
      )
    } else {
      Observable.forkJoin([this._service.get(this.dates, this.isEmployee), this._service.getCatering(this.isEmployee)]).subscribe(
        (response) => {
          this.subscriptionsData = response[0];
          this.cateringData = response[1];
        },
        (error) => this.toastService.error(error)
      )
    }
  }

  private getCatering() {
    this._service.getCatering(this.isEmployee).subscribe(
      (response) => {
        this.cateringData = response;
      },
      (error) => this.toastService.error(error)
    )
  }
}
