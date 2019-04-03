import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NewsItemPopupComponent } from '../news-item-popup.component';

@Component({
  selector: 'kitchen-removed-popup',
  templateUrl: './kitchen-removed-popup.component.html',
  styleUrls: ['./kitchen-removed-popup.component.scss']
})
export class KitchenRemovedPopupComponent extends NewsItemPopupComponent {
  kitchen;
  weekDays;
  ngOnInit() {
    this.kitchen = _.get(this.item, ['information', 'kitchen']);
    let weekDays = moment.weekdaysMin();
    weekDays.push(weekDays.shift());
    this.weekDays = this.item.data.days.map((d) => weekDays[d]).join(', ');
  }
}
