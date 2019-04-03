import * as _ from 'lodash';

export class Kitchen {
  static load(data, subscription) {
    return data.map((e) => new Kitchen(e, subscription));
  }

  amount = 0;
  isFavorite = false;
  private kitchenSubscription;

  constructor(
    public object,
    private subscription
  ) {
    Object.assign(this, object);
    this.setKitchenSubscription();
    this.calcAmount();
  }

  private setKitchenSubscription() {
    this.kitchenSubscription = _.upperFirst(this.subscription) + 'KitchenSubscription';
  }

  private calcAmount() {
    if (this.object.dishes_amount) {
      this.amount = +this.object.dishes_amount[this.kitchenSubscription];
    }
  }
}
