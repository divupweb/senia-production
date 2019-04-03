import { Component, Input } from '@angular/core';
import { AbstractPopupComponent } from "app/shared/components/popup";

@Component({
  selector: 'notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss']
})
export class NotificationPopupComponent extends AbstractPopupComponent {
  @Input() item;

  open(item) {
    this.item = item;
    this.show();
  }
}
