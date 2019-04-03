import { Component, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { NotificationsService } from 'app/user/services';

@Component({
  selector: 'news-popover',
  templateUrl: './news-popover.html',
  styleUrls: ['news-popover.scss'],
})
export class NewsPopoverComponent {
  show = false;
  private subscription;
  @Output() onPopupOpen = new EventEmitter();
  constructor(private notifications: NotificationsService,
              public el: ElementRef) {
    this.subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private subscribe() {
    this.subscription = this.notifications.onOpen.subscribe(
      (item) => {
        this.onPopupOpen.emit(item);
      }
    )
  }

  open() {
    this.notifications.load();
    setTimeout(() => this.show = true, 50);
  }

  close(event = null) {
    if (!this.show) return;
    this.show = false;
  }

  toggle() {
    if (this.show) {
      this.close();
    } else {
      this.open();
    }
  }

  onScroll(e) {
    this.notifications.loadNext();
  }
}
