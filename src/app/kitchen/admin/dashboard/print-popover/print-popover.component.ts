import {Component, Input, SimpleChange} from '@angular/core';
import {ToastService} from "app/services";
import {KitchenDashboardApiService} from '../kitchen-dashboard-api.service'
import {Deadline} from "app/company/group-orders/shared/deadline"

@Component({
  selector: 'print-popover',
  styleUrls: ['./print-popover.scss'],
  templateUrl: './print-popover.html'
})
export class PrintPopoverComponent {
  deadline;
  @Input() accountId;
  @Input() printable;
  @Input() isEmployee;
  @Input() subscription;
  @Input() date;
  @Input() dueTime;
  @Input() window;

  constructor(private _service: KitchenDashboardApiService, public toastService: ToastService) {}

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if(changes['dueTime'] && this.dueTime) {
      this.deadline = new Deadline(this.dueTime);
    }
  }

  printList(resource) {
    if (resource == 'both') {
      _.each(['production_lists', 'packaging_lists'], (r, index) => {
        let url = this._service.printUrl(this.isEmployee, this.accountId, this.subscription, this.date, r);
        let w = this.window.open(url, '_blank')
        if (index == 0 && !!w) w.focus()
      })
    } else {
      let url = this._service.printUrl(this.isEmployee, this.accountId, this.subscription, this.date, resource);
      this.window.open(url, '_blank').focus();
    }
  }
}
