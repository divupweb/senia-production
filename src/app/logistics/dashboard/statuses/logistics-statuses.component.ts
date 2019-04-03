import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LogisticsDashboardApiService } from '../logistics-dashboard-api.service'
import { ToastService } from "app/services";

@Component({
  selector: 'logistics-statuses',
  providers: [LogisticsDashboardApiService ],
  styleUrls: [ 'logistics-statuses.scss' ],
  templateUrl: './logistics-statuses.html'
})

export class LogisticsStatuses {
  @Input() dates;
  @Input() isKitchen;
  @Output() onEmptyStatus = new EventEmitter();
  daysData = []
  selectedShipment;
  showPopup = false;
  showStatusBar = false;
  constructor(private _service: LogisticsDashboardApiService, private toastService: ToastService) {}

  ngOnChanges(changes) {
    if (changes['dates']) {
      this.loadData();
    }
  }

  shipmentColor(status) {
    let color
    switch (status) {
      case 'delivered':
        color = 'green'
        break;
      case 'pickup':
        color = 'yellow'
        break;
      default:
        color = 'red'
    }
    return color
  }

  openPopup(shipment) {
    this.selectedShipment = shipment
    setTimeout( () => {this.showPopup = true;}, 100);
  }

  private

  loadData() {
    this.daysData = [];
    if (this.dates.length == 0) return;
    this._service.getStatuses(this.dates, this.isKitchen).subscribe(
      (response) => {
        this.daysData = response;
        this.showStatusBar = response.length > 0;
      },
      (error) => this.toastService.error(error)
    )
  }
}
