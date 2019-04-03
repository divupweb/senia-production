import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AdminKitchenUpdatesService } from "app/admin/services";

@Component({
  selector: 'kitchen-update',
  templateUrl: './kitchen-update.html',
  styleUrls: [ '../pending-kitchens.scss' ]
})

export class KitchenUpdateComponent {
  constructor(public service: AdminKitchenUpdatesService) { }

  @Input() kitchen;
  @Output() onApprove = new EventEmitter();
  @Output() onReject = new EventEmitter();
  @Output() onError = new EventEmitter();

  kitchenUpdate: any;

  ngOnInit() {
    this.kitchenUpdate = this.kitchen.kitchen_update.settings;
  }


  approveUpdate() {
    this.service.approveUpdate(this.kitchen.kitchen_update.id).subscribe(
      (kitchen) => {
        this.onApprove.next(kitchen);
      },
      (error) => {
        this.onError.next(error);
      }
    )
  }

  rejectUpdate() {
    this.service.rejectUpdate(this.kitchen.kitchen_update.id).subscribe(
      (kitchen) => {
        this.onReject.next(kitchen);
      },
      (error) => {
        this.onError.next(error);
      }
    )
  }

  differentValues(source, update, name) {
    return update[name] && source[name] != update[name];
  }

  getOldSubscription(kitchen, type) {
    return _.find(kitchen.kitchen_subscriptions, { type: type});
  }
}
