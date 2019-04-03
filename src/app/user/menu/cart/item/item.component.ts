import { Component, Input } from '@angular/core';
import { CartItemComponent } from "app/company/group-orders/shared/cart/cart-item/cart-item.component";
import { Deadline } from "app/company/group-orders/shared/deadline";

@Component({
  selector: 'cart-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent extends CartItemComponent {

  @Input()
  public allowRemove: boolean = true;
  public timeout;

  protected delay: number = 500;


  public inc(): void {
    if (this.locked()) return;
    this.cartItem.quantity += 1;
    this.onAmountChange();
  }

  public dec(): void {
    if (this.locked()) return;
    if (this.cartItem.quantity <= 0) return;
    this.cartItem.quantity -= 1;
    this.onAmountChange();
  }
  public remove(): boolean {
    if (this.locked()) return;
    this.cartItem.quantity = 0;
    this.onAmountChange();
    return true;
  }

  public onAmountChange(): void {
    const fn = () => this.onItemChange.emit(this.cartItem);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(fn, this.delay);
  }

  public readDeadline() {
    if (this.deadline) this.deadline.stop();
    if (!this.cartItem) return;
    this.deadline = null;
    if (this.cartItem && this.cartItem.deadline) {
      this.deadline = new Deadline(this.cartItem.deadline);
      if (this.deadline.soon) this.deadline.start();
    }
  }

}
