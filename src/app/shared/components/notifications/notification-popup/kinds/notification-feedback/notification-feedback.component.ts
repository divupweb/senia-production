import { Component, Input } from '@angular/core';

@Component({
  selector: 'notification-feedback',
  templateUrl: './notification-feedback.component.html',
  styleUrls: ['./notification-feedback.component.scss']
})
export class NotificationFeedbackComponent {
  @Input() item;
}
