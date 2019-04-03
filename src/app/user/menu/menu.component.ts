import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { AppStateService, ToastService } from "app/services";
import { CurrencyFormatPipe } from 'app/pipes/currency';
import { HeaderService } from 'app/user/header';
import {
  UserSubscriptionsApi,
  MenuFeedApiService,
  CustomOrdersApiService
} from 'app/user/services';
import { WeekSelectComponent } from "app/user/menu";
import { Subsidy } from "app/user/models";


@Component({
  selector: 'user-menu',
  providers: [
    MenuFeedApiService,
    UserSubscriptionsApi,
    CustomOrdersApiService,
    CurrencyFormatPipe
  ],
  styleUrls: [ '../shared/styles/user-main.scss', 'menu.scss' ],
  templateUrl: './menu.html'
})
export class UserMenuComponent {
  @ViewChild('weekSelect') weekSelect: WeekSelectComponent;

  public subscriptions: any[] = [];
  selectedSubscription: any;
  selectedDay: Date;
  selectedDayName: string;
  formattedDate: string;
  public anySubscriptions: boolean = true;
  public locked: boolean = false;

  kitchens: any[] = [];
  subsidy;
  calculatedSubsidy: any = 0;
  basketQuantity: number = 0;

  menuItems: any = [];
  basketItems: any = [];
  user = {
    active: false,
    canEdit: false
  };

  suspend;

  protected weeklyData: any;

  constructor(private _menuFeedApi: MenuFeedApiService,
              private _customOrdersApi: CustomOrdersApiService,
              private toastService: ToastService,
              private headerService: HeaderService,
              private userSubscriptions: UserSubscriptionsApi,
              private route: ActivatedRoute,
              private router: Router,
              protected state: AppStateService,
              private t: TranslateService,
              private currencyFormat: CurrencyFormatPipe) {
    this.initSubscriptions();
    this.route.queryParams.subscribe(() => {
      this.loadMenuFeed();
    })
  }

  ngOnInit() {
    this.state.preferWeeklyMenu(false);
    this.headerService.setTitleInfo('Menu');
    this.userSubscriptions.get().subscribe((response: any) => {
      this.setSubscription(response.next);
      this.updateRouteParams();
      this.anySubscriptions = true;
      this.loadMenuFeed();
      this.weekSelect.selectDay(this.selectedDay);
    });
  }


  loadMenuFeed() {
    if (!this.selectedSubscription || !this.anySubscriptions) return;
    this._menuFeedApi.get(this.formattedDate, this.selectedSubscription)
      .subscribe(
        (response) => {
          this.basketItems = [];
          this.subsidy = new Subsidy(response.subsidy_instance, this.t, this.currencyFormat);
          this.kitchens = response.kitchens;
          this.buildMenuItems();
          this.updateBasketInfo();
        }, (error) => {
          this.toastService.error(error);
        }
      )
  }

  subscriptionChange($event) {
    this.selectedSubscription = $event;
    this.updateRouteParams();
  }

  dayChange($event) {
    setTimeout(() => {
      this.updateDate($event);
      this.setUpDailySubscriptions(this.formattedDate);
      this.setUpActiveSubscription();
      this.updateRouteParams();
    }, 50)
  }

