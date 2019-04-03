import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NewsItemPopupComponent } from '../news-item-popup.component';

@Component({
  selector: 'general-suspends-popup',
  styleUrls: ['general-suspends-popup.scss'],
  templateUrl: './general-suspends-popup.html'
})

export class GeneralSuspendsPopupComponent extends NewsItemPopupComponent {
  suspend;
  data;

  ngOnInit() {
    this.suspend = _.get(this.item, ['information', 'suspend']);
    this.data = this.item.data;
  }
}
