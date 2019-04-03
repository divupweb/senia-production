import { Component, Input } from '@angular/core';

@Component({
  selector: 'subscription',
  templateUrl: './subscription.html'
})

export class KitchenUpdateSubscriptionComponent {

  @Input() subscription;
  @Input() oldSubscription;
  @Input() dishCategories: any[];

  haveDifferences = false;
  differences: any = {};

  ngOnInit() {
    this.differences = {
      capacity: this.differentValues(this.oldSubscription, this.subscription, 'capacity')
    };
    this.haveDifferences = _.includes(this.differences, true);
  }

  getSubscriptionTitle(type) {
    return type.replace("KitchenSubscription", "");
  }

  differentValues(source, update, name: string) {
    const val0 = source && source[name];
    const val1 = update[name] && update[name];
    return val0 != val1;
  }

}
