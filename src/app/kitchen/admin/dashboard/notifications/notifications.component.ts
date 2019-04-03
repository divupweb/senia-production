import { Component, Input } from '@angular/core';
import { NotificationsApiService } from './notifications-api.service';
import { ToastService, PushSubscriptions } from 'app/services';
import { NotificationsBaseComponent } from 'app/shared/components/notifications';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [NotificationsApiService]
})
export class NotificationsComponent extends NotificationsBaseComponent {
  @Input() isEmployee = false;

  constructor(
    protected api: NotificationsApiService,
    protected toast: ToastService,
    protected pushSubscriptions: PushSubscriptions) {
    super(api, toast, pushSubscriptions);
  }

  protected notificationsLoader(length) {
    return this.api.get(this.isEmployee, length)
  }
}
