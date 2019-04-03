import { Component } from '@angular/core';
import { NotificationsApiService } from './notifications-api.service';
import { ToastService, PushSubscriptions } from 'app/services';
import { NotificationsBaseComponent } from 'app/shared/components/notifications';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [ NotificationsApiService ]
})
export class NotificationsComponent extends NotificationsBaseComponent {
  constructor(
    protected api: NotificationsApiService,
    protected toast: ToastService,
    protected pushSubscriptions: PushSubscriptions) {
    super(api, toast, pushSubscriptions);
  }
}
