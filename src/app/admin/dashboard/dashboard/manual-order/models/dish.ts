
export class Dish {

  public id: number;
  public name: string;
  public price: any;

  public kitchen: any;
  public dishCategory: any;

  public quantity: number = 1;

  public skipCharge: boolean = false;

  public properties = _.keys(this.attributes());

  public constructor(attributes: any) {
    _.merge(this,  _.pick(attributes, this.properties));
  }

  public inc(): number {
    return this.quantity++;
  }

  public dec(): number {
    if (this.quantity > 0) {
      this.quantity--;
    }
    return this.quantity;
  }

  public toggleCharge(): void {
    this.skipCharge = !this.skipCharge;
  }

  public attributes(): any {
    return {
      id: this.id,
      dishId: this.id,
      name: this.name,
      skipCharge: this.skipCharge,
      quantity: this.quantity,
      price: this.price,
      kitchen: this.kitchen,
      dishCategory: this.dishCategory
    };
  }

  public params(): any {
    return _.pick(this.attributes(), ['dishId', 'quantity', 'skipCharge']);
  }
}
