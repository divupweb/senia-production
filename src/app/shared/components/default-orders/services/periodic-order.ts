import { ObjectLoader } from 'app/services';
export class PeriodicOrder {
  static load(list) {
    return list.map((o) => new PeriodicOrder(o));
  }

  amount = 0;
  kitchenDishCategory: any = {};
  kitchen: any = {};
  active = true;
  kitchenDishCategoryId;
  day;
  subscription;
  companySubscriptionId;

  constructor(object = null) {
    if (object) this.load(object);
  }

  set kdc(kdc) {
    this.amount = 1;
    this.kitchenDishCategory = ObjectLoader.toCamelCase(kdc);
    this.kitchenDishCategoryId = this.kitchenDishCategory.id;
    this.kitchen.name = this.kitchenDishCategory.kitchenName;
  }

  private load(object) {
    Object.assign(this, ObjectLoader.toCamelCase(object))
  }

  get params() {
    let fields = [
      'day',
      'subscription',
      'companySubscriptionId',
      'kitchenDishCategoryId',
      'amount'];
    let data = _.pick(this, fields);
    return ObjectLoader.toSnakeCase(data);
  }
}
