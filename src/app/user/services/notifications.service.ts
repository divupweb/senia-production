import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastService, PushSubscriptions } from 'app/services';
import { Notification } from 'app/user/models';

import { NotificationsApiService } from './notifications-api.service';


@Injectable()
export class NotificationsService {
  private allMessages = [];
  private loaded = false;
  private finished = false;
  messages = [];
  count = 0;
  hidden = false;
  unread = 0;
  showHideCount = 0;

  private openSubject = new Subject();
  onOpen = this.openSubject.asObservable();

  newMessageSubscription;

  constructor(
    private api: NotificationsApiService,
    private toast: ToastService,
    private pushSubscriptions: PushSubscriptions) {
    this.preload();
    this.subscribe()
  }

  private preload() {
    this.api.count().subscribe(
      (data) => {
        this.loadCount(data);
      }
    )
  }

  load() {
    if (!this.loaded) this.loadNext()
  }

  loadNext() {
    if (this.finished) return;
    let lastId = this.lastId;
    this.api.get(lastId).subscribe(
      (data) => {
        this.loaded = true;
        this.loadMessages(data.messages);
        this.loadCount(data);
        if (data.messages.length == 0 ) this.finished = true;
        this.updateShowedMessages();
      }
    )
  }

  private loadMessages(messages) {
    Notification.load(this, messages).forEach((n) => this.addNotification(n));
  }

  private addNotification(notification, toEnd = true) {
    let current = _.find(this.allMessages, { id: notification.id});
    if (current)  return;
    if (toEnd) {
      this.allMessages.push(notification);
    } else {
      this.allMessages.unshift(notification);
    }
    this.count += 1;
    if (!notification.isRead) this.unread += 1;
    this.updateShowHideCount();
  }

  private loadCount(data) {
    this.unread = data.unread;
    this.count = data.count;
    this.updateShowHideCount();
  }

  private get lastId() {
    let last = _.last(this.messages);
    return last ? last.id : null;
  }

  private updateShowedMessages() {
    if (this.hidden) { // unread only
      this.messages = this.allMessages.filter((m) => m.isRead != true);
    } else {
      this.messages = this.allMessages.slice();
    }

    this.updateShowHideCount();
  }

  private updateShowHideCount() {
    if (this.hidden) {
      this.showHideCount = this.count;
    } else {
      this.showHideCount = this.count - this.unread;
    }
  }

  readMessage(message) {
    message.isRead = true;
    this.unread -= 1;
    this.updateShowHideCount();
    this.markAsRead([message.id]);
  }

  readAllMessage() {
    if (this.unread == 0) return;
    this.messages.forEach((m) => m.isRead = true);
    this.unread = 0;
    this.updateShowHideCount();
    this.markAsRead();
  }

  private markAsRead(ids = null) {
    this.api.markAsRead(ids).subscribe(
      (data) => {
        this.loadCount(data);
        this.messages.forEach((m) => {
          if (-1 < data.ids.indexOf(m.id)) m.isRead = true;
        })
      },
      (error) => {
        this.toast.error(error);
      }
    )
  }

  toggleView() {
    this.hidden = !this.hidden;
    this.updateShowedMessages();
  }


  private subscribe() {
    this.newMessageSubscription = this.pushSubscriptions.notifications(
      (data) => {
        let notification = new Notification(this, data.notification);
        this.addNotification(notification, false);
        this.updateShowedMessages();
      },
      (error) => {
        this.toast.error(error);
      }
    )
  }

  openNotification(item) {
    this.openSubject.next(item);
  }
}
