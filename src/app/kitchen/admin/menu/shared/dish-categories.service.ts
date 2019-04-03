import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from "rxjs";
import { ToastService } from '../../../../services';

import { DishCategoriesApiService } from '../../../services';



@Injectable()
export class DishCategoriesService {
  categories = [];

  constructor(
    private api: DishCategoriesApiService,
    private toast: ToastService) { }

  load() {
    return _.isEmpty(this.categories) ? this.loadAll() : Observable.from([this.categories]);
  }

  private loadAll() {
    let subs = this.api.getList();
    return this.handleCategories(subs);
  }

  private loadCategories(response) {
    this.categories = response;
    return response;
  }

  private handleCategories(subscriber) {
    return Observable.create((observer) => {
      subscriber.subscribe(
        (response) => {
          let categories = this.loadCategories(response);
          observer.next(categories);
        },
        (error) => this.toast.error(error)
      );
    });
  }
}
