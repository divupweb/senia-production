import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Deadline } from '../../deadline';

@Component({
  selector: '[cartItem]',
  styleUrls: ['cart-item.scss'],
  templateUrl: './cart-item.html',
})

export class CartItemComponent {
  @Input() cartItem;
  @Output() onItemChange = new EventEmitter();
  @Output() onItemRemove = new EventEmitter();
  deadline;

  ngOnChanges(changes) {
    if (changes['cartItem']) this.readDeadline();
  }

  readDeadline() {
    if (this.deadline) this.deadline.stop();
    if (!this.cartItem) return;
    this.deadline = null;
    if (this.cartItem.information && this.cartItem.information.deadline) {
      this.deadline = new Deadline(this.cartItem.information.deadline);
      if (this.deadline.soon) this.deadline.start();
    }
  }

  showButtons() {
    return !this.locked();
  }

  locked() {
    return this.passed() || this.checkedByKitchen();
  }

  passed() {
    return this.deadline && this.deadline.passed;
  }

  checkedByKitchen() {
    return !!this.cartItem.kitchen_accepted_at || !!this.cartItem.kitchen_rejected_at;
  }

  soon() {
    return this.deadline && this.deadline.soon;
  }

  onAmountChange() {
    this.onItemChange.emit(this.cartItem);
  }

  inc() {
    if (this.locked()) return;
    this.cartItem.inc();
  }

  dec() {
    if (this.locked()) return;
    this.cartItem.dec();
  }

  remove() {
    if (this.locked()) return;
    this.cartItem.remove();
  }
}
