import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastService } from 'app/services';
import { UserSubscriptionsApi } from 'app/user/services';
import { PeriodicOrdersApiService } from './periodic-orders-api.service';
import { PeriodicOrder } from './periodic-order';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class PeriodicsData {
  data = [];
  days = [];
  subscriptions = ['breakfast', 'lunch', 'dinner'];
  userSubscriptions;
  saveByPopup = false;

  constructor(
    private api: PeriodicOrdersApiService,
    private subscriptionsApi: UserSubscriptionsApi,
    private toast: ToastService,
    protected translate: TranslateService
  ) {
    this.initWeekdays()
  }

  private initWeekdays() {
    let days = moment.weekdays();
    days.push(days.shift());
    this.days = days;
  }

  load() {
    this.loadOrders();
    this.loadUserSubscriptions();
  }

  private loadOrders() {
    this.api.get().subscribe(
      (data) => {
        this.loadOrdersData(data);
        this.setLocked();
      },
      (error) => {
        this.toast.error(error)
      }
    )
  }

  private loadUserSubscriptions() {
    this.subscriptionsApi.get().subscribe(
      (data) => {
        this.userSubscriptions = data.subscriptions;
        this.setLocked();
      },
      (error) => {
        this.toast.error(error)
      }
    )
  }

  private activeUserSubscription(subscription, day) {
    return subscription.active && -1 < subscription.days.indexOf(day);
  }

  private setLocked() {
    _.each(this.data, (byDay) => {
      byDay.locked = !this.dayActive(byDay.day);
    })
  }

  private dayActive(day) {
    return _.some(this.userSubscriptions, (s) => {
      return this.activeUserSubscription(s, day);
    });
  }

  private subscriptionActive(day, subscriptionType) {
    return _.some(this.userSubscriptions, (s) => {
      return s.subscription_type == subscriptionType && this.activeUserSubscription(s, day);
    });
  }


  private loadOrdersData(data) {
    this.initDays();
    _.each(data, (subscriptions, day) => {
      this.loadDataDay(subscriptions, this.data[day]);
    })
  }

  private loadDataDay(subscriptions, byDay) {
    byDay.subscriptions = [];
    _.each(subscriptions, (orders, subscription) => {
      let periodicOrders = PeriodicOrder.load(orders.periodic_orders);
      let bySubscription = this.initSubscription(subscription, periodicOrders);
      byDay.subscriptions.push(bySubscription);
      byDay.count += bySubscription.count;
    })
  }

  private initDays() {
    this.data = [];
    for (let i = 0; i < 5; i++) {
      this.data.push(this.initDay(i))
    }
  }

  private initDay(day) {
    return {
      day: day,
      weekday: this.days[day],
      count: 0,
      locked: false,
      subscriptions: [],
    };
  }

  private initSubscription(i, periodicOrders = []) {
    return {
      i: i,
      subscription: this.subscriptions[i],
      count: periodicOrders.length,
      orders: periodicOrders
    }
  }

  activeSubscriptions(day) {
    let active = [];
    _.each(this.userSubscriptions, (s) => {
      if (this.activeUserSubscription(s, day)) active.push(s.subscription_type);
    })
    return active;
  }

  onPopupClose(event) {
    let byDay = this.data[event.day];
    byDay.count = 0;
    this.setInactive(byDay);
    _.each(event.subscriptions, (kdcs, subscription) => {
      let byDaySubscription = this.byDaySubscription(byDay, subscription);
      let count = this.setActiveOrders(kdcs, byDaySubscription, event.day);
      byDay.count += byDaySubscription.count;
    })

    if (this.saveByPopup) this.saveDay(event.day);
  }


  private saveDay(day) {
    let params = this.updateParams(day);
    this.api.update(day, params).subscribe(
      (data) => {
        this.toast.success(this.translate.instant('TOAST.SUCCESS.PERIODIC_UPDATED'));
        let byDay = this.data[day];
        byDay.count = 0;
        this.loadDataDay(data[day], byDay);
        this.data = this.data.slice();
      },
      (error) => {
        this.toast.error(error);
      }
    )
  }

  private setInactive(byDay) {
    _.each(byDay.subscriptions, (subscription) => {
      subscription.count = 0;
      _.each(subscription.orders, (o) => {
        o.active = false;
      });
    });
  }

  private byDaySubscription(byDay, subscription) {
    let byDaySubscription = _.find(byDay.subscriptions, { subscription });
    if (!byDaySubscription) {
      byDaySubscription = this.initSubscription(this.subscriptions.indexOf(subscription));
      byDay.subscriptions.push(byDaySubscription);
      byDay.subscriptions = _.orderBy(byDay.subscriptions, [(s) => this.subscriptions.indexOf(s.subscription)]);
    }
    return byDaySubscription;
  }

  private setActiveOrders(kdcs, byDaySubscription, day) {
    byDaySubscription.count = 0;
    _.each(kdcs, (kdc) => {
      let order = _.find(byDaySubscription.orders, { kitchenDishCategoryId: kdc.id })
      if (order) {
        order.active = true
        order.amount = 1
      } else {
        order = this.initOrder(kdc, day, byDaySubscription.subscription);
        byDaySubscription.orders.push(order);
      }
      byDaySubscription.count += order.amount;
    })
  }

  private initOrder(kdc, day, subscription) {
    let order = new PeriodicOrder()
    order.kdc = kdc;
    order.day = day;
    order.subscription = subscription;
    return order;
  }

  private updateParams(day = null) {
    let orders = [];
    _.each(this.data, (byDay) => {
      if (byDay.locked || (day != null && byDay.day != day)) return;
      _.each(byDay.subscriptions, (bySubscription) => {
        if (!this.subscriptionActive(byDay.day, bySubscription.subscription)) return;
        _.each(bySubscription.orders, (o) => {
          if (o.active) orders.push(o.params);
        })
      });
    })
    return { categories: orders };
  }

  save() {
    let params = this.updateParams();
    return Observable.create((observer) => {
      this.api.updateAll(params).subscribe(
        (data) => {
          this.toast.success(this.translate.instant('TOAST.SUCCESS.PERIODIC_UPDATED'));
          observer.next(data);
          observer.complete();
        },
        (error) => {
          this.toast.error(error);
          observer.error(error);
          observer.complete();
        }
      )
    })
  }
}
