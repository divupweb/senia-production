import { Component, Input } from '@angular/core';

@Component({
  selector: 'notification-rating',
  templateUrl: './notification-rating.component.html',
  styleUrls: ['./notification-rating.component.scss']
})

export class NotificationRatingComponet {
  @Input() item;
  information;

  ngOnInit() {
    this.information = _.get(this.item, 'information.item');
  }
}
