import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from "rxjs";
import { ToastService, ParamsUrlParser } from '../../services';

import { KitchenSubscriptionsApiService } from './kitchen-subscriptions-api.service';


@Injectable()
export class KitchenSubscriptionsService {
  constructor(
    private api: KitchenSubscriptionsApiService,
    private toast: ToastService) {
      this.isEmployee = ParamsUrlParser.isEmployee();
    }
  isEmployee;
  subscriptions;
  private loader;
  private loaded = false;

  load() {
    let observer;
    if (this.loaded) {
      observer = Observable.from([this.subscriptions]);
    } else {
      if (this.loader) {
        observer = this.loader;
      } else {
        observer = this.loadAll();
      }
    }
    return observer;
  }

  private loadAll() {
    let subs = this.api.get(this.isEmployee);
    this.loader = this.handleSubscriptions(subs);
    return this.loader;
  }

  private loadSubscriptions(response) {
    this.subscriptions = response;
    return response;
  }

  private handleSubscriptions(subscriber) {
    return Observable.create((observer) => {
      subscriber.subscribe((response) => {
        let dishes = this.loadSubscriptions(response);
        this.loaded = true;
        observer.next(dishes);
        observer.complete();
        this.loader = null;
      },
      (error) => this.toast.error(error));
    });
  }
}
