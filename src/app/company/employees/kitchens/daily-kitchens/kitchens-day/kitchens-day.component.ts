import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kitchens-day',
  templateUrl: './kitchens-day.html',
  styleUrls: ['kitchens-day.scss']
})

export class KitchensDayComponent {
  @Input() subscription;
  @Input() dki;
  @Input() kitchens;
  @Output() onKitchenAdd = new EventEmitter();
  @Output() onKitchenRemove = new EventEmitter();

  isOpen = false;
  search = '';

  deliveryCost = 85; // TODO: load from api
  amount = 0;
  delivery: any = [0, 0];
  deliveryRange = true;
  ids = [];

  ngOnChanges(changes) {
    if (changes['dki']) {
      this.updateDelivery();
    }
  }

  openKitchensSelect() {
    this.updateAddedKitchens();
    setTimeout(() => {this.isOpen = true}, 100);
  }

  closeKitchensSelect() {
    this.isOpen = false;
  }

  private updateDelivery() {
    this.amount = this.dki.filter((e) => e._destroy != 1).length;
    if (this.amount == 0) return;
    this.deliveryRange = true;
    this.delivery = new Array(2);
    this.delivery[0] = this.deliveryCost; this.delivery[1] = this.deliveryCost;
    if (this.amount > 1) this.delivery[1] = this.deliveryCost * this.amount;
    if (this.delivery[1] == this.delivery[0]) {
      this.delivery = this.delivery[0];
      this.deliveryRange = false;
    }
  }

  removeKitchen(kitchen) {
    this.onKitchenRemove.emit(this.emitParams(kitchen));
  }

  addKitchen(kitchen) {
    this.onKitchenAdd.emit(this.emitParams(kitchen));
    this.closeKitchensSelect();
  }

  private emitParams(kitchen) {
    return {
      subscription: this.subscription.subscription_type,
      kitchen: kitchen
    }
  }

  private updateAddedKitchens() {
    this.ids = _.map(this.dki, (e) => e.kitchen.id);
  }
}
