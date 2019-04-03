import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Deadline } from '../deadline';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'cart-total',
  styleUrls: ['cart-total.scss'],
  templateUrl: './cart-total.html'
})

export class CartTotalComponent {
  message;
  deadline;
  empty = true;
  @Input() cart;
  @Input() isCatering = false;
  @Input() default = false;
  @Output() onCateringUpdate = new EventEmitter();

  public constructor(protected translate: TranslateService) {}

  ngOnChanges(changes) {
    if (changes['cart']) this.buildMessage();
  }


  buildMessage() {
    this.message = "";
    this.empty = true;
    if (!this.cart || !this.cart.total) return;
    this.empty = this.cart.total.amount == 0;
    this.readDeadline();
    this.cartMessage();
  }

  cartMessage() {
    var msg;
    if (this.deadline && !this.deadline.empty) {
      if (this.deadline.passed) {
        msg = this.translate.instant('COMPANY.SUBSCRIPTION_IS_LOCKED', { subscription: this.cart.subscription });
      } else {
        msg = this.translate.instant('COMPANY.SUBSCRIPTION_WILL_BE_LOCKED_AT',
          { subscription: this.cart.subscription, time: this.deadline.dueTime });
      }
    } else if (this.default && this.cart.total.amount > 0) {
      msg = this.translate.instant('COMPANY.DEFAULT_WEEKDAYS_SUBSCRIPTION',
        { subscription: this.cart.subscription, weekDay: this.cart.weekday });
    }

    this.message = msg;
  }

  readDeadline() {
    if (this.deadline) this.deadline.stop();
    if (!this.cart.total.deadline) {
      this.deadline = null;
      return;
    }
    this.deadline = new Deadline(this.cart.total.deadline);
    this.deadline.start();
    this.deadline.updates.subscribe(
      (data) => {
        if (this.deadline && this.deadline.passed) this.cartMessage();
      }
    )
  }

  updateCatering() {
    this.onCateringUpdate.emit(true);
  }
}
