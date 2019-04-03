import { Component, Input } from '@angular/core';

@Component({
  selector: 'notification-default',
  templateUrl: './notification-default.component.html',
  styleUrls: ['./notification-default.component.scss']
})
export class NotificationDefaultComponent {
  @Input() item;
}
