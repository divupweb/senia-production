import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Subject } from 'rxjs/Subject';
import { ToastService, ParamsUrlParser } from 'app/services';

import { DishesApiService } from './dishes-api.service';
import { Dish } from './dish';


@Injectable()
export class DishesService {
  private dishesValue = [];
  private sortParams = {
    columns: ['name'],
    order: ['asc']
  };
  private showActiveDishesValue = true;
  get showActiveDishes() {
    return this.showActiveDishesValue;
  }
  dishes = [];
  get activeDishes() {
    return this.filteredDishes(true);
  }
  private dishLoader;
  public isEmployee;


  constructor(
    private dishesApi: DishesApiService,
    private toast: ToastService) {
      this.isEmployee = ParamsUrlParser.isEmployee();
    }

   load(force = false) {
    return force || _.isEmpty(this.dishesValue) ? this.loadAll() : Observable.from([this.dishesValue]);
  }

  private loadAll() {
    let subs = this.dishesApi.getAll(this.isEmployee);
    if (this.dishLoader == null) this.dishLoader = this.handleDishes(subs);
    return this.dishLoader;
  }

  private loadDishes(response) {
    let dishes = Dish.load(response);
    this.dishesValue = dishes;
    this.resort();
    this.updateList();
    return dishes;
  }

  get(id) {
    let dish = _.find(this.dishesValue, { id: +id, detailed: true });
    let observable;
    if (dish) {
      observable = Observable.from([dish]);
    } else {
      let subs = this.dishesApi.get(id, this.isEmployee);
      observable = this.handleDish(subs);
    }
    return observable;
  }

  create(data) {
    let subs = this.dishesApi.create(data, this.isEmployee);
    return this.handleDish(subs, false);
  }

  update(id, data) {
    let subs = this.dishesApi.update(id, data, this.isEmployee);
    return this.handleDish(subs, false);
  }

  deactivate(id) {
    let subs = this.dishesApi.deactivate(id, this.isEmployee);
    return this.handleDish(subs);
  }

  activate(id) {
    let subs = this.dishesApi.activate(id, this.isEmployee);
    return this.handleDish(subs);
  }

  set sort(value) {
    this.sortParams = value;
    this.resort();
  }

  showInactive() {
    this.showActiveDishesValue = false;
    this.updateList();
  }

  showActive() {
    this.showActiveDishesValue = true;
    this.updateList();
  }

  private updateDish(dish) {
    let index = _.findIndex(this.dishesValue, { id: dish.id });
    if (-1 < index) {
      this.dishesValue[index] = dish;
    } else {
      this.dishesValue.push(dish);
    }
    this.updateList();
  }

  private updateList() {
    this.dishesValue = this.dishesValue.slice();
    this.dishes = this.filteredDishes();
  }

  private filteredDishes(active = this.showActiveDishesValue) {
    return _.filter(this.dishesValue, { active });
  }

  private handleDish(subscriber, toastError = true) {
    return Observable.create((observer) => {
      subscriber.subscribe(
        (response) => {
          let dish = new Dish(response);
          dish.detailed = true;
          this.updateDish(dish);
          this.resort();
          observer.next(dish);
        }, (error) => {
          observer.error(error);
          if (toastError) {
            this.toast.error(error)
          }
        }
      )
    });
  }

  private handleDishes(subscriber) {
    let source = new Subject();
    let observer = source.asObservable();

    subscriber.subscribe(
      (response) => {
        this.dishLoader = null;
        let dishes = this.loadDishes(response);
        source.next(dishes);
        source.complete()
      },
      (error) => {
        this.dishLoader = null;
        this.toast.error(error);
        source.error(error);
        source.complete();
      }
    );
    return observer;
  }

  private resort() {
    this.dishesValue = _.orderBy(this.dishesValue, this.sortParams.columns, this.sortParams.order)
  }

  byCategory(category) {
    if (!category) return [];
    return _.filter(this.activeDishes, { dishCategoryId: category.id });
  }
}
