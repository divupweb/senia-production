import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardApiService } from './dashboard-api.service';
import { ToastService } from "../../services";
import { UserMenuService } from 'app/shared/components/user-menu';

@Component({
  selector: 'company-dashboard',
  styleUrls: ['dashboard.scss'],
  templateUrl: './dashboard.html'
})

export class CompanyDashboardComponent {
  currentDate;
  popupType;
  popupDate;
  popupSubscription;
  dates = []
  subscriptionsData = []
  steps = ['ordered', 'producing', 'pickup', 'delivered']
  showPopup = false;

  constructor(private _service: DashboardApiService,
              public userMenu: UserMenuService,
              public toastService: ToastService) { }

  onDaySelect(value) {
    this.dates = value
    this.loadData()
  }

  openPopup(type, date, subscription) {
    this.popupType = type
    this.popupDate = date
    this.popupSubscription = subscription
    setTimeout(() => { this.showPopup = true }, 100);
  }

  private

  loadData() {
    this._service.get(this.dates).subscribe(
      (response) => this.subscriptionsData = response,
      (error) => this.toastService.error(error)
    )
  }
}
