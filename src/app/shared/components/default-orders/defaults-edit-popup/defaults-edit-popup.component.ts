import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { PeriodicsData, PeriodicOptions } from '../services';

@Component({
  selector: 'defaults-edit-popup',
  styleUrls: ['defaults-edit-popup.scss'],
  templateUrl: './defaults-edit-popup.html'
})

export class DefaultsEditPopupComponent {
  subscriptions = [];
  showPopup = false;
  item: any = {};
  current;
  data = {};
  day;
  changed = false;

  currentOptionsValue = []
  set currentOptions(value) {
    this.currentOptionsValue = value;
    this.sortCurrent();
  }
  get currentOptions() {
    return this.currentOptionsValue;
  }

  @Output() onSave = new EventEmitter();

  constructor(
    private periodicsData: PeriodicsData,
    private periodicOptions: PeriodicOptions) { }

  open(item) {
    this.changed = false;
    setTimeout(() => { this.showPopup = true; }, 100);
    this.build(item);
  }

  private build(item) {
    this.item = item;
    this.day = item.day;
    this.subscriptions = this.periodicsData.activeSubscriptions(this.day);
    this.periodicOptions.load(this.day, this.subscriptions).subscribe(
      (data) => {
        this.fillActive(data);
        this.setSubscription(this.subscriptions[0]);
      }
    );

  }

  close() {
    this.showPopup = false;
    this.item = {};
  }

  save() {
    this.showPopup = false;
    let data = this.saveData();
    this.onSave.emit(data);
  }

  setSubscription(subscription) {
    this.current = subscription;
    this.currentOptions = [];
    if (this.current) this.currentOptions = this.data[subscription];
  }

  private fillActive(data) {
    let day = this.day;
    _.each(data, (kdcs, subscription) => {
      let active = _.find(this.item.subscriptions, { subscription });
      _.each(kdcs, (kdc) => {
        let activeItem = active ? _.find(active.orders, { kitchenDishCategoryId: kdc.id, active: true }) : false;
        kdc.active = !!activeItem;
      })
    });

    this.data = data;
  }

  private saveData() {
    let data = {
      day: this.day,
      subscriptions: {}
    };
    _.each(this.data, (menuItems, subscription) => {
      let items = menuItems.filter((i) => i.active);
      if (items.length > 0) data.subscriptions[subscription] = items;
    });
    return data;
  }

  sortItems = [
    {
      id: 'kitchen',
      name: 'SORT.BY_KITCHEN',
      params: [['kitchen_name'], ['asc']]
    },
    {
      id: 'name',
      name: 'SORT.BY_NAME',
      params: [['dish_category'], ['asc']]
    },
    {
      id: 'priceAsc',
      name: 'SORT.BY_PRICE_ASC',
      params: [[(e) => +e.min_price], ['asc']]
    },
    {
      id: 'priceDesc',
      name: 'SORT.BY_PRICE_DESC',
      params: [[(e) => +e.min_price], ['desc']]
    },
  ];

  activeSort = this.sortItems[0];
  showDropdown = false;
  onSortSelect(item) {
    this.activeSort = item;
    this.showDropdown = false;
    this.sortCurrent();
  }

  openDropdown() {
    setTimeout(() => this.showDropdown = true, 100);
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  private sortCurrent() {
    this.currentOptionsValue = _.orderBy(this.currentOptionsValue, ...this.activeSort.params);
  }

  onChangeData(e) {
    this.changed = true;
  }
}
