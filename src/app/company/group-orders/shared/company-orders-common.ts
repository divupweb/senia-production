import { ViewChild } from '@angular/core';
import { ToastService, AppStateService } from "../../../services";
import { MenuApiService, Menu } from '../../shared';
import {
  CustomOrdersApiService,
  PeriodicOrdersApiService,
  CateringOrdersApiService
 } from '../shared';
import { Kitchen } from './kitchen';
import { Cart } from './models';
const CATERING = 'catering';

export class CompanyOrdersCommon {
  selectedDay;
  subscriptions;
  selectedKitchen;
  allKitchens: any = {};
  activeSubscription;
  dateColumnName = 'date';

  kitchens = [];
  favorites = [];
  menu = [];
  cart: any = {};
  calendarInfo = {};
  isCatering = false;
  anyCatering = false;
  cateringInformation;

  constructor(
    public toast: ToastService,
    public menuApi: MenuApiService,
    public ordersApi,
    public cateringApi: CateringOrdersApiService,
    public state: AppStateService) {
    this.initSubscriptions();
  }

  initSubscriptions() {
    this.subscriptions = [{
      type: 'breakfast',
      periodic: true,
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

  clearMenu() {
    this.menu.length = 0;
  }

  clearKitchens() {
    this.kitchens.length = 0;
  }

  mergeCalendarInfo(data) {
    this.calendarInfo = Object.assign({}, this.calendarInfo, data);
    this.buildSubscriptionsInformation();
  }

  buildSubscriptionsInformation() {
    var date = this.dateFormatted();
    var selectedData = this.calendarInfo[date];

    var setSubscription = (s) => {
      var amount = 0;
      var kind = -1;
      if (selectedData) {
        var order = _.find(selectedData.orders, { type: s.type })
        if (order) {
          amount = order['amount'];
          kind = order['kind'];
        }
      }

      s.amount = amount;
      s.periodic = kind == 1;
      s.custom = kind == 2;
    };

    this.subscriptions.forEach((s) => {
      setSubscription.call(this, s);
    });
    this.subscriptions = this.subscriptions.slice(); // ngOnChanges array detection
  }


  dateFormatted() {
    return this.selectedDay.format('YYYY-MM-DD');
  }

  // default loader subscribers
  kitchenLoader() {
    return this.menuApi.kitchens(this.dateFormatted());
  }

  menuLoader(kitchen = null) {
    return this.menuApi.menu(this.activeSubscription, kitchen.id, this.dateFormatted())
  }

  cartLoader() {
    return this.menuApi.cart(this.activeSubscription, this.dateFormatted())
  }

  calendarLoader(days) {
    return this.ordersApi.calendar(days)
  }


  setKitchens() {
    this.kitchens = [];
    if (!this.activeSubscription) return;
    let kitchens = this.allKitchens[this.activeSubscription];
    this.kitchens = Kitchen.load(kitchens, this.activeSubscription);
  }

  selectFirstKitchen() {
    if (this.kitchens.length > 0) {
      (this as any).kitchenCarousel.setActive(this.findKitchen());
    }
  }

  findKitchen() {
    let kitchen;

    if (this.selectedKitchen) {
      let selected = this.selectedKitchen;
      this.kitchens.some((e) => {
        if (e.id == selected.id) {
          kitchen = e;
          return true;
        }
        return false;
      })
    } else {
      this.kitchens.some((e) => {
        let deadline = moment(e.deadline);
        if (deadline.isAfter()) {
          kitchen = e;
          return true;
        }
      });
    }
    return kitchen;
  }

  fillActiveSubscriptions() {
    let weekDay = this.isoWeekday();

    let checkCateringWeekendActiveState = (s, day) => {
      if (s.type == CATERING) return;
      s.active = s.active && day >= 1 && day <= 5;
    }

    var setActiveState = (s, day) => {
      var kitchens = this.allKitchens[s.type];
      s.active = kitchens && kitchens.length > 0;
      checkCateringWeekendActiveState(s, day)
    };



    this.subscriptions.forEach((s) => {
      setActiveState.call(this, s, weekDay);
    });
    this.subscriptions = this.subscriptions.slice(); // ngOnChanges array detection
    this.anyCatering = this.subscriptions.some((s) => s.type == CATERING && s.active == true);
  }

  selectSubscription() {
    var changed = false;
    if (this.activeSubscription) {
      let item = _.find(this.subscriptions, { active: true, type: this.activeSubscription })
      if (!item) {
        this.activeSubscription = null;
        changed = true;
      }
    }

    if (!this.activeSubscription) {
      let item = _.find(this.subscriptions, { active: true })
      if (item) {
        this.activeSubscription = item['type'];
        changed = true;
      }
    }
    this.checkSubscription();

    return changed;
  }

  setSelectedDay(e) {
    this.selectedDay = e;
  }

  readDeadline() {
    return;
  }

  // events
  onDaySelect(e) {
    this.setSelectedDay(e);
    this.buildSubscriptionsInformation();
    this.loadKitchens();
    this.loadCart();
  }

  onSubscriptionSelect(type) {
    if (this.activeSubscription == type) return;
    this.activeSubscription = type;
    this.checkSubscription();
    this.setKitchens();
    this.loadCart();
    this.selectFirstKitchen();
  }

  onKitchenSelect(item) {
    this.selectedKitchen = item;
    if (!item) return;
    this.loadMenu(item);
    this.readDeadline();
  }

  // loaders
  loadMenu(kitchen) {
    this.clearMenu();
    if (!kitchen) return;
    this.menuLoader(kitchen).subscribe(
      (data) => {
        this.menu = Menu.load(data);
      },
      (error) => {
        this.toast.error(error)
      }
    )
  }

  loadCart() {
    if (!this.activeSubscription) return;

    this.cartLoader().subscribe(
      (data) => {
        this.initCart(data.cart);
      },
      (error) => {
        this.toast.error(error)
      }
    )
  }

  loadCalendarInfo(param = null) {
    this.calendarLoader(param).subscribe(
      (data) => {
        this.mergeCalendarInfo(data.calendar);
      },
      (error) => {
        this.toast.error(error);
      }
    )
  }


  loadKitchens() {
    this.clearKitchens();
    this.clearMenu();

    this.kitchenLoader().subscribe(
      (data) => {
        this.allKitchens = data.kitchens;
        this.favorites = data.favorites;
        this.fillActiveSubscriptions();
        if (this.selectSubscription()) {
          this.loadCart();
        }
        this.setKitchens();
        this.selectFirstKitchen();
      },
      (error) => {
        this.toast.error(error);
      }
    )
  }

  // cart events
  onMenuAddToCard(item) {
    this.updateCartItem(item, item.amount, item.order_id);
  }

  protected initCart(data) {
    let company = this.state.currentCompany();
    let date = this.dateFormatted();
    this.cart = new Cart(data, this.isCatering, date, company);
    this.cart.onChange.subscribe(
      (item) => this.updateCartItem(item, item.amount)
    )

    this.cart.onRemove.subscribe(
      (item) => this.updateCartItem(item, 0)
    )
  }

  // cart item update
  customParams(kdcId, amount, orderId = null) {
    var params = {
      subscription: this.activeSubscription,
      kitchen_dish_category_id: kdcId,
      amount: amount
    };
    params[this.dateColumnName] = this.dateFormatted();

    if (orderId !== null) params['id'] = orderId;
    return params;
  }

  private kdcId(item) {
    let kdcId;
    if (item.hasOwnProperty('kdc_id')) {
      kdcId = item.kdc_id;
    } else {
      kdcId = item.information.kdc_id;
    }
    return kdcId;
  }

  private updateCartItem(...args) {
    let method = 'updateCustomCartItem'
    if (this.isCatering) method = 'updateCateringCartItem';
    this[method](...args);
  }

  private updateCateringCartItem(item, amount, orderId = null) {
    this.updateMenuItem({ dish_id: item.dish_id }, amount);
  }

  private cateringParams(item, amount) {
    var params = {
      quantity: amount,
      dish_id: item.dish_id
    };
    params[this.dateColumnName] = this.dateFormatted();
    return params;
  }

  private updateCustomCartItem(item, amount, orderId = null) {
    let kdcId = this.kdcId(item);
    var params = this.customParams(kdcId, amount, orderId);
    this.ordersApi.put(params).subscribe(
      (data) => {
        this.initCart(data.cart);
        this.mergeCalendarInfo(data.calendar);
        this.updateMenuItem({ kdc_id: kdcId }, amount);
      },
      (error) => {
        this.toast.error(error);
      }
    )
  }

  private updateMenuItem(search, amount) {
    let item = _.find(this.menu, search);
    if (item) {
      item.amount = amount;
      item.checkAddedStatus();
    }
  }

  private checkSubscription() {
    this.isCatering = this.activeSubscription == CATERING;
  }

  protected isoWeekday() {
    return this.selectedDay.isoWeekday();
  }
}
