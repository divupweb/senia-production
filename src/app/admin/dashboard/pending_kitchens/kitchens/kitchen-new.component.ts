import { Component, Input, EventEmitter, Output } from '@angular/core';
import {AdminKitchensService} from "app/admin/services";


@Component({
  selector: 'kitchen-new',
  templateUrl: './kitchen-new.html',
  styleUrls: [ '../pending-kitchens.scss' ]
})

export class KitchenNewComponent {
  constructor(public service: AdminKitchensService) { }

  @Input() kitchen;
  @Output() onApprove = new EventEmitter();
  @Output() onReject = new EventEmitter();
  @Output() onError = new EventEmitter();


  approveKitchen() {
    this.service.approveItem(this.kitchen.id).subscribe(
      (kitchen) => {
        this.onApprove.next(kitchen);
      },
      (error) => {
        this.onError.next(error);
      }
    )
  }

  rejectKitchen() {
    this.service.rejectItem(this.kitchen.id).subscribe(
      (kitchen) => {
        this.onReject.next(kitchen);
      },
      (error) => {
        this.onError.next(error);
      }
    )
  }
}
