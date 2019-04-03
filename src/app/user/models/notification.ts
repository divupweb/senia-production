import { ObjectLoader } from 'app/services';

export class Notification {
  static load(notifications, items) {
    return items.map((i) => new Notification(notifications, i));
  }

  id;
  isRead = false;
  kind;
  kindId;
  message;
  information = {};
  data = {};
  private iconClasses = [
    'pdf',
    'subsidy',
    'card',
    'kitchen_added',
    'kitchen_removed',
    'charge_failed',
    'charge_success'
  ];

  constructor(private notifications, object) {
    this.load(object);
  }

  get iconClass() {
    let icon = this.kind;
    if (-1 == this.iconClasses.indexOf(this.kind)) {
      icon = this.isRead ? 'fa fa-envelope-open-o' : 'fa fa-envelope-o'
    }
    return icon;
  }

  private load(object) {
    Object.assign(this, ObjectLoader.toCamelCase(object));
  }

  open() {
    this.notifications.openNotification(this);
  }
}
