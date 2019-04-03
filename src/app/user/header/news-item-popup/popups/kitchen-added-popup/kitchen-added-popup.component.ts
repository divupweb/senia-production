import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NewsItemPopupComponent } from '../news-item-popup.component';

@Component({
  selector: 'kitchen-added-popup',
  templateUrl: './kitchen-added-popup.component.html',
  styleUrls: ['./kitchen-added-popup.component.scss']
})
export class KitchenAddedPopupComponent extends NewsItemPopupComponent {
  kitchen;
  deadlines = [];

  ngOnInit() {
    this.kitchen = _.get(this.item, ['information', 'kitchen']);
    this.loadDeadlines();
  }

  private loadDeadlines() {
    if (this.kitchen.deadlines) {
      this.deadlines = this.kitchen.deadlines.map((dd) => {
        let poz = dd.search(':');
        return [dd.slice(0, poz + 1), dd.slice(poz + 1)];
      })
    }
  }
}
