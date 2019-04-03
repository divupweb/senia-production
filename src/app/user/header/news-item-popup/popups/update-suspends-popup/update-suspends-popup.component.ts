import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NewsItemPopupComponent } from '../news-item-popup.component';

@Component({
  selector: 'update-suspends-popup',
  styleUrls: ['update-suspends-popup.scss'],
  templateUrl: './update-suspends-popup.html'
})

export class UpdateSuspendsPopupComponent extends NewsItemPopupComponent {
  kitchen;
  notification;

  ngOnInit() {
    this.kitchen      = _.get(this.item, ['information', 'kitchen']);
    this.notification = _.get(this.item, ['information', 'notification']);
  }

}
