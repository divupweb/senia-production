export class Menu {
  static load(data) {
    return data.map((e) => new Menu(e));
  }

  added = false;
  text = "Add";

  constructor(public object) {
    Object.assign(this, object);
  }

  set amount(value) { this.object.amount = value; }
  get amount() { return this.object.amount; }


  inc() {
    this.object.amount += 1;
  }

  dec() {
    if (this.object.amount > 0) this.object.amount -= 1;
  }

  checkAddedStatus() {
    this.added = this.object.amount > 0;
    this.setAddedText();
  }

  setAdded() {
    this.added = true;
    this.checkAddedStatus();
  }

  private setAddedText() {
    this.text = this.added ? 'Added' : 'Add'
  }

  toCart() {
    return {
      id: this['order_id'],
      dish_id: this['dish_id'],
      amount: this['amount'],
      kdc_id: this['kdc_id'],
      information: this
    }
  }
}
