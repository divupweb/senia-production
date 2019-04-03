import { ObjectLoader } from 'app/services';

export class Dish {
  static load(list): any {
    return list.map((e) => new Dish(e));
  }

  constructor(private object = null) {
    if (object) this.load(object)
  }

  id;
  name;
  priceValue;
  description;
  categoryName;
  dishCategory = {};
  dishType;
  nettoPercent;
  dishImage = {};
  allergyIds = [];
  weight = 0;
  kilocalories = 0;
  protein = 0;
  carbo = 0;
  fat = 0;
  rating;
  ratings = [];
  createdAt;
  detailed = false;


  set price(value) {
    this.priceValue = +value;
  }
  get price() {
    return this.priceValue;
  }


  load(object) {
    let newObject = ObjectLoader.toCamelCase(object);
    Object.assign(this, newObject);
  }

  toForm() {
    let fields = ['name', 'dishCategoryId', 'description', 'price', 'active', 'dishType', 'dishImage', 'nettoPercent'];
    return _.pick(this, fields);
  }
}
