import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import { WeeklyEditPopupComponent } from "../weekly-edit-popup/";
import { MenuFeedApiService, CustomOrdersApiService} from "../../services";
import { HeaderService } from "app/user/header";
import { RatingPopupComponent } from "app/user/menu";

@Component({
  selector: 'weekly-orders-item',
  styleUrls: ['weekly-orders-item.scss'],
  providers: [MenuFeedApiService, CustomOrdersApiService],
  templateUrl: 'weekly-orders-item.html'
})

export class WeeklyOrdersItemComponent {
  @ViewChild('rating')
  public rating: RatingPopupComponent;

  @Input()
  public dayData: any = {};

  public dayOrders: any = {};

  @ViewChild('form')
  public form: WeeklyEditPopupComponent;

  public menuItems: any = {};

  public dayLocked: boolean = false;
  public userLock: boolean = false;
  public dayActive: boolean = true;

  public subscriptions: string[] = [];

  public totalDishes: number = 0;

  public constructor(protected header: HeaderService) {}

  public ngOnChanges(changes): void {
    if (changes['dayData']) this.init();
  }

  public confirmOrders(event: { subscription: string, orders: any[] } ): void {
    this.buildDayOrders(event.subscription, _(event.orders).filter((o) => o.amount > 0).value());
  }

  public unlock(): void {
    this.header.openSuspendPlanner(this.dayData.date);
  }

  protected init(): void {
    _(this.dayData.orders).each((orders: any[], key: string) => {
      this.buildDayOrders(key, orders);
    });
    this.dayActive = this.dayData.active;
    this.dayLocked = _(this.dayData).pick(['user_suspend', 'company_suspend']).values().includes(true);
    this.userLock = _(this.dayData).get('user_suspend', false);
  }

  protected buildDayOrders(subscription: string, orders: any[]): void {
    this.dayOrders[subscription] = [];
    _(orders).each((order) => {
      this.dayOrders[subscription].push({
        displayUrl: order.information.display_url,
        name: order.information.name,
        date: order.date,
        deadline: order.deadline,
        deadlinePassed: order.deadline_passed,
        amount: order.amount,
        kitchenName: order.information.kitchen.name,
        categoryName: order.kitchen_dish_category.dish_category,
        kitchenDishCategoryId: order.kitchen_dish_category_id,
        price: order.information.price,
        rating: order.information.rating
      })
    });
    this.subscriptions = _.keys(this.dayOrders);
    this.calcTotalDishes();
  }

  protected calcTotalDishes() {
    this.totalDishes = 0;
    _(this.dayOrders).each((orders) => {
      this.totalDishes += _(orders).map('amount').sum();
    })
  }
}
