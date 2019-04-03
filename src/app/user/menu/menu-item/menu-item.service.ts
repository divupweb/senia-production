import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class MenuItemService {
  public paymentRequested$ = new EventEmitter();

  emitPaymentRequest() {
    this.paymentRequested$.emit();
  }
}
