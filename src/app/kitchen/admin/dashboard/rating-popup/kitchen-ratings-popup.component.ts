import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KitchenRatingsApiService } from './kitchen-ratings-api.service';
import { ToastService, ParamsUrlParser } from "app/services";

@Component({
  selector: 'kitchen-ratings-popup',
  templateUrl: './kitchen-ratings-popup.html',
  styleUrls: ['./kitchen-ratings-popup.scss']
})

export class KitchenRatingsPopupComponent {
  showValue = false;
  @Input() subscription;
  @Input() date;
  @Input() isEmployee;
  ratings;
  @Input()
  get show() {
    return this.showValue;
  }
  set show(val) {
    this.showValue = val;
    this.showChange.emit(this.showValue);
    if (val) {
      this._service.getListForSubscription(this.subscription, this.date, this.isEmployee).subscribe(
        (response) => this.ratings = response,
        (error) => this.toastService.error(error)
      )
    }
  }

  @Output() showChange = new EventEmitter();
  constructor(private _service: KitchenRatingsApiService, public toastService: ToastService) {}

  cancelPopup() {
    this.show = false;
  }
}
