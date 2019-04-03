import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DashboardApiService } from '../dashboard-api.service';
import { ToastService } from "../../../services";

@Component({
  selector: 'dashboard-details-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard-details-popup.html',
  styleUrls: ['dashboard-details-popup.scss'],
})

export class DashboardDetailsPopupComponent {
  showValue = false;
  orderedData
  producingData
  pickupData
  deliveredData
  @Input() type;
  @Input() subscription;
  @Input() date;
  @Input()
  get show() {
    return this.showValue;
  }
  set show(val) {
    this.showValue = val;
    this.showChange.emit(this.showValue);
    this.orderedData   = null
    this.producingData = null
    this.pickupData    = null
    this.deliveredData = null
    if (val && this.type) {
      this._service.getPopupData(this.type, this.date, this.subscription).subscribe(
        response => this[this.type + 'Data'] = response,
        error => this.toastService.error(error)
      )
    }
  }

  @Output() showChange = new EventEmitter();
  constructor(private _service: DashboardApiService, public toastService: ToastService) {}

  cancelPopup() {
    this.show = false;
  }
}
