import { Injectable } from '@angular/core';
import { DishesService } from './dishes.service';
import { MenuApiService } from './menu-api.service';
import { MenuItem } from './menu-item';
import { ToastService, ParamsUrlParser } from "app/services";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class Menu {
  constructor(
    private dishesData: DishesService,
    private menuApi: MenuApiService,
    private toast: ToastService,
    protected translate: TranslateService
  ) {
    this.initDays();
    this.dishLoading();
    this.isEmployee = ParamsUrlParser.isEmployee();
  }

  items = [];
  days = [];
  date;
  categories;
  loaded = false;
  subscription;
  private schedule;
  isEmployee = false;

  private build() {
    this.initDays();
    if (!this.categories) {
      this.items = [];
      return;
    }
    this.items = _.map(this.categories, this.buildCategory.bind(this));
    this.buildDays();
  }

  private buildCategory(category) {
    return {
      category,
      dishes: this.buildDishes(category)
    };
  }

  private buildDishes(kdc) {
    return _.range(5).map((i) => this.buildDish(kdc, i));
  }

  private buildDish(category, wDay) {
    let schedule = this.schedule[wDay];
    let currentMenuItem = this.findMenuItem(schedule, category.id);
    let menuItem = new MenuItem(category, this.subscription);
    menuItem.date = this.dateWithOffcet(wDay);
    menuItem.passed = schedule.passed;
    if (currentMenuItem) {
      menuItem.menuItem = currentMenuItem;
      let dish = this.findDish(currentMenuItem.dish_id);
      if (dish) menuItem.dish = dish;
    }

    return menuItem;
  }

  private findMenuItem(schedule, categoryId) {
    return _.find(schedule.items, { dish_category_id: categoryId });
  }

  private findDish(id) {
    return _.find(this.dishesData.dishes, { id });
  }

  load(subscription) {
    this.subscription = subscription;
    let observer = this.menuApi.get(this.apiParams, this.isEmployee);
    this.loadMenu(observer);
  }

  get apiParams() {
    return [this.subscription, this.date];
  }

  private loadMenu(observer) {
    this.loaded = false;
    this.items = [];
    observer.subscribe(
      (response) => this.loadCategories(response.categories, response.schedule),
      (error) => this.toast.error(error)
    )
  }

  loadCategories(categories, schedule) {
    this.loaded = true;
    this.categories = this.sortCategories(categories);
    this.schedule = schedule;
    this.build();
  }

  private sortCategories(categories) {
    return _.orderBy(categories, ['name']);
  }

  updateItem(item, dish) {
    item.dish = dish;
    this.menuApi.saveMenuItem(item.toParams(), this.isEmployee).subscribe(
      (response) => {
        this.toast.success(this.translate.instant('TOAST.SUCCESS.MENU_UPDATED'));
        item.menuItem = response;
        this.buildDays();
      },
      (error) => this.toast.error(error)
    );
  }

  private dateWithOffcet(wDay = 0) {
    return this.date.clone().add(wDay, 'days');
  }

  private initDays() {
    this.days = _.map(new Array(5), (e) => false);
  }

  private buildDays() {
    this.initDays();
    for (let i = 0; i < 5; i++) {
      this.days[i] = _.every(this.items, (item) => item.dishes[i].dish);
    }
  }

  randomize() {
    if (!this.subscription || !this.date) return;
    let observer = this.menuApi.random(this.apiParams, this.isEmployee);
    this.loadMenu(observer);
  }

  copyPreviousWeek() {
    if (!this.subscription || !this.date) return;
    let observer = this.menuApi.copy(this.apiParams, this.isEmployee);
    this.loadMenu(observer);
  }

  private dishLoading() {
    this.dishesData.load().subscribe((dishes) => this.build());
  }
}
