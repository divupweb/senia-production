import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KitchensDayComponent } from './kitchens-day';

@Component({
  selector: 'daily-kitchens',
  styleUrls: ['daily-kitchens.scss'],
  templateUrl: './daily-kitchens.html'
})

export class DailyKitchensComponent {
  @Input() dailyData;
  @Input() kitchens;
  @Output() onUpdate = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  onKitchenAdd(day, e) {
    this.dailyData.addKitchen(day, e.subscription, e.kitchen);
    this.onUpdate.emit([day, e]);
  }

  onKitchenRemove(day, e) {
    this.dailyData.removeKitchen(day, e.subscription, e.kitchen);
    this.onUpdate.emit([day, e]);
  }
}