  buildMenuItems() {
    this.menuItems = [];
    this.basketItems = [];

    _.each(this.kitchens, (kitchen) => {
      _.each(kitchen.categories, (category) => {
        let dishCategory = category.kitchen_dish_category;
        let dish = category.dish;
        let itemPrice = dish ? dish.price : [dishCategory.min_price, dishCategory.max_price];
        let maxPrice = _([itemPrice]).flatten().max();
        let allergies = dish ? dish.allergies : [];
        let userAllergies = _.filter(allergies, 'active');
        const name = dish && dish.name ? dish.name : dishCategory.dish_category;
        let item = {
          id: dishCategory.id,
          name,
          category: dishCategory.dish_category,
          kitchenName: kitchen.kitchen.name,
          chefName: _.get(kitchen, 'kitchen.head_chef_name'),
          displayUrl: category.information.display_url,
          menuUrl: category.information.image_url,
          description: dish && dish.description ? dish.description : dishCategory.description,
          price: itemPrice,
          maxPrice,
          periodic: dishCategory.periodic,
          allergies,
          userAllergies,
          quantity: category.quantity || 0,
          deadlinePassed: kitchen.deadline_passed,
          deadlineDueTime: kitchen.deadline_due_time,
          _category: category,
          rating: category.rating,
          ownKitchen: kitchen.kitchen.own
        };

        this.menuItems.push(item);
        this.basketItems.push({
          id: dishCategory.id,
          name,
          price: maxPrice,
          periodic: dishCategory.periodic,
          quantity: category.quantity,
          deadline: kitchen.deadline_due_time,
          kitchen: kitchen.kitchen,
          displayUrl: dishCategory.display_url,
          category,
          itemPrice
        })
      })
    });

    this.sortMenuItems();
  }

  sortMenuItems() {
    this.menuItems = _.orderBy(this.menuItems,
      [
        (item) => item.quantity > 0 && !item.ownKitchen && item.userAllergies.length  == 0,
        (item) => item.periodic && !item.ownKitchen && item.userAllergies.length  == 0 && item.quantity == 0,
        (item) => !item.ownKitchen && item.userAllergies.length == 0 ? item.maxPrice * 5000 : 0,
        (item) => item.ownKitchen && item.userAllergies.length == 0,
        (item) => !item.ownKitchen ? item.userAllergies.length : 0],
      ['desc', 'desc', 'desc', 'desc', 'asc']);
  }

  updateBasketInfo() {
    this.basketQuantity = 0;
    this.changeTotalQuantitySubsidy();
    this.setBasketInfo();
  }

  changeBasket(event) {
    this.changeBasketItem(event);
    this.setBasketInfo();
  }

  setBasketInfo() {
    let total = _.reduce(this.basketItems, (sum, item) => sum + item.price * item.quantity, 0);

    total = this.subsidy.calculate(total);
    let basket = {
      subscription: this.selectedSubscription,
      subsidy: this.subsidy,
      quantity: this.basketQuantity,
      items: this.basketItems.slice(),
      day: moment(this.selectedDay).toDate(),
      total: total
    };

    this.headerService.setBasketInfo(basket);
  }

  public onWeeklyUpdate(weeklyData: any): void {
    this.setWeeklyData(weeklyData);
    this.setUpDailySubscriptions(this.formattedDate);
    this.setUpActiveSubscription();
  }

  public hasWeeklyData(): boolean {
    return !!_(this.weeklyData).find({ date: this.formattedDate });
  }

  // item changed from the cart
  public onItemChange(basketItem: any): void {
    const menuItem = _.find(this.menuItems, { id: basketItem.id });
    _.merge(menuItem, _.pick(basketItem, 'quantity'));
    this.setBasketInfo();
    this.createOrUpdate({ menuItem });
  }

  public createOrUpdate($event: { menuItem: any, callback?: () => void }): void {
    this._customOrdersApi.createOrUpdate(this.selectedSubscription, this.formattedDate, $event.menuItem.id, $event.menuItem.quantity)
      .subscribe(
        () => {
          const event = {
            id: $event.menuItem.id,
            quantity: $event.menuItem.quantity,
            price: $event.menuItem.maxPrice,
            category: $event.menuItem._category,
            itemPrice: $event.menuItem.price
          };
          _.attempt($event.callback);
          this.changeBasket(event);
        }, (error) => this.toastService.error(error))
  }

  public unlock(): void {
    this.headerService.openSuspendPlanner(this.formattedDate);
  }

  protected setUpDailySubscriptions(date: string): void {
    const selectedDay = _(this.weeklyData).find({ date });
    this.suspend = _.get(selectedDay, 'general_suspend');
    this.locked = _.get(selectedDay, 'user_suspend', false) ||
                  !!this.suspend;

    _(this.subscriptions).each((s) => {
      s.active = _.includes(_.get(selectedDay, 'active_subscriptions', []), s.type);
      s.amount = _.get(selectedDay, [s.type, 'amount'], 0);
      s.custom = _.get(selectedDay, [s.type, 'custom'], false);
      s.periodic = _.get(selectedDay, [s.type, 'periodic'], false);
    });
    this.subscriptions = _.cloneDeep(this.subscriptions);
  }

