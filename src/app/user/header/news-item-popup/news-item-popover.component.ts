import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NotificationsService } from 'app/user/services';
import { UrlOpenable } from "app/services";
import { Mixin } from "app/helpers";


@Mixin([UrlOpenable])
@Component({
  selector: 'news-item-popover',
  templateUrl: './news-item-popover.component.html'
})
export class NewsItemPopoverComponent {
  item: any = {};
  show = false;
  public openUrl: (url: string, focus?: boolean) => void;
  private openable = [
    'subsidy',
    'kitchen_suspend',
    'kitchen_added',
    'kitchen_removed',
    'general_suspend'
  ];

  @ViewChild('popupWrap') popupWrap;
  @Output() onClose = new EventEmitter();

  constructor(
    private notifications: NotificationsService) { }

  open(item) {
    this.item = item;

    if (this.needOpenPopup()) {
      setTimeout(() => { this.show = true })
    } else {
      this.close()
    };
    this.notifications.readMessage(item);
    this.openReceipt();
  }

  private openReceipt() {
    let url = _.get(this.item, ['information', 'receipt', 'url']);
    if (url) this.openUrl(url);
  }

  close(event: any = false) {
    if (event) event.stopPropagation();
    this.show = false;
    this.onClose.emit(true);
    return false;
  }

  onClick(event) {
    if (event) {
      event.stopPropagation()
      let contains = this.popupWrap.nativeElement !== event.target && this.popupWrap.nativeElement.contains(event.target);
      if (!contains) this.close(false);
    }
  }

  private needOpenPopup() {
    return -1 < this.openable.indexOf(this.item.kind);
  }
}
