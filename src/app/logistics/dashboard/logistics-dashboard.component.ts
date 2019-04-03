import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LogisticsDashboardApiService } from './logistics-dashboard-api.service'
import { ToastService, ParamsUrlParser } from "../../services";
import { Invoices } from 'app/shared/invoices';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'logistics-dashboard',
  providers: [LogisticsDashboardApiService],
  styleUrls: [ 'logistics-dashboard.scss' ],
  templateUrl: './logistics-dashboard.html'
})


export class LogisticsDashboardComponent extends Invoices {
  currentDate;
  public isKitchen
  constructor(
    public _service: LogisticsDashboardApiService,
    public toastService: ToastService,
    public _router: Router,
    public route: ActivatedRoute,
    public translate: TranslateService) {
      super(_service, toastService, _router, route, translate);
    }

  dates = [];
  daysData = [];

  ngOnInit() {
    this.isKitchen = ParamsUrlParser.isKitchen();
  }

  onDaySelect(value) {
    this.dates = value;
    this.loadData();
  }

  loadData() {
    this._service.getSubscriptions(this.dates, this.isKitchen).subscribe(
      (response) => this.daysData = response,
      (error) => this.toastService.error(error)
    )
  }

  goToShipments(subscription, date) {
    let link = ['locations', subscription, date];
    this._router.navigate(link , { relativeTo: this.route });
  }
}