  protected setUpActiveSubscription(): void {
    const activeSubscriptions = _.filter(this.subscriptions, { active: true });
    this.anySubscriptions = !_.isEmpty(activeSubscriptions) && !_.isEmpty(this.subscriptions);
    if (!this.anySubscriptions) return;
    if (!_.find(activeSubscriptions, { type: this.selectedSubscription})) {
      this.selectedSubscription = _.first(activeSubscriptions).type;
    }
  }

  private changeBasketItem(item) {
    this.changeBasketItemQuantity(item);
    this.changeTotalQuantitySubsidy();
  }

  private changeTotalQuantitySubsidy() {
    this.basketQuantity = _(this.basketItems).map('quantity').sum();
  }

  private changeBasketItemQuantity(item) {
    let e = _.find(this.basketItems, { id: item.id });
    const quantity = _.get(item, 'quantity');
    this.updateDayInfo(e, item);
    _.merge(e, { quantity });
  }

  private updateDate(date) {
    this.selectedDay = date;
    this.formattedDate = moment(date).format("YYYY-MM-DD");
    this.selectedDayName = moment(date).format('dddd');
  }

  private updateRouteParams() {
    if (this.selectedSubscription) {
      this.router.navigate([], {
          queryParams: {
            date: this.formattedDate,
            subscription: this.selectedSubscription
          },
          relativeTo: this.route
      });
    }
  }

  private setSelected(params) {
    this.updateDate(moment(params.date).toDate());
    let current = params.subscription;
    let keys = _.map(this.subscriptions, 'type');
    if (_.includes(keys, current)) {
      this.selectedSubscription = current;
    }
  }

  private setSubscription(next) {
    let savedParams = this.getRouteParams(this.route.snapshot.queryParams);
    if (!(savedParams.date && savedParams.subscription)) {
      this.setSelected(next);
    } else {
      this.setSelected(savedParams);
    }
  }

  private getRouteParams(params) {
    return _.pick(params, ['date', 'subscription']);
  }

  protected  initSubscriptions(): void {
    this.subscriptions = [{
      type: 'breakfast',
      periodic: false,
      custom: false,
      amount: 0,
      active: false
    }, {
      type: 'lunch',
      periodic: false,
      custom: false,
      amount: 0,
      active: false
    }, {
      type: 'dinner',
      periodic: false,
      custom: true,
      amount: 0,
      active: false
    }];
  }

  protected setWeeklyData(weeklyData): void {
    this.weeklyData = _(weeklyData).map((day) => {
      const subscriptions = _.map(this.subscriptions, 'type');
      _(subscriptions).each((s) => {
        const custom = _(day.orders[s]).some({ information: { type: 'CustomOrder' } }) ;
        day[s] = {
          amount: _(day.orders[s]).filter((o) => o.amount > 0).size(),
          custom,
          periodic: !custom && _.size(day.orders[s]) > 0
        };
      });
      return day;
    }).value();
  }

  protected updateDayInfo(oldItem: any, newItem: { periodic: boolean, quantity: number }): void {
    const selectedDay = _.find(this.weeklyData, { date: this.formattedDate });
    const data = _.get(selectedDay, this.selectedSubscription);
    if (data) {
      if (newItem.quantity > 0) {
        if (newItem.periodic && !data.custom && newItem.quantity == 1) {
          data.periodic = true;
        } else {
          data.custom = true;
          data.periodic = !data.custom;
        }
        if (oldItem.quantity == 0) {
          data.amount++;
        }
      }
      if (oldItem.quantity > 0 && newItem.quantity == 0) {
        data.amount--;
        if (data.amount <= 0) {
          data.custom = data.periodic = false;
        }
      }
      this.weekSelect.updateDayInfo(this.formattedDate, this.selectedSubscription, data);
      this.setUpDailySubscriptions(this.formattedDate);
    }
  }
}
