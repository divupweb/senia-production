import { Component, ViewChild } from '@angular/core';
import { ToastService, WindowRef, WindowWidth} from "app/services";
import { KitchenSubscriptionsService } from "../../../services";
import {
  DishesService,
  Menu
} from "../shared";
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'weekly-menu',
  styleUrls: ['weekly-menu.scss'],
  templateUrl: './weekly-menu.html',
  providers: [WindowWidth]
})

export class WeeklyMenuComponent {
  constructor(
    private subscriptionsService: KitchenSubscriptionsService,
    private toast: ToastService,
    private dishesService: DishesService,
    public menu: Menu,
    private width: WindowWidth) {
      this.init();
      Observable.fromEvent(WindowRef.nativeWindow, 'resize').
                 debounceTime(1500).
                 subscribe((event) => {
                   if (this.selectedDay && !this.width.isMobile()) {
                     this.selectedDay = null;
                     this.buildDays();
                   } else if (!this.selectedDay && this.width.isMobile()) {
                     this.selectedDay = moment();
                     this.buildDays();
                   }
                 });
    }

  @ViewChild('setMenu') setMenu;
  subscriptions;
  selectedSubscription;
  currentWeek;
  weekDays = [];
  today = moment();
  weekLoaded;
  selectedDay;

  private init() {
    this.setDate()
    this.loadSubscriptions();
    if (this.width.isMobile()) this.selectedDay = moment();
  }

  private loadSubscriptions() {
    this.subscriptionsService.load().subscribe(
      (response) => {
        this.subscriptions = this.subscriptionTypes(response);
        this.selectedSubscription = this.subscriptions.indexOf('lunch') > -1 ? 'lunch' : this.subscriptions[0];
        this.loadWeeklyMenu();
      },
      (error) => this.toast.error(error)
    );
  }

  selectSubscription(subscription) {
    if (this.selectedSubscription == subscription) return;
    this.selectedSubscription = subscription;
    this.onSubscriptionChange();
  }

  private onSubscriptionChange() {
    this.menu.subscription = this.selectedSubscription;
    this.loadWeeklyMenu();
  }

  private subscriptionTypes(response) {
    let types = _(response).filter((e) => e.subscription_type != 'catering' && e.active == true)
      .map((e) => e['subscription_type'])
      .value();
    return types;
  }

  private setDate(date = null) {
    this.currentWeek = date || this.today.startOf('isoweek');
    this.menu.date = this.currentWeek;
  }

  previousWeek() {
    this.changeWeek(-1);
  }

  nextWeek() {
    this.changeWeek(1);
  }

  private changeWeek(value = 1) {
    if (this.width.isMobile()) {
      this.selectedDay = this.selectedDay.clone().add(value, 'd')
      if (!this.selectedDay.isBetween(this.currentWeek, this.currentWeek.clone().add(7, 'd'))) {
        this.setDate(this.selectedDay.clone().startOf('isoweek'));
        this.loadWeeklyMenu();
      } else {
        this.buildDays();
      }
    } else {
      this.setDate(this.currentWeek.clone().add(value, 'w'));
      this.loadWeeklyMenu();
    }
  }

  // Lood weekly menu data
  private loadWeeklyMenu() {
    if (!this.selectSubscription || !this.currentWeek) return;
    this.buildDays();
    this.menu.load(this.selectedSubscription);
  }

  private buildDays() {
    let initWeekDay = (i) => ({
      i,
      day: this.width.isMobile() ? this.selectedDay.clone().add(i, 'days') : this.currentWeek.clone().add(i, 'days'),
      active: false
    });
    this.weekDays = _.range(this.width.isMobile() ? 1 : 5).map((i) => initWeekDay.call(this, i));
  }

  scrolled = false;
  onScroll(event) {
    let target = event.target;
    this.scrolled = target && target.scrollTop > 0;
  }
}
