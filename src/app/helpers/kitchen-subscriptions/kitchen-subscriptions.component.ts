import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core';


@Component({
  selector: 'kitchen-subscriptions',
  styleUrls: ['kitchen-subscriptions.scss'],
  templateUrl: './kitchen-subscriptions.html',
  encapsulation: ViewEncapsulation.None
})

export class KitchenSubscriptionsComponent {
  constructor() {}

  @Input() subscriptions: string[];
  @Input() selectedSubscription: string;

  @Output() selectSubscription = new EventEmitter();

  ngOnInit() {
    this.setFirstSubscription();
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['subscriptions']) {
      this.setFirstSubscription();
    }
  }

  onSelect(subscription) {
    if (subscription != this.selectedSubscription) {
      this.selectedSubscription = subscription;
      this.sendUpdate();
    }
  }


  private setFirstSubscription() {
    if (this.subscriptions && !this.selectedSubscription) {
      this.selectedSubscription = this.subscriptions[0];
      this.sendUpdate();
    }
  }

  private sendUpdate(){
    this.selectSubscription.emit(this.selectedSubscription)
  }
}
