import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'subscriptions',
  styleUrls: ['subscriptions.scss'],
  templateUrl: './subscriptions.html'
})

export class SubscriptionsComponent {
  subscriptionsValue;
  @Input()
  get subscriptions() {
    return this.subscriptionsValue;
  }
  set subscriptions(value) {
    this.subscriptionsValue = _.filter(value, { active: true });
  }
  @Input() active;
  @Output() onSelect = new EventEmitter();

  onSubscriptionSelect(item) {
    this.onSelect.emit(item.type);
  }
}
