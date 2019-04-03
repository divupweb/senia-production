import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubsidiesProxyService } from "../proxies";

@Component({
  selector: 'subsidies',
  styleUrls: ['subsidies.scss'],
  templateUrl: './subsidies.html'

})
export class SubsidiesComponent {
  constructor(public subsidiesProxy: SubsidiesProxyService){}
  showSlider = true;
  _items = [];
  @Input()
  get items() {
    return this._items
  }
  set items(items) {
    this._items = _.orderBy(items, (s) => {
      if (s.period != 'daily') { // update slider max value for non-default values on first load
        s.onPeriodChange();
      }
      return s.subscriptionCode;
    });
  }

  @Output() onUpdate = new EventEmitter();
  collapsed = true;
  summary = [];

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  changeValueType(item, i) {
    item.changeValueType(i);
    this.onUpdate.emit(true);
  }

  onPeriodChange(item, event) {
    this.showSlider = false;
    this.onUpdate.emit(event);
    item.onPeriodChange(event);
    setTimeout(() => this.showSlider = true, 50);
  }

  itemChanged(event, item) {
    this.onUpdate.emit(true);
    item.value = event.target.value;
  }
}
