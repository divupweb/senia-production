import { Subject } from 'rxjs/Subject';
export class CartItem {
  information = {};
  amount = 0;

  private changeSubject = new Subject();
  onChange = this.changeSubject.asObservable();

  private removeSubject = new Subject();
  onRemove = this.removeSubject.asObservable();


  constructor(private order, public changed = false) {
    this.load();
  }

  private load() {
    Object.assign(this, this.order);
  }

  inc() {
    this.amount += 1;
    this.onAmountChange();
  }

  dec() {
    if (this.amount <= 1) {
      this.remove();
      return;
    }
    this.amount -= 1;
    this.onAmountChange();
  }

  remove() {
    this.onRemoveItem();
  }

  private onAmountChange() {
    this.changed = true;
    this.changeSubject.next(this);
  }

  private onRemoveItem() {
    this.changed = true;
    this.removeSubject.next(this);
    this.removeSubject.complete();
  }

  toParams() {
    return {
      dish_id: this['dish_id'],
      quantity: this.amount
    }
  }
}
