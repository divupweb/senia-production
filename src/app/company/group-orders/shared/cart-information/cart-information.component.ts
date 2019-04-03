import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'cart-information',
  templateUrl: './cart-information.component.html',
  styleUrls: ['./cart-information.component.scss']
})
export class CartInformationComponent {
  @Input() disabled = true;
  @Input() cart;
  private initialized = false;
  private oldVal = {};

  ngOnChanges(changes) {
    if (changes['cart']) this.oldVal = this.cart.information;
  }

  onChange(event, field) {
    if (this.oldVal[field] != event) this.cart.onInformationChange(event);
  }
}
