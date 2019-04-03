import { ToastService, PushSubscriptions, ObjectLoader } from 'app/services';


export class NotificationsBaseComponent {
  notifications = [];
  protected allLoaded = false;
  protected subscription;


  constructor(
    protected api: any,
    protected toast: ToastService,
    protected pushSubscriptions: PushSubscriptions) { }

  ngOnInit() {
    this.load();
    this.subscribe();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  protected subscribe() {
    this.subscription = this.pushSubscriptions.notifications(
      (data) => {
        let notification = ObjectLoader.toCamelCase(data.notification)
        this.notifications.unshift(notification);
      },
      (error) => this.toast.error(error)
    )
  }

  onScroll() {
    this.loadNotifications();
  }

  protected load() {
    this.notifications = [];
    this.allLoaded = false;
    this.loadNotifications();
  }

  protected notificationsLoader(lenght) {
    return this.api.get(this.notifications.length);
  }

  protected loadNotifications() {
    if (this.allLoaded) return;
    this.notificationsLoader(this.notifications.length).subscribe(
      (data) => {
        if (data.length == 0 ) {
          this.allLoaded = true;
          return;
        }
        this.notifications = this.notifications.concat(data);
      },
      (error) => this.toast.error(error)
    )
  }
}
